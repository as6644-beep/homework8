// Portfolio data
const portfolioName = "Andy SE";

// Step 2: one array per project detail (same index = same project)
const projectTitles = ["Design Project", "Portfolio Website", "Campus Event Tracker"];
const projectDescriptions = [
  "Designed Instagram graphics for Coconino County using Canva.",
  "Built and deployed this portfolio with HTML, CSS, Bootstrap, and JavaScript.",
  "A web app for tracking student organization events across campus."
];
const projectDeadlines = ["2026-09-15", "2026-12-11", "2026-12-15"];

// Extra: screenshot and modal for each project ("" = none)
const projectImages = ["images/project2_ss.png", "images/portfolio_ss.png", ""];
const projectModals = ["#designModal", "#portfolioModal", ""];

// Step 5: table data
const educationRows = [
  { school: "Northern Arizona University", degree: "B.S. Political Science and Software Engineering, Minor in Journalism & Physics", start: "Aug 2025", end: "May 2029" }
];

const experienceRows = [
  { role: "Student Systems Administration Assistant", place: "NAU ITS", start: "Mar 2026", end: "Present" },
  { role: "CAL Career & Marketing Intern", place: "NAU College of Social and Behavioral Sciences", start: "Feb 2026", end: "Present" },
  { role: "Interns to Scholars Fellow, NORPAK", place: "NAU Office of Undergraduate Research and Creative Activity", start: "Jan 2026", end: "Present" },
  { role: "AI Student Ambassador", place: "NAU Cline Library", start: "Jan 2026", end: "May 2026" },
  { role: "Student Financial Aid Worker", place: "NAU Office of Scholarships and Financial Aid", start: "Sep 2025", end: "Aug 2026" },
  { role: "Teaching Assistant", place: "NAU Department of Comparative Cultural Studies", start: "Aug 2025", end: "Present" }
];

// Step 4: download counter
let resumeDownloads = 0;

// Creates an element with optional class and text
function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

// HW7: greeting
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

function showGreeting(name) {
  return "Hello, my name is " + name + "! Welcome to my portfolio!";
}

// Step 1: add a skill badge to the chosen card
function addSkill(event) {
  event.preventDefault();

  const skillInput = document.getElementById("skill-input");
  const categorySelect = document.getElementById("skill-category");
  const message = document.getElementById("skill-message");
  const newSkill = skillInput.value.trim();

  if (newSkill === "") {
    message.textContent = "Please type a skill first.";
    return;
  }

  const skillList = document.getElementById(categorySelect.value);
  const currentSkills = skillList.querySelectorAll(".skill-badge");

  // Stop duplicates
  for (let i = 0; i < currentSkills.length; i++) {
    if (currentSkills[i].textContent.toLowerCase() === newSkill.toLowerCase()) {
      message.textContent = newSkill + " is already listed.";
      return;
    }
  }

  skillList.appendChild(makeElement("span", "badge skill-badge", newSkill));
  message.textContent = newSkill + " added to " + categorySelect.options[categorySelect.selectedIndex].text + ".";
  skillInput.value = "";
}

// Turns "2026-12-15" into a local date at midnight
function toLocalDate(dateText) {
  return new Date(dateText + "T00:00:00");
}

function formatDate(dateText) {
  return toLocalDate(dateText).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Step 3: compare deadline with today
function getProjectStatus(dateText) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineTime = toLocalDate(dateText).getTime();
  const todayTime = today.getTime();

  if (deadlineTime > todayTime) {
    return "Ongoing";
  } else if (deadlineTime < todayTime) {
    return "Completed";
  } else if (deadlineTime === todayTime) {
    return "Due Today";
  }
}

// HW7: days left until a deadline
function daysUntilDeadline(dateText) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((toLocalDate(dateText).getTime() - today.getTime()) / msPerDay);
}

