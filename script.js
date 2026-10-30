'use strict';

// Site estático: não há coleta de dados nem necessidade de servidor.
const photos = [
  {file:'foto-8.webp',title:'Aquela pose clássica',description:'As boas histórias começam cedo.',alt:'Júnior com um paletó preto, sorrindo e segurando cartas de baralho.'},
  {file:'foto-7.webp',title:'Uma noite pra guardar',description:'Tem comemoração que a memória guarda para sempre.',alt:'Júnior abraçando uma jovem de vestido rosa em uma festa.'},
  {file:'foto-4.webp',title:'Amizade tem cenário',description:'Pés na areia, coração leve e boas companhias.',alt:'Dois amigos lado a lado em uma praia ensolarada.'},
  {file:'foto-3.webp',title:'A música faz parte',description:'Sempre cabe mais uma canção e uma boa conversa.',alt:'Dois amigos juntos com um violão em uma comemoração.'},
  {file:'foto-2.webp',title:'Carinho de sobra',description:'Abraços são pequenos grandes acontecimentos.',alt:'Júnior abraçando um bebê enquanto estão sentados em um sofá.'},
  {file:'foto-1.webp',title:'Amigos e celebrações',description:'O tipo de lembrança que sempre arranca um sorriso.',alt:'Dois amigos sorrindo, vestidos socialmente, durante uma festa.'},
  {file:'foto-5.webp',title:'Afetos que acompanham',description:'Juntos, os dias ganham outro sentido.',alt:'Júnior em um retrato próximo, ao lado de uma mulher sorridente.'},
  {file:'foto-6.webp',title:'Sorriso que contagia',description:'A vida é feita desses momentos que aquecem o coração.',alt:'Júnior sorrindo em uma selfie junto de uma criança.'}
];

const $ = (selector) => document.querySelector(selector);
const photoPath = (file) => `assets/${file}`;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gallery = $('#galleryView');
const mainImage = $('#galleryPhoto');
const galleryBar = $('#galleryBar');
const lightbox = $('#lightbox');
const thumbnailContainer = $('#thumbnails');
let currentIndex = 0;
let autoTimer = null;
let photoTransitionTimer = null;
let progressDelay = null;
let toastTimer = null;

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3300);
}

function renderThumbnails() {
  photos.forEach((photo,index) => {
    const button = document.createElement('button');
    button.className = 'thumb';
    button.type = 'button';
    button.setAttribute('aria-label',`Mostrar foto ${index+1}: ${photo.title}`);
    button.setAttribute('aria-current', String(index===0));
    const img = document.createElement('img');
    img.src = photoPath(photo.file);
    img.alt = '';
    img.loading = 'lazy';
    button.appendChild(img);
    button.addEventListener('click', () => showPhoto(index));
    thumbnailContainer.appendChild(button);
  });
}

