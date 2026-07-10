const API_BASE = "https://crypto-price-bot.xiageemail.workers.dev";

const fmtUsd = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
const fmtPrice = (n) => {
  const abs = Math.abs(n);
  const d = abs < 1 ? 4 : abs < 10 ? 3 : 2;
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};
const fmtPct = (n) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
const fmtDate = (ms) => {
  const d = new Date(ms);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
};

const SERIES_COLORS = ["--series-1", "--series-2", "--series-3", "--series-4", "--series-5", "--series-6"];
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const STRATEGY_ORDER = ["buyhold", "ma200", "cross", "ensemble", "voltarget", "dca"];
const STRATEGY_LABELS = {
  buyhold: "買入持有", ma200: "MA200濾網", cross: "MA50/200", ensemble: "趨勢綜合", voltarget: "趨勢+波動目標", dca: "DCA",
};

// ── 主題切換 ──
function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  document.getElementById("themeToggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    render(lastData);
  });
}

// ── 通用 SVG 折線圖(含 hover 十字線與 tooltip)──
function drawLineChart(containerEl, series, opts = {}) {
  containerEl.innerHTML = "";
  const allPoints = series.flatMap((s) => s.points);
  if (allPoints.length < 2) {
    containerEl.innerHTML = `<div class="chart-empty">資料還在累積(需要至少 2 天)</div>`;
    return;
  }
  const width = Math.max(containerEl.clientWidth, 280);
  const height = opts.height || 220;
  const padL = 54, padR = 16, padT = 16, padB = 28;
  const innerW = width - padL - padR, innerH = height - padT - padB;

  const xs = allPoints.map((p) => p.x);
  const ys = allPoints.map((p) => p.y);
  let yMin = Math.min(...ys), yMax = Math.max(...ys);
  if (yMin === yMax) { yMin -= 1; yMax += 1; }
  const yPad = (yMax - yMin) * 0.08;
  yMin -= yPad; yMax += yPad;
  const xMin = Math.min(...xs), xMax = Math.max(...xs);

  const xPix = (x) => padL + (xMax === xMin ? 0 : ((x - xMin) / (xMax - xMin)) * innerW);
  const yPix = (y) => padT + innerH - ((y - yMin) / (yMax - yMin)) * innerH;

  const gridColor = cssVar("--line");
  const mutedColor = cssVar("--ink-muted");

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  const gridTicks = 4;
  for (let i = 0; i <= gridTicks; i++) {
    const gy = padT + (innerH / gridTicks) * i;
    const val = yMax - ((yMax - yMin) / gridTicks) * i;
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", padL); line.setAttribute("x2", width - padR);
    line.setAttribute("y1", gy); line.setAttribute("y2", gy);
    line.setAttribute("stroke", gridColor); line.setAttribute("stroke-width", "1");
    svg.appendChild(line);
    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", padL - 8); label.setAttribute("y", gy + 4);
    label.setAttribute("text-anchor", "end"); label.setAttribute("font-size", "10.5");
    label.setAttribute("fill", mutedColor);
    label.textContent = opts.yFmt ? opts.yFmt(val) : val.toFixed(1);
    svg.appendChild(label);
  }

  const firstLabel = document.createElementNS(svgNS, "text");
  firstLabel.setAttribute("x", padL); firstLabel.setAttribute("y", height - 6);
  firstLabel.setAttribute("font-size", "10.5"); firstLabel.setAttribute("fill", mutedColor);
  firstLabel.textContent = opts.xFmt ? opts.xFmt(xMin) : xMin;
  svg.appendChild(firstLabel);
  const lastLabel = document.createElementNS(svgNS, "text");
  lastLabel.setAttribute("x", width - padR); lastLabel.setAttribute("y", height - 6);
  lastLabel.setAttribute("text-anchor", "end");
  lastLabel.setAttribute("font-size", "10.5"); lastLabel.setAttribute("fill", mutedColor);
  lastLabel.textContent = opts.xFmt ? opts.xFmt(xMax) : xMax;
  svg.appendChild(lastLabel);

  series.forEach((s) => {
    if (s.points.length < 2) return;
    const d = s.points.map((p, i) => `${i === 0 ? "M" : "L"}${xPix(p.x).toFixed(1)},${yPix(p.y).toFixed(1)}`).join(" ");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", s.color);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);

    const last = s.points[s.points.length - 1];
    const dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx", xPix(last.x)); dot.setAttribute("cy", yPix(last.y));
    dot.setAttribute("r", "4"); dot.setAttribute("fill", s.color);
    dot.setAttribute("stroke", cssVar("--surface")); dot.setAttribute("stroke-width", "2");
    svg.appendChild(dot);
  });

  const crosshair = document.createElementNS(svgNS, "line");
  crosshair.setAttribute("y1", padT); crosshair.setAttribute("y2", padT + innerH);
  crosshair.setAttribute("stroke", mutedColor); crosshair.setAttribute("stroke-width", "1");
  crosshair.setAttribute("stroke-dasharray", "3,3");
  crosshair.setAttribute("opacity", "0");
  svg.appendChild(crosshair);

  const overlay = document.createElementNS(svgNS, "rect");
  overlay.setAttribute("x", padL); overlay.setAttribute("y", padT);
  overlay.setAttribute("width", innerW); overlay.setAttribute("height", innerH);
  overlay.setAttribute("fill", "transparent");
  svg.appendChild(overlay);

  containerEl.appendChild(svg);
  const tooltip = document.createElement("div");
  tooltip.className = "chart-tooltip";
  containerEl.style.position = "relative";
  containerEl.appendChild(tooltip);

  const sortedXs = [...new Set(allPoints.map((p) => p.x))].sort((a, b) => a - b);
  overlay.addEventListener("mousemove", (e) => {
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * width;
    const relX = xMin + ((mx - padL) / innerW) * (xMax - xMin);
    let nearest = sortedXs[0], best = Infinity;
    for (const x of sortedXs) { const d = Math.abs(x - relX); if (d < best) { best = d; nearest = x; } }
    crosshair.setAttribute("x1", xPix(nearest)); crosshair.setAttribute("x2", xPix(nearest));
    crosshair.setAttribute("opacity", "1");

    let html = `<div class="tt-title">${opts.xFmt ? opts.xFmt(nearest) : nearest}</div>`;
    let anyY = yMin;
    series.forEach((s) => {
      const pt = s.points.find((p) => p.x === nearest);
      if (!pt) return;
      anyY = pt.y;
      html += `<div class="tt-row"><span class="tt-dot" style="background:${s.color}"></span>${s.name}: ${opts.yFmt ? opts.yFmt(pt.y) : pt.y.toFixed(2)}</div>`;
    });
    tooltip.innerHTML = html;
    tooltip.classList.add("visible");
    const tx = xPix(nearest);
    tooltip.style.left = `${(tx / width) * containerEl.clientWidth}px`;
    tooltip.style.top = `${(yPix(anyY) / height) * height}px`;
  });
  overlay.addEventListener("mouseleave", () => {
    crosshair.setAttribute("opacity", "0");
    tooltip.classList.remove("visible");
  });
}

