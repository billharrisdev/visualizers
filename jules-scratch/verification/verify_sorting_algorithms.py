from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    algorithms = ["insertion", "selection", "merge", "quick", "heap"]
    for i, algorithm in enumerate(algorithms):
        try:
            page.goto(f"http://localhost:3000/sort/{algorithm}")
            heading_text = " ".join(word.capitalize() for word in algorithm.split("-")) + " Sort"
            heading = page.get_by_role("heading", name=heading_text)
            expect(heading).to_be_visible(timeout=5000)
            page.screenshot(path=f"jules-scratch/verification/screenshot_{i}_{algorithm}.png")
            print(f"Successfully verified {algorithm} sort page.")
        except Exception as e:
            print(f"Error verifying {algorithm} sort page: {e}")
            page.screenshot(path=f"jules-scratch/verification/error_{i}_{algorithm}.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
