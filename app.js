// ═══════════════════════════════════════════════════════
// MACULADOS PELO METAL — App Logic
// ═══════════════════════════════════════════════════════

// ── SUPABASE CONFIG (opcional) ───────────────────────
// Para ativar login com banco de dados:
// 1. Crie conta em supabase.com
// 2. Crie projeto
// 3. Vá em Settings > API e copie a URL e anon key
// 4. Substitua os valores abaixo
// 5. Execute o SQL no editor do Supabase (veja README)
const SUPABASE_URL  = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY  = 'YOUR_SUPABASE_ANON_KEY';
const USE_SUPABASE  = SUPABASE_URL !== 'YOUR_SUPABASE_URL';
let supabaseClient  = null;

if (USE_SUPABASE && typeof window.supabase !== 'undefined') {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// ── CONSTANTS ─────────────────────────────────────────
const ATTRS_DEF = [
  { key:'vig', abbr:'VIG', label:'Vigor',    desc:'Força bruta' },
  { key:'des', abbr:'DES', label:'Destreza', desc:'Reflexos' },
  { key:'for', abbr:'FOR', label:'Fortitude',desc:'Resistência' },
  { key:'raz', abbr:'RAZ', label:'Razão',    desc:'Memória' },
  { key:'ins', abbr:'INS', label:'Instinto', desc:'Percepção' },
  { key:'pre', abbr:'PRE', label:'Presença', desc:'Influência' },
];

const PERICIAS_DEF = {
  fisicas: [
    {key:'atletismo',    label:'Atletismo'},
    {key:'bracal',       label:'Trabalho Braçal'},
    {key:'combate',      label:'Combate'},
    {key:'acrobacia',    label:'Acrobacia', special:true},
    {key:'furtividade',  label:'Furtividade'},
    {key:'resistencia',  label:'Resistência'},
    {key:'biointegra',   label:'Biointegração'},
  ],
  tecnicas: [
    {key:'precisao',     label:'Precisão Manual', special:true},
    {key:'manejo',       label:'Manejo de Armas'},
    {key:'engenharia',   label:'Engenharia'},
    {key:'medicina',     label:'Medicina', special:true},
    {key:'ciencia',      label:'Ciência', special:true},
  ],
  mentais: [
    {key:'investigacao', label:'Investigação'},
    {key:'conhecimento', label:'Conhecimento'},
    {key:'percepcao',    label:'Percepção'},
    {key:'intuicao',     label:'Intuição'},
    {key:'sobrevivencia',label:'Sobrevivência', special:true},
  ],
  sociais: [
    {key:'persuasao',    label:'Persuasão', special:true},
    {key:'enganacao',    label:'Enganação'},
    {key:'intimidacao',  label:'Intimidação'},
    {key:'comando',      label:'Comando', special:true},
  ],
};

const DICE_OPTS = ['d12','d10','d8','d6','d4'];

const ARQ_DESCS = {
  'Fortificado': 'Seu corpo virou fortaleza. Cada placa, cada pistão, cada válvula de pressão é uma declaração: você não vai cair.',
  'Tecnocrata':  'Você não modificou seu corpo. Você o atualizou. A diferença parece importante até você não conseguir mais lembrar o rosto da sua mãe.',
  'Rastejador':  'O silêncio não é ausência de som — é presença de controle. Cada articulação silenciada, cada passo que não existe.',
  'Carniceiro':  'Você não aprendeu a lutar. Você aprendeu a não parar. Lutadores param quando vencem. Você para quando não há mais nada se movendo.',
  'Quimera':     'Suas modificações não fazem sentido juntas. Você trava, falha sem aviso. Mas também faz coisas que não deveriam ser possíveis.',
  'Imaculado':   'Em um mundo de deuses de metal, você permanece carne e sangue. Frágil. Mortal. Humano. Quando você fala, as pessoas lembram o que perderam.',
};

const EF_TIERS = [
  {max:5,  label:'Humano',      cls:'ef-s0', fx:'Nenhum custo. Você ainda é quem era.'},
  {max:10, label:'Processando', cls:'ef-s1', fx:'+1d8 técnico. Conversas casuais ficam estranhas.'},
  {max:15, label:'Suprimido',   cls:'ef-s2', fx:'+1d8 vs dor/medo. PRE QS 2 para sentir emoções.'},
  {max:20, label:'Frio',        cls:'ef-s3', fx:'+1d4 combate. Vê pessoas como unidades.'},
  {max:99, label:'Dissolução',  cls:'ef-s4', fx:'+2d4 tudo. Algo essencial está desaparecendo.'},
];

const EX_LABELS = ['Descansado','Desvantagem atributos','Deslocamento metade','Desvantagem ataques','PV máximo reduzido','Deslocamento zero','☠ MORTE'];

const REP_LABELS = ['','Desconhecido','Reconhecido','Respeitado','Influente','Referência'];

const RECURSOS_DEF = [
  {key:'sucata',   label:'Sucata'},
  {key:'reagente', label:'Reagente'},
  {key:'organico', label:'Orgânico'},
  {key:'vapor',    label:'Vapor'},
  {key:'eletrico', label:'Elétrico'},
  {key:'resto',    label:'Restos'},
];

// ── DEFAULT CHARACTER STATE ───────────────────────────
function defaultChar(id) {
  const char = {
    id: id || crypto.randomUUID(),
    nome:'', apelido:'', origem:'', aparencia:'', moradia:'', detalhe:'',
    arqueamento:'', convergencia:'', nivel:1,
    profissao:'', reputacao:1, contato_init:'',
    pv_max:16, pv_cur:16,
    cv_max:0, cv_cur:0,
    exaustao:0, ef:0,
    atributos:{ vig:1, des:1, for:1, raz:1, ins:1, pre:1 },
    pericias:{},
    ancoras:[{texto:'',quebrada:false},{texto:'',quebrada:false},{texto:'',quebrada:false}],
    modificacoes:[],
    inventario:[],
    recursos:{ sucata:0, reagente:0, organico:0, vapor:0, eletrico:0, resto:0 },
    contatos:[], equipamento:'', notas:'', conexoes:'',
  };
  Object.values(PERICIAS_DEF).flat().forEach(p => { char.pericias[p.key] = 'd12'; });
  return char;
}

// ── APP STATE ──────────────────────────────────────────
let appState = {
  characters: [],   // all saved characters
  currentId:  null, // active character id
  user:       null, // supabase user
};

let char = null; // current character (shorthand)

// ── INIT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadAppState();
  setupTabs();
  setupFilterBars();
  renderMenu();
  showView('menu');

  // Supabase auth listener
  if (USE_SUPABASE && supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      appState.user = session?.user || null;
      updateAuthBar();
      if (appState.user) syncFromSupabase();
    });
  }
});

