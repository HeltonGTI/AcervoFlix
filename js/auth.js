import { atualizarSenhaUsuario, buscarUsuarioPorEmail, buscarUsuarioPorLogin, criarUsuario } from './api.js?v=20260530-2';
import { obterUsuarioSessao, salvarSessao } from './session.js?v=20260601-1';

const formLogin = document.getElementById('form-login');
const formCadastro = document.getElementById('form-cadastro');
const formRecuperar = document.getElementById('form-recuperar');
const tabLogin = document.getElementById('tab-login');
const tabCadastro = document.getElementById('tab-cadastro');
const message = document.getElementById('message');
const btnLogin = document.getElementById('btn-login');
const btnCadastro = document.getElementById('btn-cadastro');
const btnRecuperar = document.getElementById('btn-recuperar');
const btnMostrarRecuperar = document.getElementById('btn-mostrar-recuperar');
const btnVoltarLogin = document.getElementById('btn-voltar-login');

tabLogin.addEventListener('click', () => alternarAba('login'));
tabCadastro.addEventListener('click', () => alternarAba('cadastro'));
btnMostrarRecuperar.addEventListener('click', () => alternarAba('recuperar'));
btnVoltarLogin.addEventListener('click', () => alternarAba('login'));
formLogin.addEventListener('submit', entrar);
formCadastro.addEventListener('submit', cadastrar);
formRecuperar.addEventListener('submit', recuperarSenha);

if (obterUsuarioSessao()) {
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

    await criarUsuario({ nome, email, senha });
    formCadastro.reset();
    document.getElementById('login-email').value = email;
    document.getElementById('login-senha').value = '';
    alternarAba('login', false);
    mostrarMensagem('Conta criada com sucesso. Entre com seu e-mail e senha para acessar.', 'sucesso');
  } catch (error) {
    mostrarMensagem(`Erro ao cadastrar: ${limparErro(error.message)}`, 'erro');
  } finally {
    setLoading(btnCadastro, false, 'Criar conta');
  }
}

async function recuperarSenha(event) {
  event.preventDefault();
  setLoading(btnRecuperar, true, 'Salvando...');

  try {
    const email = document.getElementById('recuperar-email').value.trim().toLowerCase();
    const senha = document.getElementById('recuperar-senha').value;
    const confirmacao = document.getElementById('recuperar-confirmacao').value;

    if (senha !== confirmacao) {
      mostrarMensagem('As senhas digitadas nao conferem.', 'erro');
      return;
    }

    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      mostrarMensagem('Nao existe usuario cadastrado com este e-mail.', 'erro');
      return;
    }

    await atualizarSenhaUsuario(email, senha);
    formRecuperar.reset();
    document.getElementById('login-email').value = email;
    alternarAba('login', false);
    mostrarMensagem('Senha alterada com sucesso. Entre usando a nova senha.', 'sucesso');
  } catch (error) {
    mostrarMensagem(`Erro ao alterar senha: ${limparErro(error.message)}`, 'erro');
  } finally {
    setLoading(btnRecuperar, false, 'Alterar senha');
  }
}

function alternarAba(aba, limparMensagem = true) {
  const loginAtivo = aba === 'login';
  const cadastroAtivo = aba === 'cadastro';
  const recuperarAtivo = aba === 'recuperar';
  formLogin.classList.toggle('hidden', !loginAtivo);
  formCadastro.classList.toggle('hidden', !cadastroAtivo);
  formRecuperar.classList.toggle('hidden', !recuperarAtivo);
  tabLogin.closest('div').classList.toggle('hidden', recuperarAtivo);
  tabLogin.setAttribute('aria-selected', String(loginAtivo));
  tabCadastro.setAttribute('aria-selected', String(cadastroAtivo));
  tabLogin.className = loginAtivo
    ? 'rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-950 shadow-sm'
    : 'rounded-md px-3 py-2 text-sm font-bold text-slate-300 transition hover:text-white';
  tabCadastro.className = cadastroAtivo
    ? 'rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-950 shadow-sm'
    : 'rounded-md px-3 py-2 text-sm font-bold text-slate-300 transition hover:text-white';

  if (limparMensagem) {
    message.classList.add('hidden');
  }
}

function setLoading(button, loading, text) {
  button.disabled = loading;
  button.textContent = text;
  button.classList.toggle('loading', loading);
}

function mostrarMensagem(texto, tipo) {
  message.className = tipo === 'erro'
    ? 'mt-4 rounded-md border border-red-400/30 bg-red-950/50 px-3 py-2 text-sm text-red-100'
    : 'mt-4 rounded-md border border-emerald-400/30 bg-emerald-950/50 px-3 py-2 text-sm text-emerald-100';
  message.textContent = texto;
}

function limparErro(texto) {
  return texto.replace(/[{}"]/g, '').slice(0, 180);
}
