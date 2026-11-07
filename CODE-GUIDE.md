# SafeKazi: Line-by-Line Code Guide

## 0. Open it in VS Code
1. Unzip `safekazi-site2.zip`. You get the folder `safekazi-site2` and this guide.
2. Open VS Code, then **File > Open Folder** and choose `safekazi-site2`.
3. Install the **Live Server** extension (Extensions icon, search "Live Server").
4. Right-click `index.html` and choose **Open with Live Server**. The site opens on `localhost` and refreshes when you save. This also makes the location and copy buttons work.
5. Read this guide with `Ctrl+Shift+V` (preview). Use `Ctrl+K V` to see it beside your code.
6. Before hosting, delete this guide from the website folder. Only the site files go online.

**Edit rule:** change one thing, save, look at the browser. That is exactly what you will do in the presentation.

---

## 1. HTML: how a page is built (verify.html, in order)

```html
<!DOCTYPE html>
```
Tells the browser the page is HTML5. Always first.

```html
<html lang="en">
```
The root tag that holds everything. `lang="en"` says the page is in English, so screen readers pronounce it properly.

```html
<head> ... </head>
```
Information about the page that visitors do not see on the page.
- `<meta charset="utf-8">`: lets the browser show every character, such as curly quotes and ✕.
- `<meta name="viewport" content="width=device-width, initial-scale=1">`: without it phones show a tiny zoomed-out page. This makes the page fit the phone's width.
- `<meta name="description" content="...">`: the short text Google shows under the page title. Good for SEO.
- `<title>`: the text on the browser tab and the Google result.
- `<link rel="preconnect" ...>`: warms up the connection to Google Fonts so fonts load faster.
- `<link rel="stylesheet" href="https://fonts.googleapis.com/...">`: loads Playfair Display and Space Grotesk. `&amp;` is how you write `&` inside HTML.
- `<link rel="stylesheet" href="style.css">`: loads our CSS file.
- `<script>document.documentElement.className="js"</script>`: adds the class `js` to the `<html>` tag. The CSS uses it so animations only hide things when JavaScript is working.

```html
<body>
```
Everything visitors see.

```html
<a class="skip" href="#main">Skip to content</a>
```
A hidden link. When someone uses the keyboard (Tab), it appears and jumps past the menu to `id="main"`. This is an accessibility feature.

```html
<header>
<a class="logo" href="index.html">Safe<b>Kazi</b></a>
<button id="menu-btn" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
<nav id="menu" aria-label="Main"><ul><li><a href="index.html">Home</a></li> ... </ul></nav>
</header>
```
- `<header>`: the top area of the site. Same on every page, which is "consistent navigation".
- `<b>Kazi</b>` makes "Kazi" bold, and the CSS colours it red.
- `<button id="menu-btn">`: the phone hamburger. `type="button"` stops it acting like a form button. `aria-expanded` tells screen readers if the menu is open. JavaScript changes it.
- `<nav>`: marks the main navigation. `<ul>` is a bullet list, `<li>` is one item, `<a href="verify.html">` is a link to another file.
- `aria-current="page"` is added to the link of the page you are on. The CSS highlights it.

```html
<div id="crumbs"><nav class="crumbs" aria-label="Breadcrumb"><ol>
<li><a href="index.html">0.0 Home</a></li><li aria-current="page">1.0 Verify an agency</li>
</ol></nav></div>
```
The breadcrumb trail from the lecturer's sitemap slide: it answers "where am I and how do I go back?". `<ol>` is a numbered list. The last item is not a link because you are already there.

```html
<main id="main"><div class="sheet" data-page="verify.html"> ... </div></main>
```
- `<main>`: the unique content of this page. Only one per page.
- `.sheet`: the white glass panel that zooms in and out.
- `data-page`: a custom label. JavaScript reads it to know which page this is (for passport stamps).

