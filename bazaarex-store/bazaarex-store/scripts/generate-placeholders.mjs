/**
 * Generates PLACEHOLDER artwork (simple garment illustrations on studio-style
 * backdrops) so the site looks complete before you have real photography.
 *
 * These are NOT photographs. Replace them with your shop's real photos:
 *   - public/images/products/   (one front shot + one detail shot per product)
 *   - public/images/categories/, hero/, collections/, about/
 * then update the paths in /data. You can delete this script afterwards.
 *
 * Run with: npm run images
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

const palette = {
  oat: ["#EBE2D0", "#CDBFA5"],
  bone: ["#F4F0E8", "#D6CFC0"],
  stone: ["#D3CAB9", "#A89E8C"],
  taupe: ["#B2A38E", "#85775F"],
  mocha: ["#7D6D5C", "#54483B"],
  charcoal: ["#4A4842", "#24231F"],
  sage: ["#A7AC95", "#7C826B"],
  slate: ["#7F868A", "#575D61"],
};

const backdrops = { ivory: "#F0EBE0", sand: "#E4DBCB", cream: "#F6F3EC" };

/** Each garment is drawn in an 800 x 1000 box, centred on (400, 500). */
function garment(type, colorKey, uid) {
  const [light, dark] = palette[colorKey];
  const seam = `stroke="${dark}" stroke-opacity=".55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  const defs = `
<linearGradient id="${uid}-g" x1="0" y1="0" x2="1" y2="0.3">
  <stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/>
</linearGradient>
<pattern id="${uid}-weave" width="6" height="6" patternUnits="userSpaceOnUse">
  <path d="M0 3H6" stroke="${dark}" stroke-opacity=".14" stroke-width="1"/>
</pattern>
<pattern id="${uid}-rib" width="9" height="9" patternUnits="userSpaceOnUse">
  <path d="M4.5 0V9" stroke="${dark}" stroke-opacity=".45" stroke-width="3"/>
</pattern>`;

  const base = (d) =>
    `<path d="${d}" fill="url(#${uid}-g)"/><path d="${d}" fill="url(#${uid}-weave)"/><path d="${d}" ${seam.replace(' stroke-width="2"', ' stroke-width="2.5"')}/>`;
  const folds = (list) =>
    list
      .map((d) => `<path d="${d}" stroke="${dark}" stroke-opacity=".12" stroke-width="22" fill="none" stroke-linecap="round"/>`)
      .join("");

  let body = "";

  if (type === "tee") {
    body =
      base("M330 190 Q400 238 470 190 L600 230 L700 360 L630 395 L586 335 L586 800 L214 800 L214 335 L170 395 L100 360 L200 230 Z") +
      folds(["M250 380 Q280 590 262 780", "M520 420 Q545 600 530 770"]) +
      `<path d="M330 190 Q400 238 470 190" fill="none" stroke="${dark}" stroke-opacity=".75" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="M214 782 H586" ${seam}/><path d="M214 335 L200 230 M586 335 L600 230" ${seam}/>`;
  } else if (type === "shirt") {
    body =
      base("M325 175 L400 208 L475 175 L600 225 L692 565 L626 580 L590 385 L590 815 L210 815 L210 385 L174 580 L108 565 L200 225 Z") +
      folds(["M255 420 Q285 620 268 790", "M525 440 Q548 620 535 790"]) +
      `<path d="M325 175 L400 208 L355 282 L298 215 Z" fill="${light}" stroke="${dark}" stroke-opacity=".6" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M475 175 L400 208 L445 282 L502 215 Z" fill="${light}" stroke="${dark}" stroke-opacity=".6" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M400 208 V815" ${seam}/>` +
      [310, 390, 470, 550, 630, 710]
        .map((y) => `<circle cx="400" cy="${y}" r="6" fill="${light}" stroke="${dark}" stroke-opacity=".7" stroke-width="2"/>`)
        .join("") +
      `<path d="M470 350 h72 v82 l-36 16 l-36 -16 Z" ${seam}/>`;
  } else if (type === "trousers") {
    body =
      base("M270 160 L530 160 L568 305 L598 880 L446 880 L400 425 L354 880 L202 880 L232 305 Z") +
      folds(["M300 330 Q320 600 286 860", "M500 330 Q480 600 514 860"]) +
      `<path d="M270 160 L530 160 L534 200 L266 200 Z" fill="${dark}" fill-opacity=".4" stroke="${dark}" stroke-opacity=".6" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M400 200 V425" ${seam}/><circle cx="400" cy="180" r="7" fill="${light}" stroke="${dark}" stroke-opacity=".7" stroke-width="2"/>` +
      `<path d="M266 230 Q310 260 322 330" ${seam}/><path d="M534 230 Q490 260 478 330" ${seam}/>` +
      `<path d="M300 440 L274 870 M500 440 L526 870" stroke="${dark}" stroke-opacity=".3" stroke-width="2" fill="none"/>`;
  } else if (type === "jacket") {
    body =
      base("M312 168 L400 196 L488 168 L612 220 L714 610 L644 630 L604 385 L608 805 L192 805 L196 385 L156 630 L86 610 L188 220 Z") +
      folds(["M240 420 Q268 620 252 790", "M545 430 Q566 620 552 790"]) +
      `<path d="M312 168 L400 196 L488 168 L494 222 L400 252 L306 222 Z" fill="${dark}" fill-opacity=".35" stroke="${dark}" stroke-opacity=".6" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M400 252 V805" ${seam}/>` +
      `<rect x="236" y="560" width="120" height="86" rx="4" ${seam}/><rect x="444" y="560" width="120" height="86" rx="4" ${seam}/>` +
      `<path d="M236 586 H356 M444 586 H564" ${seam}/>` +
      `<rect x="192" y="772" width="416" height="33" fill="${dark}" fill-opacity=".3"/>` +
      [330, 430, 530, 640, 740]
        .map((y) => `<circle cx="400" cy="${y}" r="6" fill="${light}" stroke="${dark}" stroke-opacity=".7" stroke-width="2"/>`)
        .join("");
  } else if (type === "knit") {
    body =
      base("M335 185 Q400 245 465 185 L592 226 L702 650 L622 665 L594 405 L600 800 L200 800 L206 405 L178 665 L98 650 L208 226 Z") +
      `<path d="M335 185 Q400 245 465 185 L592 226 L702 650 L622 665 L594 405 L600 800 L200 800 L206 405 L178 665 L98 650 L208 226 Z" fill="url(#${uid}-rib)" opacity=".5"/>` +
      folds(["M250 420 Q278 620 262 780", "M535 430 Q556 620 542 780"]) +
      `<path d="M335 185 Q400 245 465 185" fill="none" stroke="${dark}" stroke-opacity=".8" stroke-width="18" stroke-linecap="round"/>` +
      `<rect x="200" y="762" width="400" height="38" fill="${dark}" fill-opacity=".28"/>` +
      `<path d="M98 650 L178 665 M702 650 L622 665" stroke="${dark}" stroke-opacity=".8" stroke-width="16" stroke-linecap="round"/>`;
  }
  return { defs, body };
}

