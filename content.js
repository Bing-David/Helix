const floatButtonHTML = `
<div id="float-container">
    <div id="float-copy-button" class="float-button" title="Copiar Caso">
        <span>📋 Copiar</span>
    </div>
    <div id="float-note-button" class="float-button" title="Agregar Nota">
        <span>📝 NOTA</span>
    </div>
</div>
<div id="copy-notification" class="hidden"></div>
`;

// Inyecta el botón y la notificación en la página
document.body.insertAdjacentHTML('beforeend', floatButtonHTML);

const copyButton = document.getElementById('float-copy-button');
const notification = document.getElementById('copy-notification');

copyButton.onclick = function() {
    try {
        const identifier = document.querySelector('span[ux-id="character-field-value"]').innerText;
        const title = document.querySelector('div[ux-id="ticket-title-value"]').innerText;
        const description = document.querySelector('div[ux-id="edit-summary-value-print"]')?.textContent.replace(/\s+/g, ' ') || '';
        const locationName = document.querySelector('div[ux-id="person-site-name"]').innerText;
        const locationAddress = document.querySelector('div[ux-id="person-site-address"]').innerText;
        const caseType = identifier.startsWith("WO") ? "WO" : "INC";
        const currentPageUrl = window.location.href; // Obtener la URL actual
        const content = `Por favor revisar este ${caseType}\ncaso: ${identifier}\nTítulo: ${title}\nDescripción: ${description}\nUbicación: ${locationName}, ${locationAddress}`;
        navigator.clipboard.writeText(content).then(() => {
            displayNotification(`${identifier} copiado exitosamente.`, true);
            chrome.runtime.sendMessage({action: "copySuccess", content: content, type: caseType,url: currentPageUrl});
        });
    } catch (error) {
        displayNotification("Error al copiar el contenido.", false);
    }
};

function displayNotification(message, isSuccess) {
    notification.textContent = message;
    notification.className = isSuccess ? 'notification success' : 'notification error';
    setTimeout(() => notification.className = 'hidden', 3000);
}


//Nota
const noteButton = document.getElementById('float-note-button');
noteButton.onclick = function() {
    const noteContent = "Cordial saludo, se realizan los siguientes procesos: se asigna el requerimiento al técnico de soporte en sitio.";
    navigator.clipboard.writeText(noteContent).then(() => {
        displayNotification("Nota copiada exitosamente.", true);
    }).catch(err => {
        displayNotification("Error al copiar la nota.", false);
    });
};
