// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest';
import { connectStacksWallet } from '../connect-stacks';

afterEach(() => { delete (window as any).XtrataRadioConnectStacks; document.body.innerHTML = ''; });

it('opens the Stacks wallet chooser through the wallet bar hook, skipping the Xtrata Music Wallet pop-up', () => {
  const hook = vi.fn();
  (window as any).XtrataRadioConnectStacks = hook;
  connectStacksWallet();
  expect(hook).toHaveBeenCalledTimes(1);
});

it('presses the wallet bar button when the hook is not there yet', () => {
  document.body.innerHTML = '<button id="radio-wallet-connect"></button>';
  const pressed = vi.fn();
  document.getElementById('radio-wallet-connect')!.addEventListener('click', pressed);
  connectStacksWallet();
  expect(pressed).toHaveBeenCalledTimes(1);
});

it('does nothing, and does not throw, when neither exists', () => {
  expect(() => connectStacksWallet()).not.toThrow();
});
