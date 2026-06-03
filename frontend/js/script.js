/* =========================
   ELEMENTS
========================= */

const studentsEl = document.getElementById("students");
const modal = document.getElementById("modal");

const nameInput = document.getElementById("name");
const deptInput = document.getElementById("dept");
const cgpaInput = document.getElementById("cgpa");

const searchInput = document.getElementById("search");
const departmentFilter = document.getElementById("department");

/* =========================
   DATA
========================= */

let students = [];
let editingIndex = null;
let departmentChart = null;
let currentTab = "home";
let cgpaChart;

/* =========================
   LOAD STUDENTS FROM API
========================= */

async function loadStudents() {
  try {
    const response = await fetch("http://localhost:5000/students");
    students = await response.json();

    updateDepartmentFilter();
    render();
  } catch (error) {
    console.error("Failed to load students:", error);
  }
}

/* =========================
   TAB NAVIGATION
========================= */

function openTab(tabId, element) {
  currentTab = tabId;
  const tabs = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.style.display = "none";
    tab.classList.remove("active");
  });

  const selectedTab = document.getElementById(tabId);
  selectedTab.style.display = "block";
  selectedTab.classList.add("active");

  const menuItems = document.querySelectorAll(".sidebar li");
  menuItems.forEach((item) => item.classList.remove("active"));

  element.classList.add("active");
}

/* =========================
   DASHBOARD STATS
========================= */

