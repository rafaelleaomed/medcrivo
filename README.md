<div align="center">

**Idioma:** [Português do Brasil](README.md) · [English](README.en.md)

# MedCrivo

**Planejamento, criação e revisão de conteúdo digital para profissionais de saúde.**

</div>

## O problema

Médicos e dentistas precisam transformar conhecimento técnico em conteúdo compreensível sem perder rigor científico, identidade profissional ou conformidade ética. Fazer isso de forma consistente envolve pesquisa, planejamento, criação, revisão e aprovação.

O MedCrivo reúne essas etapas em um fluxo editorial assistido por IA. A ferramenta apoia a produção; a responsabilidade pelo conteúdo e pela publicação continua com o profissional.

## O que está implementado

- onboarding por profissão, especialidade, público e objetivos editoriais;
- planejamento de pautas e calendário de conteúdo;
- geração de carrosséis, legendas, roteiros e peças para vídeo;
- assistente conversacional para criação e refinamento;
- radar de tendências e sinais para novas pautas;
- revisão de conformidade baseada em regras médicas e odontológicas;
- checagem de consistência e consenso entre modelos;
- hub de aprovação antes de qualquer conteúdo seguir para publicação;
- componentes de estúdio e renderização programática com Remotion.

## IA, ética e supervisão

A IA é usada para pesquisa, estruturação e criação de rascunhos. O fluxo inclui validações determinísticas, revisão de conformidade e aprovação humana. Essas barreiras reduzem risco, mas não substituem a análise do profissional nem garantem conformidade em todos os contextos.

O repositório inclui documentação de governança de IA e regras específicas para conteúdo médico. Nenhum conteúdo deve ser publicado automaticamente sem revisão.

## Arquitetura

- **Aplicação:** Next.js 16, React 19 e TypeScript;
- **Interface:** Tailwind CSS 4, Motion e componentes próprios;
- **Dados e autenticação:** Supabase e PostgreSQL;
- **IA:** Anthropic Claude, validação Zod e fluxo de consenso;
- **Mídia:** Remotion para composições e renderização;
- **Qualidade:** testes para segurança, compliance, planejamento, radar e motores editoriais.

## Executar localmente

```bash
npm install
npm run dev
```

As integrações externas exigem configuração local. Não versione credenciais nem dados pessoais.

## Limitações atuais

- a revisão automática não equivale a parecer jurídico ou regulatório;
- referências científicas e afirmações clínicas precisam ser conferidas antes da publicação;
- tendências e previsões de desempenho não garantem alcance ou engajamento;
- o projeto está em evolução e mantém aprovação humana como etapa obrigatória.

## Autor

**Rafael Leão, médico e mestre pela UFMG:** criador de produtos na interseção entre saúde, IA e comunicação.
[GitHub](https://github.com/rafaelleaomed) · [LinkedIn](https://www.linkedin.com/in/rafaelleaomed/)