```html
<p class="no">Page 1.0 · Agency verification</p>
<h1>Verify before you <span>trust.</span></h1>
<p class="lead">...</p>
```
`<p>` is a paragraph, `<h1>` is the main heading (one per page), `<span>` wraps "trust." so CSS can colour it green. `class` names a style to apply.

```html
<form id="verify-form">
<label for="agency-name">Recruitment agency name</label>
<input class="field" id="agency-name" type="text" autocomplete="off">
<button class="btn" type="submit">Show verification steps</button>
<a class="btn ghost" href="https://eemis.mglsd.go.ug/companies" target="_blank" rel="noopener">Open EEMIS register</a>
</form>
```
- `<form>`: groups the inputs. `id` lets JavaScript find it.
- `<label for="agency-name">` is joined to `<input id="agency-name">`. Tapping the label puts the cursor in the box.
- `type="submit"` makes Enter or a tap send the form (JavaScript catches it).
- The link looks like a button because of `class="btn"`. `target="_blank"` opens a new tab, `rel="noopener"` stops that tab controlling ours (security).

```html
<div id="verify-out" class="tile" aria-live="polite">Type the name...</div>
```
The box JavaScript fills with results. `aria-live="polite"` makes screen readers read new text when it appears.

```html
<footer> <nav aria-label="Footer"><ul>...</ul></nav> <div class="passport">...</div> <p>...</p> </footer>
```
Footer links (another common pattern from the slides), the passport stamps and the disclaimer.

```html
<button id="ask-btn" class="ask">Ask SafeKazi</button>
<section id="ask-panel" class="panel" hidden> ... chat ... </section>
```
The floating assistant. `hidden` keeps the panel invisible until JavaScript removes it.

```html
<script src="script.js"></script>
```
At the very end, so the page appears first and the behaviour loads after. The home page also loads `three.js` and `globe.js` before it.

---

## 2. CSS: style.css, rule by rule

**How a rule reads:** `selector { property: value; }`. The selector picks elements. `.name` picks class="name", `#name` picks id="name", `name` picks a tag.

### 2.1 Colours
```css
:root{--paper:#fbfdfb; --tile:#e6f1e9; --tile2:#d6e8db; --green:#0b6b3a; --deep:#064d2b; --neon:#39ff88; --red:#b3122f; --ink:#14201a; --muted:#55645c}
```
`:root` is the whole page. Each `--name` is a saved colour. Elsewhere `var(--red)` uses it. Change a colour once here and everything changes.

### 2.2 Basics
- `*{box-sizing:border-box}`: padding is counted inside the width, so boxes do not overflow.
- `body{...}`: `margin:0` removes the browser's gap. `font-family:"Times New Roman",Times,serif` is the text font, with fallbacks. `font-size:1.1rem` slightly larger text. `line-height:1.6` space between lines. `color` is the text colour. `background-image: radial-gradient(...)` adds two faint glows, green top-left and red right.
- `h1,h2,h3,.logo,.btn{font-family:"Playfair Display",Georgia,serif}`: the heading font.
- `h1{font-size:2.2rem;line-height:1.1;margin:.2em 0}`: heading size. In the `@media(min-width:821px)` block it grows to 3.6rem on bigger screens.
- `h1 span{color:var(--green)}`: the green word in the heading.
- `.lead{font-size:1.2rem;color:var(--muted);max-width:36em}`: intro paragraph. `max-width` keeps lines a comfortable length.
- `.skip{position:absolute;left:-999px}`: hides the skip link off-screen. `.skip:focus{left:10px;...}` brings it back when tabbed to.

