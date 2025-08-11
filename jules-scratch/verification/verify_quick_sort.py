from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        page.goto("http://localhost:3000/visualizers/sort/quick")

        # Wait for the visualizer to be rendered
        visualizer = page.locator(".h-96")
        expect(visualizer).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/quick_sort_verification.png")

    except Exception as e:
        print(page.content())
        raise e

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
