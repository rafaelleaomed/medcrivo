# Engenharia reversa — Daria Medric e The Known Doctor Challenge

**Projeto:** MedCrivo  
**Data do levantamento:** 22 de outubro de 2026  
**Classificação:** pesquisa estratégica — não é implementação nem cópia de identidade  
**Objetivo:** entender o sistema de posicionamento, conteúdo e conversão de `@dariamedric` para adaptar seus princípios à MedCrivo, ao português do Brasil e às regras da publicidade médica.

## 1. Resumo executivo

A referência analisada não vende apenas “marketing para médicos”. Ela vende uma transformação bem definida: sair de um perfil profissional correto, porém genérico, para uma marca médica reconhecível, confiável e associada a um território específico.[1][3]

O sistema possui quatro camadas integradas:

1. **Conteúdo de diagnóstico:** mostra ao médico que competência clínica, sozinha, não gera reconhecimento digital.
2. **Método proprietário simples:** posicionamento, perfil, séries recorrentes e plano de execução.
3. **Conversão de baixa fricção:** comentário com a palavra `KNOWN`, que provavelmente aciona uma DM e conduz à oferta de entrada.
4. **Oferta acessível:** desafio autoguiado de cinco dias, vendido por US$ 49, com acesso vitalício.[1][2]

A principal lição para a MedCrivo é: **não competir como mais uma ferramenta que gera posts**. O posicionamento mais forte é ser o sistema que transforma conhecimento médico em presença digital clara, frequente, reconhecível e eticamente revisada.

A adaptação não deve copiar textos, nomes, layout ou promessas. Deve incorporar os princípios de clareza, repetição estratégica, séries editoriais, baixa fricção e produto de entrada — adicionando o diferencial que a referência não possui: **Crivo ético, referências científicas, identidade visual do médico e execução multiformato em português**.

---

## 2. Método e limites

### Fontes examinadas

- Página pública completa do The Known Doctor Challenge.[1]
- Checkout da oferta hospedado na Lava.[2]
- Perfil público e amostra de publicações indexadas de `@dariamedric`.[3][5][9]
- Presença pública no Threads.[10]
- Resolução CFM nº 2.336/2023 e materiais oficiais do CFM.[11][12][13]
- Posicionamento, marca, produtos e motores já existentes no repositório MedCrivo.

### Limites

- O Instagram restringiu o acesso direto ao feed e aos destaques sem login. O screening usa perfil, páginas públicas indexadas, legendas, textos alternativos e URLs individuais.
- A página pública da oferta usa um subdomínio gerado em `chatgpt.site`. Ela estava acessível em 22 de outubro de 2026, mas pode ser alterada ou removida; por isso, a URL canônica de compra registrada é o checkout da Lava.[1][2]
- Métricas como `20M+ views` e `$300K+ for clients` são declarações da própria criadora, não auditoria independente.[1][3]
- O checkout da Lava usa proteção contra automação. A oferta, entretanto, foi identificada e validada pela página pública que envia quatro CTAs diretamente ao mesmo checkout.[1][2]
- Não foram realizados login, compra, comentário, DM ou qualquer interação externa.

---

# PARTE I — ENGENHARIA REVERSA DA OFERTA

## 3. Identificação correta do produto

O produto do link da Lava é o **The Known Doctor Challenge**, de Daria Medric — e não um produto de outra criadora. A página pública conecta diretamente seus quatro botões de compra ao mesmo identificador do checkout.[1][2]

### Oferta observada

- **Nome:** The Known Doctor Challenge.
- **Criadora:** Daria Medric.
- **Formato:** programa autoguiado de cinco dias.
- **Carga sugerida:** 30 a 45 minutos por dia.
- **Acesso:** imediato e vitalício.
- **Preço observado:** US$ 49, pagamento único.
- **Público:** médicos que produzem conteúdo, mas ainda não são claramente reconhecidos por uma posição, mensagem ou território.
- **Resultado prometido:** sistema de posicionamento, perfil, conteúdo recorrente e direção de execução para 90 dias.[1]

