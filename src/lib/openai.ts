import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export async function generateChatTitle(firstMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates concise, descriptive titles for chat conversations. Generate a title that is 2-6 words long and captures the main topic or intent of the user\'s first message. Do not use quotes or special formatting.',
        },
        {
          role: 'user',
          content: `Generate a title for a chat that starts with this message: "${firstMessage}"`,
        },
      ],
      max_tokens: 20,
      temperature: 0.7,
    });

    const title = response.choices[0]?.message?.content?.trim();
    
    if (!title) {
      throw new Error('Failed to generate title');
    }

    // Fallback to a truncated version of the message if title is too long
    if (title.length > 50) {
      return firstMessage.slice(0, 47) + '...';
    }

    return title;
  } catch (error) {
    console.error('Error generating chat title:', error);
    // Fallback to truncated first message
    return firstMessage.slice(0, 47) + (firstMessage.length > 47 ? '...' : '');
  }
}

export { openai };
