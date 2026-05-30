import { atualizarFilme, criarFilme, excluirFilme, excluirTodosFilmes, listarFilmes } from './api.js?v=20260530-8';
import { TMDB_API_KEY } from './supabase.js?v=20260530-4';

const usuario = obterUsuarioSessao();
const listaFilmes = document.getElementById('lista-filmes');
const busca = document.getElementById('busca-filmes');
const filtroTipo = document.getElementById('filtro-tipo');
const totalFilmes = document.getElementById('total-filmes');
const statTotal = document.getElementById('stat-total');
const statCategorias = document.getElementById('stat-categorias');
const statPlataformas = document.getElementById('stat-plataformas');
const usuarioLogado = document.getElementById('usuario-logado');
const form = document.getElementById('form-filme');
const tituloFormulario = document.getElementById('titulo-formulario');
const mensagemDashboard = document.getElementById('mensagem-dashboard');
const mensagemFormulario = document.getElementById('mensagem-formulario');
const formBuscaWeb = document.getElementById('form-busca-web');
const buscaWeb = document.getElementById('busca-web');
const btnBuscaWeb = document.getElementById('btn-busca-web');
const statusBuscaWeb = document.getElementById('status-busca-web');
const resultadosWeb = document.getElementById('resultados-web');
const listaCategorias = document.getElementById('lista-categorias');
const listaPlataformas = document.getElementById('lista-plataformas');
const btnNovo = document.getElementById('btn-novo-filme');
const btnCancelar = document.getElementById('btn-cancelar');
const btnSalvar = document.getElementById('btn-salvar');
const btnLimparFavoritos = document.getElementById('btn-limpar-favoritos');
const btnLogout = document.getElementById('btn-logout');
const btnDark = document.getElementById('btn-dark');

let filmes = [];
let resultadosBusca = [];
const LIMITE_RESULTADOS_TMDB = 12;

const generosTmdb = {
  12: 'Aventura',
  14: 'Fantasia',
  16: 'Animacao',
  18: 'Drama',
  27: 'Terror',
  28: 'Acao',
  35: 'Comedia',
  36: 'Historia',
  37: 'Faroeste',
  53: 'Suspense',
  80: 'Crime',
  99: 'Documentario',
  878: 'Ficcao cientifica',
  9648: 'Misterio',
  10402: 'Musica',
  10749: 'Romance',
  10751: 'Familia',
  10752: 'Guerra',
  10759: 'Acao e aventura',
  10762: 'Infantil',
  10763: 'Noticias',
  10764: 'Reality',
  10765: 'Ficcao cientifica e fantasia',
  10766: 'Novela',
  10767: 'Talk show',
  10768: 'Guerra e politica',
};

const filtrosGeneroTmdb = {
  acao: { movie: 28, tv: 10759, label: 'Acao' },
  aventura: { movie: 12, tv: 10759, label: 'Aventura' },
  animacao: { movie: 16, tv: 16, label: 'Animacao' },
  comedia: { movie: 35, tv: 35, label: 'Comedia' },
  crime: { movie: 80, tv: 80, label: 'Crime' },
  documentario: { movie: 99, tv: 99, label: 'Documentario' },
  drama: { movie: 18, tv: 18, label: 'Drama' },
  familia: { movie: 10751, tv: 10751, label: 'Familia' },
  fantasia: { movie: 14, tv: 10765, label: 'Fantasia' },
  ficcao: { movie: 878, tv: 10765, label: 'Ficcao cientifica' },
  'ciencia ficcao': { movie: 878, tv: 10765, label: 'Ficcao cientifica' },
  'ficcao cientifica': { movie: 878, tv: 10765, label: 'Ficcao cientifica' },
  'sci fi': { movie: 878, tv: 10765, label: 'Ficcao cientifica' },
  scifi: { movie: 878, tv: 10765, label: 'Ficcao cientifica' },
  guerra: { movie: 10752, tv: 10768, label: 'Guerra' },
  historia: { movie: 36, tv: 36, label: 'Historia' },
  misterio: { movie: 9648, tv: 9648, label: 'Misterio' },
  musica: { movie: 10402, tv: 10764, label: 'Musica' },
  romance: { movie: 10749, tv: 18, label: 'Romance' },
  suspense: { movie: 53, tv: 9648, label: 'Suspense' },
  terror: { movie: 27, tv: 9648, label: 'Terror' },
};

