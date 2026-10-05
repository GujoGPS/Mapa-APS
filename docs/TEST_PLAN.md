# Plano de Testes

## Estratégia

- testes unitários para regras puras;
- testes de contrato para conteúdos estruturados;
- testes de integração para IndexedDB;
- testes end-to-end mobile;
- testes de migração;
- testes de recuperação;
- testes de acessibilidade;
- testes clínicos com casos sintéticos;
- revisão manual de privacidade.

## Cenários prioritários

### Persistência

- fechar durante edição;
- armazenamento persistente negado;
- banco próximo do limite;
- atualização com rascunho aberto;
- duas abas;
- backup corrompido;
- restauração de versão antiga.

### Clínica

- resultado normal isolado;
- alteração discreta;
- mudança relativa relevante;
- unidade ausente;
- método incompatível;
- diretriz atualizada;
- população não coberta;
- dados insuficientes.

### Instrumento ESF

- completude de perguntas, opções, IDs, dependências e proveniência;
- isolamento de aplicações por pessoa dentro do contexto familiar;
- condicionais com estado não aplicável;
- idade, IMC, média de pressão e circunferência local;
- classificações manuais sem cálculo automático;
- propostas de família/ecomapa sem atualização automática;
- políticas conservadoras para projeção clínica, da pessoa e familiar.
- interface de avaliações dentro da família;
- troca de integrante sem vazamento de respostas;
- renderer derivado da definição, blocos ausentes e condicionais;
- retomada de rascunho, revisão, conclusão e retificação pela interface.
- renderização dedicada dos tipos de resposta usados pelo instrumento, incluindo pressão por visita e medidas de cintura;
- respostas condicionais preservadas como não aplicáveis, progresso por bloco e revisão estrutural;
- estados salvo/alterado/salvando/erro, confirmação de saída, acessibilidade estrutural e demonstração pela interface;
- roteiro manual responsivo em desktop, tablet e celular: verificar ausência de overflow horizontal, PA legível, opções longas quebrando linha, histórico em uma coluna e revisão estrutural utilizável.
- roteiro obrigatório da interface de avaliações:
  - desktop (>= 1024px): selecionar pessoa, abrir histórico, alternar blocos, revisar PA e exame dos pés, abrir revisão estrutural e provocar o diálogo de alterações não salvas; confirmar ausência de overflow;
  - tablet (768–1023px): repetir o fluxo verificando quebra de opções longas, histórico e cards de bloco sem sobreposição;
  - celular (< 768px): repetir o fluxo verificando uma coluna, PA e exame dos pés legíveis, diálogo acessível, revisão estrutural rolável e ausência de overflow horizontal.
- criação e persistência de aplicações por pessoa;
- isolamento entre pessoas da mesma família;
- respostas tipadas, estados e bloqueio de sobrescrita;
- retificação imutável e longitudinalidade;
- migração idempotente e checksums de aplicações no backup;
- aplicações sintéticas identificáveis e excluídas do backup normal.

### Farmacologia

- medicamento desconhecido;
- associação contendo princípio já usado;
- dose com unidade errada;
- apresentação incompatível;
- função renal desconhecida;
- interação curada;
- ausência de cobertura.

### Família

- pessoa em duas famílias;
- dois domicílios;
- cuidador não consanguíneo;
- vínculo rompido;
- perspectiva divergente;
- informação de terceiro;
- adolescente;
- família substituída no semestre.

### Compartilhamento

- voltar por gesto;
- alternar aplicativo;
- inatividade;
- sugestão da pessoa;
- item retirado do compartilhamento;
- conteúdo interpretativo pendente.

## Acessibilidade

- leitor de tela;
- fonte ampliada;
- alto contraste;
- redução de movimento;
- navegação sem gestos;
- descrição textual de diagramas;
- uso com uma mão.
