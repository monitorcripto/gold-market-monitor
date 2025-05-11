
-- Criação da função para testar a conexão
create or replace function public.get_postgresql_version()
returns text
language sql
security definer
as $$
  select version();
$$;

-- Permite que usuários anônimos e autenticados chamem esta função
grant execute on function public.get_postgresql_version to anon, authenticated;
