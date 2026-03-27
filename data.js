// ═══════════════════════════════════════════════════════
// MACULADOS PELO METAL — Game Data
// ═══════════════════════════════════════════════════════

const GAME_DATA = {

  // ── ARMAS CORPO A CORPO ────────────────────────────────
  meleeWeapons: [
    { id:'faca',       name:'Faca de Cinto',          preco:5,    dano:'1d4',   props:'Leve, arremessável (9m), ocultável' },
    { id:'soco',       name:'Soco-Inglês de Latão',   preco:3,    dano:'1d4+1', props:'Leve, não-letal opcional' },
    { id:'cutelo',     name:'Cutelo Industrial',       preco:20,   dano:'1d6',   props:'Leve' },
    { id:'sabre',      name:'Sabre de Engenheiro',     preco:60,   dano:'1d6',   props:'Leve, +1 em contra-ataques' },
    { id:'machadinha', name:'Machadinha de Demolição', preco:45,   dano:'1d8',   props:'Versátil (1d10), +2 vs estruturas e armadura pesada' },
    { id:'gancho',     name:'Gancho de Abordagem',     preco:20,   dano:'1d6',   props:'Alcance 2m, arremessável (6/12m)' },
    { id:'corrente',   name:'Corrente de Pistão',      preco:30,   dano:'1d8',   props:'Ignora +1 QS de Defesa de armaduras' },
    { id:'chicote',    name:'Chicote de Farpas',       preco:40,   dano:'1d4',   props:'Alcance 3m, pode desarmar (DES vs DES)' },
    { id:'prensa',     name:'Prensa de Punho',         preco:180,  dano:'1d6',   props:'Leve, 1 CV para bônus pneumático' },
    { id:'lanca',      name:'Lança de Ancoragem',      preco:35,   dano:'1d8',   props:'Alcance 3m, pode ser fixada no solo' },
    { id:'serra',      name:'Lâmina-Serra Mecânica',   preco:300,  dano:'2d6',   props:'Duas mãos, 1 CV/rodada, causa Sangrando' },
    { id:'pistao',     name:'Clava de Pistão',         preco:400,  dano:'1d10',  props:'Pesada, 1 CV por golpe, empurra 1,5m' },
  ],

  // ── ARMAS DE FOGO E VAPOR ──────────────────────────────
  rangedWeapons: [
    { id:'derringer',  name:'Derringer de Bolso',        preco:80,    dano:'1d6',          props:'9m, 3 tiros, recarga ação bônus, ocultável' },
    { id:'revolver',   name:'Revólver de Tambor',        preco:150,   dano:'1d8',          props:'30m, 6 tiros, recarga ação bônus' },
    { id:'revpesado',  name:'Revólver Pesado',           preco:300,   dano:'1d10',         props:'40m, 6 tiros, recarga ação completa, recuo (VIG QS 1)' },
    { id:'pvapor',     name:'Pistola de Vapor',          preco:450,   dano:'1d8+2 fogo',   props:'20m, 1 CV/disparo, sem munição' },
    { id:'rferrolho',  name:'Rifle de Ferrolho',         preco:400,   dano:'1d10',         props:'120m, 5 tiros, recarga ação completa' },
    { id:'rprecisao',  name:'Rifle de Precisão',         preco:750,   dano:'1d12',         props:'200m, 3 tiros, +1d6 se mirar 1 rodada' },
    { id:'mosquetao',  name:'Mosquetão a Vapor',         preco:650,   dano:'2d6 fogo',     props:'60m, 2 CV/disparo, ignora 1 QS de armadura metálica' },
    { id:'espingarda', name:'Espingarda de Cano Duplo',  preco:250,   dano:'2d6',          props:'15m, 2 tiros, recarga ação completa, cone 3m' },
    { id:'escopeta',   name:'Escopeta de Repetição',     preco:500,   dano:'2d6',          props:'12m, 6 tiros, recarga ação bônus' },
    { id:'canhao',     name:'Canhão de Mão',             preco:1000,  dano:'3d6',          props:'15m, 1 tiro, recarga 2 ações, VIG QS 2 ou cai' },
    { id:'arpao',      name:'Lança-Arpão a Vapor',       preco:900,   dano:'2d8 perfurante',props:'30m, 2 CV, corrente 15m, arrasta (VIG QS 3)' },
    { id:'trabuco',    name:'Trabuco Rotativo',          preco:1200,  dano:'1d8',          props:'25m, 12 tiros, rajada (3 tiros, -1d cada)' },
    { id:'galvanico',  name:'Rifle de Raios Galvânicos', preco:3000,  dano:'2d8 elétrico', props:'80m, 3 CV, +1d6 vs armadura metálica' },
  ],

  // ── EXPLOSIVOS ─────────────────────────────────────────
  explosives: [
    { id:'dinamite',   name:'Dinamite (1 bastão)',        preco:50,  dano:'3d6',  props:'Raio 3m, DES QS 1 metade' },
    { id:'fragmen',    name:'Granada de Fragmentação',    preco:90,  dano:'4d6',  props:'Raio 6m, perfurante, DES QS 2 metade' },
    { id:'bomvapor',   name:'Bomba de Vapor',             preco:120, dano:'3d8',  props:'Raio 4m, fogo, nuvem de vapor 1 min' },
    { id:'lacrimog',   name:'Granada de Gás Lacrimogêneo',preco:60,  dano:'—',    props:'Raio 6m, FOR QS 2 ou cego/sufocado 1d4 rodadas' },
    { id:'mina',       name:'Mina de Pressão',            preco:100, dano:'5d6',  props:'Raio 3m quando ativada, DES QS 2 metade' },
    { id:'carga',      name:'Carga Moldada',              preco:200, dano:'6d8',  props:'Explosão direcional, linha de 9m, destrói portas' },
  ],

  // ── ARMADURAS ──────────────────────────────────────────
  armors: [
    { id:'comum',      name:'Roupa Comum',                preco:5,    def:'QS 1',       props:'—' },
    { id:'couro',      name:'Couro Rebiteado',            preco:25,   def:'QS 1',       props:'Leve, sem penalidade' },
    { id:'colete',     name:'Colete de Chapas',           preco:100,  def:'QS 2',       props:'Cobre só o torso' },
    { id:'cota',       name:'Cota de Correntes',          preco:150,  def:'QS 2',       props:'Flexível, sem penalidade' },
    { id:'courassa',   name:'Courassa de Latão',          preco:200,  def:'QS 3',       props:'-1 em Furtividade' },
    { id:'placas',     name:'Armadura de Placas Rebitadas',preco:500, def:'QS 3 + RD 2',props:'Desvantagem em Furtividade' },
    { id:'carcaca',    name:'Carcaça de Combate',         preco:1200, def:'QS 4',       props:'Desvantagem em Furtividade e Acrobacia' },
    { id:'exo',        name:'Exoesqueleto de Combate',    preco:5000, def:'QS 4 +1 VIG',props:'2 CV/rodada, EF +3, peso não conta' },
    { id:'galvani',    name:'Blindagem Galvânica',        preco:8500, def:'QS 3',       props:'Resistência elétrica, +1 CV máximo' },
  ],

  // ── MODIFICAÇÕES — GRAU 0 ─────────────────────────────
  mods_g0: [
    { id:'resp',    name:'Sistema Respiratório Filtrante', ef:0, pts:1, custo:150,  efeito:'+1d6 vs gases/toxinas', manutencao:'Limpeza semanal' },
    { id:'osseo',   name:'Reforço Ósseo Subcutâneo',      ef:1, pts:1, custo:250,  efeito:'+1 QS Defesa, +1 PV, +1d6 vs fraturas', manutencao:'Nenhuma' },
    { id:'adrenal', name:'Glândula Adrenal Sintética',    ef:1, pts:1, custo:300,  efeito:'+1d6 VIG/DES por 1 dia após descanso', manutencao:'Nenhuma' },
    { id:'hepat',   name:'Filtro Hepático Mecânico',      ef:0, pts:1, custo:150,  efeito:'+1d6 vs venenos ingeridos', manutencao:'Calibração mensal' },
    { id:'pele',    name:'Pele Endurecida Quimicamente',  ef:1, pts:1, custo:200,  efeito:'+1 QS Defesa, RD 2 cortante', manutencao:'Nenhuma' },
    { id:'nodulo',  name:'Nódulos Analgésicos Espinhais', ef:1, pts:1, custo:250,  efeito:'Ignora penalidades de dor 1x/descanso curto', manutencao:'Recarga mensal' },
    { id:'estab',   name:'Estabilizadores Articulares',   ef:0, pts:1, custo:180,  efeito:'+1d6 Acrobacia, imune a torções', manutencao:'Nenhuma' },
    { id:'tympa',   name:'Tímpanos Reforçados',           ef:0, pts:1, custo:120,  efeito:'Imune a surdez, +1d6 vs ataques sônicos', manutencao:'Nenhuma' },
  ],

  // ── MODIFICAÇÕES — GRAU 1 ─────────────────────────────
  mods_g1: [
    { id:'braco',   name:'Braço Hidráulico',            ef:2, pts:2, custo:450,  efeito:'+1 VIG força bruta', manutencao:'Lubrificação semanal' },
    { id:'pernas',  name:'Pernas Pneumáticas',          ef:2, pts:2, custo:550,  efeito:'+3m deslocamento, +1d8 Atletismo', manutencao:'Óleo a cada 3 dias' },
    { id:'olhos',   name:'Olhos Telescópicos de Latão', ef:1, pts:1, custo:400,  efeito:'+1d8 percepção visual, 300m nítido', manutencao:'Limpeza quinzenal' },
    { id:'subcut',  name:'Subcutâneo de Placas',        ef:2, pts:2, custo:650,  efeito:'+2 QS Defesa', manutencao:'Verificação mensal' },
    { id:'auditiv', name:'Sistema Auditivo Amplificado',ef:1, pts:1, custo:300,  efeito:'+1d8 percepção auditiva, ouve a 30m', manutencao:'Calibração mensal' },
    { id:'articu',  name:'Articulações de Precisão',    ef:1, pts:2, custo:520,  efeito:'+1 DES, ignora penalidades de espaço', manutencao:'Lubrificação semanal' },
    { id:'coracaug',name:'Coração Auxiliar Mecânico',   ef:2, pts:2, custo:800,  efeito:'+4 PV, ressurreição (FOR QS 2) 1x/descanso', manutencao:'Manutenção quinzenal' },
    { id:'dedos',   name:'Dedos Ferramenta',            ef:1, pts:1, custo:350,  efeito:'Ferramentas integradas, +1d8 arrombamento', manutencao:'Nenhuma' },
    { id:'estomag', name:'Estômago Refinador',          ef:1, pts:2, custo:420,  efeito:'Digere orgânicos, imune a venenos comuns', manutencao:'Calibração mensal' },
    { id:'camo',    name:'Pele Sintética Camaleão',     ef:2, pts:2, custo:600,  efeito:'+1d10 Furtividade imóvel, muda cor', manutencao:'Nenhuma' },
  ],

  // ── MODIFICAÇÕES — GRAU 2 ─────────────────────────────
  mods_g2: [
    { id:'cogit',   name:'Cogitador Mnemônico',         ef:3, pts:3, custo:1500, efeito:'+1d10 memória, grava 100 pág. perfeitamente', manutencao:'Calibração mensal' },
    { id:'caldeira',name:'Caldeira Dorsal Básica',      ef:2, pts:3, custo:2000, efeito:'6 CV, recarga 1/hora', manutencao:'Limpeza semanal' },
    { id:'coracmec',name:'Coração Mecânico de Precisão',ef:3, pts:3, custo:1800, efeito:'+1 VIG, +12 PV, nunca falha em parada', manutencao:'Lubrificação a cada 2 dias' },
    { id:'proctat', name:'Processador Tático Neural',   ef:3, pts:3, custo:2200, efeito:'+2 RAZ, Sobrecarga de Sistema (hackear)', manutencao:'Calibração quinzenal' },
  ],

  // ── MODIFICAÇÕES — GRAU 3 ─────────────────────────────
  mods_g3: [
    { id:'membros', name:'Membros Substitutos',         ef:5, pts:4, custo:7500, efeito:'+1 DES em combate, velocidade aumentada', manutencao:'1h diária obrigatória' },
    { id:'coluna',  name:'Coluna Neural de Latão',      ef:4, pts:4, custo:9000, efeito:'+2 DES, +2 INS, reação adicional', manutencao:'Verificação semanal' },
    { id:'pulmoes', name:'Pulmões de Vapor Comprimido', ef:3, pts:4, custo:6000, efeito:'Não respira, cone 4m 3d6 fogo 1x/curto', manutencao:'Reabastecimento 12h' },
    { id:'cerebro', name:'Cérebro Compartimentado',     ef:5, pts:5, custo:9000, efeito:'+2 RAZ, 2 ações simultâneas, imune a confusão', manutencao:'Calibração mensal' },
    { id:'arsenal', name:'Arsenal Integrado',           ef:6, pts:5, custo:10000,efeito:'Integra até 3 armas escolhidas', manutencao:'Manutenção semanal' },
  ],

  // ── MODIFICAÇÕES — GRAU 4 ─────────────────────────────
  mods_g4: [
    { id:'dread',   name:'Transformação Dreadnought',   ef:8, pts:8, custo:25000, efeito:'+6 VIG, +4 FOR, +30 PV, +3 QS Def, Grande', manutencao:'4h diárias' },
    { id:'ascen',   name:'Ascensão Mente-Máquina',      ef:7, pts:7, custo:30000, efeito:'+6 RAZ, conecta máquinas, +2 classes perícias', manutencao:'Calibração mensal' },
    { id:'espectro',name:'Corpo Espectro',              ef:6, pts:6, custo:20000, efeito:'Passa por 15cm, +4 DES, invisível termicamente', manutencao:'Calibração quinzenal' },
    { id:'necreg',  name:'Regeneração Necrotécnica',    ef:7, pts:6, custo:18000, efeito:'Regenera 2d10 PV/rodada, membros regeneram', manutencao:'2kg carne fresca/semana' },
  ],

  // ── FERRAMENTAS E KITS ─────────────────────────────────
  tools: [
    { id:'kit_eng',   name:'Kit de Ferramentas de Engenheiro', preco:120, props:'Necessário para reparos complexos, 5kg' },
    { id:'kit_med',   name:'Kit Médico',                       preco:60,  props:'10 usos, QS +1 sem ele' },
    { id:'kit_cir',   name:'Kit Cirúrgico',                    preco:250, props:'Necessário para cirurgias' },
    { id:'kit_alq',   name:'Kit de Alquimia Portátil',         preco:180, props:'Criar compostos químicos' },
    { id:'gazua',     name:'Ferramentas de Ladrão',            preco:60,  props:'Gazuas, ganchos, arrombamentos' },
    { id:'kit_dis',   name:'Kit de Disfarce',                  preco:75,  props:'+2 Enganação para disfarces' },
    { id:'escalada',  name:'Equipamento de Escalada',          preco:40,  props:'Garfos, cordas 15m, pitons' },
    { id:'binos',     name:'Binóculos de Latão',               preco:100, props:'+2 Percepção visual à distância' },
    { id:'lanterna',  name:'Lanterna a Vapor',                 preco:60,  props:'Ilumina 15m, 1 CV/8h' },
    { id:'detector',  name:'Detector de Gases',                preco:150, props:'Apita na presença de gases tóxicos' },
    { id:'relogio',   name:'Relógio de Bolso',                 preco:120, props:'Precisão de ±2 minutos/dia' },
    { id:'bussola',   name:'Bússola Mecânica',                 preco:50,  props:'+2 Sobrevivência para navegação' },
  ],

  // ── CONSUMÍVEIS ────────────────────────────────────────
  consumables: [
    { id:'muni10',    name:'Balas (10 unidades)',         preco:10,  props:'Munição padrão' },
    { id:'perfur',    name:'Balas Perfurantes (10)',       preco:40,  props:'Ignora 2 pontos de QS de armadura' },
    { id:'antidoto',  name:'Antídoto Genérico',           preco:25,  props:'+2 FOR vs venenos por 1h' },
    { id:'estimul',   name:'Estimulante Químico',         preco:40,  props:'Remove 1 nível Exaustão, +1 após 4h' },
    { id:'pocao',     name:'Poção de Cura Alquímica',     preco:120, props:'Recupera 2d4+2 PV' },
    { id:'kit_rep',   name:'Kit de Reparo de Campo',      preco:80,  props:'Repara mods quebradas temporariamente (1d4h)' },
    { id:'oleo',      name:'Óleo Lubrificante (frasco)',  preco:2,   props:'Manutenção de modificações' },
    { id:'combust',   name:'Combustível de Caldeira (1 dia)', preco:5, props:'Carvão comprimido ou óleo' },
  ],
};

