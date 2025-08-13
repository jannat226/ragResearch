// server/utils/scholarSearch.js
const axios = require("axios");

// Function to extract and clean key terms from query for better search
function extractSearchTerms(query) {
  // Remove common words and focus on key terms
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "how",
    "what",
    "when",
    "where",
    "why",
    "which",
    "who",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "can",
    "could",
    "should",
    "would",
    "will",
    "about",
    "latest",
    "recent",
    "new",
    "current",
    "modern",
    "state",
    "art",
    "research",
    "study",
    "paper",
    "papers",
    "work",
    "works",
  ]);

  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  return words.slice(0, 6); // Limit to 6 most important terms
}

// Function to calculate text similarity using Jaccard similarity
function calculateRelevance(paperText, queryTerms) {
  const paperWords = paperText
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);

  const paperSet = new Set(paperWords);
  const querySet = new Set(queryTerms);

  const intersection = new Set([...querySet].filter((x) => paperSet.has(x)));
  const union = new Set([...querySet, ...paperSet]);

  return intersection.size / Math.max(union.size, 1);
}

// Enhanced arXiv search with better query construction
async function searchArxivPapers(query, maxResults = 5) {
  try {
    const searchTerms = extractSearchTerms(query);

    // Build more targeted search queries
    const searchStrategies = [
      // Primary search with all terms
      `all:${searchTerms.join(" AND ")}`,
      // Title and abstract search
      `ti:${searchTerms.slice(0, 3).join(" ")} OR abs:${searchTerms.join(" ")}`,
      // Category-specific searches based on query content
      query.toLowerCase().includes("machine learning") ||
      query.toLowerCase().includes("ai")
        ? `cat:cs.LG OR cat:cs.AI AND (${searchTerms.join(" OR ")})`
        : null,
      query.toLowerCase().includes("computer vision") ||
      query.toLowerCase().includes("image")
        ? `cat:cs.CV AND (${searchTerms.join(" OR ")})`
        : null,
      query.toLowerCase().includes("nlp") ||
      query.toLowerCase().includes("language")
        ? `cat:cs.CL AND (${searchTerms.join(" OR ")})`
        : null,
    ].filter(Boolean);

    let allPapers = [];

    // Try different search strategies
    for (const searchQuery of searchStrategies.slice(0, 2)) {
      // Limit to 2 strategies to avoid rate limiting
      const encodedQuery = encodeURIComponent(searchQuery);
      const url = `http://export.arxiv.org/api/query?search_query=${encodedQuery}&start=0&max_results=${
        maxResults * 2
      }&sortBy=relevance&sortOrder=descending`;

      try {
        const response = await axios.get(url, { timeout: 10000 });
        const xmlData = response.data;

        const entries = xmlData.match(/<entry>(.*?)<\/entry>/gs) || [];

        entries.forEach((entry, index) => {
          if (allPapers.length < maxResults * 3) {
            // Get more papers for filtering
            const titleMatch = entry.match(/<title>(.*?)<\/title>/s);
            const summaryMatch = entry.match(/<summary>(.*?)<\/summary>/s);
            const authorMatches = entry.match(/<name>(.*?)<\/name>/g) || [];
            const linkMatch = entry.match(/<id>(.*?)<\/id>/s);
            const publishedMatch = entry.match(
              /<published>(.*?)<\/published>/s
            );
            const categoryMatch = entry.match(
              /<arxiv:primary_category[^>]*term="([^"]*)"[^>]*\/>/
            );

            const title = titleMatch
              ? titleMatch[1].replace(/\n\s+/g, " ").trim()
              : `Research Paper ${index + 1}`;
            const abstract = summaryMatch
              ? summaryMatch[1].replace(/\n\s+/g, " ").trim()
              : "Abstract not available";
            const authors = authorMatches
              .map((author) => author.replace(/<\/?name>/g, "").trim())
              .slice(0, 5) // Limit authors to prevent long strings
              .join(", ");
            const url = linkMatch ? linkMatch[1].trim() : "";
            const published = publishedMatch
              ? new Date(publishedMatch[1]).getFullYear()
              : new Date().getFullYear();
            const category = categoryMatch ? categoryMatch[1] : "";

            // Calculate relevance score
            const paperText = `${title} ${abstract}`;
            const relevanceScore = calculateRelevance(paperText, searchTerms);

            // Only include papers with reasonable relevance
            if (
              relevanceScore > 0.1 ||
              searchTerms.some(
                (term) =>
                  title.toLowerCase().includes(term) ||
                  abstract.toLowerCase().includes(term)
              )
            ) {
              allPapers.push({
                title,
                authors: authors || "Unknown",
                abstract:
                  abstract.substring(0, 350) +
                  (abstract.length > 350 ? "..." : ""),
                url,
                source: "arXiv",
                year: published,
                doi: url.includes("arxiv.org") ? url.split("/").pop() : null,
                relevanceScore: Math.max(relevanceScore, 0.3), // Ensure minimum relevance
                category: category,
              });
            }
          }
        });
      } catch (searchError) {
        console.error(
          `Error with search strategy "${searchQuery}":`,
          searchError.message
        );
        continue;
      }
    }

    // Sort by relevance and publication year, remove duplicates
    const uniquePapers = allPapers
      .filter(
        (paper, index, array) =>
          array.findIndex((p) => p.title === paper.title) === index
      )
      .sort((a, b) => {
        // Sort by relevance first, then by year
        const relevanceDiff = b.relevanceScore - a.relevanceScore;
        if (Math.abs(relevanceDiff) > 0.1) return relevanceDiff;
        return b.year - a.year;
      })
      .slice(0, maxResults);

    return uniquePapers;
  } catch (error) {
    console.error("Error fetching arXiv papers:", error.message);
    return [];
  }
}

