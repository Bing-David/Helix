const floatButtonHTML = `
<div id="float-copy-button" title="Copiar Caso">
    <span>📋 Copiar</span>
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
        const description = document.querySelector('div[ux-id="edit-summary-value-print"]')?.textContent || '';
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

