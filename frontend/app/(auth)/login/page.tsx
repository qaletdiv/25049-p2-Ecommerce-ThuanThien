'use client';
import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/app/components/forms/PasswordInput";
import { takeLastPage } from "@/app/components/auth/lastPage";
import { loginSchema, validateForm } from "@/app/components/forms/authSchemas";
import { buttonClass, errorClass, inputClass, labelClass } from "@/app/components/forms/styles";

type Errors = { username?: string; password?: string; form?: string };

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Kiểm tra các trường bằng yup trước khi gọi backend.
        const newErrors: Errors = await validateForm(loginSchema, { username, password });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSubmitting(true);
        try {
            // "/api/auth/login" đi qua proxy tới backend Express, backend trả về { token, user }.
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                const data = await res.json();
                setErrors({ form: data.message ?? "Đăng nhập thất bại." });
                return;
            }
            const data = await res.json();
            // Lưu JWT trong localStorage; header gửi lại dưới dạng "Authorization: Bearer <token>".
            localStorage.setItem("token", data.token);
            // Quay lại trang người dùng đang xem trước khi vào đây (do LastPageTracker lưu), hoặc về trang chủ.
            router.push(takeLastPage());
        } catch {
            setErrors({ form: "Không kết nối được máy chủ. Vui lòng thử lại." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-semibold">Đăng nhập</h1>
            <p className="mt-1 text-sm text-muted">Chào mừng bạn quay lại. Đăng nhập vào tài khoản của bạn.</p>

            <form onSubmit={handleLogin} noValidate className="mt-8 space-y-5">
                <div>
                    <label htmlFor="login-username" className={labelClass}>Tên đăng nhập hoặc email</label>
                    <input
                        id="login-username"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        aria-invalid={Boolean(errors.username)}
                        aria-describedby={errors.username ? "login-username-error" : undefined}
                        className={inputClass}
                    />
                    {errors.username && <p id="login-username-error" className={`mt-1 ${errorClass}`}>{errors.username}</p>}
                </div>
                <div>
                    <label htmlFor="login-password" className={labelClass}>Mật khẩu</label>
                    <PasswordInput
                        id="login-password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={errors.password ? "login-password-error" : undefined}
                    />
                    {errors.password && <p id="login-password-error" className={`mt-1 ${errorClass}`}>{errors.password}</p>}
                </div>
                {errors.form && <p role="alert" className={errorClass}>{errors.form}</p>}
                <button type="submit" disabled={submitting} className={buttonClass}>
                    {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-foreground underline underline-offset-4">
                    Đăng ký
                </Link>
            </p>
        </>
    )
}
