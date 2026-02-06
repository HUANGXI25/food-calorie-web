import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `你是食物营养分析AI。识别图片中所有食物,计算热量和营养成分,按热量从低到高排序。用图片语言回复。\n\n输出JSON格式:\n{\n  "language": "语言代码",\n  "foods": [\n    {"name": "食物名", "portion": "份量", "calories": 数值, "protein": 数值, "carbs": 数值, "fat": 数值}\n  ],\n  "recommendation": "推荐理由"\n}\n\nfoods数组必须按calories从低到高排序。`;

const sortFoods = (foods) => {
  if (!Array.isArray(foods)) return [];
  return [...foods].sort((a, b) => a.calories - b.calories);
};

const stripCodeFences = (text) => {
  if (!text) return text;
  return text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
};

const extractJson = (text) => {
  const cleaned = stripCodeFences(text);
  if (!cleaned) return cleaned;
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }
  return cleaned;
};

const parseDataUrl = (dataUrl) => {
  const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl || '');
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { imageDataUrl, imageBase64, mimeType } = body || {};

    let dataUrl = imageDataUrl;
    if (!dataUrl && imageBase64) {
      dataUrl = `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;
    }

    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      res.status(400).json({ error: 'Missing or invalid image data' });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          mimeType: parsed.mimeType || 'image/jpeg',
          data: parsed.data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    const jsonText = extractJson(text);

    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (parseError) {
      res.status(500).json({ error: 'Failed to parse JSON response', detail: text });
      return;
    }

    res.status(200).json({
      data: {
        ...data,
        foods: sortFoods(data.foods)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Unexpected server error', detail: error?.message || String(error) });
  }
}
