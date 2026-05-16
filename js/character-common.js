// character-common.js — Funciones compartidas entre páginas de personajes
// Cada página debe definir antes de cargar este script:
//   window.CHAR_PX   — prefijo localStorage (ej: 'kr', 'mu', 'cz')
//   window.CHAR_NAME — nombre visible del personaje
//   window.CHAR_URL  — nombre URL-encoded para API (opcional, default = CHAR_NAME)
//   window.CHAR_SPEC — spec por defecto (fallback si API no responde)

// ── Injected CSS ──
(function(){var s=document.createElement('style');s.textContent='.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:14px}.stat-card{background:var(--bg2);border:1px solid var(--b1);border-radius:8px;padding:15px;text-align:center}.stat-val{font-family:"Cinzel",serif;font-size:1.4em;font-weight:600;display:block}.stat-label{font-size:.66em;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:4px}.moneda-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--b1)}.moneda-row:last-child{border-bottom:none}.moneda-name{font-size:.82em;font-weight:500;width:140px;flex-shrink:0}.moneda-input{width:72px;background:var(--bg3);border:1px solid var(--b2);color:var(--text);font-family:"Cinzel",serif;font-size:1em;text-align:center;padding:4px 6px;border-radius:4px}.moneda-pbar{flex:1;height:7px;background:var(--b2);border-radius:3px;overflow:hidden}.moneda-pfill{height:100%;border-radius:3px;transition:width .3s}.moneda-pct{font-size:.7em;color:var(--muted);width:34px;text-align:right}.gear-bis-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}@media(max-width:700px){.gear-bis-grid{grid-template-columns:1fr}}.gear-section-title{font-family:"Cinzel",serif;font-size:.74em;letter-spacing:2px;color:var(--ac);text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--b1);display:flex;align-items:center;gap:8px}.dungeon-rank-row{display:flex;align-items:center;gap:10px;margin-bottom:6px}.dungeon-rank-bar{flex:1;height:8px;background:var(--b2);border-radius:4px;overflow:hidden}.dungeon-rank-fill{height:100%;border-radius:4px;transition:width .3s}.dungeon-rank-name{font-size:.8em;width:140px;flex-shrink:0}.dungeon-rank-count{font-size:.75em;color:var(--muted);width:60px;text-align:right}';document.head.appendChild(s)})();

const PX = window.CHAR_PX || 'kr';
const N  = window.CHAR_URL || window.CHAR_NAME || 'Kreathor';
const R  = 'us';
const RL = 'quelthalas';

let CHAR_DATA = null;

// ── Tab switching ──
function ST(id) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`[onclick="ST('${id}')"]`).classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
}

// ── Score color ──
function SC(s) {
  if (s >= 3000) return '#ff8000';
  if (s >= 2000) return '#a335ee';
  if (s >= 1500) return '#0070dd';
  if (s >= 1000) return '#1eff00';
  if (s > 0) return '#ffffff';
  return '#aaa';
}

// ── Reset countdown ──
function nextReset() {
  const n = new Date(), d = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), 15, 0, 0));
  let diff = (2 - d.getUTCDay() + 7) % 7;
  if (diff === 0 && n >= d) diff = 7;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}
function tick() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const ms = nextReset() - Date.now();
  if (ms <= 0) { tick(); return; }
  const dy = Math.floor(ms / 86400000), hr = Math.floor(ms % 86400000 / 3600000),
        mn = Math.floor(ms % 3600000 / 60000), sc = Math.floor(ms % 60000 / 1000);
  const p = [];
  if (dy) p.push(dy + 'd');
  p.push(String(hr).padStart(2, '0') + 'h ' + String(mn).padStart(2, '0') + 'm ' + String(sc).padStart(2, '0') + 's');
  el.textContent = p.join(' ');
}
setInterval(tick, 1000);
try { tick(); } catch(e) { console.error('tick():', e); }

// ── Checklist ──
function wKey() {
  const r = nextReset();
  r.setUTCDate(r.getUTCDate() - 7);
  return PX + '_w_' + r.toISOString().slice(0, 10);
}
function dKey() {
  const n = new Date(), c = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), 15, 0, 0)),
        b = n < c ? new Date(c - 86400000) : c;
  return PX + '_d_' + b.toISOString().slice(0, 10);
}
function lC(k) {
  try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch { return {}; }
}
function toggle(sk, id) {
  const d = lC(sk);
  d[id] = !d[id];
  localStorage.setItem(sk, JSON.stringify(d));
  renderCL();
  renderTL();
}
function clearAll() {
  if (!confirm('Limpiar todas las tareas?')) return;
  localStorage.removeItem(wKey());
  localStorage.removeItem(dKey());
  renderCL();
  renderTL();
}

