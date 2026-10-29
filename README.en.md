<div align="center">

**Language:** [English](README.en.md) · [Português do Brasil](README.md)

# MedCrivo

**Digital-content planning, creation and review for healthcare professionals.**

</div>

## The problem

Physicians and dentists need to turn technical knowledge into understandable content without losing scientific rigor, professional identity or ethical compliance. Doing this consistently requires research, planning, production, review and approval.

MedCrivo brings these stages into an AI-assisted editorial workflow. The product supports content production; responsibility for the final material and its publication remains with the professional.

## What is implemented

- onboarding by profession, specialty, audience and editorial goals;
- topic planning and content calendar;
- generation of carousels, captions, scripts and video assets;
- conversational assistant for creation and refinement;
- trend radar and signals for new topics;
- rule-based medical and dental compliance review;
- consistency checks and multi-model consensus workflow;
- approval hub before content proceeds toward publication;
- studio components and programmatic rendering with Remotion.

## AI, ethics and oversight

AI supports research, structure and drafting. The workflow includes deterministic validation, compliance review and human approval. These controls reduce risk, but they do not replace professional judgment or guarantee compliance in every context.

The repository includes AI-governance documentation and specific rules for medical content. No material should be published automatically without review.

## Architecture

- **Application:** Next.js 16, React 19 and TypeScript;
- **Interface:** Tailwind CSS 4, Motion and custom components;
- **Data and authentication:** Supabase and PostgreSQL;
- **AI:** Anthropic Claude, Zod validation and consensus workflow;
- **Media:** Remotion compositions and rendering;
- **Quality:** tests for security, compliance, planning, radar and editorial engines.

## Run locally

```bash
npm install
npm run dev
```

External integrations require local configuration. Do not commit credentials or personal data.

## Current limitations

- automated review is not legal or regulatory advice;
- scientific references and clinical claims require verification before publication;
- trends and performance estimates do not guarantee reach or engagement;
- the project is evolving and retains mandatory human approval.

## Author

**Rafael Leão, MD, MSc:** building products at the intersection of healthcare, AI and communication.
[GitHub](https://github.com/rafaelleaomed) · [LinkedIn](https://www.linkedin.com/in/rafaelleaomed/)
