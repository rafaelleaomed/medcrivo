-- Os privilégios padrão do Supabase concedem ALL ao papel `authenticated` em tabelas novas de `public`
-- (inclusive TRUNCATE, que não passa por RLS). Reduz ao mínimo que o app usa.

revoke all on public.doctor_profiles, public.posts, public.generation_jobs, public.ai_usage_events from authenticated;

grant select, insert, update on public.doctor_profiles to authenticated;
grant select, insert, update, delete on public.posts to authenticated;
grant select, insert, update on public.generation_jobs to authenticated;
grant select, insert on public.ai_usage_events to authenticated;
