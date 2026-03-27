// ─── DATA ──────────────────────────────────────────────────────────────────────
const ATTRS = [
  { key:'vig', label:'Vigor',    abbr:'VIG', desc:'Força bruta, ossos e músculos' },
  { key:'des', label:'Destreza', abbr:'DES', desc:'Reflexos e precisão motora' },
  { key:'for', label:'Fortitude',abbr:'FOR', desc:'Resistência a doenças e fadiga' },
  { key:'raz', label:'Razão',    abbr:'RAZ', desc:'Memória, lógica e conhecimento' },
  { key:'ins', label:'Instinto', abbr:'INS', desc:'Percepção e intuição' },
  { key:'pre', label:'Presença', abbr:'PRE', desc:'Personalidade e conexão humana' },
];

const PERICIAS = {
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

const DICE_OPTIONS = [
  {val:'d12', label:'d12 — Inapto'},
  {val:'d10', label:'d10 — Competente'},
  {val:'d8',  label:'d8  — Graduado'},
  {val:'d6',  label:'d6  — Especialista'},
  {val:'d4',  label:'d4  — Mestre'},
];

const ARQ_DESCS = {
  'Fortificado': 'Seu corpo virou fortaleza. Cada placa instalada, cada pistão, cada válvula de pressão é uma declaração: você não vai cair.',
  'Tecnocrata':  'Você não modificou seu corpo. Você o atualizou. A diferença parece importante até você não conseguir mais lembrar o rosto da sua mãe.',
  'Rastejador':  'O silêncio não é ausência de som — é presença de controle. Cada articulação silenciada, cada passo que não existe.',
  'Carniceiro':  'Você não aprendeu a lutar. Você aprendeu a não parar. Lutadores param quando vencem. Você para quando não há mais nada se movendo.',
  'Quimera':     'Suas modificações não fazem sentido juntas. Você trava, falha sem aviso. Mas também faz coisas que não deveriam ser possíveis.',
  'Imaculado':   'Em um mundo de deuses de metal, você permanece carne e sangue. Frágil. Mortal. Humano. Quando você fala, as pessoas lembram o que perderam.',
};

const EF_DATA = [
  {max:5,  label:'Humano',      cls:'ef-s0', effect:'Nenhum benefício, nenhum custo. Você ainda é quem era.'},
  {max:10, label:'Processando', cls:'ef-s1', effect:'+1d8 em testes técnicos e analíticos. Conversas casuais ficam estranhas — você não sabe mais quando rir.'},
  {max:15, label:'Suprimido',   cls:'ef-s2', effect:'+1d8 para resistir dor, medo e manipulação. Para sentir alegria ou compaixão é preciso um teste de PRE QS 2.'},
  {max:20, label:'Frio',        cls:'ef-s3', effect:'+1d4 em combate. Você vê pessoas como unidades. Agir moralmente sem lógica requer PRE QS 3.'},
  {max:99, label:'Dissolução',  cls:'ef-s4', effect:'+2d4 em tudo técnico e de combate. Ignora 1 nível de Exaustão. Mas algo essencial está desaparecendo.'},
];

const EX_LABELS = [
  'Descansado',
  'Desvantagem em atributos',
  'Deslocamento pela metade',
  'Desvantagem em ataques',
  'PV máximo reduzido',
  'Deslocamento zero',
  'MORTE',
];

const REP_LABELS = ['','Desconhecido','Reconhecido','Respeitado','Influente','Referência'];

const RECURSOS_DEF = [
  {key:'sucata',   label:'Sucata Metálica'},
  {key:'reagente', label:'Reagente Químico'},
  {key:'organico', label:'Composto Orgânico'},
  {key:'vapor',    label:'Carga de Vapor'},
  {key:'eletrico', label:'Comp. Elétrico'},
  {key:'resto',    label:'Restos'},
];

// ─── STATE ─────────────────────────────────────────────────────────────────────
let state = {
  nome:'', apelido:'', origem:'', aparencia:'', moradia:'', detalhe:'',
  arqueamento:'', convergencia:'', nivel:1,
  profissao:'', reputacao:1, contato_init:'',
  pv_max:16, pv_cur:16,
  cv_max:0, cv_cur:0,
  exaustao:0,
  ef:0,
  atributos:{ vig:1, des:1, for:1, raz:1, ins:1, pre:1 },
  pericias:{},
  ancoras:[
    {texto:'', quebrada:false},
    {texto:'', quebrada:false},
    {texto:'', quebrada:false},
  ],
  modificacoes:[],
  recursos:{ sucata:0, reagente:0, organico:0, vapor:0, eletrico:0, resto:0 },
  contatos:[],
  equipamento:'',
  notas:'',
};

// ─── INIT ───────────────────────────────────────────────────────────────────────
function init() {
  const saved = localStorage.getItem('maculados_ficha');
  if (saved) {
    try { state = { ...state, ...JSON.parse(saved) }; } catch(e) { console.warn('Erro ao carregar ficha:', e); }
  }

  // Garante que todas as perícias existem no state
  Object.values(PERICIAS).flat().forEach(p => {
    if (!state.pericias[p.key]) state.pericias[p.key] = 'd12';
  });

  buildAll();
  restoreTextInputs();
  bindTextListeners();
}

function buildAll() {
  buildAtributos();
  buildPericias();
  buildEF();
  buildPV();
  buildExaustao();
  buildCVPips();
  buildAncoras();
  buildMods();
  buildRecursos();
  buildContatos();
  buildNivelPips();
  buildRepStars();
  updateArqDesc();
}

function restoreTextInputs() {
  const textFields = [
    'nome','apelido','origem','aparencia','moradia','detalhe',
    'convergencia','contato_init','equipamento','notas',
  ];
  textFields.forEach(f => {
    const el = document.getElementById(f);
    if (el && state[f] !== undefined) el.value = state[f];
  });

  const selectFields = ['arqueamento','profissao'];
  selectFields.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.value = state[f] || '';
  });

  const pvMax = document.getElementById('pv-max');
  if (pvMax) pvMax.value = state.pv_max;

  const cvMax = document.getElementById('cv-max');
  if (cvMax) cvMax.value = state.cv_max;
}

