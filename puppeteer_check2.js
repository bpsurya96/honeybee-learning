const http = require('http');
const path = require('path');
const fs = require('fs');
const port = 8080;
const root = process.cwd();
const server = http.createServer((req, res) => {
  let url = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(root, url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      return res.end('Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = {
      '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.json':'application/json', '.svg':'image/svg+xml'
    }[ext] || 'text/plain';
    res.setHeader('Content-Type', mime);
    res.end(data);
  });
});
server.listen(port);
(async () => {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const results = [];
  try {
    const configs = [
      {name:'desktop', viewport:{width:1280,height:800}, userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'},
      {name:'mobile', viewport:{width:393,height:851}, userAgent:'Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36', mobile:true}
    ];
    for (const cfg of configs) {
      const page = await browser.newPage();
      await page.setViewport(cfg.viewport);
      await page.setUserAgent(cfg.userAgent);
      await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'networkidle2', timeout: 60000 });
      const heroVisible = await page.$eval('h1.hcs-headline', el => !!(el && el.innerText.trim()));
      const ctaText = await page.$eval('a.hcs-btn-primary', el => el.innerText.trim());
      const navLinks = await page.$$eval('nav a', els => els.map(el => el.innerText.trim()));
      const footerVisible = await page.$eval('footer', el => !!el);
      const learningItems = await page.$$eval('#learningGrid > *', els => els.length);
      const giftsItems = await page.$$eval('#giftsGrid > *', els => els.length);
      const waFabVisible = await page.$eval('.wa-fab', el => window.getComputedStyle(el).display !== 'none');
      let hamburgerWorks = null;
      if (cfg.mobile) {
        const hamburger = await page.$('button.hamburger');
        if (hamburger) {
          await page.$eval('#hamburger', el => el.click());
          await new Promise(resolve => setTimeout(resolve, 500));
          const open = await page.$eval('#navLinks', el => el.classList.contains('open'));
          hamburgerWorks = open;
        }
      }
      results.push({
        name: cfg.name,
        heroVisible,
        ctaText,
        navLinks,
        footerVisible,
        learningItems,
        giftsItems,
        waFabVisible,
        hamburgerWorks,
        width: cfg.viewport.width,
        height: cfg.viewport.height
      });
      await page.close();
    }
  } catch (err) {
    console.error(err.stack || err);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
  console.log(JSON.stringify(results, null, 2));
})();
