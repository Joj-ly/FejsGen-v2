/* --------------------------------------------------
   FEJSGEN CONSTANTS — VERSION 4
-------------------------------------------------- */

const layers = ['ears', 'heads', 'marks', 'eyes', 'mouths', 'beards', 'mustaches', 'noses', 'hair'];
// Fylls i automatiskt vid start — behöver inte uppdateras manuellt
let layerCounts = {};

async function detectLayerCounts() {
    for (const layer of layers) {
        let n = 0;
        while (true) {
            const res = await fetch(`assets/faces/${layer}/${n + 1}.svg`, { method: 'HEAD' });
            if (!res.ok) break;
            n++;
        }
        layerCounts[layer] = n;
    }
}

/* ----------------------------------------------
   RANDOM HELPER
---------------------------------------------- */
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* ----------------------------------------------
   ORIGINS (plats)
---------------------------------------------- */

const origins = [
    "From the City",
    "From the Countryside",
    "From the Highlands",
    "From the Coast",
    "From the Deep Forest",
    "From the Borderlands",
    "From the Northern Wastes",
    "From the Riverlands"
];

const originBackgrounds = {
    "From the City":
        "Raised among crowded markets and narrow alleys, he learned early how to read people — and how to disappear in a crowd.",

    "From the Countryside":
        "Growing up among fields and quiet roads taught him patience, steady hands, and a deep respect for honest work.",

    "From the Highlands":
        "Life in the windswept highlands forged a stubborn will and a body hardened by thin air and rough terrain.",

    "From the Coast":
        "The sound of waves and the scent of salt shaped his childhood, and he still feels uneasy when too far from the sea.",

    "From the Deep Forest":
        "Shadows, old trees, and whispered legends were his companions — and he learned to move silently between them.",

    "From the Borderlands":
        "On the frontier, danger was a daily visitor. He grew up knowing that peace is something you defend, not receive.",

    "From the Northern Wastes":
        "Born where winter never truly ends, he learned to endure cold, hunger, and the silence of endless snow.",

    "From the Riverlands":
        "Rivers were his roads, and water his teacher — always moving, always changing."
};


/* ----------------------------------------------
   PROFESSIONS (yrken)
---------------------------------------------- */

const titles = [
    "Mercenary", "Blacksmith", "Archer", "Hunter", "Guard", "Merchant", "Butcher", "Farmer",
    "Town Guard", "Scout", "Militia", "Squire", "Carpenter", "Mason", "Tanner", "Brewer",
    "Tailor", "Miller", "Baker", "Leatherworker", "Shepherd", "Fisherman", "Stablehand",
    "Woodsman", "Trapper", "Innkeeper", "Cook", "Messenger", "Scribe"
];

const professionBackgrounds = {
    "Mercenary": "Years of sold blades and broken oaths taught him to trust coin more than promises.",
    "Blacksmith": "Years at the forge gave him strong arms, a sharp eye for detail, and a respect for tools that never fail.",
    "Archer": "A steady hand and a calm breath shaped his youth.",
    "Hunter": "Tracking, patience, and quiet footsteps were lessons learned far from any road.",
    "Guard": "Long hours on cold walls taught him discipline and the weight of responsibility.",
    "Merchant": "He learned the value of a coin, but also the value of a promise.",
    "Butcher": "Sharp knives and early mornings hardened his resolve and his stomach.",
    "Farmer": "Seasons, soil, and sweat shaped his understanding of the world.",
    "Town Guard": "He walked the same streets every day, learning every face — and every troublemaker.",
    "Scout": "He moved ahead of the group, alone with his instincts and the wind.",
    "Militia": "Not a soldier by trade, but by necessity — he learned quickly or died early.",
    "Squire": "He carried armor, polished steel, and listened to lectures about honor he rarely believed.",
    "Carpenter": "Wood, nails, and careful hands taught him patience and precision.",
    "Mason": "Stone taught him endurance — and that nothing worth building comes easily.",
    "Tanner": "Hides, smoke, and harsh smells were the backdrop of his early years.",
    "Brewer": "He learned the art of turning grain into comfort — or trouble.",
    "Tailor": "Needles, cloth, and quiet concentration shaped his steady hands.",
    "Miller": "The turning of the wheel and the rhythm of grain taught him calm persistence.",
    "Baker": "Warm ovens and early mornings defined his routine.",
    "Leatherworker": "He shaped hides into tools and armor, learning the value of flexibility.",
    "Shepherd": "Days spent with animals taught him patience and a gentle heart.",
    "Fisherman": "Tides, nets, and storms shaped his instincts.",
    "Stablehand": "Horses taught him strength, timing, and when to stay out of the way.",
    "Woodsman": "The forest was his teacher — and sometimes his enemy.",
    "Trapper": "He learned to set traps, read tracks, and survive alone.",
    "Innkeeper": "He heard more stories than most bards — and kept more secrets.",
    "Cook": "Flavors, fire, and improvisation shaped his craft.",
    "Messenger": "Speed and reliability were his currency.",
    "Scribe": "Ink, parchment, and quiet halls shaped his early life."
};


/* ----------------------------------------------
   NAMN
---------------------------------------------- */

