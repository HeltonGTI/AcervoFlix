import { buscarUsuarioPorEmail, buscarUsuarioPorLogin, criarUsuario } from './api.js';

const formLogin = document.getElementById('form-login');
const formCadastro = document.getElementById('form-cadastro');
const tabLogin = document.getElementById('tab-login');
const tabCadastro = document.getElementById('tab-cadastro');
const message = document.getElementById('message');
const btnLogin = document.getElementById('btn-login');
const btnCadastro = document.getElementById('btn-cadastro');

tabLogin.addEventListener('click', () => alternarAba('login'));
tabCadastro.addEventListener('click', () => alternarAba('cadastro'));
formLogin.addEventListener('submit', entrar);
formCadastro.addEventListener('submit', cadastrar);

if (localStorage.getItem('gamevault_usuario')) {
  window.location.assign('./dashboard.html');
}

async function entrar(event) {
  event.preventDefault();
  setLoading(btnLogin, true, 'Entrando...');

  try {
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const senha = document.getElementById('login-senha').value;
    const usuario = await buscarUsuarioPorLogin(email, senha);

    if (!usuario) {
      mostrarMensagem('E-mail ou senha invalidos.', 'erro');
      return;
    }

    salvarSessao(usuario);
    window.location.assign('./dashboard.html');
  } catch (error) {
    mostrarMensagem(`Erro ao fazer login: ${limparErro(error.message)}`, 'erro');
  } finally {
    setLoading(btnLogin, false, 'Entrar');
  }
}

async function cadastrar(event) {
  event.preventDefault();
  setLoading(btnCadastro, true, 'Criando...');

  try {
    const nome = document.getElementById('cadastro-nome').value.trim();
    const email = document.getElementById('cadastro-email').value.trim().toLowerCase();
    const senha = document.getElementById('cadastro-senha').value;

    const existente = await buscarUsuarioPorEmail(email);
    if (existente) {
      mostrarMensagem('Ja existe um usuario com este e-mail.', 'erro');
      return;
    }

    const usuarios = await criarUsuario({ nome, email, senha });
    salvarSessao(usuarios[0]);
    window.location.assign('./dashboard.html');
  } catch (error) {
    mostrarMensagem(`Erro ao cadastrar: ${limparErro(error.message)}`, 'erro');
  } finally {
    setLoading(btnCadastro, false, 'Criar conta');
  }
}

function alternarAba(aba) {
  const cadastroAtivo = aba === 'cadastro';
  formLogin.classList.toggle('hidden', cadastroAtivo);
  formCadastro.classList.toggle('hidden', !cadastroAtivo);
  tabLogin.setAttribute('aria-selected', String(!cadastroAtivo));
  tabCadastro.setAttribute('aria-selected', String(cadastroAtivo));
  tabLogin.className = cadastroAtivo
    ? 'rounded-md px-3 py-2 text-sm font-bold text-slate-500'
    : 'rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-950 shadow-sm';
  tabCadastro.className = cadastroAtivo
    ? 'rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-950 shadow-sm'
    : 'rounded-md px-3 py-2 text-sm font-bold text-slate-500';
  message.classList.add('hidden');
}

function salvarSessao(usuario) {
  localStorage.setItem('gamevault_usuario', JSON.stringify({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  }));
}

function setLoading(button, loading, text) {
  button.disabled = loading;
  button.textContent = text;
  button.classList.toggle('loading', loading);
}

function mostrarMensagem(texto, tipo) {
  message.className = tipo === 'erro'
    ? 'mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700'
    : 'mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700';
  message.textContent = texto;
}

function limparErro(texto) {
  return texto.replace(/[{}"]/g, '').slice(0, 180);
}
