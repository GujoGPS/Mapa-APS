# Mapa APS: pacote de contexto 3

Este pacote contem arquivos integrais do projeto.

Cada arquivo comeca com:

# FILE: caminho/original

e termina com:

# END FILE: caminho/original

Nao interprete a ausencia de um arquivo neste pacote como ausencia no projeto. Outros arquivos podem estar nos demais pacotes.

---

# FILE: REPOSITORY_MANIFEST.json

``json
{
  "project": "Mapa",
  "version": "1.0.4-authorial-pharmacology",
  "status": "GO-LOCAL",
  "scope": "local-academic",
  "realDataAllowed": false,
  "pharmacology": {
    "catalog": "src/clinical/pharmacology/catalog.ts",
    "example": "src/clinical/pharmacology/example.ts",
    "initialEntries": 0,
    "exampleImportedAtRuntime": false
  },
  "gitCommit": "26d4d8b4303b9c1882d4669a06fdcdc3c3cea300",
  "files": [
    {
      "path": ".editorconfig",
      "sha256": "a6b98ea7cb6d61ed8d430dd0dffa46c87012b5cf859d4ce7207898954951fdcd",
      "bytes": 188
    },
    {
      "path": ".env.example",
      "sha256": "305f452b22ace7a351409c3b01c7ad0307a2f7fd51a14ea6548fd31bfb9f76eb",
      "bytes": 138
    },
    {
      "path": ".github/pull_request_template.md",
      "sha256": "1aa48feb15d437df42be18557bf05b7ba5d3b1190860ab7e44ae9d0a73b39f76",
      "bytes": 225
    },
    {
      "path": ".github/workflows/ci.yml",
      "sha256": "f29aa47e61e07e454b38bb1d85884619d860416a29c496e424fe242d5f5bde8e",
      "bytes": 326
    },
    {
      "path": ".gitignore",
      "sha256": "60b59ecb0d2d43125ff9a84579591d2e334efdf640582dee8c9cea2b5a711503",
      "bytes": 108
    },
    {
      "path": ".nvmrc",
      "sha256": "f14b4987904bcb5814e4459a057ed4d20f58a633152288a761214dcd28780b56",
      "bytes": 3
    },
    {
      "path": ".vscode/extensions.json",
      "sha256": "7c8c1da07f5f6e07bf3a3678d54304666d5fe49dc8d1e954aae1b223566c7cd3",
      "bytes": 107
    },
    {
      "path": ".vscode/tasks.json",
      "sha256": "65e84e8eef0793eec547cc9940dc911ff01822880c71a5fd6ff4db70437f71da",
      "bytes": 476
    },
    {
      "path": "CONTRIBUTING.md",
      "sha256": "2c769e60eb90c06dbe53c12c309fbc5a057def2be0c9fd792b459274186f243e",
      "bytes": 554
    },
    {
      "path": "README.md",
      "sha256": "055de91d5882b1f8859cb890db4a46fff59df00309cf04249ce7ffb775071478",
      "bytes": 1829
    },
    {
      "path": "README_VSCODE.md",
      "sha256": "1601550adc42d62a5e88857bd5175cad1d8f9e4c7b5c292644f5bcf02496446c",
      "bytes": 1171
    },
    {
      "path": "SECURITY.md",
      "sha256": "e18437b3e7833c2af4363959c93faa908513442f4aee5b385ce77d0a2c9f65c6",
      "bytes": 591
    },
    {
      "path": "app/client-bootstrap.tsx",
      "sha256": "4d46c21f9b0ce2366a3978801a112e99868a945938e1468d4e97bf840e3f4bea",
      "bytes": 222
    },
    {
      "path": "app/clinical-library.tsx",
      "sha256": "2d536d23af13e0164409e401074588a1043595ea7d8eba18f40a3f73b47815e1",
      "bytes": 6590
    },
    {
      "path": "app/family-relations.tsx",
      "sha256": "4d7217391fb152eb0fb3ce810084a4d4df2ac7eb7fd88db487de70c9fb0b7cac",
      "bytes": 10399
    },
    {
      "path": "app/icon.svg",
      "sha256": "fe9e99af954d2101ef162bb3a6d5fc0b7ac64296473f887ef45b8887266bf6ab",
      "bytes": 192
    },
    {
      "path": "app/journey-dashboard.tsx",
      "sha256": "b70c9b84ec1928440fae789dbd226cb078598d71dbc5db6ce7b5f1d4ed6df32c",
      "bytes": 11129
    },
    {
      "path": "app/layout.tsx",
      "sha256": "22f4ffeb94c7e61685234d8965871ba99704e38586b1ba9ca2bd9ca8f5958623",
      "bytes": 936
    },
    {
      "path": "app/manifest.ts",
      "sha256": "a8a53647b297aeed8ed4b88e15f58ad8167b35d40ec6b77eaa7b4c286dcb01ec",
      "bytes": 461
    },
    {
      "path": "app/offline/page.tsx",
      "sha256": "e0f0195552979b3ee09e2086f40f09ac25b7837a0e763b4f0b5c37bd01ca59c8",
      "bytes": 386
    },
    {
      "path": "app/page.tsx",
      "sha256": "20b481afd466665881b995bb08c920b219107d562115d99b4284043ea137edf5",
      "bytes": 102
    },
    {
      "path": "app/person-care-panel.tsx",
      "sha256": "0ac698d050ed70aa422c542d6142f70db92ce99b136282cf4c981b0aa0ae1143",
      "bytes": 12662
    },
    {
      "path": "app/release-audit.tsx",
      "sha256": "f4b2c5362788aa3239c0bd86ee893444f5d4d292967bfb040f1da203935d9e9e",
      "bytes": 1384
    },
    {
      "path": "app/security-gate.tsx",
      "sha256": "b017d0b86c12f45ed794aae3e308c51125d62a0327aa36f3b9ab8b14149b2f11",
      "bytes": 3373
    },
    {
      "path": "app/storage-dashboard.tsx",
      "sha256": "e45337002cc2942833de7308077e20553db332414200c5bbbd3ef17a396b4e1a",
      "bytes": 3404
    },
    {
      "path": "app/styles.css",
      "sha256": "f61991e3ae26e20c3d8516274ae3ae4ca6a9ca673137d7beaad774ad1ca876e1",
      "bytes": 25694
    },
    {
      "path": "app/workspace.tsx",
      "sha256": "6fbb0255e5304decf1b18524b6a171a805078e219029968a80f798b5cf244ec6",
      "bytes": 16320
    },
    {
      "path": "dist-production/app.js",
      "sha256": "09662a4920849b5a5ea2c3c551a1080a6a5b6949176ee460c63a9d13ce0e23e9",
      "bytes": 300329
    },
    {
      "path": "dist-production/favicon.svg",
      "sha256": "fe9e99af954d2101ef162bb3a6d5fc0b7ac64296473f887ef45b8887266bf6ab",
      "bytes": 192
    },
    {
      "path": "dist-production/index.html",
      "sha256": "fa4e55a3f6d3c51a895ffbb2b3ab779b626edae05c0c9b0fd081e0aabaf5210a",
      "bytes": 848
    },
    {
      "path": "dist-production/manifest.webmanifest",
      "sha256": "86719b8c4ec266ad691a9066b300bde88a5f1721e581676f49060fd070434068",
      "bytes": 302
    },
    {
      "path": "dist-production/offline",
      "sha256": "ea875cfa1c8dedad295cdd01ce4cd33d3abed519424cbf76a7e2511adebf3022",
      "bytes": 300
    },
    {
      "path": "dist-production/styles.css",
      "sha256": "97bc788de6ba957430ffef4b221d18ab324382a1306daacace9ae94e2602f5d1",
      "bytes": 25557
    },
    {
      "path": "dist-production/sw.js",
      "sha256": "740bfc2e411075aa26f5d26a83c7c788c245e524f87386e78f359612aa4b5d46",
      "bytes": 1397
    },
    {
      "path": "docs/ACCEPTANCE_CRITERIA.md",
      "sha256": "6c50edf2fde46885e4fa7e9eeb5aaa290351752624b757273bb1f2d2754e109c",
      "bytes": 2416
    },
    {
      "path": "docs/AI_EXPORTS.md",
      "sha256": "378584013576c052aa582c2c757b0b58d50eea3f6e65a31318e3263487f21496",
      "bytes": 1376
    },
    {
      "path": "docs/ARCHITECTURE.md",
      "sha256": "e5d007e734d71bff4f66b24c1bb3b8911a40c7ce708bc11b7a99a09b8196661b",
      "bytes": 1928
    },
    {
      "path": "docs/BACKUP_AND_RECOVERY.md",
      "sha256": "26bb589101e804c72869e18233f5ee883b1573de985e9f3ea601ffe319d4344a",
      "bytes": 1618
    },
    {
      "path": "docs/CHANGELOG.md",
      "sha256": "881071edd705b61926719bdba247dce178e5decb8e2e4486f0a73238c9979928",
      "bytes": 3824
    },
    {
      "path": "docs/CLINICAL_CONTENT_MODEL.md",
      "sha256": "6f25c34837eefc33dfde9e4aa3e31911e2a05183d647c1fcf51340b97daf2b2a",
      "bytes": 1699
    },
    {
      "path": "docs/CLINICAL_RESEARCH_LOG.md",
      "sha256": "6194d200e8cc5a02e0e7cb682277c88280e03e82bf565ca44638ec5560b01450",
      "bytes": 937
    },
    {
      "path": "docs/CODING_STANDARDS.md",
      "sha256": "0ebd2c4cde6080dc71db2ac6d4cf3a76eef2e405bfce9c847ca3299a8e2b6ffb",
      "bytes": 924
    },
    {
      "path": "docs/DATA_MODEL.md",
      "sha256": "fa9dc0fdc3dceb5611f7546cf8c64c825e9dee281df5520da6b87aa8feeab7b7",
      "bytes": 3597
    },
    {
      "path": "docs/DECISIONS.md",
      "sha256": "8de045985d77b199103eae7310d032c5be689be1e9cae92a54777a0517c44919",
      "bytes": 2589
    },
    {
      "path": "docs/DEFINITION_OF_DONE.md",
      "sha256": "a5c8a5e0b1486695be1b3651a5a88e30cc0a35c0bee57537508455e04305905d",
      "bytes": 452
    },
    {
      "path": "docs/END_TO_END_SIMULATION.md",
      "sha256": "6376ebd946303d20e2b8ae4d3998f819c4c0cbb665112dc77767739a9532dbe5",
      "bytes": 2088
    },
    {
      "path": "docs/MANIFEST.json",
      "sha256": "ea3420b09bd0c0b60333d28867576a8fdbb9274b3ab073a940dfa2c06654f2f5",
      "bytes": 3320
    },
    {
      "path": "docs/OPEN_QUESTIONS.md",
      "sha256": "238208dcbc2097919a655ccd5456d75c532f770538541c745d7b9d82a52171ba",
      "bytes": 1450
    },
    {
      "path": "docs/PHARMACOLOGY_GOVERNANCE.md",
      "sha256": "92300f64689f7230b6cf2768e73095e03dc5dfe847b4742880361976349f0818",
      "bytes": 2194
    },
    {
      "path": "docs/PRIVACY_MODEL.md",
      "sha256": "30b0395a6f061602969310afd06c792278bbf849e265df6ef361e74bda9bee33",
      "bytes": 2378
    },
    {
      "path": "docs/PROJECT_STATE.md",
      "sha256": "2727609b29b8838a1d234870c6a402218f38056990308146a2d591c594c68b81",
      "bytes": 7049
    },
    {
      "path": "docs/README.md",
      "sha256": "cbeee9702c3a591e50c2b20ae30bef1c967da1e3b773e3bdb6ee43b4a8c70ea7",
      "bytes": 1704
    },
    {
      "path": "docs/RISKS.md",
      "sha256": "05c78980846d538518bf4abbe7b53b59b64529a2ef11e31d2baee068a302ff2e",
      "bytes": 1827
    },
    {
      "path": "docs/ROADMAP.md",
      "sha256": "565e0f0f4f34365568c887aa0f3f901c6d294037ad0a4c12720af9b747fde1c1",
      "bytes": 1501
    },
    {
      "path": "docs/SCOPE.md",
      "sha256": "cfe82381aa0f3b5b366e25c34f41937971100c9bc621e1763f8e609f57ea5824",
      "bytes": 2453
    },
    {
      "path": "docs/STATE_MACHINES.md",
      "sha256": "313c502b85b5d9ea5576c25af42cd7419674cff343d9df118822dcf76b667147",
      "bytes": 2224
    },
    {
      "path": "docs/TEST_PLAN.md",
      "sha256": "23e12cf26bf6e408c5f2f5ed0fabc83a3dac07d5724cd3013d8602f82656b8c2",
      "bytes": 1621
    },
    {
      "path": "docs/UX_FLOWS.md",
      "sha256": "51d280d703a1595b363a56992c3aa0d2e87ffb4ec87e9de8e88c2d57b9871815",
      "bytes": 1775
    },
    {
      "path": "docs/VISION.md",
      "sha256": "afee9a08925cbbf8bde23c70f3ffb217deadebb725c48514ca97389f955091e4",
      "bytes": 1945
    },
    {
      "path": "docs/adr/0001-local-first-sem-nuvem-na-v1.md",
      "sha256": "7146308b4f6ee93283c5a29f1f047cff769df98985a8dc2465ae9216cc2073b6",
      "bytes": 713
    },
    {
      "path": "docs/adr/0002-familias-esperadas-nao-limitadas.md",
      "sha256": "11981fcbc5a6f668e1eb70677d2ae9172695a1b9f187b857989716ba1205a2b7",
      "bytes": 659
    },
    {
      "path": "docs/adr/0003-indexeddb-nativo-no-marco-1.md",
      "sha256": "9bf0e41fb7c5c9a8b5242a74df13ae196266a785c1b792134403d7fd67a6ee8d",
      "bytes": 644
    },
    {
      "path": "docs/adr/0004-pin-bloqueio-backup-cifrado.md",
      "sha256": "058528a91487d9c36137cc47f9c35ab3e57f67ab80057bdafbd8a20a060677f0",
      "bytes": 736
    },
    {
      "path": "docs/adr/0005-service-worker-conservador.md",
      "sha256": "aa608b1b3fca02927da50db0ea736145d24d4116335142a7453dc808e0ceb419",
      "bytes": 381
    },
    {
      "path": "docs/adr/0006-registros-genericos-com-contratos-de-dominio.md",
      "sha256": "6509a68c44509201f382154392b65c685db2d6097b6ad81ecb17d9682299c96a",
      "bytes": 571
    },
    {
      "path": "docs/adr/0007-encontro-modular-e-pendencia-explicita.md",
      "sha256": "b12c04588b5f48c0d332286e5048ac6bd30d6848a7b70a2c14e80f14c2bca7f7",
      "bytes": 301
    },
    {
      "path": "docs/adr/0008-politicas-de-compartilhamento-no-dado.md",
      "sha256": "4f072585ea2e42fefafa6db156b1c0650b8baf9f08417eeca16f44276f85c020",
      "bytes": 331
    },
    {
      "path": "docs/adr/0009-resumo-derivado-nao-prontuario.md",
      "sha256": "e8b875fa58c3edf4e749356f6a7a82ce416923bdf75b0d33fb12186b1cd89bdd",
      "bytes": 304
    },
    {
      "path": "docs/adr/0010-biblioteca-clinica-versionada-em-codigo.md",
      "sha256": "d0ca54e4065f3d6373c4652b778e58665af68b0ebfecea1d59f10e18c7341912",
      "bytes": 316
    },
    {
      "path": "docs/adr/0011-doses-bloqueadas-ate-auditoria-de-produto.md",
      "sha256": "6d1052a2039c6bef423079101cf5d12b27adc0127dc85cdfbce3340a270d0fd4",
      "bytes": 428
    },
    {
      "path": "docs/adr/0012-diagramas-derivados-de-semantica.md",
      "sha256": "eb89845715e9e8608462ae44a50829acdd00ea372717c4b2ec23e6036566b7c1",
      "bytes": 289
    },
    {
      "path": "docs/adr/0013-perspectiva-obrigatoria-em-relacoes.md",
      "sha256": "25c6a4bb870e1dde197b3b5601dac1a66ac65342a7579599bc6b2747f205f246",
      "bytes": 277
    },
    {
      "path": "docs/adr/0014-prompt-de-diagrama-com-manifesto.md",
      "sha256": "7308e0feb3df68bb72e3e9c361c22eee07499015c6f9c83ba533f9fdcc57b2db",
      "bytes": 297
    },
    {
      "path": "docs/adr/0015-snapshot-imutavel-e-adendos.md",
      "sha256": "77dcd34c81ea3093f7cb4352e5d87f8e73461d75d6de9f1bbd032eedeb1af790",
      "bytes": 278
    },
    {
      "path": "docs/adr/0016-inconclusao-com-destino-explicito.md",
      "sha256": "9034e9f3d5b5337d5fede82948912e6ae51c43777f0e27601a5d8865ea6fe5cd",
      "bytes": 280
    },
    {
      "path": "docs/adr/0017-no-go-e-um-resultado-valido.md",
      "sha256": "d2909d1b99a18173047fdabdbcf016262d74ea644b3bfd19ce152da29a77a009",
      "bytes": 311
    },
    {
      "path": "docs/adr/README.md",
      "sha256": "ec9a2a0efa1a458effea8cc6ac1cd218f6b767928a00935a52caabbe8703e612",
      "bytes": 260
    },
    {
      "path": "docs/audit/ACCESSIBILITY_CHECKLIST.md",
      "sha256": "2aeb0ea79b3505ca0576aa1247ac40b79b166085316b6f2e98cfbbbe0075e97f",
      "bytes": 474
    },
    {
      "path": "docs/audit/AUDIT_REPORT.md",
      "sha256": "091a9b71e77c351adf43b3b1cadb3927180929338b8ab386ff8673e33f7f8a83",
      "bytes": 1306
    },
    {
      "path": "docs/audit/DEVICE_TEST_MATRIX.md",
      "sha256": "cc6aa85f79dcc11d24a7331d140ad1563eae271ac224d6ef0007eafe15ba70be",
      "bytes": 918
    },
    {
      "path": "docs/audit/GATE_CLOSURE_PLAN.md",
      "sha256": "eb85eb1155cbaa9493c3809073df11a442c3cf86bb9292c5c49be69c137a8aaa",
      "bytes": 20748
    },
    {
      "path": "docs/audit/INSTITUTIONAL_GATE.md",
      "sha256": "818ed7dbc0ed720be7b253348e5f61d6fd5b090c64d7473f6fc3666de5df531c",
      "bytes": 648
    },
    {
      "path": "docs/audit/RELEASE_DECISION.json",
      "sha256": "1cafe129ed4773b5c190c954ac501d4a07a6d79bbc1bb8c89d8184bb3cf90f9e",
      "bytes": 1318
    },
    {
      "path": "docs/audit/SECURITY_CHECKLIST.md",
      "sha256": "82b4c404020399ea6b1c866ccc371ca3d6e3120b558d56e9dde305f44264350a",
      "bytes": 582
    },
    {
      "path": "docs/release/ACADEMIC_REVIEW_POLICY.md",
      "sha256": "4970a1e60cce7b5d94b4103f3bab3cc55f261ea9927354abc5bfbd39bfd7af91",
      "bytes": 739
    },
    {
      "path": "docs/release/BASELINE.md",
      "sha256": "01420084bf89770ad984b91550eeb55b8a43349de517f002e7523e9ad1fccd13",
      "bytes": 1257
    },
    {
      "path": "docs/release/BUILD_REPORT.md",
      "sha256": "8b22bd481e3d84d043abe886af331558ef6314859d532b8a36d0e4ace195af9d",
      "bytes": 1361
    },
    {
      "path": "docs/release/CLINICAL_CLAIM_REVIEW.csv",
      "sha256": "5bc7ef638824d5ae2380b7fc1c187e15f35e546c5f2917257e201ec9d4e01208",
      "bytes": 13566
    },
    {
      "path": "docs/release/CLINICAL_REVIEW_PROTOCOL.md",
      "sha256": "72738050a55bbe014b909c952894488e044dc3c6dad0441ebdd0d9d522e288e9",
      "bytes": 763
    },
    {
      "path": "docs/release/CLINICAL_REVIEW_STATUS.json",
      "sha256": "e9ab2245cd1684a34c88efac532c02ea081a6566c56c20b75cd35dc655d8932a",
      "bytes": 122
    },
    {
      "path": "docs/release/CRYPTO_DECISION_DRAFT.md",
      "sha256": "0f5d6cc63e6166773fcac9fe2cca459590d32ededf88f890b138df6c0166fee0",
      "bytes": 1121
    },
    {
      "path": "docs/release/DEFECT_LOG.md",
      "sha256": "0a5722e22b51354f9d605b3109f28969c4a52a3816d9290534a86a6a398b917e",
      "bytes": 2499
    },
    {
      "path": "docs/release/ENVIRONMENT.json",
      "sha256": "7a62abbfbc7024e5983159aa0c2819eccc30da3f26daf713952495e75108ab35",
      "bytes": 293
    },
    {
      "path": "docs/release/EVIDENCE_INDEX.md",
      "sha256": "cac9bd716614e6297852715ffdf6723f32f339e331d5747dbdffd8402b259c12",
      "bytes": 1433
    },
    {
      "path": "docs/release/FINAL_DELIVERY.json",
      "sha256": "47e687406e39287ecd37392ee676f22c60fc7ee0813d7ce2dea9c0d49f855b1f",
      "bytes": 1168
    },
    {
      "path": "docs/release/GO_LOCAL.md",
      "sha256": "170fc74ffbd20d5c4c8cd2de9b22d948e45b3a6a7232eae8f1c57fde87d261d4",
      "bytes": 623
    },
    {
      "path": "docs/release/INSTITUTIONAL_MEETING_PACK.md",
      "sha256": "95313dc5945e9289ea523827d5a84f06834af383aa557079d2f535c60e298fd6",
      "bytes": 1607
    },
    {
      "path": "docs/release/INTERNAL_VALIDATION.md",
      "sha256": "b52799557e7ac7400203b8382d8229fb6c7f10752f4d826093476d16ce1e2d60",
      "bytes": 2202
    },
    {
      "path": "docs/release/LOCAL_RUNTIME_FIX.md",
      "sha256": "d0e629ff2ae9dd6599118c09368495b5a6cb83a8598c2e9eca731a9255b4324f",
      "bytes": 659
    },
    {
      "path": "docs/release/PERSISTENCE_TEST_PROTOCOL.md",
      "sha256": "9b8dfccf46e67d20f9a59934323fd6e538026bb3386bfab4736ed0b7ff548d83",
      "bytes": 1101
    },
    {
      "path": "docs/release/PHARMACOLOGY_AUTHORING.md",
      "sha256": "c253349488956e564113f7ce2aeda7d611ea8787977184ee46de6ac01a0f916f",
      "bytes": 364
    },
    {
      "path": "docs/release/PHARMACOLOGY_DECISION.md",
      "sha256": "d270a60038c8dade9800ea13a2b29aaccf7e2d97dd2a14436f9c1d4591fb05ba",
      "bytes": 1101
    },
    {
      "path": "docs/release/PHARMACOLOGY_REVIEW.csv",
      "sha256": "c13d1c8a97e700cc422d83bfc6ea78877d6b16c43e99fb00f51ce81d25a4ce1a",
      "bytes": 2033
    },
    {
      "path": "docs/release/PRODUCTION_BUILD_REPORT.md",
      "sha256": "4a3becae6901f578cd74982a7b6642487340742991c14334d834089b82d17b56",
      "bytes": 782
    },
    {
      "path": "docs/release/REVIEWER_NOMINATION.md",
      "sha256": "8cf62048e01a666c3c6009c5db4a37217d3e5d52d31ddb35112308878dbe1a4f",
      "bytes": 1016
    },
    {
      "path": "docs/release/SOURCE_VERIFICATION.md",
      "sha256": "26967b845630c5af31fb85feca67b77dbe172ebd83a29bcac0bcc03c79476148",
      "bytes": 1080
    },
    {
      "path": "docs/release/THREAT_MODEL_DRAFT.md",
      "sha256": "189b725d79110a814ba304f5bcbb085357f1e89f0c79248a00a0bb56995aa2a9",
      "bytes": 2550
    },
    {
      "path": "docs/release/TYPESCRIPT_BUILD_FIX.md",
      "sha256": "6be510dae798f6644272cf062be6bbef4362a37b8140ea854fc439b295f566db",
      "bytes": 611
    },
    {
      "path": "docs/release/WAVE_A_STATUS.md",
      "sha256": "18160721c0b4d50e3a09f21f6c5c2ee5c98a617279559cee6f11def2fe9d7e7e",
      "bytes": 1083
    },
    {
      "path": "docs/release/WAVE_B_REPORT.md",
      "sha256": "2a4b2d667f237764f88d318329f8d909ef321b6f5da38de69e7ac56a86759e1a",
      "bytes": 1558
    },
    {
      "path": "docs/release/WAVE_C_REPORT.md",
      "sha256": "67216aca0d7890ef43f3f65983b2882963983a3722c71332863772f28272b0a8",
      "bytes": 1681
    },
    {
      "path": "docs/release/WAVE_D_PILOT_REPORT.txt",
      "sha256": "4b4a6c60d1fb244d8e9b0df16f9474934846b22b135ae459ad28c432026c463e",
      "bytes": 1010
    },
    {
      "path": "docs/release/WAVE_D_RELEASE_DECISION.json",
      "sha256": "513d22336a7da7dfa6dd5017bfd3de8d1c55d26a48f2a8ea4420bbff1770aca5",
      "bytes": 559
    },
    {
      "path": "docs/release/WAVE_D_REPORT.md",
      "sha256": "9dff074c287bad97acd34d85acca0a1fde0b98464a327e0371f0ab92f131727b",
      "bytes": 1534
    },
    {
      "path": "docs/release/WAVE_D_RESULT.json",
      "sha256": "b99974efd9c1be426fdbc4d07a7d0e1010d184f4549252709122f7ed1ffc46dc",
      "bytes": 2839
    },
    {
      "path": "eslint.config.mjs",
      "sha256": "6b2d57d28b91b7b8f49253aabb9d3f06c771d84d7ae7a22c3e1423c016111a4c",
      "bytes": 312
    },
    {
      "path": "next-env.d.ts",
      "sha256": "04b74076fa59111133bc34189c611f1fed4a86f6567e4c54307ed0bd947ff5b7",
      "bytes": 118
    },
    {
      "path": "next.config.ts",
      "sha256": "f858cf8704ac8422bfa0f7c5c50dd5ed622c160d5034f78721510344666e2986",
      "bytes": 1206
    },
    {
      "path": "package.json",
      "sha256": "7a48e2daaafd243c63dec68484b0488a7fda1fa08be9470487629d6eeb5fa33d",
      "bytes": 2540
    },
    {
      "path": "public/sw.js",
      "sha256": "740bfc2e411075aa26f5d26a83c7c788c245e524f87386e78f359612aa4b5d46",
      "bytes": 1397
    },
    {
      "path": "scripts/accessibility-static.mjs",
      "sha256": "fdb922773302594f7a95056e1d3ca2c818da097ef8c4fee1bffa009fdddeeebe",
      "bytes": 1305
    },
    {
      "path": "scripts/audit-static.mjs",
      "sha256": "097e972e771d88f20bd6bcb464b2d6aae983e82b859c824f47f9df59c10f2c99",
      "bytes": 1170
    },
    {
      "path": "scripts/generate-clinical-review.ts",
      "sha256": "77db63294d0ed6227da95e2ee15a2cca60cb92c0980b53399b36be0fd1a45ebc",
      "bytes": 851
    },
    {
      "path": "scripts/internal-validate.sh",
      "sha256": "db4b1a93c958bddd3dc2041c366163791300e9465ca3b69768bca874f09c3011",
      "bytes": 711
    },
    {
      "path": "scripts/release-gate.mjs",
      "sha256": "e0965e285c298d5cb6bd6dd15261068cb82c65c80579ca62ae1ab45ab7df881d",
      "bytes": 311
    },
    {
      "path": "scripts/verify-docs.mjs",
      "sha256": "74c5c5f748bcbd089d2dbbd8a1195d736a5bc26b185aac57b8e1412443db32f2",
      "bytes": 617
    },
    {
      "path": "scripts/verify-marco1.mjs",
      "sha256": "91a453209d45a11e2462001c0c65740e3a916975b105e1bb817df5f9eabac331",
      "bytes": 770
    },
    {
      "path": "scripts/verify-marco2.mjs",
      "sha256": "d7e40f728e8784c9393fe13acbd816133017e99b9ff23620ef5279e7b19d8eae",
      "bytes": 739
    },
    {
      "path": "scripts/verify-marco3.mjs",
      "sha256": "cbd8d265d00e5ee15fdd99fda5885241bdbe08eb89b9f34ddf7bde6914676fd4",
      "bytes": 675
    },
    {
      "path": "scripts/verify-marco4.mjs",
      "sha256": "543ee4796b60bafd31114ccc70b3ddbe06c5213a8b2bf45bb07b4959669bdca2",
      "bytes": 772
    },
    {
      "path": "scripts/verify-marco5.mjs",
      "sha256": "add5b07550dcbc5e368e3ec9b94e291692bdb756ebdcfe46e159a379867a31ac",
      "bytes": 565
    },
    {
      "path": "scripts/verify-marco6.mjs",
      "sha256": "b3db81c2952651b4c5360864b6865d37a13ba1a84794e8edfe188d475c46268a",
      "bytes": 587
    },
    {
      "path": "scripts/verify-marco7.mjs",
      "sha256": "f8af78c775b639e3387b0a23441ec55268e0ec2405978fa09ba70cb711a69ec7",
      "bytes": 653
    },
    {
      "path": "scripts/verify-synthetic-data.mjs",
      "sha256": "053e2bec1385d0896272cbf89c5cdd084c954964a9078d2c46b180cd2f52bbb5",
      "bytes": 523
    },
    {
      "path": "scripts/wave-b-adversarial.ts",
      "sha256": "cf8f931795c7580566510fc0076f8ace1df780e5fc7c934deb1e0172d079358f",
      "bytes": 2487
    },
    {
      "path": "scripts/wave-c-audit.ts",
      "sha256": "53217b4340f022fa5343a1ac5aea84fd34b57f761d14c0bb81e9b8ae62213289",
      "bytes": 1580
    },
    {
      "path": "scripts/wave-d-pilot.ts",
      "sha256": "f14db6cc3d68bc6a9ce6f1f86a95ab44f33edd4d2fb77111571587752e86190f",
      "bytes": 523
    },
    {
      "path": "scripts/wave-d-release-council.ts",
      "sha256": "acdf53ce2ba365853f2b527b231bbb41a91d70d5256b677d871c2ba2df18dc2d",
      "bytes": 807
    },
    {
      "path": "src/audit/gates.ts",
      "sha256": "054198155e56800f9fff342fa2e4a6aaec3fc38999b9c6893fb31416d32ab1bf",
      "bytes": 2749
    },
    {
      "path": "src/audit/types.ts",
      "sha256": "6e29eb726d082a9dacefb893d0f3d583b87b3b21b02fb1f42fc08afc422e2322",
      "bytes": 582
    },
    {
      "path": "src/backup/adversarial.ts",
      "sha256": "02ad5f1a928fed22531a675734678fc2d7eec7562b6745b24af3d473f8c4c4aa",
      "bytes": 2863
    },
    {
      "path": "src/backup/crypto.ts",
      "sha256": "f684a20f98eb53a09d92cd6725ad34614dd16aa31da53b5ac7f000dc81a5e2c2",
      "bytes": 2197
    },
    {
      "path": "src/backup/service.ts",
      "sha256": "03acfa1c3d61fe418abd2bff2430f2f849a9977b7fb7c9e86643c3755fffc644",
      "bytes": 2295
    },
    {
      "path": "src/backup/types.ts",
      "sha256": "006d593b7a37057d283a6cd666acec4f3dba4723c9f212e8342bd3e26189eefe",
      "bytes": 938
    },
    {
      "path": "src/clinical/content.ts",
      "sha256": "1fa369ac74df29d05ee24daaeb6b18cdcc124103073c498b3497154b29f984f7",
      "bytes": 17390
    },
    {
      "path": "src/clinical/pharmacology/README.md",
      "sha256": "58d2ff80c964b61ad3d159f73b950a4153b566525d2ee683d26bc579e9b17c2e",
      "bytes": 507
    },
    {
      "path": "src/clinical/pharmacology/catalog.ts",
      "sha256": "bd157cba904c21902610fda2c35505517c859ecfe85935e10fa4f540842a72a4",
      "bytes": 322
    },
    {
      "path": "src/clinical/pharmacology/example.ts",
      "sha256": "405fe929a83e5e65cd39d94c7d834dc4c7e5830990bab288960460a89b4f0e72",
      "bytes": 1411
    },
    {
      "path": "src/clinical/pharmacology/types.ts",
      "sha256": "0996490f9b1cba53aa0cafc2a163b1d4c828acfc9aae4f2301a9e09eb81bfaa0",
      "bytes": 920
    },
    {
      "path": "src/clinical/pharmacology/validation.ts",
      "sha256": "dc0f9953fbc1645c674693563d383295535efa5de470b1b7ae395cbc159a8b79",
      "bytes": 786
    },
    {
      "path": "src/clinical/review.ts",
      "sha256": "32bae2466598424075e030fabef7c9dfe52b2c4d3e4b999afc9dd5c38eda9e08",
      "bytes": 2623
    },
    {
      "path": "src/clinical/sources.ts",
      "sha256": "2d6fd7fc721c9f1f05d17f9aa6fdb838ec89456e5e7516bd8a15f17130cd981b",
      "bytes": 3035
    },
    {
      "path": "src/clinical/types.ts",
      "sha256": "f0f7bb6f29f6482f01be5d88944eb5ced0d8c6aa5dd4fcda3c68f527c24a1eeb",
      "bytes": 1542
    },
    {
      "path": "src/clinical/validation.ts",
      "sha256": "23b73ec42aa350ca52832dbfc6749a65b734cad04684deb54d0b21e3a2824271",
      "bytes": 1474
    },
    {
      "path": "src/contracts/care.ts",
      "sha256": "0450d0d4c6e3e1d279ec699eadb2164caa73ed284d6f2d0641441d2e1ed61b28",
      "bytes": 1584
    },
    {
      "path": "src/contracts/clinical.ts",
      "sha256": "580f19c2c6f9dd67557e12629cc3519761c8782574b1e5a29c11b0a4bb515011",
      "bytes": 1038
    },
    {
      "path": "src/contracts/core.ts",
      "sha256": "dfd2f8dcc91988f345ccc9760d7e7ac6e82c066a56f56986ecd5b03377ae1e1c",
      "bytes": 994
    },
    {
      "path": "src/contracts/family.ts",
      "sha256": "3ae8ab405d116035b07aad917ed2b37c7b202a4139990a81a6c6f6acaa58132e",
      "bytes": 1676
    },
    {
      "path": "src/contracts/journey.ts",
      "sha256": "f9c986b44762b7cd1b861d6eb9f2ad0f7dfe2f5702a5f477f30c5db307d7494f",
      "bytes": 1728
    },
    {
      "path": "src/contracts/longitudinal.ts",
      "sha256": "588f685f06353a5abee0f5a6870dd05430706ce29f07e36e89dd810b575ef36e",
      "bytes": 2875
    },
    {
      "path": "src/contracts/relations.ts",
      "sha256": "fa18c477059ab21c7c91ead4d2461fdad03376a4e93efd44adf9872c259be089",
      "bytes": 1707
    },
    {
      "path": "src/contracts/sharing.ts",
      "sha256": "cb6eab1ef6aad7dfe389d1e25c5a5235f40181a86cff2345cda3b7a7a85759a1",
      "bytes": 760
    },
    {
      "path": "src/data/synthetic/README.md",
      "sha256": "5ac0562912925344c0d713dbf0f69e52bea4a861e7c378081178bd0e4d8aa550",
      "bytes": 423
    },
    {
      "path": "src/data/synthetic/semester-2026-2.json",
      "sha256": "4d8ee67fb38b8ff48207eca8f2b4c7cf78e60dae9180fe415fbb2046014ee8ea",
      "bytes": 806
    },
    {
      "path": "src/data/synthetic/wave-d-semester.json",
      "sha256": "59f74e622dba6f1ce9e8e81c2cc8eb990ca698914a6bbdb2ae09f307956285a6",
      "bytes": 6120
    },
    {
      "path": "src/domain/care-selectors.ts",
      "sha256": "86d514cbdb52aa8444893be197446f7348556adf27233383b7e5f9c6a0793692",
      "bytes": 3493
    },
    {
      "path": "src/domain/demo-seed.ts",
      "sha256": "40d7be53fce3cc6fe85df1fcba918aac0ea2421ef98f54449ba447ef17f82397",
      "bytes": 1244
    },
    {
      "path": "src/domain/diagram-engine.ts",
      "sha256": "17df103e1a5882be1dbf3faf60c1a7f34f16a6143aa45b4318ea13df28e4a0ac",
      "bytes": 5125
    },
    {
      "path": "src/domain/diagram-prompt.ts",
      "sha256": "bab07d2368fed921e5ed2e379a592667c998be47fac124f3881c50f55bdd4d35",
      "bytes": 1381
    },
    {
      "path": "src/domain/entity-types.ts",
      "sha256": "f69de5621cfa9102942f6c90989046c2a78a34008e3762c3f194a80cfb9b34c6",
      "bytes": 921
    },
    {
      "path": "src/domain/entity.ts",
      "sha256": "e18078848a6cf42f575467ebd502a18d043e104e2a51badaa0164fc83b46c10b",
      "bytes": 652
    },
    {
      "path": "src/domain/factories.ts",
      "sha256": "be4b51de34c114800e076d9740dba068ae7f9908db78bf3a44480b3024c0ceae",
      "bytes": 3886
    },
    {
      "path": "src/domain/journey-factories.ts",
      "sha256": "9bbf17c63c4707b79d1e77831449daa77c6c44091ed5a285847df9a189a11281",
      "bytes": 2429
    },
    {
      "path": "src/domain/journey-report.ts",
      "sha256": "1750d5e98346b8d59612919f50b067e80117c0952cc4cf20b4fb5e776da94304",
      "bytes": 3161
    },
    {
      "path": "src/domain/longitudinal-factories.ts",
      "sha256": "cf8d48b47a945e9566aaea8b77e46ba9f2c9bfb4f10aaad6b57e7eba9cc77061",
      "bytes": 4284
    },
    {
      "path": "src/domain/relation-factories.ts",
      "sha256": "1fca36d7f3b9bbb732250cb55ac9e717bd3788ed2c78007636800021e31637b2",
      "bytes": 2481
    },
    {
      "path": "src/domain/repository.ts",
      "sha256": "0b1b41bf0a3302779a9d49c26c79069120e0989a0323143d1a398d1ddd3660da",
      "bytes": 1803
    },
    {
      "path": "src/domain/selectors.ts",
      "sha256": "ccbd8c2fd0f7d11b3d176cfce47850ab3abc4f8dd593660589804fcacc5b0f99",
      "bytes": 2572
    },
    {
      "path": "src/domain/semester-close.ts",
      "sha256": "8d5c481b888e0f639940386bd26631be2fe09bb2684195e052b6e9841abb4ef6",
      "bytes": 1846
    },
    {
      "path": "src/domain/sharing-policy.ts",
      "sha256": "00d9b7450fee47dcf8e77061d090fa08dd64695b2b30e5982dcdface5211e479",
      "bytes": 1411
    },
    {
      "path": "src/domain/wave-d-simulation.ts",
      "sha256": "61a5a65024a5ae93e68c0facdf407e5539415c46a540d1c5616cc40eb699633c",
      "bytes": 3249
    },
    {
      "path": "src/hooks/use-mapa-data.ts",
      "sha256": "c0f97434026022964041e923bb15b4a1d4b1a441e9af31cf11eeacee678738ba",
      "bytes": 4100
    },
    {
      "path": "src/lib/project-state.ts",
      "sha256": "fa9ce95deaa1253088dc247d02bfb44dddbb0425bda98b9a0c3b297bd33ef68e",
      "bytes": 287
    },
    {
      "path": "src/pwa/register.ts",
      "sha256": "4f28867d2743aed822b38697a64d5a853ee37d8162801b96b5d258985368fe88",
      "bytes": 323
    },
    {
      "path": "src/security/encoding.ts",
      "sha256": "9615aa513a67121cb52581dc688fbe387bf7d74281241562ade64c7ba235173f",
      "bytes": 328
    },
    {
      "path": "src/security/pin.ts",
      "sha256": "247474ce0cee1580ff8a84b97bdfafec71751573827536182b92e1471d6cb362",
      "bytes": 2426
    },
    {
      "path": "src/storage/autosave.ts",
      "sha256": "5aab21e4bb677aad20149b2c949de7749ce494885dcd9cea0782ae85ee060842",
      "bytes": 919
    },
    {
      "path": "src/storage/hash.ts",
      "sha256": "44883d280eebbd3700f6dca6c1d9034e94e30d65fb5e2c1570f78cc015af5a41",
      "bytes": 928
    },
    {
      "path": "src/storage/idb.ts",
      "sha256": "3121260523b91aa383439dbe1cf8a78c17ba313ca1cb1ad249171a48c643dfc8",
      "bytes": 4628
    },
    {
      "path": "src/storage/multi-tab.ts",
      "sha256": "ca2cc4bd4f80bbd2ebe1dddb305368276929596241a01eda92cc0be7758c8a37",
      "bytes": 1618
    },
    {
      "path": "src/storage/repository.ts",
      "sha256": "293098d26ccef0c3264a9a026672f99993a6f08cce81a506320e80ca16efd5d6",
      "bytes": 1183
    },
    {
      "path": "src/storage/schema.ts",
      "sha256": "e0013bbbbb666bf0ffc8ebf5ee577ec51e89a8ab4abb0ff24b8b5d6074e5249a",
      "bytes": 898
    },
    {
      "path": "src/storage/status.ts",
      "sha256": "f4cd53ced6f6d9a6d59d5e6897f4feceb71fb554c6cc4f582dfb2bffecd3bad8",
      "bytes": 1256
    },
    {
      "path": "tests/backup-crypto.test.ts",
      "sha256": "dbaf79689053cb8da8f6fbdb3e2221939b77c2b66cc2088b4348b955dbeb4244",
      "bytes": 597
    },
    {
      "path": "tests/hash.test.ts",
      "sha256": "075535a2a66d0e3b6ef28212a89fc9f1cfbe262fd246964437382ad5a8b46693",
      "bytes": 414
    },
    {
      "path": "tests/marco2-factories.test.ts",
      "sha256": "35f4bfaa3e720f1a9adb53973e5cc000111f8ec23237a46cce7e42a846835241",
      "bytes": 623
    },
    {
      "path": "tests/marco2-selectors.test.ts",
      "sha256": "b9cc1e02cd3d58a8e1e1bf864e4e655224660884a14795984f17a6e5a3cb6a64",
      "bytes": 1128
    },
    {
      "path": "tests/marco3-handoff.test.ts",
      "sha256": "fd6f93484b81ab7c4307590068dd20a7aa39539c8b3a42c40302483f155a8a00",
      "bytes": 875
    },
    {
      "path": "tests/marco3-sharing.test.ts",
      "sha256": "d1e44ccc16dc00ad18877a0303b91516ef8a393ac707d8b5bec1f4f3a1fee9ca",
      "bytes": 645
    },
    {
      "path": "tests/marco4-clinical.test.ts",
      "sha256": "bd3a9ba6851e11b7f904400ca9542868fe9c9a96ec64526ef80f82288f45a3da",
      "bytes": 760
    },
    {
      "path": "tests/marco5-diagrams.test.ts",
      "sha256": "ffbe594639c9dd0c993ffb6415a301344fc44606e6a7aeda4afa8369814a502f",
      "bytes": 1550
    },
    {
      "path": "tests/marco6-journey.test.ts",
      "sha256": "d67aa40deab5707de8a7757c1c63c0a0f0d2b0926c48a0c4fa017b634b1c08e4",
      "bytes": 1498
    },
    {
      "path": "tests/pharmacology-catalog.test.ts",
      "sha256": "25df760543fd4bcd8a04ec068199d851bd5d3af7ddf90fb92b3e7d3f4d14aa07",
      "bytes": 679
    },
    {
      "path": "tests/pin-policy.test.ts",
      "sha256": "25d471717391e059e4cf16f8e478a8b87841729fa8b4b306cc1270b6ef1eafea",
      "bytes": 380
    },
    {
      "path": "tests/project-state.test.ts",
      "sha256": "2626a4a1cadb1d4deb83d3f339777442c721651de1687da9c88ace26f08128b6",
      "bytes": 446
    },
    {
      "path": "tests/setup.ts",
      "sha256": "9b328c4843431fa76d8de00008fc159e95f99a840211085ff3b8f25e53d14409",
      "bytes": 43
    },
    {
      "path": "tests/synthetic-contract.test.ts",
      "sha256": "8fe5ad4e2336019e586afad6fe6b2dec3b4ee999b74112ceae94f068e3550208",
      "bytes": 525
    },
    {
      "path": "tsconfig.json",
      "sha256": "4d90f2fc0b5dde4e429b833b79471f6f74bfe8c4cb377de1ec3908ba163adacb",
      "bytes": 641
    },
    {
      "path": "tsconfig.tsbuildinfo",
      "sha256": "1004846c2d497184b22a8137b91aeab3ead24c3fb4f018907e90d503daac6b80",
      "bytes": 225977
    },
    {
      "path": "vitest.config.ts",
      "sha256": "1150759a4cb5dda38abc29d544ad1392a3a20f67ca367ffb063d21c713a07a14",
      "bytes": 352
    }
  ]
}

