import { readdir, readFile } from "node:fs/promises";

const dir = "src/data/synthetic";
const files = (await readdir(dir)).filter((name) => name.endsWith(".json"));
if (files.length === 0) throw new Error("Nenhum conjunto sintético encontrado.");

for (const file of files) {
  const data = JSON.parse(await readFile(`${dir}/${file}`, "utf8"));
  if (data.synthetic !== true) {
    throw new Error(`${file} não declara synthetic=true.`);
  }
}
console.log(`[ok] ${files.length} arquivo(s) sintético(s) verificado(s)`);
