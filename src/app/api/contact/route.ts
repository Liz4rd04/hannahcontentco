import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Option 1: Store in Supabase (simple — no extra service needed)
    // Create a "contact_submissions" table if you want to store these.
    // For now, we'll just log it. Replace with email sending if desired.
    const supabase = createAdminClient();

    // If you've created a contact_submissions table:
    // await supabase.from("contact_submissions").insert({
    //   name: result.data.name,
    //   email: result.data.email,
    //   message: result.data.message,
    // });

    // Option 2: Send email via Resend (uncomment if using Resend)
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "noreply@yourdomain.com",
    //   to: process.env.CONTACT_EMAIL!,
    //   subject: `New Contact: ${result.data.name}`,
    //   text: `Name: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.message}`,
    // });

    console.log("Contact form submission:", result.data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
