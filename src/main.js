import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

const canvas=document.querySelector('#world'),veil=document.querySelector('#veil'),enter=document.querySelector('#enter');
const prompt=document.querySelector('#prompt'),status=document.querySelector('#status'),monitor=document.querySelector('#monitor');
const reader=document.querySelector('#reader'),readerTitle=document.querySelector('#reader-title'),readerAuthor=document.querySelector('#reader-author'),readerCopy=document.querySelector('#reader-copy');

const lowPower=matchMedia('(pointer:coarse)').matches||(navigator.deviceMemory&&navigator.deviceMemory<=4);
const renderer=new THREE.WebGLRenderer({canvas,antialias:!lowPower,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,lowPower?.8:1));renderer.setSize(innerWidth,innerHeight,false);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=2.05;

const scene=new THREE.Scene();scene.background=new THREE.Color(0x1b130e);scene.fog=new THREE.FogExp2(0x1b130e,.022);
const camera=new THREE.PerspectiveCamera(66,innerWidth/innerHeight,.1,55);
const clock=new THREE.Clock(),keys={},player=new THREE.Vector3(0,1.68,11),look={yaw:Math.PI,pitch:0};
camera.position.copy(player);scene.add(camera);
scene.add(new THREE.HemisphereLight(0xb49370,0x21150d,2.35));
const warmLight=new THREE.PointLight(0xf2c77b,42,21,2);warmLight.position.set(0,5,1);scene.add(warmLight);

const MAT={
 wood:new THREE.MeshStandardMaterial({color:0x3a2011,roughness:.8}),
 darkWood:new THREE.MeshStandardMaterial({color:0x1c0e08,roughness:.78}),
 leather:new THREE.MeshStandardMaterial({color:0x592024,roughness:.92}),
 brass:new THREE.MeshStandardMaterial({color:0x9a6a28,metalness:.7,roughness:.36}),
 paper:new THREE.MeshStandardMaterial({color:0xd8c699,roughness:.88}),
 candle:new THREE.MeshStandardMaterial({color:0xf2b85d,emissive:0xd97925,emissiveIntensity:2.5,roughness:.65})
};
const boxGeo=new THREE.BoxGeometry(1,1,1);
function box(w,h,d,material,x,y,z,parent=scene){const m=new THREE.Mesh(boxGeo,material);m.scale.set(w,h,d);m.position.set(x,y,z);parent.add(m);return m}
function roomShell(group,cx,cz,w,d,height=7){
 box(w,.2,d,MAT.wood,cx,0,cz,group);box(w,height,.25,MAT.darkWood,cx,height/2,cz-d/2,group);box(w,height,.25,MAT.darkWood,cx,height/2,cz+d/2,group);
 box(.25,height,d,MAT.darkWood,cx-w/2,height/2,cz,group);box(.25,height,d,MAT.darkWood,cx+w/2,height/2,cz,group);box(w,.18,d,MAT.darkWood,cx,height,cz,group);
}
const hall=new THREE.Group();scene.add(hall);roomShell(hall,0,0,18,25);
const rug=new THREE.Mesh(new THREE.PlaneGeometry(8,13),new THREE.MeshStandardMaterial({color:0x44212b,roughness:.96}));rug.rotation.x=-Math.PI/2;rug.position.set(0,.11,0);hall.add(rug);

function chair(x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;hall.add(g);box(2,.45,1.8,MAT.leather,0,.78,0,g);box(2,2.2,.35,MAT.leather,0,1.72,.67,g);for(const dx of [-.83,.83])box(.26,.75,1.65,MAT.wood,dx,.66,0,g);for(const dx of [-.82,.82])for(const dz of [-.63,.63])box(.18,.8,.18,MAT.darkWood,dx,.4,dz,g)}
chair(-4,1,.55);chair(4,1,-.55);chair(-4,-4,.9);chair(4,-4,-.9);
box(5,.22,2,MAT.wood,0,1.25,-1,hall);for(const x of [-2.1,2.1])for(const z of [-.75,.75])box(.2,1.2,.2,MAT.darkWood,x,.6,-1+z,hall);