// ── VIEWS ──────────────────────────────────────────────
function showView(name) {
  document.getElementById('view-menu').classList.toggle('active', name === 'menu');
  document.getElementById('view-sheet').classList.toggle('active', name === 'sheet');
}

function goToMenu() {
  if (char) { collectTextFields(); saveCurrentChar(); }
  char = null;
  appState.currentId = null;
  renderMenu();
  showView('menu');
}

// ── MENU ───────────────────────────────────────────────
function renderMenu() {
  const grid = document.getElementById('chars-grid');
  grid.innerHTML = '';

  // New card
  const newCard = document.createElement('div');
  newCard.className = 'char-card char-card-new';
  newCard.innerHTML = `<div class="char-card-new-icon">⊕</div><div class="t-label" style="margin:0">Nova Ficha</div>`;
  newCard.onclick = createNewChar;
  grid.appendChild(newCard);

  if (appState.characters.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.style.gridColumn = '1 / -1';
    empty.innerHTML = `<div class="empty-state-icon">⚙</div><div style="font-size:14px">Nenhuma ficha criada ainda.<br>Clique em "Nova Ficha" para começar.</div>`;
    grid.appendChild(empty);
    return;
  }

  appState.characters.forEach(c => {
    const card = document.createElement('div');
    card.className = 'char-card';
    const ef = c.ef || 0;
    const efTier = EF_TIERS.find(t => ef <= t.max) || EF_TIERS[EF_TIERS.length-1];
    card.innerHTML = `
      <div class="char-card-actions">
        <button class="btn btn-icon btn-ghost btn-sm" onclick="event.stopPropagation();deleteChar('${c.id}')" title="Excluir">✕</button>
      </div>
      <div class="char-card-arq">${c.arqueamento || 'Sem arqueamento'} · Nível ${c.nivel || 1}</div>
      <div class="char-card-name">${c.nome || 'Sem nome'}</div>
      <div class="char-card-stats">
        <div class="char-card-stat">
          <span class="char-card-stat-val">${c.pv_cur || 0}/${c.pv_max || 16}</span>
          <span class="char-card-stat-lbl">PV</span>
        </div>
        <div class="char-card-stat">
          <span class="char-card-stat-val" style="color:${ef > 15 ? 'var(--rust)' : ef > 5 ? 'var(--brass)' : 'var(--smoke-300)'}">${ef}</span>
          <span class="char-card-stat-lbl">EF</span>
        </div>
        <div class="char-card-stat">
          <span class="char-card-stat-val">${c.profissao || '—'}</span>
          <span class="char-card-stat-lbl">PROFISSÃO</span>
        </div>
      </div>
    `;
    card.onclick = () => openChar(c.id);
    grid.appendChild(card);
  });
}

