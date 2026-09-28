# Matriz de Testes em Dispositivos

Executar com dados sintéticos.

## Ambientes mínimos

- Android atual, Chrome, PWA instalada;
- iPhone atual e uma versão anterior suportada, Safari e PWA;
- desktop Chromium;
- Firefox;
- Safari macOS quando disponível.

## Cenários

1. primeira instalação e criação do PIN;
2. bloqueio por inatividade e troca de aplicativo;
3. uso offline após reinício;
4. atualização do Service Worker;
5. duas abas editando a mesma entidade;
6. quota próxima do limite;
7. persistência recusada;
8. backup comum e protegido;
9. senha incorreta e arquivo adulterado;
10. restauração interrompida;
11. zoom 200% e 400%;
12. teclado sem mouse;
13. TalkBack e VoiceOver;
14. modo acompanhamento sem fuga para outras famílias;
15. encerramento e imutabilidade do snapshot.

Cada execução deve registrar dispositivo, SO, navegador, versão, resultado, evidência e responsável.
