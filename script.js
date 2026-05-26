import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.16/dist/lenis.mjs';
import { GLTFLoader } from 'https://unpkg.com/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.128.0/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'https://unpkg.com/three@0.128.0/examples/jsm/loaders/FBXLoader.js';
import { EffectComposer } from 'https://unpkg.com/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'https://unpkg.com/three@0.128.0/examples/jsm/postprocessing/BokehPass.js';

/* loader */
const loaderEl=document.getElementById('loader');
const lbar=document.getElementById('lbar');
const lpct=document.getElementById('lpct');
const lChars=document.querySelectorAll('#loader .lc');
setTimeout(()=>lChars.forEach((c,i)=>setTimeout(()=>c.classList.add('up'),i*55)),280);
function setLoad(p){lbar.style.width=p+'%';lpct.textContent=String(Math.round(p)).padStart(3,'0')}
function hideLoader(){loaderEl.classList.add('out');setTimeout(()=>{loaderEl.style.display='none';revealHero()},1200)}

/* cursor */
const cur=document.getElementById('cur');
const ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
if(cur && ring){
  document.querySelectorAll('a,button,.faq-q,.sv-panel,.cs-row,.member,.step-card,.ph-card,.slide-menu-item,.slide-menu-social a').forEach(el=>{
    el.addEventListener('mouseenter',()=>cur.classList.add('big'));
    el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
  });
  (function animCur(){
    cur.style.left=mx+'px';cur.style.top=my+'px';
    rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(animCur);
  })();
}

/* slide menu */
const menuBtn=document.getElementById('menuBtn');
const slideMenu=document.getElementById('slideMenu');
const menuOverlay=document.getElementById('menuOverlay');
let menuOpen=false;
function toggleMenu(){
  if(!menuBtn || !slideMenu || !menuOverlay) return;
  menuOpen=!menuOpen;
  menuBtn.classList.toggle('active',menuOpen);
  slideMenu.classList.toggle('active',menuOpen);
  menuOverlay.classList.toggle('active',menuOpen);
}
function closeMenu(){
  if(!menuBtn || !slideMenu || !menuOverlay) return;
  menuOpen=false;
  menuBtn.classList.remove('active');
  slideMenu.classList.remove('active');
  menuOverlay.classList.remove('active');
}
if(menuBtn){
  menuBtn.addEventListener('click',toggleMenu);
}
if(menuOverlay){
  menuOverlay.addEventListener('click',closeMenu);
}
document.querySelectorAll('.slide-menu-item').forEach(item=>{
  item.addEventListener('click',closeMenu);
});

/* dark mode */
const darkModeBtn=document.getElementById('darkModeBtn');
const darkModeToggle=document.getElementById('darkModeToggle');
let sceneReady=false;

function updateSceneColors(){
  if(sceneReady && typeof scene!=='undefined' && typeof root!=='undefined'){
    const isDark=document.body.classList.contains('dark-mode');
    scene.background=new THREE.Color(isDark?0x0f0e0c:0xf5f3ef);
    root.traverse(c=>{
      if(c.isMesh && c.material){
        c.material.color.setHex(isDark?0xf5f3ef:0x0e0d0b);
      }
    });
    if(fogLayer && fogLayer.material && fogLayer.material.uniforms){
      fogLayer.material.uniforms.uColor.value.set(isDark?0x39322f:0xede8de);
    }
  }
}

function setupDarkMode(){
  const isDarkMode=localStorage.getItem('darkMode')==='true';
  if(isDarkMode){
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent='☀️';
  }
  darkModeBtn.addEventListener('click',e=>{
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    const isDark=document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode',isDark);
    darkModeToggle.textContent=isDark?'☀️':'🌙';
    updateSceneColors();
  });
}

/* nav scroll + progress bar */
const pb=document.getElementById('progress-bar');
window.addEventListener('scroll',()=>{
  const doc=document.documentElement;
  const pct=(doc.scrollTop/(doc.scrollHeight-doc.clientHeight))*100;
  pb.style.width=pct+'%';
},{passive:true});

/* hero reveal */
function revealHero(){
  document.querySelector('.hero-eyebrow span').classList.add('up');
  document.querySelectorAll('.hero-title .wd').forEach(w=>w.classList.add('up'));
  document.querySelector('.hero-desc span').classList.add('up');
  document.getElementById('sh').classList.add('up');
}

