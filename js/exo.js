/* =========================================================
   SECU3a — l'exercice du contrôle de l'an dernier
   Source : page 2 du CONTRÔLE SECU3a (photos du 15/10/2025).
   La page 1 (début de l'exercice 1) n'a pas été photographiée.
   L'énoncé est recopié tel quel ; la correction est proposée
   (pas de corrigé officiel), étape par étape.
   Types d'étape : choice (a = index) | num (v = valeur, tol, u = unité)
   ========================================================= */

const TABLE41A = `<table class="t41"><tr><th rowspan="2">Temps de coupure (s)</th><th colspan="2">50 V &lt; U<sub>0</sub> ≤ 120 V</th><th colspan="2">120 V &lt; U<sub>0</sub> ≤ 230 V</th><th colspan="2">230 V &lt; U<sub>0</sub> ≤ 400 V</th><th colspan="2">U<sub>0</sub> &gt; 400 V</th></tr>
<tr><th>alt.</th><th>cont.</th><th>alt.</th><th>cont.</th><th>alt.</th><th>cont.</th><th>alt.</th><th>cont.</th></tr>
<tr><td>Schéma TN ou IT</td><td>0,8</td><td>5</td><td>0,4</td><td>5</td><td>0,2</td><td>0,4</td><td>0,1</td><td>0,1</td></tr>
<tr><td>Schéma TT</td><td>0,3</td><td>5</td><td>0,2</td><td>0,4</td><td>0,07</td><td>0,2</td><td>0,04</td><td>0,1</td></tr></table>`;

