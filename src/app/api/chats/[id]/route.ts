import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { UpdateChatRequest } from "@/types/assistant";

// GET /api/chats/[id] - Get specific chat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: chat, error } = await supabase
      .from("chats")
      .select(`
        *,
        assistants (
          id,
          name,
          instructions,
          persona
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Chat not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching chat:", error);
      return NextResponse.json(
        { error: "Failed to fetch chat" },
        { status: 500 }
      );
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/chats/[id] - Update chat
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateChatRequest = await request.json();

    // Build update object with only provided fields
    const updateData: any = { updated_at: new Date().toISOString() };
    if (body.title !== undefined) updateData.title = body.title.trim();

    const { data: chat, error } = await supabase
      .from("chats")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Chat not found" },
          { status: 404 }
        );
      }
      console.error("Error updating chat:", error);
      return NextResponse.json(
        { error: "Failed to update chat" },
        { status: 500 }
      );
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/chats/[id] - Delete chat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("chats").delete().eq("id", id);

    if (error) {
      console.error("Error deleting chat:", error);
      return NextResponse.json(
        { error: "Failed to delete chat" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
