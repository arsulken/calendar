// Ключ для хранения заметок в localStorage
const STORAGE_PREFIX = "day-calendar-";

const dateInput = document.getElementById("date");
const noteArea = document.getElementById("note");
const saveBtn = document.getElementById("saveBtn");
const statusSpan = document.getElementById("status");
const currentDateSpan = document.querySelector("[data-current-date]");

// ---------- Вспомогательные функции ----------

// Форматирование даты для вывода (например: 25 ноября 2025 г.)
function formatDateHuman(date) {
  return date.toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// Получить строку формата YYYY-MM-DD для ключа
function dateToKey(date) {
  return date.toISOString().slice(0, 10);
}

// Загрузка заметки для указанной строки даты
function loadNoteForDate(dateStr) {
  const key = STORAGE_PREFIX + dateStr;
  const savedNote = localStorage.getItem(key) || "";
  noteArea.value = savedNote;
  if (savedNote) {
    statusSpan.textContent = "Заметка загружена.";
    statusSpan.style.color = "#16a34a";
  } else {
    statusSpan.textContent = "Для этой даты заметок нет.";
    statusSpan.style.color = "#64748b";
  }
}

// Сохранение заметки для указанной строки даты
function saveNoteForDate(dateStr) {
  const key = STORAGE_PREFIX + dateStr;
  const value = noteArea.value.trim();

  if (value === "") {
    // Пустую заметку удаляем, чтобы не хранить мусор
    localStorage.removeItem(key);
    statusSpan.textContent = "Пустая заметка удалена.";
    statusSpan.style.color = "#f97316";
  } else {
    localStorage.setItem(key, value);
    const time = new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });
    statusSpan.textContent = "Сохранено в " + time;
    statusSpan.style.color = "#16a34a";
  }
}

// Обновление текста "Текущая дата"
function updateCurrentDateLabel(date) {
  currentDateSpan.textContent = formatDateHuman(date);
}

// ---------- Инициализация ----------

function init() {
  const today = new Date();
  const todayStr = dateToKey(today);

  // Устанавливаем дату по умолчанию
  dateInput.value = todayStr;
  updateCurrentDateLabel(today);

  // Загружаем заметку для текущей даты
  loadNoteForDate(todayStr);
}

// Смена даты пользователем
dateInput.addEventListener("change", () => {
  const selected = dateInput.value; // строка YYYY-MM-DD
  if (!selected) return;
  const date = new Date(selected + "T00:00:00");
  updateCurrentDateLabel(date);
  loadNoteForDate(selected);
});

// Нажатие на кнопку "Сохранить"
saveBtn.addEventListener("click", () => {
  const selected = dateInput.value;
  if (!selected) return;
  saveNoteForDate(selected);
});

// Инициализация при загрузке страницы
init();
