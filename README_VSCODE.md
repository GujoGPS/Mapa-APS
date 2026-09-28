# Mapa no VS Code

## Abrir e rodar o código-fonte

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Executar o build Next.js na sua máquina

```bash
npm run verify
npm run build
npm run start
```

## Abrir o build de produção já incluído

```bash
python -m http.server 4173 -d dist-production
```

Abra `http://localhost:4173`. Não abra `index.html` diretamente, pois IndexedDB, Service Worker e CSP exigem origem HTTP.

## Comandos de auditoria

```bash
npm run audit:internal
npm run audit:wave-b
npm run audit:wave-c
npm run audit:wave-d
```

## Estado

O build estático de produção foi minificado e empacotado com React/ReactDOM, contendo 53 módulos. O pipeline Next.js oficial deve ser reexecutado depois de `npm install`, porque o ambiente que produziu este pacote não possuía acesso ao registro npm.

## Correcoes de runtime local

Esta entrega inclui CSP condicional para desenvolvimento e `suppressHydrationWarning` no `body` para atributos injetados por extensoes. Depois de extrair em uma pasta nova:

```bash
npm install
npm run dev
```

Se estiver substituindo uma copia anterior, remova a pasta `.next` antes de iniciar.
