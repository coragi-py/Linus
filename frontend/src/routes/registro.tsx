import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/lib/validations/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useLinus } from "@/context/LinusContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/registro")({
  component: RegistroPage,
});

function RegistroPage() {
  const { login } = useLinus();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      ano_nascimento: undefined,
      terms_accepted: false,
      terms_version: "v1.0",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Conta criada com sucesso! Redirecionando...");
        navigate({ to: "/" });
      } else {
        toast.error(data.error || "Ocorreu um erro ao efetuar o registo.");
      }
    } catch (error) {
      toast.error("Erro na comunicação com o servidor.");
    }
  };

  const onGoogleSuccess = async (credentialResponse: any) => {
    try {
      const termsAccepted = form.getValues("terms_accepted");
      const anoNascimento = form.getValues("ano_nascimento");

      const res = await fetch("http://localhost:8000/api/v1/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_token: credentialResponse.credential,
          terms_accepted: termsAccepted,
          terms_version: "v1.0",
          ano_nascimento: anoNascimento || null,
        }),
      });
      const data = await res.json();

      if (res.status === 403 && data.status === "registration_required") {
        toast.error(
          "É necessário aceitar os Termos de Uso e preencher o ano de nascimento antes de prosseguir com o acesso.",
        );
      } else if (res.ok) {
        login(data.access, data.refresh);
        toast.success("Registo via Google concluído!");
        navigate({ to: "/painel" });
      } else {
        toast.error(data.error || "Falha na autenticação Google.");
      }
    } catch (error) {
      toast.error("Erro na comunicação com o servidor.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-sm bg-card">
      <h1 className="text-2xl font-bold text-center mb-6">Criar Conta LINUS</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="nome@exemplo.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Palavra-passe</FormLabel>
                <FormControl>
                  <Input placeholder="Sua senha" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ano_nascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano de Nascimento</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 1995" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms_accepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Aceito os Termos de Uso e a Política de Privacidade (Art. 8º LGPD).
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Registar Conta
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou registe-se com</span>
        </div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={() => toast.error("Ocorreu um erro ao invocar o Google.")}
        />
      </div>
    </div>
  );
}