function displayPhoto(index) {
  const item = photos[index];
  mainImage.src = photoPath(item.file);
  mainImage.alt = item.alt;
  $('#galleryPhotoTitle').textContent = item.title;
  $('#galleryPhotoDesc').textContent = item.description;
  $('#galleryCounter').textContent = `${String(index+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
  thumbnailContainer.querySelectorAll('.thumb').forEach((el,i) => {
    el.setAttribute('aria-current',String(i===index));
  });
  if (lightbox.open) updateLightbox();
}

function showPhoto(index, fromAutoplay=false) {
  currentIndex = (index + photos.length) % photos.length;
  clearTimeout(photoTransitionTimer);
  if (prefersReducedMotion) {
    displayPhoto(currentIndex);
  } else {
    $('#openPhoto').classList.add('fade');
    photoTransitionTimer = setTimeout(() => {
      displayPhoto(currentIndex);
      $('#openPhoto').classList.remove('fade');
    }, 140);
  }
  restartAutoplay();
}

function stopAutoplay() {
  clearInterval(autoTimer);
  clearTimeout(progressDelay);
  autoTimer = null;
  galleryBar.style.transition = 'none';
  galleryBar.style.width = '0%';
}
function restartAutoplay() {
  stopAutoplay();
  if (prefersReducedMotion || document.hidden || lightbox.open || gallery.matches(':hover') || gallery.matches(':focus-within')) return;
  galleryBar.getBoundingClientRect(); // reinicia a barra de progresso
  galleryBar.style.transition = 'width 7000ms linear';
  progressDelay = setTimeout(() => {galleryBar.style.width = '100%';}, 25);
  autoTimer = setInterval(() => showPhoto(currentIndex+1, true), 7000);
}

function updateLightbox() {
  const item = photos[currentIndex];
  $('#lightboxImage').src = photoPath(item.file);
  $('#lightboxImage').alt = item.alt;
  $('#lightboxCaption').textContent = `${currentIndex+1} / ${photos.length} — ${item.title}`;
}
function openLightbox() {
  clearTimeout(photoTransitionTimer);
  $('#openPhoto').classList.remove('fade');
  displayPhoto(currentIndex);
  updateLightbox();
  stopAutoplay();
  if (!lightbox.open) lightbox.showModal();
  $('#closeLightbox').focus();
}
function closeLightbox() {if (lightbox.open) lightbox.close();}

// Swipe no carrossel e na fotografia ampliada.
function enableSwipe(element) {
  let startX = null;
  element.addEventListener('touchstart',ev => {
    startX = ev.changedTouches[0].screenX;
  },{passive:true});
  element.addEventListener('touchend',ev => {
    if (startX === null) return;
    const delta = ev.changedTouches[0].screenX - startX;
    startX = null;
    if (Math.abs(delta) > 55) showPhoto(currentIndex + (delta < 0 ? 1 : -1));
  },{passive:true});
}

renderThumbnails();
displayPhoto(0);
$('#prevPhoto').addEventListener('click',() => showPhoto(currentIndex-1));
$('#nextPhoto').addEventListener('click',() => showPhoto(currentIndex+1));
$('#openPhoto').addEventListener('click',openLightbox);
$('#closeLightbox').addEventListener('click',closeLightbox);
$('#lightboxPrev').addEventListener('click',() => showPhoto(currentIndex-1));
$('#lightboxNext').addEventListener('click',() => showPhoto(currentIndex+1));
lightbox.addEventListener('close',restartAutoplay);
lightbox.addEventListener('click',ev => {if (ev.target === lightbox) closeLightbox();});
gallery.addEventListener('mouseenter',stopAutoplay);
gallery.addEventListener('mouseleave',restartAutoplay);
gallery.addEventListener('focusin',stopAutoplay);
gallery.addEventListener('focusout',() => setTimeout(restartAutoplay,70));
document.addEventListener('visibilitychange',() => {if(document.hidden)stopAutoplay();else restartAutoplay();});
document.addEventListener('keydown',ev => {
  const typing = ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName);
  if (typing) return;
  if (ev.key === 'ArrowLeft' && (lightbox.open || gallery.contains(document.activeElement))) {ev.preventDefault();showPhoto(currentIndex-1);}
  if (ev.key === 'ArrowRight' && (lightbox.open || gallery.contains(document.activeElement))) {ev.preventDefault();showPhoto(currentIndex+1);}
});
enableSwipe(gallery);
enableSwipe(lightbox);
restartAutoplay();

// Pequenos bilhetes: abertura independente por toque/clique.
document.querySelectorAll('.wish-note').forEach(note => {
  note.addEventListener('click',() => {
    const open = !note.classList.contains('open');
    note.classList.toggle('open',open);
    note.setAttribute('aria-expanded',String(open));
  });
});

// Recados: apenas copiar ou abrir o aplicativo do usuário; não há envio a servidor.
function getWish() {return $('#personalWish').value.trim();}
$('#copyWish').addEventListener('click',async () => {
  const wish = getWish();
  if (!wish) {showToast('Escreva primeiro um recadinho especial. 💛');$('#personalWish').focus();return;}
  try {
    if(navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(wish);
    } else {
      const field=$('#personalWish');field.focus();field.select();
      if(!document.execCommand('copy')) throw new Error('Cópia não disponível');
      field.setSelectionRange(field.value.length,field.value.length);
    }
    showToast('Recado copiado! Agora é só enviar. 💌');
  } catch(err) {showToast('Selecione o texto e use Ctrl+C para copiar.');}
});
$('#shareWish').addEventListener('click',() => {
  const wish = getWish();
  if (!wish) {showToast('Escreva primeiro um recadinho especial. 💛');$('#personalWish').focus();return;}
  window.open(`https://wa.me/?text=${encodeURIComponent(wish)}`,'_blank','noopener,noreferrer');
});

