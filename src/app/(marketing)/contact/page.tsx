"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@")) errs.email = "Valid email is required";
    if (form.message.trim().length < 10) errs.message = "Message must be at least 10 characters";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-surface-900">Message Sent!</h2>
          <p className="mt-2 text-surface-500">
            We&apos;ll get back to you within 24 hours.
          </p>
          <button onClick={() => setStatus("idle")} className="btn-secondary mt-6">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-20">
        <div className="container-marketing text-center">
          <h1 className="text-4xl font-bold text-surface-900 sm:text-5xl">Get in Touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-surface-600">
            Ready to make your food famous? Drop us a line and we&apos;ll set up
            a free consultation.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-marketing">
          <div className="grid gap-12 md:grid-cols-5">
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <p className="text-sm font-semibold text-surface-900">Email</p>
                <p className="mt-1 text-surface-500">{siteConfig.contact.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900">Phone</p>
                <p className="mt-1 text-surface-500">{siteConfig.contact.phone}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
              <div>
                <label htmlFor="name" className="label">Name</label>
                <input
                  id="name"
                  type="text"
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="message" className="label">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="input-field resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your business and what you're looking for..."
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </div>
              {status === "error" && (
                <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
              )}
              <button type="submit" className="btn-primary" disabled={status === "sending"}>
                {status === "sending" ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
