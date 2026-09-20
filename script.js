const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];

window.addEventListener('load',()=>{
  $('.loader-bar i').style.width='100%';
  setTimeout(()=>$('.loader').classList.add('done'),900);
});

const nav=$('.site-nav');
const progressBar=$('.progress span');

const scrubSection=$('.scrub');
const scrubCopy=$('.scrub-copy');
const scrubVideo=$('.scrub-video');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let scrubDuration=0;

if(scrubVideo){
  if(reduceMotion){
    scrubVideo.loop=true;
    scrubVideo.play().catch(()=>{});
  }else if(scrubVideo.readyState>=1&&scrubVideo.duration){
    scrubDuration=scrubVideo.duration;
  }else{
    scrubVideo.addEventListener('loadedmetadata',()=>{scrubDuration=scrubVideo.duration||0;},{once:true});
  }
}

function updateScrub(){
  if(!scrubSection||!scrubVideo)return;
  const r=scrubSection.getBoundingClientRect();
  const run=r.height-innerHeight;
  const p=Math.min(Math.max(-r.top/run,0),1);
  if(!reduceMotion&&scrubDuration){
    const t=p*scrubDuration;
    if(Math.abs(scrubVideo.currentTime-t)>0.033)scrubVideo.currentTime=t;
  }
  if(scrubCopy)scrubCopy.style.opacity=1-Math.min(p/0.25,1);
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
  updateScrub();
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
