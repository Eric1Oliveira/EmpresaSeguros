/* ================================================================
   TRINITTYCOR CRM — Main Application Script
   Features: Navigation, CRUD (Clientes, Apólices, Sinistros,
             Renovações), Modals, Toasts, Search, Filters,
             Client Detail with tabs (Apólices / Timeline / Finance)
   Storage: localStorage (JSON)
   ================================================================ */

'use strict';

/* ── LocalStorage helpers ───────────────────────────────────── */
const DB_KEY = 'trinittycor_v1';

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(DB));
}

/* ── Seed Data ──────────────────────────────────────────────── */
function buildSeed() {
  return {
    clientes: [
      { id:'c1', tipo:'PF', nome:'Carlos Eduardo Silva',     doc:'123.456.789-00', email:'carlos@email.com',    tel:'(11) 99999-1234', end:'Rua das Flores, 123, São Paulo/SP', nasc:'14/03/1985' },
      { id:'c2', tipo:'PF', nome:'Maria Fernanda Oliveira',  doc:'987.654.321-00', email:'maria@email.com',     tel:'(11) 98888-5678', end:'Rua Augusta, 450, São Paulo/SP',    nasc:'22/09/1989' },
      { id:'c3', tipo:'PJ', nome:'Tech Solutions LTDA',      doc:'12.345.678/0001-90', email:'contato@techsolutions.com.br', tel:'(11) 3333-4444', end:'Av. Paulista, 2100, São Paulo/SP', nasc:'' },
      { id:'c4', tipo:'PF', nome:'João Pedro Santos',         doc:'456.789.123-00', email:'joao@email.com',     tel:'(21) 97777-8888', end:'Rua do Catete, 99, Rio de Janeiro/RJ', nasc:'05/12/1991' },
      { id:'c5', tipo:'PF', nome:'Ana Beatriz Costa',         doc:'321.654.987-00', email:'ana@email.com',      tel:'(31) 96666-1111', end:'Rua da Bahia, 330, Belo Horizonte/MG', nasc:'27/07/1993' },
    ],
    apolices: [
      { id:'a1', num:'AUTO-2024-001', clienteId:'c1', ramo:'auto',   seguradora:'Porto Seguro',    ini:'31/05/2024', fim:'31/05/2025', premio:3200, status:'ativa',      extra:{ veiculo:'Toyota Corolla XEi · ABC-1D23', comissao:480 } },
      { id:'a2', num:'VIDA-2024-001', clienteId:'c1', ramo:'vida',   seguradora:'SulAmérica',      ini:'29/02/2024', fim:'28/02/2025', premio:1800, status:'ativa',      extra:{ capital:'R$ 500.000', comissao:360 } },
      { id:'a3', num:'AUTO-2024-002', clienteId:'c2', ramo:'auto',   seguradora:'Tokio Marine',    ini:'14/04/2024', fim:'14/04/2025', premio:2800, status:'ativa',      extra:{ veiculo:'Honda Civic EX · DEF-2E34', comissao:420 } },
      { id:'a4', num:'RE-2024-001',   clienteId:'c2', ramo:'re',     seguradora:'Bradesco Seguros',ini:'31/12/2023', fim:'30/04/2026', premio:950,  status:'ativa',      extra:{ imovel:'Apto 45m² - Pinheiros', comissao:142 } },
      { id:'a5', num:'EMP-2024-001',  clienteId:'c3', ramo:'emp',    seguradora:'Allianz',         ini:'31/01/2024', fim:'31/01/2025', premio:8500, status:'renovacao',  extra:{ objeto:'Responsabilidade Civil', comissao:1275 } },
      { id:'a6', num:'AUTO-2024-003', clienteId:'c4', ramo:'auto',   seguradora:'HDI Seguros',     ini:'30/04/2024', fim:'30/04/2026', premio:4100, status:'ativa',      extra:{ veiculo:'Jeep Renegade · GHI-3F45', comissao:615 } },
      { id:'a7', num:'SAUDE-2024-001',clienteId:'c5', ramo:'saude',  seguradora:'Unimed',          ini:'31/05/2024', fim:'31/05/2025', premio:650,  status:'ativa',      extra:{ plano:'PME Enfermaria', comissao:97 } },
      { id:'a8', num:'VIDA-2024-002', clienteId:'c4', ramo:'vida',   seguradora:'MetLife',         ini:'14/01/2024', fim:'14/04/2026', premio:2200, status:'ativa',      extra:{ capital:'R$ 750.000', comissao:330 } },
    ],
    sinistros: [
      { id:'s1', num:'SIN-2024-001', apoliceId:'a1', clienteId:'c1', status:'analise',  data:'04/10/2024', desc:'Colisão traseira no estacionamento', oficina:'Auto Center Premium', previsao:'31/10/2024', franquia:2500, franquiaPaga:true  },
      { id:'s2', num:'SIN-2024-002', apoliceId:'a3', clienteId:'c2', status:'aprovado', data:'11/11/2024', desc:'Furto de roda e pneu',               oficina:'Oficina Confiança',    previsao:'04/12/2024', franquia:1800, franquiaPaga:false },
    ],
    renovacoes: [
      { id:'r1', apoliceId:'a5', clienteId:'c3', status:'cotacao',  obs:'' },
      { id:'r2', apoliceId:'a2', clienteId:'c1', status:'enviado',  obs:'Aguardando assinatura do cliente' },
      { id:'r3', apoliceId:'a8', clienteId:'c4', status:'cotacao',  obs:'' },
    ],
    parcelas: [
      { id:'p1', apoliceId:'a1', parcela:'1ª', venc:'14/06/2024', valor:320, status:'pago' },
      { id:'p2', apoliceId:'a1', parcela:'2ª', venc:'14/07/2024', valor:320, status:'pago' },
      { id:'p3', apoliceId:'a1', parcela:'3ª', venc:'14/08/2024', valor:320, status:'pago' },
      { id:'p4', apoliceId:'a1', parcela:'4ª', venc:'14/09/2024', valor:320, status:'pago' },
      { id:'p5', apoliceId:'a1', parcela:'5ª', venc:'14/10/2024', valor:320, status:'atrasado' },
      { id:'p6', apoliceId:'a1', parcela:'6ª', venc:'14/11/2024', valor:320, status:'atrasado' },
    ],
    timeline: [
      { id:'t1', clienteId:'c1', data:'20 de setembro de 2024 às 09:15', titulo:'Endereço atualizado', de:'Rua Velha, 50', para:'Rua das Flores, 123' },
      { id:'t2', clienteId:'c1', data:'15 de agosto de 2024 às 14:30',  titulo:'Veículo alterado',     de:'VW Gol 2020',   para:'Toyota Corolla XEi 2023' },
      { id:'t3', clienteId:'c1', data:'01 de junho de 2024 às 10:00',   titulo:'Apólice AUTO-2024-001 criada',  de:'', para:'' },
      { id:'t4', clienteId:'c1', data:'01 de março de 2024 às 08:00',   titulo:'Apólice VIDA-2024-001 criada',  de:'', para:'' },
    ],
    _nextId: 100,
  };
}

