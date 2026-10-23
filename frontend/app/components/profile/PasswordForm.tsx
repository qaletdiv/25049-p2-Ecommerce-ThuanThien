"use client";

import { useState, type SubmitEvent } from "react";
import PasswordInput from "@/app/components/forms/PasswordInput";
import { passwordSchema, validateForm } from "@/app/components/forms/authSchemas";
import { buttonClass, errorClass, labelClass } from "@/app/components/forms/styles";

type Field = "currentPassword" | "newPassword" | "confirmPassword";

const fields: { name: Field; label: string; autoComplete: string }[] = [
  { name: "currentPassword", label: "Mật khẩu hiện tại", autoComplete: "current-password" },
  { name: "newPassword", label: "Mật khẩu mới", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Xác nhận mật khẩu mới", autoComplete: "new-password" },
];

const empty = { currentPassword: "", newPassword: "", confirmPassword: "" };

// Change the password of the logged-in user (PUT /api/auth/password).
export default function PasswordForm() {
  const [values, setValues] = useState<Record<Field, string>>(empty);
  const [errors, setErrors] = useState<Partial<Record<Field | "form", string>>>({});
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");

    const newErrors = await validateForm(passwordSchema, values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        // The backend answers { errors: { currentPassword | newPassword: message } }.
        setErrors(data.errors ?? { form: data.message ?? "Đổi mật khẩu thất bại." });
        return;
      }
      setValues(empty);
      setSuccess("Đổi mật khẩu thành công.");
    } catch {
      setErrors({ form: "Không kết nối được máy chủ. Vui lòng thử lại." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="change-password" className="border border-border p-6">
      <h2 id="change-password" className="text-lg font-semibold">Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={`profile-${f.name}`} className={labelClass}>{f.label}</label>
            <PasswordInput
              id={`profile-${f.name}`}
              autoComplete={f.autoComplete}
              value={values[f.name]}
              onChange={(e) => {
                setValues((v) => ({ ...v, [f.name]: e.target.value }));
                setErrors((er) => ({ ...er, [f.name]: undefined }));
              }}
              aria-invalid={Boolean(errors[f.name])}
              aria-describedby={errors[f.name] ? `profile-${f.name}-error` : undefined}
            />
            {errors[f.name] && <p id={`profile-${f.name}-error`} className={`mt-1 ${errorClass}`}>{errors[f.name]}</p>}
          </div>
        ))}
        {errors.form && <p role="alert" className={errorClass}>{errors.form}</p>}
        {success && <p role="status" className="text-sm text-success">{success}</p>}
        <button type="submit" disabled={submitting} className={buttonClass}>
          {submitting ? "Đang lưu..." : "Đổi mật khẩu"}
        </button>
      </form>
    </section>
  );
}
