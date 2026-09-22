function worksEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function worksDate(iso) {
  const date = new Date(iso);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

async function renderWorks() {
  const target = document.getElementById("works-list");
  if (!target) return;

  try {
    const response = await fetch("data/works.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`イベント実績の読み込みに失敗しました: ${response.status}`);
    const works = await response.json();
    works.sort((a, b) => new Date(b.date) - new Date(a.date));
    const pageSize = 10;
    const requestedPage = Number.parseInt(new URLSearchParams(window.location.search).get("page") || "1", 10);
    const totalPages = Math.max(1, Math.ceil(works.length / pageSize));
    const currentPage = Number.isInteger(requestedPage) && requestedPage >= 1
      ? Math.min(requestedPage, totalPages)
      : 1;
    const pageWorks = works.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    target.innerHTML = pageWorks.map(work => `
      <article class="works-card">
        <a href="work_detail.html?id=${encodeURIComponent(work.id)}">
          <div class="works-card-image">
            ${work.image ? `<img src="${worksEscape(work.image)}" alt="${worksEscape(work.title)}" loading="lazy">` : ""}
          </div>
          <div class="works-card-category">works / ${worksEscape(work.category)}</div>
          <div class="works-card-content">
            <p class="works-card-date">${worksEscape(worksDate(work.date))}</p>
            <h2>${worksEscape(work.title)}</h2>
            <span>VIEW MORE <b aria-hidden="true">→</b></span>
          </div>
        </a>
      </article>
    `).join("");

    const pagination = document.getElementById("works-pagination");
    if (pagination) {
      pagination.innerHTML = totalPages > 1
        ? `
          ${currentPage > 1 ? `<a href="?page=${currentPage - 1}" aria-label="前のページ">‹</a>` : ""}
          ${Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return `<a href="?page=${page}" class="${page === currentPage ? "is-current" : ""}" ${page === currentPage ? 'aria-current="page"' : ""}>${page}</a>`;
          }).join("")}
          ${currentPage < totalPages ? `<a href="?page=${currentPage + 1}" aria-label="次のページ">›</a>` : ""}
        `
        : "";
    }
  } catch (error) {
    console.error(error);
    target.innerHTML = '<p class="text-danger">イベント実績を読み込めませんでした。</p>';
  }
}
