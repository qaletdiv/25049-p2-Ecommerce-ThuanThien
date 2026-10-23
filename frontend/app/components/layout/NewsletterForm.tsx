"use client";

import { useState, type SubmitEvent } from "react";

// Client-side stub: no backend call, only shows a thank-you message.
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setEmail("");
  };

  if (sent) {
    return (
      <p role="status" className="text-sm">
        Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi ưu đãi mới nhất qua email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      <label htmlFor="newsletter-email" className="sr-only">
        Email của bạn
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-0 flex-1 border border-r-0 border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
      />
      <button
        type="submit"
        className="bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
      >
        Đăng ký
      </button>
    </form>
  );
}