## 4. Promessa e transformação

### Estado inicial

O médico:

- possui credenciais, mas não deixa claro por que deveria ser lembrado;
- publica temas úteis, porém desconectados;
- recomeça o calendário editorial continuamente;
- vê profissionais menos experientes ganharem mais reconhecimento;
- teme precisar virar “influenciador” para crescer.

### Estado final

O médico passa a ter:

- uma associação clara entre seu nome e um território de autoridade;
- perfil que explica sua diferença rapidamente;
- três séries de conteúdo recorrentes;
- banco inicial de pautas;
- plano de 30 dias;
- direção de marca para 90 dias.

### Mecanismo central

O mecanismo não é “postar mais”. É **clareza antes de escala**: definir pelo que o médico quer ser reconhecido e repetir essa mensagem de maneiras diferentes até que o mercado faça a associação.[1][4]

Essa escolha é estrategicamente forte porque desloca o problema do algoritmo para uma falha controlável pelo cliente: falta de posicionamento e consistência temática.

## 5. Arquitetura da página de vendas

A página segue uma sequência de persuasão muito disciplinada:

1. **Hero:** público, duração, transformação e CTA.
2. **Microcompromissos:** quatro entregáveis visíveis antes da primeira dobra longa.
3. **Prova numérica:** alcance, receita atribuída e duração curta do método.
4. **Diagnóstico:** explica por que o médico competente continua esquecível.
5. **Resultado em cinco passos:** mostra o que será construído.
6. **Prova de crescimento, alcance e resultado comercial.**
7. **Depoimentos de médicos:** seguidores, consultas, mensagens e agendamentos.
8. **Currículo do programa:** um problema resolvido por dia.
9. **Antes/depois conceitual:** compara perfil genérico com marca reconhecível.
10. **Cofre de execução:** transforma estratégia abstrata em volume de modelos.
11. **Para quem é e para quem não é:** qualificação e redução de objeções.
12. **FAQ:** audiência pequena, falta de tempo, câmera, especialidade “sem graça”, garantia e acesso.
13. **Oferta final:** preço, entregáveis, risco reduzido e CTA.[1]

### Por que essa ordem funciona

- Primeiro cria identificação emocional.
- Depois nomeia o problema.
- Em seguida apresenta o método.
- Só então mostra prova e volume de entregáveis.
- O preço aparece quando o leitor já entendeu o custo de continuar genérico.

## 6. Construção de valor

A oferta combina **estratégia** com **execução pronta**.

### Entregas estratégicas

- posicionamento;
- mensagem central;
- território de autoridade;
- arquitetura de prova;
- bio, CTA e posts fixados;
- três séries próprias;
- direção de 30 e 90 dias.

### Entregas operacionais

- 30 estruturas de Reels;
- 20 estruturas de carrossel;
- 20 posts de autoridade e conversão;
- 20 estruturas adaptáveis de bio;
- 50 ideias de conteúdo médico;
- direção de planejamento por 90 dias.[1]

O número de recursos aumenta o valor percebido, mas a página mantém a mensagem principal centrada em posicionamento. Isso evita que a oferta pareça apenas uma biblioteca de templates.

## 7. Prova e redução de risco

A prova está dividida em três níveis:

1. **Visibilidade:** crescimento de seguidores e milhões de visualizações.
2. **Resultado comercial:** valores gerados em trabalhos mais amplos.
3. **Resultado médico:** mensagens, consultas, tratamentos e agendamentos relatados por clientes.[1]

Todos esses números são autodeclarados pela criadora ou por clientes apresentados na página. Foram analisados como construção de prova da oferta, não como resultados auditados.

A própria página inclui ressalvas de que os exemplos são resultados passados, que variam conforme mercado, especialidade, execução e oferta. Isso protege a credibilidade e reduz a aparência de promessa garantida.

### Ponto de atenção para a MedCrivo

A MedCrivo não deve publicar métricas ou resultados sem documentação verificável. Na fase atual, é melhor usar:

