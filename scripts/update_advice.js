import https from "https";
import fs from "fs";

const API_URL = "https://api.adviceslip.com/advice";
const README_PATH = "./README.md";

function fetchAdvice() {
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

async function updateAdvice() {
  try {
    const data = await fetchAdvice();
    console.log("Fetched advice:", data);
    const advice = data.slip.advice || "Keep coding, keep learning!";

<<<<<<< HEAD:scripts/update_advice.js
    const date = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
    const newAdvice = `> 💬 **${advice}**\n`;
=======
    const newQuote = `> 💬 **${quote}** — *${author}*`;
>>>>>>> 98e5994a6af52e706a01fc30e4272c25234c2106:scripts/update_quote.js

    let readme = fs.readFileSync(README_PATH, "utf8");

    if (readme.includes("<!--ADVICE-START-->")) {
      readme = readme.replace(
        /<!--ADVICE-START-->[\s\S]*<!--ADVICE-END-->/,
        `<!--ADVICE-START-->\n${newAdvice}\n<!--ADVICE-END-->`
      );
    } else {
      readme += `\n\n<!--ADVICE-START-->\n${newAdvice}\n<!--ADVICE-END-->\n`;
    }

    fs.writeFileSync(README_PATH, readme);
    console.log("✅ Advice updated successfully!");
  } catch (err) {
    console.error("❌ Error fetching advice:", err);
    process.exit(1);
  }
}

updateAdvice();
