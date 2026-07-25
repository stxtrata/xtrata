import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { MAX_SINGLE_TX_BYTES } from '@xtrata/collections-client';
import { useToasts } from '../../../shell/ToastContext';
import { useStudio, useStudioState } from '../useStudioStore';
import { makeStudioFile, type StudioFile } from '../store';

/**
 * File import + deterministic ordering.
 *
 * Order in this list IS the collection index assignment, so it is explicit and
 * editable: natural sort ("img2" before "img10") is the default because it is
 * what people mean by "in order", and manual reordering is always available.
 */

const guessMime = (name: string): string => {
  const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  const table: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    html: 'text/html',
    txt: 'text/plain',
    json: 'application/json',
    js: 'text/javascript',
    css: 'text/css',
    wasm: 'application/wasm',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    pdf: 'application/pdf'
  };
  return table[ext] ?? 'application/octet-stream';
};

const readFile = async (file: File): Promise<StudioFile> => {
  const buffer = await file.arrayBuffer();
  return makeStudioFile({
    name: (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name,
    bytes: new Uint8Array(buffer),
    mimeType: file.type && file.type.includes('/') ? file.type : guessMime(file.name)
  });
};

export const ImportStep = (): JSX.Element => {
  const store = useStudio();
  const state = useStudioState();
  const { notify, notifyError } = useToasts();
  const [over, setOver] = useState(false);
  const [sharedKey, setSharedKey] = useState('');
  const [sharedValue, setSharedValue] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const dirInput = useRef<HTMLInputElement>(null);

  const ingest = useCallback(
    async (list: FileList | null) => {
      if (!list || list.length === 0) return;
      try {
        const files = await Promise.all(Array.from(list).map(readFile));
        store.addFiles(files);
        store.sortNatural();
        notify({ kind: 'info', title: `${files.length} file(s) imported`, body: 'Sorted naturally by name.' });
      } catch (error) {
        notifyError(error, 'File import');
      }
    },
    [notify, notifyError, store]
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setOver(false);
      void ingest(event.dataTransfer.files);
    },
    [ingest]
  );

  const onPick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      void ingest(event.target.files);
      event.target.value = '';
    },
    [ingest]
  );

  const duplicates = state.files.length > 0 ? store.detectDuplicates() : { groups: [] };

  const onBuildManifest = useCallback(() => {
    try {
      const manifest = store.buildManifest();
      notify({
        kind: 'success',
        title: 'Manifest built',
        body: `${manifest.items.length} items · checksum ${manifest.checksum.slice(0, 16)}…`
      });
      store.setStep('plan');
    } catch (error) {
      notifyError(error, 'Manifest');
    }
  }, [notify, notifyError, store]);

  return (
    <div>
      <section className="card">
        <h2>Import files</h2>
        <div
          className={`dropzone${over ? ' dropzone--over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
          role="group"
          aria-label="Drop files here"
        >
          <p>Drop files or a folder here.</p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
              Choose files
            </button>
            <button type="button" className="btn" onClick={() => dirInput.current?.click()}>
              Choose a folder
            </button>
          </div>
          <input
            ref={fileInput}
            type="file"
            multiple
            className="visually-hidden"
            onChange={onPick}
            aria-label="Choose files"
          />
          <input
            ref={dirInput}
            type="file"
            multiple
            className="visually-hidden"
            onChange={onPick}
            aria-label="Choose a folder"
            // Directory picking is a non-standard attribute; React passes it through.
            {...({ webkitdirectory: '', directory: '' } as Record<string, string>)}
          />
        </div>
      </section>

      {duplicates.groups.length > 0 ? (
        <div className="banner banner--warn" role="alert">
          <div>
            <strong>Duplicate content detected.</strong>
            <p>
              The collection contract rejects a second reservation of the same content hash, so
              these cannot all be minted here.
            </p>
            <ul>
              {duplicates.groups.map((group) => (
                <li key={group.sha256Hex} className="mono">
                  {group.fileNames.join(' = ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <section className="card">
        <div className="row spread">
          <h2>Order &amp; metadata ({state.files.length} files)</h2>
          <div className="row">
            <button type="button" className="btn btn--sm" onClick={() => store.sortNatural()}>
              Sort naturally
            </button>
            <button
              type="button"
              className="btn btn--sm btn--danger"
              onClick={() => store.clearFiles()}
              disabled={state.files.length === 0}
            >
              Clear
            </button>
          </div>
        </div>

        <fieldset>
          <legend>Shared metadata (applied to every item)</legend>
          <div className="row">
            <input
              type="text"
              aria-label="Shared metadata key"
              placeholder="key"
              value={sharedKey}
              onChange={(e) => setSharedKey(e.target.value)}
              style={{ maxWidth: '200px' }}
            />
            <input
              type="text"
              aria-label="Shared metadata value"
              placeholder="value"
              value={sharedValue}
              onChange={(e) => setSharedValue(e.target.value)}
              style={{ maxWidth: '280px' }}
            />
            <button
              type="button"
              className="btn btn--sm"
              disabled={sharedKey.trim() === ''}
              onClick={() => {
                store.setSharedMetadata({ ...state.sharedMetadata, [sharedKey.trim()]: sharedValue });
                setSharedKey('');
                setSharedValue('');
              }}
            >
              Add
            </button>
          </div>
          <div className="row" style={{ marginTop: '8px' }}>
            {Object.entries(state.sharedMetadata).map(([key, value]) => (
              <span className="badge" key={key}>
                {key}={value}
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  aria-label={`Remove shared metadata ${key}`}
                  onClick={() => {
                    const next = { ...state.sharedMetadata };
                    delete next[key];
                    store.setSharedMetadata(next);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </fieldset>

        <div className="table-scroll">
          <table>
            <caption className="visually-hidden">Imported files in collection order</caption>
            <thead>
              <tr>
                <th>Index</th>
                <th>File</th>
                <th>Size</th>
                <th>Mode</th>
                <th>Item URI</th>
                <th>Order</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {state.files.map((file, index) => (
                <tr key={file.id}>
                  <td className="mono">{index}</td>
                  <td>{file.name}</td>
                  <td className="mono">{file.bytes.length.toLocaleString()}</td>
                  <td>
                    <span className="badge">
                      {file.bytes.length <= MAX_SINGLE_TX_BYTES ? 'single-tx' : 'staged'}
                    </span>
                  </td>
                  <td>
                    <input
                      type="text"
                      aria-label={`Item URI for ${file.name}`}
                      value={file.itemUri ?? ''}
                      maxLength={256}
                      onChange={(e) => store.setFileField(file.id, { itemUri: e.target.value })}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--sm"
                      aria-label={`Move ${file.name} up`}
                      disabled={index === 0}
                      onClick={() => store.moveFile(file.id, -1)}
                    >
                      ↑
                    </button>{' '}
                    <button
                      type="button"
                      className="btn btn--sm"
                      aria-label={`Move ${file.name} down`}
                      disabled={index === state.files.length - 1}
                      onClick={() => store.moveFile(file.id, 1)}
                    >
                      ↓
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--sm btn--danger"
                      aria-label={`Remove ${file.name}`}
                      onClick={() => store.removeFile(file.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Duplicate policy</h2>
        <div className="field">
          <label htmlFor="dup-policy">When two files have identical content</label>
          <select
            id="dup-policy"
            value={state.duplicatePolicy}
            onChange={(e) =>
              store.setDuplicatePolicy(e.target.value as typeof state.duplicatePolicy)
            }
          >
            <option value="reject">Reject — stop and let me fix it (default)</option>
            <option value="dedupe">Keep the first, drop the rest</option>
            <option value="allow">Allow (the contract will still reject the second)</option>
          </select>
        </div>
      </section>

      <div className="row spread">
        <button type="button" className="btn" onClick={() => store.setStep('setup')}>
          Back
        </button>
        <button
          type="button"
          className="btn btn--primary"
          disabled={state.files.length === 0}
          onClick={onBuildManifest}
        >
          Build manifest &amp; review plan
        </button>
      </div>
    </div>
  );
};
