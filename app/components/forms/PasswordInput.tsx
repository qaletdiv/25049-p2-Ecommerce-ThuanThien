"use client";

import { useState, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon } from "@/app/components/icons";
import { inputClass } from "@/app/components/forms/styles";

// Ô mật khẩu có nút hiện/ẩn. Nhận cùng props với <input>.
export default function PasswordInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative mt-1">
      {/* Phần bọc ngoài chịu margin trên để nút con mắt thẳng hàng với ô nhập. */}
      <input {...props} type={visible ? "text" : "password"} className={`${inputClass.replace("mt-1 ", "")} pr-10`} />
      <button
        type="button"
        aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted hover:text-foreground"
      >
        {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
      </button>
    </div>
  );
}
