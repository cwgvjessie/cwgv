# 產品需求文件（PRD）v3.0｜誠品線上「職場雷達」內容導購專區

| 項目 | 內容 |
|---|---|
| 文件版本 | v3.0 |
| 撰寫日期 | 2026-06-08 |
| 前版 | v2.0（2026-06-08，建立三方 iframe 分發架構）／ v1.0（2026-06-04，3 個概念頁） |
| 產品範圍 | 誠品外層 wrapper（3）＋ 內容頁（4），共 7 份 HTML |
| 對應檔案 | `eslite.html`、`eslite-article.html`、`eslite-aigc.html`、`eslite-radar.html`、`eslite-article-main.html`、`eslite-article-book.html`、`aigc.html` |
| 狀態 | v2.0 邏輯已逐項與需求方確認正確；v3.0 補上工程實作、資料模型、驗收測試 |

> **v2.0 邏輯確認結果（2026-06-08）**：三方 iframe 分發架構＝正確；`eslite-article-book.html` 與遠見文章頁＝組裝成同一篇文章；「所有站內連結導回誠品殼、`target="_top"` 全程停留誠品品牌」＝刻意設計。三項皆獲確認。
>
> **v3.0 對 v2.0 的唯一修正**：v2.0 §5.4 將 `eslite-article-book.html` 標為「未被殼頁直接內嵌、用途待確認」。經核對原型，實際機制為**三層巢狀 iframe**——遠見文章頁 `eslite-article-main.html` 本身於文章本文下方以 `#book-frame` iframe 內嵌摩速的 `eslite-article-book.html`，組裝成一篇完整文章。本版以此為準，並據此補齊工程與驗收。

---

## 1. 問題陳述（Problem Statement）

誠品線上以書籍與商品銷售為核心，站上缺乏「持續更新、能吸引商務／職場族群回訪」的內容入口。透過與遠見雜誌的內容合作，把職場文章與 AI 智能問答導入誠品，並在內容脈絡嵌入「誠品選書」，同時解決「內容黏著度不足」與「書籍曝光缺乏情境」。

落地限制：內容由不同單位、不同網域託管（遠見 `event.gvm.com.tw`、摩速 GitLab Pages），對外品牌須維持「誠品線上」。因此以一層誠品品牌外殼，用巢狀 iframe 把分散各站的內容整合為單一誠品專區，各內容方仍可獨立維護自己的頁面。

---

## 2. 目標（Goals）

1. **建立內容入口**：每日更新的職場精選文章列表，培養回訪（衡量：列表頁 7 日回訪率）。
2. **內容轉導購**：文章與問答情境嵌入誠品選書（衡量：選書區 CTR、帶入書籍頁 PV 與加購數）。
3. **延長閱讀動線**：列表 → 文章 → 延伸提問 → AI 問答（衡量：平均瀏覽頁數、單頁停留）。
4. **強化差異化**：AI 問答逐字動畫體驗（衡量：問答頁完讀率、CTA 點擊率）。
5. **跨站整合、單一品牌呈現**：誠品殼 ＋ 巢狀 iframe，整合遠見、摩速內容，各方獨立維護。
6. **可被外站嵌入**：問答頁支援被合作站（如 `health.gvm.com.tw`）反向 iframe 嵌入，擴大觸及。

---

## 3. 非目標（Non-Goals）

1. 不做帳號與個人化推薦（v1 無登入、統一策展）。
2. 不做站內全文搜尋。
3. 不做留言、收藏、分享互動。
4. 不做問答即時生成（靜態存檔重播，非即時呼叫模型）。
5. 不做後台 CMS（v1 以靜態檔／資料陣列維護）。
6. 不做內容集中遷移（維持各站託管、以 iframe 整合，是刻意架構選擇）。

---

## 4. 系統架構（System Architecture）

### 4.1 三方角色