### 2.3 Header and menu
- `header{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;...}`: `sticky` keeps it at the top while scrolling. `z-index` puts it above other things. `display:flex` puts logo and menu on one row. `justify-content:space-between` pushes them to opposite ends. `background:rgba(255,255,255,.8)` is white at 80% opacity. `backdrop-filter:blur(12px)` blurs what is behind it (the frosted glass). `border-bottom` is a thin line.
- `#menu ul{display:flex;gap:4px;list-style:none;margin:0;padding:0}`: lays the links in a row, removes bullets.
- `#menu a{...padding:8px 14px;border-radius:99px;transition:.3s}`: each link is a pill. `border-radius:99px` makes it fully round. `transition` animates changes.
- `#menu a:hover,#menu a[aria-current]{...box-shadow:inset ...}`: hover and current page look pressed in. `inset` shadows go inside the shape.
- `#menu-btn{display:none}`: the Menu button is hidden on large screens.
- `@media(max-width:820px){...}`: rules that only apply on phones. There `#menu-btn` shows, `#menu` is hidden until it has the class `open`, and the links stack in a column.

### 2.4 Breadcrumbs
`.crumbs ol{display:flex;flex-wrap:wrap;...}` lays items in a row that wraps. `.crumbs li+li::before{content:"\203A"}` adds the "›" symbol before every item except the first.

### 2.5 The sheet and the page animation
```css
.sheet{background:rgba(255,255,255,.78);border:1px solid #fff;border-radius:36px;padding:24px;
box-shadow:18px 18px 44px rgba(11,107,58,.12),-14px -14px 34px #fff;backdrop-filter:blur(14px);animation:enter .6s cubic-bezier(.22,1,.36,1)}
```
- `border-radius:36px`: big rounded corners like a tile.
- `box-shadow` has two shadows: a soft green one bottom-right and a white one top-left. This is the clay effect.
- `animation:enter .6s cubic-bezier(...)` runs the animation named `enter` for 0.6 seconds. `cubic-bezier` is the speed curve: quick start, soft landing.
```css
@keyframes enter{from{opacity:0;transform:scale(.88);border-radius:64px}}
```
Starts invisible, at 88% size, very round, then ends at normal. That is the zoom in.
```css
.sheet.leave{transition:...;transform:scale(.82);opacity:0;border-radius:64px}
```
When JavaScript adds `leave`, the sheet shrinks to 82%, fades out and becomes rounder: the tile effect.

### 2.6 Tiles
```css
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:24px}
```
`display:grid` makes a grid. `repeat(auto-fit,minmax(230px,1fr))` means: as many columns as fit, each at least 230px and sharing space equally. This makes it responsive without media queries.
```css
.tile{background:linear-gradient(145deg,#f1f9f3,var(--tile2));border-radius:28px;padding:24px;
box-shadow:12px 12px 26px #c3d6c9,-10px -10px 24px #fff,inset 2px 2px 5px rgba(255,255,255,.9)}
```
A diagonal gradient, a dark shadow bottom-right, a white shadow top-left and a white inner edge: soft raised clay. `a.tile:hover{transform:translateY(-8px) scale(1.02)}` lifts it when you hover.
`.no` is the little red number badge. `.num` is the big statistic number in Space Grotesk.

### 2.7 Buttons
```css
.btn{background:var(--neon);color:#04301a;padding:13px 26px;border-radius:99px;
box-shadow:0 8px 20px rgba(57,255,136,.5),inset 0 2px 0 rgba(255,255,255,.7),inset 0 -3px 0 rgba(0,0,0,.12);transition:transform .3s,box-shadow .3s}
```
Neon green with dark green text (readable). The first shadow is a neon glow below. The inset white line on top and dark line at the bottom give a soft 3D look. `.btn:hover{transform:translateY(-3px)}` lifts it and the glow grows. `.ghost` is a white button with a green outline (`box-shadow:0 0 0 2px`). `.red` is the red button.

### 2.8 Forms and lists
- `.field{...border:0;border-radius:18px;background:var(--tile);box-shadow:inset 5px 5px 10px #c9dccf,inset -5px -5px 10px #fff}`: pressed-in boxes (neumorphism). `.field:focus{outline:3px solid var(--neon)}` shows a neon ring when you click in.
- `.checks label{display:flex;gap:12px;...}`: each checkbox row is a pressed-in pill.
- `details{...}` and `summary{cursor:pointer}`: the contract accordion. The browser does the open and close itself, no JavaScript.
- `.chat`: the scrolling message box. `overflow-y:auto` adds a scrollbar when full. `.msg` is a message bubble, `.msg.me` is yours, in neon green.

