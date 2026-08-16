// ?id=XXXX を取得
const params = new URLSearchParams(location.search);
const id = params.get("id");

// 日付を yyyy年m月d日に
function fmtJP(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
}

async function main() {
  const titleEl = document.getElementById("article-title");
  const dateEl  = document.getElementById("article-date");
  const imgWrap = document.getElementById("article-image-wrap");
  const imgEl   = document.getElementById("article-image");
  const imgLink = document.getElementById("article-image-link");
  const bodyEl  = document.getElementById("article-body");

  if (!id) {
    titleEl.textContent = "記事が見つかりませんでした";
    bodyEl.textContent = "URLに ?id= が指定されていません。";
    return;
  }

  try {
    const res = await fetch("data/news.json", { cache: "no-store" });
    const list = await res.json();
    const item = list.find(x => String(x.id) === String(id));

    if (!item) {
      titleEl.textContent = "記事が見つかりませんでした";
      bodyEl.textContent = "指定された記事IDは存在しません。";
      return;
    }

    // 反映
    titleEl.textContent = item.title || "";
    dateEl.textContent  = item.date ? fmtJP(item.date) : "";

    if (item.image) {
      imgEl.src = item.image;
      imgEl.alt = item.title || "記事画像";
      if (item.link) {
        imgLink.href = item.link;
        imgLink.setAttribute("aria-label", `${item.title} をYouTubeで見る`);
      } else {
        imgLink.removeAttribute("href");
        imgLink.removeAttribute("target");
        imgLink.removeAttribute("rel");
      }
      imgWrap.classList.remove("d-none");
    } else {
      imgWrap.classList.add("d-none");
    }

    if (Array.isArray(item.body)) {
      const bodyItems = item.body.map(p => `<p>${p}</p>`).join("");
      bodyEl.innerHTML = item.link
        ? `${bodyItems}<p><a href="${item.link}" target="_blank" rel="noopener noreferrer">▶ YouTube動画を見る</a></p>`
        : bodyItems;
    } else if (item.bodyHtml) {
      // ※高度なレイアウトをしたい場合は bodyHtml を使ってください（HTML文字列）
      bodyEl.innerHTML = item.bodyHtml;
    }

    // ページタイトルも差し替え（タブ名）
    document.title = `${item.title}｜薫酒や いこう商店`;

  } catch (e) {
    titleEl.textContent = "読み込みエラー";
    bodyEl.textContent = "しばらくしてから再度お試しください。";
    console.error(e);
  }
}

main();
