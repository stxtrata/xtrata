import { prepareLegacyImport } from './legacy-bridge/index.js';
import { DOCUMENT_HARD_LIMITS } from './legacy-bridge/read-document.js';
import { prepareProject, importProjectAsync } from './persistence.js';
import { prepareImportedAudio, commitImportedAudio } from './legacy-import-audio.js';

let active;
const element = (tag, text) => {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  return node;
};
export async function openProjectFile(file, { guard = () => true, onStatus = () => {} } = {}) {
  active?.abort();
  const controller = new AbortController();
  active = controller;
  const options = { signal: controller.signal, filename: file.name, limits: DOCUMENT_HARD_LIMITS };
  let prepared;
  try {
    prepared = await prepareLegacyImport(file, options);
  } catch (error) {
    if (active === controller) active = null;
    throw error;
  }
  if (!guard()) {
    controller.abort();
    if (active === controller) active = null;
    throw new Error(
      'The project changed while the file was opening. Your current work was retained.'
    );
  }
  if (prepared.kind === 'native') {
    try {
      await importProjectAsync(prepared.document, { guard, signal: controller.signal });
      return true;
    } finally {
      if (active === controller) active = null;
    }
  }
  return new Promise((resolve, reject) => {
    const dialog = element('dialog');
    dialog.className = 'pro-dialog legacy-import-dialog';
    dialog.id = 'legacy-import-dialog';
    dialog.setAttribute('aria-labelledby', 'legacy-import-title');
    const heading = element('h2', 'Open an older Audional song');
    heading.id = 'legacy-import-title';
    const intro = element(
      'p',
      'Review the playback version and sounds before opening. Your current project stays open until this song is ready.'
    );
    const label = element('label', 'Historical player '),
      select = element('select');
    select.setAttribute('aria-label', 'Historical player');
    label.append(select);
    const description = element('p'),
      summary = element('p'),
      details = element('details'),
      report = element('pre');
    const companionLabel = element('label', 'Matching pattern dictionary '),
      companionInput = element('input');
    companionInput.type = 'file';
    companionInput.accept = '.json,.gz,application/json,application/gzip';
    companionInput.setAttribute('aria-label', 'Matching pattern dictionary');
    companionLabel.append(companionInput);
    details.append(element('summary', 'Import details'), report);
    const status = element('p');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const failures = element('ul'),
      actions = element('div');
    actions.className = 'modal-actions';
    const cancel = element('button', 'Cancel'),
      open = element('button', 'Check sounds and open'),
      missing = element('button', 'Open with missing samples');
    missing.hidden = true;
    open.id = 'legacy-import-open';
    missing.id = 'legacy-import-missing';
    const saveReport = element('button', 'Download import report');
    actions.append(saveReport, cancel, missing, open);
    dialog.append(
      heading,
      intro,
      label,
      description,
      companionLabel,
      summary,
      details,
      status,
      failures,
      actions
    );
    document.body.append(dialog);
    let staged = null,
      busy = false,
      closed = false,
      generation = 0,
      companion = null;
    function finish(value, error) {
      if (closed) return;
      closed = true;
      controller.abort();
      dialog.close();
      dialog.remove();
      if (active === controller) active = null;
      error ? reject(error) : resolve(value);
    }
    function show() {
      select.replaceChildren();
      if (prepared.requiresProfileChoice)
        select.append(new Option('Choose the player this song used…', ''));
      for (const choice of prepared.profileChoices || [])
        select.append(new Option(choice.label, choice.id));
      const profileId = prepared.project?.legacyImport?.profileId || prepared.report?.profileId;
      if (profileId) select.value = profileId;
      label.hidden = !select.options.length;
      description.textContent =
        (prepared.profileChoices || []).find((item) => item.id === select.value)?.description ||
        'This file does not identify its playback rules. Choose the editor or standalone player it was intended for.';
      const project = prepared.project;
      if (project) {
        const hits = project.sequences.reduce(
          (sum, seq) => sum + seq.steps.reduce((n, row) => n + row.filter(Boolean).length, 0),
          0
        );
        summary.textContent = `${project.projectName} · ${project.bpm} BPM · ${project.channels.length} channels · ${project.sequences.length} patterns · ${hits} playable steps`;
      } else
        summary.textContent =
          prepared.report.issues?.find((issue) => issue.severity === 'error')?.message ||
          'A playback choice is needed before the song can be converted.';
      report.textContent = JSON.stringify(prepared.report, null, 2);
      open.disabled = busy || !project || prepared.requiresProfileChoice;
      select.disabled = busy;
      companionLabel.hidden =
        !companion && !prepared.report.issues?.some((issue) => issue.code === 'MISSING_COMPANION');
      companionInput.disabled = busy;
    }
    async function updateSelection() {
      const current = ++generation;
      staged = null;
      missing.hidden = true;
      failures.replaceChildren();
      if (!select.value) {
        open.disabled = true;
        return;
      }
      busy = true;
      open.disabled = true;
      select.disabled = true;
      companionInput.disabled = true;
      status.textContent = 'Checking the selected playback version…';
      try {
        const next = await prepareLegacyImport(file, {
          ...options,
          profileId: select.value,
          companion
        });
        if (current !== generation || closed) return;
        prepared = next;
        status.textContent = 'Ready to check this song’s sounds.';
      } catch (error) {
        if (closed || current !== generation) return;
        status.textContent = error.message;
        prepared.project = null;
      } finally {
        if (!closed && current === generation) {
          busy = false;
          show();
        }
      }
    }
    select.addEventListener('change', updateSelection);
    companionInput.addEventListener('change', () => {
      companion = companionInput.files[0] || null;
      updateSelection();
    });
    async function commit(allowMissing) {
      if (!guard())
        throw new Error(
          'The project changed while the song was opening. Your current work was retained.'
        );
      commitImportedAudio(staged, { guard, allowMissing });
      onStatus(
        staged.failures.length
          ? `Song opened with ${staged.failures.length} missing samples. Instructions and source references were retained.`
          : `Opened “${staged.project.projectName}” with its historical playback settings.`,
        !!staged.failures.length
      );
      finish(true);
    }
    open.addEventListener('click', async () => {
      if (busy || !prepared.project) return;
      busy = true;
      show();
      status.textContent = 'Checking this song’s sounds…';
      missing.hidden = true;
      failures.replaceChildren();
      try {
        const project = staged?.project || prepareProject(prepared.project);
        staged = await prepareImportedAudio(project, {
          signal: controller.signal,
          guard,
          previous: staged,
          onProgress: ({ completed, total }) => {
            status.textContent = `Checking sounds: ${completed} of ${total}…`;
          }
        });
        if (!staged.failures.length) {
          await commit(false);
          return;
        }
        status.textContent = `${staged.failures.length} channels have unavailable samples. Your current project is still open. You can retry, cancel, or open with those channels silent.`;
        for (const failure of staged.failures)
          failures.append(element('li', `Channel ${failure.channel}: ${failure.message}`));
        open.textContent = 'Retry missing samples';
        missing.hidden = false;
      } catch (error) {
        if (!closed) status.textContent = error.message;
      } finally {
        busy = false;
        if (!closed) show();
      }
    });
    missing.addEventListener('click', async () => {
      try {
        await commit(true);
      } catch (error) {
        status.textContent = error.message;
      }
    });
    cancel.addEventListener('click', () => finish(false));
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      finish(false);
    });
    controller.signal.addEventListener(
      'abort',
      () => {
        if (!closed) finish(false);
      },
      { once: true }
    );
    saveReport.addEventListener('click', () => {
      const payload = { ...prepared.report, sampleFailures: staged?.failures || [] };
      const url = URL.createObjectURL(
          new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
        ),
        a = element('a');
      a.href = url;
      a.download = 'audionaut-import-report.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    });
    show();
    dialog.showModal();
  });
}
