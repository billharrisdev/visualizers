from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        page.goto("http://localhost:3000/visualizers/search/a-star")

        # Wait for the grid to be populated
        grid = page.get_by_test_id("a-star-grid")
        expect(grid.locator("div")).to_have_count(50 * 50, timeout=15000)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/a_star_size_verification.png")

    except Exception as e:
        print(page.content())
        raise e

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
