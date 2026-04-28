#!/usr/bin/env python3
"""Genera páginas individuales para los 6 personajes secundarios."""
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

def hex_to_rgb(h):
    h = h.lstrip('#')
    return f"{int(h[0:2],16)},{int(h[2:4],16)},{int(h[4:6],16)}"

CHARS = [
    {'name':'Muchufaza',   'url':'Muchufaza',               'file':'muchufaza',   'cls':'Monk',         'spec':'Brewmaster',  'role':'TANK','color':'#00FF98','px':'mu'},
    {'name':'Czernobög',   'url':'Czernob%C3%B6g',           'file':'czernobog',   'cls':'Druid',        'spec':'Guardian',    'role':'TANK','color':'#FF7C0A','px':'cz'},
    {'name':'Oldkreeper',  'url':'Oldkreeper',               'file':'oldkreeper',  'cls':'Shaman',       'spec':'Elemental',   'role':'DPS', 'color':'#0070DD','px':'ok'},
    {'name':'Redguardïan', 'url':'Redguard%C3%AFan',         'file':'redguardian', 'cls':'Paladin',      'spec':'Retribution', 'role':'DPS', 'color':'#F48CBA','px':'rg'},
    {'name':'Krëeper',     'url':'Kr%C3%ABeper',              'file':'kreeper',     'cls':'Warrior',      'spec':'Protection',  'role':'TANK','color':'#C69B3A','px':'kp'},
    {'name':'Nösferätü',   'url':'N%C3%B6sfer%C3%A4t%C3%BC', 'file':'nosferatu',   'cls':'Demon Hunter', 'spec':'Vengeance',   'role':'TANK','color':'#A330C9','px':'ns'},
]

ROLE_EMOJI = {'TANK':'&#128737;', 'DPS':'&#9876;', 'HEALER':'&#10010;'}
ROLE_TEXT  = {'TANK':'Tanque',    'DPS':'DPS',     'HEALER':'Sanador'}

