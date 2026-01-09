const buttons = document.querySelectorAll('.nav-btn');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => {
      const img = b.querySelector('img');
      img.src = img.src.replace('_On', '_Off'); // vuelve a off
      b.classList.remove('active');
    });

    const img = btn.querySelector('img');
    img.src = img.src.replace('_Off', '_On'); // pasa a on
    btn.classList.add('active');
  });
});
