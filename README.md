# AcervoFlix 📽️

Sistema web para gerenciamento de uma watchlist privada de filmes e series, com autenticacao, dashboard administrativo, CRUD completo de favoritos, integracao com Supabase e busca online de titulos pelo TMDb.

O AcervoFlix foi desenvolvido como uma aplicacao front-end moderna, responsiva e sem etapa de build obrigatoria. A proposta e entregar uma experiencia direta: o usuario acessa, cria sua conta, pesquisa filmes ou series, salva seus favoritos e consulta onde assistir cada titulo.

## Autores 🖋️

- Anderson Henrique Domingues
- Helton Augusto de Toledo

## Sumario 

- [Acesso online](#acesso-online)
- [Visao geral](#visao-geral)
- [Demonstracao funcional](#demonstracao-funcional)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Modelo de dados](#modelo-de-dados)
- [Configuracao](#configuracao)
- [Execucao local](#execucao-local)
- [Deploy](#deploy)
- [Credenciais de demonstracao](#credenciais-de-demonstracao)
- [Seguranca e limites conhecidos](#seguranca-e-limites-conhecidos)
- [Roadmap](#roadmap)

## Acesso online 

Acesse o projeto publicado no GitHub Pages: <https://heltongti.github.io/AcervoFlix/>

## Visao geral

O projeto combina HTML, Tailwind CSS via CDN e JavaScript ES Modules para criar uma SPA leve organizada em paginas:

- `index.html`: landing page de apresentacao do produto.
- `login.html`: autenticacao, cadastro e recuperacao simples de senha.
- `dashboard.html`: area privada com estatisticas, busca online, formulario e tabela de favoritos.

A persistencia e feita no Supabase por meio da REST API nativa do PostgREST. A pesquisa de filmes e series usa a API do TMDb, incluindo resultados por nome, genero e categoria, alem de provedores de streaming disponiveis no Brasil quando retornados pela API.

## Demonstracao funcional

Fluxo principal da aplicacao:

1. O usuario acessa a landing page.
2. Entra com uma conta existente ou cria um novo cadastro.
3. A sessao e salva no `localStorage`.
4. O dashboard carrega apenas os favoritos vinculados ao usuario autenticado.
5. O usuario pode pesquisar titulos online, adicionar sugestoes a watchlist, editar dados, excluir registros ou limpar todos os favoritos.
6. A interface atualiza estatisticas de total de titulos, categorias e plataformas.

## Funcionalidades

- Cadastro de novos usuarios.
- Login com persistencia de sessao no navegador.
- Recuperacao simplificada de senha por e-mail cadastrado.
- Rota privada com redirecionamento automatico para usuarios nao autenticados.
- CRUD completo de filmes e series.
- Prevencao de titulos duplicados por usuario.
- Busca local por nome, tipo, categoria, plataforma, avaliacao ou URL.
- Filtro por tipo: filmes, series ou todos.
- Estatisticas automaticas no dashboard.
- Busca online no TMDb por:
  - nome do titulo;
  - genero;
  - categoria.
- Consulta de provedores de streaming no Brasil.
- Sugestoes de categorias e plataformas via `datalist`.
- Cards de resultados online com poster, tipo, categoria, avaliacao e link externo.
- Link "Assistir" com fallback para JustWatch.
- Modo claro e modo escuro com preferencia salva no navegador.
- Layout responsivo para desktop e dispositivos moveis.
- Mensagens de sucesso, erro, carregamento e estado vazio.
- Deploy automatizado no GitHub Pages via GitHub Actions.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Interface | HTML5, CSS3, Tailwind CSS |
| Logica | JavaScript ES Modules |
| Banco de dados | PostgreSQL via Supabase |
| API de dados | Supabase REST API / PostgREST |
| API externa | TMDb API |
| Hospedagem | GitHub Pages |
| CI/CD | GitHub Actions |

## Arquitetura

```text
Navegador
   |
   |-- HTML + Tailwind + CSS
   |-- JavaScript ES Modules
   |
   |-- localStorage
   |     |-- cinevault_usuario
   |     `-- cinevault_dark
   |
   |-- Supabase REST API
   |     |-- usuarios
   |     `-- filmes
   |
   `-- TMDb API
         |-- search/multi
         |-- discover/movie
         |-- discover/tv
         `-- watch/providers
```

### Modulos JavaScript

| Arquivo | Responsabilidade |
| --- | --- |
| `js/supabase.js` | Centraliza URL do Supabase, chave publica e chave TMDb. |
| `js/api.js` | Implementa a camada de acesso a dados via REST API. |
| `js/auth.js` | Controla login, cadastro, recuperacao de senha e sessao. |
| `js/filmes.js` | Controla dashboard, CRUD, filtros, estatisticas, modo escuro e integracao TMDb. |

## Estrutura do projeto

```text
AcervoFlix/
|-- .github/
|   `-- workflows/
|       `-- deploy.yml
|-- css/
|   `-- style.css
|-- js/
|   |-- api.js
|   |-- auth.js
|   |-- filmes.js
|   `-- supabase.js
|-- sql/
|   `-- tables.sql
|-- dashboard.html
|-- index.html
|-- login.html
`-- README.md
```

## Modelo de dados

O banco de dados possui duas entidades principais.

### `usuarios`

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `id` | `uuid` | Identificador unico gerado automaticamente. |
| `nome` | `text` | Nome do usuario. |
| `email` | `text` | E-mail unico usado no login. |
| `senha` | `text` | Senha usada no fluxo academico do projeto. |
| `criado_em` | `timestamp` | Data de criacao do usuario. |

### `filmes`

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `id` | `uuid` | Identificador unico gerado automaticamente. |
| `nome` | `text` | Nome do filme ou serie. |
| `tipo` | `text` | Tipo do titulo: `Filme` ou `Serie`. |
| `categoria` | `text` | Genero ou categoria principal. |
| `plataforma` | `text` | Plataforma onde o titulo esta disponivel. |
| `avaliacao` | `numeric(3,1)` | Nota do titulo quando disponivel. |
| `imagem` | `text` | URL do poster ou imagem do titulo. |
| `url` | `text` | Link externo para detalhes ou pagina de streaming. |
| `usuario_id` | `uuid` | Chave estrangeira para `usuarios.id`. |

O script `sql/tables.sql` tambem cria:

- extensao `pgcrypto`;
- relacionamento entre `filmes.usuario_id` e `usuarios.id`;
- indice unico para evitar titulos duplicados por usuario;
- politicas basicas de acesso para uso academico;
- usuario e registros de demonstracao.

## Configuracao

### 1. Supabase

1. Crie um projeto no Supabase.
2. Acesse o SQL Editor.
3. Execute o script:

```sql
sql/tables.sql
```

4. Copie a URL do projeto.
5. Copie a chave publica `anon` ou `publishable`.
6. Atualize o arquivo `js/supabase.js`:

```js
export const SUPABASE_URL = "SUA_URL_DO_SUPABASE";
export const SUPABASE_KEY = "SUA_CHAVE_PUBLICA_DO_SUPABASE";
export const TMDB_API_KEY = "SUA_CHAVE_TMDB_V3";

export const API_URL = `${SUPABASE_URL}/rest/v1`;
```

### 2. TMDb

1. Crie uma conta em `https://www.themoviedb.org/`.
2. Acesse as configuracoes da conta.
3. Entre na area de API.
4. Gere uma API Key v3.
5. Configure o valor em `TMDB_API_KEY`.

> Em aplicacoes front-end publicas, chaves usadas diretamente no navegador ficam visiveis. Para producao, recomenda-se proteger chamadas sensiveis em uma camada backend, como Supabase Edge Functions, serverless functions ou API propria.

## Execucao local

Como o projeto usa `type="module"`, abra os arquivos por um servidor local.

### Opcao com Python

```bash
cd AcervoFlix
python -m http.server 5500
```

Acesse:

```text
http://localhost:5500
```

### Opcao com Node.js

```bash
npx serve AcervoFlix
```

## Deploy

O projeto inclui um workflow em `.github/workflows/deploy.yml` para publicar no GitHub Pages.

### Passos

1. Envie o projeto para um repositorio no GitHub.
2. Acesse `Settings > Pages`.
3. Em `Source`, selecione `GitHub Actions`.
4. Faca push na branch `main`.
5. Aguarde a execucao do workflow `Deploy GitHub Pages`.

A URL final seguira o formato:

```text
https://seuusuario.github.io/seurepositorio/
```

## Credenciais de demonstracao

O script SQL cria um usuario inicial para testes:

```text
E-mail: demo@email.com
Senha: 123456
```

## Seguranca e limites conhecidos

Este projeto foi criado para fins academicos e demonstracao de conceitos web. Para um ambiente de producao, recomenda-se evoluir os seguintes pontos:

- Substituir o login manual pela autenticacao nativa do Supabase Auth.
- Armazenar senhas com hash seguro, nunca em texto puro.
- Usar Row Level Security com politicas restritas por usuario autenticado.
- Mover chaves e chamadas sensiveis para uma camada backend.
- Aplicar validacoes adicionais no banco de dados.
- Criar testes automatizados para os fluxos criticos.
- Implementar logs e monitoramento para falhas de API.

## Roadmap

Possiveis evolucoes futuras:

- Autenticacao com Supabase Auth.
- Favoritos com status: quero assistir, assistindo e concluido.
- Campo de nota pessoal do usuario.
- Comentarios ou resenhas por titulo.
- Ordenacao por avaliacao, nome, categoria e data de cadastro.
- Importacao/exportacao da watchlist.
- PWA com instalacao no dispositivo.
- Testes end-to-end para login, cadastro e CRUD.

## Status

Projeto funcional e pronto para apresentacao, com landing page, autenticacao, dashboard privado, integracao com Supabase, busca online via TMDb, CRUD completo de favoritos e deploy automatizado pelo GitHub Pages.