const categoriasPadrao = [
  'Acao',
  'Animacao',
  'Aventura',
  'Comedia',
  'Drama',
  'Fantasia',
  'Ficcao cientifica',
  'Romance',
  'Suspense',
  'Terror',
];

const plataformasPadrao = [
  'Apple TV/iTunes',
  'Disney+',
  'Globoplay',
  'Max',
  'Netflix',
  'Prime Video',
  'Telecine',
  'YouTube',
];

const destaquesIniciais = [
  {
    nome: 'Projeto Hail Mary',
    tipo: 'Filme',
    categoria: 'Ficcao cientifica',
    plataforma: 'Claro tv+',
    avaliacao: null,
    imagem: 'https://images.justwatch.com/backdrop/332529663/s640/projeto-hail-mary.jpg',
    url: 'https://www.justwatch.com/br/filme/projeto-hail-mary',
  },
  {
    nome: 'The Boys',
    tipo: 'Serie',
    categoria: 'Acao',
    plataforma: 'Prime Video',
    avaliacao: 8.7,
    imagem: 'https://images.justwatch.com/backdrop/109745293/s640/the-boys.jpg',
    url: 'https://www.justwatch.com/br/serie/the-boys',
  },
  {
    nome: 'O Diabo Veste Prada',
    tipo: 'Filme',
    categoria: 'Comedia',
    plataforma: 'Disney+',
    avaliacao: 6.9,
    imagem: 'https://images.justwatch.com/backdrop/322060919/s640/o-diabo-veste-prada.jpg',
    url: 'https://www.justwatch.com/br/filme/o-diabo-veste-prada',
  },
  {
    nome: 'Origem',
    tipo: 'Serie',
    categoria: 'Suspense',
    plataforma: 'Globoplay',
    avaliacao: 8.2,
    imagem: 'https://images.justwatch.com/backdrop/344518670/s640/from.jpg',
    url: 'https://www.justwatch.com/br/serie/from',
  },
  {
    nome: 'Socorro!',
    tipo: 'Filme',
    categoria: 'Suspense',
    plataforma: 'Disney+',
    avaliacao: null,
    imagem: 'https://images.justwatch.com/poster/343698920/s592/pedido-de-socorro.jpg',
    url: 'https://www.justwatch.com/br/filme/pedido-de-socorro',
  },
  {
    nome: "O Segredo de Widow's Bay",
    tipo: 'Serie',
    categoria: 'Terror',
    plataforma: 'Apple TV',
    avaliacao: null,
    imagem: 'https://images.justwatch.com/backdrop/340329342/s640/widows-bay.jpg',
    url: 'https://www.justwatch.com/br/serie/widows-bay',
  },
];

if (!usuario) {
  window.location.assign('./login.html');
  throw new Error('Usuario nao autenticado');
}

usuarioLogado.textContent = `Bem-vinda de volta, ${formatarNomeUsuario(usuario.nome)}`;
document.documentElement.classList.toggle('dark', localStorage.getItem('cinevault_dark') === 'true');

btnNovo.addEventListener('click', abrirModalNovo);
btnCancelar.addEventListener('click', abrirModalNovo);
form.addEventListener('submit', salvarFilme);
formBuscaWeb.addEventListener('submit', pesquisarFilmesWeb);
busca.addEventListener('input', renderizarTabela);
filtroTipo.addEventListener('change', renderizarTabela);
btnLogout.addEventListener('click', sair);
btnDark.addEventListener('click', alternarDark);
btnLimparFavoritos.addEventListener('click', limparTodosFavoritos);

