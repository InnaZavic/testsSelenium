const { test, expect, chromium } = require('@playwright/test');

test.describe('Search Patient', () => {
  let browser, page;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
    await page.goto('https://qatest.tiiny.site/');
  }, 30000);

  test.afterAll(async () => {
    await browser.close();
  });

  test.describe('TC1: Search valid full name', () => { 
    //site is opened
    test('should enter the full name "John Doe" and click search', async () => {
      //put the text in the search bar
      await page.fill('[test-id="search-input"]', 'John Doe');
      //click on the Search button
      await page.click('[test-id="search-button"]');
      //wait to have the results
      await page.waitForSelector('.result-item');
    });

    test('should display at least one search result', async () => {
      //$$ gets all matching elements - instead the findElements
      const resultItems = await page.$$('.result-item');
      //at least one card is found
      expect(resultItems.length).toBeGreaterThan(0);
    });

    test('should display correct ID for the result', async () => {
      // the one element is found
      const firstResult = await page.$('.result-item');
      const resultText = await firstResult.$eval("xpath=.//strong[text()='ID:']/parent::*", el => el.innerText);
      const resultID = resultText.split('ID:')[1].trim();
      expect(resultID).toBe('1');
    });

    test('should display correct name for the first result', async () => {
      // the one element is found
      const firstResult = await page.$('.result-item');
      const resultTextName = await firstResult.$eval("xpath=.//strong[text()='Name:']/parent::*", el => el.innerText); //arrow function retrieves the text content of that element
      const resultName = resultTextName.split('Name:')[1].trim();
      expect(resultName).toBe('John Doe');
    });

    test('should display correct age for the first result', async () => {
      // the one element is found
      const firstResult = await page.$('.result-item');
      const resultTextAge = await firstResult.$eval("xpath=.//strong[text()='Age:']/parent::*", el => el.innerText);
      const resultAge = resultTextAge.split('Age:')[1].trim();
      expect(resultAge).toBe('30');
    });

    test('should display "View Details" and "Contact" buttons', async () => {
      //Deatails button is visible
      const viewDetailsButton = await page.$("xpath=//button[text()='View Details']");
      //Contact button is visible
      const contactButton = await page.$("xpath=//button[text()='Contact']");
      expect(await viewDetailsButton.isVisible()).toBe(true);
      expect(await contactButton.isVisible()).toBe(true);
    });

    test('should retain the search input value as "John Doe"', async () => {
      // select the element
      const searchBarValue = await page.$eval('[test-id="search-input"]', el => el.value);
      expect(searchBarValue).toBe('John Doe');
    });
  });

  test.describe('TC2: Search with Patient ID', () => {
    test('should clear the search bar and enter Patient ID "1"', async () => {
      await page.fill('[test-id="search-input"]', '1');
      await page.click('[test-id="search-button"]');
      await page.waitForSelector('.result-item'); // wait for results to load
    });

    test('should display at least one search result', async () => {
      const patientCards = await page.$$('.result-item');
      expect(patientCards.length).toBeGreaterThan(0);
    });

    test('should display correct ID for the first result', async () => {
      const firstResult = await page.$('.result-item');
      const resultText = await firstResult.$eval("xpath=.//strong[text()='ID:']/parent::*", el => el.innerText);
      const resultID = resultText.split('ID:')[1].trim();
      expect(resultID).toBe('1');
    });

    test('should display correct name for the first result', async () => {
      const firstResult = await page.$('.result-item');
      const resultTextName = await firstResult.$eval("xpath=.//strong[text()='Name:']/parent::*", el => el.innerText);
      const resultName = resultTextName.split('Name:')[1].trim();
      expect(resultName).toBe('John Doe');
    });

    test('should display correct age for the first result', async () => {
      const firstResult = await page.$('.result-item');
      const resultTextAge = await firstResult.$eval("xpath=.//strong[text()='Age:']/parent::*", el => el.innerText);
      const resultAge = resultTextAge.split('Age:')[1].trim();
      expect(resultAge).toBe('30');
    });

    test('should display "View Details" and "Contact" buttons', async () => {
      const viewDetailsButton = await page.$("xpath=//button[text()='View Details']");
      const contactButton = await page.$("xpath=//button[text()='Contact']");
      expect(await viewDetailsButton.isVisible()).toBe(true);
      expect(await contactButton.isVisible()).toBe(true);
    });

    test('should retain the search input value as "1"', async () => {
      const searchBarValue = await page.$eval('[test-id="search-input"]', el => el.value);
      expect(searchBarValue).toBe('1');
    });
  });
});