// Step 2: build one card per project
function showProjects() {
  const projectList = document.getElementById("project-list");

  for (let i = 0; i < projectTitles.length; i++) {
    const column = makeElement("div", "col");
    const card = makeElement("article", "card project-card h-100 shadow-sm");

    if (projectImages[i] !== "") {
      const image = makeElement("img", "card-img-top");
      image.src = projectImages[i];
      image.alt = projectTitles[i] + " screenshot";
      card.appendChild(image);
    }

    const body = makeElement("div", "card-body d-flex flex-column");
    body.appendChild(makeElement("h3", "card-title h5", projectTitles[i]));
    body.appendChild(makeElement("p", "card-text", projectDescriptions[i]));

    const deadline = makeElement("p", "card-text mb-2");
    deadline.appendChild(makeElement("span", "fw-semibold", "Deadline: "));
    deadline.append(formatDate(projectDeadlines[i]));
    body.appendChild(deadline);

    // Step 3: status badge
    const status = getProjectStatus(projectDeadlines[i]);
    const statusLine = makeElement("p", "card-text");
    const badge = makeElement("span", "badge status-badge", status);

    if (status === "Ongoing") {
      badge.classList.add("status-ongoing");
      statusLine.appendChild(badge);
      statusLine.appendChild(makeElement("span", "ms-2 small text-body-secondary", daysUntilDeadline(projectDeadlines[i]) + " days left"));
    } else if (status === "Completed") {
      badge.classList.add("status-completed");
      statusLine.appendChild(badge);
    } else {
      badge.classList.add("status-due");
      statusLine.appendChild(badge);
    }
    body.appendChild(statusLine);

    if (projectModals[i] !== "") {
      const detailsButton = makeElement("button", "btn btn-outline-ocean mt-auto align-self-start", "View details");
      detailsButton.type = "button";
      detailsButton.setAttribute("data-bs-toggle", "modal");
      detailsButton.setAttribute("data-bs-target", projectModals[i]);
      body.appendChild(detailsButton);
    }

    card.appendChild(body);
    column.appendChild(card);
    projectList.appendChild(column);
  }
}

// Step 4: count and show downloads
function showDownloadCount() {
  let word = "times";
  if (resumeDownloads === 1) {
    word = "time";
  }
  document.getElementById("download-count").textContent = "Resume downloaded " + resumeDownloads + " " + word;
}

function countDownload() {
  resumeDownloads = resumeDownloads + 1;
  showDownloadCount();
}

// Step 5: build a table from headers, rows, and the keys to read
function buildTable(boxId, headers, rows, keys) {
  const wrapper = makeElement("div", "table-responsive");
  const table = makeElement("table", "table table-striped table-hover align-middle mb-0");
  const head = makeElement("thead", "table-ocean");
  const headRow = document.createElement("tr");

  for (let i = 0; i < headers.length; i++) {
    const headerCell = makeElement("th", "", headers[i]);
    headerCell.scope = "col";
    headRow.appendChild(headerCell);
  }
  head.appendChild(headRow);

  const body = document.createElement("tbody");
  for (let i = 0; i < rows.length; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < keys.length; j++) {
      const cell = makeElement("td", "", rows[i][keys[j]]);
      if (keys[j] === "start" || keys[j] === "end") {
        cell.classList.add("text-nowrap");
      }
      row.appendChild(cell);
    }
    body.appendChild(row);
  }

  table.appendChild(head);
  table.appendChild(body);
  wrapper.appendChild(table);
  document.getElementById(boxId).appendChild(wrapper);
}

// Bonus: theme and display settings
const lightBackground = "#f7fbfc";
const darkBackground = "#0b1f27";

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const themeButton = document.getElementById("theme-toggle");
  const colorInput = document.getElementById("bg-color-input");

  // Clear custom color so the theme color shows
  document.body.style.backgroundColor = "";

  if (document.body.classList.contains("dark-mode")) {
    themeButton.textContent = "Light Mode";
    colorInput.value = darkBackground;
  } else {
    themeButton.textContent = "Dark Mode";
    colorInput.value = lightBackground;
  }
}

function changeFontSize() {
  const size = document.getElementById("font-size-input").value;
  document.documentElement.style.fontSize = size + "px";
  document.getElementById("font-size-value").textContent = size + "px";
}

function changeBackground() {
  document.body.style.backgroundColor = document.getElementById("bg-color-input").value;
}

function resetDisplay() {
  document.body.classList.remove("dark-mode");
  document.body.style.backgroundColor = "";
  document.documentElement.style.fontSize = "";
  document.getElementById("theme-toggle").textContent = "Dark Mode";
  document.getElementById("font-size-input").value = 16;
  document.getElementById("font-size-value").textContent = "16px";
  document.getElementById("bg-color-input").value = lightBackground;
}

// Run after the page loads
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("greeting").textContent = getTimeOfDay() + "! " + showGreeting(portfolioName);

  showProjects();
  buildTable("education-table", ["School", "Degree", "Start", "End"], educationRows, ["school", "degree", "start", "end"]);
  buildTable("experience-table", ["Job Title", "Organization", "Start", "End"], experienceRows, ["role", "place", "start", "end"]);
  showDownloadCount();

  document.getElementById("skill-form").addEventListener("submit", addSkill);

  const resumeLinks = document.querySelectorAll(".resume-download");
  for (let i = 0; i < resumeLinks.length; i++) {
    resumeLinks[i].addEventListener("click", countDownload);
  }

  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("font-size-input").addEventListener("input", changeFontSize);
  document.getElementById("bg-color-input").addEventListener("input", changeBackground);
  document.getElementById("reset-display").addEventListener("click", resetDisplay);
});