let DB = loadDB() || buildSeed();
let _chartRamos = null, _chartStatus = null, _chartEvolucao = null;

/* ── ID generator ───────────────────────────────────────────── */
function nextId(prefix) {
  DB._nextId++;
  saveDB();
  return prefix + DB._nextId;
}

/* ── Toast ──────────────────────────────────────────────────── */
const toastContainer = document.getElementById('toast-container');

function toast(msg, type = 'success') {
  const icons = { success:'fa-circle-check', error:'fa-circle-xmark', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${msg}</span>`;
  toastContainer.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

/* ── Modal engine ───────────────────────────────────────────── */
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  const firstInput = overlay.querySelector('input:not([type=hidden]),select,textarea');
  if (firstInput) setTimeout(() => firstInput.focus(), 150);
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
}

// Close on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeAllModals();
});

/* ── Confirm dialog ─────────────────────────────────────────── */
function confirm(msg, onYes) {
  document.getElementById('confirm-msg').textContent = msg;
  openModal('modal-confirm');
  const btn = document.getElementById('confirm-yes');
  const fresh = btn.cloneNode(true);
  btn.parentNode.replaceChild(fresh, btn);
  fresh.addEventListener('click', () => { closeModal('modal-confirm'); onYes(); });
}

/* ── Navigation ─────────────────────────────────────────────── */
let currentPage = 'dashboard';

function navigateTo(pageId, sub = null) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (!target) return;
  target.classList.add('active');
  currentPage = pageId;

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === pageId ||
      (pageId === 'cliente-detalhe' && n.dataset.page === 'clientes'));
  });

  updateTopbar(pageId, sub);

  if (pageId === 'dashboard')   renderDashboard();
  if (pageId === 'clientes')    renderClientes();
  if (pageId === 'apolices')    renderApolices();
  if (pageId === 'sinistros')   renderSinistros();
  if (pageId === 'renovacoes')  renderRenovacoes();
  if (pageId === 'relatorios')  renderRelatorios();

  // Keep mobile layout stable on section changes.
  syncViewportState();
}

function updateTopbar(pageId, sub) {
  const titles = {
    dashboard:'Dashboard', clientes:'Clientes', 'cliente-detalhe':'Clientes',
    apolices:'Apólices', sinistros:'Sinistros', renovacoes:'Renovações',
    relatorios:'Relatórios & BI', configuracoes:'Configurações',
  };
  const subs = {
    dashboard:'Visão geral da carteira',
    clientes:'Gestão de clientes',
    'cliente-detalhe': sub || 'Detalhe do cliente',
    apolices:'Gestão de apólices',
    sinistros:'Controle de sinistros',
    renovacoes:'Gestão de renovações',
    relatorios:'Indicadores de performance',
    configuracoes:'Preferências do sistema',
  };
  document.getElementById('topbar-title').textContent = titles[pageId] || '';
  document.getElementById('topbar-sub').textContent   = subs[pageId]   || '';
}

/* ── Sidebar & topbar wiring ────────────────────────────────── */
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    navigateTo(btn.dataset.page);
    closeSidebar();
  });
});

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('show');
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebar-overlay')?.classList.toggle('show');
}

function syncViewportState() {
  if (window.innerWidth >= 1024) closeSidebar();
  syncMobileTableLabels();
  requestAnimationFrame(() => {
    if (_chartRamos?.resize) _chartRamos.resize();
    if (_chartStatus?.resize) _chartStatus.resize();
    if (_chartEvolucao?.resize) _chartEvolucao.resize();
  });
}

function syncMobileTableLabels() {
  document.querySelectorAll('table').forEach(table => {
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    if (!headers.length) return;
    table.querySelectorAll('tbody tr').forEach(tr => {
      Array.from(tr.children).forEach((td, i) => {
        if (td && td.tagName === 'TD') td.setAttribute('data-label', headers[i] || 'Campo');
      });
    });
  });
}

document.getElementById('menu-toggle')?.addEventListener('click', toggleSidebar);
document.getElementById('sidebar-close')?.addEventListener('click', closeSidebar);
document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
window.addEventListener('resize', syncViewportState);

/* ── Helpers ─────────────────────────────────────────────────── */
function getCliente(id)  { return DB.clientes.find(c => c.id === id); }
function getApolice(id)  { return DB.apolices.find(a => a.id === id); }

const ramoLabel = { auto:'Automóvel', vida:'Vida', re:'Residencial', saude:'Saúde', emp:'Empresarial' };
const ramoIcon  = { auto:'fa-car-side', vida:'fa-heart', re:'fa-house', saude:'fa-staff-snake', emp:'fa-building' };
const statusLabel = { ativa:'Ativa', renovacao:'Em Renovação', vencida:'Vencida', cancelada:'Cancelada' };
const statusClass = { ativa:'green', renovacao:'blue', vencida:'amber', cancelada:'red' };
const sinStatusLabel = { analise:'Em Análise', aprovado:'Aprovado', encerrado:'Encerrado', negado:'Negado' };
const sinStatusClass = { analise:'blue', aprovado:'green', encerrado:'gray', negado:'red' };
const renStatusLabel = { cotacao:'Ag. Cotação', enviado:'Enviado ao Cliente', fechado:'Fechado', perdido:'Perdido' };

function fmtMoney(v) { return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits:0 }); }

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── DASHBOARD ──────────────────────────────────────────────── */
function renderDashboard() {
  const ativas = DB.apolices.filter(a => a.status === 'ativa');
  const sinAbertos = DB.sinistros.filter(s => s.status === 'analise' || s.status === 'aprovado');
  const premioTotal = DB.apolices.reduce((s,a) => s + Number(a.premio), 0);

  setText('dash-clientes', DB.clientes.length);
  setText('dash-apolices', ativas.length);
  setText('dash-premio',   fmtMoney(premioTotal));
  setText('dash-sinistros', sinAbertos.length);
  setTrend('dash-clientes-trend', `${ativas.length} apólices ativas`, null);
  setTrend('dash-apolices-trend', `${DB.apolices.filter(a=>a.status==='renovacao').length} em renovação`, null);
  setTrend('dash-premio-trend',   `Médio: ${fmtMoney(ativas.length > 0 ? Math.round(premioTotal/ativas.length) : 0)} / apólice`, null);
  setTrend('dash-sinistros-trend', sinAbertos.length === 0 ? '↓ Nenhum aberto' : '↑ Requer atenção', sinAbertos.length === 0 ? true : false);

  // Próximas renovações table
  const tbody = document.getElementById('dash-renovacoes');
  if (!tbody) return;
  const rows = DB.apolices
    .sort((a,b) => a.fim.localeCompare(b.fim))
    .slice(0, 6);
  tbody.innerHTML = rows.map(a => {
    const c = getCliente(a.clienteId);
    return `<tr>
      <td class="td-bold">${escHtml(c?.nome || '-')}</td>
      <td class="td-mono c-blue">${escHtml(a.num)}</td>
      <td>${ramoLabel[a.ramo] || a.ramo}</td>
      <td>${escHtml(a.fim)}</td>
      <td><span class="badge badge--${statusClass[a.status]}">${statusLabel[a.status]}</span></td>
    </tr>`;
  }).join('');
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setTrend(id, text, isUp) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'kpi__trend' + (isUp === true ? ' up' : isUp === false ? ' down' : '');
}

/* ── CLIENTES ───────────────────────────────────────────────── */
let clienteFilter = '';

function renderClientes() {
  const list = document.getElementById('clientes-list');
  if (!list) return;
  const filtered = DB.clientes.filter(c =>
    c.nome.toLowerCase().includes(clienteFilter) ||
    c.doc.includes(clienteFilter)
  );

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-users"></i><p>Nenhum cliente encontrado.</p></div>`;
    return;
  }

  list.innerHTML = filtered.map(c => {
    const apolicesCount = DB.apolices.filter(a => a.clienteId === c.id).length;
    const avatarClass   = c.tipo === 'PJ' ? 'pj' : '';
    const avatarIcon    = c.tipo === 'PJ' ? 'fa-building' : 'fa-user';
    return `<div class="client-item" data-id="${escHtml(c.id)}" tabindex="0" role="button" aria-label="Ver detalhes de ${escHtml(c.nome)}">
      <div class="client-avatar ${avatarClass}"><i class="fa-regular ${avatarIcon}"></i></div>
      <div>
        <div class="client-info__name">${escHtml(c.nome)}</div>
        <div class="client-info__sub">${escHtml(c.doc)} · ${escHtml(c.end.split(',').slice(-1)[0]?.trim() || c.end)}</div>
      </div>
      <div class="client-meta">
        <div class="client-meta__count">${apolicesCount} ${apolicesCount === 1 ? 'apólice' : 'apólices'}</div>
        <div class="client-meta__phone">${escHtml(c.tel)}</div>
        <span class="client-meta__arrow"><i class="fa-solid fa-chevron-right"></i></span>
      </div>
    </div>`;
  }).join('');

  // Click / keyboard
  list.querySelectorAll('.client-item').forEach(el => {
    el.addEventListener('click', () => openClienteDetalhe(el.dataset.id));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openClienteDetalhe(el.dataset.id); });
  });
}

