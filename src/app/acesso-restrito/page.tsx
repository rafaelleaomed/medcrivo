import { logout } from "@/app/login/actions";
import { BrandMark } from "@/components/BrandMark";

export default function RestrictedAccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#F5F2E9] dark:bg-[#0C1F1C]">
      <section className="w-full max-w-md rounded-2xl border border-[#E2DDD0] dark:border-[#23463F] bg-white dark:bg-[#132D29] p-6 shadow-sm">
        <BrandMark size={34} />
        <h1 className="mt-5 text-xl font-semibold text-[#123C36] dark:text-white">Acesso restrito</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Esta conta não tem permissão para acessar o estúdio privado da MedCrivo.
        </p>
        <form action={logout} className="mt-5">
          <button type="submit" className="w-full rounded-lg bg-[#123C36] px-3 py-2 text-sm font-semibold text-white dark:bg-[#D6EF72] dark:text-[#123C36]">
            Sair desta conta
          </button>
        </form>
      </section>
    </main>
  );
}