const EXOS = [
{id:'e2', t:"Exercice 2 — Défaut d’isolement", sub:"Énoncé complet · 9 étapes guidées", ic:'⚡',
 enonce:`<p>Le schéma suivant représente une installation électrique alimentée par le réseau électrique classique : tension entre phases <i>U</i> de 400 V efficace et tension simple <i>V</i> de 230 V efficace et fréquence de 50 Hz. Le récepteur pour lequel un défaut d’isolement est constaté est placé dans un local dit sec de tension limite <i>U<sub>L</sub></i> de 25 V efficace. La résistance du défaut est <i>R<sub>d</sub></i> = 25 Ω.</p>
  <ol><li>Quel est le régime de neutre correspondant au schéma ci-dessus. Justifier.</li>
  <li>Faire un schéma équivalent du défaut. Exprimer et calculer la valeur du courant de défaut <i>I<sub>d</sub></i> (on considère que la personne ne touche pas la masse du récepteur). On prendra <i>R<sub>A</sub></i> = 20 Ω et <i>R<sub>B</sub></i> = 10 Ω.</li>
  <li>Exprimer et calculer la valeur de la tension <i>U<sub>c</sub></i> de contact à la masse du récepteur. Indiquer si cette tension est dangereuse. Justifier.</li>
  <li>Exprimer et calculer la valeur du courant d’électrisation <i>I<sub>c</sub></i> qui traverse l’opérateur si le défaut persiste et s’il touche la masse du récepteur. On prendra pour résistance du corps humain la valeur <i>R<sub>c</sub></i> = 2000 Ω. Indiquer si ce courant est dangereux. Justifier.</li>
  <li>Indiquer sur le schéma quel est le matériel qui protège en cas de défaut d’isolement ? Quel réglage est préconisé ? A partir du tableau 41A, donner le temps maximum de déclenchement.</li></ol>`,
 img:'exo2-schema.jpg',
 data:"V = 230 V · U<sub>L</sub> = 25 V · R<sub>d</sub> = 25 Ω · R<sub>A</sub> = 20 Ω · R<sub>B</sub> = 10 Ω · R<sub>c</sub> = 2000 Ω",
 steps:[
  {q:"<b>1°)</b> Quel est le régime de neutre ?", t:'choice', o:["TT","TN","IT"], a:0,
   h:"Regarde où va le neutre N du transformateur, et où vont les masses du récepteur.",
   e:"<b>Régime TT</b> : le neutre du transformateur est relié à la <b>terre</b> (par R<sub>B</sub>) et les masses du récepteur sont reliées à une <b>autre</b> prise de <b>terre</b> (R<sub>A</sub>). 1<sup>re</sup> lettre T = neutre à la terre, 2<sup>e</sup> lettre T = masses à la terre.",
   rep:"Régime TT : neutre relié à la terre (R<sub>B</sub>), masses reliées à la terre (R<sub>A</sub>)."},
  {q:"<b>2°)</b> Schéma équivalent : par où passe le courant de défaut I<sub>d</sub> ?", t:'choice',
   o:["Phase → R<sub>d</sub> → masse → R<sub>A</sub> → terre → R<sub>B</sub> → neutre : les 3 résistances en série, sous V = 230 V",
      "R<sub>d</sub> seule, sous U = 400 V",
      "R<sub>A</sub> et R<sub>B</sub> en parallèle, sous 230 V"], a:0,
   h:"Le défaut est entre <b>une</b> phase et la masse : la tension qui fait circuler le courant est la tension <b>simple</b>.",
   e:"Le courant part de la phase, traverse le défaut R<sub>d</sub>, arrive sur la masse, descend dans la terre par R<sub>A</sub>, remonte au neutre par R<sub>B</sub>. Une seule boucle → <b>R<sub>d</sub>, R<sub>A</sub>, R<sub>B</sub> en série</b> sous <b>V = 230 V</b>.",
   svg:true, rep:"Boucle : V = 230 V, R<sub>d</sub>, R<sub>A</sub> et R<sub>B</sub> en série."},
  {q:"<b>2°)</b> Calcule le courant de défaut <b>I<sub>d</sub></b>.", t:'num', v:230/55, tol:0.06, u:'A',
   h:"I<sub>d</sub> = V / (R<sub>d</sub> + R<sub>A</sub> + R<sub>B</sub>)",
   e:"I<sub>d</sub> = V / (R<sub>d</sub> + R<sub>A</sub> + R<sub>B</sub>) = 230 / (25 + 20 + 10) = 230 / 55 ≈ <b>4,18 A</b>.",
   rep:"I<sub>d</sub> = V / (R<sub>d</sub>+R<sub>A</sub>+R<sub>B</sub>) = 230/55 ≈ 4,18 A"},
  {q:"<b>3°)</b> Calcule la tension de contact <b>U<sub>c</sub></b> (entre la masse et la terre).", t:'num', v:20*230/55, tol:0.8, u:'V',
   h:"U<sub>c</sub> est la tension aux bornes de R<sub>A</sub> : U<sub>c</sub> = R<sub>A</sub> × I<sub>d</sub>",
   e:"U<sub>c</sub> = R<sub>A</sub> × I<sub>d</sub> = 20 × 4,18 ≈ <b>83,6 V</b>.",
   rep:"U<sub>c</sub> = R<sub>A</sub> × I<sub>d</sub> = 20 × 4,18 ≈ 83,6 V"},
  {q:"<b>3°)</b> Cette tension est-elle dangereuse ?", t:'choice',
   o:["Oui, car U<sub>c</sub> = 83,6 V > U<sub>L</sub> = 25 V","Non, car U<sub>c</sub> < 230 V","Non, car le local est sec"], a:0,
   h:"Compare U<sub>c</sub> à la tension limite de sécurité U<sub>L</sub> donnée dans l’énoncé.",
   e:"On compare à la tension limite : <b>U<sub>c</sub> = 83,6 V > U<sub>L</sub> = 25 V</b> → tension <b>dangereuse</b>, il faut couper.",
   rep:"Dangereuse : U<sub>c</sub> = 83,6 V > U<sub>L</sub> = 25 V."},
  {q:"<b>4°)</b> Calcule le courant d’électrisation <b>I<sub>c</sub></b> qui traverse l’opérateur (en mA).", t:'num', v:1000*(20*230/55)/2000, tol:1.2, u:'mA',
   h:"La personne est soumise à U<sub>c</sub> : I<sub>c</sub> = U<sub>c</sub> / R<sub>c</sub>. Attention aux unités : réponse en <b>mA</b>.",
   e:"I<sub>c</sub> = U<sub>c</sub> / R<sub>c</sub> = 83,6 / 2000 ≈ 0,0418 A = <b>41,8 mA</b>.<br><small>(Si on met la personne en parallèle avec R<sub>A</sub> dans la boucle, on trouve ≈ 41,6 mA : même conclusion.)</small>",
   rep:"I<sub>c</sub> = U<sub>c</sub> / R<sub>c</sub> = 83,6 / 2000 ≈ 41,8 mA"},
  {q:"<b>4°)</b> Ce courant est-il dangereux ?", t:'choice',
   o:["Oui : au-delà de 30 mA, paralysie respiratoire (et déjà contraction dès 10 mA)","Non : c’est moins de 1 A","Non : seul le courant continu est dangereux"], a:0,
   h:"Repense aux seuils de la Q13 et de la Q10 du QCM.",
   e:"41,8 mA > 30 mA → risque de <b>paralysie respiratoire</b> (et contraction musculaire dès 10 mA) : <b>dangereux</b>.",
   rep:"Dangereux : I<sub>c</sub> ≈ 42 mA > 30 mA (paralysie respiratoire)."},
  {q:"<b>5°)</b> Quel matériel protège en cas de défaut d’isolement, et quel réglage ?", t:'choice',
   o:["Le DDR associé à Q1, réglé à I<sub>Δn</sub> ≤ U<sub>L</sub> / R<sub>A</sub> = 25 / 20 = 1,25 A",
      "Le disjoncteur Q2 seul, sur le courant nominal",
      "Le fusible, calibré à 4,18 A"], a:0,
   h:"En TT, le courant de défaut est trop faible pour faire déclencher un disjoncteur : il faut un appareil qui mesure la différence entre le courant qui entre et celui qui sort.",
   e:"En TT, c’est le <b>DDR</b> (dispositif différentiel, le tore autour des conducteurs) qui commande l’ouverture de <b>Q1</b>. Réglage : la tension de contact doit rester sous U<sub>L</sub> → <b>I<sub>Δn</sub> ≤ U<sub>L</sub> / R<sub>A</sub> = 25 / 20 = 1,25 A</b>. On prend un calibre normalisé en dessous (1 A, 500 mA, 300 mA… et 30 mA pour protéger les personnes sur les prises).",
   rep:"DDR (associé à Q1), I<sub>Δn</sub> ≤ U<sub>L</sub>/R<sub>A</sub> = 1,25 A → calibre ≤ 1 A (ex. 30 mA)."},
  {q:"<b>5°)</b> D’après le tableau 41A, temps maximum de déclenchement ?", t:'choice', o:["0,2 s","0,4 s","0,07 s","5 s"], a:0,
   h:"Ligne <b>schéma TT</b>, colonne U<sub>0</sub> = <b>230 V</b> (donc 120 V < U<sub>0</sub> ≤ 230 V), <b>alternatif</b>.",
   e:"Schéma <b>TT</b>, U<sub>0</sub> = 230 V → colonne « 120 V < U<sub>0</sub> ≤ 230 V », alternatif → <b>0,2 s</b>. Piège : 0,4 s, c’est la ligne TN/IT.",
   table:true, rep:"Tableau 41A, TT, 120 V < U<sub>0</sub> ≤ 230 V, alternatif : 0,2 s."}
 ]},

{id:'e1', t:"Exercice 1 — Double défaut (incomplet)", sub:"Seule la fin de l’énoncé est sur les photos", ic:'🧩', partial:true,
 enonce:`<p class="tip">⚠️ La <b>page 1</b> du SECU3a (début de l’exercice 1) n’a <b>pas été photographiée</b>. On ne voit que la fin de la dernière question :</p>
  <p><i>« …passe-t-il lors de ce double défaut ? Justifier. A partir du tableau 41A en page suivante, donner le temps maximum de déclenchement dans le cas du double défaut. »</i></p>
  <p>Un « double défaut » se traite en régime <b>IT</b> (au 1<sup>er</sup> défaut on ne coupe pas, au 2<sup>e</sup> défaut sur une autre phase, ça fait un court-circuit). Demande la page 1 à quelqu’un de ta promo pour avoir l’énoncé complet.</p>`,
 steps:[
  {q:"En régime IT, que se passe-t-il au <b>deuxième</b> défaut (sur une autre phase) ?", t:'choice',
   o:["Un court-circuit entre phases, coupé par les protections contre les surintensités (disjoncteur)","Rien, on continue comme au premier défaut","Le DDR 30 mA déclenche toujours en premier"], a:0,
   h:"Au 1<sup>er</sup> défaut, le neutre isolé empêche le courant de circuler. Au 2<sup>e</sup>, il y a un chemin direct entre deux phases.",
   e:"Deux phases sont reliées par les masses : c’est un <b>court-circuit</b>, le régime IT se comporte alors comme le TN et ce sont les <b>disjoncteurs</b> qui coupent. (Raisonnement de cours : l’énoncé exact manque.)",
   rep:"2<sup>e</sup> défaut = court-circuit entre phases → coupé par le disjoncteur, comme en TN."},
  {q:"Tableau 41A, ligne <b>TN ou IT</b>, U<sub>0</sub> = 230 V alternatif : temps maximum ?", t:'choice', o:["0,4 s","0,2 s","0,8 s","5 s"], a:0, doute:true,
   h:"Ligne « Schéma TN ou IT », colonne « 120 V < U<sub>0</sub> ≤ 230 V », alternatif.",
   e:"Ligne <b>TN ou IT</b>, 120 V < U<sub>0</sub> ≤ 230 V, alternatif → <b>0,4 s</b>. ⚠️ Ça dépend des données de la page 1 qu’on n’a pas (valeur de U<sub>0</sub>, neutre distribué ou non) : à vérifier.",
   table:true, rep:"Ligne TN/IT, 230 V alternatif : 0,4 s (si U<sub>0</sub> = 230 V)."}
 ]}
];