// ─── TEXT INPUT BINDING ─────────────────────────────────────────────────────────
function bindTextListeners() {
  const textFields = [
    'nome','apelido','origem','aparencia','moradia','detalhe',
    'convergencia','contato_init','equipamento','notas',
  ];
  textFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => { state[id] = el.value; });
  });

  const selects = ['arqueamento','profissao'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', () => {
      state[id] = el.value;
      if (id === 'arqueamento') updateArqDesc();
    });
  });

  const pvMaxEl = document.getElementById('pv-max');
  if (pvMaxEl) pvMaxEl.addEventListener('input', () => {
    state.pv_max = parseInt(pvMaxEl.value) || 16;
    if (state.pv_cur > state.pv_max) state.pv_cur = state.pv_max;
    updatePV();
  });

  const cvMaxEl = document.getElementById('cv-max');
  if (cvMaxEl) cvMaxEl.addEventListener('input', () => {
    state.cv_max = parseInt(cvMaxEl.value) || 0;
    if (state.cv_cur > state.cv_max) state.cv_cur = state.cv_max;
    buildCVPips();
  });
}

// ─── ATRIBUTOS ──────────────────────────────────────────────────────────────────
function buildAtributos() {
  const cont = document.getElementById('atributos');
  if (!cont) return;
  cont.innerHTML = '';

  ATTRS.forEach(a => {
    const val = state.atributos[a.key] || 1;
    const div = document.createElement('div');
    div.className = 'attr-block';
    div.innerHTML = `
      <div class="attr-name">${a.abbr}</div>
      <div class="attr-pips">
        ${[1,2,3,4].map(i => `
          <div class="pip ${val >= i ? 'filled' : ''}"
               onclick="setAttr('${a.key}', ${i})"></div>
        `).join('')}
      </div>
      <div class="attr-value">${val}</div>
      <div class="attr-desc">${a.desc}</div>
    `;
    cont.appendChild(div);
  });

  updatePtsUsed();
}

