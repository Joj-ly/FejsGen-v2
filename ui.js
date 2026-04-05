// --------------------------------------------------
// FEJSGEN UI LOGIK
// --------------------------------------------------

let savedCharacters = [];

// När sidan laddas: koppla knapparna
window.addEventListener("DOMContentLoaded", async () => {
    await detectLayerCounts();

    const btn = document.getElementById("generate-btn");
    if (btn) btn.addEventListener("click", triggerSlot);

    // Position hint flush to the right of the centered button
    const hint = document.getElementById("slot-hint");
    if (btn && hint) {
        const offset = btn.offsetWidth / 2 + 14;
        hint.style.transform = `translateX(${offset}px)`;
    }

    const downloadBtn = document.getElementById("download-saved");
    if (downloadBtn) downloadBtn.addEventListener("click", downloadSaved);

    const saveToggleBtn = document.getElementById("save-toggle-btn");
    if (saveToggleBtn) saveToggleBtn.addEventListener("click", openSavedOverlay);

    const savedOverlayClose = document.getElementById("saved-overlay-close");
    if (savedOverlayClose) savedOverlayClose.addEventListener("click", closeSavedOverlay);

    const downloadMobileBtn = document.getElementById("download-saved-mobile");
    if (downloadMobileBtn) downloadMobileBtn.addEventListener("click", downloadSaved);

    // Sätt startsymbol på alla 3 hjul
    [0, 1, 2].forEach(i => {
        const reel = document.getElementById(`reel-${i}`);
        if (reel) buildReel(reel, ['?']);
    });
});

// SVG-symboler från slots-mappen
const symbols = [
    'assets/ui/slots/skull.svg',
    'assets/ui/slots/dead.svg',
    'assets/ui/slots/happy.svg',
    'assets/ui/slots/star.svg',
    'assets/ui/slots/green.svg'
];

// Möjliga landningssymboler – hjulet stannar på happy eller star
const LANDING_SYMBOLS = [
    'assets/ui/slots/happy.svg',
    'assets/ui/slots/star.svg'
];

// Varje hjul har olika längd → stannar vid olika tillfällen (vänster först, höger sist)
const REEL_LENGTHS = [22, 30, 38];

function makeSymbolEl(s) {
    const d = document.createElement('div');
    d.className = 'slot-symbol';
    if (s.includes('/')) {
        // SVG eller PNG-fil
        const img = document.createElement('img');
        img.src = s;
        d.appendChild(img);
    } else {
        d.textContent = s;
    }
    return d;
}

function buildReel(reelEl, seq) {
    reelEl.innerHTML = '';
    seq.forEach(s => reelEl.appendChild(makeSymbolEl(s)));
}

function animateReel(reelEl, seq) {
    return new Promise(resolve => {
        reelEl.style.transition = 'none';
        reelEl.style.transform = 'translateY(0px)';

        let idx = 0;
        let interval = 60;

        function step() {
            if (idx >= seq.length - 1) {
                reelEl.style.transform = `translateY(${-(seq.length - 1) * 70}px)`;
                resolve();
                return;
            }
            idx++;
            reelEl.style.transition = `transform ${interval}ms linear`;
            reelEl.style.transform = `translateY(${-idx * 70}px)`;
            if (idx > seq.length - 8) interval = Math.min(interval + 30, 300);
            else if (idx < 5) interval = Math.max(interval - 10, 45);
            setTimeout(step, interval);
        }

        setTimeout(step, 60);
    });
}

