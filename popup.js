document.addEventListener('DOMContentLoaded', function() { 
    const contenedorHistorial = document.getElementById('historial-casos');
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    const searchInput = document.createElement('input');
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Buscar...';
    const searchBtn = document.createElement('button');
    searchBtn.className = 'search-btn';
    searchBtn.textContent = 'Buscar';
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchBtn);
    document.body.insertBefore(searchContainer, contenedorHistorial);
    searchBtn.onclick = () => {
        const searchTerm = searchInput.value.toLowerCase();
        Array.from(contenedorHistorial.children).forEach(caso => {
            const casoTitle = caso.querySelector('.caso-title').textContent.toLowerCase();
            caso.style.display = casoTitle.includes(searchTerm) ? '' : 'none';
        });
    };

    chrome.storage.local.get(['copiedCases'], function(result) {
        const casos = result.copiedCases || [];
        contenedorHistorial.innerHTML = ''; // Limpia el contenedor antes de añadir elementos para evitar duplicados
        casos.forEach(caso => {
            const casoElement = document.createElement('div');
            casoElement.className = `caso caso-${caso.type}`;

            // Extrae el número de caso del contenido
            const casoNumberMatch = caso.content.match(/(WO|INC|TAS)\d+/);
            const casoNumber = casoNumberMatch ? casoNumberMatch[0] : "Número de caso no disponible";
         
            casoElement.innerHTML = `
                <div class="caso-title">${casoNumber}</div>
                <div class="caso-content">${caso.content}</div>
                <button class="copy-btn">COPIAR</button>
                <a href="${caso.url}" target="_blank" class="go-to-url-btn">VER</a>
            `;
            contenedorHistorial.appendChild(casoElement);

            const copyBtn = casoElement.querySelector('.copy-btn');
            copyBtn.onclick = () => navigator.clipboard.writeText(caso.content);
        });
    });
});