- demonstrações reais do produto;
- exemplos de transformação editorial;
- auditorias antes/depois de um conteúdo, sem expor paciente;
- tempo economizado medido em teste controlado;
- depoimentos autorizados e contextualizados;
- número real de peças geradas ou revisadas.

## 8. Objeções neutralizadas

A página enfrenta diretamente:

- “não tenho audiência grande”;
- “não tenho tempo para postar todo dia”;
- “não gosto de câmera”;
- “minha especialidade é pouco atraente”;
- “isso garante pacientes ou renda?”;
- “não quero parecer influenciador”.[1]

A resposta comum é que reconhecimento vem antes da escala e depende de clareza, não de volume diário ou entretenimento.

## 9. Design e identidade da página

### Paleta observada

- fundos marfim e creme;
- vinho escuro como cor primária;
- rosa-vinho secundário;
- texto marrom quase preto;
- dourado discreto para detalhes;
- branco em áreas de contraste.

### Tipografia

- serifada clássica para títulos e frases de autoridade;
- sans-serif simples para leitura e interface.

### Estética

- editorial e premium;
- feminina sem ser infantil;
- baixa saturação;
- blocos amplos e pouco ruído;
- cartões de prova;
- numeração grande nas etapas;
- botões repetidos em pontos decisivos;
- responsividade pensada para celular.

### Conversão técnica

A página não possui formulário próprio. Todos os CTAs levam diretamente ao checkout da Lava.[1][2]

O rastreamento observado usa Google Analytics. O funil é curto:

`Instagram/Threads → página de vendas → checkout Lava → acesso`.

---

# PARTE II — SCREENING DO INSTAGRAM

## 10. Posicionamento de `@dariamedric`

### Categoria

Consultoria de marca pessoal e marketing para médicos.

### Promessa pública

A bio afirma que ajuda médicos a se tornarem conhecidos e converter atenção em pacientes; também apresenta resultados acumulados e direciona a estratégia privada por DM com a palavra `BRAND`.[3]

### Tese central

**Pacientes não conseguem avaliar competência clínica apenas olhando um perfil. Primeiro comparam sinais visíveis de clareza, confiança e relevância.**

A conta explora a diferença entre:

- ser clinicamente competente;
- parecer confiável antes da consulta;
- ser lembrado;
- ser escolhido.

## 11. Narrativa dominante

### Arco 1 — O médico invisível

O médico é bom, mas sua presença digital não torna essa qualidade legível.

### Arco 2 — O conteúdo genérico

Posts isolados ensinam, mas não constroem associação entre nome e território. Carrosséis médicos genéricos são criticados explicitamente.[5]

### Arco 3 — Reconhecimento estratégico

O objetivo não é fama. É construir uma mensagem repetível, um ponto de vista reconhecível e uma experiência de perfil coerente.[4][7][9]

### Arco 4 — Conversão

Views não são tratadas como destino final. Elas são veículo para confiança, demanda e escolha.

## 12. Pilares editoriais observados

### 12.1 Diagnóstico de posicionamento

Conteúdos que mostram por que o médico não é lembrado, mesmo sendo competente.

Exemplos de ângulos:

- competência sem comunicação clara;
- perfil que exibe credenciais, mas não uma diferença;
- conteúdo útil, porém substituível;
- excesso de variedade temática;
- falta de associação entre nome e solução.

### 12.2 Educação tática

Conteúdos sobre:

- hooks;
- Reels;
- carrosséis;
- bio;
- destaques;
- posts fixados;
- séries recorrentes;
- construção de autoridade.

### 12.3 Contrarian marketing

A conta frequentemente afirma que a solução intuitiva está errada:

- não é postar mais;
- não é buscar apenas seguidores;
- não é publicar dicas genéricas;
- não é mostrar somente antes/depois;
- não é dançar ou se tornar influenciador.[5][8]

### 12.4 Prova e casos

Resultados aparecem na bio, página de vendas e conteúdos. A prova conecta visibilidade a consultas ou receita, mas parte dos números é autodeclarada.[1][3]

