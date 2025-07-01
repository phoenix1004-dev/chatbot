import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateChatResponse } from '@/lib/openai';
import { Message } from '@/types/assistant';

// POST /api/chats/[id]/generate-response - Generate AI response for the latest user message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify chat exists and get assistant info
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select(`
        *,
        assistants (
          id,
          name,
          instructions,
          persona
        )
      `)
      .eq('id', id)
      .single();

    if (chatError || !chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Get existing messages for context
    const { data: existingMessages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching existing messages:', messagesError);
      return NextResponse.json(
        { error: 'Failed to fetch conversation history' },
        { status: 500 }
      );
    }

    if (!existingMessages || existingMessages.length === 0) {
      return NextResponse.json(
        { error: 'No messages found in chat' },
        { status: 400 }
      );
    }

    // Check if the last message is from the user and doesn't have a response yet
    const lastMessage = existingMessages[existingMessages.length - 1];
    if (lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message is not from user or already has a response' },
        { status: 400 }
      );
    }

    // Generate AI response
    const assistantResponse = await generateChatResponse(
      existingMessages as Message[],
      chat.assistants.instructions,
      chat.assistants.persona
    );

    // Save assistant message
    const { data: assistantMessage, error: assistantMessageError } = await supabase
      .from('messages')
      .insert([
        {
          chat_id: id,
          role: 'assistant',
          content: assistantResponse,
        }
      ])
      .select()
      .single();

    if (assistantMessageError) {
      console.error('Error saving assistant message:', assistantMessageError);
      return NextResponse.json(
        { error: 'Failed to save assistant response' },
        { status: 500 }
      );
    }

    // Update chat's updated_at timestamp
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);

    // Return the assistant message
    return NextResponse.json(assistantMessage, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
