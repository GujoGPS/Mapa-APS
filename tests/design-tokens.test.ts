import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const css = await readFile("app/styles.css", "utf8");

/**
 * Guarda de regressão do sistema visual.
 *
 * Existe porque os defeitos que a auditoria achou são silenciosos: ninguém vê um botão de 37px
 * quebrar nada, até alguém errar o toque no celular. Estes testes existem para travar as
 * decisões, não para descrever o CSS.
 */
describe("tokens do design system", () => {
  it("tem um tema só: sem bloco de cor por preferência do sistema", () => {
    expect(css).not.toMatch(/prefers-color-scheme:\s*dark/);
    expect(css).toMatch(/color-scheme:\s*dark/);
  });

  it("usa as cores extraídas da marca", () => {
    for (const cor of ["#081028", "#f4e4d0", "#f0e4a2", "#8ac6b4", "#5a9ce4", "#de735e"]) {
      expect(css).toContain(cor);
    }
  });

  it("não usa mais o verde-água do tema antigo", () => {
    expect(css).not.toContain("#78cfba");
  });

  it("tem as escalas de espaço, raio e tipografia", () => {
    for (const token of ["--e-1", "--e-8", "--r-1", "--r-cheio", "--t-micro", "--t-2g"]) {
      expect(css).toContain(token);
    }
  });

  it("declara o piso de alvo de toque", () => {
    expect(css).toMatch(/--toque:\s*44px/);
  });

  it("respeita prefers-reduced-motion", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(css).toMatch(/animation-duration:\s*\.001ms\s*!important/);
  });

  it("todo alvo interativo tem altura de pelo menos o piso de toque", () => {
    // height E min-height: uma aba com height: 2.4rem passa num teste que so olha min-height,
    // e continua sendo 39px no celular. Foi exatamente assim que a aba Clinica escapou.
    // O alvo precisa ser a TAG final do seletor: "a" sozinho casaria com qualquer classe
    // que tenha a letra no nome (.system-message, .aviso-glifo) e reprovar tudo por engano.
    const regra = /([^{}]+)\{([^}]*?(?:min-)?height:\s*([\d.]+)rem[^}]*)\}/g;
    const alvoFinal = (sel: string) => sel.split(/\s*[>+~,]\s*/).pop()?.trim() ?? "";
    const eAlvo = (sel: string) => {
      const alvo = alvoFinal(sel);
      return /^(a|button|summary|select)\b/.test(alvo) || /\[role=(tab|checkbox|switch)\]/.test(alvo);
    };
    const abaixo = [...css.matchAll(regra)]
      .filter((m) => eAlvo(m[1] ?? "") && Number(m[3] ?? 0) * 16 < 44)
      .map((m) => `${(m[1] ?? '').trim().slice(0, 40)} = ${m[3]}rem`);
    expect(abaixo).toEqual([]);
  });

  it("foco visivel definido globalmente", () => {
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:/);
  });
});
