/* =========================================================
   SECU3 — Fiches mémo
   Uniquement les notions demandées dans les 40 questions du
   contrôle. La liste question → réponse de chaque partie est
   ajoutée automatiquement par app.js sous ces fiches.
   ========================================================= */

const COURSE = {

c1: [
 {t:"Le réseau 230 / 400 V — 50 Hz (Q1, Q2)", h:`
  <table><tr><th>Grandeur</th><th>Valeur</th></tr>
  <tr><td>Tension <b>simple</b> V (phase ↔ neutre)</td><td><b>230 V</b></td></tr>
  <tr><td>Tension <b>composée</b> U (phase ↔ phase)</td><td><b>400 V</b> = 230 × √3</td></tr>
  <tr><td>Fréquence</td><td>50 Hz</td></tr>
  <tr><td>Période T = 1/f</td><td><b>20 ms</b></td></tr></table>
  <p class="tip">230 et 400 sont déjà des valeurs <b>efficaces</b> : ne jamais diviser par √2.</p>`},

 {t:"Couleurs des conducteurs (Q3)", h:`
  <ul><li><b>Bleu</b> = neutre</li><li><b>Vert / jaune</b> = protection (terre)</li><li>Noir, marron, rouge… = phases</li></ul>`},

 {t:"Qui fait quoi : les appareils (Q4, Q5)", h:`
  <table><tr><th>Appareil</th><th>Fonction</th></tr>
  <tr><td>Fusible</td><td>Protéger contre les <b>surintensités</b></td></tr>
  <tr><td>Contacteur</td><td><b>Interrompre ou mettre en service</b> un circuit (commande)</td></tr>
  <tr><td>Sectionneur</td><td><b>Isoler</b> un circuit de sa source</td></tr>
  <tr><td>Relais thermique</td><td>Surcharges</td></tr>
  <tr><td>Magnétique</td><td>Courts-circuits</td></tr></table>`},

 {t:"Les 4 symboles du sujet (Q6 à Q9)", h:`
  <div class="symgrid">
   <div><img src="assets/img/symbole-q6.svg" alt=""><b>Demi-cercle</b><small>Contacteur (Q6)</small></div>
   <div><img src="assets/img/symbole-q7.svg" alt=""><b>Petit rond</b><small>Interrupteur (Q7)</small></div>
   <div><img src="assets/img/symbole-q8.svg" alt=""><b>Crochet arrondi</b><small>Courts-circuits (Q8)</small></div>
   <div><img src="assets/img/symbole-q9.svg" alt=""><b>Créneau carré</b><small>Surcharges (Q9)</small></div>
  </div>
  <p class="tip"><b>Carré = chaleur = surcharge</b> · <b>Rond = magnétique = court-circuit</b>. Sur un contact : demi-cercle = contacteur, croix = disjoncteur, trait = sectionneur.</p>`}
],

c2: [
 {t:"Le courant dans le corps humain (Q10, Q13)", h:`
  <table><tr><th>Courant alternatif</th><th>Effet</th></tr>
  <tr><td>0,5 mA</td><td>Perception</td></tr>
  <tr><td><b>10 mA</b></td><td><b>Contraction musculaire</b> (on ne peut plus lâcher)</td></tr>
  <tr><td><b>30 mA</b></td><td>Paralysie respiratoire → <b>DDR 30 mA</b> sur les prises</td></tr>
  <tr><td>≈ 75-100 mA</td><td>Fibrillation cardiaque</td></tr></table>`},

 {t:"Indice IP et classe II (Q11, Q12, Q14)", h:`
  <ul><li>IP <b>1<sup>er</sup> chiffre</b> = solides · <b>2<sup>e</sup> chiffre</b> = <b>liquides</b></li>
  <li>Minimum NF C 18-510 en BT : <b>IP2x</b> (le doigt ne touche pas)</li>
  <li><b>Classe II</b> = <b>double isolation</b>, pas de partie métallique accessible, <b>pas de terre</b></li></ul>`},

 {t:"Domaines de tension (Q15, Q16)", h:`
  <table><tr><th>Domaine</th><th>Alternatif</th><th>Continu</th></tr>
  <tr><td>TBT</td><td>≤ 50 V</td><td>≤ <b>120 V</b></td></tr>
  <tr><td>BT</td><td>≤ 1 000 V</td><td>≤ 1 500 V</td></tr>
  <tr><td>HTA</td><td>≤ 50 kV</td><td>≤ 75 kV</td></tr>
  <tr><td>HTB</td><td>&gt; <b>50 kV</b></td><td>&gt; 75 kV</td></tr></table>
  <p class="tip">63 kV alternatif → <b>HTB</b>. 100 V <b>continu</b> → <b>TBT</b> (piège !).</p>`},

 {t:"Régimes de neutre et tension limite (Q17 à Q19)", h:`
  <table><tr><th>Régime</th><th>Masses</th><th>Protège les personnes</th></tr>
  <tr><td><b>TT</b></td><td>Obligatoirement à la <b>terre</b></td><td>Différentiel (DDR)</td></tr>
  <tr><td><b>TN</b></td><td>Reliées au <b>neutre</b></td><td><b>Disjoncteur</b> (le défaut = court-circuit)</td></tr></table>
  <p>Tension limite de sécurité U<sub>L</sub> (alternatif) : <b>50 V</b> local sec · <b>25 V</b> local <b>humide</b> · 12 V dans l’eau.</p>`}
],

c3: [
 {t:"Les habilitations du sujet (Q20, Q26 à Q32)", h:`
  <p>Le titre est délivré par <b>l’employeur</b>.</p>
  <table><tr><th>Symbole</th><th>Ce qu’il peut faire</th></tr>
  <tr><td><b>B0 / H0</b></td><td>Non électricien (H = haute tension)</td></tr>
  <tr><td><b>B1 / B1V</b></td><td>Exécutant de <b>travaux</b> (V = au voisinage)</td></tr>
  <tr><td><b>B2 / B2V</b></td><td>Chargé de <b>travaux</b></td></tr>
  <tr><td><b>BS</b></td><td>Interventions <b>élémentaires</b> (circuits ≤ 32 A ?)</td></tr>
  <tr><td><b>BR</b></td><td>Interventions <b>générales</b> : maintenance, dépannage, essais… Peut consigner <b>pour lui-même</b></td></tr>
  <tr><td><b>BC</b></td><td><b>Consignation</b> pour des <b>tiers</b></td></tr>
  <tr><td><b>BE</b></td><td>Essais, mesures, vérifications</td></tr></table>`},

 {t:"Distances, zones et EPI (Q21, Q22, Q24, Q25)", h:`
  <ul><li><b>DMA en BT = 0,30 m</b></li>
  <li>Zone de voisinage <b>simple</b> BT : il faut être habilité (ex. <b>B1V</b>), jamais seul et non habilité</li>
  <li>Zone de voisinage <b>renforcé</b> BT (Z4) : <b>BR</b> (pas B0, pas BS)</li>
  <li>En Z4 : <b>gants classe 0 + écran facial</b></li></ul>`},

 {t:"Face à un électrisé (Q23)", h:`
  <p class="tip"><b>1. Couper le courant</b> (ou le faire couper) → 2. dégager → 3. alerter.</p>`}
],

c4: [
 {t:"La consignation (Q33)", h:`
  <ol><li><b>Séparation</b></li><li><b>Condamnation</b></li><li><b>Identification</b></li><li><b>VAT</b></li><li><b>Mise à la terre et en court-circuit</b> (si nécessaire)</li></ol>
  <p class="tip">« <b>S</b>i <b>Ç</b>a <b>I</b>tère, <b>V</b>érifie <b>M</b>ieux » = S · C · I · V · M</p>`},

 {t:"La VAT (Q34)", h:`
  <p>Uniquement avec un <b>VAT</b>. Multimètre, testeur et contrôleur : <b>aucun</b> ne convient.</p>`},

 {t:"Canalisations et investigation (Q35 à Q37)", h:`
  <ul><li>Canalisation enterrée, classe A souple : zone d’incertitude <b>0,50 m</b> (?)</li>
  <li>Ligne aérienne à conducteurs nus : <b>DLI = 50 m</b> (?)</li>
  <li>Dans la zone d’investigation : <b>analyser</b> si l’opération peut exposer au risque électrique</li></ul>`},

 {t:"HT, essais, connexions (Q38 à Q40)", h:`
  <ul><li>Voisinage renforcé HT : <b>H0V</b> (?), le seul avec l’indice <b>V</b></li>
  <li>Essais : <b>BR dans le cadre de ses interventions</b> (?)</li>
  <li>Connexion/déconnexion sous tension : jusqu’à <b>6 mm² cuivre</b> (?)</li></ul>
  <p class="tip">(?) = pas de corrigé officiel : à vérifier avec le cours ou le prof.</p>`}
]
};