| 角色 | 網域（原型） | 負責檔案 | 職責 |
|---|---|---|---|
| **誠品（外層殼）** | `cwgvjessie.github.io/cwgv/2026-eslite-radar/` | `eslite.html`、`eslite-article.html`、`eslite-aigc.html` | 誠品品牌 navbar＋footer；以 iframe 內嵌內容；接收子頁高度；站內導覽一律導回誠品殼 |
| **遠見（內容）** | `event.gvm.com.tw/ddc_test/0Jessie/2026-eslite-radar/` | `eslite-radar.html`、`eslite-article-main.html` | 列表頁、文章本文（含看更多折疊、原文連結、巢狀內嵌摩速選書模組） |
| **摩速（內容）** | `jessie79279-d9f4cd.gitlab.io/2026-eslite-radar/` | `aigc.html`、`eslite-article-book.html` | AI 問答頁、選書＋延伸問題模組 |

> 網域為原型暫用之測試／Pages 位置，正式對應網域待商務／工程確認。

### 4.2 三條進入路徑與 iframe 巢狀關係

```
路徑 A：列表
誠品 eslite.html
  └─[iframe #contentFrame]─ 遠見 eslite-radar.html（列表，1 層巢狀）

路徑 B：文章（三層巢狀 ★ v3.0 修正重點）
誠品 eslite-article.html
  └─[iframe #contentFrame]─ 遠見 eslite-article-main.html（文章本文）
        └─[iframe #book-frame]─ 摩速 eslite-article-book.html（5 選書 + 5 延伸問題）

路徑 C：AI 問答
誠品 eslite-aigc.html
  └─[iframe #contentFrame]─ 摩速 aigc.html（問答，1 層巢狀）
```

- **文章頁是三層巢狀**：使用者讀到的「一篇完整文章」＝遠見文章本文（上半）＋摩速選書與延伸問題（下半），由遠見文章頁透過 `#book-frame` 巢狀內嵌摩速頁組裝而成。
- 文章本文（hero、導言、段落、h2、原文連結）由遠見 `eslite-article-main.html` 自行渲染；**選書與延伸問題完全來自巢狀的摩速 `eslite-article-book.html`**，遠見頁本身不渲染選書（v2.0 §5.3 此處需更正）。

### 4.3 跨網域高度同步：兩跳 postMessage 中繼（Two-Hop Relay）

因 iframe 跨網域、且文章頁為三層，高度需逐層往上中繼：

```
摩速 book（最內層）
  量測自身高度 h_book
  → postMessage({iframeHeight: h_book}, '*') 給父層
遠見 main（中間層）
  收到 → 設定 #book-frame 高度 = h_book
  → 重新量測自身總高度 h_main（含 book-frame）
  → postMessage({iframeHeight: h_main}, '*') 給父層
誠品 wrapper（最外層）
  收到 → 設定 #contentFrame 高度 = h_main
```

- 列表（路徑 A）與問答（路徑 C）為單跳：子頁直接 `postMessage` 給誠品殼。
- 所有殼頁與中間層 iframe 皆 `scrolling="no"`，高度完全由 postMessage 驅動，避免雙重捲軸。
- 觸發重送時機：`load`、DOM/內容變動（展開「看更多」、逐字動畫完成）、`resize`、子層高度更新（中間層收到內層訊息後）。

> **安全注意（原型缺陷）**：原型 `targetOrigin='*'`、各層未驗證 `event.origin`。正式版須限定 targetOrigin 為對應網域、白名單比對 origin、並校驗 `iframeHeight` 型別與合理範圍（見 §8、§9 規格）。

### 4.4 導覽動線（Navigation Flow）

```
誠品 eslite.html（內嵌遠見列表）
  └─ 精選文章 / 近期熱門(target=_top) ──▶ 誠品 eslite-article.html
        （內嵌遠見文章 ▸ 內嵌摩速選書+延伸問題）
        ├─ 誠品選書 go-buy ──▶ eslite.com/product/…（外站，新分頁）
        ├─ 原文連結 ──▶ gvm.com.tw/article/130163（外站，新分頁）
        └─ 延伸問題 ──▶ 誠品 eslite-aigc.html
              （內嵌摩速 aigc 問答）
              ├─ 誠品選書 go-buy ──▶ eslite.com/product/…（外站）
              └─「回到原始文章」──▶ 誠品 eslite-article.html
```

- 關鍵設計（已確認為刻意）：站內連結一律指向誠品殼 `eslite-*.html`；iframe 內連結用 `target="_top"` 跳出框架、導向頂層視窗，使用者全程停留誠品品牌外殼，不裸露遠見／摩速網域。

---

