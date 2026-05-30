create extension if not exists pgcrypto;

create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique not null,
  senha text not null,
  criado_em timestamp default now()
);

create table if not exists filmes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null default 'Filme',
  categoria text not null,
  plataforma text not null,
  avaliacao numeric(3,1),
  imagem text,
  url text,
  usuario_id uuid references usuarios(id) on delete cascade
);

alter table filmes add column if not exists imagem text;
alter table filmes add column if not exists url text;
alter table filmes add column if not exists tipo text not null default 'Filme';
alter table filmes add column if not exists avaliacao numeric(3,1);

create unique index if not exists filmes_titulo_unico_por_usuario
on filmes (usuario_id, lower(regexp_replace(trim(nome), '\s+', ' ', 'g')));

notify pgrst, 'reload schema';

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on usuarios to anon, authenticated;
grant select, insert, update, delete on filmes to anon, authenticated;

alter table usuarios enable row level security;
alter table filmes enable row level security;

drop policy if exists "Permitir acesso publico em usuarios" on usuarios;
drop policy if exists "Permitir acesso publico em filmes" on filmes;

create policy "Permitir acesso publico em usuarios"
on usuarios
for all
to anon, authenticated
using (true)
with check (true);

create policy "Permitir acesso publico em filmes"
on filmes
for all
to anon, authenticated
using (true)
with check (true);

insert into usuarios (nome, email, senha)
values ('Aluno Demo', 'demo@email.com', '123456')
on conflict (email) do nothing;

insert into filmes (nome, tipo, categoria, plataforma, avaliacao, imagem, url, usuario_id)
select
  'Projeto Hail Mary',
  'Filme',
  'Ficcao cientifica',
  'Claro tv+',
  null,
  'https://images.justwatch.com/backdrop/332529663/s640/projeto-hail-mary.jpg',
  'https://www.justwatch.com/br/filme/projeto-hail-mary',
  id
from usuarios
where email = 'demo@email.com'
  and not exists (
    select 1
    from filmes
    where nome = 'Projeto Hail Mary'
      and usuario_id = usuarios.id
  );

insert into filmes (nome, tipo, categoria, plataforma, avaliacao, imagem, url, usuario_id)
select
  'The Boys',
  'Serie',
  'Acao',
  'Prime Video',
  8.7,
  'https://images.justwatch.com/backdrop/109745293/s640/the-boys.jpg',
  'https://www.justwatch.com/br/serie/the-boys',
  id
from usuarios
where email = 'demo@email.com'
  and not exists (
    select 1
    from filmes
    where nome = 'The Boys'
      and usuario_id = usuarios.id
  );

insert into filmes (nome, tipo, categoria, plataforma, avaliacao, imagem, url, usuario_id)
select
  'O Diabo Veste Prada',
  'Filme',
  'Comedia',
  'Disney+',
  6.9,
  'https://images.justwatch.com/backdrop/322060919/s640/o-diabo-veste-prada.jpg',
  'https://www.justwatch.com/br/filme/o-diabo-veste-prada',
  id
from usuarios
where email = 'demo@email.com'
  and not exists (
    select 1
    from filmes
    where nome = 'O Diabo Veste Prada'
      and usuario_id = usuarios.id
  );

insert into filmes (nome, tipo, categoria, plataforma, avaliacao, imagem, url, usuario_id)
select
  'Origem',
  'Serie',
  'Suspense',
  'Globoplay',
  8.2,
  'https://images.justwatch.com/backdrop/344518670/s640/from.jpg',
  'https://www.justwatch.com/br/serie/from',
  id
from usuarios
where email = 'demo@email.com'
  and not exists (
    select 1
    from filmes
    where nome = 'Origem'
      and usuario_id = usuarios.id
  );

insert into filmes (nome, tipo, categoria, plataforma, avaliacao, imagem, url, usuario_id)
select
  'Socorro!',
  'Filme',
  'Suspense',
  'Disney+',
  null,
  'https://images.justwatch.com/poster/343698920/s592/pedido-de-socorro.jpg',
  'https://www.justwatch.com/br/filme/pedido-de-socorro',
  id
from usuarios
where email = 'demo@email.com'
  and not exists (
    select 1
    from filmes
    where nome = 'Socorro!'
      and usuario_id = usuarios.id
  );

insert into filmes (nome, tipo, categoria, plataforma, avaliacao, imagem, url, usuario_id)
select
  'O Segredo de Widow''s Bay',
  'Serie',
  'Terror',
  'Apple TV',
  null,
  'https://images.justwatch.com/backdrop/340329342/s640/widows-bay.jpg',
  'https://www.justwatch.com/br/serie/widows-bay',
  id
from usuarios
where email = 'demo@email.com'
  and not exists (
    select 1
    from filmes
    where nome = 'O Segredo de Widow''s Bay'
      and usuario_id = usuarios.id
  );