// Enhanced function to get curated recent papers with better relevance matching
// Enhanced function to get curated recent papers with better relevance matching
function getCuratedPapers(query, maxResults = 5) {
  const queryTerms = extractSearchTerms(query);
  const keywords = query.toLowerCase();
  const currentYear = new Date().getFullYear();

  // Enhanced paper database with more diverse and recent papers
  const paperDatabase = [
    // AI/ML/Deep Learning
    {
      title: "GPT-4 Technical Report",
      authors: "OpenAI",
      abstract:
        "We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs. While less capable than humans in many real-world scenarios, GPT-4 exhibits human-level performance on various professional and academic benchmarks, including passing a simulated bar exam with a score around the top 10% of test takers.",
      url: "https://arxiv.org/abs/2303.08774",
      source: "arXiv",
      year: 2023,
      doi: "2303.08774",
      keywords: [
        "gpt",
        "language model",
        "multimodal",
        "artificial intelligence",
        "machine learning",
        "neural network",
      ],
    },
    {
      title: "LLaMA: Open and Efficient Foundation Language Models",
      authors: "Touvron, H., Lavril, T., Izacard, G., et al.",
      abstract:
        "We introduce LLaMA, a collection of foundation language models ranging from 7B to 65B parameters. Our largest model, LLaMA-65B, is competitive with the best existing LLMs such as GPT-3 (175B) and PaLM (540B) despite being significantly smaller. We train our models on trillions of tokens, and demonstrate that it is possible to train state-of-the-art models using publicly available datasets exclusively.",
      url: "https://arxiv.org/abs/2302.13971",
      source: "arXiv",
      year: 2023,
      doi: "2302.13971",
      keywords: [
        "llama",
        "language model",
        "foundation model",
        "efficiency",
        "open source",
        "nlp",
      ],
    },
    {
      title: "Attention Is All You Need",
      authors: "Vaswani, A., Shazeer, N., Parmar, N., et al.",
      abstract:
        "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.",
      url: "https://arxiv.org/abs/1706.03762",
      source: "arXiv",
      year: 2017,
      doi: "1706.03762",
      keywords: [
        "transformer",
        "attention",
        "neural network",
        "sequence modeling",
        "nlp",
        "architecture",
      ],
    },

    // Computer Vision
    {
      title: "CLIP: Connecting Text and Images",
      authors: "Radford, A., Kim, J. W., Hallacy, C., et al.",
      abstract:
        "State-of-the-art computer vision systems are trained to predict a fixed set of predetermined object categories. This restricted form of supervision limits their generality and usability since additional labeled data is needed to specify any other visual concept. Learning directly from raw text about images is a promising alternative which leverages a much broader source of supervision.",
      url: "https://arxiv.org/abs/2103.00020",
      source: "arXiv",
      year: 2021,
      doi: "2103.00020",
      keywords: [
        "clip",
        "computer vision",
        "multimodal",
        "text",
        "image",
        "representation learning",
      ],
    },
    {
      title: "Vision Transformer (ViT) for Image Recognition",
      authors: "Dosovitskiy, A., Beyer, L., Kolesnikov, A., et al.",
      abstract:
        "While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. In vision, attention is either applied in conjunction with convolutional networks, or used to replace certain components of convolutional networks while keeping their overall structure in place.",
      url: "https://arxiv.org/abs/2010.11929",
      source: "arXiv",
      year: 2020,
      doi: "2010.11929",
      keywords: [
        "vision transformer",
        "vit",
        "computer vision",
        "attention",
        "image recognition",
        "transformer",
      ],
    },

    // Natural Language Processing
    {
      title:
        "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
      authors: "Devlin, J., Chang, M. W., Lee, K., Toutanova, K.",
      abstract:
        "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
      url: "https://arxiv.org/abs/1810.04805",
      source: "arXiv",
      year: 2018,
      doi: "1810.04805",
      keywords: [
        "bert",
        "language model",
        "bidirectional",
        "pre-training",
        "nlp",
        "understanding",
      ],
    },

    // Data Science & Analytics
    {
      title: "XGBoost: A Scalable Tree Boosting System",
      authors: "Chen, T., Guestrin, C.",
      abstract:
        "Tree boosting is a highly effective and widely used machine learning method. In this paper, we describe a scalable end-to-end tree boosting system called XGBoost, which is used widely by data scientists to achieve state-of-the-art results on many machine learning challenges.",
      url: "https://arxiv.org/abs/1603.02754",
      source: "arXiv",
      year: 2016,
      doi: "1603.02754",
      keywords: [
        "xgboost",
        "tree boosting",
        "machine learning",
        "data science",
        "scalable",
        "gradient boosting",
      ],
    },

    // Reinforcement Learning
    {
      title:
        "Mastering the Game of Go with Deep Neural Networks and Tree Search",
      authors: "Silver, D., Huang, A., Maddison, C. J., et al.",
      abstract:
        "The game of Go has long been viewed as the most challenging of classic games for artificial intelligence owing to its enormous search space and the difficulty of evaluating board positions and moves. Here we introduce a new approach to computer Go that uses 'value networks' to evaluate board positions and 'policy networks' to select moves.",
      url: "https://www.nature.com/articles/nature16961",
      source: "Nature",
      year: 2016,
      doi: "10.1038/nature16961",
      keywords: [
        "alphago",
        "reinforcement learning",
        "game theory",
        "neural networks",
        "monte carlo",
        "tree search",
      ],
    },

    // Blockchain & Cryptocurrency
    {
      title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
      authors: "Nakamoto, S.",
      abstract:
        "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution. Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent double-spending.",
      url: "https://bitcoin.org/bitcoin.pdf",
      source: "Bitcoin.org",
      year: 2008,
      doi: null,
      keywords: [
        "bitcoin",
        "blockchain",
        "cryptocurrency",
        "peer-to-peer",
        "digital currency",
        "decentralized",
      ],
    },

    // Quantum Computing
    {
      title: "Quantum Supremacy Using a Programmable Superconducting Processor",
      authors: "Arute, F., Arya, K., Babbush, R., et al.",
      abstract:
        "The promise of quantum computers is that certain computational tasks might be executed exponentially faster on a quantum processor than on a classical processor. A fundamental challenge is to build a high-fidelity processor capable of running quantum algorithms in an exponentially large computational space.",
      url: "https://www.nature.com/articles/s41586-019-1666-5",
      source: "Nature",
      year: 2019,
      doi: "10.1038/s41586-019-1666-5",
      keywords: [
        "quantum computing",
        "quantum supremacy",
        "superconducting",
        "processor",
        "algorithm",
      ],
    },
  ];

  // Calculate relevance scores for each paper
  const scoredPapers = paperDatabase.map((paper) => {
    // Calculate keyword overlap
    const paperKeywords = [
      ...paper.keywords,
      ...paper.title.toLowerCase().split(" "),
      ...paper.abstract.toLowerCase().split(" "),
    ];
    const relevanceScore = calculateRelevance(
      paperKeywords.join(" "),
      queryTerms
    );

    // Boost score if keywords directly match
    const keywordBoost = paper.keywords.some((keyword) =>
      queryTerms.some(
        (term) => keyword.includes(term) || term.includes(keyword)
      )
    )
      ? 0.3
      : 0;

    // Boost score for recency (newer papers get slight preference)
    const recencyBoost = Math.max(0, (paper.year - 2015) * 0.02);

    return {
      ...paper,
      relevanceScore: Math.min(
        1.0,
        relevanceScore + keywordBoost + recencyBoost
      ),
    };
  });

  // Filter papers with minimum relevance and sort
  const relevantPapers = scoredPapers
    .filter((paper) => paper.relevanceScore > 0.15) // Higher threshold for better quality
    .sort((a, b) => {
      // Sort by relevance primarily, then by year
      const relevanceDiff = b.relevanceScore - a.relevanceScore;
      if (Math.abs(relevanceDiff) > 0.1) return relevanceDiff;
      return b.year - a.year;
    })
    .slice(0, maxResults);

  return relevantPapers.map((paper) => ({
    title: paper.title,
    authors: paper.authors,
    abstract:
      paper.abstract.substring(0, 350) +
      (paper.abstract.length > 350 ? "..." : ""),
    url: paper.url,
    source: paper.source,
    year: paper.year,
    doi: paper.doi,
    relevanceScore: paper.relevanceScore,
  }));
}

