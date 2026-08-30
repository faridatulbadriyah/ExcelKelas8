const STORAGE_KEY = 'excelZoneProgress';
const checks = document.querySelectorAll('[data-check]');
const progressText = document.querySelector('#lessonProgress');
const progressBar = document.querySelector('#lessonProgressBar');
const completeButton = document.querySelector('#completeLesson');

function loadProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return saved[1] || { status: 'locked', progress: 0 };
    } catch (error) {
        return { status: 'locked', progress: 0 };
    }
}

function saveLesson(progressValue, status) {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (error) { saved = {}; }
    saved[1] = { status, progress: progressValue };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

function updateLessonProgress() {
    const completed = [...checks].filter(check => check.checked).length;
    const percentage = Math.round(completed / checks.length * 100);
    const existing = loadProgress();
    const status = existing.status === 'done' ? 'done' : percentage > 0 ? 'progress' : 'locked';
    progressText.textContent = `${status === 'done' ? 100 : percentage}%`;
    progressBar.style.width = `${status === 'done' ? 100 : percentage}%`;
    completeButton.classList.toggle('is-done', status === 'done');
    completeButton.innerHTML = status === 'done' ? 'Sudah selesai <span>✓</span>' : 'Tandai selesai <span>✓</span>';
    saveLesson(status === 'done' ? 100 : percentage, status);
}

const savedLesson = loadProgress();
checks.forEach((check, index) => {
    check.checked = savedLesson.status === 'done' || index < Math.round((savedLesson.progress || 0) / 100 * checks.length);
    check.addEventListener('change', updateLessonProgress);
});
if (savedLesson.status === 'done') updateLessonProgress(); else {
    progressText.textContent = `${savedLesson.progress || 0}%`;
    progressBar.style.width = `${savedLesson.progress || 0}%`;
}

completeButton.addEventListener('click', () => {
    const done = loadProgress().status === 'done';
    if (done) {
        checks.forEach(check => { check.checked = false; });
        saveLesson(0, 'progress');
    } else {
        checks.forEach(check => { check.checked = true; });
        saveLesson(100, 'done');
    }
    updateLessonProgress();
});

document.querySelectorAll('.answer-list button').forEach(button => button.addEventListener('click', () => {
    const feedback = document.querySelector('#answerFeedback');
    document.querySelectorAll('.answer-list button').forEach(item => item.classList.remove('selected', 'correct', 'wrong'));
    button.classList.add('selected');
    if (button.dataset.answer === 'correct') {
        button.classList.add('correct');
        feedback.textContent = 'Benar! Data nilai dapat disusun menjadi tabel agar mudah dihitung dan dibaca.';
    } else {
        button.classList.add('wrong');
        feedback.textContent = 'Coba lagi. Pilih contoh yang berisi data terstruktur dan bisa dibandingkan.';
    }
}));