## 5. 功能需求（Requirements）

### 5.1 誠品外層殼（`eslite.html`／`eslite-article.html`／`eslite-aigc.html`）

**Must-Have（P0）**
- 誠品 navbar：「誠品線上」（連 eslite.com）｜分隔線｜「職場雷達」（連殼頁）。
- 單一 `#contentFrame` iframe，`scrolling="no"`、`border:none`、寬 100%，`src` 指向對應內容頁。
- 誠品 footer：© 2026 誠品線上 ＋「職場雷達」連結。
- postMessage 高度接收器（§4.3 外層端）。
- 響應式：`.shell` 最大寬 800px，≤600px padding 收為 20px。
- `<meta name="robots" content="noindex, nofollow">`。

**上線前須修正（原型缺陷）**
- `eslite.html`、`eslite-article.html` 的 iframe 未設 `min-height`，首屏在高度訊息到達前可能為 0（`eslite-aigc.html` 已設 `min-height:600px`，三頁應一致）。
- 移除 navbar 旁開發註解（「假設這是誠品 iframe」「↓↓ 內嵌…iframe …」）與測試網域字串。

**Nice-to-Have（P1）**：殼頁參數化（單一範本＋設定產生三頁）。

### 5.2 列表頁 — 遠見（`eslite-radar.html`）

**Must-Have（P0）**
- Hero：欄目標籤「遠見雜誌」、主標「職場雷達」、自動今日日期（`new Date()`，`YYYY.MM.DD`）。
- 精選文章清單：每則含分類標籤、標題、摘要、縮圖，整則可點擊（連誠品殼 `eslite-article.html`）。
- 三大分類視覺：**高階決策（high）／管理實務（mgmt）／職場成長（grow）**，各有色票與底色。
- 「近期熱門文章」彈窗：依 `ARTICLES` 陣列過濾今日往前 14 天有資料的日期，由新到舊分組；列內連結 `target="_top"`。
- postMessage 高度回報；頁尾標示內容合作：遠見雜誌。

**Nice-to-Have（P1）**：列表分頁／無限捲動；分類篩選器。
**Future（P2）**：後端 API 動態供稿，取代前端 `ARTICLES` 陣列。

### 5.3 文章本文 — 遠見（`eslite-article-main.html`）

**Must-Have（P0）**
- 文章 Hero：分類標籤（如「高階決策」）、封面圖＋圖說、標題、作者 meta。
- 全文：導言（`.gvm-lede`）＋段落＋小標（h2）。
- 「看更多」摘要折疊：依非空白字元數（門檻約 300 字）量測，超過則先收合＋漸層遮罩＋「看更多」鈕；點擊平滑展開後移除按鈕並重送高度。
- 原文連結：導向遠見原始文章（原型為 `gvm.com.tw/article/130163`，新分頁）。
- **巢狀內嵌摩速選書模組**：文章本文與原文連結之後，以 `#book-frame` iframe 內嵌 `eslite-article-book.html`，並監聽其 postMessage 設定 `#book-frame` 高度、再回報自身總高度給誠品殼（§4.3 中間層）。
- GTM 埋點容器（原型含 `GTM-5ZH7TSVB`）。

> 更正 v2.0：選書卡片**不**由本頁渲染，而是來自巢狀的摩速 `eslite-article-book.html`（見 §5.4）。

**Nice-to-Have（P1）**：閱讀進度指示。
**Future（P2）**：文章與選書關聯由後台設定。

### 5.4 選書＋延伸問題模組 — 摩速（`eslite-article-book.html`）

**角色**：作為文章頁的「下半段」，被遠見文章頁巢狀內嵌，組裝成一篇完整文章。

**Must-Have（P0）**
- 選書區（`books-section`）：5 本誠品選書卡片（封面、標題、作者、簡介、價格、go-buy 按鈕），點擊前往誠品商品頁（`eslite.com/product/…`，新分頁）；簡介 `line-clamp` 裁切（首本 5 行／行動 10 行，其餘 3 行／行動 4 行）。
- 延伸問題區（`questions-section`）：5 則延伸問題（`question-item`／`q-num`／`q-text`），每則點擊導向 AI 問答頁（連誠品殼 `eslite-aigc.html`）。
- 「看更多」折疊（與文章頁共用樣式與門檻）。
- postMessage 高度回報（§4.3 最內層）。