/* scroll reveal */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
},{threshold:0.04});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* FAQ */
document.addEventListener('click',e=>{
  const q=e.target.closest('.faq-q');
  if(q){const item=q.closest('.faq-item');if(item)item.classList.toggle('open')}
});

/* horizontal scroll */
const hst=document.getElementById('hst');
const hFill=document.getElementById('hFill');
const hLbl=document.getElementById('hLbl');
const panels = hst ? hst.querySelectorAll('.sv-panel') : [];
let hIdx=0;
function goHPanel(i){
  if (!hst || !hFill || !hLbl || panels.length === 0) return;
  hIdx=Math.max(0,Math.min(panels.length-1,i));
  const w=panels[0].offsetWidth;
  hst.style.transform=`translateX(${-hIdx*w}px)`;
  hFill.style.width=((hIdx+1)/panels.length*100)+'%';
  hLbl.textContent=`0${hIdx+1} / 0${panels.length}`;
}
const hNextBtn = document.getElementById('hNext');
const hPrevBtn = document.getElementById('hPrev');
if (hNextBtn) hNextBtn.addEventListener('click',()=>goHPanel(hIdx+1));
if (hPrevBtn) hPrevBtn.addEventListener('click',()=>goHPanel(hIdx-1));
let hDragStart=null;
const hso=document.getElementById('hso');
if (hso) {
  hso.addEventListener('mousedown',e=>{hDragStart=e.clientX});
  hso.addEventListener('mouseup',e=>{if(hDragStart!==null){const d=hDragStart-e.clientX;if(Math.abs(d)>50)goHPanel(hIdx+(d>0?1:-1));hDragStart=null}});
  hso.addEventListener('touchstart',e=>{hDragStart=e.touches[0].clientX},{passive:true});
  hso.addEventListener('touchend',e=>{if(hDragStart!==null){const d=hDragStart-e.changedTouches[0].clientX;if(Math.abs(d)>50)goHPanel(hIdx+(d>0?1:-1));hDragStart=null}},{passive:true});
}

/* THREE scene */
const scene=new THREE.Scene();
scene.background=new THREE.Color(0xf5f3ef);
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,0.1,200);
camera.position.set(0,1.5,7.5);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
if(THREE.sRGBEncoding!==undefined){renderer.outputEncoding=THREE.sRGBEncoding}else{renderer.outputColorSpace=THREE.SRGBColorSpace}
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.0;
document.body.appendChild(renderer.domElement);
const composer=new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bokeh=new BokehPass(scene,camera,{focus:5,aperture:0.00006,maxblur:0.004,width:innerWidth,height:innerHeight});
composer.addPass(bokeh);
const root=new THREE.Group();scene.add(root);

