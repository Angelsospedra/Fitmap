// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const iosKeyboard = document.getElementById('iosKeyboard');
const keyboardOverlay = document.getElementById('keyboardOverlay');
const cancelBtn = document.getElementById('cancelBtn');
const doneBtn = document.getElementById('doneBtn');
const shiftKey = document.getElementById('shiftKey');
const deleteKey = document.getElementById('deleteKey');
const returnKey = document.getElementById('returnKey');
const numbersKey = document.getElementById('numbersKey');
const content = document.querySelector('.content');
const searchBox = document.querySelector('.search-box');

// Estado del teclado
let keyboardState = {
    isOpen: false,
    isShiftActive: false,
    originalText: ''
};

// Función para abrir el teclado
function openKeyboard() {
    keyboardState.isOpen = true;
    keyboardState.originalText = searchInput.value;
    
    iosKeyboard.classList.add('active');
    keyboardOverlay.classList.add('active');
    content.classList.add('keyboard-active');
    searchBox.classList.add('active');
    
    // Scroll al top suave
    content.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para cerrar el teclado
function closeKeyboard(shouldRestore = false) {
    if (shouldRestore) {
        searchInput.value = keyboardState.originalText;
    }
    
    keyboardState.isOpen = false;
    keyboardState.isShiftActive = false;
    
    iosKeyboard.classList.remove('active');
    keyboardOverlay.classList.remove('active');
    content.classList.remove('keyboard-active');
    searchBox.classList.remove('active');
    shiftKey.classList.remove('active');
}

// Función para agregar carácter
function addCharacter(char) {
    if (keyboardState.isShiftActive) {
        char = char.toUpperCase();
        // Desactivar shift después de escribir
        keyboardState.isShiftActive = false;
        shiftKey.classList.remove('active');
        updateKeysDisplay();
    }
    
    searchInput.value += char;
}

// Función para borrar carácter
function deleteCharacter() {
    searchInput.value = searchInput.value.slice(0, -1);
}

// Función para toggle shift
function toggleShift() {
    keyboardState.isShiftActive = !keyboardState.isShiftActive;
    shiftKey.classList.toggle('active');
    updateKeysDisplay();
}

// Función para actualizar la visualización de las teclas
function updateKeysDisplay() {
    const keys = document.querySelectorAll('.key[data-key]');
    keys.forEach(key => {
        const char = key.getAttribute('data-key');
        if (char.length === 1 && char !== ' ') {
            key.textContent = keyboardState.isShiftActive ? char.toUpperCase() : char;
        }
    });
}

// Event Listeners
searchInput.addEventListener('click', (e) => {
    e.preventDefault();
    openKeyboard();
});

cancelBtn.addEventListener('click', () => {
    closeKeyboard(true); // Restaurar texto original
});

doneBtn.addEventListener('click', () => {
    closeKeyboard(false); // Mantener el texto actual
});

returnKey.addEventListener('click', () => {
    closeKeyboard(false);
    // Aquí puedes agregar la lógica de búsqueda
    console.log('Buscando:', searchInput.value);
});

shiftKey.addEventListener('click', toggleShift);

deleteKey.addEventListener('click', deleteCharacter);

// Event listener para el overlay
keyboardOverlay.addEventListener('click', () => {
    closeKeyboard(true); // Restaurar al hacer click fuera
});

// Event listeners para las teclas del teclado
document.querySelectorAll('.key[data-key]').forEach(key => {
    key.addEventListener('click', () => {
        const char = key.getAttribute('data-key');
        addCharacter(char);
    });
});

// Soporte para teclado físico (opcional)
document.addEventListener('keydown', (e) => {
    if (!keyboardState.isOpen) return;
    
    e.preventDefault();
    
    if (e.key === 'Backspace') {
        deleteCharacter();
    } else if (e.key === 'Enter') {
        closeKeyboard(false);
    } else if (e.key === 'Escape') {
        closeKeyboard(true);
    } else if (e.key === 'Shift') {
        toggleShift();
    } else if (e.key.length === 1) {
        addCharacter(e.key);
    }
});

// Prevenir el zoom al hacer doble clic en iOS
document.addEventListener('dblclick', (e) => {
    e.preventDefault();
}, { passive: false });

// Prevenir el comportamiento por defecto del input
searchInput.addEventListener('focus', (e) => {
    e.preventDefault();
    searchInput.blur();
    openKeyboard();
});

// ===== FUNCIONALIDAD DE FILTROS =====

// Función para filtrar instalaciones por deporte
function filterInstallations(sport) {
    const installationCards = document.querySelectorAll('.installation-card');
    
    installationCards.forEach(card => {
        const cardSport = card.getAttribute('data-sport');
        
        if (sport === 'all' || cardSport === sport) {
            // Mostrar la tarjeta
            card.classList.remove('hidden');
        } else {
            // Ocultar la tarjeta
            card.classList.add('hidden');
        }
    });
}

// Manejo de filtros
const filterChips = document.querySelectorAll('.filter-chip');

filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const sport = chip.getAttribute('data-sport');
        
        // Remover active de todos los chips
        filterChips.forEach(c => {
            c.classList.remove('active');
        });
        
        // Activar el chip clickeado
        chip.classList.add('active');
        
        // Filtrar las instalaciones
        filterInstallations(sport);
        
        console.log('Filtro seleccionado:', sport);
    });
});