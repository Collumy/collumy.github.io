import { parseNBSFile } from './nbsParser.js';
import { encodeMusic } from './musicEncoder.js';
import { uploadMusic } from './api.js';
import * as ui from './ui.js';

// DOM элементы
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileStatus = document.getElementById('fileStatus');
const editorPanel = document.getElementById('editorPanel');
const resultPanel = document.getElementById('resultPanel');
const songTitleInput = document.getElementById('songTitleInput');
const songAuthorInput = document.getElementById('songAuthorInput');
const itemIdInput = document.getElementById('itemIdInput');
const tempoInput = document.getElementById('tempoInput');
const durationDisplay = document.getElementById('durationDisplay');
const notesCountDisplay = document.getElementById('notesCountDisplay');
const compactLengthDisplay = document.getElementById('compactLengthDisplay');
const versionBadge = document.getElementById('versionBadge');
const generateBtn = document.getElementById('generateBtn');
const compactResult = document.getElementById('compactResult');
const copyResultBtn = document.getElementById('copyResultBtn');
const uploadServerBtn = document.getElementById('uploadToServerBtn');
const serverResponseDiv = document.getElementById('serverResponse');
const errorToast = document.getElementById('errorToast');
const errorMessageSpan = document.getElementById('errorMessage');

// Состояние
let currentNotes = [];
let currentInfo = {};

// Обработка файла
async function handleFile(file) {
    try {
        const { info, notes } = await parseNBSFile(file);
        currentNotes = notes;
        currentInfo = info;
        
        ui.displaySongInfo(info, durationDisplay, notesCountDisplay, versionBadge);
        ui.fillEditorFields(songTitleInput, songAuthorInput, tempoInput, info);
        ui.updateFileStatus(fileStatus, file.name, notes.length);
        
        editorPanel.style.display = 'block';
        resultPanel.style.display = 'none';
        serverResponseDiv.innerHTML = '';
        
        if (!itemIdInput.value) itemIdInput.value = "minecraft:paper";
    } catch (err) {
        ui.showError(err.message, errorToast, errorMessageSpan);
    }
}

// Генерация компактной строки
function generateCompact() {
    if (!currentNotes.length) {
        ui.showError("Сначала загрузите .nbs файл", errorToast, errorMessageSpan);
        return '';
    }
    const compact = encodeMusic(currentNotes);
    ui.updateCompactStats(compactLengthDisplay, compact.length);
    ui.showResult(compactResult, compact, resultPanel);
    return compact;
}

// Отправка на сервер
async function sendToServer() {
    if (!compactResult.value) {
        ui.showError("Сначала сгенерируйте строку", errorToast, errorMessageSpan);
        return;
    }
    
    const metadata = {
        name: songTitleInput.value.trim() || currentInfo.name,
        author: songAuthorInput.value.trim() || currentInfo.author,
        tempo: parseInt(tempoInput.value) || currentInfo.tempo,
        duration: currentInfo.duration,
        totalNotes: currentInfo.totalNotes,
        itemId: itemIdInput.value.trim() || "minecraft:paper"
    };
    
    serverResponseDiv.innerHTML = "⏳ Отправка...";
    
    const result = await uploadMusic(compactResult.value, metadata);
    
    if (result.success) {
        ui.showServerResponse(serverResponseDiv, true, result);
    } else {
        ui.showServerResponse(serverResponseDiv, false, result);
        ui.showError("Ошибка сервера", errorToast, errorMessageSpan);
    }
}





















// События
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => e.preventDefault());
dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
});

generateBtn.addEventListener('click', generateCompact);

copyResultBtn.addEventListener('click', async () => {
    if (!compactResult.value) return;
    await navigator.clipboard.writeText(compactResult.value);
    copyResultBtn.textContent = '✅';
    setTimeout(() => { copyResultBtn.textContent = '📋'; }, 1500);
});

uploadServerBtn.addEventListener('click', sendToServer);

errorToast.addEventListener('click', () => { errorToast.style.display = 'none'; });

document.body.addEventListener('dragover', (e) => e.preventDefault());
document.body.addEventListener('drop', (e) => e.preventDefault());