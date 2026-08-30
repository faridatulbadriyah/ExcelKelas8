// ============================================
// PERTEMUAN 5 - JAVASCRIPT
// Materi: Simbol Hitung Excel (+, -, *, /, ^, %)
// ============================================

// ==================== PROGRESS ====================
const STORAGE_KEY = 'excelZoneProgress';
const lessonId = 5;
const checks = document.querySelectorAll('[data-check]');
const progressText = document.querySelector('#lessonProgress');
const progressBar = document.querySelector('#lessonProgressBar');
const completeButton = document.querySelector('#completeLesson');

function readProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return saved[lessonId] || { status: 'locked', progress: 0 };
    } catch (error) {
        return { status: 'locked', progress: 0 };
    }
}

function writeProgress(status, value) {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (error) { saved = {}; }
    saved[lessonId] = { status, progress: value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

function refreshProgress(save = true) {
    const checked = [...checks].filter(check => check.checked).length;
    const value = Math.round(checked / checks.length * 100);
    const current = readProgress();
    const status = current.status === 'done' ? 'done' : value ? 'progress' : 'locked';
    const shownValue = status === 'done' ? 100 : value;
    progressText.textContent = `${shownValue}%`;
    progressBar.style.width = `${shownValue}%`;
    completeButton.classList.toggle('is-done', status === 'done');
    completeButton.innerHTML = status === 'done' ? 'Sudah selesai <span>✓</span>' : 'Tandai selesai <span>✓</span>';
    if (save) writeProgress(status, shownValue);
}

const saved = readProgress();
checks.forEach((check, index) => {
    check.checked = saved.status === 'done' || index < Math.round((saved.progress || 0) / 100 * checks.length);
    check.addEventListener('change', () => refreshProgress());
});
progressText.textContent = `${saved.status === 'done' ? 100 : saved.progress || 0}%`;
progressBar.style.width = `${saved.status === 'done' ? 100 : saved.progress || 0}%`;
completeButton.classList.toggle('is-done', saved.status === 'done');
completeButton.innerHTML = saved.status === 'done' ? 'Sudah selesai <span>✓</span>' : 'Tandai selesai <span>✓</span>';
completeButton.addEventListener('click', () => {
    const isDone = readProgress().status === 'done';
    checks.forEach(check => { check.checked = !isDone; });
    writeProgress(isDone ? 'progress' : 'done', isDone ? 0 : 100);
    refreshProgress();
});

// ==================== AKTIVITAS ====================
document.querySelectorAll('.answer-list').forEach(group => {
    group.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const feedback = group.parentElement.querySelector('.answer-feedback');
            group.querySelectorAll('button').forEach(item => item.classList.remove('selected', 'correct', 'wrong'));
            button.classList.add('selected');
            
            if (button.dataset.answer === 'correct') {
                button.classList.add('correct');
                feedback.textContent = '✅ Benar! 6 × 2 dikerjakan lebih dahulu, lalu 15 + 12 = 27.';
            } else if (button.dataset.answer === 'wrong') {
                button.classList.add('wrong');
                feedback.textContent = '❌ Belum tepat. Ingat, perkalian dikerjakan sebelum penjumlahan.';
            } else if (button.dataset.answerExtra === 'correct') {
                button.classList.add('correct');
                feedback.textContent = '✅ Benar! 2^3 = 2 × 2 × 2 = 8.';
            } else if (button.dataset.answerExtra === 'wrong') {
                button.classList.add('wrong');
                feedback.textContent = '❌ Belum tepat. 2^3 = 2 × 2 × 2 = 8, bukan 6 atau 9.';
            }
        });
    });
});

// ==================== DATA LATIHAN ====================
const data = {
    1: { a: 20, b: 10, expected: '=A1+B1', result: 30, operator: '+', display: '+' },
    2: { a: 50, b: 15, expected: '=A2-B2', result: 35, operator: '-', display: '−' },
    3: { a: 12, b: 8, expected: '=A3*B3', result: 96, operator: '*', display: '×' },
    4: { a: 100, b: 4, expected: '=A4/B4', result: 25, operator: '/', display: '÷' },
    5: { a: 3, b: 2, expected: '=A5^B5', result: 9, operator: '^', display: '^' },
    6: { a: 200, b: 25, expected: '=A6*B6%', result: 50, operator: '%', display: '%' }
};

let correctCount = 0;
const totalQuestions = 6;

// ==================== EVALUASI RUMUS (DIPERBAIKI) ====================
function evaluateFormula(formula) {
    try {
        let expr = formula.replace(/\s/g, '');
        
        if (expr.startsWith('=')) {
            expr = expr.substring(1);
        }
        
        // Ganti A1, B1, A2, B2, ... dengan nilai sebenarnya
        for (let i = 1; i <= 6; i++) {
            expr = expr.replace(new RegExp(`A${i}`, 'gi'), data[i].a);
            expr = expr.replace(new RegExp(`B${i}`, 'gi'), data[i].b);
        }
        
        // Ubah % menjadi /100
        expr = expr.replace(/(\d+)%/g, (match, num) => {
            return `(${num}/100)`;
        });
        
        // Ubah ^ menjadi ** (pemangkatan di JavaScript)
        expr = expr.replace(/\^/g, '**');
        
        // Evaluasi
        const result = Function('"use strict"; return (' + expr + ')')();
        return result;
    } catch (e) {
        return null;
    }
}

