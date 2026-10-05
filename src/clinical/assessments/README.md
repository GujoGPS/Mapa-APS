# Avaliação de Saúde e DCNT do Adulto — ESF

Esta fundação tipada representa a página 28 do instrumento local utilizado pela ESF da preceptora do projeto. A definição é `adult-dcnt-esf`, versão `local-esf-2026-page-28-v1`, com origem local e estado editorial de rascunho para validação da preceptora.

Cada aplicação futura pertence a uma pessoa (`personId`) e usa `familyId` apenas como contexto familiar. A mesma definição pode ter aplicações independentes e longitudinais para várias pessoas da mesma família. A resposta estruturada será a fonte canônica das futuras projeções clínica/acadêmica e da pessoa; esta entrega não cria telas, persistência ou narrativas.

Estão representados os blocos 1, 2, 6, 7 e 8. Os blocos 3, 4 e 5 são placeholders estruturais sem perguntas e o bloco 8 permanece somente com capacidades futuras, pois a fonte mostra apenas seu título. IMC, idade/faixa etária, média de duas aferições de PA e circunferência conforme critério local são as únicas derivações implementadas. Controle da PA, risco cardiovascular, HbA1c, CIAP-2 e encaminhamentos continuam manuais ou pendentes de fonte.

As ambiguidades da ficha são preservadas no contrato. Novas páginas devem gerar uma nova versão imutável, adicionar perguntas com IDs estáveis e manter proveniência e decisões de revisão; não se deve mutar silenciosamente uma definição usada por aplicações anteriores. A definição não substitui decisão clínica, prontuário institucional ou validação da preceptora.
