const display = document.getElementById('display');
const historyList = document.getElementById('history-list');
const indicator = document.getElementById('indicator');

// Загрузка данных
window.onload = () => {
    const saved = JSON.parse(localStorage.getItem('calc-history') || '[]');
    saved.forEach(item => renderHistoryItem(item.expr, item.res));
};

// Обработка кликов (эффект индикатора)
function blink() {
    indicator.classList.add('active');
    setTimeout(() => indicator.classList.remove('active'), 150);
}

// Адаптивный шрифт
function adjustFontSize() {
    const len = display.value.length;
    if (len > 12) display.style.fontSize = "30px";
    else if (len > 8) display.style.fontSize = "45px";
    else display.style.fontSize = "64px";
}

function appendToDisplay(value) {
    blink();
    const lastChar = display.value.slice(-1);
    const ops = ['+', '-', '*', '/', '%', '.'];

    if (ops.includes(value) && ops.includes(lastChar)) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }

    if (display.value === '0' && value !== '.') display.value = '';
    display.value += value;
    adjustFontSize();
}

function clearDisplay() {
    blink();
    display.value = '';
    adjustFontSize();
}

function deleteLast() {
    blink();
    display.value = display.value.slice(0, -1);
    adjustFontSize();
}

function calculate() {
    blink();
    try {
        let input = display.value;
        if (!input) return;

        // Деление на ноль
        if (input.includes('/0')) throw new Error("Zero");

        // Проценты
        let expression = input.replace(/(\d+)%/g, (m, n) => n / 100);
        
        let result = eval(expression);
        result = Number(result.toFixed(8));

        if (!isFinite(result)) throw new Error("Infinity");

        saveToHistory(input, result);
        display.value = result;
        adjustFontSize();
    } catch (err) {
        display.value = err.message === "Zero" ? "На 0 нельзя" : "Ошибка";
        display.style.color = "var(--error)";
        setTimeout(() => {
            display.value = '';
            display.style.color = "var(--text)";
            adjustFontSize();
        }, 1200);
    }
}

function saveToHistory(expr, res) {
    const history = JSON.parse(localStorage.getItem('calc-history') || '[]');
    history.unshift({ expr, res });
    localStorage.setItem('calc-history', JSON.stringify(history.slice(0, 20)));
    renderHistoryItem(expr, res);
}

function renderHistoryItem(expr, res) {
    const li = document.createElement('li');
    li.innerHTML = `<div style="opacity:0.5; font-size:14px">${expr}</div><div style="font-size:20px; color:var(--accent)">${res}</div>`;
    li.onclick = () => { display.value = res; adjustFontSize(); };
    historyList.prepend(li);
}

function clearHistory() {
    const items = historyList.querySelectorAll('li');
    items.forEach((item, i) => {
        setTimeout(() => {
            item.style.transform = "translateX(50px)";
            item.style.opacity = "0";
        }, i * 50);
    });
    setTimeout(() => {
        localStorage.removeItem('calc-history');
        historyList.innerHTML = '';
    }, 500);
}

// Слушатель клавиатуры
document.addEventListener('keydown', (e) => {
    const map = { 'Enter': '=', 'Backspace': 'del', 'Escape': 'ac' };
    const key = map[e.key] || e.key;
    if (/[0-9\+\-\*\/\.\%]/.test(key)) appendToDisplay(key);
    if (key === '=') calculate();
    if (key === 'del') deleteLast();
    if (key === 'ac') clearDisplay();
});