### 5.5 AI 問答頁 — 摩速（`aigc.html`）

**Must-Have（P0）**
- 結構化資料：schema.org `QAPage`（JSON-LD），含問題、解答、發佈日期、來源 URL。
- 問題標題、解答區（日期、「Answer」標籤、含小標與段落）。
- 逐字動畫：字元級 span 逐一顯示（約 8ms/字）；動畫中以 `typing-mode` 暫時內聯排版避免區塊預撐；閒置約 700ms（`FINISH_IDLE_MS`）視為結束、恢復排版並重送高度。
- `<pre>` 自動加 Copy 鈕（含動態新增者）：Clipboard API 優先、`execCommand` fallback。
- CTA：「回到原始文章」連誠品殼 `eslite-article.html`（新分頁）。
- 誠品選書區：與文章選書一致的 5 本卡片。
- **被嵌入適配（反向 iframe）**：依 `document.referrer` 判斷被 `dev-health.gvm.com.tw` / `health.gvm.com.tw` 以 iframe 嵌入時，調整上方間距避開父站介面。
- 進場動畫（AOS）：僅在非 iframe（`window.self === window.top`）情境啟用。
- postMessage 高度回報。

**Nice-to-Have（P1）**：文案情境化替換的設定化；尊重 `prefers-reduced-motion`、動畫可關閉。
**Future（P2）**：後端即時生成解答。

### 5.6 共用設計系統（跨頁）

- 字體：Noto Serif TC、Noto Sans TC、EB Garamond（Google Fonts）。
- 共用 CSS variables（`--text-*`／`--rule-*`）、navbar、footer、選書卡片、分類標籤一致。
- 共用資源：AOS（`./css/aos.js`）、`./css/gvm.css`、`./css/smartanswer_icon.svg`、`images/`。
- 響應式：≤600px 版面調整（列表單欄、隱藏縮圖、字級縮放）。

---

## 6. 工程實作規格（Engineering Specification）★ v3.0 強化

### 6.1 postMessage 高度同步協定

**訊息格式（建議標準化）**
```js
// 子頁 → 父頁
{
  type: 'eslite-radar:resize',   // 建議加 type 命名空間，避免與第三方訊息衝突
  iframeHeight: <number>          // 內容像素高度（整數、>0）
}
```
> 原型現況：訊息僅 `{ iframeHeight: <number> }`、無 `type`，且父頁僅檢查 `typeof === 'number'`。正式版建議補 `type` 命名空間並比對。

**子頁送出邏輯（每個內容頁）**
```js
function postHeight() {
  const h = Math.ceil(document.documentElement.getBoundingClientRect().height);
  parent.postMessage({ type: 'eslite-radar:resize', iframeHeight: h }, PARENT_ORIGIN);
}
window.addEventListener('load', postHeight);
window.addEventListener('resize', debounce(postHeight, 100));
// 內容變動後（看更多展開、逐字動畫完成、字體載入）亦需呼叫 postHeight()
```

**父頁／中間層接收邏輯**
```js
const ALLOWED = new Set([ /* 對應子層網域 */ ]);
window.addEventListener('message', (e) => {
  if (!ALLOWED.has(e.origin)) return;                       // ★ 必加：origin 白名單
  const d = e.data;
  if (!d || d.type !== 'eslite-radar:resize') return;
  const h = Number(d.iframeHeight);
  if (!Number.isFinite(h) || h <= 0 || h > 20000) return;    // ★ 範圍校驗
  frame.style.height = h + 'px';
  if (IS_MIDDLE_LAYER) postHeight();                         // 中間層收到後向上中繼
});
```

**驗收**：見 §9 測試案例 T-RESIZE-01～05。

### 6.2 三層巢狀高度中繼

- 文章路徑為三層，須確保「最內層更新 → 中間層 reflow 後重新量測 → 外層更新」不漏跳、不無限迴圈。
- 中間層（遠見 main）收到 book 高度後，先設 `#book-frame` 高度，於下一個 animation frame 再量測自身總高並上送，避免量到舊高度。
- 防迴圈：僅在高度實際改變（與上次送出值不同）時才再送，避免父子互相觸發。

