// --- UI whispers + floating messages
const whisperEl = document.getElementById("whisper");
const msg = document.getElementById("msg");
const msgBody = document.getElementById("msgBody");

const whispers = [
  "Ne lis pas trop vite.",
  "Si tu entends un souffle… baisse le son.",
  "Tu peux arrêter. Oui.",
  "Le texte te regarde plus que tu ne le lis.",
  "Quelqu’un est déjà passé par ici."
];

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function setWhisper(){
  const w = pick(whispers);
  if(Math.random() < 0.35){
    const parts = w.split(" ");
    const i = Math.floor(Math.random()*parts.length);
    parts[i] = "<span>" + parts[i] + "</span>";
    whisperEl.innerHTML = "— " + parts.join(" ");
  } else {
    whisperEl.textContent = "— " + w;
  }
}
setWhisper();
setInterval(setWhisper, 7200);

let msgTimer = null;
function showMsg(text){
  msgBody.textContent = text;
  msg.classList.add("show");
  clearTimeout(msgTimer);
  msgTimer = setTimeout(()=> msg.classList.remove("show"), 3400);
}
setTimeout(()=> showMsg("Bienvenue. Évite de lire à voix haute."), 1800);
setTimeout(()=> showMsg("Si ça te semble normal… c’est volontaire."), 6200);

// --- Audio ambience (WebAudio)
let audioCtx;
let humOsc, humGain, noiseSrc, noiseGain, lfo, lfoGain;
let creepTimer = null;

const onBtn = document.getElementById("ambianceOn");
const offBtn = document.getElementById("ambianceOff");

function ensureAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function startAmbiance(){
  ensureAudio();
  if(humOsc) return;

  // Hum
  humOsc = audioCtx.createOscillator();
  humGain = audioCtx.createGain();
  humOsc.type = "sine";
  humOsc.frequency.value = 48;
  humGain.gain.value = 0.0001;
  humOsc.connect(humGain);
  humGain.connect(audioCtx.destination);

  // breathing LFO
  lfo = audioCtx.createOscillator();
  lfoGain = audioCtx.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 0.18;
  lfoGain.gain.value = 0.0013;
  lfo.connect(lfoGain);
  lfoGain.connect(humGain.gain);

  // Noise (wind / presence)
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++) data[i] = Math.random()*2-1;

  noiseSrc = audioCtx.createBufferSource();
  noiseGain = audioCtx.createGain();
  noiseSrc.buffer = buffer;
  noiseSrc.loop = true;
  noiseGain.gain.value = 0.0006;
  noiseSrc.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);

  humOsc.start();
  lfo.start();
  noiseSrc.start();

  // fade in
  const now = audioCtx.currentTime;
  humGain.gain.setValueAtTime(0.0001, now);
  humGain.gain.exponentialRampToValueAtTime(0.0036, now + 2.2);

  showMsg("Ambiance activée. Ne monte pas le volume.");
  // micro events
  creepTimer = setInterval(()=>{
    const t = audioCtx.currentTime;
    noiseGain.gain.setValueAtTime(0.0004, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0018, t + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.0006, t + 0.35);
  }, 7000 + Math.random()*6000);
}

function stopAmbiance(){
  if(!audioCtx) return;
  try{
    humOsc && humOsc.stop();
    lfo && lfo.stop();
    noiseSrc && noiseSrc.stop();
  }catch{}
  humOsc = lfo = noiseSrc = null;
  humGain = lfoGain = noiseGain = null;
  clearInterval(creepTimer);
  creepTimer = null;
  showMsg("Silence. C’est pire.");
}

onBtn.onclick = startAmbiance;
offBtn.onclick = stopAmbiance;

setInterval(() => {
  const out = document.getElementById("out");
  if (!out || !out.value) return;

  if (Math.random() < 0.15) {
    out.value = out.value.replace(
      /(.)/,
      (m) => Math.random() < 0.5 ? m.toUpperCase() : m
    );
  }
}, 8000);
