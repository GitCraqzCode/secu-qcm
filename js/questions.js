/* =========================================================
   SECU3 — Banque de questions
   Source : CONTRÔLE SECU3, IUT de Blagnac, GIM S3, 2025-2026
   (photos du 15/10/2025, zip QuickShare). 40 questions, 5 pages.
   La page 4 (Q29 à Q36) n'a pas été photographiée : elle a été
   relue par transparence au dos de la page 3.
   ---------------------------------------------------------
   Les questions et les options sont recopiées telles quelles,
   dans l'ordre de la feuille. Rien n'a été ajouté.
   Les réponses ne viennent PAS d'un corrigé officiel :
   doute:true = réponse à vérifier avec le cours ou le prof.
   ---------------------------------------------------------
   Types : qcm (1 bonne rép.) | order (remise en ordre)
   Champs : n=numéro sur le sujet, p=page, c=chapitre, d=difficulté,
            i=image, e=explication,
            init=ordre des étapes tel qu'imprimé sur la feuille (Q33)
   ========================================================= */

const CHAPTERS = [
  { id:'c1', n:'1', t:'Réseau et appareillage',          short:'Appareillage', ic:'🔌', col:'#38bdf8',
    sub:'Questions 1 à 9 : tension, période, neutre, fusible, contacteur, symboles' },
  { id:'c2', n:'2', t:'Protection et domaines de tension', short:'Protection',  ic:'🛡️', col:'#f472b6',
    sub:'Questions 10 à 19 : DDR, IP, corps humain, classe II, HTA/HTB/BT/TBT, régimes TT et TN' },
  { id:'c3', n:'3', t:'Habilitations et zones',          short:'Habilitations', ic:'🪪', col:'#a78bfa',
    sub:'Questions 20 à 32 : titre, DMA, zones de voisinage, B0, BS, BR, BC, B1V, B2V, EPI' },
  { id:'c4', n:'4', t:'Consignation et réseaux',          short:'Consignation', ic:'🔒', col:'#fbbf24',
    sub:'Questions 33 à 40 : consignation, VAT, canalisations, zone d’investigation, HT, essais' }
];

const LABELDIM = {};