function createNewChar() {
  const c = defaultChar();
  appState.characters.push(c);
  saveAppState();
  openChar(c.id);
}

function openChar(id) {
  const found = appState.characters.find(c => c.id === id);
  if (!found) return;
  char = JSON.parse(JSON.stringify(found)); // deep copy
  appState.currentId = id;
  buildSheet();
  showView('sheet');
}

function deleteChar(id) {
  if (!confirm('Excluir esta ficha permanentemente?')) return;
  appState.characters = appState.characters.filter(c => c.id !== id);
  saveAppState();
  renderMenu();
}

// ── SAVE / LOAD ────────────────────────────────────────
function loadAppState() {
  try {
    const saved = localStorage.getItem('maculados_app');
    if (saved) {
      const parsed = JSON.parse(saved);
      appState.characters = parsed.characters || [];
    }
  } catch(e) { console.warn('Load error:', e); }

  // Migration: support old single-char format
  try {
    const oldChar = localStorage.getItem('maculados_ficha');
    if (oldChar && appState.characters.length === 0) {
      const c = { ...defaultChar(), ...JSON.parse(oldChar) };
      if (!c.id) c.id = crypto.randomUUID();
      if (!c.inventario) c.inventario = [];
      appState.characters.push(c);
      saveAppState();
      localStorage.removeItem('maculados_ficha');
    }
  } catch(e) {}
}

function saveAppState() {
  try {
    localStorage.setItem('maculados_app', JSON.stringify({ characters: appState.characters }));
  } catch(e) { console.error('Save error:', e); }
}

function saveCurrentChar() {
  if (!char || !appState.currentId) return;
  const idx = appState.characters.findIndex(c => c.id === appState.currentId);
  if (idx >= 0) {
    appState.characters[idx] = JSON.parse(JSON.stringify(char));
  }
  saveAppState();
  if (USE_SUPABASE && supabaseClient && appState.user) syncCharToSupabase(char);
}

function saveSheet() {
  collectTextFields();
  saveCurrentChar();
  showToast('Ficha salva.');
  updateTopbarName();
}

function collectTextFields() {
  if (!char) return;
  const texts = ['nome','apelido','origem','aparencia','moradia','detalhe','convergencia','contato_init','equipamento','notas','conexoes'];
  texts.forEach(f => {
    const el = document.getElementById(f);
    if (el) char[f] = el.value;
  });
  const selects = ['arqueamento','profissao'];
  selects.forEach(f => {
    const el = document.getElementById(f);
    if (el) char[f] = el.value;
  });
  // Anchor texts
  document.querySelectorAll('#ancoras-list .ancora-row input').forEach((inp, i) => {
    if (char.ancoras[i]) char.ancoras[i].texto = inp.value;
  });
}

// Auto-save every 45 seconds
setInterval(() => {
  if (char) { collectTextFields(); saveCurrentChar(); }
}, 45000);

// ── BUILD SHEET ────────────────────────────────────────
function buildSheet() {
  if (!char) return;
  updateTopbarName();
  updatePortrait();
  buildAttrs();
  buildPericias();
  buildPV();
  buildEF();
  buildExaustao();
  buildCVPips();
  buildAncoras();
  buildMods();
  buildModsCatalog();
  buildInventory();
  buildShop();
  buildRecursos();
  buildContatos();
  buildNivelPips();
  buildRepGears();
  updateArqDesc();
  restoreTextFields();
}

function restoreTextFields() {
  const texts = ['nome','apelido','origem','aparencia','moradia','detalhe','convergencia','contato_init','equipamento','notas','conexoes'];
  texts.forEach(f => {
    const el = document.getElementById(f);
    if (el && char[f] !== undefined) el.value = char[f];
  });
  const selects = ['arqueamento','profissao'];
  selects.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.value = char[f] || '';
  });
  const pvMax = document.getElementById('pv-max');
  if (pvMax) pvMax.value = char.pv_max || 16;
  const cvMax = document.getElementById('cv-max');
  if (cvMax) cvMax.value = char.cv_max || 0;
}

// ── TOPBAR & PORTRAIT ──────────────────────────────────
function updateTopbarName() {
  const n = document.getElementById('topbar-name');
  if (n) n.textContent = char.nome || 'Sem nome';
}

