// URLの ?id=XXXX を取得
const params = new URLSearchParams(location.search);
const id = params.get("id");

// 日付を「2025年7月6日」形式に
function fmtJP(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
}

async function main() {
  const titleEl  = document.getElementById("ev-title");
  const dateEl   = document.getElementById("ev-date");
  const imgEl    = document.getElementById("ev-image");
  const bodyEl   = document.getElementById("ev-body");
  const detailsEl= document.getElementById("ev-details");
  // ★ 予約ブロックも取得
  const reservationEl = document.getElementById("reservation-block");

  if (!id) {
    titleEl.textContent = "イベントが見つかりませんでした";
    bodyEl.textContent = "URLに ?id= がありません。";
    return;
  }

  try {
    const res = await fetch("data/events.json", { cache: "no-store" });
    const list = await res.json();
    const item = list.find(x => String(x.id) === String(id));

    if (!item) {
      titleEl.textContent = "イベントが見つかりませんでした";
      bodyEl.textContent = "指定されたイベントIDは存在しません。";
      return;
    }

    // タイトル・日付
    titleEl.textContent = item.title || "";
    dateEl.textContent  = item.date ? `投稿日：${fmtJP(item.date)}` : "";

    // 画像（あれば表示）
    if (item.image) {
      imgEl.src = item.image;       // 例: "event_20250706.jpg"
      imgEl.alt = item.title || "イベント画像";
      imgEl.classList.remove("d-none");
    }

    // 本文（配列 or HTML文字列）
    if (Array.isArray(item.body)) {
      bodyEl.innerHTML = item.body.map(p => `<p>${p}</p>`).join("");
    } else if (item.bodyHtml) {
      bodyEl.innerHTML = item.bodyHtml;
    }

    // 詳細（任意の箇条書き）
    if (Array.isArray(item.details) && item.details.length) {
      detailsEl.innerHTML = item.details.map(line => `<li>${line}</li>`).join("");
    }

    // ★ 予約フラグが true のときだけ予約セクションを表示
    if (item.reservation && reservationEl) {
      reservationEl.classList.remove("d-none");
    }

    // ページタイトル（タブ名）も更新
    document.title = `${item.title}｜薫酒や いこう商店`;

  } catch (e) {
    titleEl.textContent = "読み込みエラー";
    bodyEl.textContent = "しばらくしてから再度お試しください。";
    console.error(e);
  }
}

main();
