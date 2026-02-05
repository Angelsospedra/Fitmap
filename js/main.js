const buttons = document.querySelectorAll('.nav-btn');
const pages = ['home.html', 'reservas.html', 'buscar.html', 'reels.html', 'profile.html'];

buttons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => {
      const img = b.querySelector('img');
      img.src = img.src.replace('_On', '_Off');
      b.classList.remove('active');
    });
    const img = btn.querySelector('img');
    img.src = img.src.replace('_Off', '_On');
    btn.classList.add('active');
    
    // Navegar a la página después de 100ms
    setTimeout(() => {
      window.location.href = pages[index];
    }, 100);
  });
});