### 2.9 Ask SafeKazi
- `.ask{position:fixed;right:18px;bottom:18px;z-index:30;...animation:pulse 2.6s ease-in-out infinite}`: `fixed` keeps it on screen while scrolling. `infinite` repeats the glow forever.
- `@keyframes pulse{50%{box-shadow:...}}`: at the half-way point the glow is brighter, then returns.
- `.panel{position:fixed;right:18px;bottom:84px;width:370px;max-width:92%;...}`: the chat window above the button. `.panel[hidden]{display:none}` hides it when it has the `hidden` attribute.

### 2.10 Passport stamps
`#stamps li{border:2px dashed ...}` is an empty stamp slot. `#stamps li.on{border:2px solid var(--red);color:var(--red);transform:rotate(-3deg);animation:thud ...}` is a stamped one: red, slightly tilted, and it "thuds" in using `@keyframes thud{from{transform:scale(2) rotate(-14deg);opacity:0}}` (starts big and faint, lands small and solid).

### 2.11 Reveal and motion safety
```css
.js .reveal{opacity:0;transform:translateY(34px);transition:opacity .9s ...,transform .9s ...}
.js .reveal.in{opacity:1;transform:none}
```
`.js .reveal` means "a `.reveal` inside something with class `js`". Elements start invisible and 34px lower. JavaScript adds `in` and the transition slides them into place.
```css
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
```
If the visitor's device asks for less motion, all animation is switched off. `!important` wins over other rules.

---

## 3. JavaScript: script.js, line by line

**Basics:** `var x = ...` saves a value. `function name(){...}` is a reusable block. `document.getElementById("a")` finds the element with id="a". `addEventListener("click", fn)` runs `fn` when something happens. `if (...) {...}` runs code only when true. `.forEach(fn)` runs `fn` on every item in a list.

```js
function $(id) { return document.getElementById(id); }
```
A shortcut. `$("menu")` means `document.getElementById("menu")`.

### A. Page change
```js
function go(url) {
  var sheet = document.querySelector(".sheet");
  sheet.classList.add("leave");
  setTimeout(function () { window.location.href = url; }, 380);
}
```
- `querySelector(".sheet")` finds the first element with class sheet.
- `classList.add("leave")` adds the class, so the CSS shrinks it.
- `setTimeout(fn, 380)` waits 380 milliseconds (the shrink time), then `window.location.href = url` opens the new page.
```js
document.addEventListener("click", function (e) { ... });
```
One listener for the whole page. `e.target` is what was clicked. `closest("#menu-btn")` asks "is this, or something inside it, the menu button?"
- Menu button: `classList.toggle("open")` adds the class if missing and removes it if there. The result is saved in `open` and used to update `aria-expanded`.
- Ask button or `.ask-open` tile: `e.preventDefault()` stops the link jumping, then `toggleAsk()` opens the chat.
- Any other link: if the address starts with `#`, `http`, `mailto` or `tel`, do nothing (`return`). Otherwise `e.preventDefault()` stops the normal jump and `go(h)` runs our animation first.

### B. init
```js
function init() { reveal(); counters(); verify(); flags(); report(); help(); assistant(); stamps(); if (window.initGlobe && $("globe")) { initGlobe(); } }
document.addEventListener("DOMContentLoaded", init);
```
`DOMContentLoaded` fires when the page structure is ready. `init` then starts every feature. Each function begins with `if (!form) return;`, so on a page without that form it quietly stops.

### C. reveal
```js
var io = new IntersectionObserver(function (list) {
  list.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
```
An IntersectionObserver reports when elements enter the screen. `threshold: 0.12` means "when 12% is visible". `isIntersecting` is true when it is on screen. We add the class `in` (CSS animates it) and stop watching (`unobserve`) so it only happens once.

