const reels = document.querySelectorAll('.reel');
const videos = document.querySelectorAll('.reel-video');
const progressFill = document.querySelector('.progress-fill');

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');

            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    },
    { threshold: 0.75 }
);

reels.forEach(reel => observer.observe(reel));

// Actualizar barra de progreso
videos.forEach(video => {
    video.addEventListener('timeupdate', () => {
        const progress = (video.currentTime / video.duration) * 100;
        progressFill.style.width = progress + '%';
    });
});

/* LIKE */
document.querySelectorAll('.like-btn').forEach(btn => {
    const img = btn.querySelector('.like-img');

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        img.src = btn.classList.contains('active')
            ? '../source/reels/icons/like-active.svg'
            : '../source/reels/icons/like.svg';
    });
});
