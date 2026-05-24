import { fromArrayBuffer } from "https://esm.run/@nbsjs/core@6.0.0";

export async function parseNBSFile(file) {
    if (!file || !file.name.toLowerCase().endsWith('.nbs')) {
        throw new Error('Необходим .nbs файл');
    }
    
    const buffer = await file.arrayBuffer();
    const song = fromArrayBuffer(buffer);
    
    const layers = song.layers?.all || [];
    const notes = [];
    
    for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
        const layer = layers[layerIdx];
        if (!layer?.notes?.all) continue;
        for (const [tick, note] of Object.entries(layer.notes.all)) {
            notes.push({
                tick: parseInt(tick),
                layer: layerIdx,
                key: note.key,
                instrument: note.instrument,
                velocity: note.velocity || 100
            });
        }
    }
    
    notes.sort((a, b) => a.tick - b.tick);
    
    const info = {
        name: song.name || "Без названия",
        author: song.originalAuthor || song.author || "Не указан",
        tempo: song.tempo || 120,
        duration: song.songLength || 0,
        totalNotes: notes.length
    };
    
    return { song, info, notes };
}