// Enhanced main function that combines arXiv and curated papers with improved ranking
async function searchResearchPapers(query, maxResults = 5) {
  try {
    console.log(`Searching for papers on: "${query}"`);

    // Search both arXiv and curated papers
    const [arxivPapers, curatedPapers] = await Promise.all([
      searchArxivPapers(query, Math.max(3, Math.floor(maxResults * 0.6))),
      Promise.resolve(
        getCuratedPapers(query, Math.max(2, Math.floor(maxResults * 0.4)))
      ),
    ]);

    console.log(
      `Found ${arxivPapers.length} arXiv papers and ${curatedPapers.length} curated papers`
    );

    // Combine papers and remove duplicates based on title similarity
    const allPapers = [...arxivPapers, ...curatedPapers];
    const uniquePapers = [];

    for (const paper of allPapers) {
      const isDuplicate = uniquePapers.some((existing) => {
        const titleWords1 = paper.title
          .toLowerCase()
          .split(" ")
          .filter((w) => w.length > 3);
        const titleWords2 = existing.title
          .toLowerCase()
          .split(" ")
          .filter((w) => w.length > 3);
        const commonWords = titleWords1.filter((w) => titleWords2.includes(w));
        return (
          commonWords.length >
          Math.min(titleWords1.length, titleWords2.length) * 0.7
        );
      });

      if (!isDuplicate) {
        uniquePapers.push(paper);
      }
    }

    // Sort by relevance score (higher is better)
    const sortedPapers = uniquePapers
      .sort((a, b) => {
        // Primary sort by relevance
        const relevanceDiff =
          (b.relevanceScore || 0.5) - (a.relevanceScore || 0.5);
        if (Math.abs(relevanceDiff) > 0.1) return relevanceDiff;

        // Secondary sort by year (newer first)
        return b.year - a.year;
      })
      .slice(0, maxResults);

    // Check if we found relevant papers
    const highQualityPapers = sortedPapers.filter(
      (paper) => (paper.relevanceScore || 0) > 0.2
    );

    if (highQualityPapers.length === 0) {
      console.log("No relevant papers found with sufficient quality");
      return {
        papers: [],
        noPapersFound: true,
        message:
          "Sorry, I wasn't able to find any highly relevant research papers on this specific topic. Try using more specific keywords or different terminology.",
      };
    }

    console.log(`Returning ${highQualityPapers.length} high-quality papers`);

    return {
      papers: highQualityPapers.map((paper) => ({
        ...paper,
        // Ensure relevance score is present and formatted
        relevanceScore: Number((paper.relevanceScore || 0.5).toFixed(3)),
      })),
      noPapersFound: false,
      message: `Found ${highQualityPapers.length} relevant research papers`,
    };
  } catch (error) {
    console.error("Error searching research papers:", error);

    // Fallback to curated papers only
    try {
      const fallbackPapers = getCuratedPapers(query, maxResults);

      if (fallbackPapers.length === 0) {
        return {
          papers: [],
          noPapersFound: true,
          message:
            "Sorry, I wasn't able to find any research papers on this specific topic. The search service may be temporarily unavailable.",
        };
      }

      return {
        papers: fallbackPapers,
        noPapersFound: false,
        message: `Found ${fallbackPapers.length} relevant papers from curated database`,
      };
    } catch (fallbackError) {
      console.error("Fallback search also failed:", fallbackError);
      return {
        papers: [],
        noPapersFound: true,
        message:
          "Sorry, the research paper search service is currently unavailable. Please try again later.",
      };
    }
  }
}

module.exports = {
  searchResearchPapers,
  searchArxivPapers,
  getCuratedPapers,
  extractSearchTerms,
  calculateRelevance,
};
