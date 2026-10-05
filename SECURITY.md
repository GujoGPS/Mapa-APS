# Política de Segurança

## Dados reais: leia isto antes de qualquer uso

O Mapa já **não é mais uma fundação de marco**. Ele tem ficha clínica, biblioteca farmacológica,
calendário de vacinação, genograma, ecomapa e comunicação com IA externa.

**Ainda assim, o uso de dados reais não é liberado.** Ele depende das regras da instituição, da
unidade de saúde, da preceptoria e do prontuário oficial — e o `GO LOCAL` de 28/09,
anterior a tudo isso, não o cobre.

> Enquanto não houver decisão documentada nova, trate o Mapa como **acadêmico e pessoal**.
> Nomes, documentos, endereços, contatos, diagnósticos e resultados reais não entram.

## O que o app protege

- **PIN local** por aparelho, com bloqueio por inatividade e ao esconder a aba
- **Backup cifrado com AES-GCM**, com checksum e restauração atômica
- **Modo demonstração isolado**: semeia casos sintéticos num espaço separado e devolve o estado
  normal ao sair, sem tocar em registro real
- **Sanitização por padrão** no montador de prompts: identificadores saem, entram códigos e idade
- Persistência local, sem sincronização em nuvem e sem logs clínicos

## O que o app não garante

- **Não substitui o prontuário institucional.** Nada aqui tem valor de registro oficial
- **Não criptografa o banco local por padrão.** O backup é cifrado; os dados em repouso dependem
  da proteção do aparelho
- **Não é validação clínica.** Não diagnostica, não prescreve, não substitui protocolo local
- **A sanitização reduz exposição, não elimina risco.** Revise o prompt antes de colar em qualquer
  ferramenta externa

## Relato de vulnerabilidade

**Não abra issue pública** contendo dados de saúde, identificadores de pessoa ou informação
explorável. Registre em canal privado com o mantenedor.

Se o relato envolver dado já exposto, avise antes de corrigir: a correção pode não apagar cópias
que já saíram do aparelho.

## Princípios

- minimização;
- local-first;
- sem logs clínicos;
- sem dados reais em issues, logs, fixtures, testes ou previews públicos;
- validação antes de restauração;
- falha segura;
- regressão testada para perda e vazamento.

## Obrigações de quem usa

- mantenha o aparelho protegido por senha, PIN ou biometria;
- gere backups protegidos regularmente e **teste a restauração**;
- não publique bancos locais, backups ou dados identificáveis neste repositório;
- respeite as regras da instituição, da preceptoria e do prontuário oficial.
