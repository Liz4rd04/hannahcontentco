import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const clientId = formData.get("clientId") as string;
    const albumId = formData.get("albumId") as string;

    if (!file || !clientId || !albumId) {
      return NextResponse.json(
        { error: "file, clientId, and albumId are required" },
        { status: 400 }
      );
    }

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Only image and video files are allowed" },
        { status: 400 }
      );
    }

    // Generate unique file ID
    const mediaId = crypto.randomUUID();
    const ext = file.name.split(".").pop() || "bin";
    const storagePath = `${clientId}/${albumId}/${mediaId}.${ext}`;

    // Upload to Supabase Storage using admin client (bypasses RLS)
    const admin = createAdminClient();
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage
      .from("client-media")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Create media record
    const { data: media, error: dbError } = await supabase
      .from("media")
      .insert({
        id: mediaId,
        album_id: albumId,
        client_id: clientId,
        type: isImage ? "image" : "video",
        storage_path: storagePath,
        filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file on DB error
      await admin.storage.from("client-media").remove([storagePath]);
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    await logAudit({
      action: "media_uploaded",
      userId: user.id,
      entityType: "media",
      entityId: mediaId,
      metadata: { filename: file.name, type: isImage ? "image" : "video" },
    });

    return NextResponse.json({ data: media }, { status: 201 });
  } catch (err) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
