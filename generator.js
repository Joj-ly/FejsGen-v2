// --------------------------------------------------
// FEJSGEN GENERATOR LOGIK
// --------------------------------------------------

// Shufflad pool per lager — undviker upprepningar
// Varje lager har en "kortlek" som delas ut i slumpad ordning.
// När leken är tom blandas den om.
const layerPools = {};

function getNextFromPool(layer) {
    if (!layerPools[layer] || layerPools[layer].length === 0) {
        const count = layerCounts[layer];
        const arr = Array.from({ length: count }, (_, i) => i + 1);
        // Fisher-Yates shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        layerPools[layer] = arr;
    }
    return layerPools[layer].pop();
}

function getRandomHairColor() {
    const rand = Math.random();
    let category =
        rand < 0.4 ? "light" :
        rand < 0.7 ? "dark" :
        rand < 0.9 ? "red" : "grey";

    const colors = hairPalette[category];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createPortrait() {

    // 1. Välj origin och yrke
    const origin = randomFrom(origins);
    const profession = randomFrom(titles);

    // 2. Generera namn
    const first = randomFrom(firstNames);
    const last = generateLastName();
    const fullName = `${first} ${last}`;

    // 3. Generera story
    const story = generateStory(origin, profession);

    // 4. Slump-flaggor
    const hasMarks     = Math.random() < 0.4;
    const flipMarks    = Math.random() < 0.5;
    const hasHair      = Math.random() < 0.85;
    const hasBeard     = Math.random() < 0.4;
    const hasMustache  = Math.random() < 0.35;
    const flipHair     = Math.random() < 0.5;
    const flipBeard    = Math.random() < 0.5;
    const flipMustache = Math.random() < 0.5;
    const flipEyes     = Math.random() < 0.5;
    const flipMouth    = Math.random() < 0.5;
    const flipEars     = Math.random() < 0.5;

    // 5. Returnera karaktären
    return {
        name: { fullName },
        title: profession,
        origin: origin,
        story: story,
        decks: layers.reduce((acc, layer) => ({
            ...acc,
            [layer]: getNextFromPool(layer)
        }), {}),
        skin: randomFrom(skinTones),
        hair: getRandomHairColor(),
        hasMarks,     flipMarks,
        hasHair,      flipHair,
        hasBeard,     flipBeard,
        hasMustache,  flipMustache,
        flipEyes,
        flipMouth,
        flipEars
    };
}


// --------------------------------------------------
// RITA ANSIKTET
// --------------------------------------------------

async function drawFace(canvas, decks, skinColor, hairColor, p) {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = canvas.width;

    ctx.filter = 'none';
    ctx.clearRect(0, 0, size, size);

    for (const layer of layers) {

        // Hoppa över lager baserat på flaggor
        if (layer === 'marks'     && !p.hasMarks)    continue;
        if (layer === 'hair'      && !p.hasHair)     continue;
        if (layer === 'beards'    && !p.hasBeard)    continue;
        if (layer === 'mustaches' && !p.hasMustache) continue;

        const fileNum = decks[layer];
        if (!fileNum) continue;

        const img = await new Promise(resolve => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = () => resolve(null);
            i.src = `assets/faces/${layer}/${fileNum}.svg`;
        });

        if (!img) continue;

        const isHud = ['heads', 'ears', 'noses'].includes(layer);
        const isHar = ['hair', 'beards', 'mustaches'].includes(layer);

        const shouldFlip =
            (layer === 'marks'     && p.flipMarks)    ||
            (layer === 'hair'      && p.flipHair)     ||
            (layer === 'beards'    && p.flipBeard)    ||
            (layer === 'mustaches' && p.flipMustache) ||
            (layer === 'eyes'      && p.flipEyes)     ||
            (layer === 'mouths'    && p.flipMouth)    ||
            (layer === 'ears'      && p.flipEars);

        // Bygg lagret på temp-canvas så färg + spegling hanteras tillsammans
        const temp = document.createElement('canvas');
        temp.width = size;
        temp.height = size;
        const tCtx = temp.getContext('2d');

        if (isHud || isHar) {
            tCtx.drawImage(img, 0, 0, size, size);
            tCtx.globalCompositeOperation = 'source-in';
            tCtx.fillStyle = isHud ? skinColor : hairColor;
            tCtx.fillRect(0, 0, size, size);
        } else {
            tCtx.drawImage(img, 0, 0, size, size);
        }

        ctx.save();

        if (shouldFlip) {
            ctx.scale(-1, 1);
            ctx.drawImage(temp, -size, 0, size, size);
            if (isHud || isHar) {
                ctx.globalCompositeOperation = 'multiply';
                ctx.drawImage(img, -size, 0, size, size);
            }
        } else {
            ctx.drawImage(temp, 0, 0, size, size);
            if (isHud || isHar) {
                ctx.globalCompositeOperation = 'multiply';
                ctx.drawImage(img, 0, 0, size, size);
            }
        }

        ctx.restore();
    }
}