document.getElementById('cliente-search')?.addEventListener('input', function() {
  clienteFilter = this.value.trim().toLowerCase();
  renderClientes();
});

document.getElementById('btn-novo-cliente')?.addEventListener('click', () => {
  clearForm('form-cliente');
  document.getElementById('modal-cliente-title').textContent = 'Novo Cliente';
  document.getElementById('form-cliente-id').value = '';
  openModal('modal-cliente');
});

document.getElementById('form-cliente')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('form-cliente-id').value;
  const data = {
    nome: val('fc-nome'), tipo: val('fc-tipo'), doc: val('fc-doc'),
    email: val('fc-email'), tel: val('fc-tel'), end: val('fc-end'), nasc: val('fc-nasc'),
  };
  if (!data.nome || !data.doc) { toast('Nome e CPF/CNPJ são obrigatórios.', 'error'); return; }

  if (id) {
    const idx = DB.clientes.findIndex(c => c.id === id);
    DB.clientes[idx] = { ...DB.clientes[idx], ...data };
    toast('Cliente atualizado com sucesso.', 'success');
  } else {
    DB.clientes.push({ id: nextId('c'), ...data });
    toast('Cliente cadastrado com sucesso.', 'success');
  }
  saveDB();
  closeModal('modal-cliente');
  renderClientes();
}); 

/* ── CLIENTE DETALHE ────────────────────────────────────────── */
let currentClienteId = null;
let currentDetailTab = 'tab-apolices';

function openClienteDetalhe(id) {
  currentClienteId = id;
  const c = getCliente(id);
  if (!c) return;

  setText('detail-nome',  c.nome);
  setText('detail-doc',   `${c.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'} · ${c.doc}`);
  setText('detail-email', c.email);
  setText('detail-tel',   c.tel);
  setText('detail-end',   c.end);
  setText('detail-nasc',  c.nasc || '—');

  navigateTo('cliente-detalhe', c.nome);
  switchDetailTab('tab-apolices');
}

document.getElementById('btn-back-clientes')?.addEventListener('click', () => navigateTo('clientes'));

document.getElementById('btn-editar-cliente')?.addEventListener('click', () => {
  const c = getCliente(currentClienteId);
  if (!c) return;
  setVal('fc-nome', c.nome); setVal('fc-tipo', c.tipo); setVal('fc-doc', c.doc);
  setVal('fc-email', c.email); setVal('fc-tel', c.tel); setVal('fc-end', c.end); setVal('fc-nasc', c.nasc);
  document.getElementById('form-cliente-id').value = c.id;
  document.getElementById('modal-cliente-title').textContent = 'Editar Cliente';
  openModal('modal-cliente');
});

document.getElementById('btn-excluir-cliente')?.addEventListener('click', () => {
  confirm('Excluir este cliente e todas as suas apólices?', () => {
    DB.clientes = DB.clientes.filter(c => c.id !== currentClienteId);
    DB.apolices = DB.apolices.filter(a => a.clienteId !== currentClienteId);
    saveDB();
    toast('Cliente excluído.', 'success');
    navigateTo('clientes');
  });
});

