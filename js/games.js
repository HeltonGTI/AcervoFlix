import { atualizarJogo, criarJogo, excluirJogo, listarJogos } from './api.js';

const usuario = JSON.parse(localStorage.getItem('gamevault_usuario') || 'null');
const tabela = document.getElementById('tabela-jogos');
const busca = document.getElementById('busca-jogos');
const totalJogos = document.getElementById('total-jogos');
const statTotal = document.getElementById('stat-total');
const statValor = document.getElementById('stat-valor');
const statPlataformas = document.getElementById('stat-plataformas');
const usuarioLogado = document.getElementById('usuario-logado');
const modal = document.getElementById('modal-jogo');
const form = document.getElementById('form-jogo');
const tituloModal = document.getElementById('titulo-modal');
const mensagemDashboard = document.getElementById('mensagem-dashboard');
const mensagemFormulario = document.getElementById('mensagem-formulario');
const btnNovo = document.getElementById('btn-novo-jogo');
const btnFechar = document.getElementById('btn-fechar-modal');
const btnCancelar = document.getElementById('btn-cancelar');
const btnSalvar = document.getElementById('btn-salvar');
const btnLogout = document.getElementById('btn-logout');
const btnDark = document.getElementById('btn-dark');

let jogos = [];

if (!usuario) {
  window.location.assign('./login.html');
  throw new Error('Usuario nao autenticado');
}

usuarioLogado.textContent = `Ola, ${usuario.nome}`;
document.documentElement.classList.toggle('dark', localStorage.getItem('gamevault_dark') === 'true');

btnNovo.addEventListener('click', abrirModalNovo);
btnFechar.addEventListener('click', fecharModal);
btnCancelar.addEventListener('click', fecharModal);
form.addEventListener('submit', salvarJogo);
busca.addEventListener('input', renderizarTabela);
btnLogout.addEventListener('click', sair);
btnDark.addEventListener('click', alternarDark);

tabela.addEventListener('click', (event) => {
  const botao = event.target.closest('button[data-acao]');
  if (!botao) return;

  const jogo = jogos.find((item) => item.id === botao.dataset.id);
  if (!jogo) return;

  if (botao.dataset.acao === 'editar') {
    abrirModalEdicao(jogo);
  }

  if (botao.dataset.acao === 'excluir') {
    removerJogo(jogo);
  }
});

tabela.addEventListener('click', (event) => {
  const botao = event.target.closest('button[data-empty-action]');
  if (botao) {
    abrirModalNovo();
  }
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    fecharModal();
  }
});

await carregarJogos();

async function carregarJogos() {
  tabela.innerHTML = linhaMensagem('Carregando jogos...');

  try {
    jogos = await listarJogos(usuario.id);
    renderizarTabela();
    atualizarEstatisticas();
  } catch (error) {
    tabela.innerHTML = linhaMensagem('Nao foi possivel carregar os jogos.', true);
    totalJogos.textContent = 'Falha ao carregar registros';
  }
}

