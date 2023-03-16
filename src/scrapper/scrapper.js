import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import os from "os";
const username = os.userInfo().username;

puppeteer.use(StealthPlugin());

export default async function main(search) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    userDataDir: `C:/Users/${username}/AppData/Local/Google/Chrome/User Data/guest`,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },

    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  await page.goto("https://www.mercadolivre.com.br/");
  await page.waitForSelector("#cb1-edit");
  await page.type("#cb1-edit", search);
  await page.click(
    "body > header > div > div.nav-area.nav-top-area.nav-center-area > form > button > div"
  );

  await page.waitForSelector(".ui-search-layout__item");
  const products = await page.$$(".ui-search-layout__item");

  var productList = [];
  // loop through the products and extract data
  for (let product of products) {
    const title = await product.$eval(
      ".ui-search-item__title",
      (el) => el.textContent
    );
    const price = await product.$eval(
      ".ui-search-price__second-line .price-tag-fraction",
      (el) => el.textContent
    );
    const url = await product.$eval(".ui-search-link", (el) => el.href);

    if (title.toUpperCase().includes(search.toUpperCase())) {
      productList.push({ title, price, url });
    }
  }

  await browser.close();
  return productList;
}
