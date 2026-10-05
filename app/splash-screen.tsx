"use client";

/**
 * Abertura do app.
 *
 * A logo é a imagem da marca; o pulso das conexões é desenhado por cima em CSS, alinhado ao nó
 * central e aos arcos da ilustração. Nada aqui é imagem nova: é a mesma marca com vida.
 * Quem prefere menos movimento vê a logo estática, sem perder informação.
 */
export function SplashScreen({ message = "Carregando o dispositivo" }: { message?: string }) {
  return <main className="splash" role="status" aria-live="polite">
    <div className="splash-mark">
      <img src="/brand/mapa-logo.png" alt="" className="splash-image" width={1024} height={1024} />

      <span className="splash-pulse splash-pulse-node" aria-hidden="true" />
      <span className="splash-pulse splash-pulse-arc splash-pulse-arc-1" aria-hidden="true" />
      <span className="splash-pulse splash-pulse-arc splash-pulse-arc-2" aria-hidden="true" />
      <span className="splash-pulse splash-pulse-arc splash-pulse-arc-3" aria-hidden="true" />
      <span className="splash-pulse splash-pulse-halo" aria-hidden="true" />
    </div>

    <p className="splash-message">{message}…</p>
  </main>;
}
