// ===============================
// LOAD DATA FROM JSON (AUTO)
// ===============================
let lecturers = [];
let currentPage = 1;
const itemsPerPage = 4;

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
      `<div class="empty">Không thể tải dữ liệu giảng viên.</div>`;
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
    grid.innerHTML = `<div class="empty">Không có giảng viên.</div>`;
    return;
  }

  list.forEach(l => {
    grid.innerHTML += `
      <div class="card" data-key="${l.key}">
        <div class="card-top">
          <img src="${l.img || "img/default.png"}" class="card-img">
        </div>
        <div class="card-body">
          <h3 class="card-name">${l.name}</h3>
          <p class="card-title">${l.title || ""}</p>
          <p class="card-dept">${l.dept || ""}</p>
        </div>
      </div>
    `;
  });

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
