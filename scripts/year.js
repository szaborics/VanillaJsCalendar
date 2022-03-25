let nav = 0;
let clicked = null;
localStorage.setItem(
  "events",
  `[
  { "date": "3/23/2022", "title": "Test event" },
  { "date": "5/05/2022", "title": "Test event2" }
]`
);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function openModal(date) {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }

  backDrop.style.display = "block";
}

function load() {
  const dt = new Date();
  const month = document.createElement("div");

  const today = dt.getDate();
  const thisMonth = dt.getMonth();
  const thisYear = dt.getFullYear();

  document.getElementById("yearDisplay").innerText = `${thisYear}`;

  for (let m of months) {
    const firstDayOfMonth = new Date(thisYear, months.indexOf(m), 1);
    const daysInMonth = new Date(thisYear, months.indexOf(m) + 1, 0).getDate();
    const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

    document.getElementById("monthDisplay").innerText = `${m} ${thisYear}`;

    calendar.innerHTML = "";

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = document.createElement("div");
      daySquare.classList.add("day");

      const dayString = `${months.indexOf(m) + 1}/${
        i - paddingDays
      }/${thisYear}`;

      if (i > paddingDays) {
        daySquare.innerText = i - paddingDays;
        const eventForDay = events.find((e) => e.date === dayString);

        if (i - paddingDays === today && months.indexOf(m) === dt.getMonth()) {
          daySquare.id = "currentDay";
          daySquare.innerText = `${today} Today`;
        }

        if (eventForDay) {
          const eventDiv = document.createElement("div");
          eventDiv.classList.add("event");
          eventDiv.innerText = eventForDay.title;
          daySquare.appendChild(eventDiv);
        }

        daySquare.addEventListener("click", () => openModal(dayString));
      } else {
        daySquare.classList.add("padding");
      }

      month.setAttribute("id", m);
      month.appendChild(daySquare);
      calendar.appendChild(daySquare);
    }
  }
}

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
}

initButtons();
load();
