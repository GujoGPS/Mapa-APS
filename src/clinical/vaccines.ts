/**
 * Calendário Nacional de Vacinação 2026 — referência informativa.
 *
 * Nada aqui é dado de pessoa: não vira CareFact, não é gravável e não entra em backup.
 * A marcação de "riscado" é estado efêmero de tela: vive no componente enquanto ele está montado.
 */

export interface VacinaItem {
  id: string;
  idade: string;
  vacina: string;
  doses?: string;
  obs?: string;
}

export interface FaixaVacinal {
  id: string;
  titulo: string;
  faixa: string;
  itens: VacinaItem[];
}

export const VACINAS: FaixaVacinal[] = [
  {
    id: "crianca",
    titulo: "Criança",
    faixa: "0 a 9 anos, 11 meses e 29 dias",
    itens: [
      { id: "c-bcg", idade: "Ao nascer", vacina: "BCG", doses: "dose única", obs: "Protege contra formas graves de tuberculose, com efeito protetor contra hanseníase." },
      { id: "c-hepb-nascimento", idade: "Ao nascer", vacina: "Hepatite B", doses: "1 dose" },
      { id: "c-penta-1", idade: "2 meses", vacina: "Penta (DTP + Hib + HB)", doses: "1ª dose" },
      { id: "c-vip-1", idade: "2 meses", vacina: "Poliomielite inativada (VIP)", doses: "1ª dose" },
      { id: "c-pneumo20-1", idade: "2 meses", vacina: "Pneumocócica 20-valente", doses: "1ª dose" },
      { id: "c-rota-1", idade: "2 meses", vacina: "Rotavírus humano", doses: "1ª dose" },
      { id: "c-meningo-c-1", idade: "3 meses", vacina: "Meningocócica C", doses: "1ª dose" },
      { id: "c-penta-2", idade: "4 meses", vacina: "Penta (DTP + Hib + HB)", doses: "2ª dose" },
      { id: "c-vip-2", idade: "4 meses", vacina: "Poliomielite inativada (VIP)", doses: "2ª dose" },
      { id: "c-pneumo10-2", idade: "4 meses", vacina: "Pneumocócica 10-valente", doses: "2ª dose", obs: "Transição de estoque." },
      { id: "c-rota-2", idade: "4 meses", vacina: "Rotavírus humano", doses: "2ª dose" },
      { id: "c-meningo-c-2", idade: "5 meses", vacina: "Meningocócica C", doses: "2ª dose" },
      { id: "c-penta-3", idade: "6 meses", vacina: "Penta (DTP + Hib + HB)", doses: "3ª dose" },
      { id: "c-vip-3", idade: "6 meses", vacina: "Poliomielite inativada (VIP)", doses: "3ª dose" },
      { id: "c-covid-1", idade: "6 meses", vacina: "COVID-19", doses: "1ª dose", obs: "Esquema pediátrico: intervalo de 4 semanas para a 2ª dose." },
      { id: "c-covid-2", idade: "7 meses", vacina: "COVID-19", doses: "2ª dose", obs: "Intervalo de 8 semanas após a 1ª dose para a 3ª. Quem não iniciou ou não completou até os 9 meses pode vacinar até 4 anos 11 meses e 29 dias, conforme histórico vacinal." },
      { id: "c-covid-3", idade: "9 meses", vacina: "COVID-19", doses: "3ª dose" },
      { id: "c-influenza-infantil", idade: "A cada temporada", vacina: "Influenza", doses: "conforme recomendação vigente" },
      { id: "c-febre-amarela-1", idade: "9 meses", vacina: "Febre amarela", doses: "1 dose" },
      { id: "c-triviral-1", idade: "12 meses", vacina: "Tríplice viral (SCR)", doses: "1ª dose" },
      { id: "c-pneumo20-reforco", idade: "12 meses", vacina: "Pneumocócica 20-valente", doses: "reforço" },
      { id: "c-meningo-acwy-reforco", idade: "12 meses", vacina: "Meningocócica ACWY", doses: "reforço" },
      { id: "c-tetra-ou-triviral-2", idade: "15 meses", vacina: "Tríplice viral ou Tetraviral", doses: "2ª dose" },
      { id: "c-varicela-1", idade: "15 meses", vacina: "Varicela", doses: "1ª dose" },
      { id: "c-dtp-r1", idade: "15 meses", vacina: "DTP", doses: "1º reforço" },
      { id: "c-vip-r1", idade: "15 meses", vacina: "Poliomielite inativada (VIP)", doses: "1º reforço" },
      { id: "c-hepa-1", idade: "15 meses", vacina: "Hepatite A", doses: "1 dose" },
      { id: "c-dtp-r2", idade: "4 anos", vacina: "DTP", doses: "2º reforço" },
      { id: "c-vip-r2", idade: "4 anos", vacina: "Poliomielite inativada (VIP)", doses: "2º reforço" },
      { id: "c-varicela-r", idade: "4 anos", vacina: "Varicela", doses: "reforço" },
      { id: "c-febre-amarela-r", idade: "4 anos", vacina: "Febre amarela", doses: "reforço" },
    ],
  },
  {
    id: "adolescente",
    titulo: "Adolescente e jovem",
    faixa: "10 a 24 anos, 11 meses e 29 dias",
    itens: [
      { id: "a-hpv", idade: "Conforme histórico vacinal", vacina: "HPV4", doses: "1 dose", obs: "Depende do cartão de vacina da pessoa." },
      { id: "a-hepb", idade: "Conforme histórico vacinal", vacina: "Hepatite B", doses: "3 doses", obs: "Depende do cartão de vacina da pessoa." },
      { id: "a-febre-amarela", idade: "Conforme histórico vacinal", vacina: "Febre amarela", doses: "1 dose", obs: "Depende do cartão de vacina da pessoa. Manter situação vacinal atualizada, sobretudo para viajantes de áreas com circulação viral." },
      { id: "a-triviral", idade: "Conforme histórico vacinal", vacina: "Tríplice viral (SCR)", doses: "2 doses", obs: "Depende do cartão de vacina da pessoa." },
      { id: "a-varicela", idade: "Conforme histórico vacinal", vacina: "Varicela", doses: "2 doses", obs: "Depende do cartão de vacina da pessoa. Restrito a trabalhadores da saúde e povos indígenas sem história da doença ou na dúvida." },
      { id: "a-pneumo20", idade: "Conforme histórico vacinal", vacina: "Pneumocócica 20-valente", doses: "1 dose", obs: "Depende do cartão de vacina da pessoa. Restrito a povos indígenas sem histórico vacinal com pneumocócica conjugada." },
      { id: "a-dengue", idade: "10 anos", vacina: "Dengue tetravalente (DNG4)", doses: "2 doses", obs: "Usar um só laboratório nas duas doses." },
      { id: "a-meningo-acwy", idade: "11 anos", vacina: "Meningocócica ACWY", doses: "1 dose" },
      { id: "a-dt-3", idade: "14 anos", vacina: "dT", doses: "3ª dose de reforço" },
      { id: "a-dt-4", idade: "24 anos", vacina: "dT", doses: "4ª dose de reforço" },
    ],
  },
  {
    id: "adulto",
    titulo: "Adulto",
    faixa: "25 a 59 anos",
    itens: [
      { id: "ad-hepb", idade: "Conforme histórico vacinal", vacina: "Hepatite B", doses: "3 doses", obs: "Depende do cartão de vacina da pessoa." },
      { id: "ad-dt", idade: "A cada 10 anos", vacina: "dT", doses: "reforço periódico", obs: "Reduzir para 5 anos em exposição a risco de ferimento grave." },
      { id: "ad-febre-amarela", idade: "Casos excepcionais", vacina: "Febre amarela", doses: "1 dose", obs: "Indicada conforme avaliação de risco e histórico vacinal." },
      { id: "ad-triviral", idade: "Conforme histórico vacinal", vacina: "Tríplice viral (SCR)", doses: "conforme histórico", obs: "Depende do cartão de vacina da pessoa." },
      { id: "ad-varicela", idade: "Grupo específico", vacina: "Varicela", doses: "2 doses", obs: "Restrito a trabalhadores da saúde e povos indígenas sem história da doença ou na dúvida." },
      { id: "ad-pneumo20", idade: "Grupo específico", vacina: "Pneumocócica 20-valente", doses: "1 dose", obs: "Restrito aos grupos com indicação específica definida pela fonte." },
    ],
  },
  {
    id: "idoso",
    titulo: "Idoso",
    faixa: "a partir de 60 anos",
    itens: [
      { id: "i-hepb", idade: "Conforme histórico vacinal", vacina: "Hepatite B", doses: "3 doses", obs: "Depende do cartão de vacina da pessoa." },
      { id: "i-dt", idade: "Conforme histórico vacinal", vacina: "dT", doses: "3 doses + reforços periódicos", obs: "Reduzir o intervalo para 5 anos em exposição a risco de ferimento grave." },
      { id: "i-febre-amarela", idade: "Casos excepcionais", vacina: "Febre amarela", doses: "1 dose", obs: "Indicada conforme avaliação de risco e histórico vacinal." },
      { id: "i-triviral", idade: "Conforme histórico vacinal", vacina: "Tríplice viral (SCR)", doses: "2 doses", obs: "Restrito a trabalhador da saúde com atuação profissional; avaliar e atualizar a situação vacinal." },
      { id: "i-varicela", idade: "Grupo específico", vacina: "Varicela", doses: "2 doses", obs: "Restrito a trabalhadores da saúde e povos indígenas sem história da doença ou na dúvida." },
      { id: "i-pneumo20", idade: "Grupo específico", vacina: "Pneumocócica 20-valente", doses: "1 dose", obs: "Restrito a não vacinados que vivem acamados e/ou institucionalizados, e povos indígenas sem histórico vacinal." },
      { id: "i-influenza", idade: "A cada temporada", vacina: "Influenza trivalente", doses: "1 dose anual" },
      { id: "i-covid", idade: "Semestral", vacina: "COVID-19", doses: "1 dose semestral" },
    ],
  },
];