// ── 通用 SVG 橫向長條圖(勝率用)──
function drawBarChart(containerEl, items, opts = {}) {
  containerEl.innerHTML = "";
  if (items.length === 0) {
    containerEl.innerHTML = `<div class="chart-empty">${opts.emptyText || "尚無資料"}</div>`;
    return;
  }
  const width = Math.max(containerEl.clientWidth, 280);
  const rowH = 34;
  const padL = 130, padR = 46, padT = 8, padB = 8;
  const height = items.length * rowH + padT + padB;
  const innerW = width - padL - padR;
  const max = opts.max ?? Math.max(...items.map((i) => i.value), 1);

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width); svg.setAttribute("height", height);

  const mutedColor = cssVar("--ink-muted");
  const inkColor = cssVar("--ink");
  const gridColor = cssVar("--line");

  items.forEach((item, i) => {
    const y = padT + i * rowH;
    const barW = Math.max((item.value / max) * innerW, 2);

    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", padL - 10); label.setAttribute("y", y + rowH / 2 + 4);
    label.setAttribute("text-anchor", "end"); label.setAttribute("font-size", "11.5");
    label.setAttribute("fill", inkColor);
    label.textContent = item.label;
    svg.appendChild(label);

    const track = document.createElementNS(svgNS, "rect");
    track.setAttribute("x", padL); track.setAttribute("y", y + rowH / 2 - 8);
    track.setAttribute("width", innerW); track.setAttribute("height", 16);
    track.setAttribute("rx", 4); track.setAttribute("fill", gridColor);
    svg.appendChild(track);

    const bar = document.createElementNS(svgNS, "rect");
    bar.setAttribute("x", padL); bar.setAttribute("y", y + rowH / 2 - 8);
    bar.setAttribute("width", barW); bar.setAttribute("height", 16);
    bar.setAttribute("rx", 4); bar.setAttribute("fill", item.color);
    bar.style.cursor = "pointer";
    svg.appendChild(bar);

    const valueLabel = document.createElementNS(svgNS, "text");
    valueLabel.setAttribute("x", padL + barW + 8); valueLabel.setAttribute("y", y + rowH / 2 + 4);
    valueLabel.setAttribute("font-size", "11"); valueLabel.setAttribute("fill", mutedColor);
    valueLabel.textContent = opts.valueFmt ? opts.valueFmt(item) : item.value;
    svg.appendChild(valueLabel);

    bar.addEventListener("mouseenter", () => showBarTooltip(containerEl, bar, item, width, height));
    bar.addEventListener("mouseleave", () => { const t = containerEl.querySelector(".chart-tooltip"); if (t) t.classList.remove("visible"); });
  });

  containerEl.appendChild(svg);
  const tooltip = document.createElement("div");
  tooltip.className = "chart-tooltip";
  containerEl.style.position = "relative";
  containerEl.appendChild(tooltip);
}