``

# END FILE: REPOSITORY_MANIFEST.json

---

# FILE: scripts/accessibility-static.mjs

``javascript
import{readFile,readdir}from"node:fs/promises";import{join}from"node:path";
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);e.isDirectory()?out.push(...await walk(p)):out.push(p)}return out}
const files=(await walk("app")).filter(p=>p.endsWith(".tsx"));const issues=[];let buttons=0,images=0;
for(const file of files){const s=await readFile(file,"utf8");buttons+=(s.match(/<button/g)||[]).length;images+=(s.match(/<img/g)||[]).length;if(/<img(?![^>]*alt=)/s.test(s))issues.push(`${file}: imagem sem alt`);if(/onClick=/.test(s)&&/<div[^>]*onClick=/.test(s))issues.push(`${file}: div clicável sem semântica`);if(/<input/.test(s)&&!/<label/.test(s))issues.push(`${file}: inputs sem labels no arquivo`);}
const layout=await readFile("app/layout.tsx","utf8");if(!layout.includes('<html lang="pt-BR">'))issues.push("idioma ausente");const styles=await readFile("app/styles.css","utf8");if(!styles.includes(":focus-visible"))issues.push("estilo focus-visible ausente");if(!styles.includes("prefers-reduced-motion"))issues.push("redução de movimento ausente");if(issues.length){console.error(issues.join("\n"));process.exit(1)}console.log(`[ok] acessibilidade estática: ${files.length} arquivos, ${buttons} botões, ${images} imagens`);