const shadowFilter = `<filter id="shadow" x="-25%" y="-15%" width="150%" height="145%">
  <feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#24231F" flood-opacity=".2"/>
</filter>`;

function svg(w, h, bg, defs, content, backdrop = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>
${shadowFilter}
<radialGradient id="light" cx="50%" cy="38%" r="75%">
  <stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/>
  <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
</radialGradient>
${defs}
</defs>
<rect width="${w}" height="${h}" fill="${bg}"/>
${backdrop}
<rect width="${w}" height="${h}" fill="url(#light)"/>
${content}
</svg>`;
}

/** items: [{ type, color, x, y, scale }] placed by garment centre. */
function scene({ w, h, bg, items, backdrop = "" }) {
  let defs = "";
  let content = "";
  items.forEach((item, i) => {
    const g = garment(item.type, item.color, `g${i}`);
    defs += g.defs;
    content += `<g filter="url(#shadow)" transform="translate(${item.x} ${item.y}) scale(${item.scale}) translate(-400 -500)">${g.body}</g>`;
  });
  return svg(w, h, bg, defs, content, backdrop);
}

/** Close-up detail shot: zooms in on the upper part of a garment. */
function detail({ type, color, bg, focus }) {
  const g = garment(type, color, "d0");
  const content = `<g transform="translate(400 520) scale(2.15) translate(${-focus[0]} ${-focus[1]})">${g.body}</g>`;
  return svg(800, 1000, bg, g.defs, content);
}

function write(rel, data) {
  const file = join(out, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
}

/* ---------- Products ---------- */
const focusFor = { tee: [400, 270], shirt: [400, 330], trousers: [400, 290], jacket: [400, 330], knit: [400, 320] };

const productArt = [
  ["linen-camp-collar-shirt", "shirt", "oat", "ivory"],
  ["poplin-everyday-shirt", "shirt", "bone", "sand"],
  ["washed-oxford-shirt", "shirt", "sage", "cream"],
  ["heavyweight-crew-tee", "tee", "charcoal", "sand"],
  ["organic-cotton-tee", "tee", "bone", "ivory"],
  ["pocket-tee", "tee", "taupe", "cream"],
  ["pleated-wide-trousers", "trousers", "charcoal", "ivory"],
  ["straight-cotton-chino", "trousers", "stone", "cream"],
  ["drawcord-linen-trousers", "trousers", "oat", "sand"],
  ["unlined-overshirt-jacket", "jacket", "mocha", "ivory"],
  ["coach-jacket", "jacket", "slate", "sand"],
  ["light-field-jacket", "jacket", "sage", "cream"],
  ["merino-crew-knit", "knit", "taupe", "ivory"],
  ["ribbed-cotton-knit", "knit", "bone", "sand"],
  ["textured-crew-knit", "knit", "charcoal", "cream"],
  ["waffle-cotton-knit", "knit", "oat", "ivory"],
];

for (const [slug, type, color, bd] of productArt) {
  const bg = backdrops[bd];
  write(
    `products/${slug}-front.svg`,
    scene({ w: 800, h: 1000, bg, items: [{ type, color, x: 400, y: 510, scale: 0.98 }] }),
  );
  write(`products/${slug}-detail.svg`, detail({ type, color, bg, focus: focusFor[type] }));
}

/* ---------- Categories ---------- */
const categoryArt = {
  shirts: [["shirt", "oat"], ["shirt", "sage"]],
  "t-shirts": [["tee", "charcoal"], ["tee", "bone"]],
  trousers: [["trousers", "stone"], ["trousers", "charcoal"]],
  jackets: [["jacket", "mocha"], ["jacket", "slate"]],
  knitwear: [["knit", "taupe"], ["knit", "bone"]],
};
for (const [slug, [a, b]] of Object.entries(categoryArt)) {
  write(
    `categories/${slug}.svg`,
    scene({
      w: 800,
      h: 1000,
      bg: backdrops.sand,
      items: [
        { type: b[0], color: b[1], x: 520, y: 470, scale: 0.6 },
        { type: a[0], color: a[1], x: 300, y: 540, scale: 0.7 },
      ],
    }),
  );
}

/* ---------- Hero collage ---------- */
const arch = (w, h, fill) =>
  `<path d="M${w * 0.14} ${h} V${h * 0.42} A${w * 0.36} ${w * 0.36} 0 0 1 ${w * 0.86} ${h * 0.42} V${h} Z" fill="${fill}"/>`;

write(
  "hero/hero-main.svg",
  scene({
    w: 1200,
    h: 1500,
    bg: backdrops.sand,
    backdrop: arch(1200, 1500, "#EFE9DC"),
    items: [{ type: "jacket", color: "mocha", x: 600, y: 790, scale: 1.3 }],
  }),
);
write(
  "hero/hero-side-1.svg",
  scene({
    w: 1000,
    h: 850,
    bg: backdrops.ivory,
    items: [{ type: "knit", color: "taupe", x: 500, y: 450, scale: 0.78 }],
  }),
);
write(
  "hero/hero-side-2.svg",
  scene({
    w: 1000,
    h: 850,
    bg: "#D9D0C2",
    items: [{ type: "shirt", color: "bone", x: 500, y: 450, scale: 0.78 }],
  }),
);
write("hero/hero-inset.svg", detail({ type: "shirt", color: "sage", bg: backdrops.cream, focus: [400, 330] }));

/* ---------- Collections (3:2) ---------- */
write(
  "collections/layering-edit.svg",
  scene({
    w: 1200,
    h: 800,
    bg: backdrops.sand,
    items: [
      { type: "knit", color: "taupe", x: 250, y: 440, scale: 0.66 },
      { type: "jacket", color: "mocha", x: 600, y: 410, scale: 0.78 },
      { type: "shirt", color: "sage", x: 950, y: 440, scale: 0.66 },
    ],
  }),
);
write(
  "collections/linen-edit.svg",
  scene({
    w: 1200,
    h: 800,
    bg: backdrops.ivory,
    items: [
      { type: "shirt", color: "oat", x: 250, y: 440, scale: 0.66 },
      { type: "trousers", color: "oat", x: 600, y: 420, scale: 0.74 },
      { type: "tee", color: "bone", x: 950, y: 440, scale: 0.66 },
    ],
  }),
);
write(
  "collections/everyday-essentials.svg",
  scene({
    w: 1200,
    h: 800,
    bg: backdrops.cream,
    items: [
      { type: "tee", color: "charcoal", x: 250, y: 440, scale: 0.66 },
      { type: "trousers", color: "stone", x: 600, y: 420, scale: 0.74 },
      { type: "knit", color: "bone", x: 950, y: 440, scale: 0.66 },
    ],
  }),
);

/* ---------- About ---------- */
write(
  "about/story.svg",
  scene({
    w: 1000,
    h: 1250,
    bg: backdrops.sand,
    backdrop: arch(1000, 1250, "#EFE9DC"),
    items: [
      { type: "knit", color: "charcoal", x: 380, y: 640, scale: 0.95 },
      { type: "trousers", color: "stone", x: 690, y: 700, scale: 0.7 },
    ],
  }),
);

console.log("Placeholder images written to public/images");
