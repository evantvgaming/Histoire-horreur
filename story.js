const pick = (a) => a[Math.floor(Math.random() * a.length)];
const chance = (p) => Math.random() < p;

const bank = {
  lieux: [
    "un couloir trop long pour un appartement normal",
    "une cage d’escalier où les marches ne correspondent pas",
    "une chambre où les coins semblent avaler la lumière",
    "un parking souterrain sans niveau -1",
    "un immeuble où personne ne répond jamais"
  ],
  details: [
    "le silence semble volontaire",
    "l’air est plus froid près des murs",
    "tu te sens observé depuis l’angle mort",
    "un bourdonnement fin persiste",
    "le temps paraît légèrement décalé"
  ],
  sons: [
    "des pas uniquement quand tu t’arrêtes",
    "un chuchotement qui prononce ton prénom",
    "un grattement derrière une cloison",
    "un claquement sec, comme un ongle",
    "un souffle qui n’est pas le tien"
  ],
  objets: [
    "un miroir avec une demi-seconde de retard",
    "une photo où quelqu’un a été effacé",
    "un plan indiquant une pièce inexistante",
    "une clé sans serrure",
    "un message vocal… avec ta voix"
  ],
  menaces: [
    "une silhouette trop nette pour être une ombre",
    "quelque chose qui t’imite mal",
    "une présence qui corrige ton trajet",
    "un regard que tu sens sans le croiser",
    "un endroit que ton instinct refuse"
  ],
  motifs: [
    "trois coups, toujours au mauvais moment",
    "la phrase « Ne te retourne pas »",
    "un numéro qui revient partout",
    "la sensation d’être guidé vers une seule porte",
    "un détail qui change quand tu clignes des yeux"
  ],
  phrases: [
    "Le lieu semble te reconnaître.",
    "Ce n’est pas hostile. C’est patient.",
    "Tu n’es pas perdu. Tu es attendu.",
    "La peur s’installe lentement.",
    "Tout paraît normal. C’est ça le problème."
  ],
  twists: [
    "la sortie te ramène exactement au même endroit, avec un détail en moins",
    "tu retrouves une note écrite de ta main, datée de demain",
    "ton téléphone affiche un appel en cours… avec toi",
    "le plan que tu tiens est plus ancien que le bâtiment",
    "un voisin te salue par un ancien prénom que personne ne connaît"
  ]
};

const grammar = {
  intro: [
    "{H} arrive dans {L}. {D}.",
    "{L}. {H} sent immédiatement que quelque chose est faux.",
    "{H} entre. {PH}"
  ],
  intrusion: [
    "Puis {S}. {PH}",
    "{H} remarque {O}. {PH}",
    "Un détail revient: {M}. {PH}"
  ],
  escalation: [
    "{PH} {H} avance. {MN}. {D}.",
    "Le lieu réagit: {S}. {MN}.",
    "{H} tente de rationaliser… mais {M}."
  ],
  ending: [
    "Dernière minute: {T}.",
    "{T}. Et le silence devient assourdissant.",
    "{T}. Si cette histoire existe, c’est qu’on t’a laissé repartir."
  ]
};

function render(t, c) {
  return t
    .replaceAll("{H}", c.hero)
    .replaceAll("{L}", c.lieu)
    .replaceAll("{D}", c.detail)
    .replaceAll("{S}", c.son)
    .replaceAll("{O}", c.objet)
    .replaceAll("{MN}", c.menace)
    .replaceAll("{M}", c.motif)
    .replaceAll("{PH}", c.phrase)
    .replaceAll("{T}", c.twist);
}

function generateStory() {
  const heroInput = document.getElementById("hero").value.trim();
  const hero = heroInput || pick(["Evan","Noa","Lina","Sam","Alex","Mika"]);

  const ctx = {
    hero,
    lieu: pick(bank.lieux),
    detail: pick(bank.details),
    son: pick(bank.sons),
    objet: pick(bank.objets),
    menace: pick(bank.menaces),
    motif: pick(bank.motifs),
    phrase: pick(bank.phrases),
    twist: pick(bank.twists)
  };

  const scenes = [];
  scenes.push(render(pick(grammar.intro), ctx));
  ctx.phrase = pick(bank.phrases);
  scenes.push(render(pick(grammar.intrusion), ctx));
  ctx.detail = pick(bank.details);
  ctx.son = pick(bank.sons);
  ctx.phrase = pick(bank.phrases);
  scenes.push(render(pick(grammar.escalation), ctx));
  scenes.push(render(pick(grammar.ending), ctx));
  if (chance(0.8)) scenes.push("\nEt bien sûr… " + ctx.motif + ".");

  document.getElementById("out").value = scenes.join("\n\n");
}

function copyStory() {
  const t = document.getElementById("out").value;
  if(!t) return;
  navigator.clipboard.writeText(t).then(
    ()=> alert("Copié 👌"),
    ()=> alert("Copie refusée 😭")
  );
}

document.getElementById("gen").onclick = generateStory;
document.getElementById("copy").onclick = copyStory;

generateStory();