// ==================== CEK FORMULA ====================
function checkFormula(row) {
    const input = document.getElementById(`f${row}`);
    const resultCell = document.getElementById(`r${row}`);
    const operatorCell = document.getElementById(`o${row}`);
    const formula = input.value.trim();
    const expected = data[row].expected;
    
    const cleanFormula = formula.replace(/\s/g, '');
    const cleanExpected = expected.replace(/\s/g, '');
    
    if (!cleanFormula.startsWith('=')) {
        resultCell.textContent = '⚠️';
        resultCell.className = 'cell-result';
        resultCell.style.color = 'var(--red)';
        operatorCell.textContent = '❌';
        operatorCell.style.color = 'var(--red)';
        operatorCell.style.background = '#FDE8E8';
        input.classList.remove('correct', 'wrong');
        updateScore();
        return;
    }
    
    const result = evaluateFormula(formula);
    
    if (result !== null && Number.isFinite(result)) {
        resultCell.textContent = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
        resultCell.className = 'cell-result has-result';
        resultCell.style.color = 'var(--green-700)';
        
        const expectedResult = data[row].result;
        const isResultCorrect = Math.abs(result - expectedResult) < 0.01;
        const isFormulaExact = cleanFormula.toUpperCase() === cleanExpected.toUpperCase();
        
        if (isResultCorrect) {
            if (isFormulaExact) {
                operatorCell.textContent = data[row].display;
            } else {
                let detectedOp = '?';
                const upper = cleanFormula.toUpperCase();
                if (upper.includes('+')) detectedOp = '+';
                else if (upper.includes('-')) detectedOp = '−';
                else if (upper.includes('*')) detectedOp = '×';
                else if (upper.includes('/')) detectedOp = '÷';
                else if (upper.includes('^')) detectedOp = '^';
                else if (upper.includes('%')) detectedOp = '%';
                operatorCell.textContent = detectedOp;
            }
            operatorCell.style.color = 'var(--green-600)';
            operatorCell.style.background = 'var(--green-25)';
            input.classList.add('correct');
            input.classList.remove('wrong');
        } else {
            operatorCell.textContent = '❌';
            operatorCell.style.color = 'var(--red)';
            operatorCell.style.background = '#FDE8E8';
            input.classList.add('wrong');
            input.classList.remove('correct');
        }
    } else {
        resultCell.textContent = '⚠️';
        resultCell.className = 'cell-result';
        resultCell.style.color = 'var(--red)';
        operatorCell.textContent = '❌';
        operatorCell.style.color = 'var(--red)';
        operatorCell.style.background = '#FDE8E8';
        input.classList.add('wrong');
        input.classList.remove('correct');
    }
    
    updateScore();
}

function updateScore() {
    correctCount = 0;
    for (let i = 1; i <= totalQuestions; i++) {
        const operatorCell = document.getElementById(`o${i}`);
        if (operatorCell.textContent !== '❌' && 
            operatorCell.textContent !== '⏳' && 
            operatorCell.textContent !== '?') {
            correctCount++;
        }
    }
    
    document.getElementById('scoreValue').textContent = `${correctCount} / ${totalQuestions}`;
    
    const fill = document.getElementById('scoreFill');
    const percent = (correctCount / totalQuestions) * 100;
    fill.style.width = percent + '%';
    
    const message = document.getElementById('scoreMessage');
    if (correctCount === totalQuestions) {
        message.textContent = '🎉 Luar biasa! Kamu menguasai semua simbol hitung! 🌟';
        message.style.color = 'var(--green-600)';
        document.querySelector('[data-check="latihan"]').checked = true;
        refreshProgress();
    } else if (correctCount >= 4) {
        message.textContent = '💪 Bagus! Tinggal sedikit lagi! Semangat! 🔥';
        message.style.color = 'var(--orange)';
    } else if (correctCount >= 2) {
        message.textContent = '📚 Terus belajar! Kamu pasti bisa! ✨';
        message.style.color = 'var(--blue)';
    } else if (correctCount > 0) {
        message.textContent = '🌱 Ayo coba lagi! Lihat contoh rumus di atas! 💪';
        message.style.color = 'var(--gray-500)';
    } else {
        message.textContent = '✍️ Mulai kerjakan latihanmu! Tulis rumus di kolom C!';
        message.style.color = 'var(--gray-500)';
    }
}

function checkAllFormulas() {
    for (let i = 1; i <= totalQuestions; i++) {
        checkFormula(i);
    }
    updateScore();
}

function resetFormulas() {
    const defaultOperators = {
        1: '+',
        2: '−',
        3: '×',
        4: '÷',
        5: '^',
        6: '%'
    };
    
    for (let i = 1; i <= totalQuestions; i++) {
        const input = document.getElementById(`f${i}`);
        const resultCell = document.getElementById(`r${i}`);
        const operatorCell = document.getElementById(`o${i}`);
        
        input.value = '';
        input.classList.remove('correct', 'wrong');
        resultCell.textContent = '—';
        resultCell.className = 'cell-result';
        resultCell.style.color = 'var(--gray-400)';
        operatorCell.textContent = defaultOperators[i];
        operatorCell.style.color = 'var(--green-600)';
        operatorCell.style.background = 'var(--green-25)';
    }
    correctCount = 0;
    document.getElementById('scoreValue').textContent = '0 / 6';
    document.getElementById('scoreFill').style.width = '0%';
    document.getElementById('scoreMessage').textContent = '✍️ Mulai kerjakan latihanmu! Tulis rumus di kolom C!';
    document.getElementById('scoreMessage').style.color = 'var(--gray-500)';
    
    document.querySelector('[data-check="latihan"]').checked = false;
    refreshProgress();
}

// ==================== INIT ====================
console.log('📊 Pertemuan 5 loaded! Selamat belajar simbol hitung Excel! 🚀');