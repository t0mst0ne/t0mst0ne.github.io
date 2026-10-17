(function () {
  var K = 75, LON0 = 29.5, LAT0 = 39.2, CX = 0.81;
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function P(ll) { return [(ll[1] - LON0) * K * CX, (LAT0 - ll[0]) * K]; }
  function f1(n) { return n.toFixed(1); }
  function pathD(arr) {
    return "M" + arr.map(function (ll) { var p = P(ll); return f1(p[0]) + " " + f1(p[1]); }).join(" L") + " Z";
  }
  function ptsStr(arr) {
    return arr.map(function (ll) { var p = P(ll); return f1(p[0]) + "," + f1(p[1]); }).join(" ");
  }

  var MAINLAND = [[30.6,29.3],[30.6,38.2],[39.4,38.2],[39.4,29.3],[36.15,29.3],[36.2,29.65],[36.3,30.15],
    [36.6,30.55],[36.88,30.7],[36.77,31.4],[36.55,32.0],[36.07,32.83],[36.38,33.93],[36.75,34.6],[36.75,35.0],
    [36.65,35.4],[36.8,35.8],[36.6,36.17],[36.1,35.92],[35.5,35.78],[34.45,35.8],[33.9,35.5],[33.27,35.2],
    [32.8,35.0],[32.05,34.75],[31.5,34.45],[31.3,34.25],[31.1,33.5],[31.25,32.3],[31.45,31.0],[31.2,29.9],[31.0,29.3]];
  var CYPRUS = [[35.1,32.28],[34.72,32.35],[34.65,32.85],[34.67,33.15],[34.92,33.63],[34.96,34.08],[35.12,33.95],
    [35.3,34.0],[35.42,34.2],[35.67,34.58],[35.68,34.35],[35.55,34.0],[35.35,33.5],[35.34,33.3],[35.3,32.9]];

  function svgEl(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* ---------- 底圖 ---------- */
  var svg = document.getElementById("map");
  svg.appendChild(svgEl("rect", { "class": "sea", x: 0, y: 0, width: 516, height: 630 }));

  var grid = svgEl("g", { "class": "grid" });
  [32, 34, 36, 38].forEach(function (lat) {
    var y = P([lat, 0])[1];
    grid.appendChild(svgEl("line", { x1: 0, y1: f1(y), x2: 516, y2: f1(y) }));
    var t = svgEl("text", { x: 4, y: f1(y - 3) }); t.textContent = "北緯 " + lat + "°"; grid.appendChild(t);
  });
  [30, 32, 34, 36].forEach(function (lon) {
    var x = P([0, lon])[0];
    grid.appendChild(svgEl("line", { x1: f1(x), y1: 0, x2: f1(x), y2: 630 }));
    var t = svgEl("text", { x: f1(x + 3), y: 11 }); t.textContent = "東經 " + lon + "°"; grid.appendChild(t);
  });
  svg.appendChild(grid);

  svg.appendChild(svgEl("path", { "class": "land", d: pathD(MAINLAND) }));
  svg.appendChild(svgEl("path", { "class": "land", d: pathD(CYPRUS) }));

  var regions = svgEl("g", { "class": "regions" });
  function region(text, ll, extra) {
    var p = P(ll), t = svgEl("text", { x: f1(p[0]), y: f1(p[1]), "text-anchor": "middle", "class": extra || "" });
    t.textContent = text; regions.appendChild(t);
  }
  region("地中海", [33.4, 31.7], "sea-name");
  region("小亞細亞", [38.95, 33.7]);
  region("敘利亞", [34.7, 37.1]);
  svg.appendChild(regions);

  var scale = svgEl("g", { "class": "scale" });
  var sw = 100 / 111 * K;
  scale.appendChild(svgEl("line", { x1: 16, y1: 606, x2: f1(16 + sw), y2: 606 }));
  scale.appendChild(svgEl("line", { x1: 16, y1: 601, x2: 16, y2: 611 }));
  scale.appendChild(svgEl("line", { x1: f1(16 + sw), y1: 601, x2: f1(16 + sw), y2: 611 }));
  var st = svgEl("text", { x: 16, y: 596 }); st.textContent = "100 公里"; scale.appendChild(st);
  svg.appendChild(scale);

  /* ---------- 路線 ---------- */
  var segLayer = svgEl("g", {});
  svg.appendChild(segLayer);
  var segEls = [];
  STEPS.forEach(function (s, i) {
    if (!s.path || s.path.length < 2) { segEls[i] = null; return; }
    var cls = "seg" + (s.sea ? " sea" : "") + (s.who === "peter" ? " peter" : "");
    var color = s.who === "peter" ? "var(--peter)" : PHASES[s.phase - 1].color;
    var pl = svgEl("polyline", { "class": cls, points: ptsStr(s.path), style: "stroke:" + color });
    segLayer.appendChild(pl);
    segEls[i] = pl;
  });

  /* ---------- 地點 ---------- */
  var ptEls = {};
  var ptLayer = svgEl("g", {});
  svg.appendChild(ptLayer);
  Object.keys(PLACES).forEach(function (key) {
    var pl = PLACES[key], p = P(pl.ll);
    var g = svgEl("g", { "class": "pt" + (pl.minor ? " minor" : ""), tabindex: 0, role: "button", "aria-label": "前往" + pl.name });
    g.appendChild(svgEl("circle", { cx: f1(p[0]), cy: f1(p[1]), r: pl.minor ? 4 : 6.5 }));
    var t = svgEl("text", { x: f1(p[0] + pl.label[0]), y: f1(p[1] + pl.label[1]), "text-anchor": pl.label[2] });
    t.textContent = pl.name; g.appendChild(t);
    g.addEventListener("click", function () { jumpToPlace(key); });
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jumpToPlace(key); } });
    ptLayer.appendChild(g);
    ptEls[key] = g;
  });

  var trav = svgEl("g", {});
  var halo = svgEl("circle", { "class": "trav-halo", r: 15 });
  var dot = svgEl("circle", { "class": "trav", r: 8 });
  trav.appendChild(halo); trav.appendChild(dot);
  svg.appendChild(trav);

  /* ---------- 介面 ---------- */
  var cur = 0, timer = null, raf = null;
  var card = document.getElementById("card");
  var counter = document.getElementById("counter");
  var currentLabel = document.getElementById("current-label");
  var stopPicker = document.getElementById("stop-picker");
  var prevBtn = document.getElementById("prev"), nextBtn = document.getElementById("next"), playBtn = document.getElementById("play");
  var mapMode = document.getElementById("map-mode");
  var googleBox = document.getElementById("google-map");
  var tileStatus = document.getElementById("map-tile-status");
  var focusMapBtn = document.getElementById("focus-map");
  var storyPane = document.querySelector(".right");
  var mapSetup = document.getElementById("map-setup");
  var mapStatus = document.getElementById("map-status");
  var googleKeyInput = document.getElementById("google-key");
  var googleMapIdInput = document.getElementById("google-map-id");
  var googleLoadBtn = mapSetup.querySelector('button[type="submit"]');
  var retryKeyName = "paul-google-key-once", retryMapIdName = "paul-google-map-id-once";
  var googleMap = null, googleSegments = [], googleMarkers = {}, googleLoading = false, googleLoaded = false, googleAuthFailed = false;
  var googleAttempt = 0, googleTimeout = null, tileTimeout = null, tilesReady = false;

  function setMapStatus(message) {
    mapStatus.textContent = message;
    mapStatus.hidden = !message;
  }
  function setTileStatus(message) {
    tileStatus.textContent = message;
    tileStatus.hidden = !message || mapMode.value !== "google";
  }
  function setGoogleLoading(loading) {
    googleLoading = loading;
    googleLoadBtn.disabled = loading;
    googleLoadBtn.textContent = loading ? "載入中…" : (googleAttempt ? "重新套用 key" : "載入地圖");
    mapSetup.setAttribute("aria-busy", String(loading));
  }
  function googleSourceHint() {
    return location.protocol === "file:"
      ? "目前使用 file:// 開啟。請雙擊資料夾內的「開啟地圖.command」，再從它開啟的 http://127.0.0.1:8765/ 頁面操作。"
      : "若 key 設有「網站」限制，請在 Google Cloud 加入允許來源：" + location.origin + "/*。";
  }
  function failGoogle(message) {
    if (googleTimeout) { clearTimeout(googleTimeout); googleTimeout = null; }
    if (tileTimeout) { clearTimeout(tileTimeout); tileTimeout = null; }
    setTileStatus("");
    setGoogleLoading(false);
    googleLoaded = false;
    googleMap = null;
    tilesReady = false;
    googleBox.hidden = true;
    svg.removeAttribute("hidden");
    focusMapBtn.hidden = true;
    mapSetup.hidden = mapMode.value !== "google";
    setMapStatus(mapMode.value === "google" ? message + " " + googleSourceHint() : "");
  }
  function colorValue(cssVar) {
    return getComputedStyle(document.documentElement).getPropertyValue(cssVar.slice(4, -1)).trim();
  }
  function latLng(ll) { return { lat: ll[0], lng: ll[1] }; }
  function showDiagram() {
    svg.removeAttribute("hidden");
    googleBox.hidden = true;
    focusMapBtn.hidden = true;
    mapSetup.hidden = true;
    setMapStatus("");
    setTileStatus("");
  }
  function updateGoogle(i) {
    if (!googleMap) return;
    googleSegments.forEach(function (line, k) { if (line) line.setVisible(k <= i); });
    var seen = {};
    for (var k = 0; k <= i; k++) seen[STEPS[k].place] = true;
    Object.keys(googleMarkers).forEach(function (key) {
      var now = key === STEPS[i].place;
      var entry = googleMarkers[key];
      entry.pin.background = now ? colorValue(STEPS[i].who === "peter" ? "var(--peter)" : PHASES[STEPS[i].phase - 1].color) : (seen[key] ? "#1b2630" : "#ffffff");
      entry.pin.borderColor = now ? "#ffffff" : (seen[key] ? "#ffffff" : "#55646f");
      entry.pin.scale = now ? 1.25 : .85;
      entry.marker.zIndex = now ? 100 : (seen[key] ? 2 : 1);
    });
  }
  function initGoogleMap() {
    if (mapMode.value !== "google") return;
    svg.setAttribute("hidden", "");
    googleBox.hidden = false;
    focusMapBtn.hidden = false;
    mapSetup.hidden = true;
    setMapStatus("");
    if (!tilesReady) {
      setTileStatus("Google 底圖載入中…");
      if (tileTimeout) clearTimeout(tileTimeout);
      tileTimeout = setTimeout(function () {
        if (!tilesReady && mapMode.value === "google") {
          setTileStatus("站點已載入，但 Google 底圖仍未顯示。請查看瀏覽器 Console 的「Google Maps JavaScript API error」代碼，並確認 key 允許 " + location.origin + "/*；若沒有錯誤代碼，也請檢查網路是否擋住 Google 地圖圖磚。");
        }
      }, 15000);
    }
    if (!googleMap) {
      googleMap = new google.maps.Map(googleBox, {
        center: { lat: 35.3, lng: 33.5 }, zoom: 6,
        mapId: googleMapIdInput.value.trim() || "DEMO_MAP_ID",
        renderingType: google.maps.RenderingType.RASTER,
        mapTypeControl: true, zoomControl: true, streetViewControl: false, fullscreenControl: true,
        gestureHandling: "greedy", clickableIcons: false
      });
      googleMap.addListener("tilesloaded", function () {
        tilesReady = true;
        if (tileTimeout) { clearTimeout(tileTimeout); tileTimeout = null; }
        setTileStatus("");
      });
      var bounds = new google.maps.LatLngBounds();
      Object.keys(PLACES).forEach(function (key) {
        var place = PLACES[key], pos = latLng(place.ll);
        bounds.extend(pos);
        var pin = new google.maps.marker.PinElement({ glyphText: "", scale: .85 });
        var marker = new google.maps.marker.AdvancedMarkerElement({ map: googleMap, position: pos, title: place.name, gmpClickable: true });
        marker.append(pin);
        marker.addEventListener("gmp-click", function () { jumpToPlace(key); });
        googleMarkers[key] = { marker: marker, pin: pin };
      });
      STEPS.forEach(function (s, i) {
        if (!s.path || s.path.length < 2) { googleSegments[i] = null; return; }
        var color = colorValue(s.who === "peter" ? "var(--peter)" : PHASES[s.phase - 1].color);
        var line = new google.maps.Polyline({
          map: googleMap, path: s.path.map(latLng), geodesic: true,
          strokeColor: color, strokeOpacity: s.sea || s.who === "peter" ? 0 : .92,
          strokeWeight: 3.5,
          icons: s.sea || s.who === "peter" ? [{
            icon: { path: s.who === "peter" ? google.maps.SymbolPath.CIRCLE : "M 0,-1 0,1", strokeColor: color, strokeOpacity: .92, strokeWeight: 2, scale: s.who === "peter" ? 2 : 3 },
            offset: "0", repeat: s.who === "peter" ? "12px" : "16px"
          }] : []
        });
        googleSegments[i] = line;
      });
      googleMap.fitBounds(bounds, 28);
    }
    updateGoogle(cur);
  }
  function loadGoogle(key) {
    if (googleLoading) return;
    var attempt = ++googleAttempt;
    setGoogleLoading(true);
    mapSetup.hidden = false;
    setMapStatus("正在連接 Google 地圖，請稍候…");
    window.googleMapLoaded = function () {
      if (attempt !== googleAttempt || !googleLoading || googleAuthFailed) return;
      if (googleTimeout) { clearTimeout(googleTimeout); googleTimeout = null; }
      setGoogleLoading(false);
      if (!window.google || !google.maps) { failGoogle("Google 地圖腳本已回應，但地圖功能未就緒。請重新套用 key。"); return; }
      try { googleLoaded = true; initGoogleMap(); }
      catch (error) { failGoogle("建立地圖時發生錯誤：" + (error && error.message ? error.message : "未知錯誤") + "。請重新套用 key。"); }
    };
    window.gm_authFailure = function () {
      googleAuthFailed = true;
      failGoogle("Google 地圖授權失敗。請檢查 key、Maps JavaScript API 是否啟用，以及帳單設定；修改後按「重新套用 key」。");
    };
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(key) + "&loading=async&callback=googleMapLoaded&libraries=marker&language=zh-TW";
    script.onerror = function () {
      if (attempt === googleAttempt) failGoogle("無法下載 Google 地圖腳本。請檢查網路或瀏覽器的內容封鎖設定，然後重新套用 key。");
    };
    googleTimeout = setTimeout(function () {
      if (attempt === googleAttempt && googleLoading) failGoogle("Google 地圖在 20 秒內沒有回應。請檢查網路或 API 設定，然後重新套用 key。");
    }, 20000);
    document.head.appendChild(script);
  }
  mapMode.addEventListener("change", function () {
    if (mapMode.value === "diagram") { showDiagram(); return; }
    if (location.protocol === "file:") { mapSetup.hidden = true; setMapStatus(googleSourceHint()); return; }
    if (googleMap) { initGoogleMap(); return; }
    if (googleLoaded) { initGoogleMap(); return; }
    if (googleAuthFailed) { mapSetup.hidden = false; setMapStatus("Google 地圖授權失敗。修改 key 後按「重新套用 key」。" + googleSourceHint()); return; }
    if (googleLoading) { mapSetup.hidden = false; setMapStatus("正在連接 Google 地圖，請稍候…"); return; }
    mapSetup.hidden = false;
    setMapStatus("貼上已啟用 Maps JavaScript API 的 key，然後按「載入地圖」。" + googleSourceHint());
  });
  mapSetup.addEventListener("submit", function (e) {
    e.preventDefault();
    if (location.protocol === "file:") { setMapStatus(googleSourceHint()); return; }
    var key = googleKeyInput.value.trim();
    if (!key) { setMapStatus("請先輸入 Google Maps API key。"); return; }
    if (googleAttempt) {
      try { sessionStorage.setItem(retryKeyName, key); sessionStorage.setItem(retryMapIdName, googleMapIdInput.value.trim()); location.reload(); }
      catch (error) { setMapStatus("此瀏覽器無法暫存 key。請重新整理頁面，再貼上 key。"); }
      return;
    }
    loadGoogle(key);
  });
  focusMapBtn.addEventListener("click", function () {
    if (googleMap) googleMap.panTo(latLng(PLACES[STEPS[cur].place].ll));
  });

  // 圖例
  var legend = document.getElementById("legend");
  PHASES.forEach(function (ph) {
    var li = document.createElement("li");
    li.innerHTML = '<i style="--c:' + ph.color + '"></i>' + ph.name;
    legend.appendChild(li);
  });
  legend.insertAdjacentHTML("beforeend", '<li><i class="sea" style="--c:var(--muted)"></i>海路</li><li><i class="peter" style="--c:var(--peter)"></i>彼得的路線</li>');

  // 階段列
  var phasebar = document.getElementById("phasebar");
  PHASES.forEach(function (ph) {
    var b = document.createElement("button");
    b.type = "button"; b.style.setProperty("--c", ph.color); b.dataset.phase = ph.id;
    b.innerHTML = ph.name + "<br><span style=\"font-weight:400\">" + ph.range + "</span>";
    b.addEventListener("click", function () {
      for (var i = 0; i < STEPS.length; i++) if (STEPS[i].phase === ph.id) { stop(); go(i, false); return; }
    });
    phasebar.appendChild(b);
  });

  // 全程列表
  var list = document.getElementById("list");
  PHASES.forEach(function (ph) {
    var wrap = document.createElement("section");
    wrap.style.setProperty("--c", ph.color);
    var h = document.createElement("h3");
    h.innerHTML = "<i></i>" + ph.name + "<span style=\"font-weight:400\">" + ph.range + "</span>";
    wrap.appendChild(h);
    var ul = document.createElement("ul"); ul.className = "stops";
    STEPS.forEach(function (s, i) {
      if (s.phase !== ph.id) return;
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button"; b.className = "stop"; b.dataset.i = i;
      b.innerHTML = PLACES[s.place].name + (s.who === "peter" ? "（彼得）" : "") + " · " + s.title + "<small>" + s.ref + "</small>";
      b.addEventListener("click", function () { stop(); go(i, false); });
      li.appendChild(b); ul.appendChild(li);
    });
    wrap.appendChild(ul); list.appendChild(wrap);
  });
  var stopBtns = list.querySelectorAll(".stop");
  PHASES.forEach(function (ph) {
    var group = document.createElement("optgroup");
    group.label = ph.name;
    STEPS.forEach(function (s, i) {
      if (s.phase !== ph.id) return;
      var option = document.createElement("option");
      option.value = String(i);
      option.textContent = (i + 1) + ". " + PLACES[s.place].name + " · " + s.title;
      group.appendChild(option);
    });
    stopPicker.appendChild(group);
  });
  stopPicker.addEventListener("change", function () { stop(); go(Number(stopPicker.value), false); });

  function setPos(x, y) {
    halo.setAttribute("cx", f1(x)); halo.setAttribute("cy", f1(y));
    dot.setAttribute("cx", f1(x)); dot.setAttribute("cy", f1(y));
  }

  function moveTraveler(i, animate) {
    if (raf) cancelAnimationFrame(raf);
    var s = STEPS[i], end = P(PLACES[s.place].ll), seg = segEls[i];
    var color = s.who === "peter" ? "var(--peter)" : PHASES[s.phase - 1].color;
    dot.style.fill = color; halo.style.fill = color;
    if (animate && seg && !reduce) {
      var L = seg.getTotalLength(), D = Math.min(1800, 700 + L * 3), t0 = null;
      var step = function (ts) {
        if (t0 === null) t0 = ts;
        var u = Math.min(1, (ts - t0) / D);
        var e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        var pt = seg.getPointAtLength(L * e);
        setPos(pt.x, pt.y);
        if (u < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    } else {
      setPos(end[0], end[1]);
    }
  }

  function render(i, animate) {
    var s = STEPS[i], ph = PHASES[s.phase - 1], pl = PLACES[s.place];

    segEls.forEach(function (el, k) { if (el) el.classList.toggle("on", k <= i); });

    var seen = {};
    for (var k = 0; k <= i; k++) seen[STEPS[k].place] = true;
    if (i >= 3) seen.joppa = true;
    if (i >= 19) { seen.phoenicia = true; seen.samaria = true; }
    Object.keys(ptEls).forEach(function (key) {
      ptEls[key].classList.toggle("seen", !!seen[key]);
      ptEls[key].classList.toggle("now", key === s.place);
    });

    moveTraveler(i, animate);
    updateGoogle(i);

    card.style.setProperty("--c", s.who === "peter" ? "var(--peter)" : ph.color);
    card.innerHTML =
      '<div class="meta"><span class="badge" style="--c:' + ph.color + '">' + ph.name + '</span>' +
      '<span class="place">' + pl.name + (s.who === "peter" ? "（彼得）" : "") + '</span><span>' + s.date + '</span><span>' + s.ref + '</span></div>' +
      '<h2>' + s.title + '</h2><p>' + s.text + '</p>' +
      '<div class="kids"><b>手環俱樂部說法</b>' + s.kids + '</div>';

    counter.textContent = (i + 1) + " / " + STEPS.length;
    currentLabel.textContent = "第 " + (i + 1) + " 站｜" + pl.name + " · " + s.title;
    stopPicker.value = String(i);
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === STEPS.length - 1;

    Array.prototype.forEach.call(phasebar.children, function (b) {
      b.setAttribute("aria-current", String(Number(b.dataset.phase) === s.phase));
    });
    Array.prototype.forEach.call(stopBtns, function (b) {
      var n = Number(b.dataset.i);
      b.setAttribute("aria-current", String(n === i));
      b.classList.toggle("future", n > i);
    });
    try { history.replaceState(null, "", "#s" + i); } catch (e) {}
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    playBtn.textContent = "▶ 播放";
  }
  function go(i, animate) {
    if (i < 0 || i > STEPS.length - 1) return;
    var forward = i === cur + 1;
    cur = i;
    render(i, animate !== false && forward);
    storyPane.scrollTop = 0;
  }
  function jumpToPlace(key) {
    stop();
    for (var d = 1; d <= STEPS.length; d++) {
      var j = (cur + d) % STEPS.length;
      if (STEPS[j].place === key) { go(j, false); return; }
    }
  }
  function play() {
    if (timer) { stop(); return; }
    if (cur >= STEPS.length - 1) go(0, false);
    playBtn.textContent = "❚❚ 暫停";
    timer = setInterval(function () {
      if (cur >= STEPS.length - 1) { stop(); return; }
      go(cur + 1, true);
    }, 6000);
  }

  prevBtn.addEventListener("click", function () { stop(); go(cur - 1, false); });
  nextBtn.addEventListener("click", function () { stop(); go(cur + 1, true); });
  playBtn.addEventListener("click", play);
  document.addEventListener("keydown", function (e) {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (googleBox.contains(e.target)) return;
    if (e.key === "ArrowRight") { stop(); go(cur + 1, true); }
    else if (e.key === "ArrowLeft") { stop(); go(cur - 1, false); }
  });

  var start = 0;
  try {
    var m = /^#s(\d+)$/.exec(location.hash);
    if (m && Number(m[1]) < STEPS.length) start = Number(m[1]);
  } catch (e) {}
  cur = start;
  render(start, false);
  try {
    var retryKey = sessionStorage.getItem(retryKeyName);
    if (retryKey) {
      sessionStorage.removeItem(retryKeyName);
      googleMapIdInput.value = sessionStorage.getItem(retryMapIdName) || "";
      sessionStorage.removeItem(retryMapIdName);
      googleKeyInput.value = retryKey;
      mapMode.value = "google";
      loadGoogle(retryKey);
    }
  } catch (e) {}
})();