### 6.3 跨網域嵌入安全（CSP / 白名單）

| 項目 | 規格 |
|---|---|
| 內容頁 `frame-ancestors` | 限定誠品殼網域（路徑 A/B/C 的父頁）；問答頁另允許 `health.gvm.com.tw`、`dev-health.gvm.com.tw` |
| postMessage targetOrigin | 子頁送出時填對應父頁網域，禁用 `'*'` |
| origin 白名單 | 父頁／中間層比對 `event.origin` 後才採用 `iframeHeight` |
| 訊息結構校驗 | 比對 `type`、`iframeHeight` 型別與範圍 |
| 內容頁索引 | 殼頁 `noindex`；內容頁是否開放索引見 §10 待解 |

### 6.4 追蹤與埋點（跨網域）

- 原型於遠見文章頁含 GTM 容器 `GTM-5ZH7TSVB`、問答頁 CTA 標 `data-tracked="1"`。
- 跨網域 iframe 使父子不同網域、Cookie 與歸因受限，須設計跨網域量測：
  - 子頁事件經 `postMessage` 上報父頁（誠品殼）統一送一處 GA4；或
  - 各層各自送、再以共同 `session_id`（由殼頁產生、透過 postMessage 下傳）串接。
- 待數據團隊定義事件清單（見 §7.5）與工具（GA4／自建）。

### 6.5 相容與降級

- Clipboard：API 優先、`execCommand("copy")` fallback。
- 動畫：iframe 內停用 AOS；建議加 `prefers-reduced-motion` 降級逐字動畫為直接顯示。
- 字體載入：字體 swap 完成後重送高度，避免量測偏差。

---

## 7. 內容與資料模型（Content & Data Model）★ v3.0 新增

> v1 以前端靜態資料維護；下列 schema 同時作為「目前前端陣列結構」與「未來 API／CMS 欄位」對照，利於 Phase 2 平滑切換。

### 7.1 列表文章（radar `ARTICLES`）
```ts
type RadarArticle = {
  date: string;          // 'YYYY.MM.DD'，近期熱門以此過濾 14 天窗
  items: {
    cat: 'high' | 'mgmt' | 'grow';   // 分類 → 對應色票
    label: '高階決策' | '管理實務' | '職場成長';
    title: string;
    desc?: string;        // 精選清單用摘要
    thumb?: string;       // 縮圖路徑
    href: string;         // 一律指向誠品殼 eslite-article.html
  }[];
};
```

### 7.2 文章本文（article-main）
```ts
type Article = {
  category: '高階決策' | '管理實務' | '職場成長';
  title: string;
  cover: { src: string; caption: string };
  authors: string[];
  lede: string;
  body: ({ type: 'p'; text: string } | { type: 'h2'; text: string })[];
  originalUrl: string;   // 遠見原文，如 gvm.com.tw/article/130163
  bookModuleUrl: string; // 巢狀內嵌的摩速選書頁（eslite-article-book.html）
};
```

### 7.3 選書卡片（book / aigc 共用）
```ts
type BookCard = {
  cover: string;
  title: string;
  author: string;
  desc: string;          // line-clamp 裁切顯示
  priceNow: number;
  buyUrl: string;        // eslite.com/product/{id}
  emphasis?: boolean;    // 首本可全寬強調
};
```

### 7.4 延伸問題與問答（question → aigc QAPage）
```ts
type DeepQuestion = {
  num: number;
  text: string;
  href: string;          // 指向誠品殼 eslite-aigc.html（可帶問答 id）
};

type QAPage = {           // 對應 schema.org QAPage JSON-LD
  question: string;
  answer: { datePublished: string; html: string };  // 含 h/p/pre
  sourceUrl: string;      // 來源/原文
  backToArticleUrl: string; // 回到誠品殼 eslite-article.html
  books: BookCard[];
};
```

### 7.5 關聯與埋點欄位（待補）
- 文章 ↔ 選書 ↔ 延伸問題 ↔ 問答 的對應（id 對應表，一對多／多對多待定）。
- 事件埋點欄位建議：`view_article`、`expand_more`、`click_book`、`click_question`、`view_qa`、`qa_complete`、`click_cta_back`，各帶 `article_id` / `book_id` / `question_id` / `session_id`。

