// src/utils/receiptAnalyzer.js

/**
 * Converts a File object to a Base64 encoded string.
 * @param {File} file The file to convert.
 * @returns {Promise<string>} The Base64 encoded string.
 */
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  // Get only the base64 content, remove the "data:image/jpeg;base64," part
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = (error) => reject(error);
});

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

/**
 * Analyzes a receipt image using the Gemini API and returns structured data.
 * @param {File} imageFile The receipt image file uploaded by the user.
 * @param {string} apiKey Your Google AI API key.
 * @returns {Promise<object>} A promise that resolves to the structured receipt data.
 */
export const analyzeReceipt = async (imageFile, apiKey) => {
  if (!imageFile || !apiKey) {
    throw new Error("Image file and API key are required.");
  }

  const imageBase64 = await fileToBase64(imageFile);

  const prompt = `
    Analyze this receipt and return a JSON object with this exact structure:
    {
      "passType": "String", "merchantName": "String", "date": "YYYY-MM-DD",
      "totalAmount": Number, "category": "String (optional)", "taxAmount": Number (optional),
      "priority": Boolean (optional), "isAWarrantyCard": Boolean (optional),
      "items": [ { "itemName": "String", "itemPrice": Number, "quantity": Number } ]
    }
    Rules:
    - Always include passType as "receipt".
    - If a value is missing, use a reasonable default (null, 0, false).
    - Do NOT include any text outside the JSON object.
    - If the input media has data related to reciept, passType is receipt.
    - If the input media has data related to warranty, passType is warranty.
    - If the input media has data related to ticket, passType is pass.
  `;

  const requestBody = {
    contents: [{
      role: "user",
      parts: [
        { inlineData: { mimeType: imageFile.type, data: imageBase64 } },
        { text: prompt },
      ],
    }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  };

  const response = await fetch(`${API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`API request failed: ${errorBody.error?.message || response.statusText}`);
  }

  const data = await response.json();

  if (data.candidates && data.candidates[0].content.parts[0].text) {
    const rawJson = data.candidates[0].content.parts[0].text;
    const structuredOutput = JSON.parse(rawJson);

    // Validate and fill missing fields
    const finalData = {
      passType: structuredOutput.passType || "receipt",
      merchantName: structuredOutput.merchantName || "Unknown Merchant",
      date: structuredOutput.date || new Date().toISOString().split("T")[0],
      totalAmount: structuredOutput.totalAmount || 0,
      category: structuredOutput.category || null,
      taxAmount: structuredOutput.taxAmount || 0,
      priority: structuredOutput.priority ?? false,
      isAWarrantyCard: structuredOutput.isAWarrantyCard ?? false,
      items: structuredOutput.items || [],
    };
    return finalData;
  } else {
    throw new Error("Unexpected response format from API.");
  }
};