``

# END FILE: scripts/accessibility-static.mjs

---

# FILE: scripts/audit-static.mjs

``javascript
import{readFile,readdir}from"node:fs/promises";import{join}from"node:path";
import{isClinicalSourcesPath}from"./audit-static-paths.mjs";
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);e.isDirectory()?out.push(...await walk(p)):out.push(p)}return out}
const files=(await Promise.all([walk("app"),walk("src")])).flat().filter(p=>/\.(ts|tsx|js|mjs)$/.test(p));const text=(await Promise.all(files.map((file)=>readFile(file)))).map((b,i)=>[files[i],String(b)]);const failures=[];for(const[file,body]of text){if(/dangerouslySetInnerHTML/.test(body))failures.push(`${file}: dangerouslySetInnerHTML`);if(/console\.(log|debug)\(/.test(body))failures.push(`${file}: console output`);if(/https?:\/\//.test(body)&&!isClinicalSourcesPath(file))failures.push(`${file}: URL externa fora do catálogo clínico`)}const config=await readFile("next.config.ts","utf8");for(const h of ["Content-Security-Policy","X-Frame-Options","Permissions-Policy","Referrer-Policy"])if(!config.includes(h))failures.push(`header ausente: ${h}`);if(failures.length){console.error(failures.join("\n"));process.exit(1)}console.log(`[ok] auditoria estática em ${files.length} arquivos`);

``

# END FILE: scripts/audit-static.mjs

---

# FILE: scripts/audit-static-paths.mjs

``javascript
import { normalize } from "node:path";

export function normalizeAuditPath(path) {
  return normalize(path).replaceAll("\\", "/");
}

export function isClinicalSourcesPath(path) {
  return normalizeAuditPath(path) === "src/clinical/sources.ts";
}

``

# END FILE: scripts/audit-static-paths.mjs

---

# FILE: scripts/audit-static-self-test.mjs

``javascript
import assert from "node:assert/strict";
import { isClinicalSourcesPath, normalizeAuditPath } from "./audit-static-paths.mjs";

assert.equal(normalizeAuditPath("src/clinical/sources.ts"), "src/clinical/sources.ts");
assert.equal(normalizeAuditPath("src\\clinical\\sources.ts"), "src/clinical/sources.ts");
assert.equal(isClinicalSourcesPath("src/clinical/sources.ts"), true);
assert.equal(isClinicalSourcesPath("src\\clinical\\sources.ts"), true);
assert.equal(isClinicalSourcesPath("src/other/sources.ts"), false);
console.log("[ok] caminhos POSIX e Windows normalizados; caminho externo continua rejeitado");

``

# END FILE: scripts/audit-static-self-test.mjs

---

# FILE: scripts/generate-clinical-review.ts

``typescript
import {writeFileSync} from "node:fs";import {claimReviewRows,clinicalReviewReadiness,medicationReviewRows} from "../src/clinical/review";
const csv=(rows:Record<string,unknown>[])=>{if(!rows.length)return"";const headers=Object.keys(rows[0]!);const esc=(x:unknown)=>`"${String(Array.isArray(x)?x.join("; "):x??"").replaceAll('"','""')}"`;return[headers.map(esc).join(","),...rows.map(r=>headers.map(h=>esc(r[h])).join(","))].join("\n")+"\n"};
writeFileSync("docs/release/CLINICAL_CLAIM_REVIEW.csv",csv(claimReviewRows() as unknown as Record<string,unknown>[]));writeFileSync("docs/release/PHARMACOLOGY_REVIEW.csv",csv(medicationReviewRows() as unknown as Record<string,unknown>[]));writeFileSync("docs/release/CLINICAL_REVIEW_STATUS.json",JSON.stringify(clinicalReviewReadiness(),null,2)+"\n");console.log(JSON.stringify(clinicalReviewReadiness()));

``

# END FILE: scripts/generate-clinical-review.ts

---

# FILE: scripts/internal-validate.sh

``bash
#!/usr/bin/env bash
set -eu
rm -rf /tmp/mapa-internal-build /tmp/mapa-parse-out
bun build app/page.tsx --outdir /tmp/mapa-internal-build --target browser --external react --external react-dom --external 'next/*' --external next --external zod
failures=0
while IFS= read -r file; do
  if ! bun build "$file" --outdir /tmp/mapa-parse-out --target browser --external react --external react-dom --external 'next/*' --external next --external zod --external vitest --external '@testing-library/*' >/dev/null; then
    echo "[fail] $file"
    failures=$((failures + 1))
  fi
done < <(find app src tests -type f \( -name '*.ts' -o -name '*.tsx' \) | sort)
test "$failures" -eq 0
echo "[ok] internal syntax validation"

``

# END FILE: scripts/internal-validate.sh

---

# FILE: scripts/marco7-policy.mjs

``javascript
export const REQUIRED_LOCAL_GATES = [
  "build-pipeline",
  "backup-restore",
  "storage-eviction",
  "pin-boundary",
  "privacy-workflow",
];

export function evaluateMarco7Decision(report) {
  const errors = [];
  if (report?.decision !== "GO LOCAL") errors.push("A decisão operacional deve ser GO LOCAL.");
  if (report?.realDataAllowed !== false) errors.push("GO LOCAL não autoriza dados reais.");
  if (report?.publicDistributionAllowed !== false) errors.push("GO LOCAL não autoriza distribuição pública irrestrita.");
  if (report?.replacesOfficialRecord !== false) errors.push("GO LOCAL não substitui prontuário institucional.");
  if (!Array.isArray(report?.conditions) || report.conditions.length === 0) errors.push("Condições de uso ausentes.");
  if (!Array.isArray(report?.limitations) || report.limitations.length === 0) errors.push("Limitações de escopo ausentes.");
  if (!Array.isArray(report?.evidence) || report.evidence.length === 0) errors.push("Evidências ausentes.");

  const gates = new Map((Array.isArray(report?.gates) ? report.gates : []).map((gate) => [gate.id, gate]));
  for (const gateId of REQUIRED_LOCAL_GATES) {
    const gate = gates.get(gateId);
    if (!gate || gate.status !== "passed" || gate.blocking !== false) {
      errors.push(`Gate local obrigatório não aprovado: ${gateId}.`);
    }
  }
  for (const gate of gates.values()) {
    if (gate.blocking === true && gate.status !== "passed") {
      errors.push(`Bloqueador explícito permanece aberto: ${gate.id}.`);
    }
  }
  return { valid: errors.length === 0, errors };
}

``

# END FILE: scripts/marco7-policy.mjs

---

# FILE: scripts/release-gate.mjs

``javascript
import{readFile}from"node:fs/promises";const report=JSON.parse(await readFile("docs/audit/RELEASE_DECISION.json","utf8"));console.log(`${report.decision}: ${report.passed} passed, ${report.failed} failed, ${report.blocked} blocked, ${report.manual} manual`);if(report.realDataAllowed!==true)process.exitCode=2;

``

# END FILE: scripts/release-gate.mjs

---

# FILE: scripts/verify-docs.mjs

``javascript
import { access, readFile } from "node:fs/promises";

const required = [
  "docs/PROJECT_STATE.md",
  "docs/DECISIONS.md",
  "docs/ARCHITECTURE.md",
  "docs/DATA_MODEL.md",
  "docs/PRIVACY_MODEL.md",
  "docs/PHARMACOLOGY_GOVERNANCE.md",
  "docs/ROADMAP.md",
  "docs/CHANGELOG.md"
];

for (const path of required) await access(path);

const state = await readFile("docs/PROJECT_STATE.md", "utf8");
if (!state.includes("Quantidade esperada de famílias")) {
  throw new Error("PROJECT_STATE.md perdeu a decisão sobre famílias esperadas.");
}

console.log(`[ok] ${required.length} documentos canônicos verificados`);

``

# END FILE: scripts/verify-docs.mjs

---

# FILE: scripts/verify-marco1.mjs

``javascript
import { access, readFile } from "node:fs/promises";

const required = [
  "src/storage/idb.ts",
  "src/storage/repository.ts",
  "src/storage/status.ts",
  "src/storage/multi-tab.ts",
  "src/security/pin.ts",
  "src/backup/service.ts",
  "src/backup/crypto.ts",
  "public/sw.js",
  "app/offline/page.tsx",
  "app/security-gate.tsx"
];
for (const path of required) await access(path);
const state = await readFile("src/lib/project-state.ts", "utf8");
if (!state.includes("realDataAllowed: false")) throw new Error("Marco 1 não pode permitir dados reais.");
const sw = await readFile("public/sw.js", "utf8");
if (!sw.includes("mapa-shell-v1")) throw new Error("Cache PWA não foi versionado.");
console.log(`[ok] ${required.length} componentes do Marco 1 verificados`);

``

# END FILE: scripts/verify-marco1.mjs

---

# FILE: scripts/verify-marco2.mjs

``javascript
import { access, readFile } from "node:fs/promises";
const required=["src/contracts/care.ts","src/domain/factories.ts","src/domain/repository.ts","src/domain/selectors.ts","src/domain/demo-seed.ts","src/hooks/use-mapa-data.ts","app/workspace.tsx"];
for (const path of required) await access(path);
const workspace=await readFile("app/workspace.tsx","utf8");
if (!workspace.includes("Famílias esperadas")) throw new Error("Jornada perdeu a linguagem de expectativa.");
const storageDashboard=await readFile("app/storage-dashboard.tsx","utf8");
if (!workspace.includes("modo demonstração isolado") || !storageDashboard.includes("O padrão exclui registros sintéticos") || !storageDashboard.includes("Incluir dados sintéticos neste backup")) throw new Error("Política atual de demonstração e backup sintéticos ausente.");
console.log(`[ok] ${required.length} componentes do Marco 2 verificados`);

``

# END FILE: scripts/verify-marco2.mjs

---

# FILE: scripts/verify-marco3.mjs

``javascript
import {access,readFile} from "node:fs/promises";
const required=["src/contracts/longitudinal.ts","src/contracts/sharing.ts","src/domain/longitudinal-factories.ts","src/domain/sharing-policy.ts","src/domain/care-selectors.ts","app/person-care-panel.tsx"];
for(const p of required)await access(p);
const panel=await readFile("app/person-care-panel.tsx","utf8");
for(const phrase of ["Resumo de acompanhamento","O prontuário completo permanece na unidade de saúde","Passagem 30 s","Transcrição","Voltar ao modo profissional"])if(!panel.includes(phrase))throw new Error(`Fluxo ausente: ${phrase}`);
console.log(`[ok] ${required.length} componentes do Marco 3 verificados`);

``

# END FILE: scripts/verify-marco3.mjs

---

# FILE: scripts/verify-marco4.mjs

``javascript
import {access,readFile} from "node:fs/promises";
const required=["src/clinical/types.ts","src/clinical/sources.ts","src/clinical/content.ts","src/clinical/validation.ts","app/clinical-library.tsx"];
for(const p of required)await access(p);
const content=await readFile("src/clinical/content.ts","utf8");for(const id of ["has","dm2","drc","dyslipidemia","obesity"])if(!content.includes(`id:"${id}"`))throw new Error(`Condição ausente: ${id}`);
if(!content.includes('doseStatus:"not-published"'))throw new Error("Trava de dose ausente");
const sources=await readFile("src/clinical/sources.ts","utf8");if(!sources.includes('status:"preliminary"'))throw new Error("Fonte preliminar não marcada");
console.log(`[ok] ${required.length} componentes do Marco 4 verificados`);

``

# END FILE: scripts/verify-marco4.mjs

---

# FILE: scripts/verify-marco5.mjs

``javascript
import{access,readFile}from"node:fs/promises";const required=["src/contracts/relations.ts","src/domain/relation-factories.ts","src/domain/diagram-engine.ts","src/domain/diagram-prompt.ts","app/family-relations.tsx"];for(const p of required)await access(p);const panel=await readFile("app/family-relations.tsx","utf8");for(const x of ["Genograma","Ecomapa","Narrativa","Prompt IA","Descrição textual acessível","Exportar SVG"])if(!panel.includes(x))throw new Error(`Fluxo ausente: ${x}`);console.log(`[ok] ${required.length} componentes do Marco 5 verificados`);

``

# END FILE: scripts/verify-marco5.mjs

---

# FILE: scripts/verify-marco6.mjs

``javascript
import{access,readFile}from"node:fs/promises";const required=["src/contracts/journey.ts","src/domain/journey-factories.ts","src/domain/journey-report.ts","src/domain/semester-close.ts","app/journey-dashboard.tsx"];for(const p of required)await access(p);const panel=await readFile("app/journey-dashboard.tsx","utf8");for(const x of ["Reflexão","Competência","Feedback","Relatório","Criar snapshot e encerrar","Adendo","Expectativa não é limite"])if(!panel.includes(x))throw new Error(`Fluxo ausente: ${x}`);console.log(`[ok] ${required.length} componentes do Marco 6 verificados`);

``

# END FILE: scripts/verify-marco6.mjs

---

# FILE: scripts/verify-marco7.mjs

``javascript
import { access, readFile } from "node:fs/promises";
import { evaluateMarco7Decision } from "./marco7-policy.mjs";

const required = [
  "src/audit/types.ts",
  "src/audit/gates.ts",
  "app/release-audit.tsx",
  "docs/audit/RELEASE_DECISION.json",
  "docs/audit/AUDIT_REPORT.md",
  "docs/audit/DEVICE_TEST_MATRIX.md",
  "docs/audit/INSTITUTIONAL_GATE.md",
  "next.config.ts",
];

for (const path of required) await access(path);
const decision = JSON.parse(await readFile("docs/audit/RELEASE_DECISION.json", "utf8"));
const result = evaluateMarco7Decision(decision);
if (!result.valid) throw new Error(`Marco 7 inválido:\n${result.errors.join("\n")}`);

console.log(`[ok] ${required.length} componentes do Marco 7 verificados; decisão ${decision.decision}`);

``

# END FILE: scripts/verify-marco7.mjs

---

# FILE: scripts/verify-synthetic-data.mjs

``javascript
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

``

# END FILE: scripts/verify-synthetic-data.mjs

---

# FILE: scripts/wave-b-adversarial.ts

``typescript
import {createSyntheticBackup,corruptStore,futureSchema,removeStore,tamperCiphertext,validateBackupPure} from "../src/backup/adversarial";
import {protectBackup,unprotectBackup} from "../src/backup/crypto";
import {STORES} from "../src/storage/schema";
import {checksumOf} from "../src/storage/hash";
function assert(value:unknown,message:string){if(!value)throw new Error(message)}
let passed=0;async function test(name:string,fn:()=>unknown|Promise<unknown>){await fn();passed++;console.log(`[pass] ${name}`)}
const valid=await createSyntheticBackup({records:[{id:"synthetic",payload:{ok:true}}]});
await test("backup sintético válido",async()=>assert((await validateBackupPure(valid)).valid,"backup válido rejeitado"));
await test("corrupção de store detectada",async()=>assert(!(await validateBackupPure(corruptStore(valid,STORES.records))).valid,"corrupção aceita"));
await test("store ausente detectada",async()=>assert(!(await validateBackupPure(removeStore(valid,STORES.events))).valid,"store ausente aceita"));
await test("schema futuro rejeitado",async()=>assert(!(await validateBackupPure(futureSchema(valid))).valid,"schema futuro aceito"));
await test("checksum global adulterado rejeitado",async()=>{const copy=structuredClone(valid);copy.appVersion="adulterado";assert(!(await validateBackupPure(copy)).valid,"checksum global aceito")});
await test("ordem de objetos não altera checksum",async()=>assert(await checksumOf({b:2,a:1})===await checksumOf({a:1,b:2}),"canonicalização instável"));
const protectedBackup=await protectBackup(JSON.stringify(valid),"frase-secreta-sintetica");
await test("backup protegido abre com senha correta",async()=>assert((await unprotectBackup(protectedBackup,"frase-secreta-sintetica")).includes("mapa-backup"),"decrypt falhou"));
await test("senha incorreta rejeitada",async()=>{let rejected=false;try{await unprotectBackup(protectedBackup,"frase-secreta-incorreta")}catch{rejected=true}assert(rejected,"senha incorreta aceita")});
await test("ciphertext adulterado rejeitado",async()=>{let rejected=false;try{await unprotectBackup({...protectedBackup,ciphertext:tamperCiphertext(protectedBackup.ciphertext)},"frase-secreta-sintetica")}catch{rejected=true}assert(rejected,"ciphertext adulterado aceito")});
await test("senha curta recusada",async()=>{let rejected=false;try{await protectBackup("{}","curta")}catch{rejected=true}assert(rejected,"senha curta aceita")});
console.log(`[ok] Wave B adversarial: ${passed} testes`);

``

# END FILE: scripts/wave-b-adversarial.ts

---

# FILE: scripts/wave-c-audit.ts

``typescript
import {claimReviewRows,clinicalReviewReadiness,medicationReviewRows} from "../src/clinical/review";import {clinicalSources} from "../src/clinical/sources";import {validateClinicalLibrary} from "../src/clinical/validation";
function assert(v:unknown,m:string){if(!v)throw new Error(m)}let n=0;function test(name:string,fn:()=>void){fn();n++;console.log(`[pass] ${name}`)}
const claims=claimReviewRows(),meds=medicationReviewRows(),status=clinicalReviewReadiness();
test("35 afirmações inventariadas",()=>assert(claims.length===35,`claims=${claims.length}`));
test("cinco blocos farmacológicos inventariados",()=>assert(meds.length===5,`meds=${meds.length}`));
test("nenhuma dose publicada",()=>assert(meds.every(m=>m.doseStatus==="not-published"),"dose publicada"));
test("toda medicação exige auditoria por produto",()=>assert(meds.every(m=>m.productAuditRequired),"auditoria ausente"));
test("fontes referenciadas existem",()=>assert(validateClinicalLibrary().valid,"biblioteca inválida"));
test("fonte preliminar não é promovida",()=>assert(clinicalSources.filter(s=>s.status==="preliminary").every(s=>claims.filter(c=>c.sourceIds.includes(s.id)).every(c=>c.decision==="blocked-preliminary-source")),"preliminar promovida"));
test("gate clínico permanece fechado",()=>assert(!status.ready,"gate indevidamente aberto"));
test("revisão independente ainda não falsificada",()=>assert(claims.every(c=>!c.reviewer&&!c.reviewedAt),"revisor fictício"));
console.log(`[ok] Wave C audit: ${n} testes; ${status.claims} claims; ${status.medications} blocos farmacológicos`);

``

# END FILE: scripts/wave-c-audit.ts

---

# FILE: scripts/wave-d-pilot.ts

``typescript
import{writeFileSync}from"node:fs";import{runWaveDSimulation}from"../src/domain/wave-d-simulation";
const result=await runWaveDSimulation();writeFileSync("docs/release/WAVE_D_RESULT.json",JSON.stringify(result,null,2)+"\n");writeFileSync("docs/release/WAVE_D_PILOT_REPORT.txt",result.report+"\n");for(const c of result.checks)console.log(`[${c.passed?"pass":"fail"}] ${c.id}: ${c.evidence}`);if(result.failed)process.exit(1);console.log(`[ok] Wave D: ${result.passed}/${result.checks.length}; ${result.semesterChecksum}`);

``

# END FILE: scripts/wave-d-pilot.ts

---

# FILE: scripts/wave-d-release-council.ts

``typescript
import{readFileSync,writeFileSync}from"node:fs";import{clinicalReviewReadiness}from"../src/clinical/review";
const pilot=JSON.parse(readFileSync("docs/release/WAVE_D_RESULT.json","utf8"));const clinical=clinicalReviewReadiness();const gates=[{id:"synthetic-pilot",passed:pilot.failed===0},{id:"clinical-signoff",passed:clinical.ready},{id:"institutional-authorization",passed:false},{id:"official-build",passed:false},{id:"physical-devices",passed:false},{id:"live-db-protection",passed:false}];const decision=gates.every(g=>g.passed)?"GO":"NO-GO";const out={generatedAt:new Date().toISOString(),decision,realDataAllowed:decision==="GO",syntheticDemoAllowed:pilot.failed===0,gates};writeFileSync("docs/release/WAVE_D_RELEASE_DECISION.json",JSON.stringify(out,null,2)+"\n");console.log(JSON.stringify(out));

``

# END FILE: scripts/wave-d-release-council.ts

---

# FILE: SECURITY.md

``markdown
# Política de Segurança do Projeto

## Não use dados reais neste marco

O Marco 0 é exclusivamente de fundação. Não registre nomes, documentos, endereços, contatos, diagnósticos ou resultados reais.

## Relato de vulnerabilidade

Não abra issue pública contendo dados de saúde ou informações exploráveis. Registre o problema em canal privado do mantenedor quando definido.

## Princípios

- minimização;
- local-first;
- sem logs clínicos;
- sem dados reais em previews;
- validação antes de restauração;
- falha segura;
- testes de regressão para perda e vazamento.

``

# END FILE: SECURITY.md

---

# FILE: src/audit/gates.ts

``typescript
import type { AuditGate } from "./types";

export const auditGates: AuditGate[] = [
  {
    id: "production-build",
    area: "build",
    title: "Pipeline oficial de produção",
    status: "passed",
    severity: "critical",
    evidence: ["npm install concluído", "typecheck concluído", "build otimizado concluído"],
    blocking: false,
    owner: "engenharia",
    nextAction: "Reexecutar o pipeline depois de alterações estruturais.",
  },
  {
    id: "local-device",
    area: "device",
    title: "Ambiente local de uso",
    status: "passed",
    severity: "critical",
    evidence: ["Aplicação validada no dispositivo de destino", "proteção nativa do dispositivo aceita pelo responsável"],
    blocking: false,
    owner: "responsável local",
    nextAction: "Manter bloqueio do sistema operacional e backups protegidos.",
  },
  {
    id: "backup-resilience",
    area: "persistence",
    title: "Persistência, backup e restauração",
    status: "passed",
    severity: "critical",
    evidence: ["checksums implementados", "restauração atômica implementada", "suíte adversarial 10/10 aprovada"],
    blocking: false,
    owner: "engenharia",
    nextAction: "Gerar backups protegidos regularmente.",
  },
  {
    id: "local-security",
    area: "security",
    title: "Segurança local proporcional",
    status: "passed",
    severity: "high",
    evidence: ["PBKDF2 com salt", "bloqueio por inatividade", "backup AES-GCM", "CSP diferenciada entre desenvolvimento e produção"],
    blocking: false,
    owner: "responsável local",
    nextAction: "Reavaliar o modelo se o escopo ou o dispositivo mudar.",
  },
  {
    id: "accessibility-baseline",
    area: "accessibility",
    title: "Base de acessibilidade",
    status: "passed",
    severity: "high",
    evidence: ["HTML semântico", "labels e foco presentes", "auditoria estática aprovada"],
    blocking: false,
    owner: "produto",
    nextAction: "Preservar teclado, contraste e zoom durante futuras alterações.",
  },
  {
    id: "synthetic-pilot",
    area: "clinical",
    title: "Piloto sintético integral",
    status: "passed",
    severity: "critical",
    evidence: ["Onda D 13/13 aprovada", "duas famílias e fluxos longitudinais validados"],
    blocking: false,
    owner: "produto/testes",
    nextAction: "Usar o cenário sintético para regressão.",
  },
];

export function releaseDecision() {
  const passed = auditGates.filter((gate) => gate.status === "passed").length;
  return {
    generatedAt: "2026-09-27T23:59:00-03:00",
    candidate: "1.0.3",
    scope: "local-academic",
    realDataAllowed: false,
    decision: "GO LOCAL",
    passed,
    blocked: 0,
    failed: 0,
    manual: 0,
    gates: auditGates,
  } as const;
}

``

# END FILE: src/audit/gates.ts

---

# FILE: src/audit/types.ts

``typescript
export type GateStatus="passed"|"failed"|"blocked"|"manual"|"not-applicable";
export interface AuditGate{id:string;area:"build"|"security"|"privacy"|"accessibility"|"persistence"|"clinical"|"pharmacology"|"institutional"|"device";title:string;status:GateStatus;severity:"critical"|"high"|"moderate"|"low";evidence:string[];blocking:boolean;owner:string;nextAction:string;}
export interface ReleaseDecision{generatedAt:string;candidate:string;realDataAllowed:boolean;decision:"NO-GO"|"CONDITIONAL-GO"|"GO";passed:number;blocked:number;failed:number;manual:number;gates:AuditGate[];}

``

# END FILE: src/audit/types.ts

---

# FILE: src/backup/adversarial.ts

``typescript
import { checksumOf } from "@/src/storage/hash";
import { MAPA_DB_VERSION, STORES, type StoreName } from "@/src/storage/schema";
import { BACKUP_FORMAT, BACKUP_VERSION, type BackupPayload, type BackupValidation } from "./types";

const storeNames=Object.values(STORES) as StoreName[];
export async function createSyntheticBackup(stores?:Partial<Record<StoreName,unknown[]>>):Promise<BackupPayload>{
 const complete={} as Record<StoreName,unknown[]>;const checks={} as Record<StoreName,string>;
 for(const name of storeNames){complete[name]=structuredClone(stores?.[name]??[]);checks[name]=await checksumOf(complete[name])}
 const base: Omit<BackupPayload, "payloadChecksum">={format:BACKUP_FORMAT,version:BACKUP_VERSION,schemaVersion:MAPA_DB_VERSION,createdAt:new Date(0).toISOString(),appVersion:"synthetic-adversarial",protected:false as const,stores:complete,storeChecksums:checks};
 return{...base,payloadChecksum:await checksumOf(base)}
}
export async function validateBackupPure(backup:BackupPayload):Promise<BackupValidation>{
 const errors:string[]=[];const warnings:string[]=[];const counts:Partial<Record<StoreName,number>>={};
 if(backup.format!==BACKUP_FORMAT)errors.push("Formato de backup desconhecido.");
 if(backup.version!==BACKUP_VERSION)errors.push("Versão de backup não suportada.");
 if(backup.schemaVersion>MAPA_DB_VERSION)errors.push("O backup exige uma versão mais nova do aplicativo.");
 if(!backup.stores||!backup.storeChecksums)errors.push("Estrutura de stores ausente.");
 if(backup.stores&&backup.storeChecksums)for(const store of storeNames){const records=backup.stores[store];if(!Array.isArray(records)){errors.push(`Store ausente: ${store}.`);continue}counts[store]=records.length;if(await checksumOf(records)!==backup.storeChecksums[store])errors.push(`Integridade inválida em ${store}.`)}
 const{payloadChecksum,...base}=backup;if(await checksumOf(base)!==payloadChecksum)errors.push("Checksum global inválido.");
 if(backup.schemaVersion<MAPA_DB_VERSION)warnings.push("O backup será migrado antes da restauração.");
 if(backup.stores?.records){
  const records=backup.stores.records as Array<{entityType?:string;payload?:Record<string, unknown> }>;
  const families=new Set(records.filter((record)=>record.entityType==="family").map((record)=>record.payload?.id));
  const people=new Set(records.filter((record)=>record.entityType==="person").map((record)=>record.payload?.id));
  const memberships=records.filter((record)=>record.entityType==="family-membership").map((record)=>record.payload);
  for(const record of records.filter((entry)=>entry.entityType==="instrument-application")){
   const application=record.payload;
   if(!application?.applicationId||typeof application.familyId!=="string"||typeof application.personId!=="string")errors.push("Aplicação de instrumento incompleta.");
   if(typeof application?.familyId==="string"&&!families.has(application.familyId))errors.push(`Aplicação ${String(application.applicationId??"desconhecida")} referencia família inexistente.`);
   if(typeof application?.personId==="string"&&!people.has(application.personId))errors.push(`Aplicação ${String(application.applicationId??"desconhecida")} referencia pessoa inexistente.`);
   if(typeof application?.familyId==="string"&&typeof application.personId==="string"&&!memberships.some((membership)=>membership?.familyId===application.familyId&&membership?.personId===application.personId))errors.push(`Aplicação ${String(application.applicationId??"desconhecida")} referencia vínculo inexistente.`);
  }
 }
 return{valid:errors.length===0,protected:false,errors,warnings,counts}
}
export function tamperCiphertext(value:string):string{if(!value)return value;const index=Math.floor(value.length/2);return value.slice(0,index)+(value[index]==="A"?"B":"A")+value.slice(index+1)}
export function futureSchema(backup:BackupPayload):BackupPayload{return{...structuredClone(backup),schemaVersion:MAPA_DB_VERSION+1}}
export function removeStore(backup:BackupPayload,store:StoreName):BackupPayload{const copy=structuredClone(backup) as BackupPayload;delete (copy.stores as Partial<Record<StoreName,unknown[]>>)[store];return copy}
export function corruptStore(backup:BackupPayload,store:StoreName):BackupPayload{const copy=structuredClone(backup);copy.stores[store]=[...copy.stores[store],{corrupted:true}];return copy}

``

# END FILE: src/backup/adversarial.ts

---

# FILE: src/backup/crypto.ts

``typescript
import { base64ToBytes, bytesToBase64 } from "@/src/security/encoding";
import type { ProtectedBackup } from "./types";
import { BACKUP_FORMAT, BACKUP_VERSION } from "./types";

const ITERATIONS = 310_000;

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return Uint8Array.from(bytes).buffer;
}

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: asArrayBuffer(salt), iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function protectBackup(plainText: string, passphrase: string): Promise<ProtectedBackup> {
  if (passphrase.length < 12) throw new Error("A senha do backup protegido deve ter pelo menos 12 caracteres.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt, ITERATIONS);
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: asArrayBuffer(iv) }, key, new TextEncoder().encode(plainText));
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    protected: true,
    createdAt: new Date().toISOString(),
    algorithm: "AES-GCM",
    keyDerivation: "PBKDF2-SHA-256",
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(cipher)),
  };
}

