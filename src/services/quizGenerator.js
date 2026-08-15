import { aiComplete } from './aiProvider';

export async function generateQuizQuestions(topic = 'MERN', difficulty = 'mixed', count = 10) {
  const difficultyPrompt = difficulty === 'mixed' 
    ? '3 Easy, 4 Medium, 3 Hard'
    : `All ${difficulty}`;

  const prompt = `Generate exactly ${count} multiple choice quiz questions about ${topic} development.
Distribution: ${difficultyPrompt}

Format MUST be valid JSON array with this exact structure:
[
  {
    "q": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "ans": 0,
    "level": "Easy",
    "topic": "${topic}"
  }
]

Requirements:
- Each question must have exactly 4 options
- "ans" is the index (0-3) of the correct answer
- "level" must be "Easy", "Medium", or "Hard"
- Questions should be practical and relevant to ${topic}
- Make questions clear and unambiguous
- Return ONLY the JSON array, no other text

Generate the questions now:`;

  try {
    const { content } = await aiComplete(
      [
        { role: 'system', content: 'You are a quiz question generator. Generate high-quality multiple choice questions. Always respond with valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      { maxTokens: 2000, temperature: 0.7 }
    );

    if (!content) {
      throw new Error('No response from API');
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON in response');
    }

    const questions = JSON.parse(jsonMatch[0]);

    // Validate and add IDs
    return questions.map((q, idx) => ({
      id: Date.now() + idx,
      q: q.q,
      options: q.options,
      ans: q.ans,
      level: q.level || 'Medium',
      topic: q.topic || topic,
    }));
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw error;
  }
}

export async function generateQuestionsByDifficulty(topic, difficulty, count) {
  return generateQuizQuestions(topic, difficulty, count);
}