function updatePortrait() {
  const nameEl = document.getElementById('portrait-name');
  const arqEl  = document.getElementById('portrait-arq');
  if (nameEl) nameEl.textContent = char.nome || 'Novo Personagem';
  if (arqEl)  arqEl.textContent  = char.arqueamento ? `${char.arqueamento} · Nível ${char.nivel || 1}` : '— sem arqueamento —';

  // Listen on nome field to update portrait live
  const nomeEl = document.getElementById('nome');
  if (nomeEl) {
    nomeEl.oninput = () => {
      char.nome = nomeEl.value;
      updateTopbarName();
      if (nameEl) nameEl.textContent = char.nome || 'Novo Personagem';
    };
  }
}

// ── TABS ───────────────────────────────────────────────
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + tab));
    };
  });
}

// ── ATRIBUTOS ──────────────────────────────────────────
function buildAttrs() {
  const grid = document.getElementById('attrs-grid');
  if (!grid) return;
  grid.innerHTML = '';

  ATTRS_DEF.forEach(a => {
    const val = char.atributos[a.key] || 1;
    const cell = document.createElement('div');
    cell.className = 'attr-cell';
    cell.innerHTML = `
      <span class="attr-abbr">${a.abbr}</span>
      <span class="attr-val">${val}</span>
      <div class="attr-pips-mini">
        ${[1,2,3,4].map(i => `<div class="attr-pip-mini ${val>=i?'on':''}" onclick="setAttr('${a.key}',${i})"></div>`).join('')}
      </div>
    `;
    grid.appendChild(cell);
  });
  updatePtsUsed();
}

function setAttr(key, val) {
  char.atributos[key] = val;
  buildAttrs();
}

function updatePtsUsed() {
  const total = Object.values(char.atributos).reduce((a,b)=>a+b,0) - 6;
  const el = document.getElementById('pts-used');
  if (!el) return;
  el.textContent = total;
  el.style.color = total === 5 ? 'var(--brass)' : total > 5 ? 'var(--rust)' : 'var(--copper)';
}

// ── PERÍCIAS ───────────────────────────────────────────
function buildPericiaGroup(list, containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  cont.innerHTML = '';
  list.forEach(p => {
    const val = char.pericias[p.key] || 'd12';
    const row = document.createElement('div');
    row.className = 'pericia-row';
    row.innerHTML = `
      <div class="pericia-name ${p.special?'special':''}">${p.label}</div>
      <span class="dice-badge ${val}">${val}</span>
      <select class="dice-select" onchange="setPericia('${p.key}',this.value)">
        ${DICE_OPTS.map(d=>`<option value="${d}" ${val===d?'selected':''}>${d}</option>`).join('')}
      </select>
    `;
    cont.appendChild(row);
  });
}

function buildPericias() {
  buildPericiaGroup(PERICIAS_DEF.fisicas,  'pericias-fisicas');
  buildPericiaGroup(PERICIAS_DEF.tecnicas, 'pericias-tecnicas');
  buildPericiaGroup(PERICIAS_DEF.mentais,  'pericias-mentais');
  buildPericiaGroup(PERICIAS_DEF.sociais,  'pericias-sociais');
}

function setPericia(key, val) {
  char.pericias[key] = val;
  buildPericias();
}

// ── ARQUEAMENTO ────────────────────────────────────────
function updateArqDesc() {
  const sel = document.getElementById('arqueamento');
  if (sel) char.arqueamento = sel.value;
  const desc = document.getElementById('arq-desc');
  if (desc) desc.textContent = ARQ_DESCS[char.arqueamento] || 'Escolha um arqueamento para ver sua descrição.';
  const arqEl = document.getElementById('portrait-arq');
  if (arqEl) arqEl.textContent = char.arqueamento ? `${char.arqueamento} · Nível ${char.nivel||1}` : '— sem arqueamento —';
}

function buildNivelPips() {
  const cont = document.getElementById('nivel-pips');
  const num  = document.getElementById('nivel-num');
  if (!cont || !num) return;
  cont.innerHTML = '';
  num.textContent = char.nivel || 1;
  for (let i = 1; i <= 10; i++) {
    const pip = document.createElement('div');
    pip.className = 'nivel-pip' + ((char.nivel||1) >= i ? ' on' : '');
    pip.onclick = () => { char.nivel = i; buildNivelPips(); };
    cont.appendChild(pip);
  }
}

// ── REPUTAÇÃO ──────────────────────────────────────────
function buildRepGears() {
  const cont = document.getElementById('rep-gears');
  const num  = document.getElementById('rep-num');
  const lbl  = document.getElementById('rep-label');
  if (!cont) return;
  cont.innerHTML = '';
  const r = char.reputacao || 1;
  if (num) num.textContent = r;
  if (lbl) lbl.textContent = REP_LABELS[r] || '';
  for (let i = 1; i <= 5; i++) {
    const g = document.createElement('div');
    g.className = 'rep-gear' + (r >= i ? ' on' : '');
    g.textContent = '⚙';
    g.onclick = () => { char.reputacao = i; buildRepGears(); };
    cont.appendChild(g);
  }
}