const WT = [
  { id: 'wb',    t: 'World Boss',                  s: 'Matar el jefe activo esta semana',      g: 'w' },
  { id: 'vault', t: 'Great Vault (martes)',         s: 'Abrir vault y reclamar recompensas',    g: 'v' },
  { id: 'voids', t: 'Raid &mdash; Voidspire',      s: 'Normal / Heroic / Mythic (6 jefes)',    g: 'w' },
  { id: 'dream', t: 'Raid &mdash; Dreamrift',       s: '1 jefe &mdash; r&aacute;pido y con tier', g: 'w' },
  { id: 'march', t: "Raid &mdash; March on Quel'Danas", s: '2 jefes finales de la temporada',   g: 'w' },
  { id: 'pr1',   t: 'Nightmare Prey 1/3',           s: '3 Prey totales para quest Lady Liadrin', g: 'w' },
  { id: 'pr2',   t: 'Nightmare Prey 2/3',           s: '',                                       g: 'w' },
  { id: 'pr3',   t: 'Nightmare Prey 3/3',           s: 'Entregar &rarr; obtener Spark',          g: 'w' },
  { id: 'liad',  t: 'World Event (Lady Liadrin)',   s: 'Quest semanal de evento por Spark',      g: 'w' },
  { id: 'hous',  t: 'Housing Weekly (Vaeli)',       s: 'Quest semanal banco de Silvermoon',      g: 'w' },
  { id: 'm1',    t: 'M+ Vault 1/8',                 s: '8 mazmorras = 3 opciones en Great Vault',g: 'v' },
  { id: 'm2',    t: 'M+ Vault 2/8',                 s: '',                                       g: 'v' },
  { id: 'm3',    t: 'M+ Vault 3/8',                 s: '',                                       g: 'v' },
  { id: 'm4',    t: 'M+ Vault 4/8',                 s: '',                                       g: 'v' },
  { id: 'm5',    t: 'M+ Vault 5/8',                 s: '',                                       g: 'v' },
  { id: 'm6',    t: 'M+ Vault 6/8',                 s: '',                                       g: 'v' },
  { id: 'm7',    t: 'M+ Vault 7/8',                 s: '',                                       g: 'v' },
  { id: 'm8',    t: 'M+ Vault 8/8',                 s: 'Vault 100% desbloqueado!',               g: 'v' },
];
const DT = [
  { id: 't11',   t: 'Delve T11',                   s: 'Al menos 1 Delve nivel 11 para crests',  g: 'd' },
  { id: 'boun',  t: 'Bountiful Delve',              s: 'Cofre adicional diario',                 g: 'd' },
  { id: 'crest', t: 'Crests farming (M+)',          s: 'Farmear crests para upgrades',           g: 'd' },
];
const TL2 = { 'w': 'tw', 'd': 'td', 'v': 'tv' };
const TLlbl = { 'w': 'Semanal', 'd': 'Diaria', 'v': 'Vault' };

function mkItem(sk, t) {
  const done = lC(sk)[t.id] || false;
  return `<div class="check-item${done ? ' done' : ''}" onclick="toggle('${sk}','${t.id}')">
    <div class="check-box">${done ? '&#10003;' : ''}</div>
    <div class="check-lbl"><div class="check-lbl-t">${t.t}</div>${t.s ? `<div class="check-lbl-s">${t.s}</div>` : ''}</div>
    <span class="ctag ${TL2[t.g]}">${TLlbl[t.g]}</span>
  </div>`;
}
function renderCL() {
  const dlbl = document.getElementById('dlbl');
  if (!dlbl) return;
  const wk = wKey(), dk = dKey(), wd = lC(wk), dd = lC(dk);
  dlbl.textContent = '— ' + new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'short' });
  document.getElementById('wList').innerHTML = WT.map(t => mkItem(wk, t)).join('');
  document.getElementById('dList').innerHTML = DT.map(t => mkItem(dk, t)).join('');
  const wD = WT.filter(t => wd[t.id]).length, dD = DT.filter(t => dd[t.id]).length;
  const mD = WT.filter(t => t.id.startsWith('m') && wd[t.id]).length;
  const rD = [wd.voids, wd.dream, wd.march].filter(Boolean).length;
  const pD = [wd.pr1, wd.pr2, wd.pr3].filter(Boolean).length;
  function bar(l, v, t, c) {
    return `<div class="prow"><span class="plbl">${l}</span><div class="pbg"><div class="pf" style="width:${Math.round(v / t * 100)}%;background:${c}"></div></div><span class="ppct">${v}/${t}</span></div>`;
  }
  document.getElementById('pCard').innerHTML =
    bar('Semanal', wD, WT.length, 'var(--gold)') + bar('Diario', dD, DT.length, '#2ecc71') +
    bar('M+ Vault', mD, 8, '#5ab4ff') + bar('Raids', rD, 3, '#c084f5') + bar('Nightmare Prey', pD, 3, '#e67e22') +
    '<p style="font-size:.7em;color:var(--muted);margin-top:10px">Reset semanal: martes 15:00 UTC &middot; Diario: cada d&iacute;a 15:00 UTC</p>';
}
try { renderCL(); } catch(e) { console.error('renderCL:', e); }

