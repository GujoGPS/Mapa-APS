import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hasPin, pinSecurityNotice, setPin, validatePinPolicy, verifyPin } from "@/src/security/pin";
import { SecurityGate } from "@/app/security-gate";

vi.mock("@/src/security/pin", () => ({
  hasPin: vi.fn(),
  pinSecurityNotice: "O PIN bloqueia a interface local. Ele não substitui a proteção do dispositivo nem cifra automaticamente todos os dados.",
  setPin: vi.fn(),
  validatePinPolicy: vi.fn(() => []),
  verifyPin: vi.fn(),
}));

const mockHasPin = vi.mocked(hasPin);
const mockSetPin = vi.mocked(setPin);
const mockValidatePinPolicy = vi.mocked(validatePinPolicy);
const mockVerifyPin = vi.mocked(verifyPin);

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
  mockSetPin.mockResolvedValue(undefined);
  mockValidatePinPolicy.mockReturnValue([]);
  mockVerifyPin.mockResolvedValue(true);
});

describe("tela de proteção local", () => {
  it("apresenta uma orientação de configuração sem mensagens do Marco 1", async () => {
    mockHasPin.mockResolvedValue(false);
    render(<SecurityGate>Conteúdo local</SecurityGate>);

    expect(await screen.findByRole("heading", { name: "Crie um PIN para este dispositivo" })).toBeInTheDocument();
    expect(screen.getByText(/O PIN protege o acesso ao Mapa neste aparelho/)).toBeInTheDocument();
    expect(screen.getByText(pinSecurityNotice)).toBeInTheDocument();
    // a linha "Escolha um PIN..." repetia o titulo e a descricao: foi removida
    expect(screen.queryByText(/Escolha um PIN para configurar/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Marco 1/i)).not.toBeInTheDocument();
  });

  it("mostra o estado protegido após encontrar um PIN já configurado", async () => {
    mockHasPin.mockResolvedValue(true);
    render(<SecurityGate>Conteúdo local</SecurityGate>);

    expect(await screen.findByRole("heading", { name: "Mapa protegido" })).toBeInTheDocument();
    expect(screen.getByText(/A proteção local está ativa neste aparelho/)).toBeInTheDocument();
    // A linha fixa que repetia "proteção local ativa" foi removida: o que a pessoa precisa
    // ver aqui e o campo do PIN, nao uma frase que repete o titulo.
    expect(screen.getByLabelText(/PIN de 6 a 12/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.queryByText(/Verificando a proteção local/)).not.toBeInTheDocument();
    expect(screen.queryByText(pinSecurityNotice)).not.toBeInTheDocument();
    expect(screen.queryByText(/Marco 1/i)).not.toBeInTheDocument();
  });

  it("mascara o PIN, conta os dígitos e só libera o botão quando dá", async () => {
    mockHasPin.mockResolvedValue(true);
    render(<SecurityGate>Conteúdo local</SecurityGate>);
    const campo = await screen.findByLabelText(/PIN de 6 a 12/);
    const entrar = screen.getByRole("button", { name: "Entrar" });

    // Dígito não digitado não vaza na tela.
    expect(campo).toHaveAttribute("type", "password");
    expect(entrar).toBeDisabled();

    fireEvent.change(campo, { target: { value: "12345" } });
    expect(entrar).toBeDisabled();
    expect(screen.getByText("5/12")).toBeInTheDocument();

    fireEvent.change(campo, { target: { value: "123456" } });
    expect(entrar).toBeEnabled();
  });

  it("recusa PIN curto com mensagem de erro e não entra", async () => {
    mockHasPin.mockResolvedValue(true);
    mockVerifyPin.mockResolvedValue(false);
    render(<SecurityGate>Conteúdo local</SecurityGate>);
    const campo = await screen.findByLabelText(/PIN de 6 a 12/);
    fireEvent.change(campo, { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    const erro = await screen.findByRole("alert");
    expect(erro).toHaveTextContent(/PIN incorreto/);
    expect(campo).toHaveAttribute("aria-invalid", "true");
    // O campo é limpo para a pessoa tentar de novo sem apagar à mão.
    expect(campo).toHaveValue("");
    expect(screen.queryByText("Conteúdo local")).not.toBeInTheDocument();
  });
});
