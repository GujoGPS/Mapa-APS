<div align="center">

<img src="public/brand/mapa-logo.png" alt="Mapa — Pessoas, Território, Cuidado" width="260" />

# Mapa

**Clínica, família e território**

Ferramenta local de apoio ao estudo, à organização longitudinal do cuidado familiar e à
comunicação clínica supervisionada na Atenção Primária à Saúde.

Feito para uma Reality: **celular, uma mão só, em pé, na visita domiciliar, com o paciente
na frente.** Por isso o alvo de toque nunca é menor que 44 px, o contraste nunca fica abaixo
de AA e nenhuma informação depende só de cor.

</div>

> **Escopo.** O Mapa é uma ferramenta acadêmica e pessoal. **Não substitui prontuário
> institucional, julgamento clínico, protocolos locais, prescrição profissional, receitas ou
> laudos.** Uso real depende das regras da instituição, da preceptoria, da unidade e do
> prontuário oficial.

---

## Começando

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>. O app instala um **PIN local** no primeiro uso: ele é gravado
apenas neste aparelho e nunca sai daqui.

Requer **Node.js 22+** e **npm 11+**.

---

## As cinco telas

| Tela | Para quê |
|---|---|
| **Início** | Panorama da jornada, atalhos e linha do tempo dos encontros |
| **Clínica** | Condições, medicamentos, exames, calendário de vacinação e as fontes de cada conteúdo |
| **Cuidado** | Ações, ficha ESF, vínculos familiares, genograma e ecomapa |
| **UBS** | Serviços ofertados, grupos e como agendar — referência estática |
| **Mais** | Jornada, histórico, prompts de IA, modo demonstração e estado do aparelho |

---

## O que o app faz

### Cuidado longitudinal

- Semestres com famílias vinculadas, encontros e pendências
- Genograma e ecomapa desenhados com **React Flow**, por perspectiva e por camada
- Vínculos familiares com **qualidade da relação e recursos externos**, editáveis e com trilha de auditoria
- **Modo de demonstração** com três famílias complexas, isolado dos seus dados reais

### Ficha ESF do adulto com DCNT

Instrumento digitalizado da página 28 do formulário local da ESF, com provenance em cada campo.

- **6 blocos preenchíveis** — identificação, perfil sociodemográfico, condições e rastreamentos,
  exame físico e avaliação paramétrica, avaliação dos pés, síntese e encaminhamentos (CIAP-2)
- Bloco de **genograma, ecomapa e observações** remete para a aba Cuidado, onde já é registrado
- **Fatos clínicos derivados** e versionados, com proveniência e revisão humana
- **Retificação** encadeada: corrigir uma avaliação cria uma nova versão, sem apagar a anterior
- Serviços marcados viram **propostas** — nenhum vínculo do ecomapa nasce sem decisão humana
- Salvamento automático com debounce e estado visível

### Biblioteca clínica

- Condições, exames, caderno farmacológico autoral e **calendário nacional de vacinação** por faixa etária
- Busca por nome, sinônimo, classe terapêutica e nome comercial
- Cada conteúdo aponta para a **fonte** de onde veio

### Comunicação clínica supervisionada

- Montador de **prompt para IA externa** com sanitização por padrão
- Identificadores saem: entram o código da família, o da pessoa e a idade
- O que foi **retirado por privacidade** e o que é **lacuna de preenchimento** são separados e explicados

### Privacidade e dados

- **PIN local** com bloqueio por inatividade e ao esconder a aba
- Persistência no navegador, com solicitação de **armazenamento persistente**
- **Backup protegido com AES-GCM**, checksum e restauração atômica
- **Modo demonstração isolado**: guarda o estado normal, semeia casos sintéticos separados e
  devolve tudo ao sair — inclusive rascunhos e eventos
- A tela de revisão do prompt mostra **exatamente o que sai** antes de qualquer cópia

---

## Interface

O sistema visual tem **um tema só**, escuro, extraído por amostragem da própria marca.

| Papel | Cor | Vem de |
|---|---|---|
| Noite | `#081028` | o céu da ilustração |
| Texto | `#f4e4d0` | a cor do "Mapa" na marca |
| Luz | `#f0e4a2` | as janelas acesas |
| Seguro | `#8ac6b4` | a copa das árvores |
| Conexão | `#5a9ce4` | o arco entre as casas |
| Erro | `#de735e` | derivado da família quente, 41° longe do dourado |

**O dourado é luz, não decoração.** Aparece só em aba ativa, item selecionado e campo em foco —
sempre acompanhado de **forma** (linha de 2 px, barra lateral, anel), porque sob sol forte a cor
sozinha não separa estado. O botão primário é creme, nunca dourado.

Toda animação respeita `prefers-reduced-motion`.

---

## Verificação

```bash
npm run verify   # docs, dados sintéticos, marcos 1-7, auditoria estática, tipos, lint e testes
npm run build    # build de produção
```

| Verificação | Estado |
|---|---|
| TypeScript | ✅ sem erros |
| ESLint | ✅ sem avisos |
| Testes | ✅ **308** em 51 arquivos |
| Build de produção | ✅ |
| Documentação canônica | ✅ 10 blocos |

A CI roda `verify` + `build` em cada push e pull request para `main`.

---

## Estrutura

```text
app/        App Router, telas e componentes        26 arquivos
src/        domínio, contratos eClinical        71 arquivos
tests/      308 testes                            52 arquivos
scripts/    verificação e auditoria                21 arquivos
docs/       77 documentos, incluindo 25 ADRs
```

O domínio não depende da interface: as telas leem de casos de uso e escrevem por comandos, e
tudo que é clínico tem teste de comportamento.

---

## Segurança e privacidade

- **Nunca** publique bancos locais, backups ou dados identificáveis neste repositório
- **Nunca** registre dados pessoais em issues, logs, fixtures ou testes
- Não use previews públicos para conteúdo identificável
- Mantenha o aparelho protegido por senha, PIN ou biometria
- Trate o Mapa como **complementar**, nunca como substituto do sistema institucional

Veja também [`SECURITY.md`](SECURITY.md), [`CONTRIBUTING.md`](CONTRIBUTING.md) e
`docs/release/GO_LOCAL.md`.

---

## Dados sintéticos

Três cenários de família complexa, com conteúdo clínico, rede de recursos externos e cadeia de
retificação. Servem para demonstração, regressão, desenvolvimento e teste de backup.

Eles existem para **demonstrar capacidades do app** — não para parecer registro real. Nomes,
bairros e profissões são genéricos de propósito.

---

## Licença e autoria

Projeto acadêmico autoral. A definição de licença, distribuição e colaboração deve ser feita
explicitamente antes de qualquer reutilização por terceiros.