function triggerSlot() {
    const btn = document.getElementById('generate-btn');
    const label = document.getElementById('btnLabel');
    if (!btn) return;

    btn.disabled = true;
    label.textContent = 'Summon...';

    const hint = document.getElementById('slot-hint');
    if (hint) hint.classList.add('hidden');

    const promises = [0, 1, 2].map(i => {
        const reelEl = document.getElementById(`reel-${i}`);
        if (!reelEl) return Promise.resolve();

        const len = REEL_LENGTHS[i];
        const seq = [];
        for (let j = 0; j < len; j++) seq.push(symbols[Math.floor(Math.random() * symbols.length)]);
        // Landningssymbol: slumpmässig bland alla symboler
        const landing = symbols[Math.floor(Math.random() * symbols.length)];
        seq.push(landing);

        buildReel(reelEl, seq);
        return animateReel(reelEl, seq);
    });

    Promise.all(promises).then(() => {
        btn.disabled = false;
        label.textContent = 'Generate New Faces';
        generatePortraitBatch();
    });
}


// --------------------------------------------------
// GENERERA 18 UNIKA PORTRÄTT
// --------------------------------------------------

function generatePortraitBatch() {
    const portraits = [];
    const usedNames = new Set(); // Håll koll på namn i denna batch så vi inte får dubbletter

    // Vi kör en while-loop istället för en fast for-loop. 
    // Den fortsätter tills vi har exakt 18 unika karaktärer.
    while (portraits.length < 18) {
        const p = createPortrait();
        
        // Kolla om namnet redan finns i den här omgången
        if (!usedNames.has(p.name.fullName)) {
            portraits.push(p);
            usedNames.add(p.name.fullName);
        }
    }
    
    updatePortraitGrid(portraits);
}

// --------------------------------------------------
// RITA GRID MED PORTRÄTT
// --------------------------------------------------

function updatePortraitGrid(portraits) {
    const grid = document.getElementById("portrait-grid");
    if (!grid) return;

    grid.innerHTML = "";

    portraits.forEach(async (p, i) => {

        const middle = document.createElement("div");
        middle.className = "frame-middle";
        middle.style.animationDelay = `${i * 40}ms`;

        const card = document.createElement("div");
        card.className = "portrait-card";

        // Dubbel intern upplösning, ska visas via CSS (responsiv)
        const canvas = document.createElement("canvas");
        canvas.className = "portrait-canvas";
        canvas.width = 256;
        canvas.height = 256;

        const nameEl = document.createElement("div");
        nameEl.className = "portrait-name";
        nameEl.innerText = p.name.fullName;

        const titleEl = document.createElement("div");
        titleEl.className = "portrait-title";
        titleEl.innerText = p.title;

        card.onclick = () => showDetails(p);

        card.appendChild(canvas);
        card.appendChild(nameEl);
        card.appendChild(titleEl);

        middle.appendChild(card);
        grid.appendChild(middle);

        await drawFace(canvas, p.decks, p.skin, p.hair, p);
    });
}


// --------------------------------------------------
// POPUP: VISA DETALJER
// --------------------------------------------------

async function showDetails(p) {
    const panel = document.getElementById("detail-panel");
    if (!panel) return;

    panel.classList.remove("hidden");

    document.getElementById("char-name").innerText = p.name.fullName;
    document.getElementById("char-title").innerText = p.title;
    document.getElementById("char-origin").innerText = p.origin;
    document.getElementById("char-story").innerText = p.story;

    const dCanvas = document.getElementById("detail-canvas");
    if (dCanvas) {
        // Dubbel intern upplösning, visas som 256x256
        dCanvas.width = 512;
        dCanvas.height = 512;
        dCanvas.style.width = "256px";
        dCanvas.style.height = "256px";
        await drawFace(dCanvas, p.decks, p.skin, p.hair, p);
    }

    // Koppla spara-knappen till denna karaktär
    const saveBtn = document.getElementById("save-from-popup");
    if (saveBtn) {
        saveBtn.onclick = () => saveCharacter(p, dCanvas);
    }
}


// --------------------------------------------------
// POPUP: STÄNG
// --------------------------------------------------

function closeDetailPanel() {
    const panel = document.getElementById("detail-panel");
    if (panel) panel.classList.add("hidden");
}


// --------------------------------------------------
// SPARA KARAKTÄR
// --------------------------------------------------

