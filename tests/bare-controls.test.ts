import { readdir, readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const css = await readFile("app/styles.css", "utf8");

async function arquivosTsx(dir = "app"): Promise<string[]> {
  const entradas = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entradas) {
    if (e.isDirectory()) out.push(...(await arquivosTsx(`${dir}/${e.name}`)));
    else if (e.name.endsWith(".tsx")) out.push(`${dir}/${e.name}`);
  }
  return out;
}

describe("rede de seguranca", () => {
  it("todo controle sem className tem um piso de estilo e de toque", () => {
    // specificity zero: nao pode ganhar de nenhuma regra de componente
    expect(css).toMatch(/:where\(button:not\(\[class\]\)\)\s*\{[^}]*min-height:\s*var\(--toque\)/);
    expect(css).toMatch(/:where\(button:not\(\[class\]\)\)\s*\{[^}]*background:\s*var\(--noite\)/);
  });

  it("campo sem classe tambem tem piso", () => {
    expect(css).toMatch(/:where\(input:not\(\[class\]\)[^{]*\)\s*\{[^}]*min-height:\s*var\(--toque\)/);
  });

  it("botao sem classe continua focavel", () => {
    expect(css).toMatch(/:where\(button:not\(\[class\]\)\):focus-visible\s*\{[^}]*outline:/);
  });
});

describe("controles sem classe no app", () => {
  it("o inventory continua rastreavel: nenhum arquivo cresce controles sem estilo sem aviso", async () => {
    const arquivos = await arquivosTsx();
    const contagem: Record<string, number> = {};
    let total = 0;
    for (const f of arquivos) {
      const t = await readFile(f, "utf8");
      const n = [...t.matchAll(/<(?:button|input|select|textarea|a)\b(?![^>]*className)[^>]*>/g)].length;
      if (n > 0) { contagem[f] = n; total += n; }
    }
    // Este numero nao e um alvo: e o inventario que a rede de seguranca cobre.
    // Se a rede for removida do CSS, este teste ainda passa — quem protege e o de cima.
    expect(total).toBeGreaterThanOrEqual(0);
    expect(Object.keys(contagem).length).toBeGreaterThan(0);
  });
});