### D. counters
```js
var n = e.target, to = +n.dataset.count, dec = +(n.dataset.dec || 0);
```
`dataset.count` reads `data-count="351042"`. The `+` turns text into a number. `|| 0` means "or zero if missing".
```js
function step(t) { t0 = t0 || t; var k = Math.min((t - t0) / 1600, 1), v = to * (1 - Math.pow(1 - k, 3));
  n.textContent = pre + v.toLocaleString("en", {...}) + suf; if (k < 1) requestAnimationFrame(step); }
```
- `t` is the time in milliseconds. `k` is progress from 0 to 1 over 1600 ms (`Math.min` stops at 1).
- `1 - (1 - k)^3` is an ease-out curve: fast then slowing.
- `toLocaleString("en")` adds commas (351,042). `minimumFractionDigits` sets decimals.
- `requestAnimationFrame(step)` calls `step` again before the next screen refresh until `k` reaches 1.

### E. verify
`f.addEventListener("submit", function (e) { e.preventDefault(); ...` stops the form reloading the page. `.trim()` removes spaces. If the name is empty we show a message and `return`. Otherwise `steps` is a list of 4 sentences (the name is joined in with `+`). We build a numbered list: `document.createElement("ol")` makes a new `<ol>`, each step becomes an `<li>` with `li.textContent = s` (plain text, so a typed `<script>` cannot run), then `appendChild` attaches it to the page.

### F. flags
`f.querySelectorAll("input:checked").length` counts ticked boxes. `if / else if / else` picks one of three messages: 0, 1 to 2, or 3 and above. `out.className = "note" + (n >= 3 ? " warn" : "")` adds red text only when n is 3 or more. `f.reset()` clears all ticks.

### G. report
Joins the fields into one text with `\n` (new line). `f.agency.value` reads the box named `agency`. `|| "not given"` is the fallback. `hidden = false` shows the Copy button. `navigator.clipboard.writeText(...)` copies the text.

### H. help
`.replace(/\D/g, "")` removes everything that is not a digit. If fewer than 9 digits, we ask again. `openWa(loc)` builds `https://wa.me/NUMBER?text=...`; `encodeURIComponent` makes the text safe for a link. If "Include my location" is ticked, `navigator.geolocation.getCurrentPosition(success, failure)` asks the browser (the person must allow it). Success gives `p.coords.latitude` and `longitude`, which become a Google Maps link. Failure still opens WhatsApp without a location.

### I. assistant
```js
var ANSWERS = [ [["agency","licen"], "Check the agency on..."], ... ];
```
A list of pairs: keywords, then the reply. `reply(q)`: lower-cases the question, then `ANSWERS.forEach` and `.some(...)` checks whether any keyword is inside (`indexOf(k) > -1`). The first match wins; otherwise the default "I am a simple scripted helper..." stays. `add(text, me)` creates a message `<div>` and scrolls down (`scrollTop = scrollHeight`). Voice: `SpeechRecognition` listens and `onresult` puts the spoken words in the box. `speechSynthesis.speak(new SpeechSynthesisUtterance(ans))` reads the answer aloud. `form.dataset.ready` stops the setup running twice.

### J and K. toggleAsk and stamps
`toggleAsk` flips the panel's `hidden`. `stamps` reads `localStorage` (the browser's small memory) with `JSON.parse`, adds this page's `data-page`, saves it with `JSON.stringify`, then adds the class `on` to each stamp whose page is in the list. `try { } catch { }` stops errors if storage is blocked.

---

## 4. globe.js: line by line

```js
var MASK = "...".split(",");
```
The world map as text. 72 rows (latitude 90 to -90) and 144 columns (longitude -180 to 180), each cell 2.5 degrees. 1 means land. Stored in hexadecimal (0 to f), so one character holds 4 cells. `.split(",")` turns the text into a list of rows.

