// ═══════════════════════════════════════════════════════
// MACULADOS PELO METAL — App Logic v2
// ═══════════════════════════════════════════════════════

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

// ── DEFAULT STATE ──────────────────────────────────────
function defaultChar(id) {
  const c = {
    id: id || crypto.randomUUID(),
    nome:'', apelido:'', origem:'', aparencia:'', moradia:'', detalhe:'',
    arqueamento:'', convergencia:'', nivel:1, stChoices:{},
    profissao:'', reputacao:1, contato_init:'',
    pv_max:16, pv_cur:16, cv_max:0, cv_cur:0,
    exaustao:0, ef:0,
    atributos:{ vig:1, des:1, for:1, raz:1, ins:1, pre:1 },
    pericias:{},
    ancoras:[{texto:'',quebrada:false},{texto:'',quebrada:false},{texto:'',quebrada:false}],
    modificacoes:[], inventario:[],
    recursos:{ sucata:0, reagente:0, organico:0, vapor:0, eletrico:0, resto:0 },
    contatos:[], equipamento:'', notas:'', conexoes:'',
  };
  Object.values(PERICIAS_DEF).flat().forEach(p => { c.pericias[p.key] = 'd12'; });
  return c;
}

// ── APP STATE ──────────────────────────────────────────
let appState = { characters:[], currentId:null };
let char = null;

// ── INIT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadAppState();
  setupTabs();
  setupFilterBars();
  renderMenu();
  showView('menu');

  // Save btn flash
  document.querySelectorAll('[onclick="saveSheet()"]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('saving');
      setTimeout(() => btn.classList.remove('saving'), 600);
    });
  });
});

// ── VIEWS ──────────────────────────────────────────────
function showView(name) {
  document.getElementById('view-menu').classList.toggle('active', name === 'menu');
  document.getElementById('view-sheet').classList.toggle('active', name === 'sheet');
}

