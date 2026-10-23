import * as yup from "yup";

// Validation rules for the forms (login and register use the same rules as the backend's server.js).

export const loginSchema = yup.object({
  username: yup.string().trim().required("Vui lòng nhập tên đăng nhập hoặc email."),
  password: yup.string().required("Vui lòng nhập mật khẩu."),
});

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Vui lòng nhập họ và tên.")
    // Same rule as the backend: 2–50 letters (Vietnamese accents included) and spaces.
    .matches(/^[\p{L} ]{2,50}$/u, "Họ và tên gồm 2–50 ký tự, chỉ chữ cái và khoảng trắng."),
  username: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên đăng nhập.")
    .matches(/^[a-zA-Z0-9_]{3,20}$/, "Tên đăng nhập gồm 3–20 ký tự: chữ, số hoặc dấu gạch dưới."),
  email: yup.string().trim().required("Vui lòng nhập email.").email("Email không hợp lệ."),
  password: yup.string().required("Vui lòng nhập mật khẩu.").min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu.")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp."),
});

// Profile page: change password (same length rule as register).
export const passwordSchema = yup.object({
  currentPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại."),
  newPassword: yup.string().required("Vui lòng nhập mật khẩu mới.").min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu mới.")
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp."),
});

// Checkout form. The backend does not check these fields, so the frontend is the only check.
export const checkoutSchema = yup.object({
  customerName: yup
    .string()
    .trim()
    .required("Vui lòng nhập họ và tên người nhận.")
    .matches(/^[\p{L} ]{2,50}$/u, "Họ và tên gồm 2–50 ký tự, chỉ chữ cái và khoảng trắng."),
  phoneNumber: yup
    .string()
    .required("Vui lòng nhập số điện thoại.")
    // Spaces, dots and dashes are allowed while typing; they are removed before sending.
    .test("phone", "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.", (v) => /^0\d{9}$/.test((v ?? "").replace(/[\s.-]/g, ""))),
  address: yup
    .string()
    .trim()
    .required("Vui lòng nhập địa chỉ giao hàng.")
    .min(10, "Địa chỉ gồm 10–200 ký tự.")
    .max(200, "Địa chỉ gồm 10–200 ký tự."),
  paymentMethod: yup.string().oneOf(["cod", "bank"], "Vui lòng chọn phương thức thanh toán."),
});

// Run a schema and turn yup's errors into { field: message } (first message per field).
// Returns an empty object when everything is valid.
export async function validateForm(schema: yup.AnyObjectSchema, values: object): Promise<Record<string, string>> {
  try {
    await schema.validate(values, { abortEarly: false });
    return {};
  } catch (err) {
    if (!(err instanceof yup.ValidationError)) throw err;
    const errors: Record<string, string> = {};
    for (const e of err.inner) {
      if (e.path && !errors[e.path]) errors[e.path] = e.message;
    }
    return errors;
  }
}
