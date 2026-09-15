const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateRecommendations = async (productName) => {
 const prompt = `
You are a strict e-commerce complementary product recommender.

USER SEARCH QUERY:
"${productName}"

Your task is to recommend products that are directly and logically related
to the user's search query.

STRICT RULES:

1. Every recommendation MUST be related to "${productName}".
2. NEVER recommend products from an unrelated category.
3. NEVER switch to another product category.
4. NEVER use examples from this instruction as recommendations.
5. Do not recommend the exact searched product.
6. Recommendations should be products that a customer could reasonably buy
   together with the searched product.
7. For a specific product/model, keep the product/model name when appropriate.
8. Return 6 to 8 short product search terms.
9. These terms will be placed directly into an e-commerce search bar.
10. Return ONLY a valid JSON array of strings.
11. Do not return markdown.
12. Do not return explanations.

Examples of the RULE, not recommendations:

Search: "iPhone 16"
Valid types:
- iPhone 16 Case
- iPhone 16 Screen Protector
- iPhone 16 Charger
- iPhone 16 Camera Protector

Search: "Cricket Bat"
Valid types:
- Cricket Bat Grip
- Cricket Bat Cover
- Cricket Bat Toe Guard
- Batting Gloves
- Cricket Ball

Search: "Laptop"
Valid types:
- Laptop Bag
- Wireless Mouse
- Laptop Stand
- Laptop Cooling Pad

IMPORTANT:
The examples above MUST NOT be returned unless they are relevant to the
actual USER SEARCH QUERY.

Now generate recommendations ONLY for:

"${productName}"
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);

    throw new Error(
      "AI recommendation service is temporarily unavailable"
    );
  }
};

module.exports = {
  generateRecommendations,
};