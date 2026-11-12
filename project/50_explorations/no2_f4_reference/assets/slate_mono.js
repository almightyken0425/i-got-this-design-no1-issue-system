// F-series design constraint: no checkbox, radio, or look-alike selection controls.
// Task status is edited through the task-detail menu. The shared prototype owns task data.
function monoIcon(name){
 const paths={
  queued:'<path d="M5 4h14l2 10v6H3v-6Zm-2 10h5l2 3h4l2-3h5"/>',
  progress:'<path d="m8 4 12 8-12 8Z"/>',
  review:'<path d="M2.5 12s3.3-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.3 6.5-9.5 6.5S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  done:'<path d="M4 4h16v5H4Zm1 5v11h14V9M9 13h6"/>',
  user:'<circle cx="12" cy="8" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/>',
  reset:'<path d="M4 9a8 8 0 1 1 .5 7M4 4v5h5"/>',
  arrow:'<path d="M5 19 19 5M5 5h14v14"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  filter:'<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="2" fill="currentColor"/><circle cx="16" cy="17" r="2" fill="currentColor"/>'
 };
 return paths[name]?`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`:icon(name);
}
function monoButton(action,symbol,label,selected=false,extra=''){
 const actionLabel=selected&&['mine','week'].includes(action)?'取消'+label:label;
 return `<button class="mono-icon ${selected?'is-active':''}" data-action="${action}" aria-label="${actionLabel}" title="${actionLabel}" ${extra}>${monoIcon(symbol)}<span class="mono-tip">${actionLabel}</span></button>`;
}
function monoAvatar(person,name=person){
 const n=Math.max(0,['林','陳','許','吳'].indexOf(person));
 const hair=['M11 19c-2-13 17-14 18 0l-4-4-3 2-6-3Z','M10 22V15c0-12 20-12 20 0v12l-4-7-1-6-11 1-1 9Z','M11 17c-2-12 19-14 18 2l-4-5-13 3Z','M10 21c-1-11 4-15 10-15s12 5 10 14l-4-6-6-3-7 5Z'][n];
 return `<span class="mono-avatar" role="img" aria-label="${esc(name)}" title="${esc(name)}"><svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="20" fill="${['#dedede','#cfcfcf','#e9e9e9','#bcbcbc'][n]}"/><path d="M7 41c0-10 5-14 13-14s13 4 13 14" fill="${n%2?'#555':'#242424'}"/><rect x="17" y="23" width="6" height="8" rx="3" fill="#bababa"/><ellipse cx="20" cy="18" rx="8" ry="10" fill="#f1f1f1"/><path d="${hair}" fill="#323232"/><path d="M16 19h1m6 0h1m-6 5q2 1 4 0" fill="none" stroke="#444" stroke-width="1.2" stroke-linecap="round"/>${n===2?'<path d="M12 18h7v4h-6Zm9 0h7l-1 4h-6Zm-2 1h2" fill="none" stroke="#444"/>':''}</svg></span>`;
}
const MONO_TITLES={'WEB-128':'首頁架構','WEB-129':'品牌素材','WEB-124':'共用元件','WEB-125':'專案總覽','WEB-121':'手機導覽','WEB-122':'產品文案','WEB-117':'團隊訪談','WEB-118':'改版目標'};
function monoArtwork(id){
 const art={
  'WEB-128':'<rect x="39" y="14" width="122" height="75" rx="7" fill="#fafafa"/><path d="M39 28h122" stroke="#d0d0d0"/><circle cx="47" cy="21" r="2" fill="#222"/><path d="M54 21h20m57 0h21" stroke="#bbb" stroke-width="3"/><rect x="48" y="36" width="66" height="25" rx="3" fill="#292929"/><rect x="120" y="36" width="32" height="43" rx="3" fill="#d8d8d8"/><rect x="48" y="67" width="29" height="12" rx="3" fill="#e0e0e0"/><rect x="83" y="67" width="31" height="12" rx="3" fill="#e0e0e0"/>',
  'WEB-129':'<rect x="43" y="22" width="52" height="66" rx="8" fill="#aaa" transform="rotate(-12 43 22)"/><rect x="64" y="13" width="62" height="77" rx="8" fill="#fafafa" transform="rotate(7 64 13)"/><circle cx="98" cy="43" r="15" fill="#333"/><path d="m72 83 20-20 9 9 10-12 12 25Z" fill="#c5c5c5"/><circle cx="150" cy="40" r="13" fill="#dedede"/><circle cx="150" cy="67" r="13" fill="#303030"/>',
  'WEB-124':'<rect x="35" y="20" width="83" height="26" rx="13" fill="#222"/><path d="M50 33h23m24 0h8m-4-4v8" stroke="#fff" stroke-width="2"/><rect x="128" y="20" width="38" height="26" rx="6" fill="#fff"/><path d="m139 38 14-10m-9 0h9v9" stroke="#333" stroke-width="2"/><rect x="35" y="57" width="131" height="25" rx="6" fill="#fafafa"/><path d="M47 69h63M151 63v13" stroke="#bbb" stroke-width="2" stroke-linecap="round"/>',
  'WEB-125':'<rect x="33" y="16" width="134" height="73" rx="8" fill="#fafafa"/><rect x="33" y="16" width="24" height="73" rx="7" fill="#353535"/><path d="M40 29h9m-9 12h9m-9 12h9" stroke="#bbb" stroke-width="2"/><rect x="66" y="26" width="90" height="19" rx="4" fill="#dedede"/><rect x="66" y="51" width="42" height="28" rx="4" fill="#333"/><path d="m118 76 8-11 9 4 15-13" fill="none" stroke="#666" stroke-width="3"/>',
  'WEB-121':'<rect x="64" y="9" width="49" height="88" rx="10" fill="#282828" transform="rotate(-8 88 53)"/><rect x="69" y="16" width="39" height="74" rx="6" fill="#fafafa" transform="rotate(-8 88 53)"/><rect x="73" y="30" width="29" height="33" rx="4" fill="#ddd" transform="rotate(-8 88 53)"/><path d="M73 77h30" stroke="#ccc" stroke-width="6" transform="rotate(-8 88 53)"/><rect x="120" y="29" width="26" height="46" rx="13" fill="#fff"/><circle cx="133" cy="41" r="5" fill="#333"/><circle cx="133" cy="62" r="4" fill="#bbb"/>',
  'WEB-122':'<rect x="47" y="14" width="109" height="75" rx="8" fill="#fafafa"/><path d="m61 48 9-22 9 22m-15-7h12" fill="none" stroke="#252525" stroke-width="3"/><path d="M90 32h50M90 41h34M61 60h79M61 68h69M61 76h44" stroke="#c9c9c9" stroke-width="3" stroke-linecap="round"/>',
  'WEB-117':'<path d="M41 22h72a8 8 0 0 1 8 8v25a8 8 0 0 1-8 8H66L50 75V63h-9a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8" fill="#fff"/><path d="M104 45h56a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-8v13l-16-13h-32a8 8 0 0 1-8-8V53a8 8 0 0 1 8-8" fill="#343434"/><circle cx="51" cy="42" r="3" fill="#aaa"/><circle cx="65" cy="42" r="3" fill="#aaa"/><circle cx="79" cy="42" r="3" fill="#aaa"/><path d="M113 60h36m-36 9h24" stroke="#ddd" stroke-width="3" stroke-linecap="round"/>',
  'WEB-118':'<circle cx="100" cy="53" r="37" fill="#f9f9f9"/><circle cx="100" cy="53" r="25" fill="none" stroke="#d2d2d2" stroke-width="7"/><circle cx="100" cy="53" r="12" fill="#292929"/><path d="m101 52 32-33m-1 0 1 12m-1-12-12 1" stroke="#666" stroke-width="3" fill="none" stroke-linecap="round"/>'
 };
 return `<svg viewBox="0 0 200 106" fill="none" aria-hidden="true">${art[id]||art['WEB-128']}</svg>`;
}
function monoHeroArt(){return `<svg viewBox="0 0 440 260" fill="none" aria-hidden="true"><ellipse cx="232" cy="228" rx="157" ry="12" fill="#080808" opacity=".4"/><g transform="rotate(-8 228 132)"><rect x="68" y="20" width="282" height="190" rx="16" fill="#424242" stroke="#666"/><rect x="77" y="30" width="264" height="169" rx="10" fill="#efefef"/><path d="M77 54h264" stroke="#d3d3d3"/><circle cx="89" cy="42" r="3" fill="#999"/><circle cx="100" cy="42" r="3" fill="#bbb"/><path d="M263 42h60" stroke="#d5d5d5" stroke-width="5" stroke-linecap="round"/><rect x="88" y="67" width="145" height="116" rx="9" fill="#242424"/><circle cx="160" cy="116" r="35" fill="#444"/><circle cx="161" cy="116" r="25" fill="#666"/><circle cx="162" cy="116" r="16" fill="#999"/><circle cx="163" cy="116" r="7" fill="#ddd"/><path d="M100 166h41" stroke="#ddd" stroke-width="5" stroke-linecap="round"/><rect x="244" y="67" width="85" height="49" rx="9" fill="#fff"/><path d="M255 81h60m-60 11h35" stroke="#ccc" stroke-width="4" stroke-linecap="round"/><rect x="244" y="125" width="85" height="58" rx="9" fill="#d1d1d1"/><path d="m258 167 15-20 14 9 20-20" stroke="#555" stroke-width="3" stroke-linecap="round"/></g><g transform="rotate(9 338 170)"><rect x="304" y="91" width="72" height="137" rx="16" fill="#181818" stroke="#727272"/><rect x="310" y="98" width="60" height="123" rx="11" fill="#e2e2e2"/><rect x="330" y="102" width="20" height="5" rx="3" fill="#333"/><rect x="317" y="119" width="46" height="56" rx="8" fill="#424242"/><circle cx="340" cy="147" r="15" fill="#777"/><circle cx="340" cy="147" r="7" fill="#bbb"/><path d="M321 187h38m-38 9h24" stroke="#aaa" stroke-width="4" stroke-linecap="round"/><rect x="329" y="209" width="22" height="3" rx="2" fill="#777"/></g></svg>`}
function renderMono(){
 const previous=document.activeElement;
 const action=previous?.dataset?.action;
 const previousView=previous?.dataset?.view;
 const label=previous?.getAttribute('aria-label');
 app.innerHTML=`<div class="mono-shell"><header class="mono-top"><div class="mono-brand">${monoIcon('grid')}<b>forma<span>.</span></b></div><div class="mono-top-right"><span class="mono-demo">示範</span><div class="mono-team">${['林','陳','許','吳'].map((p,i)=>monoAvatar(p,['林以安','陳沛庭','許哲維','吳佳穎'][i])).join('')}</div>${monoButton('activity','bell','團隊動態')}</div></header><div class="mono-layout"><main class="mono-main"><section class="mono-overview" aria-label="專案概況"><div class="mono-progress-card"><div class="mono-card-label">${monoIcon('done')}<span>完成</span></div><div class="mono-ring" role="img" aria-label="已完成 ${percentage()}%"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="65"/><circle class="mono-ring-value" cx="80" cy="80" r="65" pathLength="100" stroke-dasharray="${percentage()} 100"/></svg><strong>${percentage()}<small>%</small></strong></div>${variant?.variant==='f2'?`<div class="mono-segment-progress" aria-hidden="true">${tasks.map((t,i)=>`<i class="${i<tasks.filter(x=>x.status===3).length?'filled':''}"></i>`).join('')}</div>`:''}<div class="mono-progress-bottom"><b>${tasks.filter(t=>t.status===3).length}<span> / ${tasks.length}</span></b><span>任務</span></div></div><div class="mono-hero"><div class="mono-hero-copy"><span class="mono-sprint">SPRINT 08</span><h1>網站改版</h1><span class="mono-hero-date">10.13 — 10.23</span></div><div class="mono-hero-art">${monoHeroArt()}</div><div class="mono-hero-notch"><span>${monoIcon('calendar')}交付</span><strong>10.23</strong></div><span class="mono-hero-badge">${monoIcon('folder')} Web</span></div></section><section class="mono-work" aria-label="任務"><div class="mono-toolbar"><label class="mono-search">${monoIcon('search')}<input id="task-search" type="search" placeholder="搜尋" value="${esc(query)}" aria-label="搜尋任務或編號"></label><div class="mono-tools"><div class="mono-view" role="tablist" aria-label="任務檢視">${['board','list'].map(v=>`<button class="mono-icon ${v===view?'is-active':''}" id="mono-view-${v}" role="tab" data-view="${v}" title="${v==='board'?'看板':'清單'}" aria-label="${v==='board'?'看板':'清單'}" aria-selected="${v===view}" tabindex="${v===view?0:-1}" aria-controls="task-content">${monoIcon(v)}</button>`).join('')}</div>${monoButton('mine','user','只看我的',onlyMine)}${monoButton('week','calendar','本週到期',week)}${monoButton('new','plus','新增任務',false)}</div></div><div class="mono-filter-state" ${!onlyMine&&!week&&!query?'hidden':''}><span id="result-label"></span>${onlyMine?'<span>我的</span>':''}${week?'<span>本週</span>':''}${monoButton('clear-search','close','清除篩選')}</div><div id="task-content" role="tabpanel" aria-labelledby="mono-view-${view}"></div></section></main><nav class="mono-dock" aria-label="工作區導覽">${monoButton('all','grid','所有任務',!onlyMine&&!week)}${monoButton('mine','user','我的任務',onlyMine)}${monoButton('week','calendar','本週到期',week)}${monoButton('activity','chat','團隊動態')}<span class="mono-dock-space"></span>${monoButton('reset','reset','重設此提案')}<span class="mono-dock-profile">${monoAvatar('林','林以安')}</span></nav></div><footer class="mono-footer"><span>08 / OCT 2026</span><span>${monoIcon('check')}示範資料</span></footer></div>`;
 renderMonoTasks();
 if(action||previousView){
  const target=[...app.querySelectorAll('button')].find(b=>(action?b.dataset.action===action:b.dataset.view===previousView)&&b.getAttribute('aria-label')?.replace(/^取消/,'')===label?.replace(/^取消/,''));
  target?.focus({preventScroll:true});
 }
}
function monoTask(t){
 const short=MONO_TITLES[t.id]||t.title;
 return `<article class="mono-task ${t.status===3?'is-complete':''}"><button class="mono-task-open" data-task="${esc(t.id)}" aria-label="${esc(t.title)}"><span class="mono-thumbnail">${monoArtwork(t.id)}<span class="mono-open-arrow">${monoIcon('arrow')}</span></span><h3>${esc(short)}</h3></button><div class="mono-task-meta"><time title="到期日 2026/${esc(t.due)}">${esc(t.due)}</time><span class="mono-priority" role="img" aria-label="${esc(t.priority)}優先" title="${esc(t.priority)}優先">${[0,1,2].map((v)=>`<i class="${v<({'高':3,'中':2,'低':1}[t.priority]||1)?'filled':''}"></i>`).join('')}</span>${monoAvatar(t.person,t.name)}</div></article>`;
}
function renderMonoTasks(){
 const items=filtered(),container=document.querySelector('#task-content'),result=document.querySelector('#result-label');
 if(result)result.textContent=`${items.length} 項`;
 document.querySelector('.mono-filter-state').hidden=!onlyMine&&!week&&!query;
 if(!items.length){container.innerHTML=`<div class="mono-empty">${monoIcon('search')}<h2>沒有結果</h2><button data-action="clear-search">清除篩選</button></div>`;return;}
 container.innerHTML=`<div class="mono-board ${view==='list'?'mono-list':''}">${['待辦','進行','確認','完成'].map((label,s)=>{const group=items.filter(t=>t.status===s);return `<section class="mono-column" aria-label="${statusLabels[s]}"><header class="mono-column-head"><span class="mono-stage-icon stage-${s}">${monoIcon(['queued','progress','review','done'][s])}</span><h2>${label}</h2><span>${group.length}</span><button class="mono-column-add" data-new-status="${s}" aria-label="新增${statusLabels[s]}任務" title="新增${statusLabels[s]}任務">${monoIcon('plus')}</button></header><div class="mono-column-content">${group.length?group.map(monoTask).join(''):`<button class="mono-empty-column" data-new-status="${s}" aria-label="新增${statusLabels[s]}任務">${monoIcon('plus')}</button>`}</div></section>`}).join('')}</div>`;
}
document.addEventListener('keydown',e=>{
 if(!isMono||!e.target.matches('.mono-view [role="tab"]'))return;
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
 e.preventDefault();
 view=e.key==='Home'?'board':e.key==='End'?'list':view==='board'?'list':'board';
 render();document.querySelector(`#mono-view-${view}`)?.focus();
});
