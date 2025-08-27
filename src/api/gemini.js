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

export async function generateQuestions(subject, topic ) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Generate exactly 10 multiple-choice quiz questions with 4 options each for the subject "${subject}" and topic "${topic}".
Return the response strictly as a JSON array with fields:
- question (string)
- options (array of 4 strings)
- answer (string, must match exactly one option).
`;

  try {
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    let questions = JSON.parse(text);

    return Array.isArray(questions) ? questions.slice(0, 10) : [];
  } catch (err) {
    console.error("Error generating questions:", err);
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