function goToMenu() {
  if (char) { collectTextFields(); saveCurrentChar(); }
  char = null; appState.currentId = null;
  renderMenu(); showView('menu');
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
    empty.style.cssText = 'grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--steel-400)';
    empty.innerHTML = `<div style="font-size:2.5rem;margin-bottom:12px;opacity:0.3">⚙</div><div style="font-size:14px">Nenhuma ficha criada ainda.</div>`;
    grid.appendChild(empty);
    return;
  }

  appState.characters.forEach(c => {
    const card = document.createElement('div');
    card.className = 'char-card';
    const ef = c.ef || 0;
    card.innerHTML = `
      <div class="char-card-actions">
        <button class="btn btn-icon btn-danger btn-sm" onclick="event.stopPropagation();deleteChar('${c.id}')" title="Excluir ficha">✕</button>
      </div>
      <div class="char-card-arq">${c.arqueamento || 'Sem arqueamento'} · Nível ${c.nivel || 1}</div>
      <div class="char-card-name">${c.nome || 'Sem nome'}</div>
      <div class="char-card-stats">
        <div class="char-card-stat">
          <span class="char-card-stat-val">${c.pv_cur||0}/${c.pv_max||16}</span>
          <span class="char-card-stat-lbl">PV</span>
        </div>
        <div class="char-card-stat">
          <span class="char-card-stat-val" style="color:${ef>15?'var(--rust)':ef>5?'var(--brass)':'var(--smoke-300)'}">${ef}</span>
          <span class="char-card-stat-lbl">EF</span>
        </div>
        <div class="char-card-stat">
          <span class="char-card-stat-val">${(c.profissao||'—').split(' ')[0]}</span>
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
  char = JSON.parse(JSON.stringify(found));
  if (!char.stChoices)  char.stChoices  = {};
  if (!char.inventario) char.inventario = [];
  appState.currentId = id;
  buildSheet();
  showView('sheet');
}

function deleteChar(id) {
  const c = appState.characters.find(x => x.id === id);
  const name = c?.nome || 'esta ficha';
  if (!confirm(`Excluir "${name}" permanentemente? Esta ação não pode ser desfeita.`)) return;
  appState.characters = appState.characters.filter(c => c.id !== id);
  saveAppState();
  renderMenu();
  showToast('Ficha excluída.');
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

  // Migration from old single-char format
  try {
    const old = localStorage.getItem('maculados_ficha');
    if (old && appState.characters.length === 0) {
      const c = { ...defaultChar(), ...JSON.parse(old) };
      if (!c.id) c.id = crypto.randomUUID();
      if (!c.inventario) c.inventario = [];
      if (!c.stChoices)  c.stChoices  = {};
      appState.characters.push(c);
      saveAppState();
      localStorage.removeItem('maculados_ficha');
    }
  } catch(e) {}
}

function saveAppState() {
  try { localStorage.setItem('maculados_app', JSON.stringify({ characters: appState.characters })); }
  catch(e) { console.error('Save error:', e); }
}

function saveCurrentChar() {
  if (!char || !appState.currentId) return;
  const idx = appState.characters.findIndex(c => c.id === appState.currentId);
  if (idx >= 0) appState.characters[idx] = JSON.parse(JSON.stringify(char));
  saveAppState();
}

function saveSheet() {
  collectTextFields();
  saveCurrentChar();
  showToast('Ficha salva.');
  updateTopbarName();
}

function collectTextFields() {
  if (!char) return;
  ['nome','apelido','origem','aparencia','moradia','detalhe','convergencia','contato_init','equipamento','notas','conexoes']
    .forEach(f => { const el = document.getElementById(f); if (el) char[f] = el.value; });
  ['arqueamento','profissao']
    .forEach(f => { const el = document.getElementById(f); if (el) char[f] = el.value; });
  document.querySelectorAll('#ancoras-list .ancora-row input').forEach((inp, i) => {
    if (char.ancoras[i]) char.ancoras[i].texto = inp.value;
  });
}

setInterval(() => { if (char) { collectTextFields(); saveCurrentChar(); } }, 45000);

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
  renderModsCatalog();
  buildInventory();
  renderShop();
  buildRecursos();
  buildContatos();
  buildNivelPips();
  buildRepGears();
  updateArqDesc();
  restoreTextFields();
  buildSkillTree();
}

function restoreTextFields() {
  ['nome','apelido','origem','aparencia','moradia','detalhe','convergencia','contato_init','equipamento','notas','conexoes']
    .forEach(f => { const el = document.getElementById(f); if (el && char[f] !== undefined) el.value = char[f]; });
  ['arqueamento','profissao']
    .forEach(f => { const el = document.getElementById(f); if (el) el.value = char[f] || ''; });
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
  if (arqEl)  arqEl.textContent  = char.arqueamento ? `${char.arqueamento} · Nível ${char.nivel||1}` : '— sem arqueamento —';
  const nomeEl = document.getElementById('nome');
  if (nomeEl) nomeEl.oninput = () => {
    char.nome = nomeEl.value;
    updateTopbarName();
    if (nameEl) nameEl.textContent = char.nome || 'Novo Personagem';
  };
}

// ── TABS ───────────────────────────────────────────────
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + tab));
      if (tab === 'arqueamento' && char) buildSkillTree();
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
  buildSkillTree();
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
    pip.onclick = () => { char.nivel = i; buildNivelPips(); buildSkillTree(); };
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
  const cur = char.pv_cur != null ? char.pv_cur : max;
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
  const ef = char.ef || 0;
  const numEl = document.getElementById('ef-num');
  const barEl = document.getElementById('ef-bar');
  const stsEl = document.getElementById('ef-status');
  const fxEl  = document.getElementById('ef-effect');
  if (numEl) numEl.textContent = ef;
  if (barEl) barEl.style.width = Math.min(100, (ef / 21) * 100) + '%';
  const tier = EF_TIERS.find(t => ef <= t.max) || EF_TIERS[EF_TIERS.length-1];
  if (stsEl) { stsEl.className = 'ef-status-badge ' + tier.cls; stsEl.textContent = tier.label; }
  if (fxEl)  fxEl.textContent = tier.fx;
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
    const filled = (char.exaustao || 0) > i;
    const pip = document.createElement('div');
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
    row.className = 'mod-installed-item has-tooltip';
    row.innerHTML = `
      <div>
        <div class="mod-installed-name">${m.nome}</div>
        ${m.efeito ? `<div style="font-size:11px;color:var(--smoke-dim);font-style:italic">${m.efeito}</div>` : ''}
      </div>
      <span class="badge badge-g${m.grau}">G${m.grau}</span>
      <span class="mod-ef-tag">EF +${m.ef||0}</span>
      <button class="mod-del-btn" onclick="removeMod(${i})">✕</button>
      ${makeInstalledModTooltip(m)}
    `;
    cont.appendChild(row);
  });
  document.getElementById('mods-ef-total').textContent = efTotal;
}

function makeInstalledModTooltip(m) {
  const full = GAME_DATA.allMods.find(x => x.id === m.id);
  if (!full) return `<div class="tooltip"><div class="tooltip-name">${m.nome}</div><div class="tooltip-row"><span class="tooltip-tag">Efeito</span><span class="tooltip-val">${m.efeito||'—'}</span></div></div>`;
  return makeModTooltip(full);
}

function renderModsCatalog() {
  const cont = document.getElementById('mods-catalog');
  if (!cont) return;
  const search = (document.getElementById('mods-search')?.value || '').toLowerCase();
  let items = GAME_DATA.allMods;
  if (modsGrauFilter !== 'all') items = items.filter(m => m.grau === parseInt(modsGrauFilter));
  if (search) items = items.filter(m => m.name.toLowerCase().includes(search) || (m.efeito||'').toLowerCase().includes(search));

  if (items.length === 0) {
    cont.innerHTML = '<div style="padding:16px;text-align:center;color:var(--steel-400);font-size:13px">Nenhuma modificação encontrada.</div>';
    return;
  }
  cont.innerHTML = '';
  items.forEach(m => {
    const alreadyHas = char && char.modificacoes && char.modificacoes.some(x => x.id === m.id);
    const row = document.createElement('div');
    row.className = 'catalog-item has-tooltip';
    row.innerHTML = `
      <div>
        <div class="catalog-item-name">${m.name}</div>
        <div class="catalog-item-info">${m.efeito} · ${m.custo}eg</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
        <span class="badge badge-g${m.grau}">G${m.grau}</span>
        <button class="catalog-add-btn" onclick="installMod('${m.id}')" ${alreadyHas?'style="opacity:0.4"':''}>
          ${alreadyHas ? '✓' : '+'}
        </button>
      </div>
      ${makeModTooltip(m)}
    `;
    cont.appendChild(row);
  });
}

function makeModTooltip(m) {
  return `
    <div class="tooltip tooltip-left">
      <div class="tooltip-name">${m.name}</div>
      <div class="tooltip-row"><span class="tooltip-tag">Efeito</span><span class="tooltip-val">${m.efeito||'—'}</span></div>
      ${m.desvantagem ? `<div class="tooltip-row"><span class="tooltip-tag">Desvantagem</span><span class="tooltip-val warn">${m.desvantagem}</span></div>` : ''}
      <div class="tooltip-row"><span class="tooltip-tag">Manutenção</span><span class="tooltip-val ${m.manutencao==='Nenhuma'?'ok':''}">${m.manutencao||'—'}</span></div>
      <div class="tooltip-row"><span class="tooltip-tag">Custo</span><span class="tooltip-val">${m.custo}eg · EF ${m.ef} · ${m.pts} pt${m.pts>1?'s':''}</span></div>
    </div>`;
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
    row.className = 'shop-item has-tooltip';
    row.innerHTML = `
      <div>
        <div style="font-size:13px">${item.name}</div>
        <div style="font-size:11px;color:var(--smoke-dim);font-style:italic">${(item.props||item.def||'—').slice(0,50)}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        ${item.dano && item.dano !== '—' ? `<div class="shop-item-dano">${item.dano}</div>` : ''}
        <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--parch-dim)">${item.preco||item.custo||0}eg</div>
        <button class="catalog-add-btn" onclick="addItemToInv('${item.id}')">+</button>
      </div>
      ${makeItemTooltip(item)}
    `;
    cont.appendChild(row);
  });
}

function makeItemTooltip(item) {
  return `
    <div class="tooltip tooltip-left">
      <div class="tooltip-name">${item.name}</div>
      ${item.dano && item.dano !== '—' ? `<div class="tooltip-row"><span class="tooltip-tag">Dano</span><span class="tooltip-val" style="color:var(--copper)">${item.dano}</span></div>` : ''}
      <div class="tooltip-row"><span class="tooltip-tag">Propriedades</span><span class="tooltip-val">${item.props||item.def||'—'}</span></div>
      <div class="tooltip-row"><span class="tooltip-tag">Preço</span><span class="tooltip-val">${item.preco||item.custo||0} eg</span></div>
      ${item.tipo ? `<div class="tooltip-row"><span class="tooltip-tag">Tipo</span><span class="tooltip-val">${item.tipo}</span></div>` : ''}
    </div>`;
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
  char.inventario.push({ id:crypto.randomUUID(), nome, prop, qty, categoria:cat });
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
    const val = (char.recursos||{})[r.key] || 0;
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
  (char.contatos||[]).forEach((c, ci) => {
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
  char.contatos[ci].favores = (char.contatos[ci].favores||0) > fi ? fi : fi+1;
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
    if (bar.id === 'mods-filter-bar')  { modsGrauFilter = btn.dataset.grau; renderModsCatalog(); }
    if (bar.id === 'shop-filter-bar')  { shopCatFilter  = btn.dataset.cat;  renderShop(); }
  });
}

// ── MODALS ─────────────────────────────────────────────
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-backdrop')) e.target.classList.remove('open');
});

// ── AUTH (stub — replaced by local) ──────────────────
function openAuthModal() { openModal('modal-io'); }
function switchAuthMode() {}
async function doAuth() {}

// ── EXPORT / IMPORT ────────────────────────────────────
function exportChars() {
  const data = { version:'3.0', exported:new Date().toISOString(), characters:appState.characters };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `maculados-fichas-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  showToast('Fichas exportadas.');
}

