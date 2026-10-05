"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Avisos temporários.
 *
 * Existe porque uma linha fixa de status não serve para nada: ela fica ali o tempo todo
 * falando "Pronto." e, quando alguma coisa acontece, a pessoa não sabe se aquilo foi
 * resposta ou resto da tela. Aqui cada ação avisa na hora, some sozinha e o somatório não
 * ocupa espaço na página.
 */

export type ToastTone = "info" | "sucesso" | "atencao" | "erro";

export interface Toast {
  id: number;
  texto: string;
  tom: ToastTone;
}

interface ToastApi {
  /** `avise("Salvo")` é o caminho curto; o tom é inferido do verbo quando dá. */
  avise: (texto: string, tom?: ToastTone) => void;
}

const Contexto = createContext<ToastApi | null>(null);

/** Duração por tom: erro fica mais, porque exige leitura. */
const DURACAO: Record<ToastTone, number> = { info: 4000, sucesso: 3200, atencao: 5200, erro: 8000 };

function tomInferido(texto: string): ToastTone {
  const t = texto.toLowerCase();
  if (/(não foi|falhou|erro|não deu|inválid)/.test(t)) return "erro";
  if (/(desfaz|desfazer|excluíd|removid|descartad)/.test(t)) return "atencao";
  if (/(salv|concluíd|arquivad|atualizad|criad|registrad|aceit)/.test(t)) return "sucesso";
  return "info";
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dispensar = useCallback((id: number) => {
    setToasts((atuais) => atuais.filter((item) => item.id !== id));
  }, []);

  const avise = useCallback((texto: string, tom?: ToastTone) => {
    const escolhido = tom ?? tomInferido(texto);
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((atuais) => [...atuais.slice(-2), { id, texto, tom: escolhido }]);
    window.setTimeout(() => dispensar(id), DURACAO[escolhido]);
  }, [dispensar]);

  const api = useMemo(() => ({ avise }), [avise]);

  return (
    <Contexto.Provider value={api}>
      {children}
      <div className="toasts" role="status" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.tom}`}>
            <span className="toast-glifo" aria-hidden="true">
              {{ info: "i", sucesso: "✓", atencao: "!", erro: "×" }[toast.tom]}
            </span>
            <span className="toast-texto">{toast.texto}</span>
            <button type="button" className="toast-fechar" onClick={() => dispensar(toast.id)} aria-label="Fechar aviso">×</button>
          </div>
        ))}
      </div>
    </Contexto.Provider>
  );
}

/** Fallback estável: um objeto novo a cada render mudaria a identidade de `avise` e
 *  acordaria efeitos a toa hora em quem só usa o aviso. */
const SEM_PROVIDER: ToastApi = { avise: () => undefined };

export function useToast(): ToastApi {
  // Fora do provider (teste isolado, por exemplo) o aviso apenas não aparece: melhor que quebrar a tela.
  return useContext(Contexto) ?? SEM_PROVIDER;
}
