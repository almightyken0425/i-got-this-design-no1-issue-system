const referenceSections=['canvas','standards','adoption'];
function showReferenceSection(){
 const id=referenceSections.includes(location.hash.slice(1))?location.hash.slice(1):'canvas';
 referenceSections.forEach(key=>{document.getElementById(key).hidden=key!==id});
 document.querySelectorAll('.reference-nav a').forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
}
window.addEventListener('hashchange',showReferenceSection);showReferenceSection();
const styles=getComputedStyle(document.documentElement);
const roles=[['bg','背景'],['surface','卡片'],['surface-soft','模組'],['ink','主文字'],['muted','次文字'],['line','邊界'],['accent','強調'],['accent-soft','強調底']];
const swatches=document.getElementById('swatches');
roles.forEach(([key,label])=>{const item=document.createElement('div');item.className='swatch';const color=document.createElement('div');color.className='swatch-color';color.style.background=`var(--f4-${key})`;const name=document.createElement('b');name.textContent=label;const code=document.createElement('code');code.textContent=styles.getPropertyValue(`--f4-${key}`).trim().toUpperCase();item.append(color,name,code);swatches.append(item)});
document.querySelectorAll('[data-token]').forEach(el=>{el.textContent=styles.getPropertyValue('--f4-'+el.dataset.token).trim()});
