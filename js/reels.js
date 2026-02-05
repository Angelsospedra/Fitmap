const reels = document.querySelectorAll('.reel');
const videos = document.querySelectorAll('.reel-video');

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            const progressFill = entry.target.querySelector('.progress-fill');

            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
                video.currentTime = 0;
                if (progressFill) {
                    progressFill.style.width = '0%';
                }
            }
        });
    },
    { threshold: 0.75 }
);

reels.forEach(reel => observer.observe(reel));

// Actualizar barra de progreso
videos.forEach(video => {
    video.addEventListener('timeupdate', () => {
        const reel = video.closest('.reel');
        const progressFill = reel.querySelector('.progress-fill');
        const progress = (video.currentTime / video.duration) * 100;
        progressFill.style.width = progress + '%';
    });
});

// Pause/Play al tocar el reel (overlay)
reels.forEach(reel => {
    const overlay = reel.querySelector('.reel-overlay');
    const video = reel.querySelector('.reel-video');
    const pauseIcon = reel.querySelector('.pause-icon');
    
    overlay.addEventListener('click', (e) => {
        // Evitar que se pause al hacer click en botones
        if (e.target.closest('.action-btn') || e.target.closest('.reel-info')) {
            return;
        }
        
        if (video.paused) {
            video.play();
            pauseIcon.classList.remove('show');
        } else {
            video.pause();
            pauseIcon.classList.add('show');
        }
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

/* COMENTARIOS */
const commentsOverlay = document.querySelector('.comments-overlay');
const commentsSection = document.querySelector('.comments-section');
const closeCommentsBtn = document.querySelector('.close-comments');
const commentBtns = document.querySelectorAll('.comment-btn');

// Abrir comentarios
commentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        commentsOverlay.classList.add('active');
        commentsSection.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Cerrar comentarios
function closeComments() {
    commentsOverlay.classList.remove('active');
    commentsSection.classList.remove('active');
    document.body.style.overflow = '';
}

closeCommentsBtn.addEventListener('click', closeComments);
commentsOverlay.addEventListener('click', closeComments);

// Prevenir cierre al hacer click dentro de la sección
commentsSection.addEventListener('click', (e) => {
    e.stopPropagation();
});