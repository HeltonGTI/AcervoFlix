# GameVault - Sistema de Biblioteca de Games

Projeto academico com login, cadastro, area privada e CRUD completo de jogos usando HTML5, CSS3, JavaScript, Tailwind CSS e Supabase REST API.

## Funcionalidades

- Cadastro de usuario.
- Login com sessao salva no navegador.
- Area privada protegida.
- CRUD completo de jogos: criar, listar, editar e excluir.
- Tabela responsiva com busca.
- Cards estatisticos.
- Modal para cadastro e edicao.
- Modo dark.
- Validacao de dados no formulario e no banco para evitar preco negativo.
- Mensagens de retorno para cadastro, edicao e exclusao.
- Banco com duas tabelas, mais de 5 atributos e foreign key.

## Estrutura

```text
biblioteca-games/
|-- index.html
|-- login.html
|-- dashboard.html
|-- css/
|   `-- style.css
|-- js/
|   |-- supabase.js
|   |-- api.js
|   |-- auth.js
|   `-- games.js
|-- sql/
|   `-- tables.sql
`-- README.md
```

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Execute o arquivo `sql/tables.sql`.
4. Copie a URL do projeto e a anon public key.
5. Edite `js/supabase.js`:

```js
export const SUPABASE_URL = "SUA_URL";
export const SUPABASE_KEY = "SUA_KEY";
```

Se o login mostrar erro de conexao com o Supabase, confira primeiro se a URL do projeto ainda existe. Um projeto pausado, removido ou uma URL digitada errado faz o navegador falhar antes mesmo de consultar a tabela `usuarios`.

## Como executar localmente

Como o projeto usa arquivos JavaScript do tipo `module`, rode com um servidor local simples ou publique no GitHub Pages.

Exemplo com Python:

```bash
cd biblioteca-games
python -m http.server 5500
```

Depois acesse:

```text
http://localhost:5500
```

Usuario de teste criado pelo SQL:

```text
E-mail: demo@email.com
Senha: 123456
```

## Deploy no GitHub Pages

Depois de enviar para o GitHub:

1. Acesse Settings.
2. Entre em Pages.
3. Em Source, selecione GitHub Actions.
5. Acesse a URL gerada pelo GitHub Pages.

Se este projeto for enviado como repositorio proprio, a URL sera semelhante a:

```text
https://seuusuario.github.io/seurepositorio/
```

## Observacao de seguranca

Este projeto segue o modelo simples pedido para trabalho academico. A senha fica na tabela `usuarios` para facilitar a demonstracao com REST API. Em um sistema real, use Supabase Auth ou senhas com hash no backend, nunca senha em texto puro.