listaFilmes.addEventListener('click', (event) => {
  const botao = event.target.closest('button[data-acao]');
  if (!botao) return;

  const filme = filmes.find((item) => item.id === botao.dataset.id);
  if (!filme) return;

  if (botao.dataset.acao === 'editar') {
    abrirModalEdicao(filme);
  }

  if (botao.dataset.acao === 'excluir') {
    removerFilme(filme);
  }
});

listaFilmes.addEventListener('click', (event) => {
  const botao = event.target.closest('button[data-empty-action]');
  if (botao) {
    abrirModalNovo();
  }
});

resultadosWeb.addEventListener('click', (event) => {
  const botaoAdicionar = event.target.closest('button[data-adicionar-web]');
  if (botaoAdicionar) {
    const filme = resultadosBusca[Number(botaoAdicionar.dataset.adicionarWeb)];
    if (filme) {
      abrirModalComSugestao(filme);
    }
  }
});

renderizarResultadosWeb(destaquesIniciais);
await carregarFilmes();

async function carregarFilmes() {
  listaFilmes.innerHTML = linhaMensagem('Carregando titulos...');

  try {
    filmes = await listarFilmes(usuario.id);
    renderizarTabela();
    atualizarEstatisticas();
    atualizarSugestoesFormulario();
  } catch (error) {
    listaFilmes.innerHTML = linhaMensagem('Nao foi possivel carregar os titulos.', true);
    totalFilmes.textContent = 'Falha ao carregar registros';
  }
}

function renderizarTabela() {
  const termo = busca.value.trim().toLowerCase();
  const tipoSelecionado = filtroTipo.value;
  const filtrados = filmes.filter((filme) => {
    const correspondeAoTipo = !tipoSelecionado || (filme.tipo || 'Filme') === tipoSelecionado;
    const correspondeAoTermo = [
      filme.nome,
      filme.tipo,
      filme.categoria,
      filme.plataforma,
      filme.avaliacao,
      filme.url,
    ].join(' ').toLowerCase().includes(termo);

    return correspondeAoTipo && correspondeAoTermo;
  });

  totalFilmes.textContent = criarResumoTabela(filtrados.length);
  btnLimparFavoritos.disabled = filmes.length === 0;

  if (filtrados.length === 0) {
    listaFilmes.innerHTML = filmes.length === 0
      ? linhaVazia()
      : linhaMensagem('Nenhum titulo encontrado para estes filtros.');
    return;
  }

  listaFilmes.innerHTML = filtrados.map((filme) => {
    const urlAssistir = normalizarUrlExterna(obterUrlAssistir(filme), criarUrlJustWatch(filme.nome));

    return `
    <tr class="bg-white transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-950">
      <td class="px-4 py-3">
        <img src="${escaparAtributo(filme.imagem || criarPlaceholderPoster(filme.nome))}" alt="Poster de ${escaparAtributo(filme.nome)}" class="h-20 w-14 rounded-md bg-slate-200 object-cover dark:bg-slate-800" loading="lazy" onerror="this.onerror=null;this.src='${escaparAtributo(criarPlaceholderPoster(filme.nome))}'" />
      </td>
      <td class="px-4 py-3">
        <p class="font-bold text-slate-950 dark:text-white">${escaparHtml(filme.nome)}</p>
        <p class="mt-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">${escaparHtml(filme.categoria || 'Sem categoria')}</p>
      </td>
      <td class="px-4 py-3 text-slate-600 dark:text-slate-300">${escaparHtml(filme.tipo || 'Filme')}</td>
      <td class="px-4 py-3 text-slate-600 dark:text-slate-300">${escaparHtml(filme.categoria || 'Sem categoria')}</td>
      <td class="px-4 py-3">
        <p class="font-semibold text-teal-700 dark:text-teal-300">${escaparHtml(filme.plataforma)}</p>
        <a href="${escaparAtributo(urlAssistir)}" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800" title="Abrir link para assistir ${escaparAtributo(filme.nome)}">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
          Assistir
        </a>
      </td>
      <td class="px-4 py-3 text-slate-600 dark:text-slate-300">${formatarAvaliacao(filme.avaliacao)}</td>
      <td class="px-4 py-3">
        <div class="flex justify-end gap-2">
          <button type="button" data-acao="editar" data-id="${filme.id}" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-teal-200 bg-teal-50 text-teal-700 transition hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-400/10 dark:text-teal-300" title="Editar titulo" aria-label="Editar ${escaparAtributo(filme.nome)}">
            <svg class="pointer-events-none h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
          </button>
          <button type="button" data-acao="excluir" data-id="${filme.id}" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-400/10 dark:text-red-300" title="Excluir titulo" aria-label="Excluir ${escaparAtributo(filme.nome)}">
            <svg class="pointer-events-none h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
          </button>
        </div>
      </td>
    </tr>
  `;
  }).join('');
}