// ── Timeline semanal ──
const WEEK_PLAN = [
  { day: 'Martes', label: 'RESET', isReset: true, tasks: [
    { name: 'Abrir Great Vault', color: '#c084f5', key: 'vault' },
    { name: 'World Boss semanal', color: '#e67e22', key: 'wb' },
    { name: '2-3 M+ para el vault', color: '#5ab4ff', key: 'm1' },
  ]},
  { day: 'Martes\ntarde', label: '', tasks: [
    { name: 'Nightmare Prey 1/3', color: '#e67e22', key: 'pr1' },
    { name: 'Raid — Voidspire', color: '#ff6b80', key: 'voids' },
    { name: 'Delve T11 + Bountiful', color: 'var(--green)', key: 't11' },
  ]},
  { day: 'Miércoles', label: '', tasks: [
    { name: 'Raid — Dreamrift', color: '#ff6b80', key: 'dream' },
    { name: 'Nightmare Prey 2/3', color: '#e67e22', key: 'pr2' },
    { name: '2-3 M+ vault', color: '#5ab4ff', key: 'm4' },
    { name: 'Crests farming', color: '#60a5fa', key: 'crest' },
  ]},
  { day: 'Jueves', label: '', tasks: [
    { name: "Raid — March on Quel'Danas", color: '#ff6b80', key: 'march' },
    { name: 'Nightmare Prey 3/3 → Spark', color: '#e67e22', key: 'pr3' },
    { name: 'Lady Liadrin Event', color: 'var(--gold)', key: 'liad' },
  ]},
  { day: 'Viernes', label: '', tasks: [
    { name: '2-3 M+ vault', color: '#5ab4ff', key: 'm6' },
    { name: 'Housing Weekly (Vaeli)', color: 'var(--gold)', key: 'hous' },
    { name: 'Crests farming', color: '#60a5fa', key: 'crest' },
  ]},
  { day: 'Sábado', label: '', tasks: [
    { name: 'M+ Push (score)', color: '#5ab4ff', key: 'm7' },
    { name: 'Crests farming', color: '#60a5fa', key: 'crest' },
  ]},
  { day: 'Domingo', label: '', tasks: [
    { name: 'M+ extra / prog', color: '#5ab4ff', key: 'm8' },
    { name: 'Preparar para reset', color: 'var(--muted)', key: '' },
  ]},
  { day: 'Lunes', label: '', tasks: [
    { name: 'Último día antes del reset', color: 'var(--muted)', key: '' },
    { name: 'Revisar vault del martes', color: '#c084f5', key: 'vault' },
  ]},
];
const TODAY_DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function renderTL() {
  const wd = lC(wKey()), dd = lC(dKey());
  const todayName = TODAY_DAYS[new Date().getDay()];
  let h = '';
  WEEK_PLAN.forEach(entry => {
    const isToday = entry.day.startsWith(todayName) || todayName === entry.day;
    const dotClass = entry.isReset ? 'reset-dot' : isToday ? 'today-dot' : '';
    h += `<div class="tl-day">
      <div class="tl-day-label${entry.isReset ? ' reset' : ''}">${entry.day.replace('\n', '<br>')}</div>
      <div class="tl-dot ${dotClass}"></div>
      <div class="tl-content"><div class="tl-tasks">`;
    entry.tasks.forEach(task => {
      const done = task.key ? (wd[task.key] || dd[task.key]) : false;
      h += `<div class="tl-task${done ? ' done' : ''}">
        <div class="tl-task-dot" style="background:${task.color}"></div>
        <span class="tl-task-name">${task.name}</span>
        ${done ? '<span style="font-size:.68em;color:var(--green)">&#10003; hecho</span>' : ''}
      </div>`;
    });
    h += '</div></div></div>';
  });
  document.getElementById('tlContainer').innerHTML = h;
}
try { renderTL(); } catch(e) { console.error('renderTL:', e); }

