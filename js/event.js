function fmtDate(iso) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${da}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

async function renderEvents({ jsonPath = "data/events.json", targetId = "event-list", limit = null } = {}) {
  try {
    const res = await fetch(jsonPath, { cache: "no-store" });
    const data = await res.json();
    const items = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    const sliced = limit ? items.slice(0, limit) : items;

    const el = document.getElementById(targetId);
    if (!el) return;

    el.innerHTML = sliced.map(item => `
      <article class="event-archive-card">
        <a href="event_detail.html?id=${encodeURIComponent(item.id)}" class="event-archive-link">
          <div class="event-archive-image">
            ${item.image
              ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">`
              : `<div class="event-archive-image-placeholder">EVENT</div>`}
          </div>
          <div class="event-archive-body">
            <p class="event-archive-date">${escapeHtml(fmtDate(item.date))}</p>
            <h2>${escapeHtml(item.title)}</h2>
            <span class="event-archive-more">詳しく見る <span aria-hidden="true">→</span></span>
          </div>
        </a>
      </article>
    `).join("");

    const moreWrap = document.getElementById("event-more-wrap");
    if (moreWrap) {
      if (limit && items.length > limit) moreWrap.classList.remove("d-none");
      else moreWrap.classList.add("d-none");
    }
  } catch (e) {
    console.error("イベント読込エラー:", e);
  }
}