function criarResumoTabela(totalFiltrado) {
  const total = filmes.length;
  const pluralTotal = total === 1 ? '' : 's';
  const tipoSelecionado = filtroTipo.value;

  if (!busca.value.trim() && !tipoSelecionado) {
    return `${total} titulo${pluralTotal} salvo${pluralTotal} em Favoritos`;
  }

  const pluralFiltrado = totalFiltrado === 1 ? '' : 's';
  return `${totalFiltrado} de ${total} titulo${pluralFiltrado} encontrado${pluralFiltrado}`;
}

async function salvarFilme(event) {
  event.preventDefault();
  const id = document.getElementById('filme-id').value;
  const nome = document.getElementById('nome').value.trim();
  const tipo = document.getElementById('tipo').value;
  const categoria = document.getElementById('categoria').value.trim();
  const plataforma = document.getElementById('plataforma').value.trim();
  const avaliacao = normalizarAvaliacao(document.getElementById('avaliacao').value);
  const imagem = document.getElementById('imagem').value.trim();
  const url = document.getElementById('url').value.trim();

  const erroValidacao = validarFilme({ nome, tipo, categoria, plataforma });
  if (erroValidacao) {
    mostrarMensagem(erroValidacao, 'erro');
    return;
  }

  if (tituloJaCadastrado(nome, id)) {
    mostrarMensagem('Este titulo ja foi adicionado.', 'erro');
    return;
  }

  const filme = {
    nome,
    tipo,
    categoria,
    plataforma,
    avaliacao,
    imagem: imagem || null,
    url: url || null,
    usuario_id: usuario.id,
  };

  setLoading(true);

  try {
    if (id) {
      await atualizarFilme(id, filme);
      mostrarMensagem('Titulo atualizado com sucesso.', 'sucesso');
    } else {
      await criarFilme(filme);
      mostrarMensagem('Titulo cadastrado com sucesso.', 'sucesso');
    }

    await carregarFilmes();
    mostrarMensagemDashboard(id ? 'Titulo atualizado com sucesso.' : 'Titulo cadastrado com sucesso.', 'sucesso');
    if (!id) {
      abrirModalNovo();
    }
  } catch (error) {
    const mensagem = ehErroTituloDuplicado(error.message)
      ? 'Este titulo ja foi adicionado.'
      : `Erro ao salvar: ${limparErro(error.message)}`;
    mostrarMensagem(mensagem, 'erro');
  } finally {
    setLoading(false);
  }
}

async function removerFilme(filme) {
  const confirmado = confirm(`Deseja excluir "${filme.nome}"?`);
  if (!confirmado) return;

  try {
    await excluirFilme(filme.id);
    await carregarFilmes();
    mostrarMensagemDashboard('Titulo excluido com sucesso.', 'sucesso');
  } catch (error) {
    mostrarMensagemDashboard(`Erro ao excluir: ${limparErro(error.message)}`, 'erro');
  }
}

