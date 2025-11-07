import https from "https";
import fs from "fs";

const API_URL = "https://programming-quotesapi.vercel.app/api/random";
const README_PATH = "./README.md";

function fetchQuote() {
  return new Promise((resolve, reject) => {
    https
      .get(API_URL, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
}

async function updateQuote() {
  try {
    const data = await fetchQuote();
    const quote = data.quote || data.en || "Keep coding, keep learning!";
    const author = data.author || "Unknown";

    const date = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
    const newQuote = `> 💬 **${quote}** — *${author}*\n\n_Last updated: ${date}_`;

    let readme = fs.readFileSync(README_PATH, "utf8");

    if (readme.includes("<!--QUOTE-START-->")) {
      readme = readme.replace(
        /<!--QUOTE-START-->[\s\S]*<!--QUOTE-END-->/,
        `<!--QUOTE-START-->\n${newQuote}\n<!--QUOTE-END-->`
      );
    } else {
      readme += `\n\n<!--QUOTE-START-->\n${newQuote}\n<!--QUOTE-END-->\n`;
    }

    fs.writeFileSync(README_PATH, readme);
    console.log("✅ Quote updated successfully!");
  } catch (err) {
    console.error("❌ Error fetching quote:", err);
    process.exit(1);
  }
}

updateQuote();
