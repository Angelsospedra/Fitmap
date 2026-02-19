/**
 * Preferences Toggle Switch Manager
 * Gestiona el estado de los toggles de preferencias y guarda en localStorage
 */
class PreferencesManager {
  constructor() {
    this.storageKey = 'fitmap_preferences';
    this.sportStorageKey = 'fitmap_sport';
    this.toggles = {};
    this.initializeToggles();
    this.setupEventListeners();
    this.loadPreferences();
    this.setupSportSelect();
  }

  /**
   * Inicializa referencias a todos los botones toggle
   */
  initializeToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach((btn) => {
      const toggleName = btn.getAttribute('data-toggle');
      this.toggles[toggleName] = btn;
    });
  }

  /**
   * Configura event listeners para todos los toggles
   */
  setupEventListeners() {
    Object.entries(this.toggles).forEach(([name, btn]) => {
      btn.addEventListener('click', () => this.togglePreference(name));
    });
  }

  /**
   * Alterna el estado de un toggle
   */
  togglePreference(toggleName) {
    const btn = this.toggles[toggleName];
    btn.classList.toggle('active');
    this.savePreferences();

    // Log para debug
    console.log(`Toggle "${toggleName}" cambiado a:`, btn.classList.contains('active'));
  }

  /**
   * Guarda el estado de todos los toggles en localStorage
   */
  savePreferences() {
    const preferences = {};
    Object.entries(this.toggles).forEach(([name, btn]) => {
      preferences[name] = btn.classList.contains('active');
    });
    localStorage.setItem(this.storageKey, JSON.stringify(preferences));
  }

  /**
   * Carga el estado de los toggles desde localStorage
   */
  loadPreferences() {
    const savedPreferences = localStorage.getItem(this.storageKey);

    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        Object.entries(preferences).forEach(([name, isActive]) => {
          const btn = this.toggles[name];
          if (btn) {
            if (isActive) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          }
        });
        console.log('Preferencias cargadas desde localStorage:', preferences);
      } catch (e) {
        console.error('Error al parsear preferencias guardadas:', e);
      }
    } else {
      console.log('No hay preferencias guardadas, usando valores por defecto');
    }
  }

  /**
   * Reinicia todos los toggles a su estado por defecto
   */
  resetPreferences() {
    Object.values(this.toggles).forEach((btn) => {
      btn.classList.remove('active');
    });
    localStorage.removeItem(this.storageKey);
    console.log('Preferencias reiniciadas');
  }

  /**
   * Configura el select de deporte
   */
  setupSportSelect() {
    const sportSelect = document.getElementById('sport');

    if (!sportSelect) return;

    // Cargar deporte guardado
    this.loadSport(sportSelect);

    // Guardar deporte al cambiar
    sportSelect.addEventListener('change', () => {
      this.saveSport(sportSelect);
    });
  }

  /**
   * Guarda el deporte seleccionado en localStorage
   */
  saveSport(select) {
    const selectedSport = select.value;
    localStorage.setItem(this.sportStorageKey, selectedSport);
    console.log('Deporte actualizado:', selectedSport);
  }

  /**
   * Carga el deporte guardado desde localStorage
   */
  loadSport(select) {
    const savedSport = localStorage.getItem(this.sportStorageKey);
    if (savedSport) {
      select.value = savedSport;
      console.log('Deporte cargado:', savedSport);
    }
  }
}

// Inicializar el gestor de preferencias cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.preferencesManager = new PreferencesManager();
});
// Custom Select
const wrapper = document.getElementById('sportDropdown');
const trigger = wrapper.querySelector('.custom-select-trigger');
const valueSpan = wrapper.querySelector('.custom-select-value');
const options = wrapper.querySelectorAll('.custom-select-options li');
const hiddenInput = document.getElementById('sport');

trigger.addEventListener('click', () => {
  wrapper.classList.toggle('open');
});

options.forEach(li => {
  li.addEventListener('click', () => {
    // Actualiza visual
    valueSpan.textContent = li.textContent;
    hiddenInput.value = li.dataset.value;

    // Marca selected
    options.forEach(o => o.classList.remove('selected'));
    li.classList.add('selected');

    // Cierra
    wrapper.classList.remove('open');
  });
});

// Cierra al hacer click fuera
document.addEventListener('click', (e) => {
  if (!wrapper.contains(e.target)) {
    wrapper.classList.remove('open');
  }
});