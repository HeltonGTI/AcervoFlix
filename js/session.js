const USUARIO_KEY = 'cinevault_usuario';
const ULTIMA_ATIVIDADE_KEY = 'cinevault_ultima_atividade';
const LIMITE_INATIVIDADE_MS = 15 * 60 * 1000;

export function obterUsuarioSessao() {
  try {
    const usuario = JSON.parse(localStorage.getItem(USUARIO_KEY) || 'null');

    if (!usuario) {
      limparSessao();
      return null;
    }

    if (sessaoExpirada()) {
      limparSessao();
      return null;
    }

    return usuario;
  } catch {
    limparSessao();
    return null;
  }
}

export function salvarSessao(usuario) {
  localStorage.setItem(USUARIO_KEY, JSON.stringify({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  }));
  registrarAtividade();
}

export function limparSessao() {
  localStorage.removeItem(USUARIO_KEY);
  localStorage.removeItem(ULTIMA_ATIVIDADE_KEY);
}

export function registrarAtividade() {
  if (localStorage.getItem(USUARIO_KEY)) {
    localStorage.setItem(ULTIMA_ATIVIDADE_KEY, String(Date.now()));
  }
}

export function iniciarTemporizadorInatividade(aoExpirar) {
  let timerId;

  const renovar = () => {
    registrarAtividade();
    reiniciarTimer();
  };

  const verificar = () => {
    if (sessaoExpirada()) {
      limparSessao();
      aoExpirar();
      return;
    }

    reiniciarTimer();
  };

  const reiniciarTimer = () => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(verificar, LIMITE_INATIVIDADE_MS);
  };

  ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'].forEach((evento) => {
    window.addEventListener(evento, renovar, { passive: true });
  });

  document.addEventListener('visibilitychange', verificar);
  reiniciarTimer();
}

function sessaoExpirada() {
  const ultimaAtividade = Number(localStorage.getItem(ULTIMA_ATIVIDADE_KEY) || '0');

  if (!Number.isFinite(ultimaAtividade) || ultimaAtividade <= 0) {
    return true;
  }

  return Date.now() - ultimaAtividade >= LIMITE_INATIVIDADE_MS;
}
