# Critérios de Aceitação

## Fundação

- [ ] Instalar como PWA.
- [ ] Operar offline após instalação.
- [ ] Confirmar salvamento no IndexedDB.
- [ ] Solicitar armazenamento persistente quando suportado.
- [ ] Detectar múltiplas abas editando o mesmo registro.
- [ ] Atualizar sem interromper edição.
- [ ] Separar demonstração e produção.

## Pessoas e famílias

- [ ] Pessoa pode integrar múltiplas famílias.
- [ ] Pessoa pode residir em múltiplos domicílios ao longo do tempo.
- [ ] Quantidade esperada de famílias não limita cadastro ou substituição.
- [ ] Relações aceitam perspectivas divergentes.
- [ ] Informação de terceiro permanece bloqueada por padrão.

## Clínica

- [ ] Termo relatado pode ser salvo sem normalização.
- [ ] Resultado sem unidade é preservado e não interpretado.
- [ ] Resultados compatíveis podem ser comparados.
- [ ] Resultados incompatíveis não entram no mesmo gráfico.
- [ ] Interpretação histórica preserva versão.
- [ ] Marcadores contextuais aparecem sem causalidade automática.

## Instrumento local da ESF

- [ ] Definição da página 28 é tipada, versionada e possui proveniência.
- [ ] Aplicações futuras exigem `familyId` e `personId`, com `personId` como sujeito clínico.
- [ ] Blocos ausentes permanecem placeholders sem perguntas inventadas.
- [ ] Idade, IMC, média de PA e circunferência local têm cálculos puros testados.
- [ ] Controle da PA, risco cardiovascular, HbA1c e CIAP-2 permanecem manuais.
- [ ] Propostas de atualização familiar/ecomapa exigem revisão e não atualizam o domínio automaticamente.
- [ ] Avaliações aparecem dentro da família, com seleção explícita de pessoa e histórico isolado por `personId`.
- [ ] A visão familiar de avaliações mostra somente status, datas e quantidade, nunca respostas clínicas.
- [ ] A interface de avaliações mostra progresso por bloco, revisão estrutural sem narrativa clínica e confirma alterações não salvas antes de sair.
- [ ] Pressão arterial mantém sistólica, diastólica e data por visita; circunferência exige critério local explícito e só então mostra classificação calculada.
- [ ] Blocos sem fonte não entram no denominador dos campos disponíveis e o bloco 8 não cria campos clínicos.
- [ ] Rascunhos, revisão, conclusão, arquivamento e retificação preservam o original.
- [ ] Blocos sem fonte aparecem como indisponíveis, sem perguntas inventadas.

## Farmacologia

- [ ] Medicamento desconhecido pode ser registrado.
- [ ] Uso real e receita são separados.
- [ ] Dose sem unidade não é publicada.
- [ ] Regime exige indicação, população, via e apresentação.
- [ ] Duplicidade estrutural é detectável quando os medicamentos estão identificados.
- [ ] A interface declara que ausência de alerta não exclui interação.

## Compartilhamento

- [ ] Modo acompanhamento isola a navegação.
- [ ] Saída exige autenticação.
- [ ] Notas privadas não aparecem.
- [ ] Informações de terceiro não aparecem.
- [ ] A pessoa pode sugerir correção sem editar diretamente.
- [ ] Itens mostrados ficam registrados.

## Jornada

- [ ] Semestre aceita número esperado de famílias sem limite rígido.
- [ ] Família pode ser substituída sem apagar a anterior.
- [ ] Semestre mostra trajetórias e não pontuação.
- [ ] Encerramento aceita processos inconclusos com destino explícito.
- [ ] Snapshot não muda com registros futuros.
- [ ] Adendo não altera o original.

## Backup

- [ ] Arquivo é validado antes de restaurar.
- [ ] Checksum detecta corrupção.
- [ ] Migração ocorre em área temporária.
- [ ] Relações órfãs são detectadas.
- [ ] Visibilidade, layouts, snapshots e versões são preservados.
- [ ] Backup protegido explica impossibilidade de recuperação sem senha.
