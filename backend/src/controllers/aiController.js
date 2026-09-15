const { generateRecommendations } = require("../services/geminiService");

const getRecommendations = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Product search query is required",
      });
    }

    const recommendationText = await generateRecommendations(query);

    const recommendations = JSON.parse(recommendationText);

    return res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
};