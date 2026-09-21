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

    target.innerHTML = works.map(work => `
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
  } catch (error) {
    console.error(error);
    target.innerHTML = '<p class="text-danger">イベント実績を読み込めませんでした。</p>';
  }
}
