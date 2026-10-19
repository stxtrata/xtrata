// Pulls the poster pools and the rotation (wallForDay) out of hall.js with a real parser, so Node can run them.
const fs=require('fs'), acorn=require('acorn');
const WANT=new Set(['rng','POSTER_SETS','POSTERS_MORE','POSTERS_FUN','POSTERS_STACKS','POSTERS_EXTRA','POSTERS_PLAY','POSTERS_IDEAS','ANIM_POSTER',
  'ROTATION_START_DAY','hash32','seededShuffle','SET_WEIGHTS','ROTATION_POOL','pickWeighted','wallForDay']);
function load(file){
  const src=fs.readFileSync(file,'utf8');
  const ast=acorn.parse(src,{ecmaVersion:2022,sourceType:'script'});
  const body=ast.body[0].expression.callee.body.body;      // (() => { ... })()
  const parts=[];
  for(const st of body){
    let names=[];
    if(st.type==='VariableDeclaration') names=st.declarations.map(d=>d.id.name||'');
    else if(st.type==='FunctionDeclaration') names=[st.id.name];
    else if(st.type==='ExpressionStatement' && /ROTATION_POOL\.push/.test(src.slice(st.start,st.end))) names=['ROTATION_POOL'];
    if(names.some(n=>WANT.has(n))) parts.push(src.slice(st.start,st.end));
  }
  const code=parts.join('\n')+'\nreturn {ROTATION_POOL,ROTATION_W,wallForDay,ROTATION_START_DAY,SET_WEIGHTS};';
  return {api:new Function(code)(), code};
}
module.exports=load;
if(require.main===module){const {api:o}=load(process.argv[2]);console.log(o.ROTATION_POOL.length,o.wallForDay(6800,27).wall.join(','))}
