create extension if not exists pgcrypto;

create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique not null,
  senha text not null,
  criado_em timestamp default now()
);

create table if not exists jogos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  genero text not null,
  plataforma text not null,
  preco numeric(10,2),
  lancamento date,
  usuario_id uuid references usuarios(id) on delete cascade
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'jogos_preco_nao_negativo'
  ) then
    alter table jogos
    add constraint jogos_preco_nao_negativo
    check (preco is null or preco >= 0);
  end if;
end $$;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on usuarios to anon, authenticated;
grant select, insert, update, delete on jogos to anon, authenticated;

alter table usuarios enable row level security;
alter table jogos enable row level security;

drop policy if exists "Permitir acesso publico em usuarios" on usuarios;
drop policy if exists "Permitir acesso publico em jogos" on jogos;

create policy "Permitir acesso publico em usuarios"
on usuarios
for all
to anon, authenticated
using (true)
with check (true);

create policy "Permitir acesso publico em jogos"
on jogos
for all
to anon, authenticated
using (true)
with check (true);

insert into usuarios (nome, email, senha)
values ('Aluno Demo', 'demo@email.com', '123456')
on conflict (email) do nothing;

insert into jogos (titulo, genero, plataforma, preco, lancamento, usuario_id)
select 'God of War Ragnarok', 'Acao e aventura', 'PS5', 299.90, '2022-11-09', id
from usuarios
where email = 'demo@email.com'
  and not exists (
    select 1
    from jogos
    where titulo = 'God of War Ragnarok'
  );