### 12.5 Aspiração profissional

A narrativa associa marca médica a:

- autonomia;
- demanda;
- reconhecimento;
- liberdade;
- escolha de agenda e pacientes.

### 12.6 Oferta

A maior parte da amostra pública analisada leva a um único próximo passo: comentar `KNOWN` para receber o desafio.[4][5][7]

## 13. Formatos

### Reels

Na amostra analisada, os Reels seguem a mesma lógica de hooks fortes e formatos repetíveis usada nos demais conteúdos.[6]

- talking head ou vídeo pessoal;
- texto forte na abertura;
- uma tese por vídeo;
- edição subordinada à mensagem;
- linguagem direta;
- legenda amplia a tese e conduz ao CTA.

### Carrosséis

- estética editorial;
- capa com afirmação forte;
- numeração visível;
- uma ideia por slide;
- progressão problema → reframe → solução;
- assinatura visual com o nome da criadora;
- CTA de palavra-chave no fechamento.[5][9]

### Posts estáticos

- frases-manifesto;
- contrapontos;
- mensagens curtas que reforçam o território da marca.

### Threads

- reaproveitamento das teses em texto curto;
- linguagem mais conversacional;
- testes rápidos de ideias antes ou depois do Instagram.[10]

## 14. Padrões de hooks

### Interpelação direta

- “Médicos…”
- “Seus Reels…”
- “Sua marca pessoal…”

### Diagnóstico inesperado

- você não tem problema de conteúdo, tem problema de sistema;
- mais posts não corrigem posicionamento fraco;
- conhecimento médico não basta para capturar atenção.

### Contraste

- útil versus memorável;
- competência versus percepção;
- visualização versus demanda;
- perfil versus marca;
- variedade versus repetição.

### Proibição ou interrupção

- pare de postar carrosséis genéricos;
- pare de perseguir ideias novas;
- não trate seu perfil como detalhe.[4][5]

### Pergunta de tensão

- se você é um bom médico, por que os pacientes lembram de outros nomes?

## 15. Estrutura recorrente dos conteúdos

1. Chama o médico diretamente.
2. Nomeia uma dor reconhecível.
3. Mostra que a causa aparente está errada.
4. Apresenta uma tese simples.
5. Dá uma orientação prática.
6. Convida para comentar `KNOWN`.

É um modelo consistente e fácil de produzir em escala.

## 16. Tom de voz

- direto;
- seguro;
- provocativo sem agressividade;
- didático;
- premium;
- anti-genérico;
- aspiracional;
- sem excesso de emojis;
- frases curtas;
- pouco jargão de marketing.

## 17. Cadência observável

A amostra de mais de 20 URLs e resultados públicos indexados entre setembro e outubro de 2026 indica publicação concentrada e frequente, com vários posts em alguns dias. A estimativa mais segura é **quatro a seis publicações por semana**, combinando Reels e carrosséis.

Não é possível afirmar a frequência exata de Stories sem acesso autenticado.

## 18. Funil do Instagram

### Entrada

Reel, carrossel ou post manifesto.

### Conversão primária

Comentário com a palavra `KNOWN`.[4][5][7]

### Continuação provável

Automação de DM entrega o desafio ou conduz à página.

### Produto de entrada

The Known Doctor Challenge, US$ 49.[1][2]

### Oferta premium

Estratégia privada 1:1, acionada pela palavra `BRAND` na DM.[3]

### Estrutura completa

`Conteúdo → comentário → DM → desafio de entrada → confiança → estratégia premium`.

---

# PARTE III — O QUE A MEDCRIVO DEVE MODELAR

## 19. Princípios que valem adaptar

### 19.1 Um inimigo claro

**Inimigo sugerido:** conteúdo médico genérico, irregular, sem identidade e sem segurança ética.

Não atacar outros médicos. Atacar o padrão que torna todos parecidos.

### 19.2 Uma tese repetível

**Tese sugerida:**

> Não basta informar. O médico precisa ser claro, reconhecível e ético — com um sistema que transforme sua experiência em conteúdo consistente.

