## D-020: Fatos derivados, não prontuário

**Decisão:** respostas da ficha geram fatos versionados com proveniência e visibilidade própria; nada
é gravado como resposta derivada e nada vira classificação clínica sem regra na fonte.  
**Estado:** aceito (ADR 0019).

## D-021: Serviços da ficha são propostas

**Decisão:** serviço marcado na avaliação vira proposta pendente; ecomapa só muda por decisão humana
com texto compartilhável, sempre preservando a aplicação de origem.  
**Estado:** aceito (ADR 0021).

## D-022: Demonstração é sessão isolada

**Decisão:** entrar na demonstração guarda um snapshot do estado normal e marca tudo que é criado como
sintético; sair restaura o snapshot. O backup normal exclui sintéticos por padrão.  
**Estado:** aceito (ADR 0018).

# Registro de Decisões

## D-001: Nome conceitual

**Decisão:** Mapa, com assinatura “Clínica, família e território”.  
**Estado:** aprovado conceitualmente; validação de marca ocorre antes da publicação pública ampla.

## D-002: Local-first

**Decisão:** dados pessoais permanecem no dispositivo; sem conta e nuvem na primeira versão.

## D-003: IA

**Decisão:** nenhuma IA embarcada ou API. Uso por prompts manuais e desidentificados.

## D-004: Não prontuário

**Decisão:** o produto é resumo pessoal de acompanhamento e ferramenta acadêmica. O prontuário oficial permanece na UBS.

## D-005: Persistência

**Decisão:** IndexedDB com confirmação de gravação, armazenamento persistente quando concedido e backup validável.

## D-006: Família

**Decisão:** pessoa-família é muitos-para-muitos; família e domicílio são separados.

## D-007: Quantidade de famílias

**Decisão:** o semestre registra quantidade esperada, não limite. Substituições são naturais quando uma família recusa ou sai do acompanhamento.

## D-008: História

**Decisão:** alterações preservam trajetória; snapshots congelam o encerramento.

## D-009: Clínica

**Decisão:** dados brutos, referência, meta, risco e interpretação são distintos.

## D-010: Farmacologia

**Decisão:** princípio ativo, apresentação, regime e uso real são entidades distintas; auditoria é obrigatória.

## D-011: Interações

**Decisão:** primeira versão não é checador universal; cobre interações curadas e duplicidades estruturais.

## D-012: Compartilhamento

**Decisão:** resumo é deliberadamente preparado; informação de terceiro fica bloqueada.

## D-013: Adolescente

**Decisão:** bloqueio conservador por padrão, destinatário explícito e nenhuma automatização de acesso por responsáveis.

## D-014: Jornada

**Decisão:** espaço longitudinal de duas famílias esperadas, sem pontuação ou produtividade. Contagens servem à navegação e memória.

## D-015: Ecomapa

**Decisão:** gerador local determinístico e editável; IA externa opcional por prompt com manifesto.

## D-016: Genograma

**Decisão:** camadas estrutural, domiciliar, clínica e funcional.

## D-017: Backup

**Decisão:** backups protegido e comum coexistem; não há recuperação secreta de senha.

## D-018: Estados antes abertos

**Decisão:** ficam fechados com padrões conservadores documentados. Dependências externas, como protocolo institucional e disponibilidade de marca, não são indefinição arquitetural; são gates de validação antes do uso correspondente.
