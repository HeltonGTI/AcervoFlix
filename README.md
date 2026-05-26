# GameVault - Biblioteca de Games

GameVault é um sistema web acadêmico para gerenciamento de uma biblioteca pessoal de jogos. A aplicação permite cadastrar usuários, autenticar sessão, acessar uma área privada e realizar o CRUD completo de jogos integrado ao Supabase via REST API.

## Visão geral

O projeto foi desenvolvido com foco em uma experiência simples, responsiva e funcional, reunindo recursos essenciais de uma aplicação web com autenticação, persistência de dados e interface administrativa.

## Funcionalidades

- Cadastro e login de usuários.
- Sessão salva no navegador.
- Área privada protegida.
- Cadastro, listagem, edição e exclusão de jogos.
- Busca na tabela de jogos.
- Cards estatísticos no dashboard.
- Modal para criação e edição de registros.
- Layout responsivo com Tailwind CSS.
- Modo claro e modo escuro.
- Validação de dados no formulário.
- Restrição no banco para impedir preço negativo.
- Mensagens de retorno para ações do usuário.
- Banco de dados relacional com chave estrangeira entre usuários e jogos.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript ES Modules
- Tailwind CSS
- Supabase REST API
- PostgreSQL
- GitHub Pages
- GitHub Actions

## Estrutura do projeto

```text
biblioteca-games/
|-- .github/
|   `-- workflows/
|       `-- deploy.yml
|-- css/
|   `-- style.css
|-- js/
|   |-- api.js
|   |-- auth.js
|   |-- games.js
|   `-- supabase.js
|-- sql/
|   `-- tables.sql
|-- dashboard.html
|-- index.html
|-- login.html
`-- README.md
```

## Configuração do Supabase

1. Crie um projeto no Supabase.
2. Acesse o SQL Editor.
3. Execute o script disponível em `sql/tables.sql`.
4. Copie a URL do projeto e a chave pública anon/publishable.
5. Atualize o arquivo `js/supabase.js`:

```js
export const SUPABASE_URL = "SUA_URL_DO_SUPABASE";
export const SUPABASE_KEY = "SUA_CHAVE_PUBLICA";

export const API_URL = `${SUPABASE_URL}/rest/v1`;
```

Caso o login apresente erro de conexão, verifique se a URL do projeto está correta e se o projeto do Supabase está ativo. Projetos pausados, removidos ou URLs digitadas incorretamente impedem a comunicação com a API antes mesmo da consulta às tabelas.

## Banco de dados

O script SQL cria duas tabelas principais:

- `usuarios`: armazena nome, e-mail, senha e data de criação.
- `jogos`: armazena título, gênero, plataforma, preço, data de lançamento e vínculo com o usuário.

Também são configurados:

- extensão `pgcrypto` para geração de UUID;
- chave estrangeira entre `jogos.usuario_id` e `usuarios.id`;
- constraint para impedir preços negativos;
- políticas básicas de acesso para uso acadêmico via Supabase REST API;
- usuário e jogo de demonstração.

## Como executar localmente

Como o projeto utiliza JavaScript do tipo `module`, execute a aplicação com um servidor local.

Exemplo com Python:

```bash
cd biblioteca-games
python -m http.server 5500
```

Depois, acesse no navegador:

```text
http://localhost:5500
```

## Credenciais de demonstração

O script SQL cria um usuário inicial para testes:

```text
E-mail: demo@email.com
Senha: 123456
```

## Deploy no GitHub Pages

O projeto já inclui um workflow em `.github/workflows/deploy.yml` para publicação automática no GitHub Pages.

Para publicar:

1. Envie o projeto para um repositório no GitHub.
2. Acesse `Settings > Pages`.
3. Em `Source`, selecione `GitHub Actions`.
4. Faça push na branch `main`.
5. Aguarde a execução do workflow `Deploy GitHub Pages`.

A URL publicada seguirá o padrão:

```text
https://seuusuario.github.io/seurepositorio/
```

## Observações de segurança

Este projeto foi criado para fins acadêmicos. Em um ambiente de produção, recomenda-se utilizar autenticação nativa do Supabase, regras de Row Level Security mais restritivas e nunca armazenar senhas em texto puro.

## Status do projeto

Projeto funcional com landing page, tela de login, dashboard administrativo, integração com Supabase e deploy automatizado pelo GitHub Pages.