export async function unprotectBackup(backup: ProtectedBackup, passphrase: string): Promise<string> {
  const key = await deriveKey(passphrase, base64ToBytes(backup.salt), backup.iterations);
  try {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: asArrayBuffer(base64ToBytes(backup.iv)) },
      key,
      asArrayBuffer(base64ToBytes(backup.ciphertext)),
    );
    return new TextDecoder().decode(plain);
  } catch {
    throw new Error("Não foi possível abrir o backup. A senha pode estar incorreta ou o arquivo pode ter sido alterado.");
  }
}

``

# END FILE: src/backup/crypto.ts

---

# FILE: src/backup/service.ts

``typescript
import { canonicalJson, checksumOf } from "@/src/storage/hash";
import { getAllValues, replaceAllStores } from "@/src/storage/idb";
import { MAPA_DB_VERSION, STORES, type StoreName } from "@/src/storage/schema";
import { protectBackup, unprotectBackup } from "./crypto";
import { DEMO_SESSION_META_ID } from "@/src/contracts/demo";
import { excludeSyntheticDemoRecords, getDemoSession } from "@/src/domain/demo-mode";
import { validateBackupPure } from "./adversarial";
import { migrateBackup } from "@/src/clinical/assessments/migration";
import {
  BACKUP_FORMAT,
  BACKUP_VERSION,
  type AnyBackup,
  type BackupPayload,
  type BackupValidation,
  type ProtectedBackup,
} from "./types";

const storeNames = Object.values(STORES) as StoreName[];

export interface BackupOptions { includeSynthetic?: boolean; }

export async function createBackup(options: BackupOptions = {}): Promise<BackupPayload> {
  const stores = {} as Record<StoreName, unknown[]>;
  const storeChecksums = {} as Record<StoreName, string>;
  for (const store of storeNames) stores[store] = await getAllValues(store);

  if (!options.includeSynthetic) {
    const session = await getDemoSession();
    if (session) {
      stores[STORES.records] = session.snapshotRecords;
      stores[STORES.drafts] = session.snapshotDrafts;
      stores[STORES.events] = session.snapshotEvents;
    }
    stores[STORES.records] = excludeSyntheticDemoRecords(stores[STORES.records]);
    stores[STORES.meta] = stores[STORES.meta].filter((record) => (record as { id?: string }).id !== DEMO_SESSION_META_ID);
  }

  for (const store of storeNames) storeChecksums[store] = await checksumOf(stores[store]);
  const payloadBase: Omit<BackupPayload, "payloadChecksum"> = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    schemaVersion: MAPA_DB_VERSION,
    createdAt: new Date().toISOString(),
    appVersion: "0.1.0-marco.1",
    protected: false as const,
    stores,
    storeChecksums,
  };
  return { ...payloadBase, payloadChecksum: await checksumOf(payloadBase) };
}

