import { z } from "zod";

export const SignupSchema = z.object({
  email: z
    .string({ required_error: "メールアドレスは必須です" })
    .email("無効なメールアドレスです"),
  password: z
    .string({ required_error: "パスワードは必須です" })
    .min(8, "パスワードは８文字以上にしてください"),
});