// ── Tracker Crests ──
const CREST_TYPES = [
  { id: 'whelp', name: "Whelpling's Crest", color: '#6b7280', limit: 90, col: '#9ca3af' },
  { id: 'drake', name: "Drake's Crest", color: '#16a34a', limit: 90, col: '#4ade80' },
  { id: 'wyrm', name: "Wyrm's Crest", color: '#1d4ed8', limit: 90, col: '#60a5fa' },
  { id: 'aspect', name: "Aspect's Crest", color: '#7e22ce', limit: 15, col: '#c084f5' },
];
function crestKey() {
  const r = nextReset();
  r.setUTCDate(r.getUTCDate() - 7);
  return PX + '_crests_' + r.toISOString().slice(0, 10);
}
function lCrests() {
  try { return JSON.parse(localStorage.getItem(crestKey()) || '{}'); } catch { return {}; }
}
function renderCrestInputs() {
  const saved = lCrests();
  let h = '';
  CREST_TYPES.forEach(ct => {
    const val = saved[ct.id] || 0;
    const pct = Math.min(Math.round(val / ct.limit * 100), 100);
    h += `<div class="crest-input-row">
      <div class="crest-color" style="background:${ct.color}"></div>
      <span class="crest-name">${ct.name}</span>
      <input type="number" class="crest-num" id="ci_${ct.id}" value="${val}" min="0" max="${ct.limit}" oninput="updateCrestBar('${ct.id}')">
      <span class="crest-limit">/ ${ct.limit}</span>
      <div class="crest-pbar"><div class="crest-pfill" id="cpf_${ct.id}" style="width:${pct}%;background:${ct.col}"></div></div>
      <span class="crest-pct" id="cpp_${ct.id}">${pct}%</span>
    </div>`;
  });
  document.getElementById('crestInputs').innerHTML = h;
  updateCrestPlan();
}
function updateCrestBar(id) {
  const ct = CREST_TYPES.find(c => c.id === id);
  if (!ct) return;
  const val = Math.min(parseInt(document.getElementById('ci_' + id).value) || 0, ct.limit);
  const pct = Math.round(val / ct.limit * 100);
  document.getElementById('cpf_' + id).style.width = pct + '%';
  document.getElementById('cpp_' + id).textContent = pct + '%';
}
function saveCrests() {
  const data = {};
  CREST_TYPES.forEach(ct => { data[ct.id] = parseInt(document.getElementById('ci_' + ct.id).value) || 0; });
  localStorage.setItem(crestKey(), JSON.stringify(data));
  const hKey = PX + '_crests_hist';
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem(hKey) || '[]'); } catch {}
  const week = crestKey().replace(PX + '_crests_', '');
  const existing = hist.findIndex(h => h.week === week);
  if (existing >= 0) hist[existing] = { week, ...data };
  else hist.unshift({ week, ...data });
  hist = hist.slice(0, 8);
  localStorage.setItem(hKey, JSON.stringify(hist));
  const lbl = document.getElementById('crestSaveLabel');
  if (lbl) { lbl.textContent = '&#10003; Guardado'; lbl.style.opacity = 1; setTimeout(() => { lbl.style.opacity = 0; }, 2000); }
  updateCrestPlan();
  renderCrestHistory();
}
function resetCrests() {
  if (!confirm('Resetear crests de esta semana?')) return;
  localStorage.removeItem(crestKey());
  renderCrestInputs();
}
function updateCrestPlan() {
  const saved = lCrests();
  const el = document.getElementById('crestPlanCard');
  if (!el) return;
  const wyrm = saved.wyrm || 0, aspect = saved.aspect || 0;
  const upgrades = [];
  if (wyrm > 0) {
    const steps = Math.floor(wyrm / 15);
    upgrades.push({ crest: "Wyrm's", have: wyrm, steps, pcs: Math.floor(steps / 1), desc: 'Pieza Heroic/Hero (15 crests/step)' });
  }
  if (aspect > 0) {
    const steps = Math.floor(aspect / 15);
    upgrades.push({ crest: "Aspect's", have: aspect, steps, pcs: Math.floor(steps / 1), desc: 'Pieza Hero max/Mythic (15 crests/step)' });
  }
  if (!upgrades.length) {
    el.innerHTML = '<h3>Plan de upgrades</h3><p style="color:var(--muted);font-size:.83em;margin-top:8px">Sin crests registrados a&uacute;n.</p>';
    return;
  }
  let h = '<h3>Plan de upgrades con crests actuales</h3><div class="upgrade-plan">';
  upgrades.forEach(u => {
    h += `<div class="up-row"><span style="color:${u.crest === "Wyrm's" ? '#60a5fa' : '#c084f5'}">${u.crest} Crest</span><span><strong style="font-size:1.1em">${u.have}</strong> / ${u.crest === "Wyrm's" ? 90 : 15}</span></div>
    <div class="up-row"><span style="color:var(--muted)">Pasos de upgrade posibles</span><span style="color:var(--green);font-weight:600">${u.steps} steps</span></div>
    <div class="up-row"><span style="color:var(--muted)">Equivale a</span><span>~${u.steps} slots de 1 upgrade cada uno</span></div>`;
  });
  h += '</div><p style="font-size:.7em;color:var(--muted);margin-top:10px">Armadura: 15 crests/step &middot; Arma 2H: 30 crests/step</p>';
  el.innerHTML = h;
}
function renderCrestHistory() {
  const el = document.getElementById('crestHistory');
  if (!el) return;
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem(PX + '_crests_hist') || '[]'); } catch {}
  if (!hist.length) { el.innerHTML = '<p style="color:var(--muted);font-size:.83em">Sin historial guardado a&uacute;n.</p>'; return; }
  let h = '<table style="width:100%;border-collapse:collapse;font-size:.8em"><thead><tr>';
  h += '<th style="text-align:left;padding:6px 8px;color:var(--muted);font-size:.72em;border-bottom:1px solid var(--b2)">Semana</th>';
  CREST_TYPES.forEach(ct => { h += `<th style="text-align:center;padding:6px 8px;color:${ct.col};font-size:.72em;border-bottom:1px solid var(--b2)">${ct.name.split("'")[0]}'s</th>`; });
  h += '</tr></thead><tbody>';
  hist.forEach(row => {
    h += `<tr style="border-bottom:1px solid var(--b1)"><td style="padding:7px 8px;color:var(--muted);font-size:.78em">${row.week}</td>`;
    CREST_TYPES.forEach(ct => {
      const val = row[ct.id] || 0, pct = Math.round(val / ct.limit * 100);
      h += `<td style="text-align:center;padding:7px 8px"><span style="color:${ct.col};font-weight:600">${val}</span><span style="font-size:.75em;color:var(--muted)">/${ct.limit}</span></td>`;
    });
    h += '</tr>';
  });
  h += '</tbody></table>';
  el.innerHTML = h;
}
try { renderCrestInputs(); renderCrestHistory(); } catch(e) { console.error('crest init:', e); }

