const express = require('express');
const scrapeAmazon = require("../Scrapers/Amazon");
const scrapeKabum = require("../Scrapers/Kabun");

const router = express.Router();

router.get('/api/scrape/amazon', async (req, res) => {
  const { searchQuery, numPages } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Informe o produto para a pesquisa.' });
  }

  try {
    const results = await scrapeAmazon(searchQuery, numPages || 1);
    res.json(results);
  } catch (err) {
    console.error('Ocorreu um erro ao fazer web scraping da Amazon:', err);
    res.status(500).json({ error: 'Ocorreu um erro ao fazer web scraping.' });
  }
});

router.get('/api/scrape/kabun', async (req, res) => {
  const { searchQuery, numPages } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Informe o produto para a pesquisa.' });
  }

  try {
    const results = await scrapeKabum(searchQuery, numPages || 1);
    res.json(results);
  } catch (err) {
    console.error('Ocorreu um erro ao fazer web scraping na kabun :', err);
    res.status(500).json({ error: 'Ocorreu um erro ao fazer web scraping.' });
  }
});

module.exports = router;
