import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateChatResponse } from '@/lib/openai';
import { SendMessageRequest, Message } from '@/types/assistant';

// GET /api/chats/[id]/messages - Get messages for a chat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verify chat exists
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('id')
      .eq('id', id)
      .single();

    if (chatError || !chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Fetch messages for the chat
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chats/[id]/messages - Send a message and get AI response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: SendMessageRequest = await request.json();

    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

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

    // Save user message
    const { data: userMessage, error: userMessageError } = await supabase
      .from('messages')
      .insert([
        {
          chat_id: id,
          role: 'user',
          content: body.message.trim(),
        }
      ])
      .select()
      .single();

    if (userMessageError) {
      console.error('Error saving user message:', userMessageError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Prepare messages for AI (including the new user message)
    const allMessages: Message[] = [
      ...(existingMessages || []),
      userMessage
    ];

    // Generate AI response
    const assistantResponse = await generateChatResponse(
      allMessages,
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

    // Return both messages
    return NextResponse.json({
      userMessage,
      assistantMessage
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