// ── Notas por mazmorra ──
const DNGS_LIST = [
  { id: 'aa',   name: "Algeth'ar Academy",      emoji: '&#127981;', tags: ['Interrumpir', 'AoE pesado', 'Skip disponible'] },
  { id: 'mc',   name: 'Maisara Caverns',        emoji: '&#127755;', tags: ['Bolsas', 'Ruta alternativa', 'Boss mecánica'] },
  { id: 'npx',  name: 'Nexus-Point Xenas',      emoji: '&#127758;', tags: ['Patios que saltar', 'Boss difícil', 'Pulls grandes'] },
  { id: 'wrs',  name: 'Windrunner Spire',       emoji: '&#127748;', tags: ['Interrumpir', 'Adds boss', 'Skip'] },
  { id: 'mt',   name: "Magisters' Terrace",     emoji: '&#127962;', tags: ['Clásica', 'Interrumpir', 'Skip acceso'] },
  { id: 'pos',  name: 'Pit of Saron',           emoji: '&#10052;',  tags: ['Clásica', 'Minas', 'Interrupt cast crucial'] },
  { id: 'seat', name: 'Seat of the Triumvirate',emoji: '&#127758;', tags: ['Clásica', 'Void', 'Boss final mecánica'] },
  { id: 'sky',  name: 'Skyreach',               emoji: '&#127965;', tags: ['Clásica', 'Wind', 'Pulls aéreos'] },
];
let curDng = null;

function initNotes() {
  const sel = document.getElementById('dngSelector');
  if (!sel) return;
  DNGS_LIST.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'dng-btn';
    btn.innerHTML = `${d.emoji} ${d.name}`;
    btn.onclick = () => selectDng(d.id);
    sel.appendChild(btn);
  });
}
function selectDng(id) {
  curDng = id;
  const d = DNGS_LIST.find(x => x.id === id);
  if (!d) return;
  document.querySelectorAll('.dng-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.dng-btn').forEach(b => { if (b.textContent.includes(d.name.substring(0, 5))) b.classList.add('selected'); });
  document.getElementById('noteTitle').innerHTML = `${d.emoji} ${d.name}`;
  const tagsEl = document.getElementById('noteTags');
  if (tagsEl) {
    tagsEl.innerHTML = (d.tags || []).map(tag =>
      `<span class="ntag" style="background:rgba(248,183,0,.1);color:var(--gold);border-color:rgba(248,183,0,.25)" onclick="insertTag('${tag}')">${tag}</span>`
    ).join('');
  }
  const saved = localStorage.getItem(PX + '_note_' + id) || '';
  document.getElementById('noteTextarea').value = saved;
  document.getElementById('noteEditor').style.display = 'block';
  document.getElementById('noteEmpty').style.display = 'none';
}
function insertTag(tag) {
  const ta = document.getElementById('noteTextarea');
  const pos = ta.selectionStart;
  const val = ta.value;
  ta.value = val.slice(0, pos) + '[' + tag + '] ' + val.slice(pos);
  ta.focus();
  ta.setSelectionRange(pos + tag.length + 3, pos + tag.length + 3);
}
function saveNote() {
  if (!curDng) return;
  localStorage.setItem(PX + '_note_' + curDng, document.getElementById('noteTextarea').value);
  const s = document.getElementById('noteSaved');
  if (s) { s.style.opacity = 1; setTimeout(() => s.style.opacity = 0, 2000); }
}
function clearNote() {
  if (!curDng) return;
  if (!confirm('Borrar notas de esta mazmorra?')) return;
  localStorage.removeItem(PX + '_note_' + curDng);
  document.getElementById('noteTextarea').value = '';
}
document.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 's' && curDng) { e.preventDefault(); saveNote(); } });
try { initNotes(); } catch(e) { console.error('initNotes:', e); }

// ── Dungeon scores ──
const DNGS_IO = ["Algeth'ar Academy", "Maisara Caverns", "Nexus-Point Xenas", "Windrunner Spire", "Magisters' Terrace", "Pit of Saron", "Seat of the Triumvirate", "Skyreach"];

function renderDG(best) {
  const el = document.getElementById('dgContent');
  if (!el) return;
  const map = {};
  (best || []).forEach(r => {
    const k = DNGS_IO.find(n => r.dungeon && r.dungeon.toLowerCase().includes(n.split(' ')[0].toLowerCase().replace("'", "")));
    if (k && (!map[k] || r.score > map[k].score)) map[k] = r;
  });
  const mx = Math.max(...Object.values(map).map(r => r.score || 0), 1);
  let h = '<div class="dg-grid">';
  DNGS_IO.forEach(name => {
    const r = map[name];
    const col = r ? SC(r.score) : '#555';
    const pct = r ? Math.round(r.score / mx * 100) : 0;
    const t = r && r.num_keystone_upgrades > 0;
    h += `<div class="dg-card ${r ? 'has' : 'no'}">
      <div class="dg-name">${name}</div>
      <div class="dg-key" style="color:${col}">${r ? '+' + r.mythic_level : '&mdash;'}${r ? `<span style="font-size:.38em;vertical-align:middle;color:${t ? '#2ecc71' : '#e74c3c'}"> ${t ? 'EN TIEMPO' : 'FUERA'}</span>` : ''}</div>
      ${r ? `<div class="dg-bbg"><div class="dg-bfill" style="width:${pct}%;background:${col}"></div></div><div class="dg-pts">${Math.round(r.score)} pts</div>` : '<div style="font-size:.72em;color:var(--muted);margin-top:5px">Sin run registrado</div>'}
    </div>`;
  });
  h += '</div>';
  const tot = Object.values(map).reduce((s, r) => s + (r.score || 0), 0);
  const ti = Object.values(map).filter(r => r.num_keystone_upgrades > 0).length;
  h += `<div class="card" style="max-width:380px;margin-top:4px"><div style="display:flex;gap:22px">
    <div class="hstat"><span class="hstat-val" style="color:${SC(tot)}">${Math.round(tot).toLocaleString()}</span><span class="hstat-label">Score total</span></div>
    <div class="hstat"><span class="hstat-val" style="color:#2ecc71">${ti}/8</span><span class="hstat-label">En tiempo</span></div>
    <div class="hstat"><span class="hstat-val" style="color:#5ab4ff">${Object.keys(map).length}/8</span><span class="hstat-label">Registradas</span></div>
  </div></div>`;
  el.innerHTML = h;
}