function showBarTooltip(containerEl, barEl, item, svgW, svgH) {
  const tooltip = containerEl.querySelector(".chart-tooltip");
  if (!tooltip) return;
  tooltip.innerHTML = `<div class="tt-title">${item.label}</div>${item.tooltip || ""}`;
  tooltip.classList.add("visible");
  const bx = parseFloat(barEl.getAttribute("x")) + parseFloat(barEl.getAttribute("width")) / 2;
  const by = parseFloat(barEl.getAttribute("y"));
  tooltip.style.left = `${(bx / svgW) * containerEl.clientWidth}px`;
  tooltip.style.top = `${(by / svgH) * containerEl.clientWidth * (svgH / svgW)}px`;
}

// ── 勝率 95% 信賴區間判定(與 Worker 端 scanWinRateVerdict 邏輯一致)──
function winRateVerdict(st) {
  const n = st.wins + st.losses;
  if (n < 10) return { text: `樣本太少(${n}筆)`, cls: "pill-noise", wr: n ? st.wins / n : null };
  const wr = st.wins / n;
  const se = Math.sqrt((wr * (1 - wr)) / n);
  const lo = Math.max(0, wr - 1.96 * se), hi = Math.min(1, wr + 1.96 * se);
  if (lo > 0.5) return { text: `優勢 ${(wr * 100).toFixed(0)}%`, cls: "pill-edge", wr };
  if (hi < 0.5) return { text: `劣勢 ${(wr * 100).toFixed(0)}%`, cls: "pill-antiedge", wr };
  return { text: `雜訊 ${(wr * 100).toFixed(0)}%`, cls: "pill-noise", wr };
}

// ── 渲染 ──
let lastData = null;