// ── PV ─────────────────────────────────────────────────
function buildPV() {
  const max = char.pv_max || 16;
  const cur = char.pv_cur || 0;
  const pct = Math.max(0, Math.min(100, (cur / max) * 100));
  const curEl = document.getElementById('pv-cur');
  const maxEl = document.getElementById('pv-max-disp');
  const bar   = document.getElementById('pv-bar');
  if (curEl) { curEl.textContent = cur; curEl.className = 'pv-cur' + (pct < 25 ? ' critical' : pct < 50 ? ' low' : ''); }
  if (maxEl) maxEl.textContent = max;
  if (bar)   bar.style.width = pct + '%';
}

function onPVMaxChange() {
  char.pv_max = parseInt(document.getElementById('pv-max').value) || 16;
  if (char.pv_cur > char.pv_max) char.pv_cur = char.pv_max;
  buildPV();
}
function damagePV() {
  const d = parseInt(document.getElementById('pv-delta').value) || 1;
  char.pv_cur = Math.max(0, char.pv_cur - d);
  buildPV();
}
function healPV() {
  const d = parseInt(document.getElementById('pv-delta').value) || 1;
  char.pv_cur = Math.min(char.pv_max, char.pv_cur + d);
  buildPV();
}

// ── ESCALA DE FERRUGEM ─────────────────────────────────
function buildEF() {
  const ef  = char.ef || 0;
  const num = document.getElementById('ef-num');
  const bar = document.getElementById('ef-bar');
  const sts = document.getElementById('ef-status');
  const efx = document.getElementById('ef-effect');
  if (num) num.textContent = ef;
  if (bar) bar.style.width = Math.min(100, (ef / 21) * 100) + '%';
  const tier = EF_TIERS.find(t => ef <= t.max) || EF_TIERS[EF_TIERS.length-1];
  if (sts) { sts.className = 'ef-status-badge ' + tier.cls; sts.textContent = tier.label; }
  if (efx) efx.textContent = tier.fx;
  updateAncoraNote();
}

function changeEF(d) {
  char.ef = Math.max(0, (char.ef || 0) + d);
  buildEF();
}

// ── EXAUSTÃO ───────────────────────────────────────────
function buildExaustao() {
  const cont = document.getElementById('ex-pips');
  const stat = document.getElementById('ex-status');
  if (!cont) return;
  cont.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const pip = document.createElement('div');
    const filled = (char.exaustao || 0) > i;
    pip.className = 'ex-pip' + (filled ? ' filled' : '') + (i === 5 ? ' lethal' : '');
    pip.textContent = i + 1;
    pip.onclick = () => { char.exaustao = (char.exaustao||0) > i ? i : i+1; buildExaustao(); };
    cont.appendChild(pip);
  }
  if (stat) {
    const lvl = char.exaustao || 0;
    stat.textContent = EX_LABELS[lvl] || 'Morte';
    stat.style.color = lvl >= 5 ? 'var(--rust)' : lvl >= 3 ? 'var(--copper)' : 'var(--smoke-dim)';
  }
}

// ── CV ─────────────────────────────────────────────────
function buildCVPips() {
  const cont = document.getElementById('cv-pips');
  if (!cont) return;
  cont.innerHTML = '';
  const cvMaxEl = document.getElementById('cv-max');
  if (cvMaxEl) char.cv_max = parseInt(cvMaxEl.value) || 0;
  const max = char.cv_max || 0;
  const cur = char.cv_cur || 0;
  if (max === 0) {
    cont.innerHTML = '<span style="font-size:11px;color:var(--steel-400);font-style:italic">Sem caldeira.</span>';
    return;
  }
  for (let i = 0; i < max; i++) {
    const pip = document.createElement('div');
    pip.className = 'cv-pip' + (cur > i ? ' filled' : '');
    pip.onclick = () => { char.cv_cur = cur > i ? i : i+1; buildCVPips(); };
    cont.appendChild(pip);
  }
}

// ── ÂNCORAS ────────────────────────────────────────────
function buildAncoras() {
  const cont = document.getElementById('ancoras-list');
  if (!cont) return;
  cont.innerHTML = '';
  char.ancoras.forEach((a, i) => {
    const row = document.createElement('div');
    row.className = 'ancora-row' + (a.quebrada ? ' broken' : '');
    row.innerHTML = `
      <span class="ancora-num-badge">${i+1}</span>
      <input type="text" value="${(a.texto||'').replace(/"/g,'&quot;')}"
        placeholder="Memória, pessoa, objeto ou princípio..."
        oninput="char.ancoras[${i}].texto=this.value">
      <button class="ancora-icon" onclick="toggleAncora(${i})">${a.quebrada?'↺':'✕'}</button>
    `;
    cont.appendChild(row);
  });
  updateAncoraNote();
}