async function limparTodosFavoritos() {
  if (filmes.length === 0) {
    mostrarMensagemDashboard('Nao ha favoritos para excluir.', 'erro');
    return;
  }

  const total = filmes.length;
  const plural = total === 1 ? '' : 's';
  const mensagemSucesso = total === 1
    ? 'O favorito foi excluido com sucesso.'
    : 'Todos os favoritos foram excluidos com sucesso.';
  const confirmado = confirm(`Deseja excluir todos os ${total} favorito${plural}? Esta acao nao pode ser desfeita.`);
  if (!confirmado) return;

  btnLimparFavoritos.disabled = true;

  try {
    await excluirTodosFilmes(usuario.id);
    busca.value = '';
    filtroTipo.value = '';
    await carregarFilmes();
    mostrarMensagemDashboard(mensagemSucesso, 'sucesso');
  } catch (error) {
    mostrarMensagemDashboard(`Erro ao excluir favoritos: ${limparErro(error.message)}`, 'erro');
  } finally {
    btnLimparFavoritos.disabled = filmes.length === 0;
  }
}

function abrirModalNovo() {
  form.reset();
  document.getElementById('filme-id').value = '';
  document.getElementById('imagem').value = '';
  document.getElementById('url').value = '';
  document.getElementById('tipo').value = 'Filme';
  document.getElementById('avaliacao').value = '';
  tituloFormulario.textContent = 'Novo favorito';
  btnSalvar.textContent = 'Salvar favorito';
  btnCancelar.classList.add('hidden');
  limparMensagem();
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('nome').focus();
}

function abrirModalComSugestao(filme) {
  abrirModalNovo();
  document.getElementById('nome').value = filme.nome || '';
  document.getElementById('tipo').value = filme.tipo || 'Filme';
  document.getElementById('categoria').value = filme.categoria || '';
  document.getElementById('plataforma').value = filme.plataforma || '';
  document.getElementById('avaliacao').value = filme.avaliacao ?? '';
  document.getElementById('imagem').value = filme.imagem || '';
  document.getElementById('url').value = filme.url || '';
  document.getElementById('nome').focus();
}

function abrirModalEdicao(filme) {
  document.getElementById('filme-id').value = filme.id;
  document.getElementById('nome').value = filme.nome || '';
  document.getElementById('tipo').value = filme.tipo || 'Filme';
  document.getElementById('categoria').value = filme.categoria || '';
  document.getElementById('plataforma').value = filme.plataforma || '';
  document.getElementById('avaliacao').value = filme.avaliacao ?? '';
  document.getElementById('imagem').value = filme.imagem || '';
  document.getElementById('url').value = filme.url || '';
  tituloFormulario.textContent = 'Editar favorito';
  btnSalvar.textContent = 'Atualizar favorito';
  btnCancelar.classList.remove('hidden');
  limparMensagem();
  document.getElementById('nome').focus();
}

async function pesquisarFilmesWeb(event) {
  event.preventDefault();
  const termo = buscaWeb.value.trim();

  if (!termo) {
    resultadosBusca = destaquesIniciais;
    renderizarResultadosWeb(resultadosBusca);
    statusBuscaWeb.textContent = 'Digite um nome, genero ou categoria para pesquisar online.';
    return;
  }

  setLoadingBuscaWeb(true);
  statusBuscaWeb.textContent = 'Pesquisando filmes e series online...';

  try {
    resultadosBusca = await buscarTitulosTmdb(termo);
    renderizarResultadosWeb(resultadosBusca);
    statusBuscaWeb.textContent = resultadosBusca.length
      ? `${resultadosBusca.length} resultado${resultadosBusca.length === 1 ? '' : 's'} encontrado${resultadosBusca.length === 1 ? '' : 's'}.`
      : 'Nenhum resultado encontrado. Tente outro nome ou categoria.';
  } catch (error) {
    statusBuscaWeb.textContent = limparErro(error.message) || 'Nao foi possivel pesquisar online agora. Confira a conexao e tente novamente.';
  } finally {
    setLoadingBuscaWeb(false);
  }
}