function updateStats() {
  const totalStudents = document.getElementById("totalStudents");
  const avgCgpa = document.getElementById("avgCgpa");
  const recentStudents = document.getElementById("recentStudents");

  totalStudents.textContent = students.length;

  let avg = 0;
  if (students.length > 0) {
    avg =
      students.reduce((sum, student) => sum + parseFloat(student.cgpa), 0) /
      students.length;
  }

  avgCgpa.textContent = avg.toFixed(2);

  recentStudents.innerHTML = "";

  if (students.length === 0) {
    recentStudents.innerHTML = "<p>No students added yet.</p>";
  } else {
    students
      .slice(-5)
      .reverse()
      .forEach((student) => {
        recentStudents.innerHTML += `
          <div class="recent-item">
            <strong>${student.name}</strong><br>
            ${student.department}
            • CGPA ${student.cgpa}
          </div>
        `;
      });
  }

  const uniqueDepartments = [...new Set(students.map((s) => s.department))];
  document.getElementById("departmentCount").textContent =
    uniqueDepartments.length;

  const reportTotalStudents = students.length;

  const cgpas = students.map((s) => Number(s.cgpa));

  const reportAvgCgpa =
    cgpas.length > 0
      ? (cgpas.reduce((a, b) => a + b, 0) / cgpas.length).toFixed(2)
      : "0.00";

  const highest = cgpas.length > 0 ? Math.max(...cgpas).toFixed(2) : "0.00";

  const lowest = cgpas.length > 0 ? Math.min(...cgpas).toFixed(2) : "0.00";

  const aboveEight = students.filter((s) => Number(s.cgpa) >= 8).length;

  const belowSix = students.filter((s) => Number(s.cgpa) < 6).length;

  document.getElementById("reportTotalStudents").textContent =
    reportTotalStudents;

  document.getElementById("reportAvgCgpa").textContent = reportAvgCgpa;

  document.getElementById("highestCgpa").textContent = highest;

  document.getElementById("lowestCgpa").textContent = lowest;

  document.getElementById("aboveEight").textContent = aboveEight;

  document.getElementById("belowSix").textContent = belowSix;

  if (students.length > 0) {
    const topStudent = [...students].sort((a, b) => b.cgpa - a.cgpa)[0];

    document.getElementById("topPerformer").innerHTML = `
    <strong>${topStudent.name}</strong><br>
    ${topStudent.department}<br>
    CGPA: ${topStudent.cgpa}
  `;
  }
  const ranges = [0, 0, 0, 0, 0];

  students.forEach((student) => {
    const cgpa = Number(student.cgpa);

    if (cgpa < 6) ranges[0]++;
    else if (cgpa < 7) ranges[1]++;
    else if (cgpa < 8) ranges[2]++;
    else if (cgpa < 9) ranges[3]++;
    else ranges[4]++;
  });

  const chartCanvas = document.getElementById("cgpaChart");

  if (chartCanvas) {
    const ctx = chartCanvas.getContext("2d");

    if (cgpaChart) cgpaChart.destroy();

    cgpaChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["< 6", "6 - 7", "7 - 8", "8 - 9", "9 - 10"],
        datasets: [
          {
            label: "Students",
            data: ranges,
          },
        ],
      },
    });
  }
  const deptStats = {};

  students.forEach((student) => {
    if (!deptStats[student.department]) {
      deptStats[student.department] = {
        totalCgpa: 0,
        count: 0,
      };
    }

    deptStats[student.department].totalCgpa += Number(student.cgpa);
    deptStats[student.department].count++;
  });

  let bestDept = "";
  let bestAvg = 0;

  for (const dept in deptStats) {
    const avg = deptStats[dept].totalCgpa / deptStats[dept].count;

    if (avg > bestAvg) {
      bestAvg = avg;
      bestDept = dept;
    }
  }

  document.getElementById("bestDepartment").innerHTML = `
  <strong>${bestDept}</strong><br>
  Avg CGPA: ${bestAvg.toFixed(2)}
`;
  const top3 = [...students].sort((a, b) => b.cgpa - a.cgpa).slice(0, 3);

  document.getElementById("topStudents").innerHTML = top3
    .map((s, index) => `${index + 1}. ${s.name}<br>CGPA: ${s.cgpa}<br><br>`)
    .join("");
  const lowStudents = students.filter((s) => Number(s.cgpa) < 6);

  if (lowStudents.length === 0) {
    document.getElementById("lowCgpaStudents").innerHTML = "None 🎉";
  } else {
    document.getElementById("lowCgpaStudents").innerHTML = lowStudents
      .map((s) => `${s.name}<br>CGPA: ${s.cgpa}<br><br>`)
      .join("");
  }
  const departmentStats = document.getElementById("departmentStats");

  departmentStats.innerHTML = "";

  for (const dept in deptStats) {
    const avg = deptStats[dept].totalCgpa / deptStats[dept].count;

    departmentStats.innerHTML += `
    <div class="dept-item">
      <strong>${dept}</strong><br>
      Students: ${deptStats[dept].count}<br>
      Avg CGPA: ${avg.toFixed(2)}
      <hr>
    </div>
  `;
  }

  drawDepartmentChart();
}

/* =========================
   PIE CHART
========================= */

