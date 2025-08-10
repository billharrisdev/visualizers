import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Navigate to the bubble sort page.
    page.goto("http://localhost:3000/sort/bubble")

    # First, wait for the page heading to be visible to ensure the page loaded.
    heading = page.get_by_role("heading", name="Bubble Sort")
    expect(heading).to_be_visible(timeout=10000)

    # Find the "Start Bubble Sort" button and click it.
    start_button = page.get_by_role("button", name="Start Bubble Sort")
    expect(start_button).to_be_enabled()
    start_button.click()

    # Expect the button to become disabled after clicking
    expect(start_button).to_be_disabled()

    # Wait for the sorting to start by looking for a red bar.
    red_bar_locator = page.locator("div.bg-red-500")
    expect(red_bar_locator).to_have_count(2, timeout=5000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/bubble_sort_working.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