async function buscarTitulosTmdb(termo) {
  if (!TMDB_API_KEY) {
    throw new Error('Configure a TMDB_API_KEY em js/supabase.js para pesquisar no catalogo TMDb.');
  }

  if (!/^[a-f0-9]{32}$/i.test(TMDB_API_KEY)) {
    throw new Error('A TMDB_API_KEY parece invalida. Use a API Key v3 do TMDb, com 32 caracteres.');
  }

  const generoId = filtrosGeneroTmdb[normalizarChave(termo)];
  if (generoId) {
    const [filmesGenero, seriesGenero] = await Promise.all([
      buscarDescobertaTmdb('movie', generoId.movie),
      buscarDescobertaTmdb('tv', generoId.tv),
    ]);

    return [...filmesGenero, ...seriesGenero]
      .sort((a, b) => (b.popularidade || 0) - (a.popularidade || 0))
      .slice(0, LIMITE_RESULTADOS_TMDB);
  }

  const url = new URL('https://api.themoviedb.org/3/search/multi');
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('language', 'pt-BR');
  url.searchParams.set('region', 'BR');
  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('page', '1');
  url.searchParams.set('query', termo);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(criarMensagemErroTmdb(response.status));
  }

  const data = await response.json();
  const titulos = (data.results || [])
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .slice(0, LIMITE_RESULTADOS_TMDB);

  return Promise.all(titulos.map((item) => converterTituloTmdb(item, termo)));
}

async function buscarDescobertaTmdb(tipoTmdb, generoId) {
  const url = new URL(`https://api.themoviedb.org/3/discover/${tipoTmdb}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('language', 'pt-BR');
  url.searchParams.set('watch_region', 'BR');
  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('page', '1');
  url.searchParams.set('with_genres', String(generoId));
  url.searchParams.set('sort_by', 'popularity.desc');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(criarMensagemErroTmdb(response.status));
  }

  const data = await response.json();
  const titulos = (data.results || [])
    .slice(0, LIMITE_RESULTADOS_TMDB);

  return Promise.all(titulos.map((item) => converterTituloTmdb({ ...item, media_type: tipoTmdb }, '')));
}

async function converterTituloTmdb(item, termoOriginal) {
  const categoria = generosTmdb[item.genre_ids?.[0]] || inferirCategoria(termoOriginal);
  const tipo = item.media_type === 'tv' ? 'Serie' : 'Filme';
  const nome = item.title || item.name || item.original_title || item.original_name || 'Titulo sem nome';
  const caminho = item.media_type === 'tv' ? 'tv' : 'movie';
  const provedores = await buscarProvedoresTmdb(caminho, item.id);

  return {
    nome,
    tipo,
    categoria,
    plataforma: provedores.plataforma,
    imagem: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
    url: provedores.url || (item.id ? `https://www.themoviedb.org/${caminho}/${item.id}` : criarUrlJustWatch(nome || termoOriginal)),
    avaliacao: normalizarAvaliacao(item.vote_average),
    descricao: item.overview || '',
    popularidade: item.popularity || 0,
  };
}

async function buscarProvedoresTmdb(caminho, id) {
  if (!id) {
    return { plataforma: 'Streaming nao informado', url: '' };
  }

  const url = new URL(`https://api.themoviedb.org/3/${caminho}/${id}/watch/providers`);
  url.searchParams.set('api_key', TMDB_API_KEY);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { plataforma: 'Streaming nao informado', url: '' };
    }

    const data = await response.json();
    const brasil = data.results?.BR;
    if (!brasil) {
      return { plataforma: 'Streaming nao disponivel no Brasil', url: '' };
    }

    const provedoresStreaming = obterNomesProvedores(brasil.flatrate);
    if (provedoresStreaming.length > 0) {
      return { plataforma: provedoresStreaming.join(', '), url: brasil.link || '' };
    }

    const provedoresGratis = obterNomesProvedores([...(brasil.free || []), ...(brasil.ads || [])]);
    if (provedoresGratis.length > 0) {
      return { plataforma: `Gratis: ${provedoresGratis.join(', ')}`, url: brasil.link || '' };
    }

    const provedoresAluguelCompra = obterNomesProvedores([...(brasil.rent || []), ...(brasil.buy || [])]);
    if (provedoresAluguelCompra.length > 0) {
      return { plataforma: `Aluguel/compra: ${provedoresAluguelCompra.join(', ')}`, url: brasil.link || '' };
    }

    return { plataforma: 'Streaming nao disponivel no Brasil', url: brasil.link || '' };
  } catch {
    return { plataforma: 'Streaming nao informado', url: '' };
  }
}

