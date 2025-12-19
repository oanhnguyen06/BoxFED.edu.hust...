// ================== LOAD DATA ==================
let lecturers = [];
let currentPage = 1;
const itemsPerPage = 4;

fetch("./data/lecturers.json")
  .then(res => {
    if (!res.ok) throw new Error("Không load được lecturers.json");
    return res.json();
  })
  .then(data => {
    lecturers = data.map((l, idx) => ({
      ...l,
      key: l.key || l.slug || String(idx)
    }));
    renderLecturers();
  })
  .catch(err => {
    console.error(err);
    document.getElementById("lecturerGrid").innerHTML =
      `<div class="empty">Không thể tải dữ liệu giảng viên.</div>`;
  });

// ================== RENDER LECTURERS ==================
function renderLecturers() {
  const grid = document.getElementById("lecturerGrid");
  grid.innerHTML = "";

  let start = (currentPage - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  let list = lecturers.slice(start, end);

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty">Không tìm thấy giảng viên nào…</div>`;
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  list.forEach(l => {
    grid.innerHTML += `
      <div class="card" data-key="${l.key}">
        <div class="card-top">
          <img src="${l.img}" class="card-img" onerror="this.src='img/default.png'">
        </div>
        <div class="card-body">
          <h3 class="card-name"><a href="javascript:void(0)">${l.name}</a></h3>
          <p class="card-title">${l.title || ""}</p>
          <p class="card-dept">${l.dept || ""}</p>
        </div>
      </div>
    `;
  });

  attachCardEvents();
  renderPagination();
}

// ================== CARD EVENTS ==================
function attachCardEvents() {
  document.querySelectorAll(".card").forEach(card => {
    const key = card.getAttribute("data-key");
    card.onclick = () => openLecturer(key);
    card.querySelector(".card-img").onclick = e => { e.stopPropagation(); openLecturer(key); };
    card.querySelector(".card-name a").onclick = e => { e.stopPropagation(); openLecturer(key); };
  });
}

// ================== PAGINATION ==================
function renderPagination() {
  const totalPages = Math.ceil(lecturers.length / itemsPerPage);
  const pag = document.getElementById("pagination");

  pag.innerHTML = `
    <button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>◀</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    pag.innerHTML += `
      <button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goPage(${i})">${i}</button>
    `;
  }

  pag.innerHTML += `
    <button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>▶</button>
  `;
}

function goPage(p) {
  const totalPages = Math.ceil(lecturers.length / itemsPerPage);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderLecturers();
  document.querySelector(".container")?.scrollIntoView({ behavior: "smooth" });
}

// ================== MODAL ==================
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
  fillList("modalCourses", lec.courses || lec.teach);
  fillList("modalTrain", lec.train);
  fillList("modalWork", lec.work);

  const infoBox = document.getElementById("modalInfoExtra");
  if (infoBox) {
    infoBox.innerHTML = `
      <p><strong>Email:</strong> ${lec.email || "(đang cập nhật)"}</p>
      <p><strong>Điện thoại:</strong> ${lec.phone || "(đang cập nhật)"}</p>
      <p><strong>Văn phòng:</strong> ${lec.office || "(đang cập nhật)"}</p>
    `;
  }
}

function fillList(id, arr) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  if (Array.isArray(arr)) {
    arr.forEach(i => el.innerHTML += `<li>${i}</li>`);
  }
}

document.getElementById("closeModal").onclick = closeModal;
document.getElementById("modalBg").onclick = closeModal;
function closeModal() {
  document.getElementById("modalBg").style.display = "none";
  document.getElementById("modalBox").style.display = "none";
}

// ================== SEARCH ==================
document.getElementById("btnSearch").onclick = () => {
  const q = document.getElementById("searchBox").value.toLowerCase().trim();
  if (!q) {
    currentPage = 1;
    renderLecturers();
    return;
  }

  const filtered = lecturers.filter(l =>
    (l.name || "").toLowerCase().includes(q) ||
    (l.title || "").toLowerCase().includes(q) ||
    (l.dept || "").toLowerCase().includes(q)
  );

  const grid = document.getElementById("lecturerGrid");
  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty">Không tìm thấy giảng viên nào…</div>`;
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  filtered.forEach(l => {
    grid.innerHTML += `
      <div class="card" data-key="${l.key}">
        <div class="card-top"><img src="${l.img}" class="card-img"></div>
        <div class="card-body">
          <h3 class="card-name"><a href="javascript:void(0)">${l.name}</a></h3>
          <p class="card-title">${l.title || ""}</p>
          <p class="card-dept">${l.dept || ""}</p>
        </div>
      </div>
    `;
  });

  attachCardEvents();
  document.getElementById("pagination").innerHTML = "";
};

document.getElementById("searchBox").addEventListener("keypress", e => {
  if (e.key === "Enter") document.getElementById("btnSearch").click();
});
