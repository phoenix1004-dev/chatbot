import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateChatTitle } from '@/lib/openai';
import { CreateChatRequest } from '@/types/assistant';

// GET /api/chats - List all chats
export async function GET() {
  try {
    const { data: chats, error } = await supabase
      .from('chats')
      .select(`
        *,
        assistants (
          id,
          name
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching chats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch chats' },
        { status: 500 }
      );
    }

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chats - Create new chat
export async function POST(request: NextRequest) {
  try {
    const body: CreateChatRequest = await request.json();
    
    // Validate required fields
    if (!body.assistant_id || !body.first_message) {
      return NextResponse.json(
        { error: 'Assistant ID and first message are required' },
        { status: 400 }
      );
    }

    // Verify assistant exists
    const { data: assistant, error: assistantError } = await supabase
      .from('assistants')
      .select('id')
      .eq('id', body.assistant_id)
      .single();

    if (assistantError || !assistant) {
      return NextResponse.json(
        { error: 'Assistant not found' },
        { status: 404 }
      );
    }

    // Generate title using OpenAI
    const title = await generateChatTitle(body.first_message.trim());

    // Create the chat
    const { data: chat, error } = await supabase
      .from('chats')
      .insert([
        {
          assistant_id: body.assistant_id,
          title: title,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating chat:', error);
      return NextResponse.json(
        { error: 'Failed to create chat' },
        { status: 500 }
      );
    }

    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