const QUESTIONS = [

/* ══════════ PAGE 1 ══════════ */

{n:1,p:1,c:'c1',t:'qcm',d:1,q:"On dispose d’un réseau triphasé 230 / 400 V de fréquence 50 Hz. La tension efficace <b>entre phases</b> est de :",
 o:["230 V","230/√2 V","400 V","400/√2 V"], a:2,
 e:"Dans « 230 / 400 V », le premier chiffre est la tension <b>simple</b> (entre une phase et le neutre) et le second la tension <b>composée</b> (entre deux phases). Entre phases : <b>400 V</b>. Ce sont déjà des valeurs efficaces, on ne divise pas par √2. (400 = 230 × √3.)"},

{n:2,p:1,c:'c1',t:'qcm',d:1,q:"La période du réseau EDF est de :",
 o:["2 ms","20 ms","200 ms","2000 ms"], a:1,
 e:"f = 50 Hz donc T = 1/f = 1/50 = 0,02 s = <b>20 ms</b>."},

{n:3,p:1,c:'c1',t:'qcm',d:1,q:"D’après la norme NF C 15-100, la couleur du conducteur de neutre est :",
 o:["Noir","Rouge","Bleu","Vert / jaune"], a:2,
 e:"Neutre = <b>bleu</b>. Vert/jaune = conducteur de protection (terre), réservé à cet usage. Les phases : noir, rouge, marron…"},

{n:4,p:1,c:'c1',t:'qcm',d:1,q:"Quelle est la fonction d’un fusible ?",
 o:["Protéger contre les surtensions","Protéger contre les surintensités","Isoler un circuit de sa source","Interrompre ou mettre en service un circuit électrique"], a:1,
 e:"Le fusible fond quand le <b>courant</b> est trop fort : il protège contre les <b>surintensités</b> (surcharges et courts-circuits). Il ne protège pas contre les surtensions (c’est le rôle d’un parafoudre)."},

{n:5,p:1,c:'c1',t:'qcm',d:1,q:"Quelle est la fonction d’un contacteur ?",
 o:["Protéger contre les courts-circuits","Protéger contre les surcharges","Isoler un circuit de sa source","Interrompre ou mettre en service un circuit électrique"], a:3,
 e:"Le contacteur est un appareil de <b>commande</b> : il ouvre et ferme le circuit (commandé par sa bobine). Il ne protège de rien. Isoler = sectionneur ; surcharges = relais thermique ; courts-circuits = fusible ou magnétique."},

{n:6,p:1,c:'c1',t:'qcm',d:2,i:'symbole-q6.svg',q:"Quel est le nom de l’appareil associé à ce symbole ?",
 o:["Sectionneur","Contacteur","Interrupteur","Disjoncteur"], a:1,
 e:"Le petit <b>demi-cercle</b> sur le contact (le « d ») est le signe de la fonction <b>contacteur</b>. À retenir : demi-cercle = contacteur, croix = disjoncteur, trait = sectionneur."},

{n:7,p:1,c:'c1',t:'qcm',d:2,doute:true,i:'symbole-q7.svg',q:"Quel est le nom de l’appareil associé à ce symbole ?",
 o:["Sectionneur","Contacteur","Interrupteur","Disjoncteur"], a:2,
 e:"Le petit <b>rond</b> sur le contact fixe est enseigné comme le signe de la fonction <b>interrupteur</b> (coupure en charge). Ce n’est pas le demi-cercle du contacteur (Q6), ni la croix du disjoncteur, ni le trait du sectionneur. Compare avec le symbole de la Q6 pour ne pas les confondre."},

{n:8,p:1,c:'c1',t:'qcm',d:2,i:'symbole-q8.svg',q:"Quelle est la fonction associée à ce symbole ?",
 o:["Détection des surcharges","Détection des surtensions","Détection des courts-circuits","Protection des personnes"], a:2,
 e:"La forme <b>arrondie</b> (un crochet) est le symbole de l’effet <b>magnétique</b> : il détecte les <b>courts-circuits</b>. La forme en <b>créneau carré</b> (Q9) est l’effet thermique, qui détecte les surcharges."},

/* ══════════ PAGE 2 ══════════ */

{n:9,p:2,c:'c1',t:'qcm',d:2,i:'symbole-q9.svg',q:"Quelle est la fonction associée à ce symbole ?",
 o:["Détection des surcharges","Détection des surtensions","Détection des courts-circuits","Protection des personnes"], a:0,
 e:"Le <b>créneau carré</b> est le symbole de l’effet <b>thermique</b> (relais thermique, bilame) : il détecte les <b>surcharges</b>. Moyen mnémotechnique : <b>carré = chaleur = surcharge</b> ; <b>rond = magnétique = court-circuit</b>."},

{n:10,p:2,c:'c2',t:'qcm',d:1,q:"Quelle est la sensibilité d’un DDR (dispositif différentiel à courant résiduel) placé à l’origine d’un circuit « prise de courant 16-20 A » ?",
 o:["100 mA","30 mA","300 mA","500 mA"], a:1,
 e:"Les circuits de prises doivent être protégés par un différentiel <b>haute sensibilité 30 mA</b>, parce qu’au-delà de 30 mA, le courant dans le corps peut provoquer la paralysie respiratoire."},

{n:11,p:2,c:'c2',t:'qcm',d:1,q:"Le degré de protection IP pour les corps liquides est représenté par :",
 o:["le 1<sup>er</sup> chiffre","le 2<sup>ème</sup> chiffre","le 3<sup>ème</sup> chiffre"], a:1,
 e:"IP <b>X Y</b> : le 1<sup>er</sup> chiffre = corps <b>solides</b> (poussières, doigts), le 2<sup>e</sup> chiffre = <b>liquides</b> (eau). Ex. IP44 : protégé contre les corps de plus de 1 mm et contre les projections d’eau."},

{n:12,p:2,c:'c2',t:'qcm',d:1,q:"Selon la norme NF C 18-510, quel est le degré minimum de protection en basse tension :",
 o:["IP1x","IP2x","IP3x","IP4x"], a:1,
 e:"<b>IP2x</b> (ou IPXXB) : le doigt ne peut pas toucher une pièce nue sous tension. En dessous, la pièce est considérée comme accessible."},

{n:13,p:2,c:'c2',t:'qcm',d:2,q:"Pour quelle intensité d’un courant alternatif qui traverse le corps humain y a-t-il contraction musculaire :",
 o:["30 mA","100 mA","5 mA","10 mA"], a:3,
 e:"Seuils en alternatif : ≈ 0,5 mA perception · <b>10 mA contraction musculaire</b> (on ne peut plus lâcher) · 30 mA paralysie respiratoire · ≈ 75-100 mA fibrillation cardiaque."},

{n:14,p:2,c:'c2',t:'qcm',d:1,q:"Un appareil électrique de classe d’isolation 2 :",
 o:["a des masses métalliques qu’il faut relier à la terre","a des masses métalliques qu’il ne faut pas relier à la terre","possède une isolation double sans partie métallique accessible"], a:2,
 e:"Classe II (symbole ⧈, double carré) = <b>double isolation</b> (ou isolation renforcée), sans partie métallique accessible : pas de fil de terre. C’est la classe I qui a des masses à relier à la terre."},

{n:15,p:2,c:'c2',t:'qcm',d:1,q:"Une tension alternative de 63 kV est située dans le domaine :",
 o:["HTA","HTB","BT","TBT"], a:1,
 e:"En alternatif : TBT ≤ 50 V · BT ≤ 1000 V · HTA ≤ 50 kV · <b>HTB > 50 kV</b>. 63 kV > 50 kV donc <b>HTB</b>."},

{n:16,p:2,c:'c2',t:'qcm',d:2,q:"Une tension continue de 100 V est située dans le domaine :",
 o:["HTA","HTB","BT","TBT"], a:3,
 e:"En <b>continu</b>, les limites sont plus hautes : TBT ≤ <b>120 V</b> · BT ≤ 1500 V · HTA ≤ 75 kV · HTB > 75 kV. 100 V continu → <b>TBT</b>. (Piège : en alternatif, 100 V serait de la BT.)"},

{n:17,p:2,c:'c2',t:'qcm',d:1,q:"En régime TT, les masses métalliques de l’appareillage électrique :",
 o:["sont obligatoirement reliées à la terre","ne sont pas reliées à la terre","sont reliées à la terre dans certaines situations"], a:0,
 e:"TT : 1<sup>er</sup> T = neutre à la <b>T</b>erre, 2<sup>e</sup> T = masses à la <b>T</b>erre. Les masses sont <b>obligatoirement</b> reliées à la terre, et la protection des personnes se fait par DDR."},

{n:18,p:2,c:'c2',t:'qcm',d:2,q:"En régime TN, quel est l’appareil qui assure la protection des personnes :",
 o:["le différentiel","le disjoncteur","l’interrupteur"], a:1,
 e:"En TN, les masses sont reliées au <b>N</b>eutre : un défaut d’isolement devient un <b>court-circuit</b> phase-neutre, coupé par le <b>disjoncteur</b> (ou les fusibles). En TT, c’est le différentiel qui protège les personnes."},

{n:19,p:2,c:'c2',t:'qcm',d:2,q:"Dans un local humide, la tension alternative limite de sécurité est de :",
 o:["50 V","120 V","25 V","12 V"], a:2,
 e:"Tension limite de sécurité U<sub>L</sub> en alternatif : <b>50 V</b> en local sec, <b>25 V</b> en local humide (12 V dans l’eau, ex. piscine). En continu : 120 V en local sec."},

/* ══════════ PAGE 3 ══════════ */

{n:20,p:3,c:'c3',t:'qcm',d:1,q:"Qui délivre le titre d’habilitation électrique ?",
 o:["Le chargé d’exploitation électrique","Le chargé de travaux","L’employeur"], a:2,
 e:"C’est <b>l’employeur</b> qui délivre et signe le titre d’habilitation, après une formation et un avis favorable. Il n’est pas valable chez un autre employeur."},

{n:21,p:3,c:'c3',t:'qcm',d:1,q:"Quelle est la Distance Minimale d’Approche (DMA) pour une pièce nue sous tension BT ?",
 o:["1,5 m","0,50 m","0,30 m"], a:2,
 e:"DMA en BT = <b>0,30 m</b>. En dessous, on est en zone 4 (voisinage renforcé BT)."},

{n:22,p:3,c:'c3',t:'qcm',d:2,q:"Qui peut entrer dans la zone de voisinage renforcé BT ?",
 o:["BS","BR","B0"], a:1,
 e:"La zone 4 (voisinage renforcé BT) est réservée aux électriciens habilités pour y opérer, comme le <b>BR</b>. Le B0 (non électricien) reste en zone 1 et le BS fait des interventions élémentaires hors de cette zone."},

{n:23,p:3,c:'c3',t:'qcm',d:1,q:"Que faites-vous en premier face à un électrisé ?",
 o:["Je le dégage","J’appelle les secours","Je mets ou je fais mettre le circuit hors tension","Je quitte rapidement les lieux"], a:2,
 e:"D’abord <b>couper le courant</b> (hors tension), sinon on s’électrise en le touchant. Ensuite seulement : dégager, alerter les secours, secourir."},

{n:24,p:3,c:'c3',t:'qcm',d:2,q:"En BT, qui peut entrer dans la zone de voisinage simple ?",
 o:["B1V","Seul et non habilité","H0"], a:0,
 e:"Il faut au minimum être habilité <b>B</b> (le B0 suffit) pour entrer en zone de voisinage simple BT. Le <b>B1V</b> est habilité pour la zone 4, donc il peut aussi entrer en zone 1. Un non-habilité seul : non. H0 est une habilitation <b>HT</b>, pas BT."},

{n:25,p:3,c:'c3',t:'qcm',d:2,q:"Dans la zone de voisinage renforcé Z4 (en BT) je dois obligatoirement porter :",
 o:["Des gants de classe 0 et des lunettes de sécurité","Des gants de classe 0 et un écran facial","Des gants de classe 0 et un casque"], a:1,
 e:"Zone 4 BT : <b>gants isolants de classe 0</b> et <b>écran facial</b> anti-UV (protection contre l’arc électrique). Les lunettes ne suffisent pas contre l’arc."},

{n:26,p:3,c:'c3',t:'qcm',d:2,q:"Qui peut faire des travaux ?",
 o:["BC","BE","BR","B2V"], a:3,
 e:"Les <b>travaux</b> sont faits par les indices <b>1</b> (exécutant) et <b>2</b> (chargé de travaux) : <b>B2V</b>. BC = consignation, BE = essais/mesures/vérifications, BR = interventions générales. Ils ne font pas de travaux."},

{n:27,p:3,c:'c3',t:'qcm',d:1,q:"Qui peut faire des interventions générales BT ?",
 o:["BE","BR","BS"], a:1,
 e:"<b>BR</b> = chargé d’interventions <b>générales</b>. Le BS fait seulement des interventions <b>élémentaires</b> (remplacement à l’identique, raccordement simple)."},

{n:28,p:3,c:'c3',t:'qcm',d:2,q:"Le BR peut faire :",
 o:["Des consignations pour tiers","Des opérations de maintenance","Des travaux"], a:1,
 e:"Le BR fait des <b>interventions</b> : dépannage, <b>maintenance</b>, mesurages, essais, raccordements. Consigner pour quelqu’un d’autre est le rôle du <b>BC</b>, et les travaux celui des B1/B2."},

/* ══════════ PAGE 4 — relue par transparence ══════════ */

{n:29,p:4,c:'c3',t:'qcm',d:1,q:"Le BS peut faire :",
 o:["Des interventions élémentaires","Des interventions générales","Des travaux"], a:0,
 e:"<b>BS</b> = chargé d’interventions <b>élémentaires</b> (S comme « simple ») : remplacer à l’identique un fusible, une lampe, une prise, et faire un raccordement simple. Les interventions générales sont pour le BR."},

{n:30,p:4,c:'c3',t:'qcm',d:3,doute:true,q:"<span style='color:var(--warn)'>[Énoncé illisible : caché derrière la page 3 sur la photo]</span> Le sujet porte probablement sur le courant maximal du circuit sur lequel le <b>BS</b> peut intervenir :",
 o:["32 A","40 A","63 A"], a:0,
 e:"Seules les 3 options se lisent par transparence. Elles suivent la question sur le BS, donc il s’agit très probablement de la limite des interventions élémentaires : circuits jusqu’à <b>32 A</b> (en BT, 400 V maxi). À faire confirmer avec le vrai énoncé."},

{n:31,p:4,c:'c3',t:'qcm',d:1,q:"Qui peut consigner pour des tiers ?",
 o:["B1V","B2V","BC","BR"], a:2,
 e:"<b>BC</b> = chargé de <b>C</b>onsignation : il consigne pour les autres (les tiers). Le BR peut consigner seulement pour ses propres interventions (Q32)."},

{n:32,p:4,c:'c3',t:'qcm',d:1,q:"Le BR peut-il consigner pour ses propres interventions ?",
 o:["Oui","Non"], a:0,
 e:"<b>Oui</b> : le BR peut consigner pour son propre compte. Pour les autres (tiers), il faut un BC."},

{n:33,p:4,c:'c4',t:'order',d:2,q:"Numérotez de 1 à 5, dans le bon ordre, les opérations de consignation suivantes :",
 s:["Séparation","Condamnation","Identification","VAT (Vérification d’Absence de Tension)","Mise à la terre et en court-circuit (si nécessaire)"],
 init:[1,2,0,4,3],
 e:"Ordre : <b>1 Séparation</b> (ouvrir) → <b>2 Condamnation</b> (cadenas + pancarte) → <b>3 Identification</b> (être sûr que c’est le bon circuit) → <b>4 VAT</b> → <b>5 MALT-CC</b>. Moyen mnémotechnique : <b>« Si Ça Itère, Vérifie Mieux »</b> (S-C-I-V-M)."},

{n:34,p:4,c:'c4',t:'qcm',d:2,q:"Sans VAT, je peux faire une Vérification d’Absence de Tension avec :",
 o:["Un contrôleur","Un testeur","Un multimètre","Aucun de ces appareils"], a:3,
 e:"La VAT se fait <b>uniquement</b> avec un VAT (vérificateur d’absence de tension) conforme, testé avant et après. Multimètre, testeur et contrôleur sont interdits pour ça : <b>aucun de ces appareils</b>."},

{n:35,p:4,c:'c4',t:'qcm',d:3,doute:true,q:"Sur une canalisation enterrée, la zone d’incertitude pour un réseau de classe A (souple) est de :",
 o:["0,50 m","1,00 m","1,50 m"], a:0,
 e:"Classe A = réseau localisé précisément : incertitude maximale de 40 cm pour un réseau rigide et de <b>50 cm</b> pour un réseau <b>souple</b> (flexible). Les mots « classe A (souple) » sont lus par transparence : à vérifier avec le cours."},

{n:36,p:4,c:'c4',t:'qcm',d:3,doute:true,q:"Pour une canalisation aérienne à conducteurs nus, la DLI (Distance Limite d’Investigation) est de :",
 o:["3 m","5 m","50 m"], a:2,
 e:"La DLI est la distance jusqu’à laquelle il faut <b>rechercher</b> les ouvrages électriques avant une opération. Pour une ligne aérienne nue, elle vaut <b>50 m</b>. Ne pas confondre avec la DLVS (3 m jusqu’à 50 kV, 5 m au-delà), qui délimite la zone de voisinage. Énoncé lu par transparence : à vérifier."},

/* ══════════ PAGE 5 ══════════ */

{n:37,p:5,c:'c4',t:'qcm',d:2,q:"Quelles sont les actions à réaliser dans la zone d’investigation ?",
 o:["Analyser si l’exécution de l’opération envisagée peut exposer les opérateurs aux risques d’origine électrique","Rien de particulier par rapport aux risques électriques","Être équipé des E.P.I."], a:0,
 e:"Dans la zone d’investigation, on n’est pas encore au voisinage : on <b>analyse</b> si l’opération risque d’exposer quelqu’un au risque électrique (repérage, DT-DICT). Les EPI viennent plus tard, quand on est en zone de voisinage."},

{n:38,p:5,c:'c4',t:'qcm',d:3,doute:true,q:"Qui peut entrer dans la zone de voisinage renforcé HT ?",
 o:["H0V","H1","H2"], a:0,
 e:"L’indice <b>V</b> veut dire « habilité au <b>voisinage</b> ». Sans V, H1 et H2 ne travaillent que hors tension, sur un ouvrage consigné. Parmi les trois, seul <b>H0V</b> a l’attribut voisinage. C’est la même logique que la Q24 (B1V). Réponse logique mais <b>à confirmer</b> : selon la norme, le voisinage renforcé HT (zone 3) peut demander H1V/H2V."},

{n:39,p:5,c:'c4',t:'qcm',d:3,doute:true,q:"Qui peut pratiquer des essais ?",
 o:["BR dans le cadre de ses interventions","B1V seul dans le cadre des travaux","H2V dans le cadre des travaux"], a:0,
 e:"Le <b>BR</b> peut réaliser des essais dans le cadre de ses interventions (dépannage, remise en service). Un B1V <b>seul</b> : non, l’exécutant travaille sous les ordres d’un chargé de travaux. H2V : en principe, il faut l’attribut « essai ». <b>À confirmer</b> avec le cours."},

{n:40,p:5,c:'c4',t:'qcm',d:3,doute:true,q:"Les opérations de connexion et de déconnexion en présence de tension sont autorisées sur des conducteurs de section maximale de :",
 o:["6 mm² en cuivre","10 mm² en cuivre","10 mm² en aluminium"], a:0,
 e:"La connexion et la déconnexion sous tension sont limitées aux petites sections : <b>6 mm² en cuivre</b>. <b>À confirmer</b> avec le cours : certains documents donnent aussi une limite en aluminium."}
];
