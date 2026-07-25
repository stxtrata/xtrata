import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TypedConfirm } from './TypedConfirm';

/**
 * The reducer is unit-tested in `arming.test.ts`; this checks the control
 * surface actually reflects it — that a confirm button is never live before an
 * explicit arm, and never stays live through an edit.
 */

const renderConfirm = (overrides: Partial<Parameters<typeof TypedConfirm>[0]> = {}) => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  render(
    <TypedConfirm
      title="Deploy ST1.xtrata-drops-v3"
      phrase="xtrata-drops-v3"
      irreversible
      details={[
        { label: 'Contract id', value: 'ST1.xtrata-drops-v3' },
        { label: 'Clarity version', value: '4' }
      ]}
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...overrides}
    />
  );
  return {
    onConfirm,
    onCancel,
    input: screen.getByRole('textbox'),
    armButton: screen.getByRole('button', { name: /^Arm|Armed$/ }),
    confirmButton: screen.getByRole('button', { name: /Confirm|Deploy now/ })
  };
};

describe('TypedConfirm', () => {
  it('shows exactly what will happen before anything can be armed', () => {
    renderConfirm();
    expect(screen.getByText('Contract id')).toBeInTheDocument();
    expect(screen.getByText('ST1.xtrata-drops-v3')).toBeInTheDocument();
    expect(screen.getByText('Clarity version')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('warns that the action is irreversible', () => {
    renderConfirm();
    expect(screen.getByText(/cannot be overwritten/i)).toBeInTheDocument();
  });

  it('starts disarmed with both controls dead', () => {
    const { armButton, confirmButton } = renderConfirm();
    expect(armButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
    expect(screen.getByText('Not armed.')).toBeInTheDocument();
  });

  it('does not arm from the wrong text', async () => {
    const user = userEvent.setup();
    const { input, armButton, confirmButton } = renderConfirm();
    await user.type(input, 'xtrata-drops-v2');
    expect(armButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  it('does not confirm from typing the exact phrase alone', async () => {
    const user = userEvent.setup();
    const { input, armButton, confirmButton } = renderConfirm();
    await user.type(input, 'xtrata-drops-v3');
    expect(armButton).toBeEnabled();
    expect(confirmButton).toBeDisabled();
  });

  it('arms on the explicit arm click, then confirms', async () => {
    const user = userEvent.setup();
    const { input, armButton, confirmButton, onConfirm } = renderConfirm();
    await user.type(input, 'xtrata-drops-v3');
    await user.click(armButton);

    expect(screen.getByText('Armed — confirm to proceed.')).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disarms as soon as the text changes', async () => {
    const user = userEvent.setup();
    const { input, armButton, confirmButton } = renderConfirm();
    await user.type(input, 'xtrata-drops-v3');
    await user.click(armButton);
    expect(confirmButton).toBeEnabled();

    await user.type(input, 'x');
    expect(confirmButton).toBeDisabled();
    expect(screen.getByText('Not armed.')).toBeInTheDocument();
  });

  it('cancels without confirming', async () => {
    const user = userEvent.setup();
    const { onCancel, onConfirm } = renderConfirm();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('omits the irreversibility warning for a reversible confirmation', () => {
    renderConfirm({ irreversible: false });
    expect(screen.queryByText(/cannot be overwritten/i)).not.toBeInTheDocument();
  });
});