export async function serializeBackup(passphrase?: string, options: BackupOptions = {}): Promise<string> {
  const plain = canonicalJson(await createBackup(options));
  return passphrase ? JSON.stringify(await protectBackup(plain, passphrase), null, 2) : JSON.stringify(JSON.parse(plain), null, 2);
}

export async function decodeBackup(text: string, passphrase?: string): Promise<BackupPayload> {
  let parsed = JSON.parse(text) as AnyBackup;
  if (parsed.protected) {
    if (!passphrase) throw new Error("Este backup é protegido e exige senha.");
    parsed = JSON.parse(await unprotectBackup(parsed as ProtectedBackup, passphrase)) as BackupPayload;
  }
  return parsed as BackupPayload;
}

export const validateBackup = validateBackupPure;

export async function restoreBackup(backup: BackupPayload): Promise<BackupValidation> {
  const migrated = await migrateBackup(backup);
  const validation = await validateBackup(migrated);
  if (!validation.valid) return validation;
  // A substituição ocorre em uma única transação: ou todos os stores avançam, ou nenhum avança.
  await replaceAllStores(migrated.stores);
  return validation;
}

``

# END FILE: src/backup/service.ts

---

# FILE: src/backup/types.ts

``typescript
import type { StoreName } from "@/src/storage/schema";

export const BACKUP_FORMAT = "mapa-backup";
export const BACKUP_VERSION = 1;

export interface BackupPayload {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  schemaVersion: number;
  createdAt: string;
  appVersion: string;
  protected: false;
  stores: Record<StoreName, unknown[]>;
  storeChecksums: Record<StoreName, string>;
  payloadChecksum: string;
}

export interface ProtectedBackup {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  protected: true;
  createdAt: string;
  algorithm: "AES-GCM";
  keyDerivation: "PBKDF2-SHA-256";
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
}

export type AnyBackup = BackupPayload | ProtectedBackup;

export interface BackupValidation {
  valid: boolean;
  protected: boolean;
  errors: string[];
  warnings: string[];
  counts?: Partial<Record<StoreName, number>>;
}

``

# END FILE: src/backup/types.ts

---

# FILE: src/clinical/assessments/application.ts

``typescript
import type { Family, FamilyMembership, Person } from "@/src/contracts/family";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { getDemoSession } from "@/src/domain/demo-session";
import { listEntities } from "@/src/domain/repository";
import { checksumOf } from "@/src/storage/hash";
import { getAllValues, getValue, putValue } from "@/src/storage/idb";
import { STORES, type StoredEnvelope } from "@/src/storage/schema";
import { adultDcntEsfDefinition } from "./instruments/adult-dcnt-esf/definition";
import {
  type AnswerSource,
  type AssessmentStatus,
  type DerivedAssessmentResult,
  type InstrumentAnswer,
  type InstrumentApplication,
  type InstrumentDefinition,
  type VisibilityMetadata,
} from "./types";
import { calculateBmi, calculateBloodPressureMean, classifyBmi, classifyWaistCircumference, deriveAdultAgeBand } from "./calculations";
import {
  validateApplicationAnswers,
  validateInstrumentApplication,
} from "./validation";

export const APPLICATION_SCHEMA_VERSION = 1;
export const APPLICATION_ENTITY_TYPE = ENTITY_TYPES.instrumentApplication;

const defaultVisibility: VisibilityMetadata = {
  scope: "individual",
  clinicalVisibility: "academic-private",
  personVisibility: "shareable-with-person",
  familyVisibility: "non-exportable",
  reviewRequired: true,
  projectionStrategy: "clinical-academic",
};

function now(): string {
  return new Date().toISOString();
}

function applicationDefinition(application: InstrumentApplication): InstrumentDefinition {
  if (application.instrumentId === adultDcntEsfDefinition.id && application.instrumentVersion === adultDcntEsfDefinition.version) {
    return adultDcntEsfDefinition;
  }
  throw new Error(`Instrumento ou versão não disponível: ${application.instrumentId}@${application.instrumentVersion}`);
}

async function assertPersonInFamily(familyId: string, personId: string): Promise<void> {
  const [families, people, memberships] = await Promise.all([
    listEntities<Family>(ENTITY_TYPES.family),
    listEntities<Person>(ENTITY_TYPES.person),
    listEntities<FamilyMembership>(ENTITY_TYPES.membership),
  ]);
  const family = families.find((candidate) => candidate.id === familyId);
  const person = people.find((candidate) => candidate.id === personId);
  if (!family) throw new Error(`Família inexistente: ${familyId}`);
  if (!person) throw new Error(`Pessoa inexistente: ${personId}`);
  if (!memberships.some((membership) => membership.familyId === familyId && membership.personId === personId)) {
    throw new Error("A pessoa não pertence à família informada.");
  }
}

async function readApplication(applicationId: string): Promise<InstrumentApplication | undefined> {
  const record = await getValue<StoredEnvelope<InstrumentApplication>>(STORES.records, applicationId);
  if (record?.entityType !== APPLICATION_ENTITY_TYPE) return undefined;
  if (record.checksum && record.checksum !== await checksumOf(record.payload)) throw new Error("A aplicação está corrompida.");
  return record.payload;
}

async function persist(application: InstrumentApplication, previous?: InstrumentApplication): Promise<InstrumentApplication> {
  const session = await getDemoSession();
  if (session) {
    if (previous && previous.dataOrigin !== "synthetic-demo") throw new Error("Aplicações normais estão isoladas durante a demonstração.");
    application = { ...application, dataOrigin: "synthetic-demo" };
  }
  const structural = validateInstrumentApplication(application);
  if (!structural.valid) throw new Error(structural.errors.join(" "));
  const envelope: StoredEnvelope<InstrumentApplication> = {
    id: application.applicationId,
    entityType: APPLICATION_ENTITY_TYPE,
    payload: application,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    recordVersion: application.revisionNumber,
    checksum: await checksumOf(application),
  };
  await putValue(STORES.records, envelope);
  const readBack = await getValue<StoredEnvelope<InstrumentApplication>>(STORES.records, application.applicationId);
  if (!readBack || readBack.checksum !== envelope.checksum || (await checksumOf(readBack.payload)) !== envelope.checksum) {
    throw new Error("A aplicação não passou pela verificação de integridade.");
  }
  return application;
}

export function transitionApplicationStatus(current: AssessmentStatus, next: AssessmentStatus): boolean {
  const transitions: Record<AssessmentStatus, AssessmentStatus[]> = {
    "not-started": ["draft"],
    draft: ["in-review", "archived"],
    "in-review": ["draft", "completed"],
    completed: ["rectified", "archived"],
    rectified: ["archived"],
    archived: [],
  };
  return transitions[current].includes(next);
}

export async function createApplication(input: {
  familyId: string;
  personId: string;
  assessmentDate: string;
  kind?: "initial" | "reassessment";
  instrument?: InstrumentDefinition;
}): Promise<InstrumentApplication> {
  const definition = input.instrument ?? adultDcntEsfDefinition;
  if (definition.id !== adultDcntEsfDefinition.id || definition.version !== adultDcntEsfDefinition.version) {
    throw new Error(`Instrumento ou versão não disponível: ${definition.id}@${definition.version}`);
  }
  await assertPersonInFamily(input.familyId, input.personId);
  const timestamp = now();
  const application: InstrumentApplication = {
    applicationId: `assessment_${crypto.randomUUID()}`,
    instrumentId: definition.id,
    instrumentVersion: definition.version,
    familyId: input.familyId,
    personId: input.personId,
    assessmentDate: input.assessmentDate,
    status: "draft",
    kind: input.kind ?? "initial",
    answers: {},
    applicabilityOverrides: {},
    createdAt: timestamp,
    updatedAt: timestamp,
    revisionNumber: 1,
    provenance: { origin: "digital-adaptation", sourceNote: "Aplicação individual criada a partir da definição versionada do instrumento." },
    visibility: defaultVisibility,
    dataOrigin: (await getDemoSession()) ? "synthetic-demo" : "normal",
    schemaVersion: APPLICATION_SCHEMA_VERSION,
  };
  return persist(application);
}

export async function getApplication(applicationId: string): Promise<InstrumentApplication | undefined> {
  return readApplication(applicationId);
}

export async function listApplicationsByPerson(personId: string, instrumentId?: string): Promise<InstrumentApplication[]> {
  const records = await getAllValues<StoredEnvelope<InstrumentApplication>>(STORES.records);
  return records
    .filter((record) => record.entityType === APPLICATION_ENTITY_TYPE && record.payload.personId === personId && (!instrumentId || record.payload.instrumentId === instrumentId))
    .map((record) => record.payload)
    .sort((left, right) => right.assessmentDate.localeCompare(left.assessmentDate) || right.updatedAt.localeCompare(left.updatedAt));
}

export async function listApplicationsByFamilyMetadata(familyId: string): Promise<import("./types").FamilyAssessmentStatusProjection[]> {
  const records = await getAllValues<StoredEnvelope<InstrumentApplication>>(STORES.records);
  return records
    .filter((record) => record.entityType === APPLICATION_ENTITY_TYPE && record.payload.familyId === familyId)
    .map(({ payload }) => ({
      familyId: payload.familyId,
      personId: payload.personId,
      applicationId: payload.applicationId,
      status: payload.status,
      assessmentDate: payload.assessmentDate,
      pendingCount: 0,
      hasDomainProposals: false,
    }));
}

export async function updateDraftApplication(
  applicationId: string,
  changes: { answers?: Record<string, InstrumentAnswer>; applicabilityOverrides?: InstrumentApplication["applicabilityOverrides"]; privateNotes?: string; waistCriterion?: InstrumentApplication["waistCriterion"] },
): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  if (current.status !== "draft" && current.status !== "in-review") throw new Error("Aplicação concluída ou arquivada não pode ser sobrescrita.");
  const next = { ...current, ...changes, ...(changes.privateNotes === undefined ? {} : { privateNotes: changes.privateNotes }), ...(changes.waistCriterion === undefined ? {} : { waistCriterion: changes.waistCriterion }), answers: changes.answers ?? current.answers, applicabilityOverrides: changes.applicabilityOverrides ?? current.applicabilityOverrides, updatedAt: now(), revisionNumber: current.revisionNumber + 1 };
  const validation = validateApplicationAnswers(next, applicationDefinition(next), "draft");
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  return persist(next, current);
}

export async function submitForReview(applicationId: string): Promise<InstrumentApplication> {
  return transitionApplication(applicationId, "in-review");
}

export async function returnApplicationToDraft(applicationId: string): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  if (!transitionApplicationStatus(current.status, "draft")) throw new Error(`Transição inválida: ${current.status} → draft`);
  return persist({ ...current, status: "draft", updatedAt: now(), revisionNumber: current.revisionNumber + 1 }, current);
}

export async function completeApplication(applicationId: string): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  if (current.status !== "in-review") throw new Error("Somente aplicações em revisão podem ser concluídas.");
  const validation = validateApplicationAnswers(current, applicationDefinition(current), "complete");
  if (!validation.valid) throw new Error([...validation.errors, ...(validation.missing ?? []).map((id) => `${id}: dado ausente`)].join(" "));
  const completedAt = now();
  return persist({ ...current, status: "completed", completedAt, updatedAt: completedAt, revisionNumber: current.revisionNumber + 1 }, current);
}

async function transitionApplication(applicationId: string, status: "draft" | "in-review" | "archived"): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  if (!transitionApplicationStatus(current.status, status)) throw new Error(`Transição inválida: ${current.status} → ${status}`);
  return persist({ ...current, status, updatedAt: now(), revisionNumber: current.revisionNumber + 1 }, current);
}

export async function archiveApplication(applicationId: string): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  if (!transitionApplicationStatus(current.status, "archived")) throw new Error(`Transição inválida: ${current.status} → archived`);
  return persist({ ...current, status: "archived", updatedAt: now(), revisionNumber: current.revisionNumber + 1 }, current);
}

export async function createRectification(applicationId: string): Promise<InstrumentApplication> {
  const original = await getApplication(applicationId);
  if (!original) throw new Error("Aplicação original inexistente.");
  if (original.status !== "completed" && original.status !== "rectified") throw new Error("Somente aplicações concluídas podem ser retificadas.");
  await assertPersonInFamily(original.familyId, original.personId);
  const timestamp = now();
  const { completedAt: _completedAt, rectifiedAt: _rectifiedAt, ...withoutCompletion } = original;
  return persist({
    ...withoutCompletion,
    applicationId: `assessment_${crypto.randomUUID()}`,
    status: "draft",
    kind: "rectification",
    answers: structuredClone(original.answers),
    applicabilityOverrides: structuredClone(original.applicabilityOverrides),
    createdAt: timestamp,
    updatedAt: timestamp,
    rectifiesApplicationId: original.applicationId,
    revisionNumber: original.revisionNumber + 1,
    provenance: { origin: "digital-adaptation", sourceNote: `Retificação da aplicação ${original.applicationId}.` },
  });
}

export async function saveAnswer(
  applicationId: string,
  answer: InstrumentAnswer,
): Promise<InstrumentApplication> {
  const current = await getApplication(applicationId);
  if (!current) throw new Error("Aplicação inexistente.");
  return updateDraftApplication(applicationId, { answers: { ...current.answers, [answer.questionId]: answer } });
}

export function createAnswer<T extends InstrumentAnswer>(answer: T, source: AnswerSource = "person"): T {
  return { ...answer, source, status: answer.status ?? "answered", answeredAt: answer.answeredAt ?? now(), updatedAt: now() } as T;
}

export function deriveApplicationResults(application: InstrumentApplication): DerivedAssessmentResult[] {
  const results: DerivedAssessmentResult[] = [];
  const answerValue = (questionId: string): unknown => application.answers[questionId]?.value;
  const birthDate = answerValue("header.birth-date");
  if (typeof birthDate === "string") {
    const result = deriveAdultAgeBand(birthDate, application.assessmentDate);
    results.push({
      id: `${application.applicationId}:sociodemographic.age`,
      applicationId: application.applicationId,
      subjectPersonId: application.personId,
      familyId: application.familyId,
      questionId: "sociodemographic.age",
      value: result,
      rule: { id: "derive-adult-age-band-v1", version: "1", inputs: ["header.birth-date", "header.assessment-date"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: false },
      provenance: { origin: "mathematical-derivation", sourceNote: "Derivado dos dados da própria aplicação." },
      reviewRequired: false,
    });
  }
  const weight = answerValue("physical.weight");
  const height = answerValue("physical.height");
  if (typeof weight === "number" && typeof height === "number") {
    results.push({
      id: `${application.applicationId}:physical.bmi`,
      applicationId: application.applicationId,
      subjectPersonId: application.personId,
      familyId: application.familyId,
      questionId: "physical.bmi",
      value: { bmi: calculateBmi(weight, height), classification: classifyBmi(calculateBmi(weight, height)) },
      unit: "kg/m²",
      rule: { id: "derive-bmi-v1", version: "1", inputs: ["physical.weight", "physical.height"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: false },
      provenance: { origin: "mathematical-derivation", sourceNote: "Derivado dos dados da própria aplicação." },
      reviewRequired: false,
    });
  }
  const readings = ["blood-pressure.visit-1.systolic", "blood-pressure.visit-2.systolic"]
    .map((questionId, index) => {
      const prefix = `blood-pressure.visit-${index + 1}`;
      const systolic = answerValue(`${prefix}.systolic`);
      const diastolic = answerValue(`${prefix}.diastolic`);
      if (systolic && typeof systolic === "object" && "systolic" in systolic) return { systolic: systolic.systolic, diastolic: typeof diastolic === "object" && diastolic && "diastolic" in diastolic ? diastolic.diastolic : undefined };
      return undefined;
    })
    .filter((value): value is { systolic: number; diastolic: number } => Boolean(value && typeof value.systolic === "number" && typeof value.diastolic === "number"));
  if (readings.length === 2) {
    const firstReading = readings[0];
    const secondReading = readings[1];
    if (!firstReading || !secondReading) return results;
    results.push({
      id: `${application.applicationId}:blood-pressure.mean`,
      applicationId: application.applicationId,
      subjectPersonId: application.personId,
      familyId: application.familyId,
      questionId: "blood-pressure.mean",
      value: calculateBloodPressureMean([firstReading, secondReading]),
      unit: "mmHg",
      rule: { id: "derive-blood-pressure-mean-v1", version: "1", inputs: ["blood-pressure.visit-1.systolic", "blood-pressure.visit-1.diastolic", "blood-pressure.visit-2.systolic", "blood-pressure.visit-2.diastolic"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: false },
      provenance: { origin: "mathematical-derivation", sourceNote: "Média aritmética das aferições informadas." },
      reviewRequired: false,
    });
  }
  const waist = answerValue("physical.waist-circumference");
  if (typeof waist === "number" && application.waistCriterion && application.waistCriterion !== "not-selected") {
    results.push({
      id: `${application.applicationId}:physical.waist-classification`,
      applicationId: application.applicationId,
      subjectPersonId: application.personId,
      familyId: application.familyId,
      questionId: "physical.waist-classification",
      value: classifyWaistCircumference(waist, application.waistCriterion),
      unit: "cm",
      rule: { id: "classify-waist-local-rule-v1", version: "1", inputs: ["physical.waist-circumference"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: true, algorithm: application.waistCriterion },
      provenance: { origin: "mathematical-derivation", sourceNote: "Classificação calculada pelo critério local explicitamente selecionado." },
      reviewRequired: true,
    });
  }
  return results;
}

``

# END FILE: src/clinical/assessments/application.ts

---

# FILE: src/clinical/assessments/calculations.ts

``typescript
import type { EcomapScope } from "./types";

export type AdultAgeBand = "age-18-29" | "age-30-44" | "age-45-59" | "age-60-79" | "age-80-plus";

export interface AdultAgeResult {
  ageYears: number;
  eligible: boolean;
  band?: AdultAgeBand;
}

function parseDate(value: string): Date {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`Data inválida: ${value}`);
  }
  return parsed;
}

export function deriveAdultAgeBand(birthDate: string, assessmentDate: string): AdultAgeResult {
  const birth = parseDate(birthDate);
  const assessment = parseDate(assessmentDate);
  if (assessment < birth) throw new Error("A data da avaliação não pode ser anterior ao nascimento.");
  let ageYears = assessment.getUTCFullYear() - birth.getUTCFullYear();
  const birthdayNotReached = assessment.getUTCMonth() < birth.getUTCMonth()
    || (assessment.getUTCMonth() === birth.getUTCMonth() && assessment.getUTCDate() < birth.getUTCDate());
  if (birthdayNotReached) ageYears -= 1;
  if (ageYears < 18) return { ageYears, eligible: false };
  if (ageYears < 30) return { ageYears, eligible: true, band: "age-18-29" };
  if (ageYears < 45) return { ageYears, eligible: true, band: "age-30-44" };
  if (ageYears < 60) return { ageYears, eligible: true, band: "age-45-59" };
  if (ageYears < 80) return { ageYears, eligible: true, band: "age-60-79" };
  return { ageYears, eligible: true, band: "age-80-plus" };
}

export type BmiClassification = "underweight" | "normal" | "overweight" | "obesity-i" | "obesity-ii" | "obesity-iii";

export function calculateBmi(weightKg: number, heightM: number): number {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightM) || weightKg <= 0 || heightM <= 0) {
    throw new Error("Peso e altura devem ser números finitos maiores que zero.");
  }
  const bmi = weightKg / (heightM ** 2);
  if (!Number.isFinite(bmi)) throw new Error("IMC inválido.");
  return bmi;
}

export function classifyBmi(bmi: number): BmiClassification {
  if (!Number.isFinite(bmi) || bmi < 0) throw new Error("IMC inválido.");
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  if (bmi < 35) return "obesity-i";
  if (bmi < 40) return "obesity-ii";
  return "obesity-iii";
}

export type WaistCriterion = "male-local-rule" | "female-local-rule" | "not-selected";
export type WaistClassification = "low" | "increased" | "very-increased";

