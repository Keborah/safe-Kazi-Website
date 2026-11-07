// SAFEKAZI GLOBE.JS - 3D globe with three.js (home page only)
// Idea: a white ball + a green dot for every land cell + red arcs from Uganda to the Gulf
var MASK = "000000000000000000000000000000000000,000000000000000000000000000000000000,000000000000000000000000000000000000,000000002ffbffffe0000000000200000000,00000013bfdfffff000700000000c0000000,00000169900fffff00000000e001f8010000,000003c0b4803fff0000000200fffa008000,8040007c6fe01ffe00fffffffffffff7f800,fffffffffffffffffffe01fa140000000000,0ffffffffffffffffff802c0000000000000,00fffffff51c1f00800f7ffffffffffffffe,03ffffffc0600e00003e7ffffffffffffef8,00e07fffe07e0000003e7fffffffffff8080,00801ffff87e00000214fffffffffffe0380,00000ffffeffc0000d1fffffffffffff0300,000007ffffffc000037fffffffffffff0000,000003fffff4e00003ffffffffffffff0000,000003fffffd000001fff5f7fffffffe0000,000003fffff0000001ebe0effffffffc4000,000003ffffe000000f86f6f3fffffff08000,000001ffffc000000f029fe3fffffe208000,000001ffffc0000000f007ffffffff330000,0000007fff80000007f003ffffffff0c0000,0000005ffe0000000ffeebffffffff800000,0000003fc10000000fffffefffffff800000,0000000f810000003ffffdf3ffffff000000,00000007800000003ffffdfe1ffffe800000,00000003884000007ffffeff0fe7e0000000,00000003d81800007ffffefe07c3d0000000,00000000780000007fffff780781e0800000,000000000e0000007fffffe00301f0400000,00000000002800003fffff90030160000000,00000000037f00001ffffff0000100200000,00000000007f80000fbffff0000082000000,00000000007ff000000fffe0000186000000,0000000000fff000000fffc000008e800000,0000000000fffc00000fff800000ce8c0000,0000000000ffff80000fff0000004083c000,0000000000ffffc00007ff0000002001e000,0000000000ffffc00007ff00000000a08000,00000000007fff800007ff00000000000000,00000000007fff000007ff100000000c0000,ffffffffffffffffffffffff0000007ec000,00000000000fff000007fc300000007fe000,00000000000fff000007fc60000003fff000,00000000000ffc000003fc60000007fff800,00000000000ff8000003f800000007fff800,00000000001ff0000001f800000003fff800,00000000001ff0000001f000000003fff800,00000000001fe0000001c000000003c3f800,00000000001f80000000000000000000f000,00000000001f000000000000000000002002,00000000003c000000000000000000002004,00000000001c000000000000000000000008,000000000038000000000000000000000010,000000000038000000000000100000000000,000000000030800000000000000000000000,000000000018000000000000000000000000,000000000000000000000000000000000000,000000000000000000000000000000000000,000000000000000000000000000000000000,000000000000800000000000000000000000,000000000006000000000006000044040000,0000000000040000000004fff1fffffff800,00000000003e000005ffffffe7fffffffff0,00000121ffbf00007fffffffffffffffffe0,0003fffffff00007ffffffffffffffffff80,013fffffff800e3fffffffffffffffffffe0,003ffffffff800ffffffffffffffffffff00,001ffffffffffffffffffffffffffffffff0,000000000000000000000000000000000000,000000000000000000000000000000000000".split(","); // 72 rows x 144 columns: 1 = land, 0 = sea (2.5 degrees per cell)
function initGlobe() {
  var box = document.getElementById("globe");
  try {
    // a) stage (scene), eye (camera), painter (renderer)
    var W = box.clientWidth, H = box.clientHeight || W, S = Math.min(W, H);
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100); cam.position.z = 6.2;
    var ren = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    ren.setPixelRatio(Math.min(window.devicePixelRatio, 2)); ren.setSize(S, S);
    box.innerHTML = ""; box.appendChild(ren.domElement);
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    var sun = new THREE.DirectionalLight(0xffffff, 0.65); sun.position.set(-3, 2, 4); scene.add(sun);
    // b) the white ball and a soft green glow
    var R = 2, globe = new THREE.Group(); scene.add(globe);
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R, 64, 48), new THREE.MeshStandardMaterial({ color: 0xf6faf7, roughness: 0.85 })));
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.08, 48, 32), new THREE.MeshBasicMaterial({ color: 0x39ff88, transparent: true, opacity: 0.1, side: THREE.BackSide })));
    // c) maths helper: latitude and longitude to a point in 3D
    function ll(lat, lon, k) {
      var a = lat * Math.PI / 180, o = lon * Math.PI / 180, s = R * k;
      return new THREE.Vector3(-s * Math.cos(a) * Math.cos(o), s * Math.sin(a), s * Math.cos(a) * Math.sin(o));
    }
    // d) one small green dot for every land cell
    var land = [];
    MASK.forEach(function (row, i) {
      for (var j = 0; j < 144; j++) {
        if (((parseInt(row[j >> 2], 16) >> (3 - (j & 3))) & 1) === 1) land.push([90 - (i + 0.5) * 2.5, -180 + (j + 0.5) * 2.5]);
      }
    });
    var dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshBasicMaterial({ color: 0x0b6b3a }), land.length);
    var o = new THREE.Object3D();
    land.forEach(function (p, n) { o.position.copy(ll(p[0], p[1], 1.004)); o.updateMatrix(); dots.setMatrixAt(n, o.matrix); });
    globe.add(dots);
    // e) markers and red arcs from Uganda to the Gulf
    function ball(p, c, s) { var m = new THREE.Mesh(new THREE.SphereGeometry(s, 16, 16), new THREE.MeshBasicMaterial({ color: c })); m.position.copy(p); globe.add(m); return m; }
    var home = ll(0.3, 32.5, 1.01), red = 0xb3122f, runners = [];
    ball(home, 0x39ff88, 0.085);
    [[24.7, 46.7], [25.2, 55.3], [25.3, 51.5], [29.4, 48], [23.6, 58.4]].forEach(function (c, k) {
      var p = ll(c[0], c[1], 1.01); ball(p, red, 0.05);
      var mid = home.clone().add(p).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.4);
      var curve = new THREE.QuadraticBezierCurve3(home, mid, p);
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)), new THREE.LineBasicMaterial({ color: red })));
      runners.push({ m: ball(home, red, 0.035), c: curve, t: k * 0.2 });
    });
    // f) animation loop: sway the globe, move the red dots, draw (stops when you leave the page)
    var px = 0, py = 0, time = 0;
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.addEventListener("pointermove", function (e) { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; });
    (function loop() {
      if (!document.body.contains(box)) return;
      time += 0.006;
      globe.rotation.y = 0.873 + (calm ? 0 : Math.sin(time * 0.8)) + px * 0.5;
      globe.rotation.x = 0.35 + py * 0.3;
      runners.forEach(function (r) { r.t = (r.t + 0.004) % 1; r.m.position.copy(r.c.getPoint(r.t)); });
      ren.render(scene, cam); requestAnimationFrame(loop);
    })();
  } catch (e) { box.style.background = "radial-gradient(circle,#dff3e6,transparent 65%)"; }
}