// ── Render M+ Runs ──
function renderMP(d) {
  const rec = d.mythic_plus_recent_runs || [], best = d.mythic_plus_best_runs || [];
  let h = '';
  if (best.length) {
    h += '<div class="stitle" style="margin-bottom:10px"><span class="acc">&#10022;</span> Mejores Runs</div><div class="rg" style="margin-bottom:22px">';
    best.slice(0, 8).forEach(r => {
      const t = r.num_keystone_upgrades > 0;
      h += `<div class="rc"><div class="rkey"><span class="rkl">+${r.mythic_level}</span><span class="rks">${t ? '&#10003;' : '&#10007;'}</span></div><div class="ri"><div class="rdn">${r.dungeon}</div><div class="rm">${t ? '<span class="t-yes">En tiempo</span>' : '<span class="t-no">Fuera</span>'} &middot; ${new Date(r.completed_at).toLocaleDateString('es-CL')}</div></div><div class="rsc" style="color:${SC(r.score)}">${Math.round(r.score)}</div></div>`;
    });
    h += '</div>';
  }
  if (rec.length) {
    h += '<div class="stitle" style="margin-bottom:10px"><span class="acc">&#10022;</span> Runs Recientes</div><div class="rg">';
    rec.slice(0, 9).forEach(r => {
      const t = r.num_keystone_upgrades > 0;
      h += `<div class="rc"><div class="rkey"><span class="rkl">+${r.mythic_level}</span><span class="rks">${t ? '&#10003;' : '&#10007;'}</span></div><div class="ri"><div class="rdn">${r.dungeon}</div><div class="rm">${t ? '<span class="t-yes">En tiempo</span>' : '<span class="t-no">Fuera</span>'} &middot; ${new Date(r.completed_at).toLocaleDateString('es-CL')}</div></div><div class="rsc" style="color:${SC(r.score)}">${Math.round(r.score)}</div></div>`;
    });
    h += '</div>';
  }
  if (!h) h = '<p style="color:var(--muted);font-size:.83em;padding:14px 0">Sin runs registradas a&uacute;n.</p>';
  document.getElementById('mpContent').innerHTML = h;
}

// ── Render Raid Progreso ──
function renderRaid(d) {
  const prog = d.raid_progression || {};
  const raids = [{ key: 'tier-mn-1', name: 'Midnight Tier 1', total: 9 }];
  let h = '';
  raids.forEach(r => {
    const p = prog[r.key];
    if (!p) return;
    const nk = p.normal_bosses_killed || 0, hk = p.heroic_bosses_killed || 0, mk = p.mythic_bosses_killed || 0;
    h += `<div class="rb"><div class="rbn">&#9876; ${r.name} <span style="font-size:.8em;color:var(--muted)">${r.total} jefes</span></div>
      <div class="dr"><span class="dl" style="color:var(--purp)">Mythic</span><div class="dbg"><div class="dbf" style="width:${mk / r.total * 100}%;background:linear-gradient(90deg,#6b21a8,#c084f5)"></div></div><span class="dk2" style="color:var(--purp)">${mk}/${r.total}</span></div>
      <div class="dr"><span class="dl" style="color:var(--blue)">Heroic</span><div class="dbg"><div class="dbf" style="width:${hk / r.total * 100}%;background:linear-gradient(90deg,#1a78c2,#5ab4ff)"></div></div><span class="dk2" style="color:var(--blue)">${hk}/${r.total}</span></div>
      <div class="dr"><span class="dl" style="color:#6b7280">Normal</span><div class="dbg"><div class="dbf" style="width:${nk / r.total * 100}%;background:linear-gradient(90deg,#374151,#6b7280)"></div></div><span class="dk2" style="color:#6b7280">${nk}/${r.total}</span></div>
    </div>`;
  });
  if (!h) h = '<p style="color:var(--muted);font-size:.83em;padding:14px 0">Sin progreso registrado.</p>';
  document.getElementById('raidContent').innerHTML = h;
}

