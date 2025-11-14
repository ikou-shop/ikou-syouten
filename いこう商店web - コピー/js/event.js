function fmtDate(iso) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${da}`;
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
      <div class="row mb-2">
        <div class="col-md-3 fw-bold">${fmtDate(item.date)}</div>
        <div class="col-md-9">
          <a href="event_detail.html?id=${encodeURIComponent(item.id)}" class="text-decoration-none">${item.title}</a>
      </div>
      <hr>
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
