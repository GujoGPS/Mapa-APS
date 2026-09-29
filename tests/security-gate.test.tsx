import { cleanup, render, screen, waitFor } from "@testing-library/react";
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
    expect(screen.getByText("Defina um PIN para proteger o acesso ao Mapa neste dispositivo.")).toBeInTheDocument();
    expect(screen.getByText(pinSecurityNotice)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Escolha um PIN para configurar a proteção local.");
    expect(screen.queryByText(/Marco 1/i)).not.toBeInTheDocument();
  });

  it("mostra o estado protegido após encontrar um PIN já configurado", async () => {
    mockHasPin.mockResolvedValue(true);
    render(<SecurityGate>Conteúdo local</SecurityGate>);

    expect(await screen.findByRole("heading", { name: "Mapa protegido" })).toBeInTheDocument();
    expect(screen.getByText("A proteção local está ativa neste dispositivo. Digite seu PIN para continuar.")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Proteção local ativa neste dispositivo."));
    expect(screen.queryByText("Verificando proteção local...")).not.toBeInTheDocument();
    expect(screen.queryByText(pinSecurityNotice)).not.toBeInTheDocument();
    expect(screen.queryByText(/Marco 1/i)).not.toBeInTheDocument();
  });
});
