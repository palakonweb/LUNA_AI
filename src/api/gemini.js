import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Generate a study roadmap



  export async function generateRoadmap(topic, duration, timeline) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Create a structured learning roadmap for ${topic}.
      The entire roadmap duration should be ${duration} (${timeline}).
      Each week/module should include:
      - "week": e.g. "Week 1"
      - "title": short heading
      - "duration": in days/weeks
      - "topics": main areas
      - "subtopics": detailed bullet points under topics
      Format response strictly as valid JSON array.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

   
    const clean = text.replace(/```json|```/g, "").trim();

    return JSON.parse(clean);
  } catch (error) {
    console.error("Gemini error:", error);
    return [];
  }
}


export async function generateQuestions(subject, topic, mode = "mcq") {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

 
  const prompt =
    mode === "mcq"
      ? `Generate 5 multiple choice quiz questions for the subject "${subject}" and topic "${topic}".
Format the response as a JSON array with each object having:
{
  "question": "string",
  "options": ["A", "B", "C", "D"],
  "answer": "correct option from options"
}`
      : `Generate 5 short answer theory quiz questions for the subject "${subject}" and topic "${topic}".
Format the response as a JSON array with each object having:
{
  "question": "string",
  "answer": "ideal short answer in 2-3 sentences"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    let questions;
    try {
      questions = JSON.parse(text);
    } catch (err) {
      // If AI wrapped JSON in ```json code blocks
      const cleaned = text.replace(/```json|```/g, "").trim();
      questions = JSON.parse(cleaned);
    }

    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}

export async function generateNotes(subject, topic) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate clear and well-structured study notes for:
Subject: ${subject}
Topic: ${topic}

Format the notes in markdown with:
- Headings
- Bullet points for key details
- Short paragraphs where needed

Do not include extra intro or outro text, just the notes.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
