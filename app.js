// ===============================
// GLOBAL
// ===============================
let lecturers = [];
let currentPage = 1;
const itemsPerPage = 4;

// ===============================
// LOAD DATA FROM JSON (AUTO)
// ===============================
fetch("./data/lecturers.json")
  .then(res => {
    if (!res.ok) throw new Error("Không tìm thấy lecturers.json");
    return res.json();
  })
  .then(data => {
    lecturers = data;
    renderLecturers();
  })
  .catch(err => {
    console.error("Lỗi load dữ liệu:", err);
    document.getElementById("lecturerGrid").innerHTML =
      `<div class="empty">Không thể tải dữ liệu giảng viên</div>`;
  });

// ===============================
// RENDER LECTURERS
// ===============================
function renderLecturers() {
  const grid = document.getElementById("lecturerGrid");
  grid.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const list = lecturers.slice(start, end);

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty">Không có giảng viên</div>`;
    return;
  }

  list.forEach(l => {
    grid.innerHTML += `
      <div class="card" data-key="${l.key}">
        <div class="card-top">
          <img src="${l.img || 'img/default.png'}" class="card-img">
        </div>
        <div class="card-body">
          <h3 class="card-name">${l.name}</h3>
          <p class="card-title">${l.title || ""}</p>
          <p class="card-dept">${l.dept || ""}</p>
        </div>
      </div>
    `;
  });

  attachCardEvents();
  renderPagination();
}

// ===============================
// PAGINATION
// ===============================
function renderPagination() {
  const totalPages = Math.ceil(lecturers.length / itemsPerPage);
  const pag = document.getElementById("pagination");
  pag.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pag.innerHTML += `
      <button class="page-btn ${i === currentPage ? "active" : ""}"
        onclick="goPage(${i})">${i}</button>
    `;
  }
}

function goPage(p) {
  currentPage = p;
  renderLecturers();
  document.querySelector(".container").scrollIntoView({ behavior: "smooth" });
}

// ===============================
// CARD CLICK → MODAL
// ===============================
function attachCardEvents() {
  document.querySelectorAll(".card").forEach(card => {
    card.onclick = () => openLecturer(card.dataset.key);
  });
}

// ===============================
// MODAL
// ===============================
function openLecturer(key) {
  const lec = lecturers.find(l => l.key === key);
  if (!lec) return;

  document.getElementById("modalBg").style.display = "block";
  document.getElementById("modalBox").style.display = "block";

  document.getElementById("modalImg").src = lec.img || "img/default.png";
  document.getElementById("modalName").textContent = lec.name;
  document.getElementById("modalTitle").textContent = lec.title || "";
  document.getElementById("modalDept").textContent = lec.dept || "";

  fillList("modalSkills", lec.area);
  fillList("modalCourses", lec.teach || lec.courses);
  fillList("modalTrain", lec.train);
  fillList("modalWork", lec.work);
}

function fillList(id, arr) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  if (!arr) return;
  arr.forEach(i => el.innerHTML += `<li>${i}</li>`);
}

document.getElementById("closeModal").onclick = closeModal;
document.getElementById("modalBg").onclick = closeModal;
function closeModal() {
  document.getElementById("modalBg").style.display = "none";
  document.getElementById("modalBox").style.display = "none";
}

// ===============================
// SEARCH
// ===============================
document.getElementById("btnSearch").onclick = () => {
  const q = document.getElementById("searchBox").value.toLowerCase().trim();
  if (!q) {
    currentPage = 1;
    renderLecturers();
    return;
  }

  const filtered = lecturers.filter(l =>
    l.name.toLowerCase().includes(q) ||
    (l.title || "").toLowerCase().includes(q) ||
    (l.dept || "").toLowerCase().includes(q)
  );

  const grid = document.getElementById("lecturerGrid");
  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty">Không tìm thấy giảng viên</div>`;
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  filtered.forEach(l => {
    grid.innerHTML += `
      <div class="card" data-key="${l.key}">
        <img src="${l.img || 'img/default.png'}" class="card-img">
        <h3>${l.name}</h3>
        <p>${l.title || ""}</p>
      </div>
    `;
  });

  attachCardEvents();
  document.getElementById("pagination").innerHTML = "";
};