---

## 8. 風險與安全（Risks & Security）

| 風險 | 說明 | 建議 |
|---|---|---|
| postMessage 未驗證來源 | 原型 `targetOrigin='*'`、未檢查 `event.origin` | 限定 targetOrigin、白名單比對 origin、校驗結構與範圍（§6.1/§6.3） |
| 三層巢狀高度競態 | 中間層量到舊高度或父子互觸發迴圈 | 下一 frame 再量測、僅變動時上送（§6.2） |
| Clickjacking / 任意嵌入 | 內容頁可被任意站 iframe | `CSP: frame-ancestors` 白名單（§6.3） |
| 跨網域歸因 | 父子不同網域、Cookie 受限 | 跨網域量測設計（§6.4） |
| 開發殘留 | 殼頁註解、測試網域字串 | 上線前清理（§5.1） |
| 資源相對路徑 | `images/`、`./css/` 需各站齊備 | 部署檢查清單三站逐一確認 |

---

## 9. 驗收與測試案例（Acceptance & Test Cases）★ v3.0 強化

### 9.1 列表頁（radar）
- **T-RADAR-01**：Given 頁面載入，Then Hero 顯示今日日期（`YYYY.MM.DD`）。
- **T-RADAR-02**：Given 精選清單，When 點任一則，Then 於頂層視窗開啟誠品殼 `eslite-article.html`（非在 iframe 內）。
- **T-RADAR-03**：Given 近 14 天內有資料，When 點「近期熱門文章」，Then 彈窗依日期由新到舊分組、列含分類標籤。
- **T-RADAR-04**：When 點遮罩／ESC／關閉鈕，Then 彈窗關閉並恢復頁面捲動。
- **T-RADAR-05**：Given 近 14 天無資料，Then 顯示「暫無資料」。

### 9.2 文章頁（main + 巢狀 book）
- **T-ART-01**：Given 內文超門檻（約 300 字），Then 預設只顯示摘要並出現「看更多」。
- **T-ART-02**：When 點「看更多」，Then 平滑展開全文、遮罩與按鈕消失，且 iframe 高度（中間層→外層）同步增加、無雙捲軸。
- **T-ART-03**：Given 內文未達門檻，Then 完整顯示且無「看更多」。
- **T-ART-04**：When 點原文連結，Then 新分頁開啟遠見原文。
- **T-ART-05**：Given 文章頁載入，Then 文章本文下方正確內嵌摩速選書模組（`#book-frame`），選書 5 本＋延伸問題 5 則皆顯示。
- **T-ART-06**：When 點選書 go-buy，Then 新分頁開啟對應誠品商品頁。
- **T-ART-07**：When 點延伸問題，Then 頂層視窗開啟誠品殼 `eslite-aigc.html`。

### 9.3 AI 問答頁（aigc）
- **T-QA-01**：Given 頁面載入，Then 解答逐字呈現，完成後排版正常、可正常選取閱讀。
- **T-QA-02**：Given 含 `<pre>`，Then 自動出現 Copy 鈕；When 點擊，Then 內容複製成功（API 或 fallback）。
- **T-QA-03**：When 點「回到原始文章」，Then 新分頁開啟誠品殼 `eslite-article.html`。
- **T-QA-04**：Given 被 `health.gvm.com.tw` iframe 嵌入，Then 上方間距調整、且 AOS 停用。
- **T-QA-05**：Given 非 iframe 直接開啟，Then AOS 進場動畫啟用。

### 9.4 跨網域高度同步（resize）
- **T-RESIZE-01**：Given 任一路徑載入完成，Then 外層 iframe 高度等於內容高度、無內捲動條。
- **T-RESIZE-02**：Given 文章三層巢狀，When 最內層 book 高度變動，Then 高度經兩跳中繼正確傳至誠品殼。
- **T-RESIZE-03**：Given 收到非白名單 origin 訊息，Then 忽略、不調整高度。
- **T-RESIZE-04**：Given 收到 `iframeHeight` 非數值／超範圍，Then 忽略。
- **T-RESIZE-05**：Given 視窗縮放，Then 高度重算且不進入無限上送迴圈。