document.querySelectorAll('.detail-tab').forEach(btn => {
  btn.addEventListener('click', () => switchDetailTab(btn.dataset.tab));
});

function switchDetailTab(tabId) {
  currentDetailTab = tabId;
  document.querySelectorAll('.detail-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  document.querySelectorAll('.detail-pane').forEach(p => p.classList.toggle('active', p.id === tabId));

  if (tabId === 'tab-apolices')   renderDetailApolices();
  if (tabId === 'tab-timeline')   renderDetailTimeline();
  if (tabId === 'tab-financeiro') renderDetailFinanceiro();
}

function renderDetailApolices() {
  const wrap = document.getElementById('tab-apolices');
  if (!wrap) return;
  const list = DB.apolices.filter(a => a.clienteId === currentClienteId);
  if (list.length === 0) {
    wrap.innerHTML = `<div class="empty-state"><i class="fa-regular fa-file-lines"></i><p>Nenhuma apólice encontrada.</p></div>`;
    return;
  }
  wrap.innerHTML = list.map(a => {
    const fields = Object.entries(a.extra || {}).map(([k,v]) => {
      const labels = { veiculo:'Veículo', comissao:'Comissão', capital:'Capital Segurado', plano:'Plano', imovel:'Imóvel', objeto:'Objeto' };
      const isComissao = k === 'comissao';
      return `<div class="field-item">
        <div class="field-item__label">${labels[k] || k}</div>
        <div class="field-item__value">${isComissao ? fmtMoney(v) : escHtml(String(v))}</div>
      </div>`;
    }).join('');
    return `<div class="policy-row hover-lift">
      <div class="policy-row__head">
        <div>
          <div class="policy-row__id"><i class="fa-solid ${ramoIcon[a.ramo]} c-blue" style="margin-right:6px;font-size:13px;"></i>${escHtml(a.num)}</div>
          <div class="policy-row__seg">${ramoLabel[a.ramo]} · ${escHtml(a.seguradora)}</div>
        </div>
        <span class="badge badge--${statusClass[a.status]}">${statusLabel[a.status]}</span>
      </div>
      <div class="policy-row__fields">
        <div class="field-item"><div class="field-item__label">Vigência</div><div class="field-item__value">${escHtml(a.ini)} – ${escHtml(a.fim)}</div></div>
        <div class="field-item"><div class="field-item__label">Prêmio</div><div class="field-item__value">${fmtMoney(a.premio)}</div></div>
        ${fields}
      </div>
    </div>`;
  }).join('');
}

function renderDetailTimeline() {
  const wrap = document.getElementById('tab-timeline');
  if (!wrap) return;
  const items = DB.timeline.filter(t => t.clienteId === currentClienteId);
  if (items.length === 0) {
    wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-timeline"></i><p>Sem eventos registrados.</p></div>`;
    return;
  }
  wrap.innerHTML = `<div class="timeline">${items.map(t => `
    <div class="timeline-item">
      <div class="timeline-item__date"><i class="fa-regular fa-clock"></i>${escHtml(t.data)}</div>
      <div class="timeline-item__title">${escHtml(t.titulo)}</div>
      ${t.de ? `<div class="timeline-item__body"><span class="tl-strikethrough">${escHtml(t.de)}</span><span class="tl-arrow">→</span><span class="tl-new">${escHtml(t.para)}</span></div>` : ''}
    </div>`).join('')}
  </div>`;
}

function renderDetailFinanceiro() {
  const wrap = document.getElementById('tab-financeiro');
  if (!wrap) return;
  const apolices = DB.apolices.filter(a => a.clienteId === currentClienteId);
  if (apolices.length === 0) {
    wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-coins"></i><p>Sem dados financeiros.</p></div>`;
    return;
  }
  let html = `<div class="flex justify-between items-center mb-8">
    <span></span>
    <button class="btn btn-sm" onclick="exportFinCSV()"><i class="fa-solid fa-download"></i> Exportar CSV</button>
  </div>`;
  apolices.forEach(a => {
    const parcelas = DB.parcelas.filter(p => p.apoliceId === a.id);
    if (parcelas.length === 0) return;
    html += `<div class="table-card mb-12">
      <div style="padding:10px 14px;border-bottom:1px solid var(--border);font-size:13px;font-weight:700;color:var(--text);">${escHtml(a.num)}</div>
      <table><thead><tr>
        <th>Parcela</th><th>Vencimento</th><th>Valor</th><th>Status</th>
      </tr></thead><tbody>
      ${parcelas.map(p => {
        const isOver = p.status === 'atrasado';
        return `<tr class="${isOver ? 'fin-overdue' : ''}">
          <td class="td-bold">${escHtml(p.parcela)}</td>
          <td>${escHtml(p.venc)}${isOver ? ' <i class="fa-solid fa-triangle-exclamation" style="color:#d97706;font-size:10px;margin-left:4px;"></i>' : ''}</td>
          <td class="td-bold">${fmtMoney(p.valor)}</td>
          <td><span class="badge badge--${p.status === 'pago' ? 'green' : p.status === 'atrasado' ? 'red' : 'amber'}">${p.status === 'pago' ? 'Pago' : p.status === 'atrasado' ? 'Atrasado' : 'Pendente'}</span></td>
        </tr>`;
      }).join('')}
      </tbody></table></div>`;
  });
  wrap.innerHTML = html || `<div class="empty-state"><p>Sem parcelas cadastradas.</p></div>`;
}

/* ── APÓLICES ───────────────────────────────────────────────── */
let apoliceSearch = '';
let apoliceRamo   = 'todos';

function renderApolices() {
  const tbody = document.getElementById('apolices-body');
  if (!tbody) return;
  let list = DB.apolices;
  if (apoliceRamo !== 'todos') list = list.filter(a => a.ramo === apoliceRamo);
  if (apoliceSearch) list = list.filter(a => {
    const c = getCliente(a.clienteId);
    return a.num.toLowerCase().includes(apoliceSearch) || (c?.nome || '').toLowerCase().includes(apoliceSearch);
  });

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:32px;color:var(--text-3);">Nenhuma apólice encontrada.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(a => {
    const c = getCliente(a.clienteId);
    return `<tr>
      <td class="td-mono td-bold"><span class="c-blue">${escHtml(a.num)}</span></td>
      <td class="td-bold">${escHtml(c?.nome || '-')}</td>
      <td><span class="ramo"><i class="fa-solid ${ramoIcon[a.ramo]}"></i>${ramoLabel[a.ramo]}</span></td>
      <td>${escHtml(a.seguradora)}</td>
      <td class="apolice-vigencia" style="font-size:12px;color:var(--text-3);">${escHtml(a.ini)} – ${escHtml(a.fim)}</td>
      <td class="td-bold">${fmtMoney(a.premio)}</td>
      <td><span class="badge badge--${statusClass[a.status]}">${statusLabel[a.status]}</span></td>
      <td>
        <div class="apolice-actions flex gap-8">
          <button class="btn btn-icon btn-sm" title="Editar" onclick="editApolice('${escHtml(a.id)}')"><i class="fa-regular fa-pen-to-square"></i></button>
          <button class="btn btn-icon btn-sm c-danger" title="Excluir" onclick="deleteApolice('${escHtml(a.id)}')"><i class="fa-regular fa-trash-can"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

document.getElementById('apolice-search')?.addEventListener('input', function() {
  apoliceSearch = this.value.trim().toLowerCase();
  renderApolices();
});

document.querySelectorAll('#ramo-filters .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#ramo-filters .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    apoliceRamo = btn.dataset.ramo;
    renderApolices();
  });
});

document.getElementById('btn-nova-apolice')?.addEventListener('click', () => {
  clearForm('form-apolice');
  document.getElementById('modal-apolice-title').textContent = 'Nova Apólice';
  document.getElementById('form-apolice-id').value = '';
  populateClienteSelect('fa-cliente');
  openModal('modal-apolice');
});

function editApolice(id) {
  const a = getApolice(id);
  if (!a) return;
  populateClienteSelect('fa-cliente');
  document.getElementById('modal-apolice-title').textContent = 'Editar Apólice';
  document.getElementById('form-apolice-id').value = a.id;
  setVal('fa-num', a.num); setVal('fa-cliente', a.clienteId); setVal('fa-ramo', a.ramo);
  setVal('fa-seguradora', a.seguradora); setVal('fa-ini', a.ini); setVal('fa-fim', a.fim);
  setVal('fa-premio', a.premio); setVal('fa-status', a.status);
  openModal('modal-apolice');
}

function deleteApolice(id) {
  confirm('Tem certeza que deseja excluir esta apólice?', () => {
    DB.apolices = DB.apolices.filter(a => a.id !== id);
    saveDB();
    toast('Apólice excluída.', 'success');
    renderApolices();
  });
}

document.getElementById('form-apolice')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = val('form-apolice-id');
  const data = {
    num: val('fa-num'), clienteId: val('fa-cliente'), ramo: val('fa-ramo'),
    seguradora: val('fa-seguradora'), ini: val('fa-ini'), fim: val('fa-fim'),
    premio: Number(val('fa-premio')) || 0, status: val('fa-status'),
  };
  if (!data.num || !data.clienteId || !data.ramo) { toast('Preencha todos os campos obrigatórios.', 'error'); return; }
  if (id) {
    const idx = DB.apolices.findIndex(a => a.id === id);
    DB.apolices[idx] = { ...DB.apolices[idx], ...data };
    toast('Apólice atualizada.', 'success');
  } else {
    DB.apolices.push({ id: nextId('a'), extra: {}, ...data });
    toast('Apólice cadastrada.', 'success');
  }
  saveDB();
  closeModal('modal-apolice');
  renderApolices();
});

document.getElementById('btn-export-apolices')?.addEventListener('click', exportApolicesCSV);

function exportApolicesCSV() {
  const rows = [['Nº','Cliente','Ramo','Seguradora','Início','Fim','Prêmio','Status']];
  DB.apolices.forEach(a => {
    const c = getCliente(a.clienteId);
    rows.push([a.num, c?.nome||'', ramoLabel[a.ramo], a.seguradora, a.ini, a.fim, a.premio, statusLabel[a.status]]);
  });
  downloadCSV('apolices.csv', rows);
}

/* ── SINISTROS ──────────────────────────────────────────────── */
function renderSinistros() {
  const sinAbertos = DB.sinistros.filter(s => ['analise','aprovado'].includes(s.status));
  const totalFranq = DB.sinistros.reduce((s,x) => s + Number(x.franquia), 0);
  const franqPagas = DB.sinistros.filter(s => s.franquiaPaga).length;

  setText('sin-abertos', sinAbertos.length);
  setText('sin-franquias', fmtMoney(totalFranq));
  setText('sin-franq-pagas', `${franqPagas}/${DB.sinistros.length}`);

  const list = document.getElementById('sin-list');
  if (!list) return;
  if (DB.sinistros.length === 0) {
    list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>Nenhum sinistro registrado.</p></div>`;
    return;
  }

  list.innerHTML = DB.sinistros.map(s => {
    const c  = getCliente(s.clienteId);
    const a  = getApolice(s.apoliceId);
    const st = sinStatusClass[s.status] || 'gray';
    return `<div class="sin-item">
      <div class="sin-item__header">
        <div class="flex items-center gap-8">
          <span class="sin-item__id">${escHtml(s.num)}</span>
          <span class="badge badge--${st}">${sinStatusLabel[s.status]}</span>
        </div>
        <div class="flex items-center gap-8">
          <span class="sin-item__date">${escHtml(s.data)}</span>
          <button class="btn btn-icon btn-sm" title="Editar" onclick="editSinistro('${escHtml(s.id)}')"><i class="fa-regular fa-pen-to-square"></i></button>
          <button class="btn btn-icon btn-sm c-danger" title="Excluir" onclick="deleteSinistro('${escHtml(s.id)}')"><i class="fa-regular fa-trash-can"></i></button>
        </div>
      </div>
      <div class="sin-item__link">${escHtml(c?.nome || '-')} · <span class="c-blue">${escHtml(a?.num || s.apoliceId)}</span></div>
      <div class="sin-item__desc">${escHtml(s.desc)}</div>
      <div class="sin-item__fields">
        <div><div class="sin-field__label">Oficina / Hospital</div><div class="sin-field__value">${escHtml(s.oficina)}</div></div>
        <div><div class="sin-field__label">Previsão</div><div class="sin-field__value">${escHtml(s.previsao)}</div></div>
        <div><div class="sin-field__label">Franquia</div><div class="sin-field__value">${fmtMoney(s.franquia)}</div></div>
        <div><div class="sin-field__label">Franquia Paga</div>
          <div class="sin-field__value ${s.franquiaPaga ? 'ok' : 'no'}">
            ${s.franquiaPaga ? '<i class="fa-regular fa-circle-check"></i> Sim' : '<i class="fa-regular fa-circle-xmark"></i> Não'}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

document.getElementById('btn-novo-sinistro')?.addEventListener('click', () => {
  clearForm('form-sinistro');
  document.getElementById('modal-sinistro-title').textContent = 'Novo Sinistro';
  document.getElementById('form-sinistro-id').value = '';
  populateApoliceSelect('fs-apolice');
  openModal('modal-sinistro');
});

function editSinistro(id) {
  const s = DB.sinistros.find(x => x.id === id);
  if (!s) return;
  populateApoliceSelect('fs-apolice');
  document.getElementById('modal-sinistro-title').textContent = 'Editar Sinistro';
  document.getElementById('form-sinistro-id').value = s.id;
  setVal('fs-apolice', s.apoliceId); setVal('fs-data', s.data);
  setVal('fs-desc', s.desc); setVal('fs-oficina', s.oficina);
  setVal('fs-previsao', s.previsao); setVal('fs-franquia', s.franquia);
  setVal('fs-franq-paga', String(s.franquiaPaga)); setVal('fs-status', s.status);
  openModal('modal-sinistro');
}

function deleteSinistro(id) {
  confirm('Excluir este sinistro?', () => {
    DB.sinistros = DB.sinistros.filter(s => s.id !== id);
    saveDB();
    toast('Sinistro excluído.', 'success');
    renderSinistros();
  });
}

document.getElementById('form-sinistro')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = val('form-sinistro-id');
  const apoliceId = val('fs-apolice');
  const ap = getApolice(apoliceId);
  const data = {
    apoliceId, clienteId: ap?.clienteId || '',
    data: val('fs-data'), desc: val('fs-desc'), oficina: val('fs-oficina'),
    previsao: val('fs-previsao'), franquia: Number(val('fs-franquia')) || 0,
    franquiaPaga: val('fs-franq-paga') === 'true', status: val('fs-status'),
  };
  if (!data.apoliceId || !data.desc) { toast('Apólice e descrição são obrigatórios.', 'error'); return; }
  if (id) {
    const idx = DB.sinistros.findIndex(s => s.id === id);
    const sinOld = DB.sinistros[idx];
    DB.sinistros[idx] = { ...sinOld, ...data };
    toast('Sinistro atualizado.', 'success');
  } else {
    const num = 'SIN-' + new Date().getFullYear() + '-' + String(DB.sinistros.length + 1).padStart(3,'0');
    DB.sinistros.push({ id: nextId('s'), num, ...data });
    toast('Sinistro registrado.', 'success');
  }
  saveDB();
  closeModal('modal-sinistro');
  renderSinistros();
});

/* ── RENOVAÇÕES ─────────────────────────────────────────────── */
function renderRenovacoes() {
  const statusList = ['cotacao','enviado','fechado','perdido'];
  statusList.forEach(st => {
    const col = document.getElementById('ren-col-' + st);
    if (!col) return;
    const items = DB.renovacoes.filter(r => r.status === st);
    const countEl = col.querySelector('.count');
    if (countEl) countEl.textContent = items.length;
    const body = col.querySelector('.kanban-col__body');
    if (!body) return;
    if (items.length === 0) {
      body.innerHTML = `<div class="kanban-empty">Nenhuma renovação</div>`;
      return;
    }
    body.innerHTML = items.map(r => {
      const c = getCliente(r.clienteId);
      const a = getApolice(r.apoliceId);
      return `<div class="kanban-card">
        <div class="kanban-card__name">${escHtml(c?.nome || '-')}</div>
        <div class="kanban-card__sub">${escHtml(a?.num || '-')} · ${a ? ramoLabel[a.ramo] : ''}</div>
        ${a ? `<div class="kanban-card__sub" style="margin-top:3px;">Vence: ${escHtml(a.fim)}</div>` : ''}
        <div class="flex gap-8 mt-8">
          <button class="btn btn-sm btn-ghost" onclick="advanceRen('${escHtml(r.id)}')">Avançar</button>
          <button class="btn btn-sm btn-ghost c-danger" onclick="deleteRen('${escHtml(r.id)}')">Remover</button>
        </div>
      </div>`;
    }).join('');
  });

  // Apólices próximas vencimentos
  const tbody = document.getElementById('ren-venc-body');
  if (!tbody) return;
  const proximas = DB.apolices
    .filter(a => a.status !== 'cancelada')
    .sort((a,b) => a.fim.localeCompare(b.fim))
    .slice(0, 8);
  tbody.innerHTML = proximas.map(a => {
    const c = getCliente(a.clienteId);
    return `<tr>
      <td class="td-bold">${escHtml(c?.nome||'-')}</td>
      <td class="td-mono c-blue">${escHtml(a.num)}</td>
      <td>${ramoLabel[a.ramo]}</td>
      <td>${escHtml(a.seguradora)}</td>
      <td class="c-danger fw600">${escHtml(a.fim)}</td>
      <td class="td-bold">${fmtMoney(a.premio)}</td>
    </tr>`;
  }).join('');
}

function advanceRen(id) {
  const flow = ['cotacao','enviado','fechado'];
  const r = DB.renovacoes.find(x => x.id === id);
  if (!r) return;
  const idx = flow.indexOf(r.status);
  if (idx < flow.length - 1) {
    r.status = flow[idx + 1];
    saveDB();
    toast(`Renovação movida para: ${renStatusLabel[r.status]}`, 'info');
    renderRenovacoes();
  }
}

function deleteRen(id) {
  confirm('Remover esta renovação?', () => {
    DB.renovacoes = DB.renovacoes.filter(r => r.id !== id);
    saveDB();
    toast('Renovação removida.', 'success');
    renderRenovacoes();
  });
}

document.getElementById('btn-nova-renovacao')?.addEventListener('click', () => {
  clearForm('form-ren');
  document.getElementById('form-ren-id').value = '';
  populateApoliceSelect('fr-apolice');
  openModal('modal-renovacao');
});

document.getElementById('form-ren')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = val('form-ren-id');
  const apoliceId = val('fr-apolice');
  const ap = getApolice(apoliceId);
  const data = { apoliceId, clienteId: ap?.clienteId || '', status: val('fr-status'), obs: val('fr-obs') };
  if (!data.apoliceId) { toast('Selecione uma apólice.', 'error'); return; }
  if (id) {
    const idx = DB.renovacoes.findIndex(r => r.id === id);
    DB.renovacoes[idx] = { ...DB.renovacoes[idx], ...data };
    toast('Renovação atualizada.', 'success');
  } else {
    DB.renovacoes.push({ id: nextId('r'), ...data });
    toast('Renovação adicionada.', 'success');
  }
  saveDB();
  closeModal('modal-renovacao');
  renderRenovacoes();
});

/* ── RELATÓRIOS ──────────────────────────────────────────────── */
function renderRelatorios() {
  // ── Calculations ──────────────────────────────────────────
  const ativas       = DB.apolices.filter(a => a.status === 'ativa');
  const emRenovacao  = DB.apolices.filter(a => a.status === 'renovacao').length;
  const premioTotal  = DB.apolices.reduce((s,a) => s + Number(a.premio || 0), 0);
  const totalComissao = DB.apolices.reduce((s,a) => s + Number(a.extra?.comissao || 0), 0);
  const taxaRen      = DB.apolices.length > 0 ? Math.round((ativas.length / DB.apolices.length) * 100) : 0;
  const sinAbertos   = DB.sinistros.filter(s => ['analise','aprovado'].includes(s.status)).length;
  const sinRatio     = ativas.length > 0 ? ((sinAbertos / ativas.length) * 100).toFixed(1) : '0.0';
  const premioMedio  = ativas.length > 0 ? Math.round(premioTotal / ativas.length) : 0;

  // ── KPI Row 1 ─────────────────────────────────────────────
  setText('rel-carteira',       fmtMoney(premioTotal));
  setText('rel-comissoes',      fmtMoney(totalComissao));
  setText('rel-taxa-ren',       taxaRen + '%');
  setText('rel-sinistralidade', sinRatio + '%');
  setTrend('rel-carteira-trend',  `${DB.apolices.length} apólices no total`, null);
  setTrend('rel-comissoes-trend', `Média: ${fmtMoney(Math.round(totalComissao / (DB.apolices.length || 1)))} / apólice`, null);
  setTrend('rel-taxa-ren-trend',  emRenovacao + ' em renovação', emRenovacao === 0 ? true : null);
  setTrend('rel-sind-trend',      sinAbertos === 0 ? '↓ Nenhum sinistro aberto' : sinAbertos + ' sinistros abertos', sinAbertos === 0 ? true : false);

  // ── KPI Row 2 ─────────────────────────────────────────────
  setText('rel-clientes',        DB.clientes.length);
  setText('rel-apolices-ativas', ativas.length);
  setText('rel-premio-medio',    fmtMoney(premioMedio));
  setText('rel-em-ren',          emRenovacao);

  // ── HBar by seguradora ────────────────────────────────────
  const bySeguradora = {};
  DB.apolices.forEach(a => { bySeguradora[a.seguradora] = (bySeguradora[a.seguradora]||0) + Number(a.premio||0); });
  const maxVal = Math.max(...Object.values(bySeguradora), 1);
  const hbar = document.getElementById('rel-hbar');
  if (hbar) {
    hbar.innerHTML = Object.entries(bySeguradora)
      .sort((a,b) => b[1] - a[1])
      .map(([seg, v]) => {
        const pct = Math.round((v / maxVal) * 100);
        return `<div style="margin-bottom:6px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2);margin-bottom:4px;">
            <span>${escHtml(seg)}</span><span style="font-weight:600;color:var(--text);">${fmtMoney(v)}</span>
          </div>
          <div style="height:6px;background:var(--bg);border-radius:3px;overflow:hidden;">
            <div style="height:6px;width:${pct}%;background:linear-gradient(90deg,#2563eb,#60a5fa);border-radius:3px;transition:width .4s;"></div>
          </div>
        </div>`;
      }).join('');
  }

  // ── Top 5 Clientes ────────────────────────────────────────
  const premioByCliente   = {};
  const apolicesByCliente = {};
  DB.apolices.forEach(a => {
    premioByCliente[a.clienteId]   = (premioByCliente[a.clienteId]   || 0) + Number(a.premio || 0);
    apolicesByCliente[a.clienteId] = (apolicesByCliente[a.clienteId] || 0) + 1;
  });
  const top5 = Object.entries(premioByCliente).sort((a,b) => b[1]-a[1]).slice(0,5);
  const tbody1 = document.getElementById('rel-top-clientes');
  if (tbody1) {
    tbody1.innerHTML = top5.map(([cid, total]) => {
      const c = getCliente(cid);
      return `<tr>
        <td class="td-bold">${escHtml(c?.nome || '-')}</td>
        <td style="text-align:center;">${apolicesByCliente[cid] || 0}</td>
        <td class="td-mono">${fmtMoney(total)}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="3" class="td-empty">Sem dados</td></tr>';
  }

  // ── Vencimentos Próximos (90 dias) ────────────────────────
  function parseBR(s) {
    if (!s) return null;
    const [d, m, y] = s.split('/');
    return new Date(+y, +m - 1, +d);
  }
  const hoje   = new Date();
  const limite = new Date(hoje); limite.setDate(limite.getDate() + 90);
  const proximas = DB.apolices
    .filter(a => { const d = parseBR(a.fim); return d && d >= hoje && d <= limite; })
    .sort((a,b) => parseBR(a.fim) - parseBR(b.fim))
    .slice(0, 8);
  const tbody2 = document.getElementById('rel-venc-proximos');
  if (tbody2) {
    tbody2.innerHTML = proximas.map(a => {
      const c    = getCliente(a.clienteId);
      const d    = parseBR(a.fim);
      const dias = Math.ceil((d - hoje) / 86400000);
      const urg  = dias <= 15 ? 'red' : dias <= 30 ? 'amber' : 'green';
      return `<tr>
        <td class="td-mono c-blue">${escHtml(a.num)}</td>
        <td>${escHtml(c?.nome || '-')}</td>
        <td>${escHtml(a.fim)}</td>
        <td><span class="badge badge--${urg}">${dias}d</span></td>
      </tr>`;
    }).join('') || '<tr><td colspan="4" class="td-empty">Nenhum vencimento nos próximos 90 dias</td></tr>';
  }

  // ── Charts ─────────────────────────────────────────────────
  _renderChartRamos();
  _renderChartStatus();
  _renderChartEvolucao();
}

function _renderChartRamos() {
  const canvas = document.getElementById('chart-ramos');
  if (!canvas || typeof Chart === 'undefined') return;
  const totalByRamo = {};
  DB.apolices.forEach(a => { totalByRamo[a.ramo] = (totalByRamo[a.ramo]||0) + Number(a.premio||0); });
  const labels = Object.keys(totalByRamo).map(r => ramoLabel[r] || r);
  const data   = Object.values(totalByRamo);
  const colors = ['#2563eb','#16a34a','#d97706','#0ea5e9','#7c3aed','#dc2626','#94a3b8'];
  if (_chartRamos) { _chartRamos.destroy(); _chartRamos = null; }
  _chartRamos = new Chart(canvas, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors.slice(0, data.length), borderWidth: 2, borderColor: '#fff' }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { size: 11, family: 'Inter' } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmtMoney(ctx.raw)}` } }
      }
    }
  });
}

function _renderChartStatus() {
  const canvas = document.getElementById('chart-status');
  if (!canvas || typeof Chart === 'undefined') return;
  const counts = { ativa: 0, renovacao: 0, vencida: 0, cancelada: 0 };
  DB.apolices.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
  const labels = Object.keys(counts).map(s => statusLabel[s] || s);
  const data   = Object.values(counts);
  const colors = ['#16a34a','#2563eb','#d97706','#dc2626'];
  if (_chartStatus) { _chartStatus.destroy(); _chartStatus = null; }
  _chartStatus = new Chart(canvas, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { size: 11, family: 'Inter' } } }
      }
    }
  });
}

function _renderChartEvolucao() {
  const canvas = document.getElementById('chart-evolucao');
  if (!canvas || typeof Chart === 'undefined') return;
  const now = new Date();
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const labels = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(monthNames[d.getMonth()]);
  }
  const premioTotal = DB.apolices.reduce((s,a) => s + Number(a.premio||0), 0);
  const premioData  = labels.map((_, i) => {
    const factor = 0.6 + (i / 11) * 0.4;
    const jitter = 0.92 + Math.sin(i * 1.3) * 0.08;
    return Math.round(premioTotal * factor * jitter / 12);
  });
  const commRate    = DB.apolices.length > 0
    ? (DB.apolices.reduce((s,a)=>s+Number(a.extra?.comissao||0),0) / DB.apolices.reduce((s,a)=>s+Number(a.premio||0),1))
    : 0.12;
  const comissaoData = premioData.map(v => Math.round(v * commRate));

  if (_chartEvolucao) { _chartEvolucao.destroy(); _chartEvolucao = null; }
  _chartEvolucao = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Prêmio', data: premioData, type: 'bar',
          backgroundColor: 'rgba(37,99,235,.18)', borderColor: '#2563eb', borderWidth: 1.5,
          borderRadius: 4, yAxisID: 'y' },
        { label: 'Comissão', data: comissaoData, type: 'line',
          borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,.08)',
          borderWidth: 2, pointRadius: 3, tension: 0.4, fill: false, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, padding: 14, font: { size: 11, family: 'Inter' } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmtMoney(ctx.raw)}` } }
      },
      scales: {
        y:  { position: 'left',  ticks: { callback: v => 'R$'+(v/1000).toFixed(0)+'k', font:{size:10,family:'Inter'} }, grid: { color: '#f1f5f9' } },
        y1: { position: 'right', ticks: { callback: v => 'R$'+(v/1000).toFixed(0)+'k', font:{size:10,family:'Inter'} }, grid: { drawOnChartArea: false } },
        x:  { ticks: { font: { size: 11, family: 'Inter' } }, grid: { display: false } }
      }
    }
  });
}