// Brilhos feitos com CSS: sem bibliotecas externas.
function confetti(origin) {
  const x = origin?.x ?? window.innerWidth/2;
  const y = origin?.y ?? window.innerHeight*.38;
  const colors=['#ffd49e','#f48e81','#fff5e7','#a6dfd2','#e8aece','#e7ba70'];
  const count=prefersReducedMotion?15:105;
  for (let i=0; i<count; i++) {
    const p = document.createElement('span');
    const angle = Math.random()*Math.PI*2;
    const distance = (0.2+Math.random()*.8)*Math.min(720,window.innerWidth*.75);
    p.className='confetti-piece';
    p.style.setProperty('--x',x+'px');p.style.setProperty('--y',y+'px');
    p.style.setProperty('--color',colors[i%colors.length]);
    p.style.setProperty('--dx',Math.cos(angle)*distance+'px');
    p.style.setProperty('--dy',(Math.sin(angle)*distance+120)+'px');
    p.style.setProperty('--rotation',(360+Math.random()*920)+'deg');
    p.style.setProperty('--delay',(Math.random()*.22)+'s');
    p.style.setProperty('--duration',(1.4+Math.random()*1.35)+'s');
    p.style.width=(5+Math.random()*8)+'px';
    p.style.height=(7+Math.random()*11)+'px';
    document.body.appendChild(p);
    p.addEventListener('animationend',()=>p.remove(),{once:true});
    setTimeout(()=>p.remove(),3400);
  }
}
function burstFrom(element) {
  const r=element.getBoundingClientRect();
  confetti({x:r.left+r.width/2,y:r.top+r.height/2});
  showToast('Viva o Júnior! 37 anos de boas histórias! 🎉');
}
$('#navParty').addEventListener('click',ev=>burstFrom(ev.currentTarget));
$('#heroConfetti').addEventListener('click',ev=>burstFrom(ev.currentTarget));
let cakeTimer=null;
$('#makeWish').addEventListener('click',ev=>{
  $('#birthdayCake').classList.add('blown');
  burstFrom(ev.currentTarget);
  showToast('Pedido feito! Que venha um ano maravilhoso, Júnior! 🎂');
  clearTimeout(cakeTimer);
  cakeTimer=setTimeout(()=>$('#birthdayCake').classList.remove('blown'),4100);
});

// Detalhes animados e entrada suave ao rolar a página.
const starField=$('#starField');
for(let i=0;i<29;i++) {
  const star=document.createElement('span');
  star.className='star';
  star.textContent=i%4===0?'✦':'·';
  star.style.left=(3+((i*37)%94))+'%';
  star.style.top=(5+((i*23)%82))+'%';
  star.style.fontSize=(10+(i%5)*5)+'px';
  star.style.setProperty('--twinkle',(3+(i%4))+'s');
  star.style.setProperty('--delay',(-i*.32)+'s');
  starField.appendChild(star);
}
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    });
  },{threshold:.09,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
}
let scrolling=false;
window.addEventListener('scroll',()=>{
  if(scrolling)return;
  scrolling=true;
  requestAnimationFrame(()=>{
    const remaining=document.documentElement.scrollHeight-window.innerHeight;
    $('#pageProgress').style.width=((window.scrollY/Math.max(1,remaining))*100)+'%';
    scrolling=false;
  });
},{passive:true});
