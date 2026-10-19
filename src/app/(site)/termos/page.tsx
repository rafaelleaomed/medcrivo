import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, controllerLine } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "Termos de uso" };

export default function TermsPage() {
  return (
    <LegalPage kicker="Termos" title="Termos de uso" updated="19 de outubro de 2026">
      <p>
        Estes termos regem o uso do site e do estúdio da MedCrivo ({controllerLine()}). Ao usar o serviço, você concorda com
        eles.
      </p>

      <h2>1. O que a MedCrivo faz</h2>
      <p>
        A MedCrivo gera rascunhos de conteúdo de saúde com inteligência artificial e os revisa com o Crivo, uma triagem
        automatizada baseada na Resolução CFM nº 2.336/2023 e na LGPD.
      </p>

      <h2>2. O que o Crivo não é</h2>
      <ul>
        <li>Não é certificação, aprovação nem parecer do CFM ou de qualquer conselho profissional.</li>
        <li>Não é parecer jurídico. Ele pode deixar passar problemas e apontar falsos alarmes.</li>
        <li>O selo “Revisado pelo Crivo” indica só que o texto passou pela nossa revisão automatizada.</li>
      </ul>

      <h2>3. Sua responsabilidade</h2>
      <ul>
        <li>Revisar todo conteúdo antes de publicar, inclusive informações clínicas, números e referências.</li>
        <li>Informar corretamente a sua situação profissional, o CRM/UF e o RQE. Estudantes não podem se apresentar como médicos.</li>
        <li>Não enviar dados que identifiquem pacientes e obter as autorizações exigidas para qualquer imagem.</li>
        <li>Cumprir as normas do seu conselho e a legislação aplicável ao publicar.</li>
      </ul>

      <h2>4. Conteúdo gerado</h2>
      <p>
        Os rascunhos gerados para você podem ser usados por você livremente. A IA pode errar: conteúdo médico precisa de
        conferência de quem tem a formação para isso.
      </p>

      <h2>5. Planos e cancelamento</h2>
      <p>
        Os planos pagos são mensais e sem fidelidade. Compras on-line podem ser canceladas em até 7 dias com reembolso
        integral, conforme o art. 49 do Código de Defesa do Consumidor.
      </p>

      <h2>6. Uso proibido</h2>
      <p>
        É proibido usar o serviço para conteúdo enganoso, que prometa resultados, que exponha pacientes ou que viole direitos
        de terceiros. Contas que façam isso podem ser suspensas.
      </p>

      <h2>7. Privacidade</h2>
      <p>
        O tratamento de dados segue a nossa{" "}
        <Link href="/privacidade" className="font-semibold text-teal-700 underline">
          política de privacidade
        </Link>
        .
      </p>

      <h2>8. Alterações</h2>
      <p>Podemos atualizar estes termos. Mudanças relevantes serão avisadas no site ou por e-mail.</p>
    </LegalPage>
  );
}