function renderTickers(prices, paper, scan) {
  const priceMap = Object.fromEntries((prices?.prices || []).map((p) => [p.name, p]));
  const tileHtml = (label, valueHtml, deltaHtml) =>
    `<div class="tile-label">${label}</div><div class="tile-value">${valueHtml}</div>${deltaHtml || ""}`;

  const btc = priceMap.BTC;
  const eth = priceMap.ETH;
  document.getElementById("tileBtc").className = "tile";
  document.getElementById("tileBtc").innerHTML = btc
    ? tileHtml("BTC", fmtUsd(btc.price), `<div class="tile-delta ${btc.change24h >= 0 ? "up" : "down"}">${fmtPct(btc.change24h)} (24h)</div>`)
    : tileHtml("BTC", "—");
  document.getElementById("tileEth").className = "tile";
  document.getElementById("tileEth").innerHTML = eth
    ? tileHtml("ETH", fmtUsd(eth.price), `<div class="tile-delta ${eth.change24h >= 0 ? "up" : "down"}">${fmtPct(eth.change24h)} (24h)</div>`)
    : tileHtml("ETH", "—");

  document.getElementById("tileDays").className = "tile";
  document.getElementById("tileDays").innerHTML = tileHtml("模擬盤運行天數", paper?.state?.days ?? "—");

  document.getElementById("tileOpen").className = "tile";
  document.getElementById("tileOpen").innerHTML = tileHtml("掃描器未平倉部位", scan?.open?.length ?? 0);
}

function renderPaperCharts(paper) {
  const history = paper?.history || [];
  ["BTC", "ETH"].forEach((coin) => {
    const series = STRATEGY_ORDER.map((key, i) => ({
      name: STRATEGY_LABELS[key],
      color: cssVar(SERIES_COLORS[i]),
      points: history
        .filter((h) => h.coins?.[coin]?.[key] !== undefined)
        .map((h) => ({ x: new Date(h.date).getTime(), y: h.coins[coin][key] })),
    })).filter((s) => s.points.length > 0);

    drawLineChart(document.getElementById(`chart${coin === "BTC" ? "Btc" : "Eth"}`), series, {
      height: 220,
      yFmt: (v) => fmtUsd(v),
      xFmt: (v) => fmtDate(v),
    });

    const legendEl = document.getElementById(`legend${coin === "BTC" ? "Btc" : "Eth"}`);
    legendEl.innerHTML = series.map((s) =>
      `<span class="legend-item"><span class="legend-swatch" style="background:${s.color}"></span>${s.name}</span>`
    ).join("");
  });
}

function renderPaperTable(paper) {
  const tbody = document.querySelector("#paperTable tbody");
  const coins = paper?.state?.coins || {};
  const rows = [];
  for (const [coin, c] of Object.entries(coins)) {
    const p = c.lastPrice;
    for (const key of STRATEGY_ORDER) {
      let value, ret, posLabel;
      if (key === "dca") {
        value = c.dca.qty * p;
        ret = c.dca.invested ? (value / c.dca.invested - 1) * 100 : null;
        posLabel = c.dca.qty > 0 ? "持有中" : "—";
      } else {
        const s = c[key];
        if (!s) continue;
        value = s.cash + s.qty * p;
        ret = (value / 10000 - 1) * 100;
        const posPct = value > 0 ? Math.round((s.qty * p / value) * 100) : 0;
        posLabel = posPct > 0 ? `${posPct}%` : "空手";
      }
      rows.push(`<tr>
        <td>${coin}</td>
        <td>${STRATEGY_LABELS[key]}</td>
        <td>${fmtUsd(value)}</td>
        <td class="${ret >= 0 ? "tile-delta up" : "tile-delta down"}">${ret === null ? "—" : fmtPct(ret)}</td>
        <td>${posLabel}</td>
      </tr>`);
    }
  }
  tbody.innerHTML = rows.length ? rows.join("") : `<tr class="empty-row"><td colspan="5">尚無資料</td></tr>`;
}

