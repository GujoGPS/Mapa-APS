import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const fonte = await readFile("app/workspace.tsx", "utf8");
const css = await readFile("app/styles.css", "utf8");

/**
 * Trava a decisão de produto: no cabeçalho, o título da aba vem primeiro e a marca depois.
 * Sem este teste, voltar a colocar a marca na esquerda é uma edição de uma linha que passa
 * despercebida — e é exatamente o tipo de coisa que ninguém revisaria num PR de outra coisa.
 */
describe("hierarquia do cabeçalho", () => {
  it("o titulo da aba aparece antes da marca no markup", () => {
    const titulo = fonte.indexOf("app-header-titulo");
    const marca = fonte.indexOf("app-header-marca");
    expect(titulo).toBeGreaterThan(-1);
    expect(marca).toBeGreaterThan(-1);
    expect(titulo).toBeLessThan(marca);
  });

  it("a marca é secundaria: wordmark pequeno, logo reduzida", () => {
    expect(css).toMatch(/\.app-header-titulo\s*\{[^}]*font-size:\s*var\(--t-2g\)/);
    expect(css).toMatch(/\.app-header-logo\s*\{[^}]*width:\s*1\.6rem/);
  });

  it("o titulo continua sendo o unico h1 do cabecalho", () => {
    const cabecalho = fonte.slice(fonte.indexOf("<header className=\"app-header\">"), fonte.indexOf("</header>"));
    expect((cabecalho.match(/<h1/g) ?? []).length).toBe(1);
  });
});