def gen(c):
    col  = c['color']
    rgb  = hex_to_rgb(col)
    name = c['name']
    url  = c['url']
    cls  = c['cls']
    spec = c['spec']
    px   = c['px']
    re   = ROLE_EMOJI[c['role']]
    rt   = ROLE_TEXT[c['role']]

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{name} — {spec} {cls}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Exo+2:wght@300;400;500;600&display=swap');
:root{{--ac:{col};--gold:#F8B700;--bg:#07080f;--bg2:#0e0f1a;--bg3:#141525;--b1:#1e2035;--b2:#2a2b45;--text:#ccd0e0;--muted:#6a6e8a;--green:#2ecc71;--blue:#5ab4ff;--purp:#c084f5;--ora:#e67e22}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:var(--bg);color:var(--text);font-family:'Exo 2',sans-serif;min-height:100vh}}
a{{color:var(--gold);text-decoration:none}}a:hover{{text-decoration:underline}}
.topnav{{background:rgba(7,8,15,.92);border-bottom:1px solid var(--b2);padding:10px 24px;display:flex;gap:12px;flex-wrap:wrap;position:sticky;top:0;z-index:50;backdrop-filter:blur(8px)}}
.topnav a{{font-size:.8em;font-family:'Cinzel',serif;color:var(--muted);border:1px solid var(--b2);padding:5px 12px;border-radius:4px;transition:all .2s}}
.topnav a:hover{{color:var(--gold);border-color:var(--gold);text-decoration:none}}
.hero{{position:relative;overflow:hidden;background:linear-gradient(135deg,#07080f,#0e0f1a 40%,#141525);border-bottom:2px solid var(--ac);padding:36px 30px 28px}}
.hero::before{{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 600px 300px at 80% 50%,rgba({rgb},.10),transparent 70%);pointer-events:none}}
.hero-inner{{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:24px;position:relative}}
.char-portrait{{width:100px;height:100px;border-radius:50%;border:3px solid var(--ac);box-shadow:0 0 24px rgba({rgb},.5);object-fit:cover;background:#0e0f1a;flex-shrink:0}}
.char-ph{{width:100px;height:100px;border-radius:50%;border:3px solid var(--ac);box-shadow:0 0 24px rgba({rgb},.4);background:linear-gradient(135deg,#0e0f1a,#1a1a2e);display:flex;align-items:center;justify-content:center;font-size:2.5em;flex-shrink:0}}
.hero-info{{flex:1}}
.char-name{{font-family:'Cinzel',serif;font-size:2.2em;font-weight:700;color:var(--ac);text-shadow:0 0 30px rgba({rgb},.6);line-height:1;margin-bottom:6px}}
.char-meta{{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px}}
.bspec{{background:rgba({rgb},.2);border:1px solid rgba({rgb},.5);color:var(--ac);font-size:.76em;font-weight:600;padding:3px 10px;border-radius:4px}}
.brole{{background:rgba(26,120,194,.2);border:1px solid rgba(26,120,194,.4);color:var(--blue);font-size:.76em;padding:3px 10px;border-radius:4px}}
.brealm{{color:var(--muted);font-size:.78em}}
.hero-stats{{display:flex;gap:22px;flex-wrap:wrap}}
.hstat{{text-align:center}}
.hstat-val{{font-family:'Cinzel',serif;font-size:1.5em;font-weight:600;color:#fff;display:block}}
.hstat-label{{font-size:.66em;color:var(--muted);text-transform:uppercase;letter-spacing:1px}}
.hero-links{{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}}
.hl{{font-size:.76em;font-weight:500;padding:5px 12px;border-radius:4px;border:1px solid;transition:all .2s}}
.hl-rio{{border-color:rgba(248,183,0,.5);color:var(--gold)}}.hl-rio:hover{{background:rgba(248,183,0,.1);text-decoration:none}}
.hl-ext{{border-color:var(--b2);color:var(--muted)}}.hl-ext:hover{{color:var(--text);border-color:#444;text-decoration:none}}
.tabs{{display:flex;border-bottom:1px solid var(--b2);background:var(--bg2);padding:0 20px;overflow-x:auto;scrollbar-width:thin}}
.tab-btn{{background:none;border:none;border-bottom:3px solid transparent;color:var(--muted);font-family:'Cinzel',serif;font-size:.72em;font-weight:600;padding:12px 13px;cursor:pointer;white-space:nowrap;transition:all .2s;letter-spacing:.4px}}
.tab-btn:hover{{color:var(--text)}}.tab-btn.active{{color:var(--ac);border-bottom-color:var(--ac)}}
.main{{max-width:1100px;margin:0 auto;padding:22px}}
.tab-panel{{display:none}}.tab-panel.active{{display:block}}
.stitle{{font-family:'Cinzel',serif;font-size:.74em;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:12px;padding-bottom:7px;border-bottom:1px solid var(--b1);display:flex;align-items:center;gap:8px}}
.acc{{color:var(--ac)}}
.card{{background:var(--bg2);border:1px solid var(--b1);border-radius:8px;padding:16px}}
.card h3{{font-family:'Cinzel',serif;font-size:.78em;color:var(--muted);letter-spacing:1px;margin-bottom:12px;text-transform:uppercase}}
.two-col{{display:grid;grid-template-columns:1fr 1fr;gap:18px}}
@media(max-width:700px){{.two-col{{grid-template-columns:1fr}}}}
.check-item{{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--b1);cursor:pointer;user-select:none;transition:opacity .15s}}
.check-item:last-child{{border-bottom:none}}.check-item.done{{opacity:.42}}
.check-box{{width:19px;height:19px;border-radius:4px;border:2px solid var(--b2);flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:.78em;transition:all .15s}}
.check-item.done .check-box{{background:var(--ac);border-color:var(--ac);color:#000}}
.check-lbl{{flex:1}}.check-lbl-t{{font-size:.86em;font-weight:500}}
.check-item.done .check-lbl-t{{text-decoration:line-through;color:var(--muted)}}
.check-lbl-s{{font-size:.7em;color:var(--muted);margin-top:2px}}
.ctag{{font-size:.66em;padding:2px 7px;border-radius:3px;flex-shrink:0;align-self:flex-start}}
.tw{{background:rgba(248,183,0,.12);color:var(--gold);border:1px solid rgba(248,183,0,.25)}}
.td{{background:rgba(46,204,113,.12);color:var(--green);border:1px solid rgba(46,204,113,.25)}}
.tv{{background:rgba(155,77,202,.15);color:var(--purp);border:1px solid rgba(155,77,202,.3)}}
.prow{{display:flex;align-items:center;gap:10px;margin-bottom:9px}}.prow:last-child{{margin-bottom:0}}
.plbl{{font-size:.78em;width:115px;flex-shrink:0}}
.pbg{{flex:1;height:7px;background:var(--b2);border-radius:3px;overflow:hidden}}
.pf{{height:100%;border-radius:3px;transition:width .3s}}
.ppct{{font-size:.7em;color:var(--muted);width:36px;text-align:right}}
.rbar{{background:var(--bg2);border:1px solid var(--b2);border-radius:8px;padding:12px 18px;margin-bottom:18px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}}
.rlabel{{font-size:.68em;color:var(--muted);text-transform:uppercase;letter-spacing:1px}}
.rcd{{font-family:'Cinzel',serif;font-size:1.3em;color:var(--gold);margin-top:2px}}
.rg{{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:10px}}
.rc{{background:var(--bg2);border:1px solid var(--b1);border-radius:6px;padding:11px 13px;display:flex;align-items:center;gap:11px}}
.rkey{{width:42px;height:42px;border-radius:6px;background:var(--bg3);border:1px solid var(--b2);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}}
.rkl{{font-family:'Cinzel',serif;font-size:1.05em;font-weight:700;color:#fff}}
.rks{{font-size:.62em;color:var(--muted)}}
.ri{{flex:1;min-width:0}}
.rdn{{font-size:.85em;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.rm{{font-size:.7em;color:var(--muted);margin-top:2px}}
.rsc{{font-family:'Cinzel',serif;font-size:1.05em;font-weight:600}}
.t-yes{{color:var(--green)}}.t-no{{color:#e74c3c}}
.rb{{margin-bottom:18px}}
.rbn{{font-family:'Cinzel',serif;font-size:.88em;color:var(--text);margin-bottom:9px;display:flex;align-items:center;gap:9px}}
.dr{{display:flex;align-items:center;gap:9px;margin-bottom:5px}}
.dl{{font-size:.7em;width:58px;flex-shrink:0}}
.dbg{{flex:1;height:7px;background:var(--b2);border-radius:3px;overflow:hidden}}
.dbf{{height:100%;border-radius:3px}}
.dk2{{font-size:.72em;color:var(--muted);width:36px;text-align:right}}
.dg-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin-bottom:20px}}
.dg-card{{background:var(--bg2);border:1px solid var(--b1);border-radius:8px;padding:13px 15px}}
.dg-card.has{{border-left:3px solid var(--ac)}}.dg-card.no{{border-left:3px solid var(--b2);opacity:.65}}
.dg-name{{font-size:.85em;font-weight:500;margin-bottom:5px}}
.dg-key{{font-family:'Cinzel',serif;font-size:1.7em;font-weight:700;line-height:1}}
.dg-bbg{{height:4px;background:var(--b1);border-radius:2px;margin-top:7px;overflow:hidden}}
.dg-bfill{{height:100%;border-radius:2px}}
.dg-pts{{font-size:.7em;color:var(--muted);margin-top:3px;text-align:right}}
.ucal label{{font-size:.73em;color:var(--muted);display:block;margin-bottom:4px;margin-top:11px}}
.ucal label:first-of-type{{margin-top:0}}
.ucal select{{width:100%;background:var(--bg3);border:1px solid var(--b2);color:var(--text);padding:8px;border-radius:4px;font-size:.83em;font-family:'Exo 2',sans-serif}}
.ucal-btn{{width:100%;margin-top:14px;background:rgba({rgb},.2);border:1px solid rgba({rgb},.5);color:var(--ac);padding:9px;border-radius:5px;cursor:pointer;font-family:'Cinzel',serif;font-size:.82em;letter-spacing:1px}}
.ur{{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--b1);font-size:.82em}}
.ur:last-child{{border-bottom:none}}.ur .lbl{{color:var(--muted)}}
.cg{{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}}
.cc{{background:var(--bg2);border:1px solid var(--b1);border-radius:6px;padding:12px}}
.crest-input-row{{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--b1)}}
.crest-input-row:last-child{{border-bottom:none}}
.crest-color{{width:12px;height:12px;border-radius:3px;flex-shrink:0}}
.crest-name{{font-size:.85em;font-weight:500;width:140px;flex-shrink:0}}
.crest-num{{width:70px;background:var(--bg3);border:1px solid var(--b2);color:var(--text);font-family:'Cinzel',serif;font-size:1em;text-align:center;padding:5px 8px;border-radius:4px}}
.crest-limit{{font-size:.72em;color:var(--muted);width:80px}}
.crest-pbar{{flex:1;height:8px;background:var(--b2);border-radius:4px;overflow:hidden}}
.crest-pfill{{height:100%;border-radius:4px;transition:width .3s}}
.crest-pct{{font-size:.7em;color:var(--muted);width:38px;text-align:right}}
.timeline{{display:flex;flex-direction:column;gap:0;position:relative}}
.timeline::before{{content:'';position:absolute;left:90px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--ac),rgba({rgb},.1));pointer-events:none}}
.tl-day{{display:flex;gap:0;position:relative;margin-bottom:0}}
.tl-day-label{{width:90px;font-family:'Cinzel',serif;font-size:.72em;color:var(--muted);text-align:right;padding:12px 14px 12px 0;flex-shrink:0;line-height:1.3}}
.tl-day-label.reset{{color:var(--gold)}}
.tl-dot{{width:14px;height:14px;border-radius:50%;border:2px solid var(--ac);background:var(--bg);flex-shrink:0;margin-top:14px;position:relative;z-index:1}}
.tl-dot.reset-dot{{background:var(--gold);border-color:var(--gold);box-shadow:0 0 8px rgba(248,183,0,.5)}}
.tl-dot.today-dot{{background:var(--ac);border-color:var(--ac);box-shadow:0 0 8px rgba({rgb},.5)}}
.tl-content{{flex:1;padding:8px 0 8px 16px}}
.tl-tasks{{display:flex;flex-direction:column;gap:4px}}
.tl-task{{display:flex;align-items:center;gap:7px;font-size:.8em;padding:4px 8px;border-radius:4px;background:var(--bg2);border:1px solid var(--b1)}}
.tl-task.done{{opacity:.45}}.tl-task.done .tl-task-name{{text-decoration:line-through}}
.tl-task-dot{{width:7px;height:7px;border-radius:50%;flex-shrink:0}}
.tl-task-name{{flex:1}}
.dng-selector{{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-bottom:18px}}
.dng-btn{{background:var(--bg3);border:1px solid var(--b2);color:var(--muted);font-size:.78em;padding:8px 10px;border-radius:5px;cursor:pointer;text-align:left;transition:all .2s;font-family:'Exo 2',sans-serif}}
.dng-btn:hover{{border-color:var(--ac);color:var(--text)}}
.dng-btn.selected{{border-color:var(--ac);color:var(--gold);background:rgba({rgb},.08)}}
.note-area{{width:100%;background:var(--bg3);border:1px solid var(--b2);color:var(--text);font-family:'Exo 2',sans-serif;font-size:.83em;padding:12px;border-radius:6px;resize:vertical;min-height:160px;line-height:1.6}}
.note-area:focus{{outline:none;border-color:var(--ac)}}
.lp{{display:flex;align-items:center;gap:9px;color:var(--muted);font-size:.83em;padding:18px 0}}
.pd{{width:7px;height:7px;border-radius:50%;background:var(--ac);animation:pulse 1.4s ease-in-out infinite}}
.pd:nth-child(2){{animation-delay:.2s}}.pd:nth-child(3){{animation-delay:.4s}}
@keyframes pulse{{0%,80%,100%{{opacity:.2}}40%{{opacity:1}}}}
.err{{color:#e74c3c;font-size:.83em;padding:12px 0}}
</style>
</head>
<body>

<div class="topnav">
  <a href="index.html">&#9876; Panel Semanal</a>
  <a href="personajes.html">&#128100; Personajes</a>
  <a href="rutas.html">&#128506; Rutas M+</a>
  <a href="kreathor.html">&#128128; Kreathor</a>
</div>

<div class="hero">
  <div class="hero-inner">
    <div class="char-ph" id="portrait">&#128100;</div>
    <div class="hero-info">
      <div class="char-name">{name}</div>
      <div class="char-meta">
        <span class="bspec">{spec} {cls}</span>
        <span class="brole">{re} {rt}</span>
        <span class="brealm">Quel'Thalas &middot; US</span>
      </div>
      <div class="hero-stats" id="heroStats">
        <div class="lp"><span class="pd"></span><span class="pd"></span><span class="pd"></span><span>Conectando con Azeroth...</span></div>
      </div>
      <div class="hero-links" id="heroLinks"></div>
    </div>
  </div>
</div>

<div class="tabs">
  <button class="tab-btn active" onclick="ST('checklist')">&#10003; Checklist</button>
  <button class="tab-btn" onclick="ST('timeline')">&#128197; Semana</button>
  <button class="tab-btn" onclick="ST('crests')">&#128142; Crests</button>
  <button class="tab-btn" onclick="ST('dungeons')">&#128505; Mazmorras</button>
  <button class="tab-btn" onclick="ST('notas')">&#128221; Notas</button>
  <button class="tab-btn" onclick="ST('mplus')">&#128202; M+ Runs</button>
  <button class="tab-btn" onclick="ST('raid')">&#127984; Raid</button>
  <button class="tab-btn" onclick="ST('upgrades')">&#11014; Upgrades</button>
</div>

<div class="main">

<div class="tab-panel active" id="tab-checklist">
  <div class="rbar">
    <div>
      <div class="rlabel">Pr&oacute;ximo reset semanal NA &middot; Martes 15:00 UTC</div>
      <div class="rcd" id="countdown">Calculando...</div>
    </div>
    <div style="margin-left:auto">
      <button onclick="clearAll()" style="background:rgba({rgb},.1);border:1px solid rgba({rgb},.3);color:var(--ac);font-size:.73em;padding:6px 13px;border-radius:4px;cursor:pointer;font-family:'Exo 2',sans-serif">&#128465; Limpiar todo</button>
    </div>
  </div>
  <div class="two-col">
    <div>
      <div class="stitle"><span class="acc">&#128197;</span> Semanales <span style="font-size:.85em">(reset martes)</span></div>
      <div class="card" id="wList"></div>
    </div>
    <div>
      <div class="stitle"><span class="acc">&#9728;</span> Diarias <span id="dlbl" style="font-size:.85em"></span></div>
      <div class="card" id="dList"></div>
      <div class="stitle" style="margin-top:18px"><span class="acc">&#128200;</span> Progreso</div>
      <div class="card" id="pCard"></div>
    </div>
  </div>
</div>

<div class="tab-panel" id="tab-timeline">
  <div class="stitle"><span class="acc">&#128197;</span> Semana ideal &mdash; Midnight S1</div>
  <p style="font-size:.78em;color:var(--muted);margin-bottom:18px;max-width:600px">Distribuci&oacute;n &oacute;ptima de actividades. Reset cada martes 15:00 UTC.</p>
  <div class="timeline" id="tlContainer"></div>
</div>

<div class="tab-panel" id="tab-crests">
  <div class="stitle"><span class="acc">&#128142;</span> Tracker de Crests &mdash; Semana actual</div>
  <div class="two-col">
    <div>
      <div class="card">
        <h3>Crests acumulados esta semana</h3>
        <div id="crestInputs"></div>
        <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--b1)">
          <button onclick="saveCrests()" style="background:rgba({rgb},.15);border:1px solid rgba({rgb},.4);color:var(--ac);padding:7px 16px;border-radius:4px;cursor:pointer;font-family:'Cinzel',serif;font-size:.75em">GUARDAR</button>
          <button onclick="resetCrests()" style="background:var(--bg3);border:1px solid var(--b2);color:var(--muted);padding:7px 14px;border-radius:4px;cursor:pointer;font-size:.75em;margin-left:6px">Resetear</button>
          <span style="font-size:.7em;color:var(--muted);margin-left:10px;opacity:0;transition:opacity .3s" id="crestSaveLabel">Guardado</span>
        </div>
      </div>
    </div>
    <div>
      <div class="card" id="crestPlanCard">
        <h3>Plan de upgrades</h3>
        <p style="color:var(--muted);font-size:.83em">Ingresa tus crests y guarda para ver qu&eacute; piezas puedes subir.</p>
      </div>
    </div>
  </div>
  <div class="stitle" style="margin-top:20px"><span class="acc">&#128336;</span> Historial semanal</div>
  <div class="card" id="crestHistory"><p style="color:var(--muted);font-size:.83em">Sin historial guardado a&uacute;n.</p></div>
</div>

<div class="tab-panel" id="tab-dungeons">
  <div class="stitle"><span class="acc">&#10022;</span> Score por Mazmorra <span style="font-size:.85em">(en vivo &middot; Raider.io)</span></div>
  <div id="dgContent"><div class="lp"><span class="pd"></span><span class="pd"></span><span class="pd"></span><span>Cargando...</span></div></div>
</div>

<div class="tab-panel" id="tab-notas">
  <div class="stitle"><span class="acc">&#128221;</span> Notas por Mazmorra</div>
  <p style="font-size:.78em;color:var(--muted);margin-bottom:14px">Selecciona una mazmorra y escribe tus notas. Se guardan en el navegador.</p>
  <div class="dng-selector" id="dngSelector"></div>
  <div id="noteEditor" style="display:none">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:8px">
      <div style="font-family:'Cinzel',serif;font-size:.9em;color:var(--gold)" id="noteTitle"></div>
      <div style="display:flex;gap:6px;align-items:center">
        <button onclick="clearNote()" style="background:var(--bg3);border:1px solid var(--b2);color:var(--muted);font-size:.72em;padding:4px 10px;border-radius:3px;cursor:pointer">&#128465; Borrar</button>
        <button onclick="saveNote()" style="background:rgba({rgb},.15);border:1px solid rgba({rgb},.4);color:var(--ac);font-size:.72em;padding:4px 12px;border-radius:3px;cursor:pointer;font-family:'Cinzel',serif">GUARDAR</button>
        <span style="font-size:.7em;opacity:0;transition:opacity .3s" id="noteSaved">&#10003; Guardado</span>
      </div>
    </div>
    <textarea class="note-area" id="noteTextarea" placeholder="Escribe tus notas aquí..."></textarea>
  </div>
  <div id="noteEmpty" style="color:var(--muted);font-size:.83em;padding:14px 0">Selecciona una mazmorra para empezar.</div>
</div>

<div class="tab-panel" id="tab-mplus">
  <div class="stitle"><span class="acc">&#128202;</span> Actividad Mythic+ <span style="font-size:.85em">(en vivo &middot; Raider.io)</span></div>
  <div id="mpContent"><div class="lp"><span class="pd"></span><span class="pd"></span><span class="pd"></span><span>Cargando...</span></div></div>
</div>

<div class="tab-panel" id="tab-raid">
  <div class="stitle"><span class="acc">&#127984;</span> Progreso de Raid <span style="font-size:.85em">(en vivo &middot; Raider.io)</span></div>
  <div id="raidContent"><div class="lp"><span class="pd"></span><span class="pd"></span><span class="pd"></span><span>Cargando...</span></div></div>
</div>

<div class="tab-panel" id="tab-upgrades">
  <div class="stitle"><span class="acc">&#11014;</span> Calculadora de Upgrades</div>
  <div class="two-col">
    <div class="card ucal">
      <label>Item Level actual</label>
      <select id="uFrom">
        <option value="233">233 &mdash; Adventurer</option><option value="242">242</option><option value="249">249 &mdash; Veteran</option>
        <option value="258">258 &mdash; Champion</option><option value="265">265 &mdash; Hero</option>
        <option value="272" selected>272 &mdash; Hero max</option><option value="285">285 &mdash; Myth</option>
      </select>
      <label>Item Level objetivo</label>
      <select id="uTo">
        <option value="249">249 &mdash; Veteran</option><option value="258">258 &mdash; Champion</option>
        <option value="265">265 &mdash; Hero</option><option value="272">272 &mdash; Hero max</option>
        <option value="285" selected>285 &mdash; Myth</option><option value="289">289 &mdash; Myth max</option>
      </select>
      <label>Tipo de item</label>
      <select id="uType">
        <option value="armor">Armadura (15 crests/step)</option>
        <option value="weapon">Arma 2H (30 crests/step)</option>
      </select>
      <button class="ucal-btn" onclick="calcU()">CALCULAR</button>
    </div>
    <div class="card" id="uResult">
      <h3>Resultado</h3>
      <p style="color:var(--muted);font-size:.83em;margin-top:8px">Selecciona los ilvl y calcula.</p>
    </div>
  </div>
  <div class="cg" style="margin-top:18px">
    <div class="cc" style="border-top:3px solid #6b7280"><div style="font-weight:600;color:#9ca3af;margin-bottom:7px">Whelpling's Crest</div><div style="font-size:.76em;color:var(--muted);line-height:1.7">Adventurer &middot; M+ 2-5 &middot; LFR<br>90/semana &middot; hasta 249</div></div>
    <div class="cc" style="border-top:3px solid #16a34a"><div style="font-weight:600;color:#4ade80;margin-bottom:7px">Drake's Crest</div><div style="font-size:.76em;color:var(--muted);line-height:1.7">Veteran &middot; M+ 6-7 &middot; Normal<br>90/semana &middot; hasta 256</div></div>
    <div class="cc" style="border-top:3px solid #1d4ed8"><div style="font-weight:600;color:#60a5fa;margin-bottom:7px">Wyrm's Crest</div><div style="font-size:.76em;color:var(--muted);line-height:1.7">Champion/Hero &middot; M+ 8-10 &middot; Heroic<br>90/semana &middot; hasta 272</div></div>
    <div class="cc" style="border-top:3px solid #7e22ce"><div style="font-weight:600;color:#c084f5;margin-bottom:7px">Aspect's Crest</div><div style="font-size:.76em;color:var(--muted);line-height:1.7">Hero max/Myth &middot; M+ 10+ &middot; Mythic<br>15/semana &middot; hasta 289</div></div>
  </div>
</div>

</div>
<script>
const R='us',RL='quelthalas',N='{url}';
const F='mythic_plus_scores_by_season:current,gear,raid_progression,class,mythic_plus_recent_runs,mythic_plus_best_runs:current,thumbnail_url';

function ST(id){{document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));document.querySelector(`[onclick="ST('${{id}}')"]`).classList.add('active');document.getElementById('tab-'+id).classList.add('active');}}
function SC(s){{if(s>=3000)return'#ff8000';if(s>=2000)return'#a335ee';if(s>=1500)return'#0070dd';if(s>=1000)return'#1eff00';if(s>0)return'#ffffff';return'#aaa';}}

function nextReset(){{const n=new Date(),d=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate(),15,0,0));let diff=(2-d.getUTCDay()+7)%7;if(diff===0&&n>=d)diff=7;d.setUTCDate(d.getUTCDate()+diff);return d;}}
function tick(){{const ms=nextReset()-Date.now();if(ms<=0){{tick();return;}}const dy=Math.floor(ms/86400000),hr=Math.floor(ms%86400000/3600000),mn=Math.floor(ms%3600000/60000),sc=Math.floor(ms%60000/1000);const p=[];if(dy)p.push(dy+'d');p.push(String(hr).padStart(2,'0')+'h '+String(mn).padStart(2,'0')+'m '+String(sc).padStart(2,'0')+'s');document.getElementById('countdown').textContent=p.join(' ');}}
setInterval(tick,1000);tick();

function wKey(){{const r=nextReset();r.setUTCDate(r.getUTCDate()-7);return'{px}_w_'+r.toISOString().slice(0,10)}}
function dKey(){{const n=new Date(),c=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate(),15,0,0)),b=n<c?new Date(c-86400000):c;return'{px}_d_'+b.toISOString().slice(0,10)}}
function lC(k){{try{{return JSON.parse(localStorage.getItem(k)||'{{}}')}}catch{{return{{}}}}}}
function toggle(sk,id){{const d=lC(sk);d[id]=!d[id];localStorage.setItem(sk,JSON.stringify(d));renderCL();renderTL();}}
function clearAll(){{if(!confirm('Limpiar todas las tareas?'))return;localStorage.removeItem(wKey());localStorage.removeItem(dKey());renderCL();renderTL();}}

const WT=[
  {{id:'wb',t:'World Boss',s:'Matar el jefe activo esta semana',g:'w'}},
  {{id:'vault',t:'Great Vault (martes)',s:'Abrir vault y reclamar recompensas',g:'v'}},
  {{id:'voids',t:'Raid — Voidspire',s:'Normal / Heroic / Mythic (6 jefes)',g:'w'}},
  {{id:'dream',t:'Raid — Dreamrift',s:'1 jefe — rápido y con tier',g:'w'}},
  {{id:'march',t:"Raid — March on Quel'Danas",s:'2 jefes finales de la temporada',g:'w'}},
  {{id:'pr1',t:'Nightmare Prey 1/3',s:'3 Prey totales para quest Lady Liadrin',g:'w'}},
  {{id:'pr2',t:'Nightmare Prey 2/3',s:'',g:'w'}},
  {{id:'pr3',t:'Nightmare Prey 3/3',s:'Entregar → obtener Spark',g:'w'}},
  {{id:'liad',t:'World Event (Lady Liadrin)',s:'Quest semanal de evento por Spark',g:'w'}},
  {{id:'hous',t:'Housing Weekly (Vaeli)',s:'Quest semanal banco de Silvermoon',g:'w'}},
  {{id:'m1',t:'M+ Vault 1/8',s:'8 mazmorras = 3 opciones en Great Vault',g:'v'}},
  {{id:'m2',t:'M+ Vault 2/8',s:'',g:'v'}},{{id:'m3',t:'M+ Vault 3/8',s:'',g:'v'}},
  {{id:'m4',t:'M+ Vault 4/8',s:'',g:'v'}},{{id:'m5',t:'M+ Vault 5/8',s:'',g:'v'}},
  {{id:'m6',t:'M+ Vault 6/8',s:'',g:'v'}},{{id:'m7',t:'M+ Vault 7/8',s:'',g:'v'}},
  {{id:'m8',t:'M+ Vault 8/8',s:'Vault 100% desbloqueado!',g:'v'}},
];
const DT=[
  {{id:'t11',t:'Delve T11',s:'Al menos 1 Delve nivel 11 para crests',g:'d'}},
  {{id:'boun',t:'Bountiful Delve',s:'Cofre adicional diario',g:'d'}},
  {{id:'crest',t:'Crests farming (M+)',s:'Farmear crests para upgrades',g:'d'}},
];
const TL2={{'w':'tw','d':'td','v':'tv'}};const TLlbl={{'w':'Semanal','d':'Diaria','v':'Vault'}};
function mkItem(sk,t){{const done=lC(sk)[t.id]||false;return`<div class="check-item${{done?' done':''}}" onclick="toggle('${{sk}}','${{t.id}}')"><div class="check-box">${{done?'&#10003;':''}}</div><div class="check-lbl"><div class="check-lbl-t">${{t.t}}</div>${{t.s?`<div class="check-lbl-s">${{t.s}}</div>`:''}}</div><span class="ctag ${{TL2[t.g]}}">${{TLlbl[t.g]}}</span></div>`;}}
function renderCL(){{
  const wk=wKey(),dk=dKey(),wd=lC(wk),dd=lC(dk);
  document.getElementById('dlbl').textContent='— '+new Date().toLocaleDateString('es-CL',{{weekday:'long',day:'numeric',month:'short'}});
  document.getElementById('wList').innerHTML=WT.map(t=>mkItem(wk,t)).join('');
  document.getElementById('dList').innerHTML=DT.map(t=>mkItem(dk,t)).join('');
  const wD=WT.filter(t=>wd[t.id]).length,dD=DT.filter(t=>dd[t.id]).length;
  const mD=WT.filter(t=>t.id.startsWith('m')&&wd[t.id]).length;
  const rD=[wd.voids,wd.dream,wd.march].filter(Boolean).length;
  const pD=[wd.pr1,wd.pr2,wd.pr3].filter(Boolean).length;
  function bar(l,v,t,c){{return`<div class="prow"><span class="plbl">${{l}}</span><div class="pbg"><div class="pf" style="width:${{Math.round(v/t*100)}}%;background:${{c}}"></div></div><span class="ppct">${{v}}/${{t}}</span></div>`;}}
  document.getElementById('pCard').innerHTML=bar('Semanal',wD,WT.length,'var(--gold)')+bar('Diario',dD,DT.length,'#2ecc71')+bar('M+ Vault',mD,8,'#5ab4ff')+bar('Raids',rD,3,'#c084f5')+bar('Nightmare Prey',pD,3,'#e67e22')+'<p style="font-size:.7em;color:var(--muted);margin-top:10px">Reset semanal: martes 15:00 UTC · Diario: cada día 15:00 UTC</p>';
}}
renderCL();

const WEEK_PLAN=[
  {{day:'Martes',isReset:true,tasks:[{{name:'Abrir Great Vault',color:'#c084f5',key:'vault'}},{{name:'World Boss semanal',color:'#e67e22',key:'wb'}},{{name:'2-3 M+ para el vault',color:'#5ab4ff',key:'m1'}}]}},
  {{day:'Martes tarde',tasks:[{{name:'Nightmare Prey 1/3',color:'#e67e22',key:'pr1'}},{{name:'Raid — Voidspire',color:'#ff6b80',key:'voids'}},{{name:'Delve T11 + Bountiful',color:'var(--green)',key:'t11'}}]}},
  {{day:'Miércoles',tasks:[{{name:'Raid — Dreamrift',color:'#ff6b80',key:'dream'}},{{name:'Nightmare Prey 2/3',color:'#e67e22',key:'pr2'}},{{name:'2-3 M+ vault',color:'#5ab4ff',key:'m4'}},{{name:'Crests farming',color:'#60a5fa',key:'crest'}}]}},
  {{day:'Jueves',tasks:[{{name:"Raid — March on Quel'Danas",color:'#ff6b80',key:'march'}},{{name:'Nightmare Prey 3/3 → Spark',color:'#e67e22',key:'pr3'}},{{name:'Lady Liadrin Event',color:'var(--gold)',key:'liad'}}]}},
  {{day:'Viernes',tasks:[{{name:'2-3 M+ vault',color:'#5ab4ff',key:'m6'}},{{name:'Housing Weekly (Vaeli)',color:'var(--gold)',key:'hous'}},{{name:'Crests farming',color:'#60a5fa',key:'crest'}}]}},
  {{day:'Sábado',tasks:[{{name:'M+ Push (score)',color:'#5ab4ff',key:'m7'}},{{name:'Crests farming',color:'#60a5fa',key:'crest'}}]}},
  {{day:'Domingo',tasks:[{{name:'M+ extra / prog',color:'#5ab4ff',key:'m8'}},{{name:'Preparar para reset',color:'var(--muted)',key:''}}]}},
  {{day:'Lunes',tasks:[{{name:'Último día antes del reset',color:'var(--muted)',key:''}},{{name:'Revisar vault del martes',color:'#c084f5',key:'vault'}}]}},
];
const TODAY_DAYS=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
function renderTL(){{
  const wd=lC(wKey()),dd=lC(dKey()),todayName=TODAY_DAYS[new Date().getDay()];
  let h='';
  WEEK_PLAN.forEach(entry=>{{
    const isToday=entry.day.startsWith(todayName);
    const dotClass=entry.isReset?'reset-dot':isToday?'today-dot':'';
    h+=`<div class="tl-day"><div class="tl-day-label${{entry.isReset?' reset':''}}">${{entry.day}}</div><div class="tl-dot ${{dotClass}}"></div><div class="tl-content"><div class="tl-tasks">`;
    entry.tasks.forEach(task=>{{const done=task.key?(wd[task.key]||dd[task.key]):false;h+=`<div class="tl-task${{done?' done':''}}"><div class="tl-task-dot" style="background:${{task.color}}"></div><span class="tl-task-name">${{task.name}}</span>${{done?'<span style="font-size:.68em;color:var(--green)">&#10003;</span>':''}}</div>`;}});
    h+='</div></div></div>';
  }});
  document.getElementById('tlContainer').innerHTML=h;
}}
renderTL();

const CREST_TYPES=[{{id:'whelp',name:"Whelpling's Crest",color:'#6b7280',limit:90,col:'#9ca3af'}},{{id:'drake',name:"Drake's Crest",color:'#16a34a',limit:90,col:'#4ade80'}},{{id:'wyrm',name:"Wyrm's Crest",color:'#1d4ed8',limit:90,col:'#60a5fa'}},{{id:'aspect',name:"Aspect's Crest",color:'#7e22ce',limit:15,col:'#c084f5'}}];
function crestKey(){{const r=nextReset();r.setUTCDate(r.getUTCDate()-7);return'{px}_crests_'+r.toISOString().slice(0,10)}}
function lCrests(){{try{{return JSON.parse(localStorage.getItem(crestKey())||'{{}}')}}catch{{return{{}}}}}}
function renderCrestInputs(){{
  const saved=lCrests();let h='';
  CREST_TYPES.forEach(ct=>{{const val=saved[ct.id]||0,pct=Math.min(Math.round(val/ct.limit*100),100);h+=`<div class="crest-input-row"><div class="crest-color" style="background:${{ct.color}}"></div><span class="crest-name">${{ct.name}}</span><input type="number" class="crest-num" id="ci_${{ct.id}}" value="${{val}}" min="0" max="${{ct.limit}}" oninput="updateCrestBar('${{ct.id}}')"><span class="crest-limit">/ ${{ct.limit}}</span><div class="crest-pbar"><div class="crest-pfill" id="cpf_${{ct.id}}" style="width:${{pct}}%;background:${{ct.col}}"></div></div><span class="crest-pct" id="cpp_${{ct.id}}">${{pct}}%</span></div>`;}});
  document.getElementById('crestInputs').innerHTML=h;
}}
function updateCrestBar(id){{const ct=CREST_TYPES.find(c=>c.id===id);if(!ct)return;const val=Math.min(parseInt(document.getElementById('ci_'+id).value)||0,ct.limit);const pct=Math.round(val/ct.limit*100);document.getElementById('cpf_'+id).style.width=pct+'%';document.getElementById('cpp_'+id).textContent=pct+'%';}}
function saveCrests(){{
  const data={{}};CREST_TYPES.forEach(ct=>{{data[ct.id]=parseInt(document.getElementById('ci_'+ct.id).value)||0;}});
  localStorage.setItem(crestKey(),JSON.stringify(data));
  const hKey='{px}_crests_hist';let hist=[];try{{hist=JSON.parse(localStorage.getItem(hKey)||'[]')}}catch{{}}
  const week=crestKey().replace('{px}_crests_','');const ex=hist.findIndex(h=>h.week===week);
  if(ex>=0)hist[ex]={{week,...data}};else hist.unshift({{week,...data}});hist=hist.slice(0,8);
  localStorage.setItem(hKey,JSON.stringify(hist));
  const lbl=document.getElementById('crestSaveLabel');lbl.style.opacity=1;setTimeout(()=>lbl.style.opacity=0,2000);
  renderCrestHistory();
}}
function resetCrests(){{if(!confirm('Resetear crests?'))return;localStorage.removeItem(crestKey());renderCrestInputs();}}
function renderCrestHistory(){{
  const el=document.getElementById('crestHistory');if(!el)return;
  let hist=[];try{{hist=JSON.parse(localStorage.getItem('{px}_crests_hist')||'[]')}}catch{{}}
  if(!hist.length){{el.innerHTML='<p style="color:var(--muted);font-size:.83em">Sin historial aún.</p>';return;}}
  let h='<table style="width:100%;border-collapse:collapse;font-size:.8em"><thead><tr><th style="text-align:left;padding:6px 8px;color:var(--muted);font-size:.72em;border-bottom:1px solid var(--b2)">Semana</th>';
  CREST_TYPES.forEach(ct=>{{h+=`<th style="text-align:center;padding:6px 8px;color:${{ct.col}};font-size:.72em;border-bottom:1px solid var(--b2)">${{ct.name.split("'")[0]}}'s</th>`;}});
  h+='</tr></thead><tbody>';
  hist.forEach(row=>{{h+=`<tr style="border-bottom:1px solid var(--b1)"><td style="padding:7px 8px;color:var(--muted);font-size:.78em">${{row.week}}</td>`;CREST_TYPES.forEach(ct=>{{h+=`<td style="text-align:center;padding:7px 8px"><span style="color:${{ct.col}};font-weight:600">${{row[ct.id]||0}}</span></td>`;}});h+='</tr>';}});
  h+='</tbody></table>';el.innerHTML=h;
}}
renderCrestInputs();renderCrestHistory();

const DNGS_LIST=[{{id:'aa',name:"Algeth'ar Academy",emoji:'&#127981;'}},{{id:'mc',name:'Maisara Caverns',emoji:'&#127755;'}},{{id:'npx',name:'Nexus-Point Xenas',emoji:'&#127758;'}},{{id:'wrs',name:'Windrunner Spire',emoji:'&#127748;'}},{{id:'mt',name:"Magisters' Terrace",emoji:'&#127962;'}},{{id:'pos',name:'Pit of Saron',emoji:'&#10052;'}},{{id:'seat',name:'Seat of the Triumvirate',emoji:'&#127758;'}},{{id:'sky',name:'Skyreach',emoji:'&#127965;'}}];
let curDng=null;
function initNotes(){{const sel=document.getElementById('dngSelector');DNGS_LIST.forEach(d=>{{const btn=document.createElement('button');btn.className='dng-btn';btn.innerHTML=`${{d.emoji}} ${{d.name}}`;btn.onclick=()=>selectDng(d.id);sel.appendChild(btn);}});}}
function selectDng(id){{curDng=id;const d=DNGS_LIST.find(x=>x.id===id);document.querySelectorAll('.dng-btn').forEach(b=>b.classList.remove('selected'));document.querySelectorAll('.dng-btn').forEach(b=>{{if(b.textContent.includes(d.name.substring(0,5)))b.classList.add('selected');}});document.getElementById('noteTitle').innerHTML=`${{d.emoji}} ${{d.name}}`;document.getElementById('noteTextarea').value=localStorage.getItem('{px}_note_'+id)||'';document.getElementById('noteEditor').style.display='block';document.getElementById('noteEmpty').style.display='none';}}
function saveNote(){{if(!curDng)return;localStorage.setItem('{px}_note_'+curDng,document.getElementById('noteTextarea').value);const s=document.getElementById('noteSaved');s.style.opacity=1;setTimeout(()=>s.style.opacity=0,2000);}}
function clearNote(){{if(!curDng||!confirm('Borrar notas?'))return;localStorage.removeItem('{px}_note_'+curDng);document.getElementById('noteTextarea').value='';}}
document.addEventListener('keydown',e=>{{if(e.ctrlKey&&e.key==='s'&&curDng){{e.preventDefault();saveNote();}}}});
initNotes();

const DNGS_IO=["Algeth'ar Academy","Maisara Caverns","Nexus-Point Xenas","Windrunner Spire","Magisters' Terrace","Pit of Saron","Seat of the Triumvirate","Skyreach"];
function renderDG(best){{
  const el=document.getElementById('dgContent');if(!el)return;
  const map={{}};
  (best||[]).forEach(r=>{{const k=DNGS_IO.find(n=>r.dungeon&&r.dungeon.toLowerCase().includes(n.split(' ')[0].toLowerCase().replace("'","")));if(k&&(!map[k]||r.score>map[k].score))map[k]=r;}});
  const mx=Math.max(...Object.values(map).map(r=>r.score||0),1);
  let h='<div class="dg-grid">';
  DNGS_IO.forEach(name=>{{const r=map[name];const col=r?SC(r.score):'#555';const pct=r?Math.round(r.score/mx*100):0;const t=r&&r.num_keystone_upgrades>0;h+=`<div class="dg-card ${{r?'has':'no'}}"><div class="dg-name">${{name}}</div><div class="dg-key" style="color:${{col}}">${{r?'+'+r.mythic_level:'&mdash;'}}${{r?`<span style="font-size:.38em;vertical-align:middle;color:${{t?'#2ecc71':'#e74c3c'}}"> ${{t?'EN TIEMPO':'FUERA'}}</span>`:''}}</div>${{r?`<div class="dg-bbg"><div class="dg-bfill" style="width:${{pct}}%;background:${{col}}"></div></div><div class="dg-pts">${{Math.round(r.score)}} pts</div>`:'<div style="font-size:.72em;color:var(--muted);margin-top:5px">Sin run</div>'}}</div>`;}});
  h+='</div>';el.innerHTML=h;
}}
function renderMP(d){{
  const rec=d.mythic_plus_recent_runs??[],best=d.mythic_plus_best_runs??[];let h='';
  if(best.length){{h+=`<div class="stitle" style="margin-bottom:10px"><span class="acc">&#10022;</span> Mejores Runs</div><div class="rg" style="margin-bottom:22px">`;best.slice(0,8).forEach(r=>{{const t=r.num_keystone_upgrades>0;h+=`<div class="rc"><div class="rkey"><span class="rkl">+${{r.mythic_level}}</span><span class="rks">${{t?'&#10003;':'&#10007;'}}</span></div><div class="ri"><div class="rdn">${{r.dungeon}}</div><div class="rm">${{t?'<span class="t-yes">En tiempo</span>':'<span class="t-no">Fuera</span>'}} &middot; ${{new Date(r.completed_at).toLocaleDateString('es-CL')}}</div></div><div class="rsc" style="color:${{SC(r.score)}}">${{Math.round(r.score)}}</div></div>`;}});h+='</div>';}}
  if(rec.length){{h+=`<div class="stitle" style="margin-bottom:10px"><span class="acc">&#10022;</span> Runs Recientes</div><div class="rg">`;rec.slice(0,9).forEach(r=>{{const t=r.num_keystone_upgrades>0;h+=`<div class="rc"><div class="rkey"><span class="rkl">+${{r.mythic_level}}</span><span class="rks">${{t?'&#10003;':'&#10007;'}}</span></div><div class="ri"><div class="rdn">${{r.dungeon}}</div><div class="rm">${{t?'<span class="t-yes">En tiempo</span>':'<span class="t-no">Fuera</span>'}} &middot; ${{new Date(r.completed_at).toLocaleDateString('es-CL')}}</div></div><div class="rsc" style="color:${{SC(r.score)}}">${{Math.round(r.score)}}</div></div>`;}});h+='</div>';}}
  if(!h)h='<p style="color:var(--muted);font-size:.83em;padding:14px 0">Sin runs registradas aún.</p>';
  document.getElementById('mpContent').innerHTML=h;
}}
function renderRaid(d){{
  const prog=d.raid_progression??{{}},raids=[{{key:'tier-mn-1',name:'Midnight Tier 1',total:9}}];let h='';
  raids.forEach(r=>{{const p=prog[r.key];if(!p)return;const nk=p.normal_bosses_killed??0,hk=p.heroic_bosses_killed??0,mk=p.mythic_bosses_killed??0;h+=`<div class="rb"><div class="rbn">&#9876; ${{r.name}} <span style="font-size:.8em;color:var(--muted)">${{r.total}} jefes</span></div><div class="dr"><span class="dl" style="color:var(--purp)">Mythic</span><div class="dbg"><div class="dbf" style="width:${{mk/r.total*100}}%;background:linear-gradient(90deg,#6b21a8,#c084f5)"></div></div><span class="dk2" style="color:var(--purp)">${{mk}}/${{r.total}}</span></div><div class="dr"><span class="dl" style="color:var(--blue)">Heroic</span><div class="dbg"><div class="dbf" style="width:${{hk/r.total*100}}%;background:linear-gradient(90deg,#1a78c2,#5ab4ff)"></div></div><span class="dk2" style="color:var(--blue)">${{hk}}/${{r.total}}</span></div><div class="dr"><span class="dl" style="color:#6b7280">Normal</span><div class="dbg"><div class="dbf" style="width:${{nk/r.total*100}}%;background:linear-gradient(90deg,#374151,#6b7280)"></div></div><span class="dk2" style="color:#6b7280">${{nk}}/${{r.total}}</span></div></div>`;}});
  if(!h)h='<p style="color:var(--muted);font-size:.83em;padding:14px 0">Sin progreso registrado.</p>';
  document.getElementById('raidContent').innerHTML=h;
}}
function renderHero(d){{
  const sc=d.mythic_plus_scores_by_season?.[0]?.scores?.all??0,il=d.gear?.item_level_equipped??'&mdash;',sp=d.active_spec_name??'{spec}';
  if(d.thumbnail_url)document.getElementById('portrait').outerHTML=`<img class="char-portrait" src="${{d.thumbnail_url}}" alt="{name}">`;
  document.getElementById('heroStats').innerHTML=`<div class="hstat"><span class="hstat-val" style="color:${{SC(sc)}}">${{Math.round(sc).toLocaleString()}}</span><span class="hstat-label">M+ Score</span></div><div class="hstat"><span class="hstat-val" style="color:var(--gold)">${{il}}</span><span class="hstat-label">Item Level</span></div><div class="hstat"><span class="hstat-val" style="color:var(--blue)">${{sp}}</span><span class="hstat-label">Spec</span></div><div class="hstat"><span class="hstat-val" style="color:#888">Midnight S1</span><span class="hstat-label">Temporada</span></div>`;
  const rio=`https://raider.io/characters/${{R}}/${{RL}}/${{N}}`,arm=`https://worldofwarcraft.blizzard.com/en-us/character/${{R}}/${{RL}}/${{N}}`;
  document.getElementById('heroLinks').innerHTML=`<a class="hl hl-rio" href="${{rio}}" target="_blank">Raider.io &#8599;</a><a class="hl hl-ext" href="${{arm}}" target="_blank">Armory &#8599;</a>`;
}}
function calcU(){{
  const from=parseInt(document.getElementById('uFrom').value),to=parseInt(document.getElementById('uTo').value),isW=document.getElementById('uType').value==='weapon',el=document.getElementById('uResult');
  if(to<=from){{el.innerHTML='<h3>Resultado</h3><p style="color:#e74c3c;font-size:.83em;margin-top:8px">El ilvl objetivo debe ser mayor.</p>';return;}}
  const steps=Math.ceil((to-from)/3),base=isW?30:15,total=steps*base;
  let ct="Wyrm's Crest",cc='#60a5fa',cs='M+ 8-9 · Heroic Raid';
  if(to>=280){{ct="Aspect's Crest";cc='#c084f5';cs='M+ 10+ · Mythic Raid';}}else if(to<244){{ct="Whelpling's Crest";cc='#9ca3af';cs='M+ 2-5 · LFR';}}else if(to<250){{ct="Drake's Crest";cc='#4ade80';cs='M+ 6-7 · Normal';}}
  const wk=Math.ceil(total/90),wc=wk<=1?'#2ecc71':wk<=3?'#e67e22':'#e74c3c';
  el.innerHTML=`<h3 style="margin-bottom:12px">Resultado</h3><div class="ur"><span class="lbl">Upgrade</span><span style="font-weight:600">${{from}} → ${{to}} ilvl</span></div><div class="ur"><span class="lbl">Pasos</span><span>${{steps}} upgrades</span></div><div class="ur"><span class="lbl">Crest</span><span style="color:${{cc}}">${{ct}}</span></div><div class="ur"><span class="lbl">Total crests</span><span style="font-family:'Cinzel',serif;font-size:1.2em;color:var(--gold)">${{total}}</span></div><div class="ur"><span class="lbl">Fuente</span><span style="font-size:.8em">${{cs}}</span></div><div class="ur"><span class="lbl">Semanas aprox.</span><span style="color:${{wc}}">${{wk}} semana${{wk>1?'s':''}}</span></div>`;
}}
async function loadData(){{
  try{{
    const res=await fetch(`https://raider.io/api/v1/characters/profile?region=${{R}}&realm=${{RL}}&name=${{N}}&fields=${{F}}`);
    if(!res.ok)throw new Error('HTTP '+res.status);
    const d=await res.json();if(d.statusCode===400||d.error)throw new Error('No encontrado');
    renderHero(d);renderMP(d);renderRaid(d);renderDG(d.mythic_plus_best_runs);
  }}catch(e){{['heroStats','mpContent','raidContent','dgContent'].forEach(id=>{{const el=document.getElementById(id);if(el)el.innerHTML=`<div class="err">Error: ${{e.message}}</div>`;}});}}
}}
loadData();
</script>
</body>
</html>"""

for char in CHARS:
    html = gen(char)
    fname = char['file'] + '.html'
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"OK: {fname}")
