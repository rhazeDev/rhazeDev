import os
import re
import requests
from colorama import Fore, Style, init

init(autoreset=True)

README_PATH = os.path.join(os.getcwd(), "README.md")
QUOTE_API = "https://programming-quotesapi.vercel.app/api/random"

def fetch_quote():
    print(Fore.CYAN + "🔍 Fetching new coding quote...")
    try:
        response = requests.get(QUOTE_API, timeout=5)
        response.raise_for_status()
        data = response.json()
        quote = data.get("quote", "Keep coding, keep learning!")
        author = data.get("author", "Unknown")
        print(Fore.GREEN + f"✅ Got quote from {author}")
        return quote, author
    except Exception as e:
        print(Fore.RED + f"❌ Failed to fetch quote: {e}")
        return "Error connecting to quote API.", "System"

def update_readme(quote, author):
    print(Fore.MAGENTA + "📝 Updating README.md...")

    with open(README_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    start_tag = "<!--quote-start-->"
    end_tag = "<!--quote-end-->"
    pattern = re.compile(re.escape(start_tag) + r".*?" + re.escape(end_tag), re.DOTALL)

    new_block = f"""{start_tag}
### 💡 Coding Quote
> “{quote}”
> — {author}
{end_tag}"""

    if re.search(pattern, content):
        new_content = re.sub(pattern, new_block, content)
        print(Fore.YELLOW + "♻️ Replaced existing quote section.")
    else:
        new_content = content.strip() + "\n\n" + new_block
        print(Fore.YELLOW + "➕ Added new quote section to README.md.")

    with open(README_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(Fore.GREEN + Style.BRIGHT + "🎉 README updated successfully!")

if __name__ == "__main__":
    print(Fore.BLUE + Style.BRIGHT + "=== 💻 GitHub README Quote Updater ===")
    quote, author = fetch_quote()
    update_readme(quote, author)
