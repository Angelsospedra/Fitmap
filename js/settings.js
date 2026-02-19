/**
 * Settings Toggle Switch Manager
 * Gestiona el estado de los toggles y guarda en localStorage
 */
class SettingsManager {
  constructor() {
    this.storageKey = 'fitmap_settings';
    this.toggles = {};
    this.initializeToggles();
    this.setupEventListeners();
    this.loadSettings();
    this.initializeEditables();
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
      btn.addEventListener('click', () => this.toggleSetting(name));
    });
  }

  /**
   * Alterna el estado de un toggle
   */
  toggleSetting(toggleName) {
    const btn = this.toggles[toggleName];
    btn.classList.toggle('active');
    this.saveSettings();

    // Log para debug
    console.log(`Toggle "${toggleName}" cambiado a:`, btn.classList.contains('active'));
  }

  /**
   * Guarda el estado de todos los toggles en localStorage
   */
  saveSettings() {
    const settings = {};
    Object.entries(this.toggles).forEach(([name, btn]) => {
      settings[name] = btn.classList.contains('active');
    });
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }

  /**
   * Carga el estado de los toggles desde localStorage
   */
  loadSettings() {
    const savedSettings = localStorage.getItem(this.storageKey);

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        Object.entries(settings).forEach(([name, isActive]) => {
          const btn = this.toggles[name];
          if (btn) {
            if (isActive) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          }
        });
        console.log('Configuración cargada desde localStorage:', settings);
      } catch (e) {
        console.error('Error al parsear configuración guardada:', e);
      }
    } else {
      console.log('No hay configuración guardada, usando valores por defecto');
    }
  }

  /**
   * Reinicia todos los toggles a su estado por defecto
   */
  resetSettings() {
    Object.values(this.toggles).forEach((btn) => {
      btn.classList.remove('active');
    });
    localStorage.removeItem(this.storageKey);
    console.log('Configuración reiniciada');
  }

  /**
   * Inicializa los campos editables (ubicación e idioma)
   */
  initializeEditables() {
    this.setupLocationEditable();
    this.setupLanguageEditable();
    this.loadEditables();
  }

  /**
   * Configura la funcionalidad de edición de ubicación
   */
  setupLocationEditable() {
    const locationBtn = document.getElementById('location-btn');
    const locationModal = document.getElementById('location-modal');
    const locationInput = document.getElementById('location-input');
    const locationCancel = document.getElementById('location-cancel');
    const locationConfirm = document.getElementById('location-confirm');
    const locationDisplay = document.getElementById('location-display');

    if (!locationBtn || !locationModal) return;

    // Abrir modal
    locationBtn.addEventListener('click', () => {
      if (locationDisplay) {
        locationInput.value = locationDisplay.textContent;
      }
      locationModal.classList.remove('hidden');
    });

    // Cancelar
    locationCancel.addEventListener('click', () => {
      locationModal.classList.add('hidden');
    });

    // Confirmar
    locationConfirm.addEventListener('click', () => {
      this.saveLocation(locationInput, locationDisplay, locationModal);
    });

    // Permitir guardar con Enter
    locationInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveLocation(locationInput, locationDisplay, locationModal);
      }
    });

    // Cerrar modal al hacer click fuera
    locationModal.addEventListener('click', (e) => {
      if (e.target === locationModal) {
        locationModal.classList.add('hidden');
      }
    });
  }

  /**
   * Guarda la ubicación en localStorage
   */
  saveLocation(input, display, modal) {
    const newLocation = input.value.trim();

    if (newLocation) {
      display.textContent = newLocation;
      localStorage.setItem('user_location', newLocation);
      modal.classList.add('hidden');
      console.log('Ubicación actualizada:', newLocation);
    } else {
      alert('Por favor, ingresa una ubicación válida');
    }
  }

  /**
   * Configura la funcionalidad de edición de idioma
   */
  setupLanguageEditable() {
    const languageBtn = document.getElementById('language-btn');
    const languageModal = document.getElementById('language-modal');
    const languageCancel = document.getElementById('language-cancel');
    const languageConfirm = document.getElementById('language-confirm');
    const languageDisplay = document.getElementById('language-display');

    // Referencias al custom select
    const wrapper = document.getElementById('languageDropdown');
    const trigger = wrapper?.querySelector('.custom-select-trigger');
    const valueSpan = wrapper?.querySelector('.custom-select-value');
    const hiddenInput = wrapper?.querySelector('input[type="hidden"]');
    const optionItems = wrapper?.querySelectorAll('.custom-select-options li');

    if (!languageBtn || !languageModal || !wrapper) return;

    // Marca la opción activa visualmente
    const syncSelected = (value) => {
      optionItems.forEach((li) => {
        li.classList.toggle('selected', li.dataset.value === value);
      });
    };

    // Abrir modal y sincronizar dropdown con valor actual
    languageBtn.addEventListener('click', () => {
      const current = languageDisplay.textContent.trim();
      valueSpan.textContent = current;
      hiddenInput.value = current;
      syncSelected(current);
      languageModal.classList.remove('hidden');
    });

    // Abrir/cerrar dropdown
    trigger.addEventListener('click', () => {
      wrapper.classList.toggle('open');
    });

    // Seleccionar opción
    optionItems.forEach((li) => {
      li.addEventListener('click', () => {
        valueSpan.textContent = li.textContent;
        hiddenInput.value = li.dataset.value;
        syncSelected(li.dataset.value);
        wrapper.classList.remove('open');
      });
    });

    // Cerrar dropdown al click fuera
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
    });

    // Cancelar
    languageCancel.addEventListener('click', () => {
      wrapper.classList.remove('open');
      languageModal.classList.add('hidden');
    });

    // Guardar
    languageConfirm.addEventListener('click', () => {
      this.saveLanguage(hiddenInput, languageDisplay, languageModal, wrapper);
    });

    // Cerrar modal al click en overlay
    languageModal.addEventListener('click', (e) => {
      if (e.target === languageModal) {
        wrapper.classList.remove('open');
        languageModal.classList.add('hidden');
      }
    });
  }

  /**
   * Guarda el idioma en localStorage
   */
  saveLanguage(hiddenInput, display, modal, wrapper) {
    const newLanguage = hiddenInput.value;
    if (newLanguage) {
      display.textContent = newLanguage;
      localStorage.setItem('user_language', newLanguage);
      wrapper.classList.remove('open');
      modal.classList.add('hidden');
      console.log('Idioma actualizado:', newLanguage);
    }
  }

  /**
   * Carga los valores de ubicación e idioma desde localStorage
   */
  loadEditables() {
    const savedLocation = localStorage.getItem('user_location');
    const savedLanguage = localStorage.getItem('user_language');

    const locationDisplay = document.getElementById('location-display');
    const languageDisplay = document.getElementById('language-display');

    if (savedLocation && locationDisplay) {
      locationDisplay.textContent = savedLocation;
    }

    if (savedLanguage && languageDisplay) {
      languageDisplay.textContent = savedLanguage;
    }
  }
}

// Inicializar el gestor de configuración cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.settingsManager = new SettingsManager();
});

