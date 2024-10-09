const { Builder, By, until } = require('selenium-webdriver');
const { fillIn } = require('./lib');

describe('Search Patient', () => {
  let driver;
  // driver before all tests
  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://qatest.tiiny.site/');
  }, 30000);
  //close after all tests
  afterAll(async () => {
    await driver.quit();
  });

  describe('TC1: Search valid full name - John Doe', () => { 
    //open site - already DONE
    it('should enter the full name "John Doe" and click search', async () => {
      //insert the info
      await fillIn(driver, 'search-input', 'John Doe');
      const searchButton = await driver.findElement(By.css('[test-id="search-button"]'));
      //click
      await searchButton.click();
    });

    it('should display at least one search result', async () => {
      const resultItems = await driver.findElements(By.css('.result-item'));
      //show that at least one result is found
      expect(resultItems.length).toBeGreaterThan(0);
    });

    it('should display correct ID for the result', async () => {
      //const of patient's card
      const firstResult = await driver.findElement(By.css('.result-item'));
      const resultText = await firstResult.findElement(By.xpath(".//strong[text()='ID:']/parent::*")).getText(); // need put data-test-id
      // trim is used because of css attribute - need to improve the code
      const resultID = resultText.split('ID:')[1].trim();
      expect(resultID).toBe('1');
    });

    it('should display correct name for the first result', async () => {
      //const of patient's card
      const firstResult = await driver.findElement(By.css('.result-item'));
      const resultTextName = await firstResult.findElement(By.xpath(".//strong[text()='Name:']/parent::*")).getText(); // need put data-test-id
      // trim is used because of css attribute - need to improve the code
      const resultName = resultTextName.split('Name:')[1].trim();
      expect(resultName).toBe('John Doe');
    });

    it('should display correct age for the first result', async () => {
      const firstResult = await driver.findElement(By.css('.result-item'));
      const resultTextAge = await firstResult.findElement(By.xpath(".//strong[text()='Age:']/parent::*")).getText(); // need put data-test-id
      // trim is used because of css attribute - need to improve the code
      const resultAge = resultTextAge.split('Age:')[1].trim();
      expect(resultAge).toBe('30');
    });

    it('should display "View Details" and "Contact" buttons', async () => {
      //"View Details" button
      const viewDetailsButton = await driver.findElement(By.xpath("//button[text()='View Details']"));
       //"Contact" button
      const contactButton = await driver.findElement(By.xpath("//button[text()='Contact']"));
      expect(await viewDetailsButton.isDisplayed()).toBe(true);
      expect(await contactButton.isDisplayed()).toBe(true);
    });

    it('should retain the search input value as "John Doe"', async () => {
      const searchBar = await driver.wait(until.elementLocated(By.css('[test-id="search-input"]')), 10000);
      const searchBarValue = await searchBar.getAttribute('value');
      expect(searchBarValue).toBe('John Doe');
    });
  });

  describe('TC2: Search with Patient ID', () => {

    it('should clear the search bar and enter Patient ID "1"', async () => {
      //the fnct has clear the text before (it was John Doe)
      await fillIn(driver, 'search-input', '1');
      const searchButton = await driver.findElement(By.css('[test-id="search-button"]'));
      await searchButton.click();
    });

    it('should display at least one search result', async () => {
      //wait for the patient's card
      await driver.wait(until.elementLocated(By.css('.result-item')), 10000);
      const patientCards = await driver.findElements(By.css('.result-item'));
      //at least one patient card has been found
      expect(patientCards.length).toBeGreaterThan(0);
    });

    it('should display correct ID for the first result', async () => {
      const firstResult = await driver.findElement(By.css('.result-item'));
      //get the text from the card in the ID row
      const resultText = await firstResult.findElement(By.xpath(".//strong[text()='ID:']/parent::*")).getText();
      const resultID = resultText.split('ID:')[1].trim();
      //should be one
      expect(resultID).toBe('1');
    });

    it('should display correct name for the first result', async () => {
      const firstResult = await driver.findElement(By.css('.result-item'));
      const resultTextName = await firstResult.findElement(By.xpath(".//strong[text()='Name:']/parent::*")).getText();
      //get the correct name
      const resultName = resultTextName.split('Name:')[1].trim();
      expect(resultName).toBe('John Doe');
    });

    it('should display correct age for the first result', async () => {
      const firstResult = await driver.findElement(By.css('.result-item'));
      const resultTextAge = await firstResult.findElement(By.xpath(".//strong[text()='Age:']/parent::*")).getText();
      //get the age of the tested patient
      const resultAge = resultTextAge.split('Age:')[1].trim();
      expect(resultAge).toBe('30');
    });

    it('should display "View Details" and "Contact" buttons', async () => {
      const viewDetailsButton = await driver.findElement(By.xpath("//button[text()='View Details']"));
      const contactButton = await driver.findElement(By.xpath("//button[text()='Contact']"));
      expect(await viewDetailsButton.isDisplayed()).toBe(true);
      expect(await contactButton.isDisplayed()).toBe(true);
    });

    it('should retain the search input value as "1"', async () => {
      //value of the search bar
      const searchBar = await driver.findElement(By.css('[test-id="search-input"]'));
      const searchBarValue = await searchBar.getAttribute('value');
      //should be one as was inserted in the beginning of the test
      expect(searchBarValue).toBe('1');
    });
  });
});