function toggleAncora(i) {
  char.ancoras[i].quebrada = !char.ancoras[i].quebrada;
  buildAncoras();
}

function updateAncoraNote() {
  const intactas = char.ancoras.filter(a => !a.quebrada).length;
  const ef = char.ef || 0;
  const note = document.getElementById('ancora-note');
  if (!note) return;
  if (intactas === 0 && ef >= 21) {
    note.textContent = '0 âncoras + EF 21+ — Dissolução iminente.';
    note.className = 'ancora-note danger';
  } else if (intactas === 0) {
    note.textContent = '0 âncoras — vulnerável ao metal.';
    note.className = 'ancora-note danger';
  } else {
    note.textContent = `${intactas} âncora${intactas!==1?'s':''} intacta${intactas!==1?'s':''}.`;
    note.className = 'ancora-note';
  }
}

// ── MODIFICAÇÕES ───────────────────────────────────────
let modsGrauFilter = 'all';

function buildMods() {
  const cont = document.getElementById('mods-installed');
  if (!cont) return;
  if (!char.modificacoes || char.modificacoes.length === 0) {
    cont.innerHTML = '<div style="padding:24px;text-align:center;color:var(--steel-400);font-style:italic;font-size:13px">Nenhuma modificação instalada.</div>';
    document.getElementById('mods-ef-total').textContent = '0';
    return;
  }
  let efTotal = 0;
  cont.innerHTML = '';
  char.modificacoes.forEach((m, i) => {
    efTotal += m.ef || 0;
    const row = document.createElement('div');
    row.className = 'mod-installed-item';
    row.innerHTML = `
      <div>
        <div class="mod-installed-name">${m.nome}</div>
        ${m.efeito ? `<div style="font-size:11px;color:var(--smoke-dim);font-style:italic">${m.efeito}</div>` : ''}
      </div>
      <span class="badge badge-g${m.grau}">G${m.grau}</span>
      <span class="mod-ef-tag">EF +${m.ef||0}</span>
      <button class="mod-del-btn" onclick="removeMod(${i})">✕</button>
    `;
    cont.appendChild(row);
  });
  document.getElementById('mods-ef-total').textContent = efTotal;
}

function buildModsCatalog() { renderModsCatalog(); }

function renderModsCatalog() {
  const cont = document.getElementById('mods-catalog');
  if (!cont) return;
  const search = (document.getElementById('mods-search')?.value || '').toLowerCase();
  let items = GAME_DATA.allMods;
  if (modsGrauFilter !== 'all') items = items.filter(m => m.grau === parseInt(modsGrauFilter));
  if (search) items = items.filter(m => m.name.toLowerCase().includes(search) || m.efeito.toLowerCase().includes(search));

  if (items.length === 0) {
    cont.innerHTML = '<div style="padding:16px;text-align:center;color:var(--steel-400);font-size:13px">Nenhuma modificação encontrada.</div>';
    return;
  }
  cont.innerHTML = '';
  items.forEach(m => {
    const row = document.createElement('div');
    row.className = 'catalog-item';
    const alreadyHas = char.modificacoes.some(x => x.id === m.id);
    row.innerHTML = `
      <div>
        <div class="catalog-item-name">${m.name}</div>
        <div class="catalog-item-info">${m.efeito} · ${m.custo}eg · EF ${m.ef}</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        <span class="badge badge-g${m.grau}">G${m.grau}</span>
        <button class="catalog-add-btn" onclick="installMod('${m.id}')" ${alreadyHas?'style="opacity:0.4"':''}>
          ${alreadyHas ? '✓' : '+'}
        </button>
      </div>
    `;
    cont.appendChild(row);
  });
}

function installMod(id) {
  const m = GAME_DATA.allMods.find(x => x.id === id);
  if (!m) return;
  if (!char.modificacoes) char.modificacoes = [];
  char.modificacoes.push({ id:m.id, nome:m.name, grau:m.grau, ef:m.ef, efeito:m.efeito });
  buildMods();
  renderModsCatalog();
  showToast(`${m.name} instalada.`);
}

function removeMod(i) {
  char.modificacoes.splice(i, 1);
  buildMods();
  renderModsCatalog();
}

// ── INVENTÁRIO ─────────────────────────────────────────
let shopCatFilter = 'all';

