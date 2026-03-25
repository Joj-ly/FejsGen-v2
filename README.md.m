# FejsGen - AI-Driven SVG Generator
Detta projekt syftar till att skapa en generator som kombinerar individuella SVG-lager till unika karaktärsporträtt i en "line-art"-stil.

## Struktur & Logik
- **/assets**: Innehåller undermappar för varje ansiktsdel (eyes, nose, mouth, head_shape, hair).
- **/src**: Här ska logiken ligga (TypeScript/Node.js).
- **/output**: Här sparas de färdiga kombinerade SVG-filerna.

## Tekniska Krav
1. **Analys**: Analysera befintliga SVG-filer i /assets för att förstå deras `viewBox` och lagerstruktur.
2. **Kombination**: Bygg en funktion som slumpmässigt väljer en fil från varje undermapp.
3. **Sammanslagning**: Skapa en ny SVG-fil där dessa delar läggs ovanpå varandra i rätt ordning (Z-index).
4. **Export**: Spara resultatet som en unik .svg-fil i /output.

## Mål
Skapa en fungerande prototyp som kan generera 100 unika ansikten med ett kommando.