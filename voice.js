document.getElementById("speak").onclick = () => {
  const text = document.getElementById("out").value.trim();
  if(!text) return;

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
};

document.getElementById("stop").onclick = () => {
  speechSynthesis.cancel();
};
