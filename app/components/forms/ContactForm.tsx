"use client";

import { useState, type SubmitEvent } from "react";
import { buttonClass, inputClass, labelClass } from "./styles";

// Chưa có backend: form chỉ hiện thông báo xác nhận.
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };

  if (sent) {
    return (
      <div role="status" className="border border-border p-6">
        <p className="font-semibold">Cảm ơn bạn đã liên hệ.</p>
        <p className="mt-1 text-sm text-muted">Chúng tôi sẽ phản hồi trong vòng 1–2 ngày làm việc.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-4 text-sm underline underline-offset-4">
          Gửi tin nhắn khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className={labelClass}>Họ tên</label>
        <input id="contact-name" name="name" type="text" required autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClass}>Email</label>
        <input id="contact-email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="contact-topic" className={labelClass}>Chủ đề</label>
        <select id="contact-topic" name="topic" className={inputClass} defaultValue="order">
          <option value="order">Tình trạng đơn hàng</option>
          <option value="returns">Đổi trả</option>
          <option value="product">Thông tin sản phẩm</option>
          <option value="other">Khác</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>Nội dung</label>
        <textarea id="contact-message" name="message" required rows={5} className={inputClass} />
      </div>
      <button type="submit" className={buttonClass}>Gửi tin nhắn</button>
    </form>
  );
}
