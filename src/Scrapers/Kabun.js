const puppeteer = require('puppeteer');

async function scrapeKabum(searchQuery, numPages = 1) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navegar para a página da Kabum
    await page.goto('https://www.kabum.com.br/', { waitUntil: 'domcontentloaded' });

    // Localizar o campo de busca, digitar o valor de pesquisa e pressionar Enter
    await page.type('#input-busca', searchQuery);
    await page.keyboard.press('Enter');

    // Aguardar a página de resultados carregar completamente
    await page.waitForSelector('.listagem-box');

    let results = [];

    for (let currentPage = 1; currentPage <= numPages; currentPage++) {
      // Extrair informações dos resultados da pesquisa na página atual
      const pageResults = await page.evaluate(() => {
        const items = document.querySelectorAll('.sc-72859b2d-12 .fVyyon');

        const data = [];
        items.forEach((item) => {
          const titleElement = item.querySelector('.H-titulo');
          const priceElement = item.querySelector('.H-preco');
          const descriptionElement = item.querySelector('.sc-fzoLsD');
          const linkElement = item.querySelector('a.H-titulo');

          // Verificar se os elementos existem antes de acessar suas propriedades
          const title = titleElement ? titleElement.innerText : 'N/A';
          const price = priceElement ? priceElement.innerText : 'N/A';
          const description = descriptionElement ? descriptionElement.innerText : 'N/A';
          const link = linkElement ? linkElement.href : 'N/A';

          data.push({ title, price, description, link });
        });

        return data;
      });

      results = results.concat(pageResults);

      // Clicar na página "Próxima" (se houver) para avançar para a próxima página
      const nextPageSelector = '.sc-fzoKki';
      const nextPageButton = await page.$(nextPageSelector);
      if (nextPageButton && currentPage < numPages) {
        await nextPageButton.click();
        await page.waitForTimeout(2000); // Aguardar 2 segundos para carregar a próxima página
      }
    }
    
    console.log(results);
    return results;
  } catch (err) {
    console.error('Ocorreu um erro:', err);
  } finally {
    // Fechar o navegador
    await browser.close();
  }
}

// Substitua 'iphone' pelo valor da pesquisa que você deseja
const searchQuery = 'iphone';

// Defina o número de páginas que deseja acessar (exemplo: 3 páginas)
const numPages = 3;

module.exports = scrapeKabum;
