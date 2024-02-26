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
        let description = document.querySelector('div[ux-id="edit-summary-value-print"]')?.textContent || '';

        // Eliminación de plataformas sociales específicas si aparecen juntas
        description = description.replace(/(instagram\s+Facebook\s+Twitter\s+Youtube\s+Linkedin)/g, '');

        // Eliminar PBX y su número
        description = description.replace(/PBX:\+\(57\) \d{3} \d{7} Ext:/g, '');

        // Eliminar específicamente la línea con el nombre de la persona seguido por <correo@sena.edu.co>
        description = description.replace(/\b[A-Za-záéíóúÁÉÍÓÚñÑ]+ [A-Za-záéíóúÁÉÍÓÚñÑ]+ \<[A-Za-z0-9._%+-]+@sena.edu.co\>/g, '');

        // Eliminar fecha en formato específico y línea de Mesa de Servicio
        description = description.replace(/Vie \d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2} [AP]M/g, '');
        description = description.replace(/​Mesa de Servicio <mesadeservicio@sena.edu.co>​/g, '');
        description = description.replace(/Redes/g, '');

        const currentPageUrl = window.location.href; // Obtener la URL actual

        let content;
        if (identifier.startsWith("TAS")) {
            const associated = document.querySelector('[ux-id="task-parent"]').innerText;
            content = `TAS\ncaso: ${identifier}\nTítulo: ${title}\nNuevo valor: ${associated}\nDescripción: ${description}`;
            chrome.runtime.sendMessage({action: "copySuccess", content: content, type: "TAS",url: currentPageUrl});
        } else {
            const locationName = document.querySelector('div[ux-id="person-site-name"]').innerText;
            const locationAddress = document.querySelector('div[ux-id="person-site-address"]').innerText;
            const caseType = identifier.startsWith("WO") ? "WO" : "INC";
            content = `Por favor revisar este ${caseType}\ncaso: ${identifier}\nTítulo: ${title}\nDescripción: ${description}\nUbicación: ${locationName}, ${locationAddress}`;
            chrome.runtime.sendMessage({action: "copySuccess", content: content, type: caseType,url: currentPageUrl});
        }

        navigator.clipboard.writeText(content).then(() => {
            displayNotification(`${identifier} copiado exitosamente.`, true);
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