function exportRelCSV() {
  const rows = [['Apólice','Cliente','Ramo','Seguradora','Início','Fim','Prêmio','Comissão','Status']];
  DB.apolices.forEach(a => {
    const c = getCliente(a.clienteId);
    rows.push([a.num, c?.nome||'', ramoLabel[a.ramo]||a.ramo, a.seguradora, a.inicio, a.fim,
               a.premio, a.extra?.comissao||0, statusLabel[a.status]||a.status]);
  });
  downloadCSV('relatorio-apolices.csv', rows);
}

/* ── RELATÓRIOS — period selector tabs ─────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('#rel-period .tab-btn');
  if (!btn) return;
  btn.closest('#rel-period').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRelatorios();
});

/* ── CONFIGURAÇÕES ──────────────────────────────────────────── */
document.querySelectorAll('.settings-nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.settings-nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.settings;
    document.querySelectorAll('.settings-pane').forEach(p => p.classList.toggle('active', p.id === target));
  });
});

/* ── Utility for forms ──────────────────────────────────────── */
function val(id)      { const el = document.getElementById(id); return el ? el.value : ''; }
function setVal(id,v) { const el = document.getElementById(id); if (el) el.value = v ?? ''; }

function clearForm(id) {
  const form = document.getElementById(id);
  if (form) form.reset();
}

