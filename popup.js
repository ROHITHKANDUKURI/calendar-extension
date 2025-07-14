const calendar = document.getElementById("calendar");
const selectedDateEl = document.getElementById("selected-date");
const noteEl = document.getElementById("note");
const saveBtn = document.getElementById("save-note");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth(); // 0-indexed

function renderCalendar(year, month) {
  calendar.innerHTML = '';
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Fill empty spaces for the first row
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  for (let date = 1; date <= daysInMonth; date++) {
    const dateDiv = document.createElement("div");
    dateDiv.className = "date";
    dateDiv.textContent = date;

    const key = `${year}-${month + 1}-${date}`;
    chrome.storage.local.get([key], (result) => {
      if (result[key]) {
        dateDiv.classList.add("note-highlight");
      }
    });

    dateDiv.addEventListener("click", () => onDateClick(date));
    calendar.appendChild(dateDiv);
  }
}

function onDateClick(date) {
  const key = `${year}-${month + 1}-${date}`;
  selectedDateEl.textContent = `Note for ${key}`;
  chrome.storage.local.get([key], (result) => {
    noteEl.value = result[key] || '';
    saveBtn.onclick = () => {
      const note = noteEl.value.trim();
      if (note) {
        chrome.storage.local.set({ [key]: note }, () => renderCalendar(year, month));
      } else {
        chrome.storage.local.remove([key], () => renderCalendar(year, month));
      }
    };
  });
}

renderCalendar(year, month);
