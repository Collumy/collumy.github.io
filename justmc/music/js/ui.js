export function showError(message, errorToast, errorMessageSpan) {
    errorMessageSpan.innerText = message;
    errorToast.style.display = 'flex';
    setTimeout(() => {
        errorToast.style.display = 'none';
    }, 4000);
}

export function updateFileStatus(fileStatus, fileName, notesCount) {
    fileStatus.innerText = `✅ ${fileName} (${notesCount} нот)`;
}

export function displaySongInfo(info, durationDisplay, notesCountDisplay, versionBadge) {
    durationDisplay.innerText = info.duration;
    notesCountDisplay.innerText = info.totalNotes;
    if (versionBadge) versionBadge.innerText = `NBS v${info.version}`;
}

export function fillEditorFields(songTitleInput, songAuthorInput, tempoInput, info) {
    songTitleInput.value = info.name;
    songAuthorInput.value = info.author;
    tempoInput.value = info.tempo;
}

export function updateCompactStats(compactLengthDisplay, compactLength) {
    compactLengthDisplay.innerText = `${compactLength} символов`;
}

export function showResult(compactResult, compactString, resultPanel) {
    compactResult.value = compactString;
    resultPanel.style.display = 'block';
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function showServerResponse(serverResponseDiv, success, data) {
    if (success) {
        serverResponseDiv.innerHTML = `✅ <a href="${data.url}" target="_blank" style="color:#acf7c1;">${data.url}</a>`;
    } else {
        serverResponseDiv.innerHTML = `❌ Ошибка: ${data.error}`;
    }
}