export function classifyWaistCircumference(measurementCm: number, criterion: WaistCriterion): WaistClassification | undefined {
  if (!Number.isFinite(measurementCm) || measurementCm <= 0) throw new Error("A circunferência deve ser finita e maior que zero.");
  if (criterion === "not-selected") return undefined;
  const increasedLimit = criterion === "male-local-rule" ? 94 : 80;
  const veryIncreasedLimit = criterion === "male-local-rule" ? 102 : 88;
  if (measurementCm < increasedLimit) return "low";
  if (measurementCm <= veryIncreasedLimit) return "increased";
  return "very-increased";
}

export interface BloodPressureReading {
  systolic: number;
  diastolic: number;
}

export interface BloodPressureMean {
  systolicMean: number;
  diastolicMean: number;
}

export function calculateBloodPressureMean(readings: [BloodPressureReading, BloodPressureReading] | undefined): BloodPressureMean | undefined {
  if (!readings) return undefined;
  for (const reading of readings) {
    if (!Number.isFinite(reading.systolic) || !Number.isFinite(reading.diastolic) || reading.systolic <= 0 || reading.diastolic <= 0) {
      throw new Error("Cada aferição deve conter sistólica e diastólica finitas maiores que zero.");
    }
  }
  return {
    systolicMean: (readings[0].systolic + readings[1].systolic) / 2,
    diastolicMean: (readings[0].diastolic + readings[1].diastolic) / 2,
  };
}

export function isSelectedMembersScopeValid(scope: EcomapScope, relatedPersonIds: string[]): boolean {
  return scope === "family" ? relatedPersonIds.length === 0 : relatedPersonIds.length > 0;
}

``

# END FILE: src/clinical/assessments/calculations.ts

---

# FILE: src/clinical/assessments/facts.ts

``typescript
import { adultDcntEsfDefinition } from "./instruments/adult-dcnt-esf/definition";
import {
  type CareFact,
  type CareFactCategory,
  type CareFactDerivationResult,
  type CareFactDerivationType,
  type InstrumentAnswer,
  type InstrumentApplication,
  type InstrumentDefinition,
  type LongitudinalFactChange,
  type LongitudinalChangeType,
  type ServiceRelationshipState,
} from "./types";
import { calculateBloodPressureMean, calculateBmi, classifyBmi, classifyWaistCircumference, deriveAdultAgeBand } from "./calculations";
import { validateApplicationAnswers } from "./validation";

export const CARE_FACT_VERSION = "1";
const sourceLimitationDefinitions = [
  ["source-missing-block-3", "Bloco 3 não disponível."],
  ["source-missing-block-4", "Bloco 4 não disponível."],
  ["source-missing-block-5", "Bloco 5 não disponível."],
  ["family-diagrams-and-clinical-observations", "Bloco 8 disponível somente pelo título."],
  ["cardiovascular-risk-algorithm", "Algoritmo de risco cardiovascular ausente."],
  ["blood-pressure-control-threshold", "Limiar automático de controle de PA ausente."],
  ["cervical-overlap", "Sobreposição das categorias do rastreamento cervical preservada."],
  ["mammography-overlap-gap", "Sobreposição ou lacuna das categorias de mamografia preservada."],
  ["bone-densitometry-overlap", "Sobreposição semântica da densitometria preservada."],
  ["colorectal-method", "Método colorretal não distinguido na ficha."],
  ["tacs-acs", "TACS/ACS permanece ambíguo na fonte."],
  ["occupation-selection-mode", "Cardinalidade da ocupação aguarda validação."],
] as const;

const individualDefaults = {
  subjectScope: "individual" as const,
  clinicalVisibility: "visible" as const,
  personVisibility: "visible-after-review" as const,
  familyVisibility: "operational-status-only" as const,
};

function stableId(applicationId: string, key: string): string {
  return `${applicationId}:fact:${key}`;
}

function answer(application: InstrumentApplication, questionId: string): InstrumentAnswer | undefined {
  const value = application.answers[questionId];
  return value && value.status === "answered" && value.applicabilityState !== "not-applicable" ? value : undefined;
}

function rawAnswer(application: InstrumentApplication, questionId: string): InstrumentAnswer | undefined {
  return application.answers[questionId];
}

function valueOf(application: InstrumentApplication, questionId: string): unknown {
  return answer(application, questionId)?.value;
}

function selected(application: InstrumentApplication, questionId: string): string[] {
  const value = valueOf(application, questionId);
  return Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
}

function fact(
  application: InstrumentApplication,
  key: string,
  input: Omit<CareFact, "factId" | "factVersion" | "applicationId" | "instrumentId" | "instrumentVersion" | "familyId" | "personId" | "recordedAt">,
): CareFact {
  return {
    factId: stableId(application.applicationId, key),
    factVersion: CARE_FACT_VERSION,
    applicationId: application.applicationId,
    instrumentId: application.instrumentId,
    instrumentVersion: application.instrumentVersion,
    familyId: application.familyId,
    personId: application.personId,
    recordedAt: application.updatedAt,
    ...(application.rectifiesApplicationId ? { rectifiesApplicationId: application.rectifiesApplicationId } : {}),
    ...input,
  };
}

function reported(
  application: InstrumentApplication,
  key: string,
  questionId: string,
  topic: string,
  value: unknown,
  category: CareFactCategory,
  options: Partial<CareFact> = {},
): CareFact {
  return fact(application, key, {
    factType: "reported",
    derivationType: "reported",
    sourceQuestionIds: [questionId],
    category,
    topic,
    value,
    certaintyState: "reported",
    reviewStatus: "needs-review",
    ...individualDefaults,
    actionable: false,
    provenance: { origin: "digital-adaptation", sourceNote: `Resposta informada na aplicação ${application.applicationId}.` },
    ...options,
  });
}

function measured(
  application: InstrumentApplication,
  key: string,
  questionIds: string[],
  topic: string,
  value: unknown,
  unit: string,
  category: CareFactCategory = "measurement",
  occurredAt = application.assessmentDate,
): CareFact {
  return fact(application, key, {
    factType: "measured",
    derivationType: "measured",
    sourceQuestionIds: questionIds,
    category,
    topic,
    value,
    unit,
    occurredAt,
    certaintyState: "measured",
    reviewStatus: "needs-review",
    ...individualDefaults,
    actionable: false,
    provenance: { origin: "printed-local-form", sourceNote: "Medida registrada na aplicação individual." },
  });
}

function calculated(
  application: InstrumentApplication,
  key: string,
  questionIds: string[],
  topic: string,
  value: unknown,
  ruleId: string,
  unit?: string,
  actionable = false,
  reviewStatus: CareFact["reviewStatus"] = "auto-derived",
): CareFact {
  return fact(application, key, {
    factType: "calculated",
    derivationType: "calculated",
    sourceQuestionIds: questionIds,
    category: "calculated-result",
    topic,
    value,
    ...(unit ? { unit } : {}),
    ruleId,
    ruleVersion: "1",
    certaintyState: "calculated",
    reviewStatus,
    ...individualDefaults,
    actionable,
    provenance: { origin: "mathematical-derivation", sourceNote: "Derivação determinística sem interpretação clínica adicional." },
  });
}

function missing(
  application: InstrumentApplication,
  questionId: string,
  topic: string,
  reason: string,
  applicabilityState: CareFact["applicabilityState"] = "incomplete",
): CareFact {
  return fact(application, `missing:${questionId}`, {
    factType: "missing-information",
    derivationType: "missing-information",
    sourceQuestionIds: [questionId],
    category: "missing-data",
    topic,
    value: { questionId, reason },
    certaintyState: "missing",
    reviewStatus: "needs-review",
    ...individualDefaults,
    actionable: true,
    applicabilityState,
    provenance: { origin: "digital-adaptation", sourceNote: reason },
  });
}

function addAnswerFacts(application: InstrumentApplication, facts: CareFact[]): void {
  const addReported = (questionId: string, topic: string, category: CareFactCategory, options?: Partial<CareFact>) => {
    const value = valueOf(application, questionId);
    if (value !== undefined) facts.push(reported(application, questionId, questionId, topic, value, category, options));
  };
  addReported("sociodemographic.self-declared-race", "self-declared-race", "demographic");
  addReported("sociodemographic.marital-status", "marital-status", "demographic");
  addReported("sociodemographic.education", "education", "demographic");
  addReported("sociodemographic.current-occupation", "occupation", "social-context");
  const income = valueOf(application, "sociodemographic.family-income-per-capita");
  if (income !== undefined) {
    facts.push(fact(application, "family-income", {
      factType: "reported", derivationType: "reported", sourceQuestionIds: ["sociodemographic.family-income-per-capita"],
      subjectScope: "family-context", category: "family-context", topic: "family-income-per-capita", value: income,
      certaintyState: "reported", reviewStatus: "needs-review", clinicalVisibility: "visible",
      personVisibility: "visible-after-review", familyVisibility: "operational-status-only", actionable: true,
      provenance: { origin: "digital-adaptation", sourceNote: "Contexto familiar informado em aplicação individual; não é promovido automaticamente." },
    }));
  }
  const conditions = selected(application, "health.diagnosed-chronic-conditions");
  const otherDescription = valueOf(application, "health.other-chronic-condition-description");
  for (const condition of conditions) {
    if (condition === "other" && typeof otherDescription !== "string") continue;
    facts.push(reported(application, `condition:${condition}`, "health.diagnosed-chronic-conditions", "reported-condition", condition === "other" ? { option: condition, description: otherDescription } : condition, "reported-condition", { actionable: true }));
  }
  const chronicFollowUp = valueOf(application, "health.chronic-disease-follow-up-exams");
  if (chronicFollowUp !== undefined) {
    addReported("health.chronic-disease-follow-up-exams", "chronic-disease-follow-up", "screening", { actionable: chronicFollowUp === "no" });
    if (chronicFollowUp === "no") facts.push(fact(application, "care-follow-up:chronic-exams", {
      factType: "care-follow-up", derivationType: "care-follow-up", sourceQuestionIds: ["health.chronic-disease-follow-up-exams"],
      category: "care-follow-up", topic: "chronic-disease-exams-not-reported",
      value: "not-reported-as-completed", certaintyState: "reported", reviewStatus: "needs-review",
      ...individualDefaults, actionable: true, provenance: { origin: "digital-adaptation", sourceNote: "Gerado a partir da resposta negativa da ficha." },
    }));
  }
  const bpFollowUp = valueOf(application, "health.hypertension-blood-pressure-follow-up");
  if (bpFollowUp !== undefined) {
    addReported("health.hypertension-blood-pressure-follow-up", "hypertension-blood-pressure-follow-up", "screening", { actionable: bpFollowUp === "no" });
    if (bpFollowUp === "no") facts.push(fact(application, "care-follow-up:blood-pressure", {
      factType: "care-follow-up", derivationType: "care-follow-up", sourceQuestionIds: ["health.hypertension-blood-pressure-follow-up"],
      category: "care-follow-up", topic: "blood-pressure-follow-up",
      value: "not-reported-as-recent", certaintyState: "reported", reviewStatus: "needs-review",
      ...individualDefaults, actionable: true, provenance: { origin: "digital-adaptation", sourceNote: "Não afirma descontrole da pressão." },
    }));
  }
  for (const questionId of ["screening.cervical-preventive", "screening.mammography", "screening.bone-densitometry", "screening.colorectal-cancer"]) {
    const raw = rawAnswer(application, questionId);
    const value = valueOf(application, questionId);
    if (value === undefined) continue;
    const uncertain = value === "does-not-remember";
    const never = value === "never";
    facts.push(reported(application, `screening:${questionId}`, questionId, questionId, {
      response: value,
      applicabilityState: raw?.applicabilityState ?? "applicable",
      override: application.applicabilityOverrides[questionId],
    }, "screening", {
      actionable: uncertain || never,
      certaintyState: uncertain ? "uncertain" : "reported",
      ...(uncertain ? { provenance: { origin: "digital-adaptation", sourceNote: "Não recorda não foi convertido em não realizado." } } : {}),
    }));
    if (never) facts.push(fact(application, `care-follow-up:${questionId}`, {
      factType: "care-follow-up", derivationType: "care-follow-up", sourceQuestionIds: [questionId],
      category: "care-follow-up", topic: `${questionId}:follow-up`,
      value: "never-reported", certaintyState: "reported", reviewStatus: "needs-review",
      ...individualDefaults, actionable: true, provenance: { origin: "digital-adaptation", sourceNote: "Categoria da própria ficha; não é ordem clínica." },
    }));
  }
  for (const id of ["physical.weight", "physical.height"]) {
    const value = valueOf(application, id);
    if (typeof value === "number") facts.push(measured(application, id, [id], id, value, id.endsWith("weight") ? "kg" : "m"));
  }
  const hba1c = valueOf(application, "laboratory.hba1c.value");
  if (typeof hba1c === "number") facts.push(measured(application, "hba1c", ["laboratory.hba1c.value", "laboratory.hba1c.date"].filter((id) => Boolean(rawAnswer(application, id))), "hba1c", hba1c, "%", "measurement", typeof valueOf(application, "laboratory.hba1c.date") === "string" ? valueOf(application, "laboratory.hba1c.date") as string : application.assessmentDate));
  for (const visit of [1, 2] as const) {
    const systolic = valueOf(application, `blood-pressure.visit-${visit}.systolic`);
    const diastolic = valueOf(application, `blood-pressure.visit-${visit}.diastolic`);
    if (typeof systolic === "object" && systolic && "systolic" in systolic && typeof (systolic as { systolic?: unknown }).systolic === "number"
      && typeof diastolic === "object" && diastolic && "diastolic" in diastolic && typeof (diastolic as { diastolic?: unknown }).diastolic === "number") {
      facts.push(measured(application, `blood-pressure:${visit}`, [`blood-pressure.visit-${visit}.systolic`, `blood-pressure.visit-${visit}.diastolic`, `blood-pressure.visit-${visit}.date`].filter((id) => Boolean(rawAnswer(application, id))), `blood-pressure.visit-${visit}`, { systolic: (systolic as { systolic: number }).systolic, diastolic: (diastolic as { diastolic: number }).diastolic }, "mmHg", "measurement", typeof valueOf(application, `blood-pressure.visit-${visit}.date`) === "string" ? valueOf(application, `blood-pressure.visit-${visit}.date`) as string : application.assessmentDate));
    }
  }
  const control = valueOf(application, "blood-pressure.control");
  if (control !== undefined) facts.push(reported(application, "manual:blood-pressure-control", "blood-pressure.control", "blood-pressure-control", control, "manual-classification", { factType: "manually-classified", derivationType: "manually-classified", certaintyState: "manual", actionable: true }));
  const risk = valueOf(application, "cardiovascular-risk");
  if (risk !== undefined) facts.push(reported(application, "manual:cardiovascular-risk", "cardiovascular-risk", "cardiovascular-risk", risk, "manual-classification", { factType: "manually-classified", derivationType: "manually-classified", certaintyState: "manual", actionable: true }));
  for (const id of ["foot.skin-and-deformity-findings", "foot.neuropathy-screening", "foot.right.dorsalis-pedis-pulse", "foot.right.posterior-tibial-pulse", "foot.left.dorsalis-pedis-pulse", "foot.left.posterior-tibial-pulse"]) {
    const value = valueOf(application, id);
    if (value === undefined) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) facts.push(reported(application, `foot:${id}:${item}`, id, id, { finding: item, ...(id.includes(".right.") ? { laterality: "right" } : {}), ...(id.includes(".left.") ? { laterality: "left" } : {}) }, "foot-assessment", { actionable: item === "active-ulceration" || item === "one-or-more-insensitive-areas" || item === "not-palpable" }));
  }
  const services = selected(application, "summary.services");
  for (const service of services) {
    const serviceValue = service === "other-service" ? valueOf(application, "summary.other-service-description") : service;
    if (service === "other-service" && typeof serviceValue !== "string") continue;
    facts.push(fact(application, `service:${service}`, {
      factType: "proposed-domain-change", derivationType: "proposed-domain-change", sourceQuestionIds: ["summary.services", ...(service === "other-service" ? ["summary.other-service-description"] : [])],
      category: "service-or-referral", topic: "service-proposal",
      value: { service: serviceValue, proposedScope: "selected-members", relatedPersonIds: [application.personId] },
      certaintyState: "reported", reviewStatus: "needs-review", ...individualDefaults, actionable: true,
      provenance: { origin: "digital-adaptation", sourceNote: "Proposta individual; não cria vínculo ativo nem atualiza ecomapa." },
      relatedPersonIds: [application.personId],
      status: "suggested" satisfies ServiceRelationshipState,
    }));
  }
  const ciap = valueOf(application, "summary.ciap-2");
  if (ciap !== undefined) facts.push(reported(application, "manual:ciap-2", "summary.ciap-2", "ciap-2", ciap, "manual-classification", { factType: "manually-classified", derivationType: "manually-classified", certaintyState: "manual", actionable: false }));
}

export function deriveCareFacts(application: InstrumentApplication, definition: InstrumentDefinition = adultDcntEsfDefinition): CareFactDerivationResult {
  const errors: CareFactDerivationResult["errors"] = [];
  if (application.instrumentId !== definition.id || application.instrumentVersion !== definition.version) {
    errors.push({ code: "unsupported-instrument", message: `Definição incompatível com ${application.instrumentId}@${application.instrumentVersion}.` });
    return { facts: [], errors };
  }
  const structural = validateApplicationAnswers(application, definition, "draft");
  if (!structural.valid) {
    errors.push(...structural.errors.map((message) => ({ code: "invalid-application" as const, message })));
    return { facts: [], errors };
  }
  const facts: CareFact[] = [];
  addAnswerFacts(application, facts);
  const birthDate = valueOf(application, "header.birth-date");
  if (typeof birthDate === "string") {
    const age = deriveAdultAgeBand(birthDate, application.assessmentDate);
    facts.push(calculated(application, "age", ["header.birth-date", "header.assessment-date"], "age-at-assessment", age.ageYears, "derive-adult-age-band-v1", "years"));
    if (age.band) facts.push(calculated(application, "age-band", ["header.birth-date", "header.assessment-date"], "age-band", age.band, "derive-adult-age-band-v1"));
  }
  const weight = valueOf(application, "physical.weight");
  const height = valueOf(application, "physical.height");
  if (typeof weight === "number" && typeof height === "number") {
    const bmi = calculateBmi(weight, height);
    facts.push(calculated(application, "bmi", ["physical.weight", "physical.height"], "bmi", { value: bmi, classification: classifyBmi(bmi) }, "calculate-bmi-v1", "kg/m²"));
  }
  const waist = valueOf(application, "physical.waist-circumference");
  if (typeof waist === "number") {
    facts.push(measured(application, "waist", ["physical.waist-circumference"], "waist-circumference", waist, "cm"));
    if (application.waistCriterion && application.waistCriterion !== "not-selected") {
      facts.push(calculated(application, "waist-classification", ["physical.waist-circumference"], "waist-classification", { classification: classifyWaistCircumference(waist, application.waistCriterion), criterion: application.waistCriterion }, "classify-waist-local-rule-v1", "cm", false, "needs-review"));
    } else {
      facts.push(fact(application, "limitation:waist-criterion", {
        factType: "source-limitation", derivationType: "source-limitation", sourceQuestionIds: ["physical.waist-circumference"],
        subjectScope: "individual", category: "source-limitation", topic: "waist-classification-criterion",
        value: "criterion-not-selected", certaintyState: "limited", reviewStatus: "needs-review",
        clinicalVisibility: "visible", personVisibility: "hidden", familyVisibility: "hidden", actionable: false,
        provenance: { origin: "digital-adaptation", sourceNote: "Não inferir critério local." },
      }));
    }
  }
  const readings = facts.filter((item) => item.topic.startsWith("blood-pressure.") && item.factType === "measured").map((item) => item.value as { systolic: number; diastolic: number });
  if (readings.length === 2) facts.push(calculated(application, "blood-pressure-mean", ["blood-pressure.visit-1.systolic", "blood-pressure.visit-1.diastolic", "blood-pressure.visit-2.systolic", "blood-pressure.visit-2.diastolic"], "blood-pressure-mean", calculateBloodPressureMean(readings as [{ systolic: number; diastolic: number }, { systolic: number; diastolic: number }]), "calculate-blood-pressure-mean-v1", "mmHg"));
  for (const [id, label] of sourceLimitationDefinitions) {
    facts.push(fact(application, `source-limitation:${id}`, {
      factType: "source-limitation", derivationType: "source-limitation", sourceQuestionIds: [],
      subjectScope: "individual", category: "source-limitation", topic: id, value: label,
      certaintyState: "limited", reviewStatus: "needs-review", clinicalVisibility: "visible", personVisibility: "hidden", familyVisibility: "hidden", actionable: false,
      provenance: { origin: "pending-clinical-source", sourceNote: label },
    }));
  }
  if (application.status === "in-review" || application.status === "completed" || application.status === "rectified") {
    for (const question of definition.questions) {
      const raw = rawAnswer(application, question.id);
      if (question.required && !raw && !application.applicabilityOverrides[question.id]) {
        facts.push(missing(application, question.id, question.id, "Pergunta aplicável esperada sem resposta."));
      } else if (raw?.status === "unanswered" || raw?.applicabilityState === "incomplete") {
        facts.push(missing(application, question.id, question.id, "Resposta marcada como incompleta."));
      } else if (raw?.applicabilityState === "not-assessed") {
        facts.push(missing(application, question.id, question.id, "Pergunta não foi avaliada.", "not-assessed"));
      }
    }
  }
  return { facts: facts.sort((left, right) => left.factId.localeCompare(right.factId)), errors };
}

