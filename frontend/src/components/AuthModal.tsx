import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema, twoFactorSchema } from "@/lib/validations/auth";
import { useLinus } from "@/context/LinusContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "LOGIN" | "2FA";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useLinus();
  const [step, setStep] = useState<Step>("LOGIN");
  const [emailCache, setEmailCache] = useState("");

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const otpForm = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { otp: "" },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.status === 202 && data.status === "2fa_required") {
        setEmailCache(values.email);
        setStep("2FA");
        toast.info("Código de verificação enviado para o seu e-mail.");
      } else if (res.ok) {
        login(data.access, data.refresh);
        toast.success("Sessão iniciada com sucesso!");
        onClose();
      } else {
        toast.error(data.error || "Credenciais inválidas.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    }
  };

  const onOTPSubmit = async (values: z.infer<typeof twoFactorSchema>) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/verify-2fa/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailCache, otp: values.otp }),
      });
      const data = await res.json();

      if (res.ok) {
        login(data.access, data.refresh);
        toast.success("Verificação concluída. Bem-vindo!");
        onClose();
        setStep("LOGIN");
      } else {
        toast.error(data.error || "Código inválido ou expirado.");
      }
    } catch (error) {
      toast.error("Erro na verificação do código.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === "LOGIN" ? "Iniciar Sessão" : "Verificação em Duas Etapas"}
          </DialogTitle>
        </DialogHeader>

        {step === "LOGIN" && (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="nome@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Palavra-passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </Form>
        )}

        {step === "2FA" && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOTPSubmit)}
              className="space-y-6 flex flex-col items-center"
            >
              <p className="text-sm text-muted-foreground text-center">
                Insira o código de 6 dígitos enviado para <strong>{emailCache}</strong>
              </p>
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Validar Código
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
