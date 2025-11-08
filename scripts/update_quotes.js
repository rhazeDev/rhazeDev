// ...existing code...
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

async function updateQuotes() {
  try {
    const data = getRandomQuote();
    console.log("Fetched quote:", data);

    const quotesText = data.text || "Keep coding, keep learning!";
    const author = data.author || "Unknown";
    const date = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });

    // Tokyo Night inspired inline styles for README (dark background, soft purple/blue text)
    const newQuotes = `<div style="background:#1a1b26;border-radius:8px;padding:16px;color:#c0caf5;font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
  <p style="margin:0 0 8px 0;font-size:16px;line-height:1.4;">💬 ${escapeHtml(quotesText)}</p>
  <p style="margin:0;font-size:13px;color:#9aa5d6;">— ${escapeHtml(author)} · <span style="opacity:.8">${escapeHtml(date)}</span></p>
</div>`;

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
    console.log("✅ Quotes updated successfully!");
  } catch (err) {
    console.error("❌ Error updating quotes:", err);
    process.exit(1);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

updateQuotes();