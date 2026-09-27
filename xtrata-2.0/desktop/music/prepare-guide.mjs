import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const text=await readFile(join(here,'README-BETA-TESTERS.md'),'utf8');
for(const directory of [join(here,'guide'),join(here,'../../public/downloads')]){
 await mkdir(directory,{recursive:true});
 await writeFile(join(directory,'Xtrata-Music-Beta-Guide.txt'),text);
}