function saveCharacter(p, canvas) {
    const alreadySaved = savedCharacters.some(c => c.name.fullName === p.name.fullName);
    if (alreadySaved) {
        alert(`${p.name.fullName} is already saved!`);
        return;
    }

    const imageData = canvas ? canvas.toDataURL("image/png") : null;
    savedCharacters.push({ ...p, imageData });
    updateSavedList();
}


// --------------------------------------------------
// UPPDATERA SPARAD LISTA
// --------------------------------------------------

function updateSavedList() {
    const list = document.getElementById("saved-list");
    if (!list) return;

    list.innerHTML = "";

    savedCharacters.forEach((p, index) => {
        const li = document.createElement("li");

        // Dubbel intern upplösning, visas som 64x64
        const miniCanvas = document.createElement("canvas");
        miniCanvas.width = 128;
        miniCanvas.height = 128;
        miniCanvas.style.width = "64px";
        miniCanvas.style.height = "64px";

        const info = document.createElement("div");
        info.className = "saved-info";
        info.innerHTML = `
            <div class="saved-name">${p.name.fullName}</div>
            <div class="saved-title">${p.title}</div>
            <button class="saved-remove" onclick="removeSaved(${index})">✕ Remove</button>
        `;

        li.appendChild(miniCanvas);
        li.appendChild(info);
        list.appendChild(li);

        drawFace(miniCanvas, p.decks, p.skin, p.hair, p);
    });
}


// --------------------------------------------------
// TA BORT SPARAD
// --------------------------------------------------

function removeSaved(index) {
    savedCharacters.splice(index, 1);
    updateSavedList();
}


// --------------------------------------------------
// MOBILE SAVED OVERLAY
// --------------------------------------------------

function openSavedOverlay() {
    const overlay = document.getElementById("saved-overlay");
    if (overlay) overlay.classList.remove("hidden");
    updateSavedListMobile();
}

function closeSavedOverlay() {
    const overlay = document.getElementById("saved-overlay");
    if (overlay) overlay.classList.add("hidden");
}

function updateSavedListMobile() {
    const list = document.getElementById("saved-list-mobile");
    if (!list) return;

    list.innerHTML = "";

    savedCharacters.forEach((p, index) => {
        const li = document.createElement("li");

        const miniCanvas = document.createElement("canvas");
        miniCanvas.width = 128;
        miniCanvas.height = 128;
        miniCanvas.style.width = "64px";
        miniCanvas.style.height = "64px";

        const info = document.createElement("div");
        info.className = "saved-info";
        info.innerHTML = `
            <div class="saved-name">${p.name.fullName}</div>
            <div class="saved-title">${p.title}</div>
            <button class="saved-remove" onclick="removeSavedMobile(${index})">✕ Remove</button>
        `;

        li.appendChild(miniCanvas);
        li.appendChild(info);
        list.appendChild(li);

        drawFace(miniCanvas, p.decks, p.skin, p.hair, p);
    });
}

function removeSavedMobile(index) {
    savedCharacters.splice(index, 1);
    updateSavedList();
    updateSavedListMobile();
}


// --------------------------------------------------
// DOWNLOAD: ZIP MED PNG + TXT PER KARAKTÄR
// --------------------------------------------------

async function downloadSaved() {
    if (savedCharacters.length === 0) {
        alert("No characters saved!");
        return;
    }

    const zip = new JSZip();

    savedCharacters.forEach(p => {
        const fileName = p.name.fullName.replace(/ /g, "_");

        if (p.imageData) {
            const base64 = p.imageData.split(",")[1];
            zip.file(`${fileName}.png`, base64, { base64: true });
        }

        const text = `=== ${p.name.fullName} ===\nYrke: ${p.title}\nOrigin: ${p.origin}\nStory: ${p.story}`;
        zip.file(`${fileName}.txt`, text);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "faces_of_the_north.zip";
    a.click();
}