function shelf(x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;hall.add(g);box(5.3,5.5,.34,MAT.darkWood,0,2.75,0,g);for(let y=1;y<5;y+=1.25)box(5.5,.13,.62,MAT.wood,0,y,.03,g);return g}
shelf(-8.2,-5.4,Math.PI/2);shelf(-8.2,2.3,Math.PI/2);shelf(8.2,-5.4,-Math.PI/2);shelf(8.2,2.3,-Math.PI/2);shelf(-5,-11,0);shelf(5,-11,0);
// Architectural detail is deliberately simple shared geometry: it makes the hall feel finished
// without introducing another model, texture or light-loading path.
for(const x of [-5.8,5.8]){box(.14,5.25,.1,MAT.brass,x,3.3,12.31,hall);box(3.3,.14,.1,MAT.brass,x,5.85,12.31,hall);box(3.3,.14,.1,MAT.brass,x,.72,12.31,hall);const windowGlow=box(2.8,4.75,.03,new THREE.MeshStandardMaterial({color:0x665137,emissive:0x49331d,emissiveIntensity:.42,roughness:.8}),x,3.3,12.28,hall);windowGlow.userData={kind:'window'}}
const hearth=new THREE.Group();hearth.position.set(0,0,11.95);hall.add(hearth);box(4.6,3.2,.42,MAT.darkWood,0,1.6,0,hearth);box(3.1,1.5,.05,new THREE.MeshStandardMaterial({color:0x24110a,emissive:0x9b3515,emissiveIntensity:.75,roughness:1}),0,1.15,-.24,hearth);box(4.95,.2,.86,MAT.wood,0,2.85,-.2,hearth);for(const x of [-1.45,1.45])box(.18,3.05,.5,MAT.brass,x,1.52,-.23,hearth);

const books=[
 ['The Picture of Dorian Gray','Oscar Wilde','There is no such thing as a moral or an immoral book. Books are well written, or badly written. That is all.'],
 ['The Time Machine','H. G. Wells','I have already told you that I had four dimensions. There are really four dimensions, three which we call the three planes of Space, and a fourth, Time.'],
 ['The Moonstone','Wilkie Collins','I am now to tell you what I know of the story of the Moonstone.'],
 ['The Secret Garden','Frances Hodgson Burnett','When Mary Lennox was sent to Misselthwaite Manor to live with her uncle everybody said she was the most disagreeable-looking child ever seen.']
];
const bookPositions=[],bookGeo=new THREE.BoxGeometry(.48,.76,.09),bookMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8}),bookMesh=new THREE.InstancedMesh(bookGeo,bookMat,96);
const dummy=new THREE.Object3D(),colours=[0x4d1b1d,0x273844,0x55401d,0x37233f,0x3f4d2c,0x63351f];
for(let shelfIndex=0;shelfIndex<4;shelfIndex++)for(let row=0;row<4;row++)for(let i=0;i<6;i++){const side=shelfIndex%2===0?-1:1,x=side*7.86,z=-5.1+shelfIndex*3.1+i*.01,y=1.5+row*1.25;dummy.position.set(x,y,z+(i-2.5)*.72);dummy.rotation.y=Math.PI/2;dummy.updateMatrix();const index=bookPositions.length;bookMesh.setMatrixAt(index,dummy.matrix);bookMesh.setColorAt(index,new THREE.Color(colours[index%colours.length]));bookPositions.push({position:dummy.position.clone(),book:books[index%books.length]})}
bookMesh.instanceMatrix.needsUpdate=true;bookMesh.instanceColor.needsUpdate=true;hall.add(bookMesh);

for(const [x,z] of [[-6,5],[6,5],[-6,-8],[6,-8]]){box(.17,1.2,.17,MAT.brass,x,.6,z,hall);box(.2,.28,.2,MAT.candle,x,1.33,z,hall)}
const portraitCanvas=document.createElement('canvas');portraitCanvas.width=256;portraitCanvas.height=360;const portraitInk=portraitCanvas.getContext('2d');portraitInk.fillStyle='#21191b';portraitInk.fillRect(0,0,256,360);portraitInk.fillStyle='#654038';portraitInk.beginPath();portraitInk.ellipse(132,138,49,65,.12,0,Math.PI*2);portraitInk.fill();portraitInk.fillStyle='#352226';portraitInk.beginPath();portraitInk.moveTo(62,344);portraitInk.lineTo(103,188);portraitInk.lineTo(161,188);portraitInk.lineTo(210,344);portraitInk.fill();portraitInk.fillStyle='#bb9254';portraitInk.globalAlpha=.65;portraitInk.fillRect(18,18,220,4);portraitInk.fillRect(18,338,220,4);const portraitTexture=new THREE.CanvasTexture(portraitCanvas);portraitTexture.colorSpace=THREE.SRGBColorSpace;
const portrait=new THREE.Mesh(new THREE.PlaneGeometry(2.5,3.4),new THREE.MeshStandardMaterial({map:portraitTexture,roughness:.72}));portrait.position.set(0,3.7,-12.3);hall.add(portrait);for(const [w,h,x,y] of [[2.9,.2,0,5.48],[2.9,.2,0,1.92],[.2,3.75,-1.35,3.7],[.2,3.75,1.35,3.7]])box(w,h,.16,MAT.brass,x,y,-12.38,hall);portrait.userData={kind:'door',title:'A portrait with an unfamiliar frame'};