export const deriveAssessmentFacts = deriveCareFacts;

export function factsForApplication(facts: CareFact[], applicationId: string): CareFact[] {
  return facts.filter((item) => item.applicationId === applicationId);
}

export function factsForCurrentRevision(facts: CareFact[], applicationId: string): CareFact[] {
  return factsForApplication(facts, applicationId).filter((item) => item.reviewStatus !== "superseded" && !item.invalidatedAt);
}

export function clinicalVisibleFacts(facts: CareFact[]): CareFact[] {
  return facts.filter((item) => item.clinicalVisibility !== "hidden");
}

export function personVisibleFactsAfterReview(facts: CareFact[]): CareFact[] {
  return facts.filter((item) => item.personVisibility !== "hidden" && (item.personVisibility !== "visible-after-review" || ["reviewed", "confirmed"].includes(item.reviewStatus)));
}

export function operationalFamilyFacts(facts: CareFact[]): CareFact[] {
  const visible = facts.filter((item) => item.familyVisibility !== "hidden");
  return visible.map((item) => ({
    ...item,
    topic: "assessment-operational-status",
    value: { actionable: item.actionable, hasProposal: item.derivationType === "proposed-domain-change" },
    sourceQuestionIds: [],
    clinicalVisibility: "summary-only",
    personVisibility: "hidden",
  }));
}

export function actionableFacts(facts: CareFact[]): CareFact[] { return facts.filter((item) => item.actionable && !item.invalidatedAt && item.reviewStatus !== "superseded"); }
export function missingInformationFacts(facts: CareFact[]): CareFact[] { return facts.filter((item) => item.factType === "missing-information"); }
export function proposedChanges(facts: CareFact[]): CareFact[] { return facts.filter((item) => item.factType === "proposed-domain-change"); }
export function sourceLimitations(facts: CareFact[]): CareFact[] { return facts.filter((item) => item.factType === "source-limitation"); }

export function supersedeFacts(oldFacts: CareFact[], replacementApplicationId: string, invalidatedAt: string, reason = "Substituído por retificação."): CareFact[] {
  return oldFacts.map((item) => item.applicationId !== replacementApplicationId ? item : {
    ...item,
    reviewStatus: "superseded",
    invalidatedAt,
    invalidationReason: reason,
  });
}

export const invalidateFactsForRectification = supersedeFacts;

function comparable(factItem: CareFact): string {
  return JSON.stringify({ topic: factItem.topic, value: factItem.value, unit: factItem.unit, applicabilityState: factItem.applicabilityState, status: factItem.status });
}

export function longitudinalChanges(previous: CareFact[], current: CareFact[]): LongitudinalFactChange[] {
  const left = new Map(previous.map((item) => [item.topic, item]));
  const right = new Map(current.map((item) => [item.topic, item]));
  const topics = [...new Set([...left.keys(), ...right.keys()])].sort();
  return topics.map((topic) => {
    const before = left.get(topic);
    const after = right.get(topic);
    let changeType: LongitudinalChangeType = "unchanged";
    if (!before && after) changeType = after.factType === "missing-information" ? "newly-missing" : "added";
    else if (before && !after) changeType = before.factType === "missing-information" ? "resolved-missing" : "removed";
    else if (before && after && comparable(before) !== comparable(after)) changeType = "changed";
    return { topic, changeType, ...(before ? { previous: before } : {}), ...(after ? { current: after } : {}) };
  });
}

``

# END FILE: src/clinical/assessments/facts.ts

---

# FILE: src/clinical/assessments/index.ts

``typescript
export * from "./types";
export * from "./calculations";
export * from "./validation";
export * from "./application";
export * from "./facts";
export * from "./migration";
export { adultDcntEsfDefinition } from "./instruments/adult-dcnt-esf/definition";

``

# END FILE: src/clinical/assessments/index.ts

---

# FILE: src/clinical/assessments/instruments/adult-dcnt-esf/definition.ts

``typescript
import type {
  InstrumentAmbiguity,
  InstrumentDefinition,
  OptionDefinition,
  QuestionDefinition,
  SectionDefinition,
  VisibilityMetadata,
} from "../../types";

const printed: VisibilityMetadata = {
  scope: "individual",
  clinicalVisibility: "academic-private",
  personVisibility: "shareable-with-person",
  familyVisibility: "non-exportable",
  reviewRequired: true,
  projectionStrategy: "clinical-academic",
};
const familyContext: VisibilityMetadata = {
  scope: "family-context",
  clinicalVisibility: "academic-private",
  personVisibility: "shareable-with-person",
  familyVisibility: "shareable-with-family",
  reviewRequired: true,
  projectionStrategy: "operational-family-status",
};
const administrative: VisibilityMetadata = {
  scope: "individual",
  clinicalVisibility: "administrative",
  personVisibility: "shareable-with-person",
  familyVisibility: "administrative",
  reviewRequired: true,
  projectionStrategy: "operational-family-status",
};

function options(values: Array<[string, string, string?]>): OptionDefinition[] {
  return values.map(([id, label, academicLabel], order) => ({
    id,
    label,
    value: id,
    order,
    ...(academicLabel ? { academicLabel } : {}),
  }));
}

function question(
  id: string,
  sectionId: string,
  printedLabel: string,
  answerType: QuestionDefinition["answerType"],
  configuration: Partial<QuestionDefinition> = {},
): QuestionDefinition {
  return {
    id,
    sectionId,
    printedLabel,
    academicLabel: printedLabel,
    personFriendlyLabel: printedLabel,
    answerType,
    required: false,
    options: [],
    visibility: printed,
    sensitivity: "clinical",
    provenance: { origin: "printed-local-form", sourceNote: "Instrumento local da ESF da preceptora; página 28." },
    ...configuration,
  };
}

const yesNo = options([["yes", "Sim"], ["no", "Não"]]);
const yesNoNeverRemember = options([
  ["yes", "Sim"],
  ["no", "Não"],
  ["never", "Nunca fez"],
  ["does-not-remember", "Não recorda"],
]);
const derivedFromBirthAndAssessment = {
  id: "derive-adult-age-band-v1",
  version: "1",
  inputs: ["header.birth-date", "header.assessment-date"],
  resultType: "calculated-information" as const,
  sourceType: "automatic" as const,
  origin: "mathematical-derivation" as const,
  automaticCalculation: true,
  requiresClinicalReview: false,
};

const headerQuestions: QuestionDefinition[] = [
  question("header.person-name", "header", "Nome da pessoa", "short-text", {
    visibility: { ...printed, personVisibility: "shareable-with-person" },
    sensitivity: "personal",
    provenance: { origin: "digital-adaptation", sourceNote: "Preenchimento futuro a partir do cadastro canônico da pessoa." },
    notes: "Não duplicar silenciosamente o cadastro canônico.",
  }),
  question("header.cpf", "header", "CPF", "short-text", {
    visibility: { ...printed, personVisibility: "non-exportable", familyVisibility: "non-exportable" },
    sensitivity: "identifier",
    notes: "Opcional até confirmação do fluxo; não usar em fixtures reais nem validar externamente.",
  }),
  question("header.birth-date", "header", "Data de nascimento", "date", {
    sensitivity: "personal",
    provenance: { origin: "digital-adaptation", sourceNote: "Proveniente futuramente do cadastro da pessoa; usada para derivar idade." },
  }),
  question("header.health-unit", "header", "Unidade de Saúde, UBS", "short-text", {
    visibility: familyContext,
    sensitivity: "ordinary",
    provenance: { origin: "printed-local-form", sourceNote: "Referência de cuidado do formulário local." },
    notes: "Não criar vínculo ativo automaticamente.",
  }),
  question("header.community-health-worker", "header", "TACS/ACS", "short-text", {
    visibility: familyContext,
    sensitivity: "ordinary",
    provenance: { origin: "printed-local-form", sourceNote: "Sigla preservada exatamente como aparece na ficha." },
  }),
  question("header.assessment-date", "header", "Data da avaliação", "date", {
    sensitivity: "ordinary",
    visibility: administrative,
    provenance: { origin: "digital-adaptation", sourceNote: "Uma data por aplicação; o papel exibe primeira e segunda avaliação." },
    notes: "Aplicações futuras não ficam limitadas a duas.",
  }),
];

const profileQuestions: QuestionDefinition[] = [
  question("sociodemographic.age", "sociodemographic-profile", "Idade", "calculated-information", {
    options: options([
      ["age-18-29", "18 a 29 anos"],
      ["age-30-44", "30 a 44 anos"],
      ["age-45-59", "45 a 59 anos"],
      ["age-60-79", "60 a 79 anos"],
      ["age-80-plus", "80 anos ou mais"],
    ]),
    derivation: derivedFromBirthAndAssessment,
    provenance: { origin: "mathematical-derivation", sourceNote: "Derivada da data de nascimento e da data da avaliação." },
    notes: "Abaixo de 18 anos retorna fora da população; não limita idades superiores.",
  }),
  question("sociodemographic.self-declared-race", "sociodemographic-profile", "Cor/Raça Autodeclarada", "single-choice", {
    options: options([
      ["white", "Branca"], ["black", "Preta"], ["brown", "Parda"], ["yellow", "Amarela"], ["indigenous", "Indígena"],
    ]),
    provenance: { origin: "printed-local-form", sourceNote: "Autodeclaração conforme formulário local." },
    sensitivity: "sensitive-personal",
  }),
  question("sociodemographic.marital-status", "sociodemographic-profile", "Estado Civil Atual", "single-choice", {
    options: options([
      ["single", "Solteiro(a)"], ["married-or-stable-union", "Casado(a) / União Estável"], ["divorced", "Divorciado(a)"],
      ["separated", "Separado(a)"], ["widowed", "Viúvo(a)"],
    ]),
    sensitivity: "personal",
  }),
  question("sociodemographic.education", "sociodemographic-profile", "Escolaridade", "single-choice", {
    options: options([
      ["illiterate", "Analfabeto"], ["elementary-incomplete", "Fundamental incompleto"], ["elementary-complete", "Fundamental completo"],
      ["secondary-incomplete", "Médio incompleto"], ["secondary-complete", "Médio completo"], ["higher-incomplete", "Superior incompleto"],
      ["higher-complete", "Superior completo"],
    ]),
    sensitivity: "personal",
  }),
  question("sociodemographic.current-occupation", "sociodemographic-profile", "Ocupação Atual", "multiple-choice", {
    options: options([
      ["retired", "Aposentado(a)"], ["unemployed", "Desempregado(a)"], ["self-employed", "Autônomo(a)"], ["student", "Estudante"],
      ["formally-employed", "Trabalhador com carteira"], ["informal-worker", "Informal"], ["homemaker", "Dono(a) de casa"], ["public-servant", "Servidor público"],
    ]),
    sensitivity: "personal",
    provenance: { origin: "pending-preceptor-validation", sourceNote: "Caixas de seleção da ficha; modelado provisoriamente como múltipla escolha." },
  }),
  question("sociodemographic.family-income-per-capita", "sociodemographic-profile", "Renda Familiar Per Capita", "single-choice", {
    options: options([
      ["below-quarter-minimum-wage", "Abaixo de 1/4 SM"], ["quarter-to-half-minimum-wage", "Entre 1/4 e 1/2 SM"],
      ["half-to-one-minimum-wage", "Entre 1/2 e 1 SM"], ["one-to-two-minimum-wages", "Entre 1 e 2 SM"],
      ["two-to-three-minimum-wages", "Entre 2 e 3 SM"], ["above-three-minimum-wages", "Acima de 3 SM"],
      ["prefers-not-to-answer", "Prefere não responder"],
    ]),
    visibility: familyContext,
    sensitivity: "sensitive-personal",
    provenance: { origin: "printed-local-form", sourceNote: "Ficha local; referência relativa ao salário mínimo de 2026." },
    notes: "Referência: BRL 1.621,00, ano 2026. Guardar ano e valor na aplicação futura; não calcular nesta fundação.",
  }),
];

const healthQuestions: QuestionDefinition[] = [
  question("health.diagnosed-chronic-conditions", "current-health-and-screenings", "Doenças Crônicas Diagnosticadas", "multiple-choice", {
    options: options([
      ["hypertension", "Hipertensão Arterial"], ["diabetes-mellitus", "Diabetes Mellitus"], ["thyroid-disease", "Doença da Tireoide"],
      ["psychiatric-disorders", "Doenças Psiquiátricas"], ["chronic-kidney-disease", "Doença Renal Crônica"], ["cancer", "Câncer"],
      ["heart-disease", "Doença Cardíaca (ex.: Insuficiência Cardíaca)"], ["asthma-or-chronic-pulmonary-disease", "Asma ou Doença Pulmonar Crônica (ex.: DPOC)"],
      ["neurological-or-neurodegenerative-disease", "Doenças Neurológicas/Neurodegenerativas"], ["traumatic-or-musculoskeletal-condition", "Traumatológicas (ex.: Artrose e Discopatia)"],
      ["rheumatic-or-autoimmune-disease", "Doença Reumática/Autoimune"], ["other", "Outra"],
    ]),
    notes: "Efeito futuro: proposal-only; não criar condição permanente automaticamente.",
  }),
  question("health.other-chronic-condition-description", "current-health-and-screenings", "Descrição de outra doença crônica", "long-text", {
    applicability: { condition: "health.diagnosed-chronic-conditions contains other", dependencies: ["health.diagnosed-chronic-conditions"], whenNotApplicable: "not-applicable", manualReviewAllowed: true },
    visibility: { ...printed, familyVisibility: "non-exportable" },
    provenance: { origin: "digital-adaptation", sourceNote: "Complemento digital necessário para a opção Outra." },
    notes: "Efeito futuro: proposal-only.",
  }),
  question("health.chronic-disease-follow-up-exams", "current-health-and-screenings", "Realizou exames de acompanhamento da doença crônica no último ano?", "yes-no", {
    options: yesNo,
    applicability: { condition: "health.diagnosed-chronic-conditions contains at least one option", dependencies: ["health.diagnosed-chronic-conditions"], whenNotApplicable: "not-applicable", manualReviewAllowed: true },
  }),
  question("health.hypertension-blood-pressure-follow-up", "current-health-and-screenings", "Se Hipertenso: teve a pressão arterial aferida nos últimos 6 meses?", "yes-no", {
    options: yesNo,
    applicability: { condition: "health.diagnosed-chronic-conditions contains hypertension", dependencies: ["health.diagnosed-chronic-conditions"], whenNotApplicable: "not-applicable", manualReviewAllowed: true },
  }),
  question("screening.cervical-preventive", "current-health-and-screenings", "MULHER 25-64 ANOS, Preventivo Colo do Útero", "yes-no-never-did-does-not-remember", {
    options: options([["less-than-one-year", "menos de 1 ano"], ["less-than-three-years", "há menos de 3 anos"], ["more-than-three-years", "mais de 3 anos"], ["never", "nunca fez"], ["does-not-remember", "não recorda"]]),
    applicability: { condition: "local suggestion: woman, 25-64 years; anatomy is not inferred automatically", dependencies: [], whenNotApplicable: "manual-review", manualReviewAllowed: true },
    provenance: { origin: "printed-local-form", sourceNote: "Regra de aplicabilidade local; não é recomendação universal." },
  }),
  question("screening.mammography", "current-health-and-screenings", "MULHER 40-69 ANOS, Mamografia", "yes-no-never-did-does-not-remember", {
    options: options([["less-than-one-year", "menos de 1 ano"], ["less-than-two-years", "há menos de 2 anos"], ["more-than-five-years", "mais de 5 anos"], ["never", "nunca fez"], ["does-not-remember", "não recorda"]]),
    applicability: { condition: "local suggestion: woman, 40-69 years; anatomy is not inferred automatically", dependencies: [], whenNotApplicable: "manual-review", manualReviewAllowed: true },
    provenance: { origin: "printed-local-form", sourceNote: "Regra de aplicabilidade local; não é recomendação universal." },
  }),
  question("screening.bone-densitometry", "current-health-and-screenings", "MULHER > 65 ANOS, Densitometria Óssea", "single-choice", {
    options: yesNoNeverRemember,
    applicability: { condition: "local suggestion: woman, over 65 years; anatomy is not inferred automatically", dependencies: [], whenNotApplicable: "manual-review", manualReviewAllowed: true },
    provenance: { origin: "printed-local-form", sourceNote: "Regra de aplicabilidade local; não é recomendação universal." },
  }),
  question("screening.colorectal-cancer", "current-health-and-screenings", "POPULAÇÃO > 50 ANOS, Câncer Colorretal, Fezes Ocultas / Colonoscopia", "single-choice", {
    options: yesNoNeverRemember,
    applicability: { condition: "local suggestion: population over 50 years", dependencies: [], whenNotApplicable: "manual-review", manualReviewAllowed: true },
    provenance: { origin: "printed-local-form", sourceNote: "Item reúne pesquisa de sangue oculto nas fezes e colonoscopia." },
    notes: "Não é diagnóstico; o método realizado permanece não especificado.",
  }),
];