function importChars(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      const imported = data.characters || (Array.isArray(data) ? data : []);
      if (!imported.length) throw new Error('Nenhuma ficha encontrada no arquivo.');
      let added = 0;
      imported.forEach(c => {
        if (!c.id) c.id = crypto.randomUUID();
        if (!appState.characters.find(x => x.id === c.id)) {
          if (!c.inventario) c.inventario = [];
          if (!c.stChoices)  c.stChoices  = {};
          appState.characters.push(c);
          added++;
        }
      });
      saveAppState(); renderMenu();
      const s = document.getElementById('io-status');
      if (s) { s.style.display='block'; s.style.color='var(--green-ok)'; s.textContent=`${added} ficha(s) importada(s).`; }
      showToast(`${added} ficha(s) importada(s).`);
    } catch(err) {
      const s = document.getElementById('io-status');
      if (s) { s.style.display='block'; s.style.color='var(--rust)'; s.textContent='Erro: '+err.message; }
    }
    input.value = '';
  };
  reader.readAsText(file);
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

// ═══════════════════════════════════════════════════════
// SKILL TREE
// ═══════════════════════════════════════════════════════

function buildSkillTree() {
  const cont = document.getElementById('skilltree-container');
  if (!cont || !char) return;
  const arq = char.arqueamento;
  if (!arq || !SKILL_TREES[arq]) {
    cont.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:var(--steel-400)">
        <div style="font-size:3rem;margin-bottom:16px;opacity:0.2">⚙</div>
        <div style="font-family:var(--font-heading);font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">
          Escolha um Arqueamento na aba Identidade
        </div>
        <div style="font-size:13px;margin-top:8px;font-style:italic">
          A skill tree aparecerá aqui
        </div>
      </div>`;
    return;
  }

  if (!char.stChoices) char.stChoices = {};
  const nodes  = SKILL_TREES[arq];
  const nivel  = char.nivel || 1;
  const conv   = char.stChoices[arq + '_conv'] || null;
  const layout = document.createElement('div');
  layout.className = 'skilltree-layout';

  // Group nodes by level
  const byLevel = {};
  nodes.forEach(n => { if (!byLevel[n.level]) byLevel[n.level] = []; byLevel[n.level].push(n); });
  const levels = [...new Set(nodes.map(n => n.level))].sort((a,b) => a-b);

  levels.forEach((lv, idx) => {
    // Vertical connector
    if (idx > 0) {
      const conn = document.createElement('div');
      conn.style.cssText = `width:2px;height:20px;margin:0 auto;background:${nivel>=lv?'var(--brass-dim)':'var(--steel-600)'};transition:background 0.4s;`;
      layout.appendChild(conn);
    }

    const lvBlock = document.createElement('div');
    lvBlock.className = 'st-level-block';

    const badge = document.createElement('div');
    badge.className = 'st-level-badge' + (nivel >= lv ? ' unlocked' : '');
    badge.textContent = `Nível ${lv}`;
    lvBlock.appendChild(badge);

    const rowNodes = byLevel[lv];
    const unlocked = nivel >= lv;

    rowNodes.forEach(node => {
      // Skip nodes from a different convergence branch
      if (node.conv && node.conv !== conv) return;

      if (node.type === 'convergence') {
        renderST_Convergence(node, unlocked, conv, arq, lvBlock);
      } else if (node.type === 'calibration') {
        renderST_Calibration(node, unlocked, conv, arq, lvBlock);
      } else {
        renderST_Identity(node, unlocked, lvBlock);
      }
    });

    layout.appendChild(lvBlock);
  });

  cont.innerHTML = '';
  cont.appendChild(layout);
}

function renderST_Identity(node, unlocked, parent) {
  const div = document.createElement('div');
  div.className = 'st-node ' + node.type + (unlocked ? ' unlocked' : ' locked');
  if (node.type === 'apotheosis') div.classList.add('apotheosis');
  div.innerHTML = `
    <div class="st-node-type ${node.type}">${stTypeLabel(node.type)}</div>
    <div class="st-node-title">${node.title}</div>
    <div class="st-node-desc">${node.desc}</div>
    <div class="st-lock">${unlocked ? '✦' : '🔒'}</div>
  `;
  parent.appendChild(div);
}

function renderST_Calibration(node, unlocked, conv, arq, parent) {
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';

  const label = document.createElement('div');
  label.className = 'st-node-type calibration';
  label.style.cssText = 'text-align:center;margin-bottom:8px;';
  label.textContent = `Calibração — Escolha ${node.multi ? node.count||2 : 1}`;
  wrapper.appendChild(label);

  const grid = document.createElement('div');
  grid.className = 'st-options';

  const chosenKey = arq + '_' + node.id;
  const chosen = char.stChoices[chosenKey] || (node.multi ? [] : null);
  const chosenArr = node.multi ? (Array.isArray(chosen) ? chosen : []) : [];
  const maxReached = node.multi ? chosenArr.length >= (node.count||2) : !!chosen;

  node.options.forEach(opt => {
    const isChosen = node.multi ? chosenArr.includes(opt.id) : chosen === opt.id;
    const isUnchosen = !isChosen && maxReached;

    const div = document.createElement('div');
    div.className = 'st-option' + (!unlocked ? ' locked' : isChosen ? ' chosen' : isUnchosen ? ' unchosen' : ' available');
    div.innerHTML = `
      <div class="st-option-title">${opt.title}${isChosen ? '<span class="st-chosen-badge">✦</span>' : ''}</div>
      <div class="st-option-desc">${opt.desc}</div>
    `;

    if (unlocked) {
      if (isChosen) {
        div.style.cursor = 'pointer';
        div.title = 'Clique para desmarcar';
        div.onclick = () => {
          if (node.multi) {
            char.stChoices[chosenKey] = chosenArr.filter(x => x !== opt.id);
          } else {
            delete char.stChoices[chosenKey];
          }
          buildSkillTree();
        };
      } else if (!isUnchosen) {
        div.style.cursor = 'pointer';
        div.onclick = () => {
          if (node.multi) {
            const arr = Array.isArray(char.stChoices[chosenKey]) ? char.stChoices[chosenKey] : [];
            arr.push(opt.id);
            char.stChoices[chosenKey] = arr;
          } else {
            char.stChoices[chosenKey] = opt.id;
          }
          buildSkillTree();
        };
      }
    }
    grid.appendChild(div);
  });

  wrapper.appendChild(grid);
  parent.appendChild(wrapper);
}

function renderST_Convergence(node, unlocked, conv, arq, parent) {
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';

  const label = document.createElement('div');
  label.className = 'st-convergence-label';
  label.textContent = '⊕ Convergência — Escolha seu Caminho ⊕';
  wrapper.appendChild(label);

  const grid = document.createElement('div');
  grid.className = 'st-options';
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';

  node.options.forEach(opt => {
    const isChosen = conv === opt.id;
    const otherChosen = conv && conv !== opt.id;

    const div = document.createElement('div');
    div.className = 'st-option convergence-opt' + (!unlocked ? ' locked' : isChosen ? ' chosen' : otherChosen ? ' unchosen' : ' available');
    div.innerHTML = `
      <div class="st-option-title">${opt.title}${isChosen ? '<span class="st-chosen-badge">✦</span>' : ''}</div>
      <div class="st-option-desc">${opt.desc}</div>
    `;

    if (unlocked && !otherChosen) {
      div.style.cursor = 'pointer';
      div.onclick = () => {
        if (isChosen) {
          delete char.stChoices[arq + '_conv'];
          char.convergencia = '';
          const el = document.getElementById('convergencia');
          if (el) el.value = '';
        } else {
          char.stChoices[arq + '_conv'] = opt.id;
          char.convergencia = opt.title;
          const el = document.getElementById('convergencia');
          if (el) el.value = opt.title;
        }
        buildSkillTree();
      };
    }
    grid.appendChild(div);
  });

  wrapper.appendChild(grid);
  parent.appendChild(wrapper);
}

function stTypeLabel(t) {
  return { identity:'Habilidade de Identidade', calibration:'Calibração', convergence:'Convergência', apotheosis:'Apoteose — Nível 10' }[t] || t;
}
