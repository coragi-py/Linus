import React, { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLinus } from "@/context/LinusContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/privacidade")({
  component: PrivacidadePage,
});

function PrivacidadePage() {
  const { getAccessToken, logout } = useLinus();
  const navigate = useNavigate();
  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    const fetchPrivacidade = async () => {
      const token = getAccessToken();
      if (!token) return navigate({ to: "/" });

      const res = await fetch("http://localhost:8000/api/v1/auth/privacy/data/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDados(await res.json());
      } else {
        toast.error("Não foi possível carregar os dados de privacidade.");
      }
    };
    fetchPrivacidade();
  }, [getAccessToken, navigate]);

  const handleExport = () => {
    if (!dados) return;
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dados, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dados_pessoais_linus.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Exportação de dados concluída.");
  };

  const handleDeleteAccount = async () => {
    try {
      const token = getAccessToken();
      const res = await fetch("http://localhost:8000/api/v1/auth/privacy/delete-account/", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Conta excluída e anonimizada permanentemente.");
        logout();
      } else {
        toast.error("Ocorreu um erro ao excluir a conta.");
      }
    } catch (e) {
      toast.error("Erro na comunicação com o servidor.");
    }
  };

  if (!dados)
    return <div className="p-8 text-center text-muted-foreground">Carregando os seus dados...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 border rounded-lg shadow-sm bg-card">
      <h1 className="text-3xl font-bold mb-6">Gestão de Privacidade e Dados (LGPD)</h1>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Os Seus Dados Atuais</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm text-muted-foreground">
          {JSON.stringify(dados, null, 2)}
        </pre>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleExport} variant="outline" className="flex-1">
          Exportar Dados (Formato JSON)
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1">
              Excluir Conta Definitivamente
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem a certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível. Os seus dados pessoais serão destruídos e o histórico da
                sua conta será anonimizado, garantindo total conformidade com a LGPD (Artigo 18).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground"
              >
                Sim, excluir a minha conta
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
