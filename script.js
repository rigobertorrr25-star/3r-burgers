const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];

window.addEventListener('load',()=>{
  $('.loader-bar i').style.width='100%';
  setTimeout(()=>$('.loader').classList.add('done'),900);
});

const nav=$('.site-nav');
const progressBar=$('.progress span');

const explodeSection=$('.explode');
const explodeCopy=$('.explode-copy');
const ebox=$('.ebox');
const eboxCopy=$('.ebox-copy');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const layers=$$('.elayer').map(el=>({
  el,
  restX:+el.dataset.restx, restY:+el.dataset.resty,
  x:+el.dataset.x, y:+el.dataset.y, rot:+el.dataset.rot
}));

function updateExplode(){
  if(!explodeSection)return;
  const r=explodeSection.getBoundingClientRect();
  const run=r.height-innerHeight;
  const p=reduceMotion?1:Math.min(Math.max(-r.top/run,0),1);
  const explodeP=Math.min(p/0.55,1);
  const packP=Math.max((p-0.55)/0.45,0);
  layers.forEach(({el,restX,restY,x,y,rot})=>{
    const ex=(restX+x*explodeP)*(1-packP);
    const ey=(restY+y*explodeP)*(1-packP);
    const erot=rot*explodeP*(1-packP);
    const scale=1-0.75*packP;
    el.style.transform=`translate(-50%,-50%) translate(${ex}px,${ey}px) rotate(${erot}deg) scale(${scale})`;
    el.style.opacity=1-packP;
  });
  if(ebox){
    ebox.style.opacity=packP;
    ebox.style.transform=`translate(-50%,-50%) translateY(${(1-packP)*50}px) scale(${0.82+0.18*packP})`;
  }
  if(eboxCopy)eboxCopy.style.opacity=Math.max((packP-0.4)/0.6,0);
  if(explodeCopy)explodeCopy.style.opacity=1-Math.min(p/0.35,1);
}

const sceneImages=$$('[data-scene] .scene-image,.final-image');
let ticking=false;
function onFrame(){
  ticking=false;
  nav.classList.toggle('scrolled',scrollY>40);
  sceneImages.forEach(el=>{
    const r=el.parentElement.getBoundingClientRect();
    const p=(r.top+innerHeight)/(innerHeight+r.height);
    const y=(p-.5)*-55;
    el.style.transform=`scale(1.10) translate3d(0,${y}px,0)`;
  });
  updateExplode();
  const max=document.documentElement.scrollHeight-innerHeight;
  progressBar.style.width=`${max?(scrollY/max)*100:0}%`;
}
function requestTick(){
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(onFrame);
}
window.addEventListener('scroll',requestTick,{passive:true});
window.addEventListener('resize',requestTick,{passive:true});
onFrame();

$('.hamburger').addEventListener('click',()=>nav.classList.toggle('open'));
$$('.site-nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const io=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})
},{threshold:.12});
$$('.product,.lineup-top,.final-copy').forEach(x=>{x.classList.add('reveal');io.observe(x)});

const lazyIo=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target, src=el.dataset.src;
    lazyIo.unobserve(el);
    if(!src)return;
    const img=new Image();
    img.onload=()=>el.style.backgroundImage=`url("${src}")`;
    img.src=src;
  });
},{rootMargin:'600px 0px'});
$$('.image').forEach(el=>lazyIo.observe(el));

$$('.product').forEach(card=>{
  const photo=$('.product-photo',card);
  card.addEventListener('mousemove',e=>{
    if(matchMedia('(pointer: coarse)').matches)return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    photo.style.transform=`scale(1.06) translate(${x*14}px,${y*14}px)`;
  });
  card.addEventListener('mouseleave',()=>photo.style.transform='');
});

$('.cookie button').addEventListener('click',()=>$('.cookie').remove());
$('.cookie .settings').addEventListener('click',()=>alert('Aquí puedes conectar tu propio panel de privacidad/cookies.'));