const fogLayer = (() => {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uColor: { value: new THREE.Color(0xede8de) },
      uScale: { value: 2.8 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uIntensity;
      uniform float uScale;
      uniform vec3 uColor;
      float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = rand(i);
        float b = rand(i + vec2(1.0, 0.0));
        float c = rand(i + vec2(0.0, 1.0));
        float d = rand(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      void main(){
        vec2 p = vUv * uScale + vec2(uTime * 0.18, uTime * 0.14);
        float n = noise(p * 1.8) * 0.55 + noise(p * 3.9) * 0.3;
        float mask = smoothstep(0.22, 0.75, n + sin(vUv.y * 6.0 + uTime * 0.95) * 0.18);
        float alpha = pow(mask, 1.8) * uIntensity * 0.55;
        alpha *= smoothstep(0.82, 0.1, abs(vUv.y - 0.5) * 1.4);
        gl_FragColor = vec4(uColor, alpha);
      }
    `
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14, 8, 8), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, 2.0, 1.9);
  mesh.renderOrder = 999;
  mesh.frustumCulled = false;
  return mesh;
})();
scene.add(fogLayer);

let ready=false;
const clk=new THREE.Clock();
const d2r=THREE.MathUtils.degToRad;
const kfs=[
  {p:new THREE.Vector3(0.04,-0.30,-0.70),r:new THREE.Vector3(14,72,0)},
  {p:new THREE.Vector3(0.47,0.60,2.00),r:new THREE.Vector3(10,200,10)},
  {p:new THREE.Vector3(-0.50,0.19,1.05),r:new THREE.Vector3(10,140,10)},
  {p:new THREE.Vector3(-1.71,0.83,2.55),r:new THREE.Vector3(10,140,10)},
  {p:new THREE.Vector3(-0.01,0.72,3.30),r:new THREE.Vector3(-63.9,167,10)},
  {p:new THREE.Vector3(-0.01,0.72,3.30),r:new THREE.Vector3(-90,272,10)},
  {p:new THREE.Vector3(0.06,-0.20,0.00),r:new THREE.Vector3(7.6,42.8,10)},
];
function buildTracks(){
  const x=[],y=[],z=[];
  let px=kfs[0].r.x,py=kfs[0].r.y,pz=kfs[0].r.z;
  x.push(px);y.push(py);z.push(pz);
  for(let i=1;i<kfs.length;i++){
    let nx=kfs[i].r.x,ny=kfs[i].r.y,nz=kfs[i].r.z;
    while(nx-px>180)nx-=360;while(nx-px<-180)nx+=360;
    while(ny-py>180)ny-=360;while(ny-py<-180)ny+=360;
    while(nz-pz>180)nz-=360;while(nz-pz<-180)nz+=360;
    x.push(nx);y.push(ny);z.push(nz);px=nx;py=ny;pz=nz;
  }
  return{x,y,z};
}
const tr=buildTracks();
function catmull(p0,p1,p2,p3,t){const t2=t*t,t3=t2*t;return 0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3)}
const sP=new THREE.Vector3(),sE=new THREE.Euler(0,0,0,'XYZ'),sQ=new THREE.Quaternion();
function samplePath(p01){
  const max=kfs.length-1;
  const sf=THREE.MathUtils.clamp(p01,0,1)*max;
  const si=Math.min(Math.floor(sf),max-1);
  const t=sf-si;
  const g=i=>Math.max(0,Math.min(max,i));
  sP.set(
    catmull(kfs[g(si-1)].p.x,kfs[si].p.x,kfs[g(si+1)].p.x,kfs[g(si+2)].p.x,t),
    catmull(kfs[g(si-1)].p.y,kfs[si].p.y,kfs[g(si+1)].p.y,kfs[g(si+2)].p.y,t),
    catmull(kfs[g(si-1)].p.z,kfs[si].p.z,kfs[g(si+1)].p.z,kfs[g(si+2)].p.z,t)
  );
  sE.set(
    d2r(catmull(tr.x[g(si-1)],tr.x[si],tr.x[g(si+1)],tr.x[g(si+2)],t)),
    d2r(catmull(tr.y[g(si-1)],tr.y[si],tr.y[g(si+1)],tr.y[g(si+2)],t)),
    d2r(catmull(tr.z[g(si-1)],tr.z[si],tr.z[g(si+1)],tr.z[g(si+2)],t))
  );
  sQ.setFromEuler(sE);
}
function fitModel(r){
  const box=new THREE.Box3().setFromObject(r);
  const sz=new THREE.Vector3(),cn=new THREE.Vector3();
  box.getSize(sz);box.getCenter(cn);
  r.position.sub(cn);
  const md=Math.max(sz.x,sz.y,sz.z);
  const sc=md>0?3/md:1;
  r.scale.setScalar(sc);
  camera.position.set(0,Math.max(0.85,sz.y*sc*0.42),Math.max(3.1,md*sc*1.25));
  camera.lookAt(0,0,0);
}
function loadMainModel(src,onLoad,onProg,onErr){
  const c=src.split('?')[0].toLowerCase();
  if(c.endsWith('.obj')){new OBJLoader().load(src,onLoad,onProg,onErr);return}
  if(c.endsWith('.fbx')){new FBXLoader().load(src,onLoad,onProg,onErr);return}
  new GLTFLoader().load(src,gltf=>onLoad(gltf.scene||gltf.scenes[0]),onProg,onErr);
}

/* Lenis */
const lenis=new Lenis({
  duration:1.8,
  easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),
  smoothWheel:true,
  wheelMultiplier:0.65,
  touchMultiplier:0.9,
  syncTouch:true
});
let sTgt=0,sPrg=0,sVel=0;
const spacerEl=document.querySelector('.spacer');
function getRange(){return Math.max(innerHeight,spacerEl?spacerEl.offsetHeight:innerHeight*9)}
lenis.on('scroll',({scroll,velocity,direction})=>{
  const base=THREE.MathUtils.clamp(scroll/getRange(),0,1);
  const vo=THREE.MathUtils.clamp(Math.abs(velocity)*0.001,0,0.04);
  sTgt=THREE.MathUtils.clamp(base+(direction>=0?vo:-vo),0,1);
  sVel=velocity;
  document.getElementById('hero').classList.toggle('gone',base>0.025);
  const t1=document.getElementById('t1');
  const t2=document.getElementById('t2');
  if(t1)t1.style.transform=`translateX(${-scroll*0.14}px)`;
  if(t2)t2.style.transform=`translateX(${scroll*0.09}px)`;
});
(function lr(t){lenis.raf(t);requestAnimationFrame(lr)})(0);

let mpx=0,mpy=0,prx=0,pry=0;
document.addEventListener('mousemove',e=>{mpx=(e.clientX-innerWidth/2)/(innerWidth/2)*0.12;mpy=(e.clientY-innerHeight/2)/(innerHeight/2)*0.12},{passive:true});

setLoad(10);
loadMainModel('models/scene.glb',
  model=>{
    setLoad(88);
    model.traverse(c=>{
      if(c.isMesh){
        c.material=new THREE.MeshBasicMaterial({color:0x0e0d0b,wireframe:true,wireframeLinewidth:0.6,side:THREE.DoubleSide,opacity:0.65,transparent:true});
      }
    });
    root.add(model);
    fitModel(model);
    const k=kfs[0];
    root.position.copy(k.p);
    root.rotation.set(d2r(k.r.x),d2r(k.r.y),d2r(k.r.z));
    ready=true;
    sceneReady=true;
    setLoad(100);
    setTimeout(hideLoader,500);
    setupDarkMode();
    updateSceneColors();
  },
  xhr=>{if(xhr.total)setLoad(10+(xhr.loaded/xhr.total)*78)},
  err=>{console.warn(err);setLoad(100);setTimeout(hideLoader,400)}
);

(function tick(){
  requestAnimationFrame(tick);
  const dt = clk.getDelta();
  if(ready){
    const vs=THREE.MathUtils.clamp(Math.abs(sVel)*0.01,0,1);
    sPrg=THREE.MathUtils.lerp(sPrg,sTgt,THREE.MathUtils.lerp(0.04,0.18,vs));
    samplePath(sPrg);
    root.position.lerp(sP,0.09);
    prx=THREE.MathUtils.lerp(prx,mpy,0.05);
    pry=THREE.MathUtils.lerp(pry,mpx,0.05);
    const pQ=new THREE.Quaternion().setFromEuler(new THREE.Euler(prx,pry,0));
    sQ.multiplyQuaternions(pQ,sQ);
    root.quaternion.slerp(sQ,0.09);
    const p=root.position,r=root.rotation;
    document.getElementById('posR').textContent=`${p.x.toFixed(2)} ${p.y.toFixed(2)} ${p.z.toFixed(2)}`;
    document.getElementById('rotR').textContent=`${THREE.MathUtils.radToDeg(r.x).toFixed(1)}° ${THREE.MathUtils.radToDeg(r.y).toFixed(1)}°`;

    if(fogLayer){
      fogLayer.material.uniforms.uTime.value += dt * 0.45;
      const fogTarget = THREE.MathUtils.clamp(1 - Math.abs(root.position.z - 1.90) / 0.8, 0, 1);
      fogLayer.material.uniforms.uIntensity.value = THREE.MathUtils.lerp(fogLayer.material.uniforms.uIntensity.value, fogTarget, 0.12);
      fogLayer.position.set(root.position.x, root.position.y + 1.75, root.position.z - 0.5);
      const size = 5 + fogTarget * 5;
      fogLayer.scale.set(size, size, 1);
      fogLayer.visible = fogTarget > 0.02;
      if(bokeh && bokeh.material && bokeh.material.uniforms){
        bokeh.material.uniforms.focus.value = 5 + fogTarget * 1.6;
        bokeh.material.uniforms.maxblur.value = 0.004 + fogTarget * 0.018;
      }
    }
  }
  composer.render();
})();

window.addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
  composer.setSize(innerWidth,innerHeight);
  goHPanel(hIdx);
});