function drawDepartmentChart() {
  const canvas = document.getElementById("departmentChart");
  if (!canvas) return;

  const departments = {};
  students.forEach((student) => {
    departments[student.department] =
      (departments[student.department] || 0) + 1;
  });

  if (departmentChart) {
    departmentChart.destroy();
  }

  departmentChart = new Chart(canvas, {
    type: "pie",
    data: {
      labels: Object.keys(departments),
      datasets: [
        {
          data: Object.values(departments),
          backgroundColor: [
            "#A47864",
            "#AFCBFF",
            "#2F3542",
            "#C8A899",
            "#7EA9F5",
            "#964B00",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

/* =========================
   RENDER STUDENTS
========================= */

function render(list = students) {
  studentsEl.innerHTML = "";

  if (list.length === 0) {
    studentsEl.innerHTML = "<p>No students found.</p>";
    updateStats();
    return;
  }

  list.forEach((student) => {
    studentsEl.innerHTML += `
      <div class="student-card">
        <h3>${student.name}</h3>
        <p><strong>Department:</strong> ${student.department}</p>
        <p><strong>CGPA:</strong> ${student.cgpa}</p>
        <div class="card-buttons">
          <button class="btn-edit" onclick="editStudentById(${student.id})">Edit</button>
          <button class="btn-delete" onclick="deleteStudent(${student.id})">Delete</button>
        </div>
      </div>
    `;
  });

  updateStats();
}

/* =========================
   DELETE STUDENT
========================= */

async function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;

  try {
    await fetch(`http://localhost:5000/students/${id}`, {
      method: "DELETE",
    });

    await loadStudents();
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete student");
  }
}

/* =========================
   EDIT STUDENT
========================= */

function editStudentById(id) {
  const index = students.findIndex((student) => student.id === id);
  if (index === -1) return;

  editingIndex = index;
  const student = students[index];

  nameInput.value = student.name;
  deptInput.value = student.department;
  cgpaInput.value = student.cgpa;

  document.querySelector(".modal-content h3").textContent = "Edit Student";
  modal.classList.remove("hidden");
}

/* =========================
   FILTERS
========================= */

function applyFilters() {
  let filtered = students;

  const searchText = searchInput.value.toLowerCase();
  const department = departmentFilter.value;

  if (searchText) {
    filtered = filtered.filter((student) =>
      student.name.toLowerCase().includes(searchText),
    );
  }

  if (department !== "All") {
    filtered = filtered.filter((student) => student.department === department);
  }

  render(filtered);
}

/* =========================
   THEME
========================= */

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("keyup", applyFilters);

/* =========================
   DEPARTMENT FILTER
========================= */

departmentFilter.addEventListener("change", applyFilters);

/* =========================
   OPEN MODAL
========================= */

document.getElementById("openModal").addEventListener("click", () => {
  document.querySelector(".modal-content h3").textContent = "Add Student";
  modal.classList.remove("hidden");
});

/* =========================
   SAVE STUDENT
========================= */

document.getElementById("saveStudent").addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const department = deptInput.value.trim().toUpperCase();
  const cgpa = parseFloat(cgpaInput.value);

  if (!name || !department || isNaN(cgpa)) {
    alert("Please fill all fields");
    return;
  }

  if (cgpa < 0 || cgpa > 10) {
    alert("CGPA must be between 0 and 10");
    return;
  }

  try {
    if (editingIndex !== null) {
      const student = students[editingIndex];

      await fetch(`http://localhost:5000/students/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, department, cgpa }),
      });

      editingIndex = null;
    } else {
      await fetch("http://localhost:5000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, department, cgpa }),
      });
    }

    nameInput.value = "";
    deptInput.value = "";
    cgpaInput.value = "";
    modal.classList.add("hidden");

    // FIX: reload data without changing the current tab
    await loadStudents();
  } catch (error) {
    console.error(error);
    alert("Failed to save student");
  }
});

/* =========================
   UPDATE DEPARTMENT FILTER
========================= */

function updateDepartmentFilter() {
  departmentFilter.innerHTML = '<option value="All">All Departments</option>';

  const departments = [
    ...new Set(students.map((student) => student.department)),
  ];

  departments.sort();

  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department;
    option.textContent = department;
    departmentFilter.appendChild(option);
  });
}

/* =========================
   CANCEL BUTTON
========================= */

document.getElementById("cancelStudent").addEventListener("click", () => {
  editingIndex = null;
  nameInput.value = "";
  deptInput.value = "";
  cgpaInput.value = "";
  modal.classList.add("hidden");
});
/* =========================
   REPORT TABS
========================= */

function switchReportTab(tab, element) {
  document.querySelectorAll(".report-section").forEach((sec) => {
    sec.classList.remove("active");
  });

  document.querySelectorAll(".report-tab").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById("report-" + tab).classList.add("active");
  element.classList.add("active");
}

/* =========================
   CLOSE MODAL WHEN CLICKING
   OUTSIDE THE MODAL
========================= */

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    editingIndex = null;
    modal.classList.add("hidden");
  }
});

/* =========================
   WINDOW LOAD
========================= */

window.onload = async () => {
  await loadStudents();
  const homeMenuItem = document.querySelectorAll(".sidebar li")[0];
  openTab("home", homeMenuItem);
};