// ── Hero stats (básico, las páginas pueden sobreescribir para extenderse) ──
function renderHero(d) {
  const sc = d.mythic_plus_scores_by_season?.[0]?.scores?.all ?? 0;
  const il = d.gear?.item_level_equipped ?? '&mdash;';
  const sp = d.active_spec_name || (window.CHAR_SPEC || 'Blood');
  if (d.thumbnail_url) document.getElementById('portrait').outerHTML = `<img class="char-portrait" src="${d.thumbnail_url}" alt="${window.CHAR_NAME || 'Personaje'}">`;
  document.getElementById('heroStats').innerHTML = `
    <div class="hstat"><span class="hstat-val" style="color:${SC(sc)}">${Math.round(sc).toLocaleString()}</span><span class="hstat-label">M+ Score</span></div>
    <div class="hstat"><span class="hstat-val" style="color:var(--gold)">${il}</span><span class="hstat-label">Item Level</span></div>
    <div class="hstat"><span class="hstat-val" style="color:var(--blue)">${sp}</span><span class="hstat-label">Spec</span></div>
    <div class="hstat"><span class="hstat-val" style="color:#888">Midnight S1</span><span class="hstat-label">Temporada</span></div>`;
  const rio = `https://raider.io/characters/${R}/${RL}/${N}`;
  const arm = `https://worldofwarcraft.blizzard.com/en-us/character/${R}/${RL}/${N}`;
  document.getElementById('heroLinks').innerHTML = `
    <a class="hl hl-rio" href="${rio}" target="_blank">Raider.io &#8599;</a>
    <a class="hl hl-ext" href="${arm}" target="_blank">Armory &#8599;</a>`;
  if (document.getElementById('statsContent')) renderStats(d);
}

// ── Stats panel ──
function renderStats(d) {
  const el = document.getElementById('statsContent');
  if (!el) return;
  let stats = d.gear?.stats;
  let ilvl = d.gear?.item_level_equipped;
  if ((!stats || !Object.keys(stats).length) && CHAR_DATA && CHAR_DATA.blizzard && CHAR_DATA.blizzard.stats) {
    const bs = CHAR_DATA.blizzard.stats;
    stats = bs.stats || {};
    ilvl = bs.ilvl || 0;
  }
  if (!stats || !Object.keys(stats).length) {
    el.innerHTML = '<p style="color:var(--muted);font-size:.83em;padding:14px 0">Stats no disponibles.</p>';
    return;
  }
  const cls = d.class || '';
  const primaryMap = {
    'Death Knight':'strength','Demon Hunter':'agility','Druid':'agility',
    'Monk':'agility','Paladin':'strength','Warrior':'strength',
    'Hunter':'agility','Rogue':'agility','Evoker':'intellect','Mage':'intellect',
    'Priest':'intellect','Warlock':'intellect'
  };
  const shamanSpec = d.active_spec_name || '';
  const isEleResto = shamanSpec === 'Elemental' || shamanSpec === 'Restoration';
  const pKey = cls === 'Shaman' ? (isEleResto ? 'intellect' : 'agility') : (primaryMap[cls] || 'strength');
  const pLabel = {strength:'Fuerza',agility:'Agilidad',intellect:'Intelecto'}[pKey] || 'Fuerza';
  const primVal = stats[pKey] || 0;
  const fmt = v => Math.round(v).toLocaleString();
  const defs = [
    {l:'Item Level',v:ilvl||0,c:'var(--gold)',f:true},
    {l:'Health',v:stats.health||0,c:'#2ecc71',f:true},
    {l:pLabel,v:primVal,c:'var(--ac)',f:true},
    {l:'Stamina',v:stats.stamina||0,c:'#5ab4ff',f:true},
    {l:'Cr\u00edtico',v:(stats.crit||0).toFixed(1)+'%',c:'#ff4466',f:false},
    {l:'Prisa',v:(stats.haste||0).toFixed(1)+'%',c:'#44aaff',f:false},
    {l:'Maestr\u00eda',v:(stats.mastery||0).toFixed(1)+'%',c:'#c084f5',f:false},
    {l:'Versatilidad',v:(stats.versatility||0).toFixed(1)+'%',c:'#ff8844',f:false},
    {l:'Leech',v:(stats.leech||0).toFixed(1)+'%',c:'#e67e22',f:false},
    {l:'Speed',v:(stats.speed||0).toFixed(1)+'%',c:'#4ade80',f:false},
    {l:'Avoidance',v:(stats.avoidance||0).toFixed(1)+'%',c:'#9ca3af',f:false},
  ];
  el.innerHTML = '<div class="stats-grid">' + defs.map(s =>
    '<div class="stat-card"><div class="stat-val" style="color:' + s.c + '">' + (s.f ? fmt(s.v) : s.v) + '</div><div class="stat-label">' + s.l + '</div></div>'
  ).join('') + '</div>';
}