function setAttr(key, val) {
  state.atributos[key] = val;
  buildAtributos();
}

function updatePtsUsed() {
  const total = Object.values(state.atributos).reduce((a, b) => a + b, 0) - 6;
  const el = document.getElementById('pts-used');
  if (!el) return;
  el.textContent = total;
  if (total === 5)      el.style.color = 'var(--brass)';
  else if (total > 5)   el.style.color = 'var(--rust)';
  else                  el.style.color = 'var(--copper)';
}

// ─── PERÍCIAS ───────────────────────────────────────────────────────────────────
function buildPericiasIn(data, containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  cont.innerHTML = '';

  data.forEach(p => {
    const val = state.pericias[p.key] || 'd12';
    const row = document.createElement('div');
    row.className = 'pericia-row';
    row.innerHTML = `
      <div class="pericia-name ${p.special ? 'special' : ''}">${p.label}</div>
      <div class="dice-badge ${val}">${val}</div>
      <select class="dice-select" onchange="setPericia('${p.key}', this.value)">
        ${DICE_OPTIONS.map(o => `
          <option value="${o.val}" ${val === o.val ? 'selected' : ''}>${o.val}</option>
        `).join('')}
      </select>
    `;
    cont.appendChild(row);
  });
}

function buildPericias() {
  buildPericiasIn(PERICIAS.fisicas,  'pericias-fisicas');
  buildPericiasIn(PERICIAS.tecnicas, 'pericias-tecnicas');
  buildPericiasIn(PERICIAS.mentais,  'pericias-mentais');
  buildPericiasIn(PERICIAS.sociais,  'pericias-sociais');
}

function setPericia(key, val) {
  state.pericias[key] = val;
  buildPericias();
}

// ─── ARQUEAMENTO ────────────────────────────────────────────────────────────────
function updateArqDesc() {
  const val = (document.getElementById('arqueamento') || {}).value || state.arqueamento;
  state.arqueamento = val;
  const desc = document.getElementById('arq-desc');
  if (desc) desc.textContent = ARQ_DESCS[val] || 'Escolha um arqueamento para ver sua descrição.';
}

function buildNivelPips() {
  const cont = document.getElementById('nivel-pips');
  const num  = document.getElementById('nivel-num');
  if (!cont || !num) return;
  cont.innerHTML = '';
  const nivel = state.nivel || 1;
  num.textContent = nivel;

  for (let i = 1; i <= 10; i++) {
    const pip = document.createElement('div');
    pip.className = 'nivel-pip' + (nivel >= i ? ' filled' : '');
    pip.onclick = () => { state.nivel = i; buildNivelPips(); };
    cont.appendChild(pip);
  }
}

// ─── REPUTAÇÃO ──────────────────────────────────────────────────────────────────
function buildRepStars() {
  const cont = document.getElementById('rep-stars');
  const num  = document.getElementById('rep-num');
  const lbl  = document.getElementById('rep-label');
  if (!cont) return;

  cont.innerHTML = '';
  const r = state.reputacao || 1;
  if (num) num.textContent = r;
  if (lbl) lbl.textContent = REP_LABELS[r] || '';

  for (let i = 1; i <= 5; i++) {
    const s = document.createElement('div');
    s.className = 'rep-star' + (r >= i ? ' filled' : '');
    s.textContent = '⚙';
    s.onclick = () => { state.reputacao = i; buildRepStars(); };
    cont.appendChild(s);
  }
}

