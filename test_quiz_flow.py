import asyncio
from playwright.async_api import async_playwright
import os
import time

async def test_quiz_app():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(viewport={'width': 1280, 'height': 720})
        page = await context.new_page()
        
        try:
            # Navigate to app
            print("1. Navigating to http://localhost:3000...")
            await page.goto('http://localhost:3000')
            await page.wait_for_load_state('networkidle')
            print("✅ Loaded homepage")
            
            # Take screenshot of initial state
            await page.screenshot(path='test_1_homepage.png')
            
            # Wait for PDF upload area to be visible
            print("\n2. Looking for PDF upload area...")
            upload_area = await page.wait_for_selector('.drop-zone, [class*="drop"], [class*="upload"]', timeout=5000)
            print("✅ Found upload area")
            
            # Upload PDF file
            pdf_path = '/Users/luisfelipesena/Development/Personal/quiz-generator/Luis CV.pdf'
            
            # Check if file exists
            if os.path.exists(pdf_path):
                print(f"\n3. Found PDF file at {pdf_path}")
                
                # Find file input and upload
                file_input = await page.query_selector('input[type="file"]')
                if file_input:
                    await file_input.set_input_files(pdf_path)
                    print("✅ PDF uploaded")
                    
                    # Wait for loading transition
                    print("\n4. Waiting for loading transition...")
                    await page.wait_for_timeout(2000)
                    
                    # Check if loading transition appears
                    loading_element = await page.query_selector('text=/Processing your PDF|Analyzing PDF|Generating questions/i')
                    if loading_element:
                        print("✅ Loading transition appeared")
                        await page.screenshot(path='test_2_loading.png')
                    
                    # Wait for questions to load (max 30 seconds)
                    print("\n5. Waiting for questions to be generated...")
                    try:
                        await page.wait_for_selector('h1:has-text("Review Generated Questions"), h2:has-text("Review Generated Questions"), text=/Review.*Questions/i', timeout=30000)
                        print("✅ Questions loaded")
                        await page.screenshot(path='test_3_questions.png')
                        
                        # Test editing a question
                        print("\n6. Testing question editing...")
                        first_textarea = await page.query_selector('textarea')
                        if first_textarea:
                            original_text = await first_textarea.input_value()
                            await first_textarea.fill(original_text + " (edited)")
                            print("✅ Edited first question")
                        
                        # Start quiz
                        print("\n7. Starting quiz...")
                        start_button = await page.query_selector('button:has-text("Start Quiz"), button:has-text("Begin Quiz")')
                        if start_button:
                            await start_button.click()
                            await page.wait_for_timeout(2000)
                            print("✅ Quiz started")
                            await page.screenshot(path='test_4_quiz_started.png')
                            
                            # Answer some questions
                            print("\n8. Answering quiz questions...")
                            for i in range(3):  # Answer first 3 questions
                                # Look for answer options
                                options = await page.query_selector_all('button[class*="option"], div[class*="option"] button, label input[type="radio"]')
                                if options and len(options) > 0:
                                    await options[0].click()
                                    print(f"✅ Answered question {i+1}")
                                    await page.wait_for_timeout(1500)
                                    
                                    # Click next if available
                                    next_button = await page.query_selector('button:has-text("Next")')
                                    if next_button:
                                        await next_button.click()
                                        await page.wait_for_timeout(1000)
                            
                            await page.screenshot(path='test_5_quiz_progress.png')
                            
                        else:
                            print("❌ Could not find start quiz button")
                            
                    except Exception as e:
                        print(f"❌ Questions did not load in time: {e}")
                        await page.screenshot(path='test_3_questions_error.png')
                else:
                    print("❌ Could not find file input")
            else:
                print(f"❌ PDF file not found at {pdf_path}")
                
            # Test mobile responsiveness
            print("\n9. Testing mobile responsiveness...")
            await context.set_viewport_size({"width": 375, "height": 667})
            await page.wait_for_timeout(1000)
            await page.screenshot(path='test_6_mobile_view.png')
            print("✅ Mobile view captured")
            
        except Exception as e:
            print(f"\n❌ Error during test: {e}")
            await page.screenshot(path='test_error.png')
        
        finally:
            # Keep browser open for 10 seconds for manual inspection
            print("\n10. Test complete. Browser will close in 10 seconds...")
            await page.wait_for_timeout(10000)
            await browser.close()

# Run the test
if __name__ == "__main__":
    asyncio.run(test_quiz_app())