// Flat list of all mods for easy access
GAME_DATA.allMods = [
  ...GAME_DATA.mods_g0.map(m => ({...m, grau:0})),
  ...GAME_DATA.mods_g1.map(m => ({...m, grau:1})),
  ...GAME_DATA.mods_g2.map(m => ({...m, grau:2})),
  ...GAME_DATA.mods_g3.map(m => ({...m, grau:3})),
  ...GAME_DATA.mods_g4.map(m => ({...m, grau:4})),
];

GAME_DATA.allWeapons = [
  ...GAME_DATA.meleeWeapons.map(w => ({...w, tipo:'Corpo a Corpo'})),
  ...GAME_DATA.rangedWeapons.map(w => ({...w, tipo:'Fogo e Vapor'})),
  ...GAME_DATA.explosives.map(w => ({...w, tipo:'Explosivo'})),
];

GAME_DATA.allItems = [
  ...GAME_DATA.allWeapons.map(i => ({...i, categoria:'Arma'})),
  ...GAME_DATA.armors.map(i => ({...i, categoria:'Armadura', dano: i.def})),
  ...GAME_DATA.tools.map(i => ({...i, categoria:'Ferramenta', dano:'—'})),
  ...GAME_DATA.consumables.map(i => ({...i, categoria:'Consumível', dano:'—'})),
];