// ─── PONTOS DE VIDA ─────────────────────────────────────────────────────────────
function updatePV() {
  const max = state.pv_max || 16;
  if (state.pv_cur > max) state.pv_cur = max;
  if (state.pv_cur < 0)   state.pv_cur = 0;

  const pct = Math.max(0, Math.min(100, (state.pv_cur / max) * 100));

  const cur     = document.getElementById('pv-cur');
  const maxDisp = document.getElementById('pv-max-disp');
  const bar     = document.getElementById('pv-bar');

  if (cur)     cur.textContent = state.pv_cur;
  if (maxDisp) maxDisp.textContent = max;
  if (bar)     bar.style.width = pct + '%';

  if (cur) {
    if (state.pv_cur <= 0)  cur.style.color = 'var(--rust)';
    else if (pct < 30)      cur.style.color = 'var(--copper)';
    else                    cur.style.color = 'var(--copper)';
  }
}

function buildPV() {
  updatePV();
}

function damagePV() {
  const d = parseInt((document.getElementById('pv-delta') || {}).value) || 1;
  state.pv_cur = Math.max(0, (state.pv_cur || 0) - d);
  updatePV();
}

function healPV() {
  const d = parseInt((document.getElementById('pv-delta') || {}).value) || 1;
  state.pv_cur = Math.min(state.pv_max, (state.pv_cur || 0) + d);
  updatePV();
}

// ─── EXAUSTÃO ────────────────────────────────────────────────────────────────────
function buildExaustao() {
  const cont = document.getElementById('ex-pips');
  const stat = document.getElementById('ex-status');
  if (!cont) return;
  cont.innerHTML = '';

  for (let i = 0; i < 6; i++) {
    const isLethal = i === 5;
    const isFilled = (state.exaustao || 0) > i;

    const pip = document.createElement('div');
    pip.className = [
      'ex-pip',
      isLethal ? 'lethal' : '',
      isFilled ? 'filled' : '',
    ].filter(Boolean).join(' ');

    pip.onclick = () => {
      state.exaustao = (state.exaustao || 0) > i ? i : i + 1;
      buildExaustao();
    };

    const lbl = document.createElement('div');
    lbl.className = 'ex-label';
    lbl.textContent = i + 1;

    const wrap = document.createElement('div');
    wrap.style.textAlign = 'center';
    wrap.appendChild(pip);
    wrap.appendChild(lbl);
    cont.appendChild(wrap);
  }

  if (stat) {
    const lvl = state.exaustao || 0;
    stat.textContent = EX_LABELS[lvl] || 'MORTE';
    if (lvl >= 5)      stat.style.color = 'var(--rust)';
    else if (lvl >= 3) stat.style.color = 'var(--copper)';
    else               stat.style.color = 'var(--parch-dark)';
  }
}

// ─── CARGAS DE VAPOR ─────────────────────────────────────────────────────────────
function buildCVPips() {
  const cont = document.getElementById('cv-track');
  if (!cont) return;
  cont.innerHTML = '';

  const max = state.cv_max || 0;
  const cur = state.cv_cur || 0;

  if (max === 0) {
    cont.innerHTML = '<span style="font-size:0.75rem;color:var(--parch-dark);font-style:italic">Sem caldeira instalada.</span>';
    return;
  }

  for (let i = 0; i < max; i++) {
    const pip = document.createElement('div');
    pip.className = 'cv-pip' + (cur > i ? ' filled' : '');
    pip.onclick = () => {
      state.cv_cur = (state.cv_cur || 0) > i ? i : i + 1;
      buildCVPips();
    };
    cont.appendChild(pip);
  }
}

// ─── ESCALA DE FERRUGEM ──────────────────────────────────────────────────────────
function buildEF() {
  const ef  = state.ef || 0;
  const num = document.getElementById('ef-num');
  const bar = document.getElementById('ef-bar');
  const status = document.getElementById('ef-status');
  const effect = document.getElementById('ef-effect');

  if (num) num.textContent = ef;
  if (bar) bar.style.width = Math.min(100, (ef / 21) * 100) + '%';

  const tier = EF_DATA.find(t => ef <= t.max) || EF_DATA[EF_DATA.length - 1];

  if (status) {
    status.className = 'ef-status ' + tier.cls;
    status.textContent = tier.label;
  }
  if (effect) effect.textContent = tier.effect;
}

function changeEF(delta) {
  state.ef = Math.max(0, (state.ef || 0) + delta);
  buildEF();
  updateAncoraNote();
}

