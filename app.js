const BASES = [
  ['todos','Todos','#d4a04a'], ['ron','Ron','#e0913f'], ['pisco','Pisco','#e6c05a'],
  ['gin','Gin','#8fbf92'], ['vodka','Vodka','#9db8d8'], ['tequila','Tequila','#7fd0b8'],
  ['whisky','Whisky','#c87848'], ['vino','Vino y burbujas','#c05a72'], ['licor','Licores y otros','#a884c8']
];
const BASE_COLOR = Object.fromEntries(BASES.map(b=>[b[0],b[2]]));
let filter='todos';

function sw(v){
  document.getElementById('tF').classList.toggle('on',v==='f');
  document.getElementById('tR').classList.toggle('on',v==='r');
  document.getElementById('vF').classList.toggle('on',v==='f');
  document.getElementById('vR').classList.toggle('on',v==='r');
}
function renderChips(){
  document.getElementById('chips').innerHTML = BASES.map(b=>
    `<button class="chip ${filter===b[0]?'on':''}" style="${filter===b[0]?`background:${b[2]};border-color:${b[2]}`:''}"
      onclick="filter='${b[0]}';renderChips();renderCards()">${b[1]}</button>`).join('');
}
function renderCards(){
  const q=(document.getElementById('q').value||'').toLowerCase();
  const list=D.filter(d=>(filter==='todos'||d.b===filter) && d.n.toLowerCase().includes(q));
  document.getElementById('count').textContent = list.length+' de '+D.length+' tragos';
  document.getElementById('cards').innerHTML = list.map(d=>{
    const i=D.indexOf(d);
    return `<button class="dcard" style="--bc:${BASE_COLOR[d.b]}" onclick="openSheet(${i})">
      <div class="dc-name">${d.n}</div>
      <div class="dc-meta"><span class="dc-base">${cap(d.b)}</span><span>${cap(d.m)}</span>
      <span class="diff">${'●'.repeat(d.d)}${'○'.repeat(3-d.d)}</span></div>
    </button>`;
  }).join('');
}
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

let curIdx=0, serves=1;
function openSheet(i){
  curIdx=i; serves=1;
  renderSheet();
  document.getElementById('ovl').classList.add('on');
  document.getElementById('sheet').classList.add('on');
}
function closeSheet(){
  document.getElementById('ovl').classList.remove('on');
  document.getElementById('sheet').classList.remove('on');
}
function chServes(v){ serves=Math.min(6,Math.max(1,serves+v)); renderSheet(true); }
function fmtAmt(ing){
  const [name,amt,unit]=ing;
  if(amt===0) return unit||'a gusto';
  const total=amt*serves;
  return total+' '+(unit===undefined?'ml':unit);
}
function renderSheet(keepSteps){
  const d=D[curIdx];
  const doneSet = keepSteps ? [...document.querySelectorAll('.step.done')].map(e=>e.dataset.i) : [];
  document.getElementById('sheet').innerHTML = `
    <div class="sh-head" style="border-top:3px solid ${BASE_COLOR[d.b]}">
      <button class="sh-close" onclick="closeSheet()">✕</button>
      <div class="sh-name">${d.n}</div>
      <div class="sh-meta"><b>${cap(d.b)}</b> · ${d.g} · Técnica: ${cap(d.m)} · Dificultad ${'●'.repeat(d.d)}${'○'.repeat(3-d.d)}</div>
    </div>
    <div class="sh-body">
      <div class="sh-sec"><span>Ingredientes</span>
        <span class="serves">
          <button onclick="chServes(-1)">−</button>
          <span>${serves} ${serves===1?'copa':'copas'}</span>
          <button onclick="chServes(1)">+</button>
        </span></div>
      ${d.i.map(x=>`<div class="ing-row"><span>${x[0]}</span><span class="ing-amt">${fmtAmt(x)}</span></div>`).join('')}
      <div class="sh-sec"><span>Preparación — toca cada paso al completarlo</span></div>
      ${d.s.map((st,j)=>`<div class="step ${doneSet.includes(String(j))?'done':''}" data-i="${j}" onclick="this.classList.toggle('done')">
        <div class="st-n">${j+1}</div><div class="st-t">${st}</div></div>`).join('')}
      <div class="sh-sec"><span>Decoración</span></div>
      <div style="font-size:13px; color:var(--mid); padding:0 2px">${d.gar}</div>
      <div class="sh-sec"><span>Dato de barra</span></div>
      <div class="tip-box">${d.t}</div>
    </div>`;
}

renderChips(); renderCards();
