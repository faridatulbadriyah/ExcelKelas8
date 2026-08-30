// ============================================
// EXCEL ZONE - MAIN JAVASCRIPT
// Versi Final - Bebas Akses Semua Pertemuan
// ============================================

// ==================== DATA PERTEMUAN ====================
const PERTEMUAN = [
    { id: 1, icon: '🧐', title: 'Perkenalan Materi & Identifikasi Fungsi Excel', color: '#4472C4' },
    { id: 2, icon: '🖥️', title: 'Pengenalan Aplikasi Excel, Tampilan & Menu', color: '#217346' },
    { id: 3, icon: '📅', title: 'Praktik 1: Tabel Jadwal Pelajaran', color: '#FF9B00' },
    { id: 4, icon: '📚', title: 'Praktik 2: Sheet & Tabel Buku Perpustakaan', color: '#FFC000' },
    { id: 5, icon: '➕', title: 'Praktik 3: Pengenalan Simbol Hitung Excel', color: '#4472C4' },
    { id: 6, icon: '📊', title: 'Praktik 4: Data Nilai (Total & Rata-rata)', color: '#217346' },
    { id: 7, icon: '🔢', title: 'Praktik 5: Fungsi Dasar (SUM, AVERAGE, MIN, MAX, COUNT)', color: '#FF9B00' },
    { id: 8, icon: '📈', title: 'Praktik 6: Olah Data dengan Fungsi Dasar', color: '#FFC000' },
    { id: 9, icon: '🎯', title: 'Praktik 7: Pengenalan Fungsi SUMIF, COUNTIF', color: '#4472C4' },
    { id: 10, icon: '🎯', title: 'Praktik 8: Pengenalan Fungsi SUMIFS, COUNTIFS', color: '#217346' },
    { id: 11, icon: '📊', title: 'Praktik 9: Olah Data dengan SUMIF, COUNTIF, SUMIFS, COUNTIFS', color: '#FF9B00' },
    { id: 12, icon: '📝', title: 'Sumatif 1', color: '#E74C3C' },
    { id: 13, icon: '🔍', title: 'Praktik 10: Pengenalan Fungsi HLOOKUP, VLOOKUP', color: '#4472C4' },
    { id: 14, icon: '📋', title: 'Praktik 11: Olah Data dengan HLOOKUP, VLOOKUP', color: '#217346' },
    { id: 15, icon: '🔗', title: 'Praktik 12: Mengolah Data dengan Fungsi Gabungan', color: '#FF9B00' },
    { id: 16, icon: '📉', title: 'Praktik 13: Pembuatan Grafik di Excel', color: '#FFC000' },
    { id: 17, icon: '📝', title: 'Sumatif 2', color: '#E74C3C' },
    { id: 18, icon: '🔄', title: 'Cadangan / Remidi', color: '#666666' }
];

// ==================== PROGRESS MANAGER ====================
const STORAGE_KEY = 'excelZoneProgress';

function getDefaultProgress() {
    const p = {};
    PERTEMUAN.forEach(lesson => {
        p[lesson.id] = { status: 'locked', progress: 0 };
    });
    return p;
}

function loadProgress() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            let modified = false;
            PERTEMUAN.forEach(lesson => {
                if (!parsed[lesson.id]) {
                    parsed[lesson.id] = { status: 'locked', progress: 0 };
                    modified = true;
                }
            });
            if (modified) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            return parsed;
        }
    } catch (e) {
        console.warn('Gagal load progress, reset ke default');
    }
    const def = getDefaultProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
    return def;
}

let progress = loadProgress();

function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    updateUI();
}

// ==================== UPDATE UI ====================
function updateUI() {
    const total = PERTEMUAN.length;
    let completed = 0;
    let totalProgress = 0;

    PERTEMUAN.forEach(lesson => {
        const p = progress[lesson.id];
        if (p) {
            if (p.status === 'done') completed++;
            totalProgress += p.progress || 0;
        }
    });

    const percent = Math.round((completed / total) * 100);

    const bar = document.getElementById('progressBar');
    const percentEl = document.getElementById('progressPercent');
    const countEl = document.getElementById('completedCount');
    const badgeEl = document.getElementById('badgeText');
    const motivationEl = document.getElementById('motivation');

    if (bar) bar.style.width = percent + '%';
    if (percentEl) percentEl.textContent = percent + '%';
    if (countEl) countEl.textContent = completed;

    if (badgeEl) {
        if (percent === 100) {
            badgeEl.textContent = '💎 Master Excel!';
            badgeEl.className = 'badge-master';
        } else if (percent >= 75) {
            badgeEl.textContent = '🥇 Emas — hampir selesai!';
            badgeEl.className = 'badge-gold';
        } else if (percent >= 50) {
            badgeEl.textContent = '🥈 Perak — setengah jalan!';
            badgeEl.className = 'badge-silver';
        } else if (percent >= 25) {
            badgeEl.textContent = '🥉 Perunggu — teruskan!';
            badgeEl.className = 'badge-bronze';
        } else if (percent > 0) {
            badgeEl.textContent = '🌱 Pemula — mulai belajar!';
            badgeEl.className = '';
        } else {
            badgeEl.textContent = '🌟 Mulai petualanganmu!';
            badgeEl.className = '';
        }
    }

    if (motivationEl) {
        if (percent === 100) {
            motivationEl.textContent = '🎉 Selamat! Kamu sudah menyelesaikan semua pertemuan! Kamu hebat! 🌟';
        } else if (percent >= 75) {
            motivationEl.textContent = '🚀 Luar biasa! Tinggal sedikit lagi menuju finish! 💪';
        } else if (percent >= 50) {
            motivationEl.textContent = '💪 Hebat! Sudah setengah jalan! Tetap semangat! 🔥';
        } else if (percent >= 25) {
            motivationEl.textContent = '🌱 Bagus! Teruskan belajarmu, kamu pasti bisa! ✨';
        } else if (percent > 0) {
            motivationEl.textContent = '📚 Ayo mulai belajar Excel! Setiap langkah kecil berarti! 🚀';
        } else {
            motivationEl.textContent = '🌟 Yuk mulai belajar Excel sekarang! Klik kartu pertemuan! ✨';
        }
    }

    renderCards();
}

