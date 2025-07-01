import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CreateAssistantRequest } from '@/types/assistant';

// GET /api/assistants - List all assistants
export async function GET() {
  try {
    const { data: assistants, error } = await supabase
      .from('assistants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assistants:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assistants' },
        { status: 500 }
      );
    }

    return NextResponse.json(assistants);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/assistants - Create new assistant
export async function POST(request: NextRequest) {
  try {
    const body: CreateAssistantRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.instructions || !body.persona) {
      return NextResponse.json(
        { error: 'Name, instructions, and persona are required' },
        { status: 400 }
      );
    }

    const { data: assistant, error } = await supabase
      .from('assistants')
      .insert([
        {
          name: body.name.trim(),
          instructions: body.instructions.trim(),
          persona: body.persona.trim(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating assistant:', error);
      return NextResponse.json(
        { error: 'Failed to create assistant' },
        { status: 500 }
      );
    }

    return NextResponse.json(assistant, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