function populateClienteSelect(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = `<option value="">Selecionar cliente...</option>` +
    DB.clientes.map(c => `<option value="${escHtml(c.id)}">${escHtml(c.nome)}</option>`).join('');
}

function populateApoliceSelect(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = `<option value="">Selecionar apólice...</option>` +
    DB.apolices.map(a => {
      const c = getCliente(a.clienteId);
      return `<option value="${escHtml(a.id)}">${escHtml(a.num)} – ${escHtml(c?.nome||'')}</option>`;
    }).join('');
}

/* ── CSV export ─────────────────────────────────────────────── */
function downloadCSV(filename, rows) {
  const content = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  toast('Arquivo CSV gerado com sucesso.', 'success');
}

function exportFinCSV() {
  const apolices = DB.apolices.filter(a => a.clienteId === currentClienteId);
  const rows = [['Apólice','Parcela','Vencimento','Valor','Status']];
  apolices.forEach(a => {
    DB.parcelas.filter(p => p.apoliceId === a.id).forEach(p => {
      rows.push([a.num, p.parcela, p.venc, p.valor, p.status]);
    });
  });
  downloadCSV('financeiro.csv', rows);
}

document.getElementById('btn-export-clientes')?.addEventListener('click', () => {
  const rows = [['Nome','Tipo','Documento','Email','Telefone','Endereço']];
  DB.clientes.forEach(c => rows.push([c.nome,c.tipo,c.doc,c.email,c.tel,c.end]));
  downloadCSV('clientes.csv', rows);
});

/* ── Modal close buttons ────────────────────────────────────── */
document.querySelectorAll('.modal__close, [data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const closest = btn.closest('.modal-overlay');
    if (closest) closest.classList.remove('open');
  });
});

document.getElementById('confirm-no')?.addEventListener('click', () => closeModal('modal-confirm'));

/* ── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('dashboard');
  syncMobileTableLabels();
});
