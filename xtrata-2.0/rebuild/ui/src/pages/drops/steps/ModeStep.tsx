import { useDrops, useDropsState } from '../useDropsStore';
import { MODE_COPY, MODE_ORDER, WHO_PAYS_TABLE } from '../copy';

/**
 * Step 5 — the mode, and what it means for who pays.
 *
 * The copy comes from `copy.ts`, which owns the documented language rule: only
 * a sponsored drop may be described as free, and a zero-price drop must say
 * out loud that the claimer pays the network fee. No screen writes its own
 * version of that sentence.
 */
export const ModeStep = (): JSX.Element => {
  const store = useDrops();
  const state = useDropsState();
  const selected = MODE_COPY[state.config.mode];

  return (
    <div>
      <section className="card">
        <h2>Distribution mode</h2>
        <p className="muted">
          The mode decides who pays for a claim. It does not change what the claimer receives — every
          mode in this contract hands over an escrowed NFT.
        </p>
        <div role="radiogroup" aria-label="Distribution mode">
          {MODE_ORDER.map((mode) => {
            const copy = MODE_COPY[mode];
            const isSelected = state.config.mode === mode;
            return (
              <label
                key={mode}
                className="card"
                style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}
                data-mode={mode}
                data-selected={isSelected ? 'true' : 'false'}
              >
                <div className="row">
                  <input
                    type="radio"
                    name="drop-mode"
                    value={mode}
                    checked={isSelected}
                    onChange={() => store.setMode(mode)}
                  />
                  <strong>
                    {copy.label} <span className="muted mono">mode u{copy.code}</span>
                  </strong>
                </div>
                <p>{copy.summary}</p>
                <p data-testid={`claim-cost-${mode}`}>{copy.costClaim}</p>
                <p className="muted">{copy.costCreator}</p>
                {copy.advertisingRule ? (
                  <p className="hint" data-testid={`advertising-rule-${mode}`}>
                    {copy.advertisingRule}
                  </p>
                ) : null}
              </label>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2>Who pays what</h2>
        <div className="table-scroll">
          <table>
            <caption className="visually-hidden">Cost responsibility by drop mode</caption>
            <thead>
              <tr>
                <th>Cost</th>
                {MODE_ORDER.map((mode) => (
                  <th key={mode} scope="col">
                    {MODE_COPY[mode].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WHO_PAYS_TABLE.map((row) => (
                <tr key={row.cost}>
                  <th scope="row">{row.cost}</th>
                  {MODE_ORDER.map((mode) => (
                    <td key={mode}>{row.byMode[mode]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>What {selected.label.toLowerCase()} requires before it can go live</h2>
        <ul>
          {selected.activationGates.map((gate) => (
            <li key={gate}>{gate}</li>
          ))}
        </ul>
        {selected.needsBudget ? (
          <p className="hint">
            A sponsored drop cannot be activated until its budget covers the contract's minimum. The exact
            number is on the costs step.
          </p>
        ) : null}
      </section>

      <div className="row spread">
        <button type="button" className="btn" onClick={() => store.setStep('inventory')}>
          Back
        </button>
        <button type="button" className="btn btn--primary" onClick={() => store.setStep('timing')}>
          Next: timing and eligibility
        </button>
      </div>
    </div>
  );
};
