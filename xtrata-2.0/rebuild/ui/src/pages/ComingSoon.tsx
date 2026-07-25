import { Layout, type PageId } from '../shell/Layout';

/**
 * Placeholder body for MPA entries that are being built elsewhere. It mounts
 * the real shell (wallet, network guard, toasts) so the entry is a working
 * page from day one and filling it in is only a matter of replacing the body.
 */
export const ComingSoon = ({
  page,
  title,
  summary,
  bullets
}: {
  page: PageId;
  title: string;
  summary: string;
  bullets: string[];
}): JSX.Element => (
  <Layout page={page} title={title}>
    <div className="card stub">
      <h2>Coming soon</h2>
      <p className="muted">{summary}</p>
      <ul style={{ textAlign: 'left' }}>
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <a className="btn" href="/studio.html">
        Go to the Collection Studio
      </a>
    </div>
  </Layout>
);
