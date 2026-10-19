import type { Metadata } from "next";
import { LegalPage, controllerLine } from "@/components/site/LegalPage";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: "Política de privacidade" };

export default function PrivacyPage() {
  return (
    <LegalPage kicker="LGPD" title="Política de privacidade" updated="19 de outubro de 2026">
      <p>
        Esta política explica quais dados a MedCrivo trata, para quê e quais são os seus direitos, conforme a Lei Geral de
        Proteção de Dados (Lei nº 13.709/2018).
      </p>
      <p>
        <strong>Controladora:</strong> {controllerLine()}.
      </p>

      <h2>1. Crivo grátis (sem cadastro)</h2>
      <p>
        O texto que você cola no Crivo grátis é analisado no seu próprio navegador. Ele não é enviado aos nossos servidores e
        não é guardado.
      </p>

      <h2>2. Dados da conta e do estúdio</h2>
      <ul>
        <li>Conta: e-mail e senha (a senha é guardada de forma criptografada pelo provedor de autenticação).</li>
        <li>Perfil profissional: nome, situação profissional, CRM/UF e RQE quando houver, especialidade, redes sociais e preferências de conteúdo.</li>
        <li>Conteúdo: temas, textos, posts gerados e pareceres do Crivo.</li>
        <li>Uso: registros técnicos de uso dos recursos de IA, para controle de cotas e de custos.</li>
      </ul>
      <p>
        Usamos esses dados para prestar o serviço (base legal: execução de contrato) e para segurança e prevenção de abuso
        (legítimo interesse). Não vendemos dados.
      </p>

      <h2>3. Dados de pacientes</h2>
      <p>
        Não envie dados que identifiquem pacientes. O estúdio foi feito para conteúdo educativo. O Crivo procura sinais de dados
        pessoais e avisa, mas a responsabilidade por não incluí-los é de quem publica.
      </p>

      <h2>4. Com quem compartilhamos</h2>
      <p>Usamos operadores que tratam dados só para executar o serviço:</p>
      <ul>
        <li>Supabase: banco de dados e autenticação.</li>
        <li>Vercel: hospedagem do site e do estúdio.</li>
        <li>Provedores de IA para gerar texto e imagem (Anthropic e Google) e serviços de geração de imagem.</li>
        <li>Consensus: busca de artigos científicos a partir do tema do post.</li>
      </ul>
      <p>
        Alguns desses provedores ficam fora do Brasil. Nesses casos, a transferência internacional segue o art. 33 da LGPD.
      </p>

      <h2>5. Por quanto tempo</h2>
      <p>
        Guardamos os dados enquanto a conta estiver ativa. Depois do encerramento, eles são apagados ou anonimizados, salvo o
        que a lei exigir manter.
      </p>

      <h2>6. Seus direitos</h2>
      <p>
        Você pode pedir confirmação, acesso, correção, portabilidade, anonimização ou exclusão dos seus dados e revogar
        consentimentos pelo e-mail <a href={`mailto:${SITE.contactEmail}`} className="font-semibold text-teal-700 underline">{SITE.contactEmail}</a>.
        Também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
      </p>

      <h2>7. Cookies</h2>
      <p>Usamos apenas os cookies necessários para manter você conectado(a) ao estúdio. Não usamos cookies de publicidade.</p>
    </LegalPage>
  );
}