// ==================== RENDER CARDS ====================
function renderCards(filter = 'all') {
    const grid = document.getElementById('lessonGrid');
    if (!grid) return;

    let html = '';
    PERTEMUAN.forEach(lesson => {
        const p = progress[lesson.id] || { status: 'locked', progress: 0 };
        const status = p.status || 'locked';
        const prog = p.progress || 0;

        if (filter === 'progress' && status !== 'progress') return;
        if (filter === 'done' && status !== 'done') return;
        if (filter === 'locked' && status !== 'locked') return;

        const statusLabel = {
            locked: { label: '🔒 Belum dibuka', cls: 'status-locked' },
            progress: { label: '🔄 Sedang belajar', cls: 'status-progress' },
            done: { label: '✅ Selesai', cls: 'status-done' }
        } [status] || { label: '🔒 Belum', cls: 'status-locked' };

        const isLocked = status === 'locked';

        html += `
            <div class="lesson-card" data-id="${lesson.id}" data-status="${status}" onclick="openLesson(${lesson.id})">
                <div class="card-top">
                    <span class="card-icon">${lesson.icon}</span>
                    <span class="card-status-badge ${statusLabel.cls}">${statusLabel.label}</span>
                </div>
                <span class="card-number">Pertemuan ${lesson.id}</span>
                <div class="card-title">${lesson.title}</div>
                <div class="card-progress-mini">
                    <div class="mini-track">
                        <div class="mini-fill" style="width: ${prog}%"></div>
                    </div>
                    <span class="card-progress-text">${prog}%</span>
                </div>
                <div style="margin-top: 8px; font-size: 10px; color: var(--green-500); font-weight: 500; text-align: right;">
                    ${isLocked ? '🔓 Klik untuk mulai' : '📖 Lanjutkan'}
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
    updateFilterCounts();
}

function updateFilterCounts() {
    const counts = { all: PERTEMUAN.length, progress: 0, done: 0, locked: 0 };
    PERTEMUAN.forEach(lesson => {
        const p = progress[lesson.id];
        if (p) {
            if (p.status === 'progress') counts.progress++;
            else if (p.status === 'done') counts.done++;
            else counts.locked++;
        } else {
            counts.locked++;
        }
    });

    document.querySelectorAll('.filter').forEach(btn => {
        const filter = btn.dataset.filter;
        const span = btn.querySelector('span');
        if (span && counts[filter] !== undefined) {
            span.textContent = counts[filter];
        }
    });
}

// ==================== OPEN LESSON ====================
function openLesson(id) {
    const lesson = PERTEMUAN.find(l => l.id === id);
    if (!lesson) return;

    // Jika status masih 'locked', ubah menjadi 'progress'
    const p = progress[id];
    if (p && p.status === 'locked') {
        progress[id] = { status: 'progress', progress: 0 };
        saveProgress();
    }

    // Redirect ke halaman pertemuan
    window.location.href = `pertemuan/${id}.html`;
}

// ==================== FILTER ====================
document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderCards(this.dataset.filter);
    });
});

// ==================== RESET ====================
document.getElementById('resetButton')?.addEventListener('click', function() {
    if (confirm('⚠️ Yakin ingin mereset semua progress? Data tidak bisa dikembalikan!')) {
        progress = getDefaultProgress();
        saveProgress();
        renderCards();
    }
});

// ==================== MOBILE NAV ====================
document.querySelector('.profile-button')?.addEventListener('click', function(e) {
    e.stopPropagation();
    const nav = document.querySelector('.nav-links');
    nav.classList.toggle('open');
});

document.addEventListener('click', function(e) {
    const nav = document.querySelector('.nav-links');
    const btn = document.querySelector('.profile-button');
    if (nav && btn && !nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('open');
    }
});

// ==================== SCROLL EFFECT ====================
window.addEventListener('scroll', function() {
    const topbar = document.querySelector('.topbar');
    if (topbar) {
        topbar.classList.toggle('scrolled', window.scrollY > 20);
    }
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
    updateUI();
    renderCards('all');
});

console.log('📊 Excel Zone loaded! Semua pertemuan bisa diakses bebas! 🚀');