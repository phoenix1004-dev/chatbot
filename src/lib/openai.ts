import OpenAI from "openai";
import { Message } from "@/types/assistant";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export async function generateChatTitle(firstMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates concise, descriptive titles for chat conversations. Generate a title that is 2-6 words long and captures the main topic or intent of the user's first message. Do not use quotes or special formatting.",
        },
        {
          role: "user",
          content: `Generate a title for a chat that starts with this message: "${firstMessage}"`,
        },
      ],
      max_tokens: 20,
      temperature: 0.7,
    });

    const title = response.choices[0]?.message?.content?.trim();

    if (!title) {
      throw new Error("Failed to generate title");
    }

    // Fallback to a truncated version of the message if title is too long
    if (title.length > 50) {
      return firstMessage.slice(0, 47) + "...";
    }

    return title;
  } catch (error) {
    console.error("Error generating chat title:", error);
    // Fallback to truncated first message
    return firstMessage.slice(0, 47) + (firstMessage.length > 47 ? "..." : "");
  }
}

export async function generateChatResponse(
  messages: Message[],
  assistantInstructions: string,
  assistantPersona: string
): Promise<string> {
  try {
    // Convert our message format to OpenAI format
    const openAIMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content: `${assistantInstructions}\n\nPersona: ${assistantPersona}`,
        },
        ...messages.map(
          (msg): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({
            role: msg.role as "user" | "assistant" | "system",
            content: msg.content,
          })
        ),
      ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: openAIMessages,
      max_tokens: 2000,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error("Failed to generate response");
    }

    return assistantMessage.trim();
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to generate response");
  }
}

export { openai };
