import { API_URL, SUPABASE_KEY } from './supabase.js';

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

export async function listarJogos(usuarioId) {
  return request(`/jogos?select=*&usuario_id=eq.${usuarioId}&order=titulo.asc`);
}

export async function criarJogo(jogo) {
  return request('/jogos', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(jogo),
  });
}

export async function atualizarJogo(id, jogo) {
  return request(`/jogos?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(jogo),
  });
}

export async function excluirJogo(id) {
  return request(`/jogos?id=eq.${id}`, {
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

function validarConfiguracao() {
  if (!API_URL.includes('https://') || API_URL.includes('SUA_URL')) {
    return 'Configure a SUPABASE_URL em js/supabase.js.';
  }

  if (!SUPABASE_KEY || SUPABASE_KEY.includes('SUA_KEY')) {
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
    return data.message || data.error_description || data.error || text;
  } catch {
    return text;
  }
}