function obterNomesProvedores(provedores = []) {
  return [...new Set(provedores
    .map((provedor) => provedor.provider_name)
    .filter(Boolean))]
    .slice(0, 3);
}

function inferirCategoria(termo) {
  const generoId = filtrosGeneroTmdb[normalizarChave(termo)];
  return generoId?.label || 'Titulo';
}

function criarMensagemErroTmdb(status) {
  if (status === 401) {
    return 'Chave TMDb invalida ou nao autorizada. Confira a API Key v3 em js/supabase.js.';
  }

  return `Erro na busca TMDb: HTTP ${status}`;
}

function normalizarChave(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function renderizarResultadosWeb(resultados) {
  resultadosBusca = resultados;
  atualizarSugestoesFormulario();

  if (resultados.length === 0) {
    resultadosWeb.innerHTML = `
      <div class="rounded-md border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:col-span-2 xl:col-span-3">
        Nenhum titulo para mostrar.
      </div>
    `;
    return;
  }

  resultadosWeb.innerHTML = resultados.map((filme, index) => `
    <article class="flex min-h-40 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <img src="${escaparAtributo(filme.imagem || criarPlaceholderPoster(filme.nome))}" alt="Poster de ${escaparAtributo(filme.nome)}" class="h-32 w-24 shrink-0 rounded-md bg-slate-200 object-cover dark:bg-slate-800" loading="lazy" onerror="this.onerror=null;this.src='${escaparAtributo(criarPlaceholderPoster(filme.nome))}'" />
      <div class="min-w-0">
        <h3 class="font-black leading-snug text-slate-950 dark:text-white">${escaparHtml(filme.nome)}</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${escaparHtml(filme.tipo || 'Filme')} - ${escaparHtml(filme.categoria)}</p>
        <p class="mt-2 text-sm font-semibold text-teal-700 dark:text-teal-300">${escaparHtml(filme.plataforma)}</p>
        <p class="mt-1 text-sm font-semibold text-amber-600 dark:text-amber-300">${formatarAvaliacao(filme.avaliacao)}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <button type="button" data-adicionar-web="${index}" class="inline-flex items-center gap-2 rounded-md bg-teal-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-teal-700">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            Adicionar
          </button>
          <a href="${escaparAtributo(normalizarUrlExterna(filme.url, criarUrlJustWatch(filme.nome)))}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
            Ver detalhes
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

function setLoadingBuscaWeb(loading) {
  btnBuscaWeb.disabled = loading;
  btnBuscaWeb.classList.toggle('loading', loading);
}

function criarUrlJustWatch(nome) {
  return `https://www.justwatch.com/br/busca?q=${encodeURIComponent(nome || '')}`;
}

function obterUrlAssistir(filme) {
  return filme.url || criarUrlJustWatch(filme.nome);
}

function normalizarUrlExterna(url, fallback) {
  try {
    const endereco = new URL(url || fallback);
    return ['http:', 'https:'].includes(endereco.protocol) ? endereco.href : fallback;
  } catch {
    return fallback;
  }
}

function obterUsuarioSessao() {
  try {
    return JSON.parse(localStorage.getItem('cinevault_usuario') || 'null');
  } catch {
    localStorage.removeItem('cinevault_usuario');
    return null;
  }
}

function formatarNomeUsuario(nome) {
  return (nome || 'visitante')
    .trim()
    .split(/\s+/)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase())
    .join(' ');
}

function sair() {
  localStorage.removeItem('cinevault_usuario');
  window.location.assign('./login.html');
}

function alternarDark() {
  const ativo = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', ativo);
  localStorage.setItem('cinevault_dark', String(ativo));
}

function atualizarEstatisticas() {
  const total = filmes.length;
  const categorias = new Set(filmes.map((filme) => filme.categoria).filter(Boolean));
  const plataformas = new Set(filmes.map((filme) => filme.plataforma).filter(Boolean));

  statTotal.textContent = total;
  statCategorias.textContent = categorias.size;
  statPlataformas.textContent = plataformas.size;
}

function atualizarSugestoesFormulario() {
  const categorias = [
    ...categoriasPadrao,
    ...Object.values(generosTmdb),
    ...filmes.map((filme) => filme.categoria),
    ...resultadosBusca.map((filme) => filme.categoria),
  ];
  const plataformas = [
    ...plataformasPadrao,
    ...filmes.map((filme) => filme.plataforma),
    ...resultadosBusca.map((filme) => filme.plataforma),
  ];

  preencherDatalist(listaCategorias, categorias);
  preencherDatalist(listaPlataformas, plataformas);
}

function preencherDatalist(elemento, valores) {
  const unicos = [...new Set(valores.filter(Boolean).map((valor) => valor.trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));

  elemento.innerHTML = unicos.map((valor) => `<option value="${escaparAtributo(valor)}"></option>`).join('');
}

function validarFilme(filme) {
  if (!filme.nome || !filme.tipo || !filme.categoria || !filme.plataforma) {
    return 'Preencha nome do titulo, tipo, categoria e plataforma.';
  }

  return '';
}

function tituloJaCadastrado(nome, idAtual = '') {
  const nomeNormalizado = normalizarTextoComparacao(nome);

  return filmes.some((filme) => (
    filme.id !== idAtual
    && normalizarTextoComparacao(filme.nome) === nomeNormalizado
  ));
}

function normalizarTextoComparacao(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function linhaMensagem(texto, erro = false) {
  const classe = erro ? 'text-red-600 dark:text-red-300' : 'text-slate-500 dark:text-slate-400';
  return `
    <tr>
      <td colspan="7" class="px-4 py-10 text-center text-sm ${classe}">
        ${escaparHtml(texto)}
      </td>
    </tr>
  `;
}

function linhaVazia() {
  return `
    <tr>
      <td colspan="7" class="px-4 py-12 text-center">
      <div class="mx-auto max-w-sm text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect width="20" height="12" x="2" y="6" rx="2" /><path d="M7 6v12" /><path d="M17 6v12" /><path d="M2 12h20" /></svg>
        </div>
        <p class="mt-4 font-bold text-slate-950 dark:text-white">Sua watchlist esta vazia</p>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Salve filmes e series para encontrar depois sem perder tempo.</p>
        <button type="button" data-empty-action="novo" class="mt-4 rounded-md bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700">Adicionar favorito</button>
      </div>
      </td>
    </tr>
  `;
}

function setLoading(loading) {
  btnSalvar.disabled = loading;
  btnSalvar.textContent = loading ? 'Salvando...' : (document.getElementById('filme-id').value ? 'Atualizar favorito' : 'Salvar favorito');
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
  mensagemFormulario.className = 'hidden rounded-md px-3 py-2 text-sm';
  mensagemFormulario.textContent = '';
}

function criarPlaceholderPoster(nome) {
  const texto = encodeURIComponent(nome || 'AcervoFlix');
  return `https://placehold.co/600x900/0f172a/f8fafc?text=${texto}`;
}

function normalizarAvaliacao(valor) {
  if (valor === null || valor === undefined || String(valor).trim() === '') {
    return null;
  }

  const numero = Number(String(valor).replace(',', '.'));
  if (!Number.isFinite(numero)) {
    return null;
  }

  return Math.round(numero * 10) / 10;
}

function formatarAvaliacao(valor) {
  const numero = normalizarAvaliacao(valor);
  if (numero === null) {
    return 'Sem avaliacao';
  }

  return `${numero.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}/10`;
}

function escaparHtml(valor) {
  const div = document.createElement('div');
  div.textContent = valor ?? '';
  return div.innerHTML;
}

function escaparAtributo(valor) {
  return escaparHtml(valor).replace(/"/g, '&quot;');
}

function limparErro(texto) {
  return texto.replace(/[{}"]/g, '').slice(0, 180);
}

function ehErroTituloDuplicado(texto) {
  return texto.includes('filmes_titulo_unico_por_usuario')
    || texto.includes('duplicate key value')
    || texto.includes('violates unique constraint');
}
