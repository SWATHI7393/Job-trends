'use server';
/**
 * @fileOverview A simple AI chatbot.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Message, Role} from 'genkit/model';

export const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.nativeEnum(Role),
      text: z.string(),
    })
  ),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = Message;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.any(), // Since Message is a class
  },
  async ({history}) => {
    const response = await ai.generate({
      prompt: [
        {
          text: 'You are a helpful and friendly AI assistant for JobTrend Pro, a platform for job market analysis. Answer questions concisely and professionally.',
        },
        ...history,
      ],
      model: 'googleai/gemini-2.5-flash',
    });

    return response.output!;
  }
);
