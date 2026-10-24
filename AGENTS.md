# MedCrivo — contexto para agentes

## Produto e arquitetura
- Plataforma de marketing médico ético, criação de conteúdo e auditoria científica (Crivo CFM/CFO).
- Construída com Next.js 16.4, React 19, TypeScript, Tailwind CSS v4, Supabase e Remotion.
- Rotas ficam em `src/app/`; UI em `src/components/`; domínio e integrações em `src/lib/`.
- Configurações de marca, site e ferramentas ficam em `src/config/`.
- Migrações e funções Supabase ficam em `supabase/`.
- Leia `docs/editorial/` e `docs/estrategia/` somente quando a tarefa envolver conteúdo ou estratégia.

## Validação
- Execute `npm run build` antes de concluir mudanças de produção.
- Testes ficam em `tests/`; execute com `npm test` quando disponível.

## Regras críticas
- Todo conteúdo gerado deve passar pelo Crivo (CFM 2.336/2023; CFO 196/2019) antes de qualquer publicação.
- Nunca invente especialidades, pesquisas ou títulos não documentados no perfil do usuário.
- Preserve isolamento de sessão e dados do usuário no Supabase.
- Não publique nem faça deploy sem aprovação explícita.
- Não percorra `node_modules`, Remotion render ou caches quando não for necessário à tarefa.

<!-- NOTA: o bloco nextjs-agent-rules que existia aqui era boilerplate gerado automaticamente pelo Next.js e foi substituído por este contexto real do projeto. Ele será recriado pelo next dev apenas na linha de trabalho não comitada; commitar este arquivo mantém o histórico limpo. -->
