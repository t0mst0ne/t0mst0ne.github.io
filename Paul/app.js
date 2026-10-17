(function () {
  var K = 58, LON0 = 20.5, LAT0 = 42.2, CX = 0.8;
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

  /* Natural Earth 1:110m 現代海岸線，只作地理方位參考。 */
  var LAND_POLYGONS = [[[31.754,35.226],[31.617,34.971],[31.353,34.927],[31.489,35.398],[31.1,35.421],[30.5,35.234],[30.5,34.541],[31.219,34.265],[31.219,34.265],[31.219,34.265],[31.549,34.556],[31.606,34.488],[32.073,34.753],[32.827,34.955],[33.081,35.098],[33.091,35.126],[33.089,35.461],[33.264,35.553],[33.277,35.821],[32.868,35.836],[32.716,35.701],[32.709,35.72],[32.709,35.72],[32.394,35.546],[32.533,35.184],[31.867,34.975]],[[33.905,35.482],[34.61,35.98],[34.645,35.998],[34.594,36.448],[34.202,36.612],[33.825,36.066],[33.277,35.821],[33.277,35.821],[33.264,35.553],[33.089,35.461],[33.091,35.126]],[[31.867,34.975],[32.533,35.184],[32.394,35.546],[31.783,35.545],[31.489,35.398],[31.489,35.398],[31.353,34.927],[31.617,34.971],[31.754,35.226]],[[32.161,39.195],[32.01,39.005],[31.508,37.002],[30.509,37.999],[30.5,37.982],[30.5,35.234],[31.1,35.421],[31.489,35.398],[31.783,35.545],[32.394,35.546],[32.394,35.546],[32.709,35.72],[32.313,36.834],[33.379,38.792]],[[32.161,39.195],[32.161,39.195],[33.379,38.792],[33.899,39.9],[32.002,39.9]],[[33.825,36.066],[34.202,36.612],[34.594,36.448],[34.645,35.998],[35.41,35.905],[35.822,36.15],[36.041,36.418],[36.26,36.685],[36.818,36.739],[36.623,37.067],[36.901,38.168],[36.713,38.7],[36.716,39.523],[36.839,39.9],[33.899,39.9],[33.379,38.792],[32.313,36.834],[32.709,35.72],[32.709,35.72],[32.716,35.701],[32.868,35.836],[33.277,35.821]],[[42.2,27.888],[42.007,27.997],[42.141,27.136],[41.827,26.117],[41.329,26.106],[41.234,25.197],[41.584,24.493],[41.309,23.692],[41.338,22.952],[41.999,22.881],[42.2,22.568]],[[35.28,23.515],[35.705,23.7],[35.368,24.247],[35.425,25.025],[35.354,25.769],[35.18,25.745],[35.3,26.29],[35.3,26.29],[35.005,26.165],[34.92,24.725],[35.085,24.735]],[[41.329,26.106],[41.827,26.117],[41.562,26.604],[40.936,26.295],[40.824,26.057],[40.853,25.448],[40.947,24.926],[40.687,23.715],[40.125,24.408],[39.962,23.9],[39.961,23.343],[40.476,22.814],[40.257,22.626],[39.659,22.85],[39.19,23.35],[38.971,22.973],[38.51,23.53],[38.22,24.025],[37.655,24.04],[37.92,23.115],[37.41,23.41],[37.305,22.775],[36.423,23.154],[36.41,22.49],[36.845,21.67],[37.645,21.295],[38.31,21.12],[38.77,20.73],[39.026,20.5],[39.99,20.5],[40.11,20.615],[40.435,20.675],[40.58,21.0],[40.843,21.02],[40.931,21.674],[41.15,22.055],[41.13,22.597],[41.305,22.762],[41.338,22.952],[41.338,22.952],[41.309,23.692],[41.584,24.493],[41.234,25.197]],[[36.713,38.7],[36.901,38.168],[36.623,37.067],[36.818,36.739],[36.26,36.685],[36.041,36.418],[35.822,36.15],[36.275,35.782],[36.651,36.161],[36.565,35.551],[36.796,34.715],[36.22,34.027],[36.108,32.509],[36.644,31.7],[36.678,30.622],[36.263,30.391],[36.144,29.7],[36.677,28.733],[36.659,27.641],[37.653,27.049],[38.208,26.318],[38.986,26.805],[39.464,26.171],[40.42,27.28],[40.46,28.82],[41.22,29.24],[41.088,31.146],[41.736,32.348],[42.019,33.513],[42.04,35.168],[41.335,36.913],[40.949,38.348],[41.103,39.513],[41.063,39.9],[36.839,39.9],[36.716,39.523]],[[41.3,28.988],[41.055,28.806],[41.0,27.619],[40.691,27.192],[40.152,26.358],[40.618,26.043],[40.824,26.057],[40.936,26.295],[41.562,26.604],[41.827,26.117],[41.827,26.117],[42.141,27.136],[42.007,27.997],[41.623,28.116]],[[39.99,20.5],[42.2,20.5],[42.2,20.526],[41.855,20.59],[41.855,20.59],[41.614,20.5],[41.404,20.5],[41.086,20.605],[40.843,21.02],[40.843,21.02],[40.58,21.0],[40.435,20.675],[40.11,20.615]],[[30.509,37.999],[31.508,37.002],[32.01,39.005],[32.161,39.195],[32.002,39.9],[30.5,39.9],[30.5,37.982]],[[35.672,34.576],[35.246,33.901],[35.059,33.974],[35.094,33.866],[35.018,33.675],[35.039,33.526],[35.0,33.476],[35.101,33.456],[35.163,33.384],[35.173,33.191],[35.088,32.92],[35.14,32.732],[35.14,32.732],[35.146,32.802],[35.387,32.947],[35.373,33.667]],[[35.101,33.456],[35.0,33.476],[35.039,33.526],[35.018,33.675],[35.094,33.866],[35.059,33.974],[34.978,34.005],[34.572,32.98],[34.702,32.49],[35.103,32.257],[35.14,32.732],[35.14,32.732],[35.088,32.92],[35.173,33.191],[35.163,33.384]],[[30.662,24.958],[31.089,24.803],[31.569,25.165],[31.586,26.495],[31.321,27.458],[31.026,28.45],[30.87,28.914],[31.187,29.683],[31.473,30.095],[31.556,30.977],[31.43,31.688],[30.934,31.96],[31.26,32.192],[31.024,32.994],[30.967,33.773],[31.219,34.265],[31.219,34.265],[30.5,34.541],[30.5,24.89]],[[32.476,20.5],[32.707,20.855],[32.843,21.543],[32.639,22.896],[32.191,23.237],[32.187,23.609],[32.017,23.927],[31.899,24.921],[31.569,25.165],[31.089,24.803],[30.662,24.958],[30.5,24.89],[30.5,20.5]],[[41.13,22.597],[41.15,22.055],[40.931,21.674],[40.843,21.02],[41.086,20.605],[41.404,20.5],[41.614,20.5],[41.855,20.59],[41.855,20.59],[41.847,20.717],[42.052,20.762],[42.2,21.327],[42.2,22.568],[41.999,22.881],[41.338,22.952],[41.305,22.762]],[[42.2,21.327],[42.052,20.762],[41.847,20.717],[41.855,20.59],[41.855,20.59],[42.2,20.526]]];

  function svgEl(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* ---------- 底圖 ---------- */
  var svg = document.getElementById("map");
  svg.appendChild(svgEl("rect", { "class": "sea", x: 0, y: 0, width: 900, height: 680 }));

  var grid = svgEl("g", { "class": "grid" });
  [32, 34, 36, 38, 40, 42].forEach(function (lat) {
    var y = P([lat, 0])[1];
    grid.appendChild(svgEl("line", { x1: 0, y1: f1(y), x2: 900, y2: f1(y) }));
    var t = svgEl("text", { x: 4, y: f1(y - 3) }); t.textContent = "北緯 " + lat + "°"; grid.appendChild(t);
  });
  [22, 26, 30, 34, 38].forEach(function (lon) {
    var x = P([0, lon])[0];
    grid.appendChild(svgEl("line", { x1: f1(x), y1: 0, x2: f1(x), y2: 680 }));
    var t = svgEl("text", { x: f1(x + 3), y: 11 }); t.textContent = "東經 " + lon + "°"; grid.appendChild(t);
  });
  svg.appendChild(grid);

  LAND_POLYGONS.forEach(function (poly) { svg.appendChild(svgEl("path", { "class": "land", d: pathD(poly) })); });

  var regions = svgEl("g", { "class": "regions" });
  function region(text, ll, extra) {
    var p = P(ll), t = svgEl("text", { x: f1(p[0]), y: f1(p[1]), "text-anchor": "middle", "class": extra || "" });
    t.textContent = text; regions.appendChild(t);
  }
  region("地中海", [33.8, 27.0], "sea-name");
  region("愛琴海", [38.6, 25.1], "sea-name");
  region("希臘", [39.7, 22.6]);
  region("小亞細亞", [40.7, 32.0]);
  region("敘利亞", [35.1, 37.8]);
  svg.appendChild(regions);

  var scale = svgEl("g", { "class": "scale" });
  var sw = 100 / 111 * K;
  scale.appendChild(svgEl("line", { x1: 16, y1: 656, x2: f1(16 + sw), y2: 656 }));
  scale.appendChild(svgEl("line", { x1: 16, y1: 651, x2: 16, y2: 661 }));
  scale.appendChild(svgEl("line", { x1: f1(16 + sw), y1: 651, x2: f1(16 + sw), y2: 661 }));
  var st = svgEl("text", { x: 16, y: 646 }); st.textContent = "100 公里"; scale.appendChild(st);
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
  document.querySelector("#journey summary").textContent = "展開完整路線（" + STEPS.length + " 站）";
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