function buildInventory() {
  const cont = document.getElementById('inv-list');
  if (!cont) return;
  if (!char.inventario || char.inventario.length === 0) {
    cont.innerHTML = '<div style="padding:24px;text-align:center;color:var(--steel-400);font-style:italic;font-size:13px">Inventário vazio.</div>';
    return;
  }
  cont.innerHTML = '';
  char.inventario.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'inv-item';
    row.innerHTML = `
      <div>
        <div class="inv-item-name">${item.nome}</div>
        ${item.prop ? `<div class="inv-item-prop">${item.prop}</div>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:4px">
        <button class="r-btn" onclick="changeInvQty(${i},-1)">−</button>
        <span class="inv-item-qty">${item.qty||1}</span>
        <button class="r-btn" onclick="changeInvQty(${i},1)">+</button>
      </div>
      <button class="mod-del-btn" onclick="removeInvItem(${i})">✕</button>
    `;
    cont.appendChild(row);
  });
}

function buildShop() { renderShop(); }

function renderShop() {
  const cont = document.getElementById('shop-list');
  if (!cont) return;
  const search = (document.getElementById('shop-search')?.value || '').toLowerCase();
  let items = GAME_DATA.allItems;
  if (shopCatFilter !== 'all') items = items.filter(i => i.categoria === shopCatFilter);
  if (search) items = items.filter(i => i.name.toLowerCase().includes(search));

  if (items.length === 0) {
    cont.innerHTML = '<div style="padding:16px;text-align:center;color:var(--steel-400);font-size:13px">Nenhum item encontrado.</div>';
    return;
  }
  cont.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'shop-item';
    row.innerHTML = `
      <div>
        <div style="font-size:13px">${item.name}</div>
        <div style="font-size:11px;color:var(--smoke-dim);font-style:italic">${item.props || item.def || '—'}</div>
      </div>
      <div style="text-align:right">
        ${item.dano && item.dano !== '—' ? `<div class="shop-item-dano">${item.dano}</div>` : ''}
        <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--parch-dim)">${item.preco||item.custo||0}eg</div>
        <button class="catalog-add-btn" onclick="addItemToInv('${item.id}')">+</button>
      </div>
    `;
    cont.appendChild(row);
  });
}

function addItemToInv(id) {
  const item = GAME_DATA.allItems.find(i => i.id === id);
  if (!item) return;
  if (!char.inventario) char.inventario = [];
  const existing = char.inventario.find(i => i.id === id);
  if (existing) { existing.qty = (existing.qty || 1) + 1; }
  else { char.inventario.push({ id:item.id, nome:item.name, prop:item.props||item.def||'', dano:item.dano||'', qty:1 }); }
  buildInventory();
  showToast(`${item.name} adicionado.`);
}

function changeInvQty(i, d) {
  const item = char.inventario[i];
  item.qty = Math.max(1, (item.qty || 1) + d);
  buildInventory();
}

function removeInvItem(i) {
  char.inventario.splice(i, 1);
  buildInventory();
}

function openAddItemModal() { openModal('modal-add-item'); }

function addManualItem() {
  const nome = document.getElementById('manual-item-name')?.value.trim();
  const cat  = document.getElementById('manual-item-cat')?.value;
  const qty  = parseInt(document.getElementById('manual-item-qty')?.value) || 1;
  const prop = document.getElementById('manual-item-prop')?.value.trim();
  if (!nome) return;
  if (!char.inventario) char.inventario = [];
  char.inventario.push({ id: crypto.randomUUID(), nome, prop, qty, categoria: cat });
  buildInventory();
  closeModal('modal-add-item');
  showToast(`${nome} adicionado.`);
}

// ── RECURSOS ───────────────────────────────────────────
function buildRecursos() {
  const cont = document.getElementById('recursos-grid');
  if (!cont) return;
  cont.innerHTML = '';
  RECURSOS_DEF.forEach(r => {
    const val = (char.recursos || {})[r.key] || 0;
    const cell = document.createElement('div');
    cell.className = 'recurso-cell';
    cell.innerHTML = `
      <span class="r-name">${r.label}</span>
      <div class="r-controls">
        <button class="r-btn" onclick="changeRecurso('${r.key}',-1)">−</button>
        <span class="r-num" id="r-${r.key}">${val}</span>
        <button class="r-btn" onclick="changeRecurso('${r.key}',1)">+</button>
      </div>
    `;
    cont.appendChild(cell);
  });
}

function changeRecurso(key, d) {
  if (!char.recursos) char.recursos = {};
  char.recursos[key] = Math.max(0, (char.recursos[key]||0) + d);
  const el = document.getElementById('r-' + key);
  if (el) el.textContent = char.recursos[key];
}

// ── CONTATOS ───────────────────────────────────────────
function buildContatos() {
  const cont = document.getElementById('contatos-list');
  if (!cont) return;
  cont.innerHTML = '';
  (char.contatos || []).forEach((c, ci) => {
    const card = document.createElement('div');
    card.className = 'contato-card';
    card.innerHTML = `
      <div class="contato-card-header">
        <div class="contato-card-name">${c.nome}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="favor-dots">
            ${[0,1,2].map(fi=>`<div class="favor-dot ${(c.favores||0)>fi?'on':''}" onclick="setFavor(${ci},${fi})"></div>`).join('')}
          </div>
          <button class="mod-del-btn" onclick="removeContato(${ci})">✕</button>
        </div>
      </div>
      ${c.info ? `<div style="font-size:12px;color:var(--smoke-dim);font-style:italic">${c.info}</div>` : ''}
    `;
    cont.appendChild(card);
  });
}

function setFavor(ci, fi) {
  const c = char.contatos[ci];
  c.favores = (c.favores||0) > fi ? fi : fi+1;
  buildContatos();
}

function addContato() {
  const nome = document.getElementById('ct-nome')?.value.trim();
  const info = document.getElementById('ct-info')?.value.trim();
  if (!nome) return;
  if (!char.contatos) char.contatos = [];
  char.contatos.push({ nome, info, favores:0 });
  document.getElementById('ct-nome').value = '';
  document.getElementById('ct-info').value = '';
  buildContatos();
}

function removeContato(i) {
  char.contatos.splice(i, 1);
  buildContatos();
}

// ── FILTER BARS ────────────────────────────────────────
function setupFilterBars() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const bar = btn.closest('[id$="-filter-bar"]');
    if (!bar) return;
    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const barId = bar.id;
    if (barId === 'mods-filter-bar') {
      modsGrauFilter = btn.dataset.grau;
      renderModsCatalog();
    }
    if (barId === 'shop-filter-bar') {
      shopCatFilter = btn.dataset.cat;
      renderShop();
    }
  });
}

// ── MODALS ─────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
  }
});

// ── AUTH ───────────────────────────────────────────────
let authMode = 'login';
function openAuthModal() { openModal('modal-auth'); }
function switchAuthMode(mode) {
  authMode = mode;
  document.getElementById('tab-login-btn')?.classList.toggle('active', mode === 'login');
  document.getElementById('tab-register-btn')?.classList.toggle('active', mode === 'register');
}

async function doAuth() {
  if (!USE_SUPABASE || !supabaseClient) {
    showToast('Configure o Supabase para usar contas.');
    closeModal('modal-auth');
    return;
  }
  const email = document.getElementById('auth-email')?.value;
  const pass  = document.getElementById('auth-pass')?.value;
  const errEl = document.getElementById('auth-error');
  if (errEl) errEl.style.display = 'none';

  try {
    let result;
    if (authMode === 'register') {
      result = await supabaseClient.auth.signUp({ email, password:pass });
    } else {
      result = await supabaseClient.auth.signInWithPassword({ email, password:pass });
    }
    if (result.error) throw result.error;
    closeModal('modal-auth');
    showToast(authMode === 'register' ? 'Conta criada!' : 'Bem-vindo!');
  } catch(err) {
    if (errEl) { errEl.textContent = err.message; errEl.style.display = 'block'; }
  }
}

function updateAuthBar() {
  const dot = document.getElementById('auth-dot');
  const lbl = document.getElementById('auth-label');
  if (appState.user) {
    if (dot) { dot.classList.remove('offline'); }
    if (lbl) lbl.textContent = appState.user.email;
  } else {
    if (dot) dot.classList.add('offline');
    if (lbl) lbl.textContent = 'Modo local — fichas salvas no navegador';
  }
}

// ── SUPABASE SYNC ──────────────────────────────────────
async function syncFromSupabase() {
  if (!supabaseClient || !appState.user) return;
  try {
    const { data, error } = await supabaseClient
      .from('characters').select('*').eq('user_id', appState.user.id);
    if (error) throw error;
    if (data && data.length > 0) {
      appState.characters = data.map(row => row.data);
      saveAppState();
      renderMenu();
    }
  } catch(e) { console.warn('Sync error:', e); }
}

async function syncCharToSupabase(c) {
  if (!supabaseClient || !appState.user) return;
  try {
    await supabaseClient.from('characters').upsert({
      id: c.id,
      user_id: appState.user.id,
      name: c.nome || 'Sem nome',
      data: c,
      updated_at: new Date().toISOString(),
    });
  } catch(e) { console.warn('Sync error:', e); }
}

// ── TOAST ──────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}
