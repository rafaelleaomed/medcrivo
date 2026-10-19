-- Situação profissional do usuário:
--   medico       = tem CRM, ainda sem RQE (inclui residentes)
--   especialista = CRM + RQE
--   estudante    = sem CRM; o app não cobra o número nem escreve "MÉDICO" no rodapé dos posts.
alter table public.doctor_profiles
  add column if not exists career_stage text not null default 'medico'
  check (career_stage in ('medico', 'especialista', 'estudante'));