// ── Monedas / Currency tracker ──
function renderMonedas() {
  const el = document.getElementById('monedasContent');
  if (!el) return;
  const mKey = PX + '_monedas';
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(mKey) || '{}'); } catch(e) {}
  if (Object.keys(saved).length === 0 && CHAR_DATA && CHAR_DATA.blizzard && CHAR_DATA.blizzard.monedas) {
    saved = CHAR_DATA.blizzard.monedas;
    localStorage.setItem(mKey, JSON.stringify(saved));
  }
  var currs = [
    {id:'valorstones',n:'Valorstones',l:9999,c:'#fbbf24',bar:true},
    {id:'whelp',n:"Whelpling's Crest",l:90,c:'#9ca3af',bar:true},
    {id:'drake',n:"Drake's Crest",l:90,c:'#4ade80',bar:true},
    {id:'wyrm',n:"Wyrm's Crest",l:90,c:'#60a5fa',bar:true},
    {id:'aspect',n:"Aspect's Crest",l:15,c:'#c084f5',bar:true},
    {id:'gold',n:'Gold',l:0,c:'#fbbf24',bar:false}
  ];
  var h = '';
  for (var i = 0; i < currs.length; i++) {
    var c = currs[i], val = saved[c.id] || 0, pct = c.bar ? Math.min(Math.round(val / c.l * 100), 100) : 0;
    h += '<div class="moneda-row"><span class="moneda-name" style="color:' + c.c + '">' + c.n + '</span>' +
      '<input type="number" class="moneda-input" id="mon_' + c.id + '" value="' + val + '" min="0"' + (c.l ? ' max="' + c.l + '"' : '') + ' oninput="saveMonedas()">' +
      (c.bar ? '<div class="moneda-pbar"><div class="moneda-pfill" id="mpf_' + c.id + '" style="width:' + pct + '%;background:' + c.c + '"></div></div><span class="moneda-pct" id="mpp_' + c.id + '">' + pct + '%</span>' : '') +
      '</div>';
  }
  h += '<button onclick="resetMonedas()" style="background:var(--bg3);border:1px solid var(--b2);color:var(--muted);padding:6px 14px;border-radius:4px;cursor:pointer;font-size:.75em;margin-top:10px">Resetear</button>';
  el.innerHTML = h;
}
function saveMonedas() {
  var mKey = PX + '_monedas';
  var ids = ['valorstones','whelp','drake','wyrm','aspect','gold'];
  var limits = {valorstones:9999,whelp:90,drake:90,wyrm:90,aspect:15};
  var data = {};
  for (var i = 0; i < ids.length; i++) {
    var inp = document.getElementById('mon_' + ids[i]);
    data[ids[i]] = inp ? parseInt(inp.value) || 0 : 0;
    if (limits[ids[i]]) {
      var p = Math.min(Math.round(data[ids[i]] / limits[ids[i]] * 100), 100);
      var bar = document.getElementById('mpf_' + ids[i]);
      var pEl = document.getElementById('mpp_' + ids[i]);
      if (bar) bar.style.width = p + '%';
      if (pEl) pEl.textContent = p + '%';
    }
  }
  localStorage.setItem(mKey, JSON.stringify(data));
}
function resetMonedas() {
  if (!confirm('Resetear monedas/crests de esta semana?')) return;
  localStorage.removeItem(PX + '_monedas');
  renderMonedas();
}

// ── Cargar datos desde datos.json ──
async function loadFromJson() {
  try {
    const r = await fetch('datos.json?t=' + Date.now());
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    const name = window.CHAR_NAME || 'Kreathor';
    CHAR_DATA = d.personajes_data && d.personajes_data[name];
    const rio = CHAR_DATA && CHAR_DATA.rio;
    if (rio) {
      renderHero(rio);
      renderStats(rio);
      renderMonedas();
      renderMP(rio);
      renderRaid(rio);
      renderDG(rio.mythic_plus_best_runs);
    }
  } catch (e) {
    ['heroStats', 'statsContent', 'monedasContent', 'mpContent', 'raidContent', 'dgContent'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<div class="err">Error: ${e.message}</div>`;
    });
  }
}

// ── Upgrade calculator ──
function calcU() {
  const from = parseInt(document.getElementById('uFrom').value), to = parseInt(document.getElementById('uTo').value);
  const isW = document.getElementById('uType').value === 'weapon';
  const el = document.getElementById('uResult');
  if (to <= from) { el.innerHTML = '<h3>Resultado</h3><p style="color:#e74c3c;font-size:.83em;margin-top:8px">El ilvl objetivo debe ser mayor.</p>'; return; }
  const steps = Math.ceil((to - from) / 3), base = isW ? 30 : 15, total = steps * base;
  let ct = "Wyrm's Crest", cc = '#60a5fa', cs = 'M+ 8-9 &middot; Heroic Raid';
  if (to >= 280) { ct = "Aspect's Crest"; cc = '#c084f5'; cs = 'M+ 10+ &middot; Mythic Raid'; }
  else if (to < 244) { ct = "Whelpling's Crest"; cc = '#9ca3af'; cs = 'M+ 2-5 &middot; LFR'; }
  else if (to < 250) { ct = "Drake's Crest"; cc = '#4ade80'; cs = 'M+ 6-7 &middot; Normal'; }
  const wk = Math.ceil(total / 90), wc = wk <= 1 ? '#2ecc71' : wk <= 3 ? '#e67e22' : '#e74c3c';
  el.innerHTML = `<h3 style="margin-bottom:12px">Resultado</h3>
    <div class="ur"><span class="lbl">Upgrade</span><span style="font-weight:600">${from} &rarr; ${to} ilvl</span></div>
    <div class="ur"><span class="lbl">Pasos</span><span>${steps} upgrades</span></div>
    <div class="ur"><span class="lbl">Crest</span><span style="color:${cc}">${ct}</span></div>
    <div class="ur"><span class="lbl">Total crests</span><span style="font-family:'Cinzel',serif;font-size:1.2em;color:var(--gold)">${total}</span></div>
    <div class="ur"><span class="lbl">Fuente</span><span style="font-size:.8em">${cs}</span></div>
    <div class="ur"><span class="lbl">Semanas aprox.</span><span style="color:${wc}">${wk} semana${wk > 1 ? 's' : ''}</span></div>
    ${isW ? '<p style="font-size:.7em;color:var(--muted);margin-top:6px">Armas cuestan 2x crests.</p>' : ''}`;
}

loadFromJson();