### 19.3 Séries recorrentes

Em vez de assuntos aleatórios, usar séries que reforçam o posicionamento da MedCrivo.

### 19.4 Um CTA principal por campanha

Escolher uma palavra por ciclo e repetir por semanas. Exemplo inicial: `CRIVO`.

### 19.5 Produto de entrada

A referência usa um desafio barato. A MedCrivo já possui uma alternativa mais alinhada:

- Crivo gratuito;
- checklist de publicidade médica;
- demonstração de transformação de um post;
- possível desafio “5 dias para um perfil médico mais claro e ético”.

### 19.6 Estratégia antes do volume

A ferramenta deve vender clareza e sistema, não apenas quantidade de peças geradas.

## 20. Diferenciais próprios da MedCrivo

A MedCrivo pode ocupar um território mais defensável:

1. **Criação + revisão ética no mesmo fluxo.**
2. **Adequação ao contexto brasileiro.**
3. **Identificação profissional e RQE.**
4. **Referências científicas verificadas.**
5. **Carrossel, Reel, Stories e legenda derivados de uma pauta.**
6. **Identidade visual individual do médico.**
7. **Biblioteca por especialidade.**
8. **Planejamento e reaproveitamento sistemático.**
9. **Tom que preserva autoridade sem transformar o médico em influencer.**

## 21. Posicionamento recomendado

### Categoria

**Sistema de conteúdo e posicionamento ético para médicos.**

### Promessa principal

**Transforme sua experiência médica em conteúdo claro, reconhecível e revisado antes de publicar.**

### Promessa curta

**Seja lembrado pelo que você sabe — sem abrir mão da ética.**

### Mecanismo

**Método Clareza → Conteúdo → Crivo → Consistência.**

1. Clareza: define território e público.
2. Conteúdo: transforma experiência em séries e formatos.
3. Crivo: revisa normas, linguagem e evidências.
4. Consistência: organiza a frequência e o reaproveitamento.

### Inimigo

**O post médico genérico, improvisado e sem revisão.**

## 22. Pilares editoriais recomendados

### Pilar 1 — Médico reconhecível

Posicionamento, diferenciação, bio, ponto de vista, território e séries.

### Pilar 2 — Conteúdo que o paciente entende

Clareza, analogias, dúvidas do consultório, mitos e educação.

### Pilar 3 — Crivo ético

Pode/não pode, identificação, RQE, imagens, depoimentos, sensacionalismo e contexto.

### Pilar 4 — Bastidores do método

Transformação de pauta em carrossel, Reel, Stories e legenda.

### Pilar 5 — IA com responsabilidade

O que automatizar, o que revisar e onde o médico continua responsável.

### Pilar 6 — Vida híbrida do médico

Tempo, rotina, autonomia, marca profissional e produção sustentável.

### Pilar 7 — Produto e prova

Demonstrações reais, comparação editorial, testes, depoimentos autorizados e evolução do MedCrivo.

## 23. Séries próprias sugeridas

- **Passou no Crivo?** — revisão de uma frase ou ideia.
- **Médico bom, perfil genérico** — diagnóstico de posicionamento.
- **Do consultório ao carrossel** — transforma dúvida real em conteúdo.
- **Pode ou não pode?** — publicidade médica prática.
- **1 pauta, 4 formatos** — carrossel, Reel, Stories e legenda.
- **Pare de postar isso** — padrões genéricos ou inseguros.
- **O paciente entendeu?** — simplificação sem perder precisão.
- **Marca médica em 60 segundos** — ajustes rápidos de perfil.
- **IA sob supervisão** — limites e usos responsáveis.
- **Conteúdo por especialidade** — exemplo aplicado a uma área.

## 24. Hooks adaptados — princípios, não cópias

