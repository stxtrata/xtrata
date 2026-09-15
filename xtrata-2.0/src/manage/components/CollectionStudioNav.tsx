export const STUDIO_TASKS = [
  { id: 'collections', title: 'Your collections', description: 'Continue a draft or manage an existing collection.', detail: 'Choose a collection' },
  { id: 'create', title: 'Collection & contract', description: 'Set the collection identity, supply and contract template.', detail: 'Create · configure · deploy' },
  { id: 'artwork', title: 'Artwork & files', description: 'Upload artwork to temporary storage and review each file before locking inventory.', detail: 'Upload · preview · organise' },
  { id: 'metadata', title: 'Metadata & mint page', description: 'Arrange the cover, description and collector-facing collection page.', detail: 'Presentation · page preview' },
  { id: 'pricing', title: 'Prices & payouts', description: 'Set the mint price and review where collection proceeds go.', detail: 'STX price · recipients' },
  { id: 'schedule', title: 'Schedule & price tiers', description: 'Configure mint phases with their own price, supply and wallet limits.', detail: 'Block windows · phase activation' },
  { id: 'allowlist', title: 'Allowlists', description: 'Manage eligible wallets and allowances globally or for a specific phase.', detail: 'Wallet lists · mint limits' },
  { id: 'storage', title: 'Storage & cleanup', description: 'Review temporary files, retention and verified cleanup status.', detail: 'Retention · recovery · cleanup' },
  { id: 'launch', title: 'Review & launch', description: 'Check registered inventory and mint settings before opening your collection.', detail: 'Readiness · pause controls' }
] as const;
export type StudioTaskId = typeof STUDIO_TASKS[number]['id'];

export default function CollectionStudioNav({ collectionName, fileCount, state, onSelect }: {
  collectionName: string; fileCount: number; state: string; onSelect: (id: StudioTaskId) => void;
}) {
  return <section className="collection-studio" aria-labelledby="collection-studio-title">
    <div className="collection-studio__heading">
      <div><span className="eyebrow">Collection studio</span><h2 id="collection-studio-title">Make it yours. Get it ready to mint.</h2>
      <p>Prepare your files, shape the collection and decide how collectors can mint.</p></div>
      <div className="collection-studio__snapshot" aria-label="Selected collection">
        <strong>{collectionName || 'Start a new collection'}</strong>
        <span>{state || 'No collection selected'} · {fileCount} active files</span>
      </div>
    </div>
    <nav className="collection-studio__grid" aria-label="Collection setup tasks">
      {STUDIO_TASKS.map((task, index) => <button type="button" key={task.id} className="collection-studio__task" onClick={() => onSelect(task.id)}>
        <span className="collection-studio__number">{String(index + 1).padStart(2, '0')}</span>
        <strong>{task.title}<span aria-hidden="true"> ↗</span></strong>
        <span>{task.description}</span><small>{task.detail}</small>
      </button>)}
    </nav>
    <p className="collection-studio__note">Uploading prepares temporary files. Collectors inscribe them when they mint. Contract changes and publishing remain explicit actions in their respective panels.</p>
  </section>;
}