// ─── ÂNCORAS ─────────────────────────────────────────────────────────────────────
function buildAncoras() {
  const cont = document.getElementById('ancoras-list');
  if (!cont) return;
  cont.innerHTML = '';

  state.ancoras.forEach((a, i) => {
    const div = document.createElement('div');
    div.className = 'ancora-item' + (a.quebrada ? ' broken' : '');
    div.innerHTML = `
      <div class="ancora-num">${i + 1}</div>
      <input
        type="text"
        value="${(a.texto || '').replace(/"/g, '&quot;')}"
        placeholder="Uma memória, pessoa, objeto ou princípio..."
        oninput="state.ancoras[${i}].texto = this.value"
      >
      <button
        class="ancora-break-btn"
        onclick="toggleAncora(${i})"
        title="${a.quebrada ? 'Restaurar' : 'Quebrar'}"
      >${a.quebrada ? '↺' : '✕'}</button>
    `;
    cont.appendChild(div);
  });

  updateAncoraNote();
}

function toggleAncora(i) {
  state.ancoras[i].quebrada = !state.ancoras[i].quebrada;
  buildAncoras();
}

function updateAncoraNote() {
  const intactas = state.ancoras.filter(a => !a.quebrada).length;
  const ef = state.ef || 0;
  const note = document.getElementById('ancora-note');
  if (!note) return;

  if (intactas === 0 && ef >= 21) {
    note.textContent = '0 âncoras + EF 21+ — Dissolução iminente.';
    note.style.borderColor = 'var(--rust)';
    note.style.color = 'var(--rust)';
  } else if (intactas === 0) {
    note.textContent = '0 âncoras — vulnerável ao metal.';
    note.style.borderColor = 'var(--copper)';
    note.style.color = 'var(--copper)';
  } else {
    const s = intactas !== 1;
    note.textContent = `${intactas} âncora${s ? 's' : ''} intacta${s ? 's' : ''} — a ferrugem não te consome.`;
    note.style.borderColor = 'var(--brass-dim)';
    note.style.color = 'var(--parch-dark)';
  }
}

// ─── MODIFICAÇÕES ────────────────────────────────────────────────────────────────
function buildMods() {
  const list = document.getElementById('mod-list');
  if (!list) return;
  list.innerHTML = '';

  let efTotal = 0;
  (state.modificacoes || []).forEach((m, i) => {
    efTotal += m.ef || 0;
    const li = document.createElement('li');
    li.className = 'mod-item';
    li.innerHTML = `
      <div class="mod-name">${m.nome}</div>
      <div class="mod-badge grau-${m.grau}">G${m.grau}</div>
      <div class="ef-cost">EF ${m.ef || 0}</div>
      <button class="mod-del" onclick="removeMod(${i})" title="Remover">✕</button>
    `;
    list.appendChild(li);
  });

  const tot = document.getElementById('mods-ef-total');
  if (tot) tot.textContent = efTotal;
}

function addMod() {
  const nomeEl  = document.getElementById('mod-nome-inp');
  const grauEl  = document.getElementById('mod-grau-inp');
  const efEl    = document.getElementById('mod-ef-inp');

  const nome = (nomeEl.value || '').trim();
  const grau = parseInt(grauEl.value) || 0;
  const ef   = parseInt(efEl.value)   || 0;

  if (!nome) return;

  if (!state.modificacoes) state.modificacoes = [];
  state.modificacoes.push({ nome, grau, ef });

  nomeEl.value = '';
  efEl.value   = '';
  buildMods();
}

function removeMod(i) {
  state.modificacoes.splice(i, 1);
  buildMods();
}

