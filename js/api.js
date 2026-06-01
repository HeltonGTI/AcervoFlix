import { API_URL, SUPABASE_KEY } from './supabase.js?v=20260530-3';

const erroConfiguracao = validarConfiguracao();

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

export async function buscarUsuarioPorLogin(email, senha) {
  const filtroEmail = encodeURIComponent(email);
  const filtroSenha = encodeURIComponent(senha);
  const data = await request(`/usuarios?select=*&email=eq.${filtroEmail}&senha=eq.${filtroSenha}&limit=1`);
  return data[0] || null;
}

export async function buscarUsuarioPorEmail(email) {
  const filtroEmail = encodeURIComponent(email);
  const data = await request(`/usuarios?select=id,email&email=eq.${filtroEmail}&limit=1`);
  return data[0] || null;
}

export async function criarUsuario(usuario) {
  return request('/usuarios', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(usuario),
  });
}

export async function atualizarSenhaUsuario(email, senha) {
  const filtroEmail = encodeURIComponent(email);
  return request(`/usuarios?email=eq.${filtroEmail}`, {
    method: 'PATCH',
    body: JSON.stringify({ senha }),
  });
}

export async function listarFilmes(usuarioId) {
  return request(`/filmes?select=*&usuario_id=eq.${usuarioId}&order=nome.asc`);
}

export async function criarFilme(filme) {
  return salvarFilmeComFallback('/filmes', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
  }, filme);
}

export async function atualizarFilme(id, filme) {
  return salvarFilmeComFallback(`/filmes?id=eq.${id}`, {
    method: 'PATCH',
  }, filme);
}

export async function excluirFilme(id) {
  return request(`/filmes?id=eq.${id}`, {
    method: 'DELETE',
  });
}

export async function excluirTodosFilmes(usuarioId) {
  return request(`/filmes?usuario_id=eq.${usuarioId}`, {
    method: 'DELETE',
  });
}

async function request(path, options = {}) {
  if (erroConfiguracao) {
    throw new Error(erroConfiguracao);
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new Error('Nao foi possivel conectar ao Supabase. Confira a URL do projeto, a conexao com a internet e se o projeto esta ativo.');
  }

  if (!response.ok) {
    const mensagem = await obterMensagemErro(response);
    throw new Error(mensagem || `Erro HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function salvarFilmeComFallback(path, options, filme) {
  try {
    return await request(path, {
      ...options,
      body: JSON.stringify(prepararFilme(filme)),
    });
  } catch (error) {
    if (!ehErroColunaAvaliacao(error.message)) {
      throw error;
    }

    return request(path, {
      ...options,
      body: JSON.stringify(prepararFilme(filme, false)),
    });
  }
}

function ehErroColunaAvaliacao(mensagem) {
  return mensagem.includes('Coluna avaliacao nao encontrada')
    || mensagem.includes("'avaliacao' column")
    || mensagem.includes('avaliacao');
}

function prepararFilme(filme, incluirAvaliacao = true) {
  const dados = {
    nome: filme.nome || null,
    tipo: filme.tipo || 'Filme',
    categoria: filme.categoria,
    plataforma: filme.plataforma,
    imagem: filme.imagem || null,
    url: filme.url || null,
    usuario_id: filme.usuario_id,
  };

  if (incluirAvaliacao) {
    dados.avaliacao = filme.avaliacao;
  }

  return dados;
}

function validarConfiguracao() {
  if (!API_URL.includes('https://') || API_URL.includes('SUA_URL')) {
    return 'Configure a SUPABASE_URL em js/supabase.js.';
  }

  if (!SUPABASE_KEY || SUPABASE_KEY.includes('SUA_KEY') || SUPABASE_KEY.includes('SUA_CHAVE')) {
    return 'Configure a SUPABASE_KEY em js/supabase.js.';
  }

  return '';
}

async function obterMensagemErro(response) {
  const text = await response.text();

  if (!text) {
    return '';
  }

  try {
    const data = JSON.parse(text);
    if (data.code === 'PGRST205') {
      return 'Tabela nao encontrada no Supabase. Execute o script sql/tables.sql no SQL Editor do projeto configurado em js/supabase.js.';
    }

    if (data.code === 'PGRST204' && data.message?.includes("'imagem' column")) {
      return 'Coluna imagem nao encontrada no Supabase. Execute no SQL Editor: alter table filmes add column if not exists imagem text; notify pgrst, \'reload schema\';';
    }

    if (data.code === 'PGRST204' && data.message?.includes("'url' column")) {
      return 'Coluna url nao encontrada no Supabase. Execute no SQL Editor: alter table filmes add column if not exists url text; notify pgrst, \'reload schema\';';
    }

    if (data.code === 'PGRST204' && data.message?.includes("'avaliacao' column")) {
      return 'Coluna avaliacao nao encontrada no Supabase. Execute no SQL Editor: alter table filmes add column if not exists avaliacao numeric(3,1); notify pgrst, \'reload schema\';';
    }

    return data.message || data.error_description || data.error || text;
  } catch {
    return text;
  }
}
