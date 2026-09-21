function detailEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function detailDate(iso) {
  const date = new Date(iso);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

async function loadWorkDetail() {
  const id = new URLSearchParams(location.search).get("id");
  const title = document.getElementById("work-title");
  const image = document.getElementById("work-image");
  const meta = document.getElementById("work-meta");
  const body = document.getElementById("work-body");

  if (!id) {
    title.textContent = "イベント実績が見つかりませんでした";
    return;
  }

  try {
    const response = await fetch("data/works.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`イベント実績の読み込みに失敗しました: ${response.status}`);
    const events = await response.json();
    const event = events.find(item => String(item.id) === String(id));
    if (!event) {
      title.textContent = "イベント実績が見つかりませんでした";
      return;
    }

    title.textContent = event.title || "";
    document.title = `${event.title}｜イベント実績｜薫酒や いこう商店`;

    if (event.image) {
      image.src = event.image;
      image.alt = event.title || "イベント実績画像";
      image.classList.remove("d-none");
    }

    meta.innerHTML = `
      <div><strong>TYPE</strong><span>${detailEscape(event.category || "イベント")}</span></div>
      <div><strong>DATES</strong><span>${event.date ? detailEscape(detailDate(event.date)) : "開催日未定"}</span></div>
      <div><strong>VENUE</strong><span>${detailEscape(event.venue || "薫酒や いこう商店")}</span></div>
      `;

    if (Array.isArray(event.body)) {
      body.innerHTML = event.body.map(paragraph => `<p>${detailEscape(paragraph)}</p>`).join("");
    } else if (event.bodyHtml) {
      body.innerHTML = event.bodyHtml;
    }
  } catch (error) {
    console.error(error);
    title.textContent = "読み込みエラー";
  }
}

loadWorkDetail();
