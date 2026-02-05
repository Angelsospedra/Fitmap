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
}

// Inicializar el gestor de configuración cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.settingsManager = new SettingsManager();
});