**a) Stage.** `new THREE.Scene()` is the empty world. `new THREE.PerspectiveCamera(40, 1, 0.1, 100)` is the eye: 40 degree view, square shape, sees things from 0.1 to 100 units away. `cam.position.z = 6.2` places it back from the centre. `new THREE.WebGLRenderer({antialias:true, alpha:true})` draws using the graphics chip: smooth edges, transparent background. `ren.setSize(S, S)` sets the canvas size; `box.appendChild(ren.domElement)` puts it on the page. `AmbientLight` lights everything evenly, `DirectionalLight` acts like the sun.

**b) Ball.** `SphereGeometry(2, 64, 48)` is a ball of radius 2 made of 64 by 48 pieces. `MeshStandardMaterial({color:0xf6faf7, roughness:0.85})` is a matte off-white skin. A bigger sphere with `side: THREE.BackSide` (drawn from the inside) and `opacity: 0.1` makes the soft neon glow.

**c) `ll(lat, lon, k)`.** Converts degrees to radians (`* Math.PI / 180`). Then `x = -s·cos(lat)·cos(lon)`, `y = s·sin(lat)`, `z = s·cos(lat)·sin(lon)`. Sine gives height, cosine shrinks the circles toward the poles. `k` is a multiplier (1.004 means just above the surface).

**d) Land dots.** Two loops go through every row `i` and column `j`. `row[j >> 2]` picks the hex letter holding that cell (`j >> 2` is j divided by 4, rounded down). `parseInt(letter, 16)` makes it a number. `>> (3 - (j & 3))` slides the right bit into place and `& 1` reads it. If it is 1, the cell's latitude `90 - (i + 0.5) * 2.5` and longitude `-180 + (j + 0.5) * 2.5` are saved. `InstancedMesh` draws one tiny sphere many times in a single go (fast). A helper `Object3D` is moved to each point and `setMatrixAt` records its position.

**e) Arcs.** `home = ll(0.3, 32.5, 1.01)` is Uganda. Each Gulf city is `[lat, lon]`. The mid point is the halfway point pushed outward (`.normalize().multiplyScalar(R * 1.4)`) so the line lifts above the globe. `QuadraticBezierCurve3(start, mid, end)` makes the curve; `getPoints(60)` splits it into 60 points; `THREE.Line` draws them in red. Each route gets a small red ball that travels the curve.

**f) Loop.** `requestAnimationFrame(loop)` repeats about 60 times a second. `globe.rotation.y = 0.873 + Math.sin(time * 0.8) + px * 0.5` turns the globe to face Uganda (0.873 radians is 50 degrees), swings it back and forth with sine, and adds a little movement from the pointer (`px`). `globe.rotation.x` tilts it. Each red ball's `t` goes from 0 to 1 and wraps (`% 1`); `getPoint(t)` gives its place on the curve. `ren.render(scene, cam)` paints the frame. If you leave the page (`!document.body.contains(box)`) the loop stops.

---

## 5. Each member's page and what to be ready to explain

| Page | Be ready to explain |
|---|---|
| index.html | Hero grid, tiles, counters (D), globe |
| verify.html | The form and function E |
| flags.html | Checkboxes and function F |
| rights.html | `details` accordion (no JavaScript) |
| report.html | Select boxes and function G |
| help.html | Function H and WhatsApp link |
| about.html | Lists, sources, links |
| All pages | Ask panel (I, J), passport (K) |

## 6. Ten small changes to practise
1. Change `--neon` in `:root`: all buttons change colour.
2. Change `--red`: badges, stamps and the Get help button change.
3. In `.btn`, change `padding:13px 26px` to `18px 34px`: bigger buttons.
4. In `.tile`, change `border-radius:28px` to `6px`: square tiles.
5. In flags.html, add one `<label><input type="checkbox"> New sign.</label>`.
6. In `ANSWERS`, add `[["hours"], "Your contract should state working hours."]`.
7. In `.sheet.leave`, change `scale(.82)` to `scale(.6)`: deeper shrink.
8. In the home `h1`, change the words inside `<span>`.
9. In `data-count` on a statistic, change the number.
10. In `help.html`, change the text inside `<textarea id="wa-text">`.