- “Médico, seu conteúdo pode estar correto e ainda assim ser esquecível.”
- “O problema não é falta de pauta. É falta de território.”
- “Mais posts não corrigem uma mensagem confusa.”
- “Seu CRM prova que você é médico. Seu conteúdo precisa mostrar como você pensa.”
- “Se todo médico publica a mesma dica, por que o paciente lembraria do seu nome?”
- “Antes de publicar, este texto passaria pelo Crivo?”
- “Você não precisa dançar. Precisa ser entendido.”
- “Uma dúvida do consultório pode render uma semana de conteúdo.”
- “A IA escreveu. Mas quem verificou?”
- “Seu post informa ou também constrói confiança?”

## 25. CTAs recomendados

### Descoberta

- Salve para revisar antes do próximo post.
- Envie para um colega que produz conteúdo médico.
- Qual dessas situações acontece no seu perfil?

### Captura

- Comente `CRIVO` para receber o checklist.
- Comente sua especialidade para receber um exemplo de série.
- Envie `PERFIL` na DM para receber o roteiro de auditoria.

### Produto

- Teste seu texto no Crivo gratuito.
- Transforme uma pauta em quatro formatos no MedCrivo Studio.
- Entre na lista de abertura do Studio.

Usar uma palavra-chave por campanha evita dispersão e permite medir a resposta.

## 26. Direção visual MedCrivo

Não copiar a paleta vinho/creme da referência. Preservar a marca atual:

- **pinho `#123C36`** — autoridade e fundos;
- **teal `#16796F`** — elementos funcionais;
- **marfim `#F5F2E9`** — leitura e respiro;
- **lima `#D6EF72`** — hooks, números e CTA;
- **tinta `#172A27`** — texto.

### Sistema visual sugerido

- Barlow Condensed em hooks e números.
- Plus Jakarta Sans no conteúdo.
- Source Serif 4 em frases de autoridade.
- Capas com no máximo 8–12 palavras.
- Um argumento por slide.
- Numeração editorial.
- Selo “Revisado pelo Crivo” apenas quando houver revisão real.
- Assinatura discreta da MedCrivo.
- Uso constante da lupa como elemento de inspeção, e não como ornamento aleatório.

## 27. Cadência piloto recomendada

**Fase:** protótipo editorial de quatro semanas.

### Frequência semanal

- 3 Reels;
- 2 carrosséis;
- 1 post estático ou prova de produto;
- Stories em 5 dias da semana;
- 1 CTA principal por semana, mantido dentro de um ciclo mensal.

### Distribuição

- Segunda: diagnóstico de posicionamento — Reel.
- Terça: educativo/Crivo — carrossel.
- Quarta: bastidor ou demonstração — Reel.
- Quinta: autoridade/frase — post estático + Stories.
- Sexta: conteúdo aplicado por especialidade — carrossel.
- Sábado: Reel leve, opinião ou vida híbrida.
- Domingo: Stories de planejamento e enquete.

Essa cadência deve ser tratada como teste. A decisão de escala precisa considerar retenção, salvamentos, compartilhamentos, comentários qualificados, DMs e uso do Crivo — não apenas visualizações.

---

# PARTE IV — ADAPTAÇÃO ÉTICA AO BRASIL

## 28. O que não deve ser importado literalmente

### Promessa direta de pacientes

Expressões como “transformar atenção em pacientes” devem ser usadas com cautela. Para a MedCrivo, é mais seguro prometer estrutura, clareza, consistência e revisão — resultados que o produto realmente controla.

### Métricas sem prova

Não usar números de alcance, receita, consultas ou economia de tempo antes de medi-los e documentá-los.

### Antes/depois fora de contexto

A Resolução CFM nº 2.336/2023 permite usos antes proibidos, inclusive imagens educativas e divulgação de preços em determinadas condições; porém permanecem exigências de identificação, contexto, privacidade e combate ao sensacionalismo.[11][12][13]

### Proibições absolutas desatualizadas

O código atual da MedCrivo possui regras conservadoras que tratam preço, promoção e antes/depois como proibições amplas. Isso reduz risco no protótipo, mas não representa todas as permissões da regra vigente. Antes de transformar o Crivo em parecer definitivo, é necessário revisar essas regras com base no texto integral e no Manual do CFM.[11][12]

### Automação sem supervisão