### 9.5 響應式
- **T-RWD-01**：≤600px 列表改單欄、隱藏縮圖、字級縮放正常。
- **T-RWD-02**：選書簡介 `line-clamp` 行數依首本／其餘與裝置寬度正確套用。

---

## 10. 待解問題（Open Questions）

| # | 問題 | 待回覆方 | 阻塞性 |
|---|---|---|---|
| 1 | 三站正式網域與部署位置（誠品殼、遠見、摩速）為何？原型用測試／Pages 網域 | 工程 / 商務 | 阻塞 |
| 2 | ~~book 模組與文章頁關係~~ → **已確認：巢狀內嵌、組裝成同一篇文章**（§4.2） | — | 已解決 |
| 3 | 列表精選與「近期熱門」資料：前端硬編碼或改 API／CMS 供稿？ | 工程 / 產品 | 阻塞 |
| 4 | 文章 ↔ 選書 ↔ 延伸問題 ↔ 問答 的對應關係如何維護（一對一／多對多、跨站如何同步） | 產品 | 阻塞 |
| 5 | 選書價格／庫存是否即時串接誠品商品 API | 工程 | 非阻塞 |
| 6 | AI 問答內容產製與更新流程（誰產生、如何審核、多久更新） | 內容營運 | 阻塞 |
| 7 | 跨網域埋點事件規格與工具（GA4？自建？GTM 容器歸屬） | 數據 | 阻塞 |
| 8 | 內容頁是否開放索引，或全 `noindex` 僅透過誠品殼曝光 | 產品 / SEO | 非阻塞 |
| 9 | 遠見內容授權範圍、原文導流與來源標示是否符合合約 | 法務 / 商務 | 阻塞 |
| 10 | 無障礙：逐字動畫是否尊重 `prefers-reduced-motion`、可關閉 | 設計 | 非阻塞 |
| 11 | postMessage targetOrigin 與 `frame-ancestors` 白名單清單 | 工程 / 資安 | 阻塞 |

---

## 11. 時程與相依（Timeline & Dependencies）

**相依**：誠品商品頁／API、遠見內容供稿與授權、摩速問答頁產製與反向 iframe 規格、三站正式網域與部署、CSP／postMessage 白名單、數據團隊跨網域埋點。

**建議分期**
- **Phase 1（核心動線）**：七頁靜態版＋清理開發殘留＋postMessage origin 白名單收斂＋基本埋點，驗證「讀 → 導購」假設。
- **Phase 2（內容自動化）**：列表／選書改 API 或 CMS 供稿、價格即時化、文章與問答關聯後台化（依 §7 schema）。
- **Phase 3（體驗強化）**：分類篩選、無障礙動畫、嵌入觸及擴大、跨網域歸因完善、個人化評估。

**硬期限**：依合作活動檔期（待商務確認）。

---

## 附錄 A：檔案清單

| 檔案 | 託管方 | 角色 | 巢狀層級 |
|---|---|---|---|
| `eslite.html` | 誠品殼 | 內嵌遠見列表頁 | 外層 |
| `eslite-article.html` | 誠品殼 | 內嵌遠見文章頁 | 外層 |
| `eslite-aigc.html` | 誠品殼 | 內嵌摩速問答頁 | 外層 |
| `eslite-radar.html` | 遠見 | 職場雷達列表頁 | 內容（1 層） |
| `eslite-article-main.html` | 遠見 | 文章本文＋巢狀內嵌選書 | 內容（中間層） |
| `eslite-article-book.html` | 摩速 | 選書＋延伸問題（被遠見巢狀內嵌） | 內容（最內層） |
| `aigc.html` | 摩速 | AI 問答頁 | 內容（1 層） |

## 附錄 B：外部相依資源

- 字體：Google Fonts（Noto Serif TC / Noto Sans TC / EB Garamond）。
- 動畫：AOS（`./css/aos.js`）。樣式：`./css/gvm.css`、`./css/smartanswer_icon.svg`。
- 外連：誠品商品頁（`eslite.com/product/…`）、遠見原文（`gvm.com.tw/article/130163`）。
- 埋點：GTM 容器 `GTM-5ZH7TSVB`（遠見文章頁）。
- 圖片：相對路徑 `images/`（cover、book）。
- 反向嵌入合作站：`health.gvm.com.tw` / `dev-health.gvm.com.tw`。
