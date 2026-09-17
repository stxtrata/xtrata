import type { Status, Page, ReadOnlyCompanion } from './protocol';

export const exampleStatus: Status = {
  schema: 1, address: 'SP26RN0PCG00CWN9HXKAGGPD4VMWJQEE2TYW3KH8H', enabled: true, locked: false,
  confirmed: '20000', reserved: '350', reserve: '1000', usable: '18650', fee: '300', holder: '50', pending: 1, attention: 'none'
};
// Static public fixture only; never opens a wallet or makes a network request.
export function fakeCompanion(status: Status = exampleStatus, pages: Page[] = [{ entries: [], next: null }]): ReadOnlyCompanion {
  return {
    async status() { return structuredClone(status); },
    async history(cursor, limit) {
      if (limit < 1 || limit > 50 || (cursor !== null && !/^page-[0-9]+$/.test(cursor))) throw Error('Invalid page request');
      const page = pages[cursor === null ? 0 : Number(cursor.slice(5))];
      if (!page) throw Error('Missing page');
      return structuredClone(page);
    }
  };
}
