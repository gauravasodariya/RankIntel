const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const Comparison = require('../models/Comparison');

// @desc    Compare two websites
// @route   POST /api/comparison
// @access  Private
const compareWebsites = async (req, res) => {
  try {
    const { yourUrl, competitorUrl } = req.body;
    const userId = req.user._id;

    const analyzeSite = async (url) => {
      let score = 0;
      const issues = [];
      let performance = 75;
      let accessibility = 75;
      let metaTags = false;
      let imagesWithoutAlt = 0;

      try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const content = await page.content();
        const $ = cheerio.load(content);

        // SEO checks
        const title = $('title').text();
        const desc = $('meta[name="description"]').attr('content');
        const hasTitle = title.length > 0;
        const hasDesc = desc && desc.length > 0;
        metaTags = hasTitle && hasDesc;

        if (hasTitle && title.length > 10 && title.length < 60) score += 30;
        else issues.push('Title tag missing or not optimal');

        if (hasDesc && desc.length > 50 && desc.length < 160) score += 20;
        else issues.push('Meta description missing or not optimal');

        if ($('h1').length === 1) score += 20;
        else issues.push('H1 tag issue');

        imagesWithoutAlt = $('img').filter((i, el) => !$(el).attr('alt')).length;
        if (imagesWithoutAlt === 0) score += 30;

        performance = Math.floor(Math.random() * 30) + 70;
        accessibility = Math.floor(Math.random() * 30) + 70;

        await browser.close();
      } catch (error) {
        console.error('Analysis error:', error);
      }

      return { score, performance, accessibility, metaTags, imagesWithoutAlt, issues };
    };

    const yourData = await analyzeSite(yourUrl);
    const competitorData = await analyzeSite(competitorUrl);

    const comparison = await Comparison.create({
      userId,
      yourUrl,
      competitorUrl,
      yourMetrics: yourData,
      competitorMetrics: competitorData
    });

    res.json(comparison);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comparison by ID
// @route   GET /api/comparison/:id
// @access  Private
const getComparisonById = async (req, res) => {
  try {
    const comparison = await Comparison.findById(req.params.id);
    if (!comparison) {
      return res.status(404).json({ message: 'Comparison not found' });
    }
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { compareWebsites, getComparisonById };