const firstNames = [
    "Agnar", "Algot", "Arn", "Arne", "Arnfast",
    "Andor", "Arnfast", "Arvid", "Asker", "Alvin",
    "Baulv", "Birk", "Bjarne", "Björn", "Birger",
    "Borgulf", "Brage", "Bruse", "Berge", "Bure",
    "Dag", "Dagfinn", "Dagnar", "Dåd", "Dan",
    "Ebbe", "Egil", "Enoff", "Edvald", "Einar",
    "Elof", "Emund", "Erenmund", "Erik", "Erngot",
    "Farbjörn", "Folke", "Frej", "Fride", "Frode",
    "Gerhjälm", "Gerthorn", "Greger", "Grimulf",
    "Gunnar", "Gustaf", "Gunvald",
    "Harald", "Håkan", "Haldor", "Halvard", "Holm",
    "Ivar", "Ivan", "Ingve", "Ingolf", "Ingemund",
    "Jarl", "Jarne", "Joar", "Johan", "Jon", "Jöns", 
    "Jurgen", "Jerker",
    "Knud", "Klas", "Karl", "Kettil", "Kjell", "Knut", "Klint",
    "Lage", "Leif", "Lennart", "Lindor", "Linné", 
    "Magne", "Manne", "Munde", 
    "Nase", "Näsbjörn", "Nävgier", "Nor",
    "Odal", "Ode", "Ove", "Odd", "Oddvar", "Oddmund", 
    "Oden", "Odin", "Olaf", "Olof", "Orme", "Otto", 
    "Per", "Palne", "Pål",
    "Ragnar", "Ragnfast", "Rask", "Rande", "Reimund", 
    "Rike", "Roderik", "Rode", "Roine", "Rolle", "Rolf", "Romund",
    "Salve", "Sigurd", "Sigvard", "Sven", "Saxe", "Sighjelm", 
    "Sigmund", "Sivert", "Skoge", "Starke", "Steinar", "Stig", 
    "Stigbjörn", "Sture", "Sverre", "Stigfinn",
    "Tage", "Torsten", "Thure", "Toke", "Torald", "Torbjörn", 
    "Tord", "Torgrim", "Torhall", "Torkil", "Torkel", "Torleif", 
    "Torvald", "Tove", "Tumme", "Tyke",
    "Ubbe", "Ulf", "Udd", "Ulfrik", "Uno",
    "Valdar", "Vidbjörn", "Vidar", "Vide", "Vigor", "Vigmar", 
    "Vilgot", "Vrake",
    "Yngve", "Yngvar", "Ygil", 
    "Åbjörn", "Åge", "Åmund", "Åse", "Åsgir", "Åskar", "Åre",
    "Ärenmund", "Ärle", "Äggmund", 
    "Öde", "Ödmar", "Ödmund", "Ökil", "Örik"
];

/* Prefix + suffix */
const namePrefix = [
    "Ek", "Järn", "Berg", "Sten", "Guld", "Silver",
    "Björk", "Lind", "Frost", "Storm", "Varg", "Ulv",
    "Ask", "Alm", "Stor", "Lind", "Ären"
];

const nameSuffix = [
    "rot", "fot", "dahl", "berg", "ros", "klint", "gren",
    "topp", "strand", "lund", "vass", "egg", "äng",
    "feldt", "son", "mossan", "lind", "quist", "orm",
    "stig", "fors", "bäck", "hall", "hand", "hamn"
];

/* Enkla efternamn (20%) */
const simpleLastNames = [
    "Storm", "Frost", "Lind", "Berg", "Ulv", "Varg",
    "Ask", "Björk", "Sten", "Guld", "Alm", "Stor", "Pärla"
];

/* Fristående efternamn (20%) */
const standaloneLastNames = [
    "Grimsson", "Hargulf", "Torsen", "Ravndal", "Skjold",
    "Hargard", "Ulfsen", "Berglund", "Falk", "Hammar",
    "Hargrim", "Torvald", "Skare", "Ravnsen", "Kämpe",
    "Strid", "Kneckt", "Rask", "Modig", "Lidsman",
    "Linder", "Seger", "Sköld", "Smed", "Svarthövde",
    "Vargas", "Vilde", "Ärenbjörn", "Örn", "Räv"
];

/* Efternamns-generator med procentchans */
function generateLastName() {
    const roll = Math.random();

    if (roll < 0.20) return randomFrom(simpleLastNames);
    if (roll < 0.40) return randomFrom(standaloneLastNames);

    return randomFrom(namePrefix) + randomFrom(nameSuffix);
}


/* ----------------------------------------------
   UPPVÄXT / CHILDHOOD BACKGROUNDS
---------------------------------------------- */

const upbringingBackgrounds = [
    "He grew up without parents, learning early that survival depended on his own wits.",
    "Born into a wealthy household, he received opportunities most could only dream of — though comfort came with expectations.",
    "Raised under strict discipline, he learned obedience, restraint, and the weight of responsibility.",
    "His family wandered from place to place, teaching him adaptability and a restless spirit.",
    "Raised in a devout home, he learned rituals, discipline, and the comfort of old beliefs.",
    "Born into a military family, he grew up around steel, drills, and stories of honor and sacrifice.",
    "As an only child, he learned to rely on himself — and to carry silence well.",
    "Growing up among many siblings taught him competition, cooperation, and how to make himself heard."
];


/* ----------------------------------------------
   HUD & HÅR
---------------------------------------------- */

const skinTones = ['#FFF5E1', '#FFEBCC', '#FCE2C4', '#F9D5B1', '#E9BC99'];

const hairPalette = {
    light:  ['#D2B48C', '#E5C29F', '#DEB887', '#C5A059'],
    dark:   ['#8B5A2B', '#704214', '#5D3A1A', '#634430'],
    red:    ['#A0522D', '#8B4513', '#A45A52', '#914110'],
    grey:   ['#BDB7AB', '#D3D3D3', '#A9A9A9', '#808080']
};


/* ----------------------------------------------
   STORY GENERATOR
---------------------------------------------- */

function generateStory(origin, profession) {
    const originPart = originBackgrounds[origin];
    const professionPart = professionBackgrounds[profession];
    const upbringingPart = randomFrom(upbringingBackgrounds);

    return upbringingPart + " " + originPart + " " + professionPart;
}