// ─── RECURSOS ────────────────────────────────────────────────────────────────────
function buildRecursos() {
  const cont = document.getElementById('recursos-grid');
  if (!cont) return;
  cont.innerHTML = '';

  RECURSOS_DEF.forEach(r => {
    const val = (state.recursos || {})[r.key] || 0;
    const div = document.createElement('div');
    div.className = 'recurso-block';
    div.innerHTML = `
      <span class="recurso-name">${r.label}</span>
      <div class="recurso-count">
        <button class="r-btn" onclick="changeRecurso('${r.key}', -1)">−</button>
        <div class="r-num" id="r-${r.key}">${val}</div>
        <button class="r-btn" onclick="changeRecurso('${r.key}', 1)">+</button>
      </div>
    `;
    cont.appendChild(div);
  });
}

function changeRecurso(key, delta) {
  if (!state.recursos) state.recursos = {};
  state.recursos[key] = Math.max(0, (state.recursos[key] || 0) + delta);
  const el = document.getElementById('r-' + key);
  if (el) el.textContent = state.recursos[key];
}

// ─── CONTATOS ─────────────────────────────────────────────────────────────────────
function buildContatos() {
  const cont = document.getElementById('contatos-list');
  if (!cont) return;
  cont.innerHTML = '';

  (state.contatos || []).forEach((c, ci) => {
    const div = document.createElement('div');
    div.className = 'contato-item';
    div.innerHTML = `
      <div class="contato-header">
        <div class="contato-name">${c.nome}</div>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <span style="font-family:'Cinzel',serif;font-size:0.6rem;color:var(--parch-dark)">Favores</span>
          <div class="favor-pips">
            ${[0, 1, 2].map(fi => `
              <div class="favor-pip ${(c.favores || 0) > fi ? 'filled' : ''}"
                   onclick="setFavor(${ci}, ${fi})"></div>
            `).join('')}
          </div>
          <button class="mod-del" onclick="removeContato(${ci})">✕</button>
        </div>
      </div>
      <div style="font-size:0.78rem;color:var(--parch-dark);font-style:italic">${c.info || ''}</div>
    `;
    cont.appendChild(div);
  });
}

function setFavor(ci, fi) {
  const c = state.contatos[ci];
  c.favores = (c.favores || 0) > fi ? fi : fi + 1;
  buildContatos();
}

function addContato() {
  const nomeEl = document.getElementById('ct-nome');
  const infoEl = document.getElementById('ct-info');

  const nome = (nomeEl.value || '').trim();
  const info = (infoEl.value || '').trim();
  if (!nome) return;

  if (!state.contatos) state.contatos = [];
  state.contatos.push({ nome, info, favores: 0 });

  nomeEl.value = '';
  infoEl.value = '';
  buildContatos();
}

function removeContato(i) {
  state.contatos.splice(i, 1);
  buildContatos();
}

// ─── SAVE / LOAD / CLEAR ─────────────────────────────────────────────────────────
function collectTextFields() {
  const textFields = [
    'nome','apelido','origem','aparencia','moradia','detalhe',
    'convergencia','contato_init','equipamento','notas',
  ];
  textFields.forEach(f => {
    const el = document.getElementById(f);
    if (el) state[f] = el.value;
  });

  const selects = ['arqueamento','profissao'];
  selects.forEach(f => {
    const el = document.getElementById(f);
    if (el) state[f] = el.value;
  });

  // Coleta textos das âncoras diretamente do DOM
  const ancora_inputs = document.querySelectorAll('#ancoras-list .ancora-item input');
  ancora_inputs.forEach((inp, i) => {
    if (state.ancoras[i]) state.ancoras[i].texto = inp.value;
  });
}

function saveSheet() {
  collectTextFields();
  try {
    localStorage.setItem('maculados_ficha', JSON.stringify(state));
    showToast('Ficha salva.');
  } catch(e) {
    showToast('Erro ao salvar.');
    console.error(e);
  }
}

function clearSheet() {
  if (!confirm('Limpar toda a ficha? Esta ação não pode ser desfeita.')) return;
  localStorage.removeItem('maculados_ficha');
  location.reload();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ─── AUTO-SAVE ────────────────────────────────────────────────────────────────────
setInterval(() => {
  collectTextFields();
  try {
    localStorage.setItem('maculados_ficha', JSON.stringify(state));
  } catch(e) {}
}, 30000);

// ─── BOOT ────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
