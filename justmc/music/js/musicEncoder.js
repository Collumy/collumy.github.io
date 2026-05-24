const PAUSE_CHAR = String.fromCharCode(65535);

function packNote(instrument, noteKey, volumePercent) {
    const vol = Math.min(31, Math.round(volumePercent / 100 * 31));
    const inst = Math.min(31, Math.max(0, instrument));
    const n = Math.min(87, Math.max(0, noteKey));
    const code = (vol << 10) | (n << 5) | inst;
    return String.fromCharCode(code);
}

export function encodeMusic(notes) {
    if (!notes || notes.length === 0) return '';
    
    let result = '';
    let lastTick = -1;
    
    for (const note of notes) {
        if (lastTick !== -1 && note.tick > lastTick + 1) {
            const missed = note.tick - lastTick - 1;
            for (let i = 0; i < missed; i++) {
                result += PAUSE_CHAR;
            }
        }
        result += packNote(note.instrument, note.key, note.velocity);
        lastTick = note.tick;
    }
    
    return result;
}