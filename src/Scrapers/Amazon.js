const puppeteer = require('puppeteer');

async function scrapeAmazon(searchQuery, numPages = 1) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navegar para a página da Amazon
    await page.goto('https://www.amazon.com.br/', { waitUntil: 'domcontentloaded' });

    // Localizar o campo de busca, digitar o valor de pesquisa e clicar no botão de pesquisa
    await page.type('#twotabsearchtextbox', searchQuery);
    await page.click('.nav-search-submit .nav-input');

    // Aguardar a página de resultados carregar completamente
    await page.waitForTimeout(2000); // Aguardar 2 segundos

    let results = [];

    for (let currentPage = 1; currentPage <= numPages; currentPage++) {
      // Extrair informações dos resultados da pesquisa na página atual
      const pageResults = await page.evaluate(() => {
        const items = document.querySelectorAll('.s-result-item');

        const data = [];
        items.forEach((item) => {
          const titleElement = item.querySelector('h2 a span');
          const priceElement = item.querySelector('.a-price .a-offscreen');
          const reviewCountElement = item.querySelector('.a-link-normal .a-size-base');
          const linkElement = item.querySelector('h2 a');

          // Verificar se os elementos existem antes de acessar suas propriedades
          const title = titleElement ? titleElement.innerText : 'N/A';
          const price = priceElement ? priceElement.innerText : 'N/A';

          const reviewCount = reviewCountElement ? reviewCountElement.innerText : 'N/A';
          const link = linkElement ? linkElement.href : 'N/A';

          data.push({ title, price, reviewCount, link });
        });

        return data;
      });

      results = results.concat(pageResults);

      // Clicar na página "Próxima" (se houver) para avançar para a próxima página
      const nextPageSelector = '.s-pagination-next';
      const nextPageButton = await page.$(nextPageSelector);
      if (nextPageButton && currentPage < numPages) {
        await nextPageButton.click();
        await page.waitForTimeout(2000); // Aguardar 2 segundos para carregar a próxima página
      }
    }
    return results;
  } catch (err) {
    console.error('Ocorreu um erro:', err);
  } finally {
    // Fechar o navegador
    await browser.close();
  }
}

// Substitua 'smartphone' pelo valor da pesquisa que você deseja
const searchQuery = 'alexa';

// Defina o número de páginas que deseja acessar (exemplo: 3 páginas)
const numPages = 3;

module.exports = scrapeAmazon;