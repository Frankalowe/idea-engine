import { GoogleGenerativeAI } from '@google/generative-ai';

const CATEGORY_COLORS = ['#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];
const CATEGORY_ICONS = ['🎯', '💡', '🚀', '🌟', '🔥'];

// --- Prompt Builders ---
function buildPrompt(phrase) {
  return `You are an expert YouTube content strategist. Analyze the following phrase/topic and return a comprehensive content strategy.
PHRASE: "${phrase}"
Return ONLY a valid JSON object with NO markdown, NO code blocks, NO explanation — just raw JSON.
{
  "mainTopic": "Clean version of the main topic",
  "categories": [
    {
      "id": "cat_0",
      "name": "Category Name",
      "color": "${CATEGORY_COLORS[0]}",
      "icon": "${CATEGORY_ICONS[0]}",
      "subcategories": ["Subtopic A", "Subtopic B", "Subtopic C"]
    }
  ],
  "mindMap": {
    "nodes": [
      {"id": "root", "label": "Main Topic", "type": "root"},
      {"id": "cat_0", "label": "Category 1", "type": "category", "categoryIndex": 0},
      {"id": "cat_0_sub_0", "label": "Subtopic A", "type": "subtopic", "categoryIndex": 0}
    ],
    "edges": [
      {"id": "e_root_cat0", "source": "root", "target": "cat_0"},
      {"id": "e_cat0_sub0", "source": "cat_0", "target": "cat_0_sub_0"}
    ]
  },
  "videoTitles": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"],
  "outline": {
    "intro": "Intro text",
    "points": [{"title": "P1", "description": "D1"}],
    "cta": "CTA text"
  },
  "relatedIdeas": ["Idea 1", "Idea 2"]
}`;
}

function buildDescriptionPrompt(topic, mainPhrase) {
  return `You are a world-class YouTube content consultant. Analyze the following specific sub-topic within the context of "${mainPhrase}".
SUB-TOPIC: "${topic}"
Return ONLY a valid JSON object with NO markdown, NO code blocks.
{
  "topic": "${topic}",
  "description": "2-3 paragraphs of expert context.",
  "expertTips": ["Tip 1", "Tip 2", "Tip 3"],
  "angles": [{"label": "Hook 1", "text": "Angle 1"}]
}`;
}

function buildScriptPrompt(topic, mainPhrase) {
  return `Professional YouTube scriptwriter. Write a conversational, high-quality script for the topic: "${topic}" (context: ${mainPhrase}).
The script MUST be long enough for a 12-15 minute video (approximately 1800-2200 words).

Return ONLY a valid JSON object with NO markdown, NO code blocks.

Use this EXACT structure:
{
  "title": "Professional Video Title",
  "hook": "Compelling, high-retention opening (30-60 seconds of spoken content)",
  "segments": [
    {
      "title": "Segment Heading",
      "content": "A detailed, conversational section of the script. Focus on stories, data, and deep explanation.",
      "visualCue": "B-roll, overlays, or set instructions"
    }
  ],
  "outro": "Deep summary and powerful call to action"
}

Rules:
- Generate 8 to 12 detailed segments.
- Each segment's 'content' must be substantial (at least 200 words).
- Use a natural, conversational tone with storytelling elements to keep retention high.`;
}

// --- Serverless Handler ---
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, payload } = req.body;
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API Key is not configured on the backend.' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Use Pro for longer outputs

  try {
    let prompt = '';
    if (type === 'generate') prompt = buildPrompt(payload.phrase);
    else if (type === 'describe') prompt = buildDescriptionPrompt(payload.topic, payload.mainPhrase);
    else if (type === 'script') prompt = buildScriptPrompt(payload.topic, payload.mainPhrase);
    else return res.status(400).json({ error: 'Invalid request type' });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let jsonText = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonText = jsonMatch[0];

    return res.status(200).json(JSON.parse(jsonText));
  } catch (err) {
    console.error('Backend AI Error:', err);
    return res.status(500).json({ error: 'AI generation failed: ' + err.message });
  }
}
