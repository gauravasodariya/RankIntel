const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const Crawl = require('../models/Crawl');
const Audit = require('../models/Audit');

// @desc    Start a new website crawl
// @route   POST /api/crawl
// @access  Private
const startCrawl = async (req, res) => {
  try {
    const { baseUrl } = req.body;
    const userId = req.user._id;

    const crawl = await Crawl.create({
      userId,
      baseUrl,
      status: 'in-progress'
    });

    // Start crawl in background
    performCrawl(crawl._id, baseUrl, userId);

    res.json(crawl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to perform the actual crawl
async function performCrawl(crawlId, baseUrl, userId) {
  try {
    const visited = new Set();
    const pages = [];
    const toVisit = [baseUrl];
    const brokenPages = [];
    const duplicateContents = new Map();
    const duplicatePages = [];
    let totalScore = 0;

    const baseDomain = new URL(baseUrl).hostname;

    while (toVisit.length > 0 && visited.size < 50) { // Limit to 50 pages for demo
      const currentUrl = toVisit.pop();
      
      if (visited.has(currentUrl)) continue;
      visited.add(currentUrl);

      try {
        const response = await axios.get(currentUrl, { timeout: 10000 });
        const html = response.data;
        const $ = cheerio.load(html);

        // Check for duplicate content (simple hash)
        const contentHash = Buffer.from(html.slice(0, 5000)).toString('base64');
        if (duplicateContents.has(contentHash)) {
          duplicatePages.push({
            url: currentUrl,
            duplicateOf: duplicateContents.get(contentHash)
          });
        } else {
          duplicateContents.set(contentHash, currentUrl);
        }

        // Quick SEO score for this page
        let pageScore = 0;
        const title = $('title').text();
        if (title.length >= 10 && title.length <= 60) pageScore += 25;
        if ($('meta[name="description"]').attr('content')) pageScore += 25;
        if ($('h1').length === 1) pageScore += 25;
        const imagesWithoutAlt = $('img').filter((i, el) => !$(el).attr('alt')).length;
        pageScore += (100 - imagesWithoutAlt * 5); // Penalize for missing alt
        pageScore = Math.max(0, Math.min(100, pageScore));

        totalScore += pageScore;

        pages.push({
          url: currentUrl,
          score: pageScore,
          status: 'ok'
        });

        // Find internal links
        $('a[href]').each((i, el) => {
          const href = $(el).attr('href');
          try {
            const absoluteUrl = new URL(href, currentUrl).href;
            if (new URL(absoluteUrl).hostname === baseDomain && !visited.has(absoluteUrl) && !toVisit.includes(absoluteUrl)) {
              toVisit.push(absoluteUrl);
            }
          } catch (e) { /* ignore invalid links */ }
        });

        // Update crawl progress
        await Crawl.findByIdAndUpdate(crawlId, {
          totalPages: visited.size,
          pages,
          brokenPages: brokenPages.length,
          duplicatePages: duplicatePages.length,
          averageScore: visited.size > 0 ? Math.round(totalScore / visited.size) : 0
        });

      } catch (error) {
        brokenPages.push({ url: currentUrl, status: error.response?.status || 404 });
        pages.push({
          url: currentUrl,
          score: 0,
          status: 'broken'
        });
        await Crawl.findByIdAndUpdate(crawlId, {
          brokenPages: brokenPages.length,
          pages
        });
      }
    }

    // Mark crawl complete
    await Crawl.findByIdAndUpdate(crawlId, {
      status: 'completed',
      totalPages: visited.size,
      brokenPages: brokenPages.length,
      duplicatePages: duplicatePages.length,
      averageScore: visited.size > 0 ? Math.round(totalScore / visited.size) : 0,
      pages,
      duplicatePageDetails: duplicatePages,
      brokenPageDetails: brokenPages
    });

  } catch (error) {
    console.error('Crawl error:', error);
    await Crawl.findByIdAndUpdate(crawlId, { status: 'failed', error: error.message });
  }
}

// @desc    Get crawl by ID
// @route   GET /api/crawl/:id
// @access  Private
const getCrawlById = async (req, res) => {
  try {
    const crawl = await Crawl.findById(req.params.id);
    if (!crawl) {
      return res.status(404).json({ message: 'Crawl not found' });
    }
    res.json(crawl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { startCrawl, getCrawlById };