let secretBuilt=false,secretRoom=null,activeRoom='Grand Hall';
function buildSecretRoom(){if(secretBuilt)return;secretBuilt=true;secretRoom=new THREE.Group();secretRoom.name='Secret Room';roomShell(secretRoom,0,-27,11,10,5.5);const secretLight=new THREE.PointLight(0x7d9b90,12,12,2);secretLight.position.set(0,3,-27);secretRoom.add(secretLight);for(let i=0;i<12;i++){const b=box(.52,.82,.1,new THREE.MeshStandardMaterial({color:colours[i%colours.length]}),-3.2+(i%6)*1.28,1.1,-29.2+Math.floor(i/6)*2.1,secretRoom);b.userData={kind:'book',book:books[i%books.length]}}box(3.2,.08,1.8,MAT.wood,0,1.25,-26,secretRoom);scene.add(secretRoom)}
function openBook(book){readerTitle.textContent=book[0];readerAuthor.textContent=book[1];readerCopy.textContent=book[2];reader.hidden=false;document.exitPointerLock?.()}
function interact(){if(!veil.classList.contains('leaving')||!reader.hidden)return;const nearest=bookPositions.reduce((best,item)=>item.position.distanceToSquared(player)<best.distance?{item,distance:item.position.distanceToSquared(player)}:best,{item:null,distance:6.5});if(nearest.item){openBook(nearest.item.book);return}if(activeRoom==='Grand Hall'&&player.distanceToSquared(new THREE.Vector3(0,1.68,-10.5))<15){buildSecretRoom();secretRoom.visible=true;player.set(0,1.68,-23);activeRoom='Secret Room';status.textContent=activeRoom;return}if(activeRoom==='Secret Room'){secretRoom.visible=false;player.set(0,1.68,9);activeRoom='Grand Hall';status.textContent=activeRoom}}

let monitorOn=false,last=performance.now(),frames=0,started=false;
function setPrompt(){if(!started||!reader.hidden){prompt.style.opacity=0;return}const nearDoor=activeRoom==='Grand Hall'&&player.distanceToSquared(new THREE.Vector3(0,1.68,-10.5))<15;const nearBook=bookPositions.some(item=>item.position.distanceToSquared(player)<6.5);prompt.textContent=nearDoor?'E  —  enter the hidden room':nearBook?'E  —  take a book':' ';prompt.style.opacity=(nearDoor||nearBook)?1:0}
function animate(now){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);if(started&&reader.hidden){const speed=keys.ShiftLeft?4.5:2.6;const forward=new THREE.Vector3(-Math.sin(look.yaw),0,-Math.cos(look.yaw)),right=new THREE.Vector3(-forward.z,0,forward.x),move=new THREE.Vector3();if(keys.KeyW)move.add(forward);if(keys.KeyS)move.sub(forward);if(keys.KeyA)move.sub(right);if(keys.KeyD)move.add(right);if(move.lengthSq()){move.normalize().multiplyScalar(speed*dt);player.add(move);const limit=activeRoom==='Grand Hall'?8.4:5;player.x=THREE.MathUtils.clamp(player.x,-limit,limit);player.z=activeRoom==='Grand Hall'?THREE.MathUtils.clamp(player.z,-11,11):THREE.MathUtils.clamp(player.z,-31.5,-22.5)}camera.position.copy(player);camera.rotation.set(look.pitch,look.yaw,0,'YXZ');setPrompt()}renderer.render(scene,camera);frames++;if(now-last>1000){if(monitorOn){const r=renderer.info.render;monitor.textContent=`${Math.round(frames*1000/(now-last))} FPS\n${r.calls} draw calls\n${Math.round(r.triangles/1000)}k triangles\nroom: ${activeRoom}`}last=now;frames=0}}
animate();

enter.addEventListener('click',()=>{started=true;veil.classList.add('leaving');canvas.requestPointerLock?.()});
document.addEventListener('keydown',event=>{keys[event.code]=true;if(event.code==='KeyE')interact();if(event.code==='F3'){event.preventDefault();monitorOn=!monitorOn;monitor.hidden=!monitorOn}});
document.addEventListener('keyup',event=>keys[event.code]=false);
document.addEventListener('mousemove',event=>{if(document.pointerLockElement!==canvas||!reader.hidden)return;look.yaw-=event.movementX*.0026;look.pitch=THREE.MathUtils.clamp(look.pitch-event.movementY*.0022,-1.35,1.35)});
document.querySelector('#close-reader').addEventListener('click',()=>{reader.hidden=true;canvas.requestPointerLock?.()});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)});
