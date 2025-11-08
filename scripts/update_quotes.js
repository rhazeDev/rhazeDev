import fs from "fs";
import path from "path";

const QUOTES_PATH = path.join(process.cwd(), "scripts", "quotes.json");
const README_PATH = path.join(process.cwd(), "README.md");

const getRandomQuote = () => {
  const quotesData = fs.readFileSync(QUOTES_PATH, "utf8");
  const quotes = JSON.parse(quotesData);
  if (!Array.isArray(quotes) || quotes.length === 0) {
    return { text: "Keep coding, keep learning!", author: "Unknown" };
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapText(text, maxChars = 48) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const w of words) {
    if ((line + " " + w).trim().length <= maxChars) {
      line = (line ? line + " " : "") + w;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function generateSvgImage(quote, author, date) {
  const lines = wrapText(quote, 48);
  const padding = 28;
  const quoteFontSize = 20;
  const metaFontSize = 15;
  const lineHeight = 26;
  const authorHeight = 30;

  const maxLineLength = Math.max(
    ...lines.map((l) => l.length),
    (`— ${author} · ${date}`).length
  );
  const approxCharWidth = Math.round(quoteFontSize * 0.5);
  const maxAllowedWidth = 760;
  const contentWidth = Math.min(
    Math.max(padding * 2 + Math.ceil(maxLineLength * approxCharWidth), 240),
    maxAllowedWidth
  );

  const textBlockHeight = lines.length * lineHeight;
  const width = contentWidth;
  const height = padding * 2 + textBlockHeight + authorHeight;

  const tspans = lines
    .map((ln, i) => `<tspan x="${padding}" dy="${i === 0 ? '0' : '1.2em'}">${escapeXml(ln)}</tspan>`)
    .join("");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    .bg { fill: #1a1b26; }
    .quote { fill: #c0caf5; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; font-size:${quoteFontSize}px; }
    .meta { fill: #9aa5d6; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; font-size:${metaFontSize}px; }
  </style>
  <rect x="0" y="0" width="${width}" height="${height}" rx="12" ry="12" class="bg"/>
  <text class="quote" x="${padding}" y="${padding + Math.floor(quoteFontSize * 0.95)}" xml:space="preserve">
    ${tspans}
  </text>
  <text class="meta" x="${padding}" y="${padding + textBlockHeight + 20}">
    — ${escapeXml(author)} · <tspan opacity="0.8">${escapeXml(date)}</tspan>
  </text>
</svg>`;

  return svg;
}

async function updateQuotes() {
  try {
    const data = getRandomQuote();
    console.log("Fetched quote:", data);

    const quotesText = data.text || "Keep coding, keep learning!";
    const author = data.author || "Unknown";
    const date = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });

    const svg = generateSvgImage(quotesText, author, date);

    const SVG_PATH = path.join(process.cwd(), "scripts", "quote.svg");
    fs.writeFileSync(SVG_PATH, svg, "utf8");

    const newQuotes = `<img alt="Quote of the day" src="./scripts/quote.svg" />`;

    let readme = fs.readFileSync(README_PATH, "utf8");

    if (readme.includes("<!--QUOTES-START-->")) {
      readme = readme.replace(
        /<!--QUOTES-START-->[\s\S]*<!--QUOTES-END-->/,
        `<!--QUOTES-START-->\n${newQuotes}\n<!--QUOTES-END-->`
      );
    } else {
      readme += `\n\n<!--QUOTES-START-->\n${newQuotes}\n<!--QUOTES-END-->\n`;
    }

    fs.writeFileSync(README_PATH, readme, "utf8");
    console.log("✅ Quotes updated successfully! (wrote scripts/quote.svg)");
  } catch (err) {
    console.error("❌ Error updating quotes:", err);
    process.exit(1);
  }
}

updateQuotes();