function renderizarTabela() {
  const termo = busca.value.trim().toLowerCase();
  const filtrados = jogos.filter((jogo) => [
    jogo.titulo,
    jogo.genero,
    jogo.plataforma,
    jogo.preco,
    formatarData(jogo.lancamento),
  ].join(' ').toLowerCase().includes(termo));

  totalJogos.textContent = `${jogos.length} jogo${jogos.length === 1 ? '' : 's'} cadastrado${jogos.length === 1 ? '' : 's'}`;

  if (filtrados.length === 0) {
    tabela.innerHTML = jogos.length === 0
      ? linhaVazia()
      : linhaMensagem('Nenhum jogo encontrado para esta busca.');
    return;
  }

  tabela.innerHTML = filtrados.map((jogo) => `
    <tr class="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
      <td class="px-4 py-4 font-bold text-slate-950 dark:text-white">${escaparHtml(jogo.titulo)}</td>
      <td class="px-4 py-4 text-slate-600 dark:text-slate-300">${escaparHtml(jogo.genero)}</td>
      <td class="px-4 py-4 text-slate-600 dark:text-slate-300">${escaparHtml(jogo.plataforma)}</td>
      <td class="px-4 py-4 text-slate-600 dark:text-slate-300">${formatarMoeda(jogo.preco)}</td>
      <td class="px-4 py-4 text-slate-600 dark:text-slate-300">${formatarData(jogo.lancamento)}</td>
      <td class="px-4 py-4">
        <div class="flex justify-end gap-2">
          <button type="button" data-acao="editar" data-id="${jogo.id}" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-teal-200 bg-teal-50 text-teal-700 transition hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-400/10 dark:text-teal-300" title="Editar jogo" aria-label="Editar ${escaparHtml(jogo.titulo)}">
            <svg class="pointer-events-none h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
          </button>
          <button type="button" data-acao="excluir" data-id="${jogo.id}" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-400/10 dark:text-red-300" title="Excluir jogo" aria-label="Excluir ${escaparHtml(jogo.titulo)}">
            <svg class="pointer-events-none h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function salvarJogo(event) {
  event.preventDefault();
  const id = document.getElementById('jogo-id').value;
  const titulo = document.getElementById('titulo').value.trim();
  const genero = document.getElementById('genero').value.trim();
  const plataforma = document.getElementById('plataforma').value.trim();
  const precoInformado = document.getElementById('preco').value;
  const preco = precoInformado ? Number(precoInformado) : null;
  const lancamento = document.getElementById('lancamento').value || null;

  const erroValidacao = validarJogo({ titulo, genero, plataforma, preco });
  if (erroValidacao) {
    mostrarMensagem(erroValidacao, 'erro');
    return;
  }

  const jogo = {
    titulo,
    genero,
    plataforma,
    preco,
    lancamento,
    usuario_id: usuario.id,
  };

  setLoading(true);

  try {
    if (id) {
      await atualizarJogo(id, jogo);
      mostrarMensagem('Jogo atualizado com sucesso.', 'sucesso');
    } else {
      await criarJogo(jogo);
      mostrarMensagem('Jogo cadastrado com sucesso.', 'sucesso');
    }

    await carregarJogos();
    mostrarMensagemDashboard(id ? 'Jogo atualizado com sucesso.' : 'Jogo cadastrado com sucesso.', 'sucesso');
    setTimeout(fecharModal, 450);
  } catch (error) {
    mostrarMensagem(`Erro ao salvar: ${limparErro(error.message)}`, 'erro');
  } finally {
    setLoading(false);
  }
}

async function removerJogo(jogo) {
  const confirmado = confirm(`Deseja excluir "${jogo.titulo}"?`);
  if (!confirmado) return;

  try {
    await excluirJogo(jogo.id);
    await carregarJogos();
    mostrarMensagemDashboard('Jogo excluido com sucesso.', 'sucesso');
  } catch (error) {
    mostrarMensagemDashboard(`Erro ao excluir: ${limparErro(error.message)}`, 'erro');
  }
}

function abrirModalNovo() {
  form.reset();
  document.getElementById('jogo-id').value = '';
  tituloModal.textContent = 'Novo jogo';
  limparMensagem();
  abrirModal();
}

function abrirModalEdicao(jogo) {
  document.getElementById('jogo-id').value = jogo.id;
  document.getElementById('titulo').value = jogo.titulo || '';
  document.getElementById('genero').value = jogo.genero || '';
  document.getElementById('plataforma').value = jogo.plataforma || '';
  document.getElementById('preco').value = jogo.preco ?? '';
  document.getElementById('lancamento').value = jogo.lancamento || '';
  tituloModal.textContent = 'Editar jogo';
  limparMensagem();
  abrirModal();
}

function abrirModal() {
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('titulo').focus();
}

function fecharModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function sair() {
  localStorage.removeItem('gamevault_usuario');
  window.location.assign('./login.html');
}

function alternarDark() {
  const ativo = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', ativo);
  localStorage.setItem('gamevault_dark', String(ativo));
}

function atualizarEstatisticas() {
  const total = jogos.length;
  const valor = jogos.reduce((soma, jogo) => soma + Number(jogo.preco || 0), 0);
  const plataformas = new Set(jogos.map((jogo) => jogo.plataforma).filter(Boolean));

  statTotal.textContent = total;
  statValor.textContent = formatarMoeda(valor);
  statPlataformas.textContent = plataformas.size;
}

function validarJogo(jogo) {
  if (!jogo.titulo || !jogo.genero || !jogo.plataforma) {
    return 'Preencha titulo, genero e plataforma.';
  }

  if (jogo.preco !== null && (!Number.isFinite(jogo.preco) || jogo.preco < 0)) {
    return 'Informe um preco valido, sem valor negativo.';
  }

  return '';
}

function linhaMensagem(texto, erro = false) {
  const classe = erro ? 'text-red-600 dark:text-red-300' : 'text-slate-500 dark:text-slate-400';
  return `<tr><td colspan="6" class="px-4 py-10 text-center ${classe}">${escaparHtml(texto)}</td></tr>`;
}

function linhaVazia() {
  return `
    <tr>
      <td colspan="6" class="px-4 py-12 text-center">
        <div class="mx-auto max-w-sm">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect width="20" height="12" x="2" y="6" rx="2" /><line x1="6" x2="10" y1="11" y2="11" /><line x1="8" x2="8" y1="9" y2="13" /><line x1="15" x2="15.01" y1="12" y2="12" /><line x1="18" x2="18.01" y1="10" y2="10" /></svg>
          </div>
          <p class="mt-4 font-bold text-slate-950 dark:text-white">Nenhum jogo cadastrado</p>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Comece adicionando o primeiro titulo da sua biblioteca.</p>
          <button type="button" data-empty-action="novo" class="mt-4 rounded-md bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700">Cadastrar jogo</button>
        </div>
      </td>
    </tr>
  `;
}

function setLoading(loading) {
  btnSalvar.disabled = loading;
  btnSalvar.textContent = loading ? 'Salvando...' : 'Salvar';
  btnSalvar.classList.toggle('loading', loading);
}

function mostrarMensagem(texto, tipo) {
  mensagemFormulario.className = tipo === 'erro'
    ? 'rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2 dark:bg-red-950/40 dark:text-red-200'
    : 'rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 sm:col-span-2 dark:bg-emerald-950/40 dark:text-emerald-200';
  mensagemFormulario.textContent = texto;
}

function mostrarMensagemDashboard(texto, tipo) {
  mensagemDashboard.className = tipo === 'erro'
    ? 'border-b border-slate-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-slate-800 dark:bg-red-950/40 dark:text-red-200'
    : 'border-b border-slate-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-slate-800 dark:bg-emerald-950/40 dark:text-emerald-200';
  mensagemDashboard.textContent = texto;
  window.setTimeout(() => {
    mensagemDashboard.className = 'hidden border-b border-slate-200 px-4 py-3 text-sm dark:border-slate-800';
    mensagemDashboard.textContent = '';
  }, 3500);
}

function limparMensagem() {
  mensagemFormulario.className = 'hidden rounded-md px-3 py-2 text-sm sm:col-span-2';
  mensagemFormulario.textContent = '';
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valor || 0));
}

function formatarData(valor) {
  if (!valor) return '-';
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${valor}T00:00:00Z`));
}

function escaparHtml(valor) {
  const div = document.createElement('div');
  div.textContent = valor ?? '';
  return div.innerHTML;
}

function limparErro(texto) {
  return texto.replace(/[{}"]/g, '').slice(0, 180);
}
