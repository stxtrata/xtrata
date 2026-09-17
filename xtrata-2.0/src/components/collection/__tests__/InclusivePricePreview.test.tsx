// @vitest-environment happy-dom
import { afterEach, it, expect, vi } from 'vitest';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { Cl, cvToHex } from '@stacks/transactions';
import Preview from '../InclusivePricePreview';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('deducts granular protocol costs and previews a 5% sale-base share without writes',async()=>{
 const fetcher=vi.fn(async(url: string)=>new Response(JSON.stringify({okay:true,result:cvToHex(Cl.ok(Cl.uint(url.endsWith('get-upload-chunk-fee-unit')?1000:100000)))})));
 vi.stubGlobal('fetch',fetcher);render(<Preview maxChunks={1}/>);
 await waitFor(()=>expect(screen.getByText('0.201 STX')).toBeTruthy());
 expect(screen.getByText('0.799 STX')).toBeTruthy();expect(screen.getByText('0.03995 STX')).toBeTruthy();
 expect(fetcher.mock.calls.every(([url])=>url.includes('/call-read/'))).toBe(true);
 fireEvent.change(screen.getByRole('textbox'),{target:{value:'0.1'}});
 expect(screen.getByText('Target is below inscription cost')).toBeTruthy();
});
it('requires locked inventory rather than inventing a file-size estimate',()=>{
 vi.stubGlobal('fetch',vi.fn(()=>new Promise(()=>{})));render(<Preview maxChunks={null}/>);
 expect(screen.getByText(/Complete and lock/)).toBeTruthy();expect(screen.queryByText('Required v1.6 contract sale amount')).toBeNull();
});
