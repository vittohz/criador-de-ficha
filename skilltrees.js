// ═══════════════════════════════════════════════════════
// SKILL TREES — one per arqueamento
// Node types: identity | calibration | convergence | apotheosis
// ═══════════════════════════════════════════════════════

const SKILL_TREES = {

  Fortificado: [
    { level:1,  type:'identity',    id:'f1',  title:'Aço Inicial',
      desc:'+2 QS de Defesa, +5 PV. Seu corpo começa a endurecer.' },

    { level:2,  type:'calibration', id:'f2',  options:[
      { id:'f2a', title:'Massa Imparável',  desc:'+3m ao correr em linha reta. Ignora obstáculos leves no caminho.' },
      { id:'f2b', title:'Ancoragem',        desc:'Vantagem em resistir a empurrões e derrubadas. +1 sucesso contra deslocamento forçado.' },
      { id:'f2c', title:'Armadura Viva',    desc:'+1 QS Defesa. Ignora penalidade de movimento de armadura pesada.' },
    ]},

    { level:3,  type:'identity',    id:'f3',  title:'Reação Defensiva',
      desc:'Pode usar reação para reduzir dano recebido em 1d10 + VIG.' },

    { level:4,  type:'calibration', id:'f4',  options:[
      { id:'f4a', title:'Impacto Sísmico',  desc:'Ao pousar de salto, inimigos em 3m fazem VIG QS 2 ou são derrubados.' },
      { id:'f4b', title:'Blindagem Reativa',desc:'Quando acertado por crítico, o atacante sofre 1d6 dano (espinhos de metal).' },
      { id:'f4c', title:'Metabolismo Ferro',desc:'+2 PV por nível retroativo.' },
    ]},

    { level:5,  type:'identity',    id:'f5',  title:'Membros como Armas',
      desc:'Seus membros mecânicos podem ser usados como armas (1d8 dano). Você está sempre armado.' },

    { level:6,  type:'convergence', id:'f6',  options:[
      { id:'muralha', title:'Muralha Viva',
        desc:'Aliados adjacentes ganham +1 QS Defesa. 1x por combate pode usar reação para receber ataque destinado a aliado a 3m.' },
      { id:'juggernaut', title:'Juggernaut',
        desc:'Para cada 3m movido antes de atacar, +1d6 dano adicional (máx +3d6).' },
    ]},

    { level:7,  type:'identity',    id:'f7',  conv:'muralha', title:'Bastião Imune',
      desc:'Imune a sangramento e venenos biológicos.' },
    { level:7,  type:'identity',    id:'f7b', conv:'juggernaut', title:'Bastião Imune',
      desc:'Imune a sangramento e venenos biológicos.' },

    { level:8,  type:'calibration', id:'f8',  conv:'muralha', options:[
      { id:'f8a', title:'Bastião Inabalável',desc:'Postura defensiva (ação bônus): QS Def +4, imóvel, aliados atrás têm cobertura total.' },
      { id:'f8b', title:'Escudo Vivo',       desc:'Pode proteger até 2 aliados adjacentes com sua reação.' },
      { id:'f8c', title:'Regeneração Metálica',desc:'Recupera 1d6 PV no início do turno se não se moveu na rodada anterior.' },
    ]},
    { level:8,  type:'calibration', id:'f8j', conv:'juggernaut', options:[
      { id:'f8d', title:'Investida Devastadora',desc:'Se mover 6m+ em linha reta e atacar: empurra alvo 3m e +2d6 dano.' },
      { id:'f8e', title:'Pisada Esmagadora', desc:'Ao se mover pelo espaço de criatura Média ou menor, pode pisoteá-la (VIG vs DES, 2d8).' },
      { id:'f8f', title:'Momento Imparável', desc:'Imune a terreno difícil, efeitos de lentidão e redução de deslocamento.' },
    ]},

    { level:9,  type:'identity',    id:'f9',  title:'Tamanho Grande',
      desc:'Seu tamanho aumenta para Grande. +5 PV adicionais. Ocupa espaço de 2×2m.' },

    { level:10, type:'apotheosis',  id:'f10', title:'Dreadnought',
      desc:'+2 VIG, +1 FOR, +20 PV. −2 PRE, EF +5. Seu corpo deixou de ser reconhecido como humano. Pisadas racham concreto. Portas comuns não te comportam.' },
  ],

  Tecnocrata: [
    { level:1,  type:'identity',    id:'t1',  title:'Interface Neural',
      desc:'+1 Classificação em Engenharia e Ciência. Você vê o mundo como sistemas para explorar.' },

    { level:2,  type:'calibration', id:'t2',  options:[
      { id:'t2a', title:'Interface Rápida',    desc:'Pode usar ferramentas e máquinas como ação bônus.' },
      { id:'t2b', title:'Memória Fotográfica', desc:'+1 sucesso em testes de RAZ para recordar informações.' },
      { id:'t2c', title:'Mãos Estáveis',       desc:'Vantagem em Precisão Manual. Nunca treme.' },
    ]},

    { level:3,  type:'identity',    id:'t3',  title:'Cogitador Tático',
      desc:'+1 Sucesso automático em Iniciativa. Seu processador analisa ameaças mais rápido que qualquer reflexo orgânico.' },

    { level:4,  type:'calibration', id:'t4',  options:[
      { id:'t4a', title:'Sobrecarga Controlada', desc:'Pode elevar dispositivos próprios ao limite (+1d8 em desempenho).' },
      { id:'t4b', title:'Redundância de Sistemas',desc:'Modificações quebradas funcionam a 50% por 1d4 horas antes de falhar.' },
      { id:'t4c', title:'Diagnóstico Remoto',   desc:'Pode analisar modificações a até 9m de distância sem contato físico.' },
    ]},

    { level:5,  type:'identity',    id:'t5',  title:'Hackear Modificações',
      desc:'Pode hackear modificações inimigas em alcance (RAZ vs RAZ). Sucesso descalibra os sistemas do alvo.' },

    { level:6,  type:'convergence', id:'t6',  options:[
      { id:'arquiteto', title:'Arquiteto',
        desc:'1× por dia pode criar dispositivos temporários em 10 minutos (duram 1 cena).' },
      { id:'invasor', title:'Invasor',
        desc:'Hackear virou ação bônus. Sucesso causa 2d6 dano psíquico adicional.' },
    ]},

    { level:7,  type:'identity',    id:'t7',  conv:'arquiteto', title:'Forja de Campo',
      desc:'Cria modificações customizadas e dispositivos que não existem em catálogo.' },
    { level:7,  type:'identity',    id:'t7b', conv:'invasor',   title:'Forja de Campo',
      desc:'Cria modificações customizadas e dispositivos que não existem em catálogo.' },

    { level:8,  type:'calibration', id:'t8a', conv:'arquiteto', options:[
      { id:'t8a1', title:'Instalador de Campo',  desc:'Instala modificações temporárias Grau 0-1 em 1 hora.' },
      { id:'t8a2', title:'Dispositivo Duplo',    desc:'Pode criar 2 dispositivos temporários simultaneamente.' },
      { id:'t8a3', title:'Upgrade Instantâneo',  desc:'Melhora modificações de aliados temporariamente por 1 cena.' },
    ]},
    { level:8,  type:'calibration', id:'t8b', conv:'invasor', options:[
      { id:'t8b1', title:'Invasão Múltipla',  desc:'Hackeia 2 alvos simultaneamente com a mesma rolagem.' },
      { id:'t8b2', title:'Backdoor Neural',   desc:'Alvos já hackeados têm desvantagem em resistir novamente.' },
      { id:'t8b3', title:'Shutdown Remoto',   desc:'Desliga modificações inimigas por 1 rodada (RAZ vs RAZ, gasta 2 PR).' },
    ]},

    { level:9,  type:'identity',    id:'t9',  conv:'arquiteto', title:'Arsenal Expandido',
      desc:'Mantém 3 dispositivos temporários ativos simultaneamente.' },
    { level:9,  type:'identity',    id:'t9b', conv:'invasor',   title:'Visão Invasora',
      desc:'Vê através de sensores mecânicos hackeados (câmeras, olhos metálicos) em tempo real.' },

    { level:10, type:'apotheosis',  id:'t10', title:'Mente-Máquina',
      desc:'+2 RAZ, processa informação sobre-humana, conecta-se a máquinas diretamente. −4 PRE. EF +4. Perde 1 memória pessoal por sessão.' },
  ],

  Rastejador: [
    { level:1,  type:'identity',    id:'r1',  title:'Morte Silenciosa',
      desc:'+1d8 em Furtividade. Se matar criatura sem ser detectado, pode esconder o corpo em 1 rodada silenciosamente.' },

    { level:2,  type:'calibration', id:'r2',  options:[
      { id:'r2a', title:'Passos Fantasmas',   desc:'Não deixa pegadas ou rastros físicos detectáveis.' },
      { id:'r2b', title:'Camuflagem Urbana',  desc:'+1d6 em Furtividade em ambientes urbanos e industriais.' },
      { id:'r2c', title:'Reflexos de Sombra', desc:'Vantagem em Iniciativa se começar o combate escondido.' },
    ]},

    { level:3,  type:'identity',    id:'r3',  title:'Membros Silenciadores',
      desc:'Seus membros mecânicos não produzem som ao se mover. Penalidade de Furtividade de modificações removida permanentemente.' },

    { level:4,  type:'calibration', id:'r4',  options:[
      { id:'r4a', title:'Predador Noturno',      desc:'+1d8 em Percepção no escuro total.' },
      { id:'r4b', title:'Evasão Sobrenatural',   desc:'Quando esquiva com sucesso, pode se mover 3m gratuitamente.' },
      { id:'r4c', title:'Mestre do Disfarce',    desc:'+1d8 em Enganação para disfarces e mudanças de identidade.' },
    ]},

    { level:5,  type:'identity',    id:'r5',  title:'Ataque Furtivo',
      desc:'+2d6 dano vs alvos desprevenidos ou flanqueados. A precisão supera a força bruta.' },

    { level:6,  type:'convergence', id:'r6',  options:[
      { id:'assassino', title:'Assassino',
        desc:'Matar alvo com ataque furtivo concede +2d6 no próximo ataque furtivo do mesmo combate (acumula até +6d6).' },
      { id:'infiltrador', title:'Infiltrador',
        desc:'A cada 1 hora pode se tornar efetivamente invisível por 5 min. Termina se atacar.' },
    ]},

    { level:7,  type:'identity',    id:'r7',  conv:'assassino',  title:'Camuflagem Térmica',
      desc:'Invisível para sensores térmicos e de calor. Câmeras comuns não te capturam.' },
    { level:7,  type:'identity',    id:'r7b', conv:'infiltrador', title:'Camuflagem Térmica',
      desc:'Invisível para sensores térmicos e de calor. Câmeras comuns não te capturam.' },

    { level:8,  type:'calibration', id:'r8a', conv:'assassino', options:[
      { id:'r8a1', title:'Golpe Letal',    desc:'1× por combate: ataque furtivo declarado como letal. Se dano exceder 50% do PV, mata instantaneamente.' },
      { id:'r8a2', title:'Veneno Aplicado',desc:'Aplica venenos em armas como ação bônus (dura 3 ataques).' },
      { id:'r8a3', title:'Strike Duplo',   desc:'Ataque furtivo permite segundo ataque imediato (sem bônus furtivo).' },
    ]},
    { level:8,  type:'calibration', id:'r8b', conv:'infiltrador', options:[
      { id:'r8b1', title:'Mestre de Disfarces',  desc:'Muda aparência completamente em 10 min (+1d12 Enganação para se passar por outra pessoa).' },
      { id:'r8b2', title:'Presença Esquecível',  desc:'NPCs têm dificuldade em lembrar detalhes sobre você. Você é invisível na memória.' },
      { id:'r8b3', title:'Passagem Sombria',     desc:'Atravessa multidões sem ser notado. Deslocamento não reduz em área lotada.' },
    ]},

    { level:9,  type:'identity',    id:'r9',  conv:'assassino',   title:'Fluxo de Predador',
      desc:'Pode se mover metade do deslocamento após matar inimigo (reação). A caçada não para.' },
    { level:9,  type:'identity',    id:'r9b', conv:'infiltrador',  title:'Ouvidos nas Paredes',
      desc:'Ouve conversas através de portas e paredes finas como se estivesse ao lado.' },

    { level:10, type:'apotheosis',  id:'r10', title:'Espectro',
      desc:'Desmonta e remonta o corpo em 1 minuto, passando por espaços de 15cm. EF +3. Espelhos te mostram algo tremulando entre existência e não-existência.' },
  ],

  Carniceiro: [
    { level:1,  type:'identity',    id:'c1',  title:'Ataque Extra',
      desc:'+1 ataque por turno. Você não aprendeu a lutar. Você aprendeu a não parar.' },

    { level:2,  type:'calibration', id:'c2',  options:[
      { id:'c2a', title:'Selvageria',        desc:'+1d6 dano com armas corpo a corpo.' },
      { id:'c2b', title:'Cicatrizes de Guerra',desc:'+3 PV. Cada cicatriz é uma aula.' },
      { id:'c2c', title:'Resistência à Dor', desc:'Pode ignorar 1 nível de Exaustão até próximo descanso (1× por descanso).' },
    ]},

    { level:3,  type:'identity',    id:'c3',  title:'Frenesi',
      desc:'+1 Sucesso em VIG, +1d8 dano, −2 QS Defesa por 1d6 rodadas. O mundo fica vermelho.' },

    { level:4,  type:'calibration', id:'c4',  options:[
      { id:'c4a', title:'Fúria Prolongada', desc:'Frenesi dura 1d4+2 rodadas.' },
      { id:'c4b', title:'Golpes Brutais',   desc:'Durante Frenesi, críticos acontecem em condições ampliadas.' },
      { id:'c4c', title:'Sede de Sangue',   desc:'Recupera 1d6 PV ao matar inimigo durante Frenesi.' },
    ]},

    { level:5,  type:'identity',    id:'c5',  title:'Garras e Lâminas',
      desc:'Garras ou lâminas integradas (2d6 dano). Você está sempre armado. Não existe maneira de te desarmar.' },

    { level:6,  type:'convergence', id:'c6',  options:[
      { id:'berserker', title:'Berserker',
        desc:'Durante Frenesi: resistência 5 a dano físico. Frenesi se estende +1 rodada por inimigo morto (sem limite).' },
      { id:'acougueiro', title:'Açougueiro',
        desc:'Pode estudar inimigo por 1 rodada. Próximo ataque tem vantagem e +2d6 dano em ponto vital.' },
    ]},

    { level:7,  type:'identity',    id:'c7',  conv:'berserker',  title:'Ímpeto de Sangue',
      desc:'Ao matar: mova 6m e faça outro ataque como reação. O combate é um fluxo, não momentos separados.' },
    { level:7,  type:'identity',    id:'c7b', conv:'acougueiro',  title:'Ímpeto de Sangue',
      desc:'Ao matar: mova 6m e faça outro ataque como reação. O combate é um fluxo, não momentos separados.' },

    { level:8,  type:'calibration', id:'c8a', conv:'berserker', options:[
      { id:'c8a1', title:'Frenesi Incontrolável', desc:'Frenesi dura até todos inimigos visíveis morrerem. Não pode encerrar. +2d6 adicional.' },
      { id:'c8a2', title:'Resistência Furiosa',   desc:'Durante Frenesi: imune a medo, encantamento e atordoamento.' },
      { id:'c8a3', title:'Golpe Dilacerante',      desc:'Ataques durante Frenesi causam Sangrando por 1d4 rodadas.' },
    ]},
    { level:8,  type:'calibration', id:'c8b', conv:'acougueiro', options:[
      { id:'c8b1', title:'Anatomia da Destruição', desc:'+1d8 em ataques contra inimigos que já feriu anteriormente.' },
      { id:'c8b2', title:'Execução Clínica',        desc:'Se dano exceder 50% PV restante após 1 rodada adjacente sem sofrer ataques, mata.' },
      { id:'c8b3', title:'Desmembramento',          desc:'Críticos podem decepar membros (Mestre decide efeito permanente).' },
    ]},

    { level:9,  type:'identity',    id:'c9',  conv:'berserker',  title:'Ataques de Oportunidade',
      desc:'Durante Frenesi, pode fazer ataques de oportunidade normalmente.' },
    { level:9,  type:'identity',    id:'c9b', conv:'acougueiro',  title:'Frenesi Controlado',
      desc:'Pode usar Frenesi sem a penalidade de −2 QS Defesa.' },

    { level:10, type:'apotheosis',  id:'c10', title:'Morte Mecanizada',
      desc:'Em Frenesi: regenera 1d12+4 PV por inimigo morto. EF +6. Algo vivo pulsa dentro da máquina de guerra. Alguém ainda se importa?' },
  ],

  Quimera: [
    { level:1,  type:'identity',    id:'q1',  title:'Ponto de Modificação Extra',
      desc:'+1 ponto de modificação inicial. Você não tem um caminho — você tem todos os caminhos ao mesmo tempo.' },

    { level:2,  type:'calibration', id:'q2',  multi:true, count:2, options:[
      { id:'q2a', title:'Metabolismo Adaptativo', desc:'+2 PV. Seu corpo aprende a acomodar o impossível.' },
      { id:'q2b', title:'Sistemas Redundantes',   desc:'+1 QS Defesa. Duplicatas internas protegem o que seria vulnerável.' },
      { id:'q2c', title:'Reflexos Irregulares',   desc:'+1d8 em Iniciativa. Imprevisível até para você mesmo.' },
      { id:'q2d', title:'Pele Mutável',            desc:'+1d8 em Furtividade. Sua aparência nunca é a mesma.' },
    ]},

    { level:3,  type:'identity',    id:'q3',  title:'Arqueamentos Cruzados',
      desc:'Pode ter modificações de Arqueamentos diferentes sem penalidade adicional de EF.' },

    { level:4,  type:'calibration', id:'q4',  multi:true, count:2, options:[
      { id:'q4a', title:'Instabilidade Controlada', desc:'1d6 ao acordar: 1-2 desvantagem, 3-4 nada, 5-6 vantagem aleatória (dura o dia).' },
      { id:'q4b', title:'Patchwork Eficiente',      desc:'Modificações custam -10% eg.' },
      { id:'q4c', title:'Rejeição Reduzida',         desc:'+1d8 em testes de Biointegração.' },
      { id:'q4d', title:'Multi-funcional',            desc:'Pode usar 2 modificações simultaneamente que normalmente precisam de ação separada.' },
    ]},

    { level:5,  type:'identity',    id:'q5',  title:'Pontos de Modificação',
      desc:'+2 pontos de modificação adicionais. Seu corpo é uma tela em branco que nunca para.' },

    { level:6,  type:'convergence', id:'q6',  options:[
      { id:'aberracao', title:'Aberração Controlada',
        desc:'Reconfigura 1 modificação por descanso curto (em vez de longo).' },
      { id:'instavel', title:'Quimera Instável',
        desc:'Toda manhã rola 2d6 na Tabela de Mutação. Efeito dura até próximo descanso longo.' },
    ]},

    { level:7,  type:'identity',    id:'q7',  conv:'aberracao', title:'Adaptação',
      desc:'Reconfigura 1 modificação por descanso longo. Você nunca é a mesma coisa dois dias seguidos.' },
    { level:7,  type:'identity',    id:'q7b', conv:'instavel',   title:'Adaptação',
      desc:'Reconfigura 1 modificação por descanso longo. Você nunca é a mesma coisa dois dias seguidos.' },

    { level:8,  type:'calibration', id:'q8a', conv:'aberracao', options:[
      { id:'q8a1', title:'Forma Fluida',          desc:'Rearanja modificações fisicamente em 10 min (muda posição no corpo).' },
      { id:'q8a2', title:'Sobrecarga Adaptativa', desc:'Usa modificações além do limite 1× por dia sem consequência.' },
      { id:'q8a3', title:'Replicação Temporária', desc:'Em 1 rodada, replica efeito de modificação vista por 1 hora (1× por descanso longo).' },
    ]},
    { level:8,  type:'calibration', id:'q8b', conv:'instavel', options:[
      { id:'q8b1', title:'Mutação Agressiva',   desc:'Rola na Tabela de Mutação como ação bônus (1× por combate).' },
      { id:'q8b2', title:'Instabilidade Ofensiva',desc:'Quando sofre crítico, atacante sofre 2d6 dano.' },
      { id:'q8b3', title:'Forma Transitória',    desc:'+1d6 em testes físicos, mas -1 sucesso automático em todos os outros.' },
    ]},

    { level:9,  type:'identity',    id:'q9',  conv:'aberracao', title:'Instalação Temporária',
      desc:'1× por descanso longo, instala modificação Grau 0-1 que não possui. Dura até próximo descanso longo.' },
    { level:9,  type:'identity',    id:'q9b', conv:'instavel',   title:'Mutação Selecionada',
      desc:'Rola 3d6 na Tabela de Mutação e escolhe 2 resultados.' },

    { level:10, type:'apotheosis',  id:'q10', title:'Patchwork',
      desc:'+1 em todos os atributos. Sem limite de EF. 1d4 por descanso: em 1, perde controle de membro por 1 semana. Você transcendeu o ferro.' },
  ],

  Imaculado: [
    { level:1,  type:'identity',    id:'i1',  title:'Chama da Humanidade',
      desc:'+1d6 PRE. 1× por dia, discurso inspirador: aliados removem 2 EF temporário e ganham vantagem. Você recupera 1d6 PV por aliado afetado.' },

    { level:2,  type:'calibration', id:'i2',  options:[
      { id:'i2a', title:'Empatia Natural', desc:'+1d6 em Intuição. Você ainda sente o que os outros perderam a capacidade de sentir.' },
      { id:'i2b', title:'Líder Nato',      desc:'+1d6 em Comando. Quando você fala, pessoas ainda ouvem.' },
      { id:'i2c', title:'Médico de Campo', desc:'+1d6 em Medicina. A carne ainda tem valor para você.' },
    ]},

    { level:3,  type:'identity',    id:'i3',  title:'Empatia',
      desc:'+1d8 em Intuição e Persuasão. Você lê o que foi perdido nos outros e fala diretamente a isso.' },

    { level:4,  type:'calibration', id:'i4',  options:[
      { id:'i4a', title:'Aura Calmante',     desc:'Aliados a 3m têm vantagem contra medo.' },
      { id:'i4b', title:'Esperança Inabalável',desc:'+1 PR permanente.' },
      { id:'i4c', title:'Sacrifício Nobre',  desc:'Pode transferir até metade do seu PV atual para aliado adjacente (ação).' },
    ]},

    { level:5,  type:'identity',    id:'i5',  title:'Humanidade',
      desc:'Aliados a 9m ganham +1d6 em todos os testes enquanto puderem te ver ou ouvir.' },

    { level:6,  type:'convergence', id:'i6',  options:[
      { id:'farol', title:'Farol',
        desc:'Aura de Humanidade aumenta para 15m. Aliados na aura recuperam +2 PV por rodada.' },
      { id:'resistencia_conv', title:'Resistência',
        desc:'+1 FOR permanente. Sua recusa em se modificar é força, não fraqueza.' },
    ]},

    { level:7,  type:'identity',    id:'i7',  conv:'farol',      title:'Escudo Humano',
      desc:'Imune a medo e efeitos mentais. 1 vez por rodada, pode usar reação para dar imunidade a 1 aliado por 1 rodada.' },
    { level:7,  type:'identity',    id:'i7b', conv:'resistencia_conv', title:'Escudo Humano',
      desc:'Imune a medo e efeitos mentais. 1 vez por rodada, pode usar reação para dar imunidade a 1 aliado por 1 rodada.' },

    { level:8,  type:'calibration', id:'i8a', conv:'farol', options:[
      { id:'i8a1', title:'Presença Restauradora', desc:'Aliados que começam turno próximos a você removem 1 condição negativa (1× cada por combate).' },
      { id:'i8a2', title:'Escudo da Fé',          desc:'Reação para dar +2 QS Defesa a aliado visível até próximo turno dele.' },
      { id:'i8a3', title:'Martírio',               desc:'Ao cair a 0 PV: aliados a 15m ganham +2d6 dano e vantagem no próximo ataque (1× por dia).' },
    ]},
    { level:8,  type:'calibration', id:'i8b', conv:'resistencia_conv', options:[
      { id:'i8b1', title:'Carne Resiliente',   desc:'+10 PV. Regenera 1 PV por rodada fora de combate.' },
      { id:'i8b2', title:'Negação Adaptativa', desc:'Remove 1 modificação temporariamente como ação (volta após descanso longo, reduz EF).' },
      { id:'i8b3', title:'Último Suspiro',     desc:'Quando seria morto, aumenta EF em 2 para ficar com 1 PV (1× por semana).' },
    ]},

    { level:9,  type:'identity',    id:'i9',  conv:'farol',              title:'Farol Potente',
      desc:'Chama da Humanidade pode ser usada 3× por dia.' },
    { level:9,  type:'identity',    id:'i9b', conv:'resistencia_conv',    title:'Vitalidade Pura',
      desc:'+1d8 em todos os atributos.' },

    { level:10, type:'apotheosis',  id:'i10', title:'Farol da Esperança',
      desc:'Discurso 1× por dia: remove toda a Exaustão de todos os aliados que puderem ouvir. Suas mãos ainda são suas. Você as reconhece.' },
  ],
};
