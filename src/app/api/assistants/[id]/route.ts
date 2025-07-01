import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { UpdateAssistantRequest } from "@/types/assistant";

// GET /api/assistants/[id] - Get specific assistant
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: assistant, error } = await supabase
      .from("assistants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Assistant not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching assistant:", error);
      return NextResponse.json(
        { error: "Failed to fetch assistant" },
        { status: 500 }
      );
    }

    return NextResponse.json(assistant);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/assistants/[id] - Update assistant
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateAssistantRequest = await request.json();

    // Build update object with only provided fields
    const updateData: any = { updated_at: new Date().toISOString() };
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.instructions !== undefined)
      updateData.instructions = body.instructions.trim();
    if (body.persona !== undefined) updateData.persona = body.persona.trim();

    const { data: assistant, error } = await supabase
      .from("assistants")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Assistant not found" },
          { status: 404 }
        );
      }
      console.error("Error updating assistant:", error);
      return NextResponse.json(
        { error: "Failed to update assistant" },
        { status: 500 }
      );
    }

    return NextResponse.json(assistant);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/assistants/[id] - Delete assistant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("assistants").delete().eq("id", id);

    if (error) {
      console.error("Error deleting assistant:", error);
      return NextResponse.json(
        { error: "Failed to delete assistant" },
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