A IA pode estruturar conteúdo, mas a decisão e a responsabilidade final continuam com o profissional. O produto já comunica corretamente que o selo é controle interno, não aprovação do CFM.

## 29. Checklist editorial mínimo

Antes de agendar qualquer publicação, aplicar no mínimo os controles abaixo, derivados da norma e do Manual do CFM.[11][12]

1. O conteúdo contém nome, CRM/UF e RQE quando aplicável?
2. A especialidade anunciada está registrada?
3. Há promessa de cura, garantia ou superioridade?
4. Há dado, imagem ou contexto capaz de identificar paciente?
5. A imagem tem finalidade educativa, respeita a LGPD e está ligada à especialidade registrada?
6. Se houver antes/depois: a publicação inclui possíveis resultados insatisfatórios e complicações e, quando viável, diferentes biotipos, faixas etárias e fases de evolução?
7. A referência científica foi realmente conferida?
8. A chamada comercial está clara e sem indução enganosa?
9. A peça diferencia educação, opinião e oferta?
10. O profissional aprovou a versão final?
11. O arquivo publicado corresponde exatamente ao arquivo revisado?

---

# PARTE V — CONCLUSÃO E PRÓXIMA FASE

## 30. Diagnóstico final

A força de `@dariamedric` não está em um formato isolado. Está na coerência entre:

- uma dor específica;
- uma tese repetida;
- um método curto;
- conteúdo seriado;
- CTA único;
- produto de entrada;
- oferta premium.

A MedCrivo já possui ativos técnicos superiores para o mercado brasileiro, mas precisa apresentar esses ativos dentro de uma narrativa mais simples. O cliente não deve enxergar primeiro “IA, templates e compliance”. Deve enxergar:

> “Eu consigo me posicionar, publicar com frequência e reduzir o risco de comunicar errado.”

## 31. Recomendação de execução

A próxima etapa deve transformar este relatório em três artefatos:

1. **Guia editorial oficial da MedCrivo:** posicionamento, voz, pilares, séries, hooks e CTAs.
2. **Calendário piloto de 30 dias:** temas, formatos, roteiro, legenda, arte e objetivo de cada peça.
3. **Fluxo de agendamento:** aprovação humana, Crivo final, biblioteca de arquivos, publicação e medição.

A automação de agendamento só deve ser configurada depois que o calendário, a conta de publicação e o processo de aprovação estiverem definidos.

## Sources

[1] https://the-known-doctor.safe-mars-7164.chatgpt.site — The Known Doctor Challenge | Daria Medric
[2] https://app.lava.top/products/d00360c3-e089-4589-8bac-f0c8223a8279 — The Known Doctor Challenge - checkout Lava
[3] https://www.instagram.com/dariamedric — @dariamedric no Instagram
[4] https://www.instagram.com/dariamedric/p/DehNATciHbL — Post: repetição e memorabilidade
[5] https://www.instagram.com/dariamedric/p/Deg6NTJCLy9 — Post: carrosséis médicos genéricos
[6] https://www.instagram.com/dariamedric/p/Degv45piPZO — Post: Reels e hooks
[7] https://www.instagram.com/dariamedric/p/DehppVRCAjx — Post: marca além do perfil
[8] https://www.instagram.com/dariamedric/p/DeglddVCJxt — Post: antes e depois e marca médica
[9] https://www.instagram.com/dariamedric/p/DdSPINTiHv6 — Carrossel: reconhecimento antes do contato
[10] https://www.threads.com/@dariamedric/post/DesK3hADgKY/the-biggest-lie-doctors-were-told-just-be-good-at-what-you-do-patients-will — Threads: competência não basta para ser escolhido
[11] https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf — Resolução CFM nº 2.336/2023
[12] https://portal.cfm.org.br/bb_publicacoes/manual-de-publicidade-medica — Manual de Publicidade Médica do CFM
[13] https://portal.cfm.org.br/noticias/cfm-atualiza-resolucao-da-publicidade-medica — CFM moderniza resolução da publicidade médica
