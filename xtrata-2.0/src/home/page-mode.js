export const WIZARD_SHELL_ROUTE = '/inscribe?wizard=1';

export const WIZARD_EMBED_ROUTE = '/wizard/?embed=1';

export const isWizardShellRequest = (pathname, paramsLike) => {
  const params =
    paramsLike instanceof URLSearchParams ? paramsLike : new URLSearchParams(paramsLike ?? '');
  const segment = (pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
  return segment === 'inscribe' && params.get('wizard') === '1';
};
