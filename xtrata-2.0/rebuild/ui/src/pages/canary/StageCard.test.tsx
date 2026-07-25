import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { STAGE_DEFINITIONS, stageDefinition, type StageStatus } from './stages';
import { StageCard, STATUS_LABEL, STATUS_TONE } from './StageCard';
import type { StageState } from './store';

const stage = (patch: Partial<StageState> = {}): StageState => ({
  id: 'sources',
  status: 'pending',
  evidence: [],
  ...patch
});

const renderCard = (params: {
  id?: (typeof STAGE_DEFINITIONS)[number]['id'];
  stage?: Partial<StageState>;
  gate?: { open: boolean; reason?: string };
}) =>
  render(
    <StageCard
      definition={stageDefinition(params.id ?? 'sources')}
      stage={stage({ id: params.id ?? 'sources', ...params.stage })}
      gate={params.gate ?? { open: true }}
    />
  );

describe('StageCard', () => {
  it('names every stage status', () => {
    const statuses: StageStatus[] = ['pending', 'running', 'passed', 'failed', 'skipped'];
    expect(Object.keys(STATUS_LABEL).sort()).toEqual([...statuses].sort());
    expect(Object.keys(STATUS_TONE).sort()).toEqual([...statuses].sort());
  });

  it.each(['pending', 'running', 'passed', 'failed', 'skipped'] as StageStatus[])(
    'renders %s with its own badge and card tone',
    (status) => {
      const { container, unmount } = renderCard({ stage: { status } });
      expect(screen.getByText(STATUS_LABEL[status])).toHaveClass(`state--${STATUS_TONE[status]}`);
      expect(container.querySelector('.canary-stage')).toHaveAttribute('data-status', status);
      unmount();
    }
  );

  it('shows the lock reason when the gate is closed', () => {
    renderCard({ gate: { open: false, reason: 'stage 1 (Source validation) failed' } });
    expect(screen.getByRole('status')).toHaveTextContent(/Locked — stage 1/);
  });

  it('shows no lock notice once the gate is open', () => {
    renderCard({ gate: { open: true } });
    expect(screen.queryByText(/Locked —/)).not.toBeInTheDocument();
  });

  it('labels an attested stage as not machine-verified', () => {
    renderCard({ id: 'contract-tests' });
    expect(screen.getByText(/NOT machine-verified/)).toBeInTheDocument();
  });

  it('labels a machine-verified stage plainly, with its required network', () => {
    renderCard({ id: 'testnet-deploy' });
    expect(screen.getByText(/Machine-verified/)).toBeInTheDocument();
    expect(screen.getByText(/requires a testnet account/)).toBeInTheDocument();
    expect(screen.getByText(/irreversible/)).toBeInTheDocument();
  });

  it('quotes the exact command an attested stage needs run elsewhere', () => {
    renderCard({ id: 'contract-tests' });
    expect(screen.getByLabelText('Commands for stage 2')).toHaveTextContent(
      'cd rebuild/contracts && clarinet check && npm test'
    );
    renderCard({ id: 'client-tests' });
    expect(screen.getByLabelText('Commands for stage 4')).toHaveTextContent('cd rebuild/ui && npm test');
  });

  it('renders evidence as a labelled list with its tone', () => {
    renderCard({
      stage: {
        status: 'passed',
        evidence: [
          { label: 'sha256', value: 'a'.repeat(64), tone: 'ok' },
          { label: 'Dependencies', value: 'SP1.core', tone: 'muted' }
        ]
      }
    });
    const list = screen.getByLabelText('Evidence for stage 1');
    expect(list).toHaveTextContent('sha256');
    expect(screen.getByText('a'.repeat(64))).toHaveClass('tone--ok');
    expect(screen.getByText('SP1.core')).toHaveClass('tone--muted');
  });

  it('raises a failure as an alert', () => {
    renderCard({ stage: { status: 'failed', error: 'deploy configuration has 2 problems' } });
    expect(screen.getByRole('alert')).toHaveTextContent('2 problems');
  });

  it('shows a skip reason', () => {
    renderCard({
      id: 'sponsored-claim-canary',
      stage: { status: 'skipped', skipReason: 'no relayer configured' }
    });
    expect(screen.getByText(/Skipped: no relayer configured/)).toBeInTheDocument();
  });
});

describe('stage definitions', () => {
  it('are numbered 1..15 in order', () => {
    expect(STAGE_DEFINITIONS.map((definition) => definition.number)).toEqual(
      Array.from({ length: 15 }, (_, i) => i + 1)
    );
  });

  it('mark exactly the two stages a browser cannot verify as attested', () => {
    expect(
      STAGE_DEFINITIONS.filter((definition) => definition.verification === 'attested').map(
        (definition) => definition.id
      )
    ).toEqual(['contract-tests', 'client-tests']);
  });

  it('allow a skip only where a skip is legitimate', () => {
    expect(
      STAGE_DEFINITIONS.filter((definition) => definition.skippable).map((definition) => definition.id)
    ).toEqual(['sponsored-claim-canary']);
  });

  it('require mainnet for the production stages and testnet for the rehearsal ones', () => {
    expect(stageDefinition('production-deploy').requiredNetwork).toBe('mainnet');
    expect(stageDefinition('production-verify').requiredNetwork).toBe('mainnet');
    expect(stageDefinition('testnet-deploy').requiredNetwork).toBe('testnet');
    expect(stageDefinition('drop-canary').requiredNetwork).toBe('testnet');
  });

  it('put application configuration activation last', () => {
    expect(STAGE_DEFINITIONS.at(-1)!.id).toBe('activation');
  });
});