function renderScanCharts(scan) {
  const statEntries = Object.entries(scan?.stats || {});
  const items = statEntries.map(([name, st]) => {
    const v = winRateVerdict(st);
    const color = v.cls === "pill-edge" ? cssVar("--good") : v.cls === "pill-antiedge" ? cssVar("--critical") : cssVar("--ink-muted");
    return {
      label: name,
      value: v.wr === null ? 0 : v.wr * 100,
      color,
      tooltip: `<div class="tt-row">${v.text},共 ${st.wins + st.losses} 筆已結束</div>`,
    };
  });
  drawBarChart(document.getElementById("chartWinRate"), items, {
    max: 100,
    valueFmt: (i) => `${i.value.toFixed(0)}%`,
    emptyText: "尚無已結束的交易",
  });

  const closed = [...(scan?.closedRecent || [])].sort((a, b) => a.closedAtMs - b.closedAtMs);
  let cum = 0;
  const points = closed.map((c) => { cum += c.netR; return { x: c.closedAtMs, y: cum }; });
  const color = cssVar("--series-1");
  drawLineChart(document.getElementById("chartCumR"), points.length ? [{ name: "累積淨R", color, points }] : [], {
    height: 220,
    yFmt: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}R`,
    xFmt: (v) => fmtDate(v),
  });
}

function renderScanTables(scan) {
  const openTbody = document.querySelector("#openTable tbody");
  const openRows = (scan?.open || []).map((p) => {
    const heldH = Math.round((Date.now() - p.openedAtMs) / 3600000);
    return `<tr>
      <td>${p.coin}</td><td>${p.trigger}</td>
      <td><span class="pill ${p.dir === 1 ? "pill-long" : "pill-short"}">${p.dir === 1 ? "多" : "空"}</span></td>
      <td>${fmtPrice(p.entry)}</td><td>${fmtPrice(p.stop)}</td><td>${fmtPrice(p.target)}</td>
      <td>${heldH} 小時</td>
    </tr>`;
  });
  openTbody.innerHTML = openRows.length ? openRows.join("") : `<tr class="empty-row"><td colspan="7">目前沒有未平倉部位</td></tr>`;

  const closedTbody = document.querySelector("#closedTable tbody");
  const outcomeMeta = {
    win: ["✅ 止盈", "pill-win"], loss: ["❌ 止損", "pill-loss"],
    timeout_win: ["⏱ 逾時(賺)", "pill-timeout"], timeout_loss: ["⏱ 逾時(虧)", "pill-timeout"],
  };
  const closedRows = [...(scan?.closedRecent || [])]
    .sort((a, b) => b.closedAtMs - a.closedAtMs)
    .slice(0, 30)
    .map((c) => {
      const [label, cls] = outcomeMeta[c.outcome] || [c.outcome, "pill-noise"];
      return `<tr>
        <td>${c.coin}</td><td>${c.trigger}</td>
        <td><span class="pill ${cls}">${label}</span></td>
        <td>${fmtPrice(c.entry)} → ${fmtPrice(c.exit)}</td>
        <td class="${c.netR >= 0 ? "tile-delta up" : "tile-delta down"}">${c.netR >= 0 ? "+" : ""}${c.netR.toFixed(2)}R</td>
        <td>${fmtDate(c.closedAtMs)}</td>
      </tr>`;
    });
  closedTbody.innerHTML = closedRows.length ? closedRows.join("") : `<tr class="empty-row"><td colspan="6">尚無平倉紀錄</td></tr>`;
}

function render(data) {
  if (!data) return;
  const { prices, paper, scan } = data;
  renderTickers(prices, paper, scan);
  renderPaperCharts(paper);
  renderPaperTable(paper);
  renderScanCharts(scan);
  renderScanTables(scan);
  document.getElementById("updatedAt").textContent = `更新於 ${new Date().toLocaleString("zh-TW")}`;
}

async function fetchJSON(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return res.json();
}

async function loadAll() {
  const btn = document.getElementById("refreshBtn");
  btn.disabled = true;
  btn.textContent = "載入中…";
  try {
    const [prices, paper, scan] = await Promise.all([
      fetchJSON("/api/prices").catch(() => null),
      fetchJSON("/api/paper").catch(() => null),
      fetchJSON("/api/scan").catch(() => null),
    ]);
    lastData = { prices, paper, scan };
    render(lastData);
  } catch (e) {
    document.getElementById("updatedAt").textContent = "載入失敗,請稍後重試";
  } finally {
    btn.disabled = false;
    btn.textContent = "重新整理";
  }
}

initTheme();
loadAll();
document.getElementById("refreshBtn").addEventListener("click", loadAll);
window.addEventListener("resize", () => render(lastData));
