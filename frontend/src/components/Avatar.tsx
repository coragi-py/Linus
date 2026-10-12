import { useState, useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection"; 

type AvatarOptions = {
  skinColor: string[];
  hairColor: string[];
  top: string[]; 
  accessories: string[]; 
  mouth: string[];
  eyes: string[];
};

export function Avatar() {
  const [seed] = useState<string>('linus');
  const [options, setOptions] = useState<AvatarOptions>({
    skinColor: ['ffdbb4'], // Hexadecimais oficiais do DiceBear restaurados
    hairColor: ['2c1b18'],
    top: ['shortCurly'], 
    accessories: ['none'],
    mouth: ['smile'],
    eyes: ['default'],
  });

  const avatarUri = useMemo(() => {
    try {
      const avatar = createAvatar(avataaars, {
        seed: seed,
        skinColor: options.skinColor,
        hairColor: options.hairColor,
        top: options.top,
        // Lógica corrigida para os acessórios funcionarem (se for 'none', a chance de ter óculos é 0)
        accessories: options.accessories[0] === 'none' ? [] : options.accessories,
        accessoriesProbability: options.accessories[0] === 'none' ? 0 : 100,
        mouth: options.mouth,
        eyes: options.eyes,
        size: 160,
        radius: 20,
        backgroundColor: ['e2e8f0']
      } as any);
      return avatar.toDataUri();
    } catch (error) {
      console.error("Erro ao gerar avatar:", error);
      return "";
    }
  }, [seed, options]);

  const handleOptionChange = (key: keyof AvatarOptions, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [key]: [value], 
    }));
  };

  const handleSave = async () => {
    const finalJson = { seed, ...options, collection: 'avataaars' };
    
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token'); 
      
      const response = await fetch('http://localhost:8000/api/v1/auth/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar_options: finalJson })
      });

      if (response.ok) {
        alert("Avatar salvo com sucesso! Atualize a página para ver as mudanças.");
      } else {
        alert("Erro ao salvar o avatar.");
      }
    } catch (error) {
      alert("Erro de comunicação com o servidor.");
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-foreground mb-1">Personalize seu Avatar</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Escolha como você quer aparecer na plataforma.
      </p>

      <div className="flex flex-col md:flex-row gap-8 items-start bg-muted/30 p-6 rounded-xl border border-border">
        <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
           <img 
            src={avatarUri} 
            alt="Avatar gerado" 
            className="w-48 h-48 rounded-2xl shadow-sm border border-border bg-white" 
          />
        </div>

        <div className="flex-1 w-full space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Tom de Pele</label>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleOptionChange("skinColor", "ffdbb4")} className="w-8 h-8 rounded-full bg-[#ffdbb4] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"></button>
                <button onClick={() => handleOptionChange("skinColor", "edb98a")} className="w-8 h-8 rounded-full bg-[#edb98a] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"></button>
                <button onClick={() => handleOptionChange("skinColor", "d08b5b")} className="w-8 h-8 rounded-full bg-[#d08b5b] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"></button>
                <button onClick={() => handleOptionChange("skinColor", "ae5d29")} className="w-8 h-8 rounded-full bg-[#ae5d29] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"></button>
                <button onClick={() => handleOptionChange("skinColor", "614335")} className="w-8 h-8 rounded-full bg-[#614335] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"></button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Cor do Cabelo</label>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleOptionChange("hairColor", "2c1b18")} className="w-8 h-8 rounded-full bg-[#2c1b18] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"></button>
                <button onClick={() => handleOptionChange("hairColor", "a55728")} className="w-8 h-8 rounded-full bg-[#a55728] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"></button>
                <button onClick={() => handleOptionChange("hairColor", "b58143")} className="w-8 h-8 rounded-full bg-[#b58143] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"></button>
                <button onClick={() => handleOptionChange("hairColor", "ecdcbf")} className="w-8 h-8 rounded-full bg-[#ecdcbf] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"></button>
                <button onClick={() => handleOptionChange("hairColor", "e8e1e1")} className="w-8 h-8 rounded-full bg-[#e8e1e1] ring-2 ring-offset-1 ring-transparent focus:ring-primary border border-gray-200"></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Estilo do Cabelo</label>
              <select 
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => handleOptionChange("top", e.target.value)}
                value={options.top[0]}
              >
                <option value="shortCurly">Curto Encaracolado</option>
                <option value="shortFlat">Curto Liso</option>
                <option value="shortWaved">Curto Ondulado</option>
                <option value="bob">Corte Bob</option>
                <option value="curvy">Longo Curvo</option>
                <option value="dreads">Dreads</option>
                <option value="frida">Coque</option>
                <option value="hat">Com Chapéu</option>
                <option value="hijab">Hijab</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Acessórios</label>
              <select 
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => handleOptionChange("accessories", e.target.value)}
                value={options.accessories[0]}
              >
                <option value="none">Nenhum</option>
                <option value="prescription01">Óculos de Grau 1</option>
                <option value="prescription02">Óculos de Grau 2</option>
                <option value="round">Óculos Redondo</option>
                <option value="sunglasses">Óculos de Sol</option>
                <option value="wayfarers">Óculos Wayfarer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Olhos</label>
              <select 
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => handleOptionChange("eyes", e.target.value)}
                value={options.eyes[0]}
              >
                <option value="default">Padrão</option>
                <option value="happy">Feliz</option>
                <option value="surprised">Surpreso</option>
                <option value="wink">Piscando</option>
                <option value="squint">Fechado/Semicerrado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Boca</label>
              <select 
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => handleOptionChange("mouth", e.target.value)}
                value={options.mouth[0]}
              >
                <option value="default">Padrão</option>
                <option value="smile">Sorriso</option>
                <option value="twinkle">Sorriso Largo</option>
                <option value="serious">Sério</option>
                <option value="screamOpen">Surpreso / Grito</option>
                <option value="disbelief">Incrédulo</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
             <button 
                onClick={handleSave}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Salvar Avatar
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}