const physicalQuestions: QuestionDefinition[] = [
  question("physical.weight", "physical-exam-and-clinical-parameters", "Peso", "measurement", { unit: "kg", validation: { rule: "finite and greater than zero", unit: "kg", finite: true, greaterThan: 0 } }),
  question("physical.height", "physical-exam-and-clinical-parameters", "Altura", "measurement", { unit: "m", validation: { rule: "finite and greater than zero", unit: "m", finite: true, greaterThan: 0 } }),
  question("physical.bmi", "physical-exam-and-clinical-parameters", "IMC", "calculated-information", {
    unit: "kg/m²",
    derivation: { id: "calculate-bmi-v1", version: "1", inputs: ["physical.weight", "physical.height"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: false, algorithm: "weightKg / heightM²" },
    options: options([["underweight", "Magreza"], ["normal", "Normal"], ["overweight", "Sobrepeso"], ["obesity-i", "Obesidade I"], ["obesity-ii", "Obesidade II"], ["obesity-iii", "Obesidade III"]]),
  }),
  question("physical.waist-circumference", "physical-exam-and-clinical-parameters", "Circunferência Abdominal", "measurement", { unit: "cm", validation: { rule: "finite and greater than zero", unit: "cm", finite: true, greaterThan: 0 } }),
  question("physical.waist-classification", "physical-exam-and-clinical-parameters", "Classificação da circunferência abdominal", "calculated-information", {
    derivation: { id: "classify-waist-local-rule-v1", version: "1", inputs: ["physical.waist-circumference"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: true, algorithm: "criterion explicitly selected: male-local-rule or female-local-rule" },
    notes: "Sem critério selecionado, não classificar.",
  }),
  question("laboratory.hba1c.value", "physical-exam-and-clinical-parameters", "Diabetes Mellitus, Hemoglobina Glicada, HbA1c", "laboratory-result", { unit: "%", validation: { rule: "finite and greater than or equal to zero", unit: "%", finite: true, greaterThanOrEqual: 0 }, notes: "Sem interpretação, meta ou classificação automática." }),
  question("laboratory.hba1c.date", "physical-exam-and-clinical-parameters", "Data da HbA1c", "date", { provenance: { origin: "digital-adaptation", sourceNote: "Data necessária para tendência longitudinal futura; evitar duplicação com resultados existentes." } }),
  question("blood-pressure.visit-1.systolic", "physical-exam-and-clinical-parameters", "PA visita 1 — sistólica", "blood-pressure", { unit: "mmHg", validation: { rule: "finite and greater than zero", unit: "mmHg", finite: true, greaterThan: 0 } }),
  question("blood-pressure.visit-1.diastolic", "physical-exam-and-clinical-parameters", "PA visita 1 — diastólica", "blood-pressure", { unit: "mmHg", validation: { rule: "finite and greater than zero", unit: "mmHg", finite: true, greaterThan: 0 } }),
  question("blood-pressure.visit-1.date", "physical-exam-and-clinical-parameters", "PA visita 1 — data", "date"),
  question("blood-pressure.visit-2.systolic", "physical-exam-and-clinical-parameters", "PA visita 2 — sistólica", "blood-pressure", { unit: "mmHg", validation: { rule: "finite and greater than zero", unit: "mmHg", finite: true, greaterThan: 0 } }),
  question("blood-pressure.visit-2.diastolic", "physical-exam-and-clinical-parameters", "PA visita 2 — diastólica", "blood-pressure", { unit: "mmHg", validation: { rule: "finite and greater than zero", unit: "mmHg", finite: true, greaterThan: 0 } }),
  question("blood-pressure.visit-2.date", "physical-exam-and-clinical-parameters", "PA visita 2 — data", "date"),
  question("blood-pressure.mean", "physical-exam-and-clinical-parameters", "Média das aferições de PA", "calculated-information", {
    unit: "mmHg",
    derivation: { id: "calculate-blood-pressure-mean-v1", version: "1", inputs: ["blood-pressure.visit-1.systolic", "blood-pressure.visit-1.diastolic", "blood-pressure.visit-2.systolic", "blood-pressure.visit-2.diastolic"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: false },
    notes: "Indisponível sem as duas visitas completas; média interna não é arredondada.",
  }),
  question("blood-pressure.control", "physical-exam-and-clinical-parameters", "Controle da Pressão", "manual-classification", {
    options: options([["controlled", "PA Controlada"], ["uncontrolled", "PA Não Controlada"]]),
    provenance: { origin: "printed-local-form", sourceNote: "Classificação manual informada; limiar ausente na fonte." },
    notes: "sourceType: manual; automaticRuleAvailable: false; requiresClinicalReview: true.",
  }),
  question("cardiovascular-risk", "physical-exam-and-clinical-parameters", "Risco Cardiovascular", "manual-classification", {
    options: options([["low", "Baixo Risco CV"], ["intermediate", "Risco CV Intermediário"], ["high", "Alto Risco CV"], ["very-high", "Muito Alto Risco CV"]]),
    provenance: { origin: "printed-local-form", sourceNote: "Categorias informadas na ficha; algoritmo ausente." },
    notes: "Manual; automaticCalculation: false; requiresSourceBeforeAutomation: true.",
  }),
  question("foot.skin-and-deformity-findings", "foot-assessment", "Pele e Deformidades", "multiple-choice", {
    options: options([
      ["dry-skin-or-cracks", "Pele seca / rachaduras"], ["ingrown-or-improperly-cut-nails", "Unhas encravadas / mal cortadas"],
      ["interdigital-maceration-or-mycosis", "Maceração interdigital / micose"], ["warm-skin-erythema-or-edema", "Pele quente / Eritema / Edema"],
      ["cold-skin-cyanosis-or-pallor", "Pele fria / Cianose / Palidez"], ["calluses", "Calosidades"], ["claw-toes", "Dedos em garra"],
      ["bunion", "Joanete"], ["overlapping-toes", "Dedos cavalgados"], ["active-ulceration", "Ulceração ativa"],
    ]),
    notes: "Achados registrados, não diagnósticos derivados.",
  }),
  question("foot.neuropathy-screening", "foot-assessment", "Rastreio de Neuropatia", "single-choice", {
    options: options([["sensitive-throughout", "Sensível em toda a área"], ["one-or-more-insensitive-areas", "Uma ou mais áreas insensíveis"]]),
    notes: "Estados digitais adicionais: não avaliado e avaliação incompleta.",
  }),
  question("foot.right.dorsalis-pedis-pulse", "foot-assessment", "Pé direito — pulso pedioso", "laterality-group", { options: options([["palpable", "palpável"], ["not-palpable", "não palpável"], ["not-assessed", "não avaliado"]]) }),
  question("foot.right.posterior-tibial-pulse", "foot-assessment", "Pé direito — pulso tibial posterior", "laterality-group", { options: options([["palpable", "palpável"], ["not-palpable", "não palpável"], ["not-assessed", "não avaliado"]]) }),
  question("foot.left.dorsalis-pedis-pulse", "foot-assessment", "Pé esquerdo — pulso pedioso", "laterality-group", { options: options([["palpable", "palpável"], ["not-palpable", "não palpável"], ["not-assessed", "não avaliado"]]) }),
  question("foot.left.posterior-tibial-pulse", "foot-assessment", "Pé esquerdo — pulso tibial posterior", "laterality-group", { options: options([["palpable", "palpável"], ["not-palpable", "não palpável"], ["not-assessed", "não avaliado"]]) }),
];

const summaryQuestions: QuestionDefinition[] = [
  question("summary.services", "global-summary-and-referrals", "Serviços relacionados ou encaminhamentos", "service", {
    options: options([
      ["social-assistance-cras-creas", "Assistente Social, CRAS/CREAS"], ["psychology-or-mental-health", "Psicologia / Saúde Mental"],
      ["caps-psychosocial-care", "CAPS, Atenção Psicossocial"], ["physiotherapy-or-rehabilitation", "Fisioterapia / Reabilitação"],
      ["nutrition-or-food-care", "Nutrição / Alimentação"], ["focal-medical-specialist", "Médico Especialista Focal"],
      ["other-service", "Outro serviço"],
    ]),
    notes: "Cada opção é proposta de rede/encaminhamento, não vínculo ativo; não criar ecomapa automaticamente.",
  }),
  question("summary.other-service-description", "global-summary-and-referrals", "Descrição de outro serviço", "short-text", {
    applicability: { condition: "summary.services contains other-service", dependencies: ["summary.services"], whenNotApplicable: "not-applicable", manualReviewAllowed: true },
    provenance: { origin: "digital-adaptation", sourceNote: "Complemento para serviço não listado na fonte." },
  }),
  question("summary.ciap-2", "global-summary-and-referrals", "CIAP-2", "clinical-code", {
    visibility: { ...printed, personVisibility: "non-exportable", familyVisibility: "non-exportable" },
    provenance: { origin: "printed-local-form", sourceNote: "Código textual sem autocomplete, validação ou inferência nesta etapa." },
    notes: "Não é diagnóstico automático.",
  }),
];

const availableSections: SectionDefinition[] = [
  {
    id: "header",
    printedBlockNumber: 0,
    title: "Cabeçalho",
    order: 0,
    status: "available",
    questions: headerQuestions,
    provenance: { origin: "digital-adaptation", sourceNote: "Campos de identificação e contexto do cabeçalho da ficha." },
    implementable: true,
  },
  {
    id: "sociodemographic-profile",
    printedBlockNumber: 1,
    title: "Perfil Sociodemográfico",
    order: 1,
    status: "available",
    questions: profileQuestions,
    provenance: { origin: "printed-local-form", sourceNote: "Bloco 1 da página 28." },
    implementable: true,
  },
  {
    id: "current-health-and-screenings",
    printedBlockNumber: 2,
    title: "Condição de Saúde Atual e Rastreamentos",
    order: 2,
    status: "available",
    questions: healthQuestions.map((current) => current.id === "health.diagnosed-chronic-conditions"
      ? {
        ...current,
        options: current.options.map((option) => option.id === "other" ? { ...option, domainEffect: "proposal-only" as const } : option),
      }
      : current),
    provenance: { origin: "printed-local-form", sourceNote: "Bloco 2 da página 28." },
    implementable: true,
  },
  ...[3, 4, 5].map((block): SectionDefinition => ({
    id: `source-missing-block-${block}`,
    printedBlockNumber: block,
    title: `Bloco ${block}`,
    order: block,
    status: "source-missing",
    questions: [],
    provenance: { origin: "pending-clinical-source", sourceNote: "Fonte da página não fornecida." },
    missingReason: "page-not-provided",
    implementable: false,
  })),
  {
    id: "physical-exam-and-clinical-parameters",
    printedBlockNumber: 6,
    title: "Exame Físico e Avaliação Paramétrica Clínica",
    order: 6,
    status: "available",
    questions: physicalQuestions.slice(0, 16),
    provenance: { origin: "printed-local-form", sourceNote: "Bloco 6 da página 28." },
    implementable: true,
  },
  {
    id: "foot-assessment",
    printedBlockNumber: 6,
    title: "Avaliação Clínica dos Pés",
    description: "Pele, neuropatia, deformidades e pulsos.",
    order: 6.1,
    status: "available",
    questions: physicalQuestions.slice(16),
    provenance: { origin: "printed-local-form", sourceNote: "Subseção legível do Bloco 6 da página 28." },
    implementable: true,
  },
  {
    id: "global-summary-and-referrals",
    printedBlockNumber: 7,
    title: "Síntese da Condição Global e Encaminhamentos, CIAP-2",
    order: 7,
    status: "available",
    questions: summaryQuestions.map((current) => current.id === "summary.services"
      ? { ...current, options: current.options.map((option) => ({ ...option, domainEffect: "proposed-network-or-referral-change" as const })) }
      : current),
    provenance: { origin: "printed-local-form", sourceNote: "Bloco 7 da página 28." },
    implementable: true,
  },
  {
    id: "family-diagrams-and-clinical-observations",
    printedBlockNumber: 8,
    title: "Elaboração do Genograma e Ecomapa / Observações Clínicas",
    order: 8,
    status: "title-only-in-source",
    questions: [],
    provenance: { origin: "printed-local-form", sourceNote: "Somente o título do Bloco 8 está visível na fonte." },
    missingReason: "requires-additional-source",
    implementable: false,
    declarativeCapabilities: [
      "link-existing-genogram-version", "mark-genogram-absent", "propose-genogram-update",
      "link-existing-ecomap-version", "mark-ecomap-absent", "propose-ecomap-update",
      "record-academic-observation", "record-family-observation", "record-shareable-text",
      "record-private-information", "record-supervision-question", "record-next-encounter-question",
    ],
  },
];

const ambiguities: InstrumentAmbiguity[] = [
  { id: "occupation-selection-mode", location: "Bloco 1 · Ocupação Atual", description: "Caixas de seleção não esclarecem seleção única ou múltipla.", effect: "Pode alterar a cardinalidade da resposta.", status: "provisional-decision", decisionNeeded: "Validar com a preceptora; implementação digital provisória é múltipla.", conservativeImplementationPossible: true },
  { id: "cervical-overlap", location: "Bloco 2 · Preventivo do Colo do Útero", description: "Menos de 1 ano está contido em menos de 3 anos.", effect: "Opções não são mutuamente exclusivas matematicamente.", status: "provisional-decision", decisionNeeded: "Preservar a impressão até validação.", conservativeImplementationPossible: true },
  { id: "mammography-overlap-gap", location: "Bloco 2 · Mamografia", description: "Menos de 1 ano está contido em menos de 2 anos e não há categoria visível entre 2 e 5 anos.", effect: "Não cobre todo o espaço temporal de forma exclusiva.", status: "provisional-decision", decisionNeeded: "Preservar opções; não criar intervalo ausente.", conservativeImplementationPossible: true },
  { id: "bone-densitometry-overlap", location: "Bloco 2 · Densitometria Óssea", description: "Não e Nunca fez podem se sobrepor semanticamente.", effect: "A resposta pode ser ambígua.", status: "provisional-decision", decisionNeeded: "Preservar ambas.", conservativeImplementationPossible: true },
  { id: "colorectal-method", location: "Bloco 2 · Câncer Colorretal", description: "Fezes ocultas e colonoscopia aparecem no mesmo item.", effect: "A resposta não identifica o método realizado.", status: "open", decisionNeeded: "Detalhar método em fonte futura sem converter em diagnóstico.", conservativeImplementationPossible: true },
  { id: "tacs-acs", location: "Cabeçalho · TACS/ACS", description: "A ficha apresenta TACS e ACS no mesmo campo.", effect: "A natureza local da referência profissional não está definida.", status: "open", decisionNeeded: "Confirmar se são conceitos distintos no serviço.", conservativeImplementationPossible: true },
  { id: "blood-pressure-control-threshold", location: "Bloco 6 · Controle da Pressão", description: "Não há limiar para PA controlada ou não controlada.", effect: "Não é seguro calcular automaticamente.", status: "provisional-decision", decisionNeeded: "Classificação manual.", conservativeImplementationPossible: true },
  { id: "cardiovascular-risk-algorithm", location: "Bloco 6 · Risco Cardiovascular", description: "Não há algoritmo de risco na fonte.", effect: "Não é seguro calcular automaticamente.", status: "provisional-decision", decisionNeeded: "Classificação manual até fonte autorizada.", conservativeImplementationPossible: true },
  { id: "block-8-title-only", location: "Bloco 8", description: "Somente o título está visível.", effect: "Não permite inventar perguntas internas.", status: "provisional-decision", decisionNeeded: "Obter fonte adicional.", conservativeImplementationPossible: true },
  { id: "missing-blocks", location: "Blocos 3, 4 e 5", description: "As páginas não foram fornecidas.", effect: "Não permite completar o instrumento.", status: "provisional-decision", decisionNeeded: "Incorporar nova versão quando as páginas forem recebidas.", conservativeImplementationPossible: true },
];

const questions = availableSections.flatMap((section) => section.questions);

export const adultDcntEsfDefinition: InstrumentDefinition = {
  id: "adult-dcnt-esf",
  version: "local-esf-2026-page-28-v1",
  title: "AVALIAÇÃO DE SAÚDE E DCNT DO ADULTO",
  subtitle: "ATENÇÃO PRIMÁRIA À SAÚDE / MFC — INSTRUMENTO DE ENTREVISTA E AVALIAÇÃO CLÍNICA DE DOENÇAS CRÔNICAS NÃO TRANSMISSÍVEIS",
  purpose: "Representar de forma estruturada e versionada a página 28 do instrumento local da ESF, preservando perguntas, opções, limitações e revisão humana.",
  origin: "Instrumento local utilizado pela ESF da preceptora do projeto.",
  sourcePage: 28,
  referenceYear: 2026,
  editorialStatus: "draft-local",
  availableSections: [1, 2, 6, 7, 8],
  missingSections: [3, 4, 5],
  sections: availableSections,
  questions,
  ambiguities,
  limitations: [
    "Esta definição não é validação nacional, diretriz universal, prontuário ou algoritmo diagnóstico.",
    "Não implementa persistência, migração, interface, narrativas, encaminhamento automático ou atualização de genograma/ecomapa.",
    "Blocos 3, 4 e 5 estão ausentes; Bloco 8 contém somente título na fonte.",
    "Classificações de PA, risco cardiovascular, HbA1c e CIAP-2 permanecem manuais ou sem interpretação.",
  ],
  futureServiceStates: [
    "current-network", "suggested", "discussed", "accepted", "referred", "scheduled", "accessed",
    "in-follow-up", "completed", "declined", "unavailable", "not-applicable",
  ],
};

``

# END FILE: src/clinical/assessments/instruments/adult-dcnt-esf/definition.ts

---

# FILE: src/clinical/assessments/migration.ts

``typescript
import { checksumOf } from "@/src/storage/hash";
import { MAPA_DB_VERSION, STORES, type StoreName, type StoredEnvelope } from "@/src/storage/schema";
import type { BackupPayload } from "@/src/backup/types";
import type { InstrumentApplication } from "./types";

const APPLICATION_TYPE = "instrument-application";

export function migrateApplicationPayload(payload: Partial<InstrumentApplication> & { responses?: Record<string, unknown> }): InstrumentApplication {
  const answers = payload.answers ?? {};
  const { responses: _responses, ...rest } = payload;
  return {
    ...rest,
    answers,
    applicabilityOverrides: payload.applicabilityOverrides ?? {},
    provenance: payload.provenance ?? { origin: "digital-adaptation", sourceNote: "Migrado de aplicação local anterior." },
    visibility: payload.visibility ?? {
      scope: "individual",
      clinicalVisibility: "academic-private",
      personVisibility: "shareable-with-person",
      familyVisibility: "non-exportable",
      reviewRequired: true,
      projectionStrategy: "clinical-academic",
    },
    dataOrigin: payload.dataOrigin ?? "normal",
    schemaVersion: payload.schemaVersion ?? 1,
    revisionNumber: payload.revisionNumber ?? 1,
  } as InstrumentApplication;
}

export async function migrateBackup(backup: BackupPayload): Promise<BackupPayload> {
  const stores = structuredClone(backup.stores) as Record<StoreName, unknown[]>;
  stores[STORES.records] = await Promise.all(stores[STORES.records].map(async (value) => {
    const record = value as StoredEnvelope<Partial<InstrumentApplication> & { responses?: Record<string, unknown> }>;
    if (record.entityType !== APPLICATION_TYPE) return value;
    const payload = migrateApplicationPayload(record.payload);
    return { ...record, payload, recordVersion: payload.revisionNumber, checksum: await checksumOf(payload) };
  }));
  const storeChecksums = {} as Record<StoreName, string>;
  for (const store of Object.values(STORES) as StoreName[]) {
    stores[store] = stores[store] ?? [];
    storeChecksums[store] = await checksumOf(stores[store]);
  }
  const base = {
    ...backup,
    schemaVersion: MAPA_DB_VERSION,
    stores,
    storeChecksums,
  };
  delete (base as Partial<BackupPayload>).payloadChecksum;
  return { ...base, payloadChecksum: await checksumOf(base) };
}

``

# END FILE: src/clinical/assessments/migration.ts

---

# FILE: src/clinical/assessments/README.md

``markdown
# Avaliação de Saúde e DCNT do Adulto — ESF

Esta fundação tipada representa a página 28 do instrumento local utilizado pela ESF da preceptora do projeto. A definição é `adult-dcnt-esf`, versão `local-esf-2026-page-28-v1`, com origem local e estado editorial de rascunho para validação da preceptora.

Cada aplicação futura pertence a uma pessoa (`personId`) e usa `familyId` apenas como contexto familiar. A mesma definição pode ter aplicações independentes e longitudinais para várias pessoas da mesma família. A resposta estruturada será a fonte canônica das futuras projeções clínica/acadêmica e da pessoa; esta entrega não cria telas, persistência ou narrativas.

Estão representados os blocos 1, 2, 6, 7 e 8. Os blocos 3, 4 e 5 são placeholders estruturais sem perguntas e o bloco 8 permanece somente com capacidades futuras, pois a fonte mostra apenas seu título. IMC, idade/faixa etária, média de duas aferições de PA e circunferência conforme critério local são as únicas derivações implementadas. Controle da PA, risco cardiovascular, HbA1c, CIAP-2 e encaminhamentos continuam manuais ou pendentes de fonte.

As ambiguidades da ficha são preservadas no contrato. Novas páginas devem gerar uma nova versão imutável, adicionar perguntas com IDs estáveis e manter proveniência e decisões de revisão; não se deve mutar silenciosamente uma definição usada por aplicações anteriores. A definição não substitui decisão clínica, prontuário institucional ou validação da preceptora.

``

# END FILE: src/clinical/assessments/README.md

---

