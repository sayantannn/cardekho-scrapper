const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');


(async () => {
  try {
    const browser = await puppeteer.launch({headless: true,});
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    await page.goto('https://www.cardekho.com/');

    
    await page.screenshot({ path: 'screenshot.png' });
    console.log('Screenshot saved.');

    await page.waitForSelector('#rf01 > div.app-content > div.gsc_container.homepage > div:nth-child(6) > section > div.BottomLinkViewAll > a');

 
  await page.$eval('#rf01 > div.app-content > div.gsc_container.homepage > div:nth-child(6) > section > div.BottomLinkViewAll > a', (element) => {
    element.click();
  });

 
  const afterClickUrl = page.url();
  console.log('After click:', afterClickUrl);

    async function scrapeCardekho() {
      try {
        const url = afterClickUrl;
        const response = await fetch(url);
        const html = await response.text();
    
        const $ = cheerio.load(html);
        const allText = [];
    
        $('p').each((index, element) => {
          const text = $(element).text().trim();
          allText.push(text);
        });
    
       
        const bodyText = $('body').text().trim();
        allText.push(bodyText);
    
        
        const data = {
          text: allText,
        };
    
        
        const jsonData = JSON.stringify(data, null, 2);
        console.log(typeof jsonData)
    
        //.....................................
        const regex = /(http[^"']+\.(?:jpg))/g;
      const matches = jsonData.match(regex);
    
       matches ? matches : [];
       console.log(matches)
       //.................................
       async function downloadImages(imageUrls) {
        for (const url of imageUrls) {
          const response = await fetch(url);
          const buffer = await response.buffer();
          const fileName = url.substring(url.lastIndexOf('/') + 1);
          fs.writeFileSync(fileName, buffer);
          console.log(`Downloaded ${fileName}`);
        }
      }
      
      downloadImages(matches);
    
        
        fs.writeFileSync('scraped_data.json', jsonData);
    
        console.log('Data saved to scraped_data.json');
      } catch (error) {
        console.error('Error:', error);
      }
      
    
    }
    
    scrapeCardekho();
    

       await page.screenshot({ path: 'screenshot1.png' });
       console.log('Screenshot saved.');
       await page.waitForTimeout(3000);
    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
})();

