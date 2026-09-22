import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Insira um endereço de e-mail válido." }),
  password: z.string().min(8, { message: "A senha deve conter pelo menos 8 carateres." }),
});

export const twoFactorSchema = z.object({
  otp: z.string().length(6, { message: "O código deve conter exatamente 6 dígitos." }),
});

export const registerSchema = loginSchema.extend({
  ano_nascimento: z.coerce
    .number()
    .int()
    .min(1900, { message: "Ano de nascimento inválido." })
    .max(new Date().getFullYear() - 12, {
      message: "Você precisa ter pelo menos 12 anos para se cadastrar.",
    }),

  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "É obrigatório aceitar os Termos de Uso (LGPD)." }),
  }),
  terms_version: z.string().default("v1.0"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Insira um endereço de e-mail válido." }),
});

export const resetPasswordConfirmSchema = z.object({
  token: z.string().min(1, {
    message: "Insira o token de recuperação de senha enviado para o e-mail cadastrado.",
  }),
  new_password: z.string().min(8, { message: "A nova senha deve conter pelo menos 8 carateres." }),
});
