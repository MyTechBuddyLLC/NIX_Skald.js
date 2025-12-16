
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Listen for console events and print them to the terminal
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        await page.goto('http://localhost:8000/blog-widget.html')
        # Wait for the first blog post to be rendered
        await page.wait_for_selector('.blog-post')
        # Take a screenshot of the container
        container = await page.query_selector('#blog-widget-container')
        await container.screenshot(path='/home/jules/verification/series_menu.png')
        await browser.close()

asyncio.run(main())
