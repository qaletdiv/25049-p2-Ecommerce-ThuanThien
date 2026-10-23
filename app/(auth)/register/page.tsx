'use client';
import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/app/components/forms/PasswordInput";
import { registerSchema, validateForm } from "@/app/components/forms/authSchemas";
import { buttonClass, errorClass, inputClass, labelClass } from "@/app/components/forms/styles";

type Field = "fullName" | "username" | "email" | "password" | "confirmPassword";
type Errors = Partial<Record<Field | "form", string>>;

export default function RegisterPage() {
    const [values, setValues] = useState<Record<Field, string>>({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<Errors>({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const setField = (field: Field, value: string) => {
        setValues((v) => ({ ...v, [field]: value }));
        // Clear the error of a field as soon as the user edits it.
        setErrors((e) => ({ ...e, [field]: undefined }));
    };

    const handleRegister = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Collapse extra spaces in the name ("  Nguyễn   Văn A " → "Nguyễn Văn A"), like the backend does.
        // normalize("NFC") joins accents that some keyboards type as separate characters.
        const fullName = values.fullName.normalize("NFC").trim().replace(/\s+/g, " ");

        // Check the fields with yup (rules in authSchemas.ts) before calling the backend.
        const newErrors: Errors = await validateForm(registerSchema, { ...values, fullName });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSubmitting(true);
        try {
            const body = { fullName, username: values.username.trim(), email: values.email.trim(), password: values.password };
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                // The backend answers { errors: { field: message } }, e.g. a username that already exists.
                const data = await res.json();
                setErrors(data.errors ?? { form: data.message ?? "Đăng ký thất bại." });
                return;
            }

            // Show the success message, then go to the login page after 2 seconds.
            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch {
            setErrors({ form: "Không kết nối được máy chủ. Vui lòng thử lại." });
        } finally {
            setSubmitting(false);
        }
    };

    // Shared props for a field: aria attributes that link the input to its error message.
    const fieldProps = (field: Field) => ({
        id: `register-${field}`,
        value: values[field],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField(field, e.target.value),
        "aria-invalid": Boolean(errors[field]),
        "aria-describedby": errors[field] ? `register-${field}-error` : undefined,
    });

    const fieldError = (field: Field) =>
        errors[field] && (
            <p id={`register-${field}-error`} className={`mt-1 ${errorClass}`}>
                {errors[field]}
            </p>
        );

    return (
        <>
            <h1 className="text-2xl font-semibold">Tạo tài khoản</h1>
            <p className="mt-1 text-sm text-muted">Tạo tài khoản để lưu sản phẩm yêu thích và thanh toán nhanh hơn.</p>

            <form onSubmit={handleRegister} noValidate className="mt-8 space-y-5">
                <div>
                    <label htmlFor="register-fullName" className={labelClass}>Họ và tên</label>
                    <input {...fieldProps("fullName")} type="text" autoComplete="name" className={inputClass} />
                    {fieldError("fullName")}
                </div>
                <div>
                    <label htmlFor="register-username" className={labelClass}>Tên đăng nhập</label>
                    <input {...fieldProps("username")} type="text" autoComplete="username" className={inputClass} />
                    {fieldError("username")}
                </div>
                <div>
                    <label htmlFor="register-email" className={labelClass}>Email</label>
                    <input {...fieldProps("email")} type="email" autoComplete="email" className={inputClass} />
                    {fieldError("email")}
                </div>
                <div>
                    <label htmlFor="register-password" className={labelClass}>Mật khẩu</label>
                    <PasswordInput {...fieldProps("password")} autoComplete="new-password" />
                    {fieldError("password")}
                </div>
                <div>
                    <label htmlFor="register-confirmPassword" className={labelClass}>Xác nhận mật khẩu</label>
                    <PasswordInput {...fieldProps("confirmPassword")} autoComplete="new-password" />
                    {fieldError("confirmPassword")}
                </div>
                {errors.form && <p role="alert" className={errorClass}>{errors.form}</p>}
                {success && (
                    <p role="status" className="border border-success bg-success-bg px-3 py-2 text-sm text-success">
                        Đăng ký thành công! Đang chuyển sang trang đăng nhập...{" "}
                        <Link href="/login" className="font-semibold underline underline-offset-4">
                            Đăng nhập ngay
                        </Link>
                    </p>
                )}
                <button type="submit" disabled={submitting || success} className={buttonClass}>
                    {submitting ? "Đang tạo tài khoản..." : "Đăng ký"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-foreground underline underline-offset-4">
                    Đăng nhập
                </Link>
            </p>
        </>
    )
}
