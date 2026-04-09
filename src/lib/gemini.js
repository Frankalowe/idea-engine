import { GoogleGenerativeAI } from '@google/generative-ai'

const CATEGORY_COLORS = ['#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']
const CATEGORY_ICONS = ['🎯', '💡', '🚀', '🌟', '🔥']

function buildPrompt(phrase) {
  return `You are an expert YouTube content strategist. Analyze the following phrase/topic and return a comprehensive content strategy.

PHRASE: "${phrase}"

Return ONLY a valid JSON object with NO markdown, NO code blocks, NO explanation — just raw JSON.

Use this EXACT structure:
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
      {"id": "cat_0_sub_0", "label": "Subtopic A", "type": "subtopic", "categoryIndex": 0},
      {"id": "cat_0_sub_1", "label": "Subtopic B", "type": "subtopic", "categoryIndex": 0},
      {"id": "cat_0_sub_2", "label": "Subtopic C", "type": "subtopic", "categoryIndex": 0}
    ],
    "edges": [
      {"id": "e_root_cat0", "source": "root", "target": "cat_0"},
      {"id": "e_cat0_sub0", "source": "cat_0", "target": "cat_0_sub_0"},
      {"id": "e_cat0_sub1", "source": "cat_0", "target": "cat_0_sub_1"},
      {"id": "e_cat0_sub2", "source": "cat_0", "target": "cat_0_sub_2"}
    ]
  },
  "videoTitles": [
    "YouTube title hook 1",
    "YouTube title hook 2",
    "YouTube title hook 3",
    "YouTube title hook 4",
    "YouTube title hook 5"
  ],
  "outline": {
    "intro": "Compelling hook and context to open the video",
    "points": [
      {"title": "Point 1 Title", "description": "Specific content to cover in this section"},
      {"title": "Point 2 Title", "description": "Specific content to cover in this section"},
      {"title": "Point 3 Title", "description": "Specific content to cover in this section"},
      {"title": "Point 4 Title", "description": "Specific content to cover in this section"},
      {"title": "Point 5 Title", "description": "Specific content to cover in this section"}
    ],
    "cta": "Strong call to action to end the video"
  },
  "relatedIdeas": [
    "Related topic idea 1",
    "Related topic idea 2",
    "Related topic idea 3",
    "Related topic idea 4",
    "Related topic idea 5"
  ]
}

Rules:
- Generate exactly 3-5 categories relevant to the phrase
- Use the colors in order: ${CATEGORY_COLORS.join(', ')}
- Use the icons in order: ${CATEGORY_ICONS.join(', ')}
- Each category gets 3-4 subcategories in the mind map
- Video titles must be engaging YouTube hooks (use numbers, emotion, curiosity)
- Outline points should give specific, actionable content ideas
- Related ideas should be adjacent topics the creator could cover next`
}

export async function generateIdeaMap(phrase, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const result = await model.generateContent(buildPrompt(phrase))
  const text = result.response.text().trim()

  // Extract JSON - handle cases where model wraps in markdown
  let jsonText = text
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    jsonText = jsonMatch[0]
  }

  try {
    const data = JSON.parse(jsonText)
    return data
  } catch {
    throw new Error('AI returned an invalid response. Please try again.')
  }
}
