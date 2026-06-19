/* ══════════════════════════════════════════════════════
   PAGEFORGE STUDIO — script.js
   Visual website builder engine with:
   - Component-based rendering
   - Undo/Redo stack
   - Drag & drop section reordering
   - Live preview via iframe srcdoc
   - Export engine
   - Autosave via localStorage
══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────
   SECTION DEFINITIONS
   Each type has: icon, label, default data, field defs
───────────────────────────────────────────────────── */
const SECTION_DEFS = {
  hero: {
    icon: '🏠', label: 'Hero',
    defaults: { title: 'Build Something Amazing', subtitle: 'The modern platform for creators, founders, and dreamers. Launch your vision in minutes.', cta: 'Get Started', ctaSecondary: 'Learn More', image: '' },
    fields: [
      { key: 'title',       label: 'Headline',       type: 'input' },
      { key: 'subtitle',    label: 'Subheadline',     type: 'textarea' },
      { key: 'cta',         label: 'Primary Button',  type: 'input' },
      { key: 'ctaSecondary',label: 'Secondary Button',type: 'input' },
    ]
  },
  about: {
    icon: '👤', label: 'About',
    defaults: { title: 'About Us', subtitle: 'Our Story', content: 'We are a team of passionate builders dedicated to making the web more beautiful and accessible for everyone. Our mission drives everything we do.', stat1Label: 'Projects', stat1Val: '120+', stat2Label: 'Clients', stat2Val: '80+', stat3Label: 'Years', stat3Val: '5+' },
    fields: [
      { key: 'title',      label: 'Section Title', type: 'input' },
      { key: 'subtitle',   label: 'Eyebrow Label', type: 'input' },
      { key: 'content',    label: 'Body Text',     type: 'textarea' },
      { key: 'stat1Label', label: 'Stat 1 Label',  type: 'input' },
      { key: 'stat1Val',   label: 'Stat 1 Value',  type: 'input' },
      { key: 'stat2Label', label: 'Stat 2 Label',  type: 'input' },
      { key: 'stat2Val',   label: 'Stat 2 Value',  type: 'input' },
    ]
  },
  features: {
    icon: '⚡', label: 'Features',
    defaults: {
      title: 'Everything You Need', subtitle: 'Built for speed, scale, and simplicity.',
      f1Title: 'Blazing Fast', f1Body: 'Optimized for performance with sub-100ms load times.',
      f2Title: 'Secure by Default', f2Body: 'Enterprise-grade security baked in from day one.',
      f3Title: 'Scales Instantly', f3Body: 'From zero to millions of users with zero config.',
      f4Title: 'Developer Friendly', f4Body: 'Clean APIs and docs that make building a joy.',
      f5Title: 'Analytics Built-In', f5Body: 'Real-time insights without third-party bloat.',
      f6Title: 'Global CDN', f6Body: 'Delivered from 200+ edge locations worldwide.',
    },
    fields: [
      { key: 'title',   label: 'Section Title', type: 'input' },
      { key: 'subtitle',label: 'Subtitle',      type: 'input' },
      { key: 'f1Title', label: 'Feature 1 Title', type: 'input' },
      { key: 'f1Body',  label: 'Feature 1 Text',  type: 'textarea' },
      { key: 'f2Title', label: 'Feature 2 Title', type: 'input' },
      { key: 'f2Body',  label: 'Feature 2 Text',  type: 'textarea' },
      { key: 'f3Title', label: 'Feature 3 Title', type: 'input' },
      { key: 'f3Body',  label: 'Feature 3 Text',  type: 'textarea' },
    ]
  },
  projects: {
    icon: '🗂️', label: 'Projects',
    defaults: {
      title: 'Featured Work', subtitle: 'A selection of recent projects.',
      p1Title: 'Project Alpha', p1Tag: 'Web App', p1Desc: 'A SaaS dashboard built for analytics-driven teams.',
      p2Title: 'Project Beta', p2Tag: 'Mobile', p2Desc: 'Cross-platform mobile experience for 100k+ users.',
      p3Title: 'Project Gamma', p3Tag: 'Brand', p3Desc: 'Complete brand identity and design system.',
    },
    fields: [
      { key: 'title',   label: 'Section Title',   type: 'input' },
      { key: 'subtitle',label: 'Subtitle',         type: 'input' },
      { key: 'p1Title', label: 'Project 1 Name',   type: 'input' },
      { key: 'p1Tag',   label: 'Project 1 Tag',    type: 'input' },
      { key: 'p1Desc',  label: 'Project 1 Desc',   type: 'textarea' },
      { key: 'p2Title', label: 'Project 2 Name',   type: 'input' },
      { key: 'p2Tag',   label: 'Project 2 Tag',    type: 'input' },
      { key: 'p2Desc',  label: 'Project 2 Desc',   type: 'textarea' },
      { key: 'p3Title', label: 'Project 3 Name',   type: 'input' },
      { key: 'p3Tag',   label: 'Project 3 Tag',    type: 'input' },
    ]
  },
  testimonials: {
    icon: '💬', label: 'Testimonials',
    defaults: {
      title: 'What People Say',
      t1Name: 'Sarah Chen', t1Role: 'Founder, NovaTech', t1Text: '"Absolutely transformed the way we build. We shipped our MVP in half the time expected."',
      t2Name: 'Marcus Williams', t2Role: 'Lead Designer, Drift', t2Text: '"The tooling is a dream. Clean, fast, and the output is always pixel-perfect."',
      t3Name: 'Priya Sharma', t3Role: 'CTO, Luminary', t3Text: '"Finally a platform that takes performance seriously. Our Lighthouse score went from 60 to 98."',
    },
    fields: [
      { key: 'title',  label: 'Section Title', type: 'input' },
      { key: 't1Name', label: 'Review 1 Name', type: 'input' },
      { key: 't1Role', label: 'Review 1 Role', type: 'input' },
      { key: 't1Text', label: 'Review 1 Text', type: 'textarea' },
      { key: 't2Name', label: 'Review 2 Name', type: 'input' },
      { key: 't2Role', label: 'Review 2 Role', type: 'input' },
      { key: 't2Text', label: 'Review 2 Text', type: 'textarea' },
    ]
  },
  pricing: {
    icon: '💎', label: 'Pricing',
    defaults: {
      title: 'Simple Pricing', subtitle: 'No hidden fees. Cancel anytime.',
      planFree: 'Free', priceF: '$0', featF: '1 project\n5 pages\nBasic templates\nCommunity support',
      planPro: 'Pro', priceP: '$19', featP: 'Unlimited projects\nCustom domain\nPriority support\nAdvanced analytics',
      planTeam: 'Team', priceT: '$49', featT: 'Everything in Pro\nTeam collaboration\nSSOintegration\nDedicated support',
    },
    fields: [
      { key: 'title',    label: 'Section Title', type: 'input' },
      { key: 'subtitle', label: 'Subtitle',       type: 'input' },
      { key: 'planFree', label: 'Plan 1 Name',    type: 'input' },
      { key: 'priceF',   label: 'Plan 1 Price',   type: 'input' },
      { key: 'featF',    label: 'Plan 1 Features (one per line)', type: 'textarea' },
      { key: 'planPro',  label: 'Plan 2 Name',    type: 'input' },
      { key: 'priceP',   label: 'Plan 2 Price',   type: 'input' },
      { key: 'featP',    label: 'Plan 2 Features (one per line)', type: 'textarea' },
    ]
  },
  contact: {
    icon: '📬', label: 'Contact',
    defaults: { title: "Let's Work Together", subtitle: "Have a project in mind? We'd love to hear from you.", email: 'hello@example.com', phone: '+1 (555) 000-0000', address: '123 Startup Lane, San Francisco, CA' },
    fields: [
      { key: 'title',    label: 'Section Title', type: 'input' },
      { key: 'subtitle', label: 'Subtitle',       type: 'textarea' },
      { key: 'email',    label: 'Email Address',  type: 'input' },
      { key: 'phone',    label: 'Phone',          type: 'input' },
      { key: 'address',  label: 'Address',        type: 'input' },
    ]
  },
  custom: {
    icon: '✏️', label: 'Custom',
    defaults: { title: 'Custom Section', content: 'This is a custom text block. Click to edit and add your own content here.', background: '#f9f9f9' },
    fields: [
      { key: 'title',   label: 'Title',        type: 'input' },
      { key: 'content', label: 'Content',      type: 'textarea' },
    ]
  }
};

/* ─────────────────────────────────────────────────────
   TEMPLATES
───────────────────────────────────────────────────── */
const TEMPLATES = {
  portfolio: {
    name: 'Portfolio',
    theme: 'dark',
    sections: ['hero', 'about', 'projects', 'contact']
  },
  startup: {
    name: 'Startup Landing',
    theme: 'gradient',
    sections: ['hero', 'features', 'testimonials', 'pricing', 'contact']
  },
  blog: {
    name: 'Blog',
    theme: 'light',
    sections: ['hero', 'custom', 'contact']
  }
};

/* ─────────────────────────────────────────────────────
   THEME DEFINITIONS (for preview iframe)
───────────────────────────────────────────────────── */
const THEMES = {
  dark: {
    '--bg':       '#0f1117',
    '--bg2':      '#1a1f2e',
    '--card':     '#1e2435',
    '--accent':   '#6E56CF',
    '--accent2':  '#2DD4BF',
    '--text':     '#E6EDF3',
    '--text2':    '#8B949E',
    '--border':   'rgba(255,255,255,0.08)',
    '--hero-grad':'linear-gradient(135deg, #0f1117 0%, #1a0e3a 100%)',
  },
  light: {
    '--bg':       '#F9FAFB',
    '--bg2':      '#FFFFFF',
    '--card':     '#FFFFFF',
    '--accent':   '#6E56CF',
    '--accent2':  '#059669',
    '--text':     '#111827',
    '--text2':    '#6B7280',
    '--border':   'rgba(0,0,0,0.08)',
    '--hero-grad':'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)',
  },
  gradient: {
    '--bg':       '#0A0015',
    '--bg2':      '#130025',
    '--card':     'rgba(255,255,255,0.05)',
    '--accent':   '#A78BFA',
    '--accent2':  '#34D399',
    '--text':     '#F5F3FF',
    '--text2':    '#A78BFA',
    '--border':   'rgba(167,139,250,0.15)',
    '--hero-grad':'linear-gradient(135deg, #0A0015 0%, #1a0035 40%, #001a35 100%)',
  },
  minimal: {
    '--bg':       '#FAFAFA',
    '--bg2':      '#FFFFFF',
    '--card':     '#F4F4F5',
    '--accent':   '#18181B',
    '--accent2':  '#71717A',
    '--text':     '#09090B',
    '--text2':    '#71717A',
    '--border':   'rgba(0,0,0,0.06)',
    '--hero-grad':'linear-gradient(135deg, #FAFAFA 0%, #F4F4F5 100%)',
  }
};

/* ─────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────── */
const STORAGE_KEY = 'pageforge_project_v2';

let state = {
  projectName: 'My Website',
  theme: 'dark',
  sections: []
};

let undoStack = [];
let redoStack = [];
let activeSection = null;  // id of currently editing section
let autosaveInterval = null;
let lastSavedAt = null;
let dragSrcId = null;
let dragOverId = null;
let isPreviewMode = false;

/* ─────────────────────────────────────────────────────
   UTILS
───────────────────────────────────────────────────── */
function uid() {
  return 'sec_' + Math.random().toString(36).slice(2, 9);
}

function cloneState() {
  return JSON.parse(JSON.stringify(state));
}

function countWords() {
  return state.sections.reduce((acc, sec) => {
    const text = Object.values(sec).join(' ');
    return acc + (text.match(/\w+/g) || []).length;
  }, 0);
}

function estimateKb() {
  const html = buildPreviewHtml();
  return Math.round(new Blob([html]).size / 1024 * 10) / 10;
}

/* ─────────────────────────────────────────────────────
   UNDO / REDO
───────────────────────────────────────────────────── */
function pushUndo() {
  undoStack.push(JSON.stringify(state));
  if (undoStack.length > 50) undoStack.shift();
  redoStack = [];
  updateUndoRedoButtons();
  markUnsaved();
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(JSON.stringify(state));
  state = JSON.parse(undoStack.pop());
  render();
  updateUndoRedoButtons();
  toast('Undone', 'info');
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(JSON.stringify(state));
  state = JSON.parse(redoStack.pop());
  render();
  updateUndoRedoButtons();
  toast('Redone', 'info');
}

function updateUndoRedoButtons() {
  ELEM.btnUndo.disabled = !undoStack.length;
  ELEM.btnRedo.disabled = !redoStack.length;
  ELEM.btnUndo.style.opacity = undoStack.length ? '1' : '0.35';
  ELEM.btnRedo.style.opacity = redoStack.length ? '1' : '0.35';
}

/* ─────────────────────────────────────────────────────
   SAVE / LOAD
───────────────────────────────────────────────────── */
function saveProject() {
  setStatus('saving');
  setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      lastSavedAt = new Date();
      setStatus('saved');
      ELEM.autosaveTime.textContent = 'Saved ' + lastSavedAt.toLocaleTimeString();
    } catch (e) {
      setStatus('unsaved');
      toast('Save failed — localStorage may be full', 'error');
    }
  }, 200);
}

function loadProject() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    state = saved;
    return true;
  } catch (e) {
    return false;
  }
}

function markUnsaved() {
  setStatus('unsaved');
}

function setStatus(s) {
  const dot = ELEM.statusDot;
  const label = ELEM.statusLabel;
  dot.className = 'status-dot';
  if (s === 'saving') {
    dot.classList.add('saving');
    label.textContent = 'Saving…';
  } else if (s === 'saved') {
    label.textContent = 'Saved';
  } else {
    dot.classList.add('unsaved');
    label.textContent = 'Unsaved';
  }
}

function startAutosave() {
  if (autosaveInterval) clearInterval(autosaveInterval);
  autosaveInterval = setInterval(() => {
    if (ELEM.autosaveToggle.checked) saveProject();
  }, 30000);
}

/* ─────────────────────────────────────────────────────
   SECTION MANAGEMENT
───────────────────────────────────────────────────── */
function createSection(type) {
  const def = SECTION_DEFS[type];
  return {
    id: uid(),
    type,
    ...JSON.parse(JSON.stringify(def.defaults))
  };
}

function addSection(type) {
  pushUndo();
  const sec = createSection(type);
  state.sections.push(sec);
  render();
  openEditor(sec.id);
  toast(`${SECTION_DEFS[type].label} section added`, 'success');
}

function deleteSection(id) {
  pushUndo();
  state.sections = state.sections.filter(s => s.id !== id);
  if (activeSection === id) closeEditor();
  render();
}

function moveSectionUp(id) {
  const idx = state.sections.findIndex(s => s.id === id);
  if (idx <= 0) return;
  pushUndo();
  [state.sections[idx - 1], state.sections[idx]] = [state.sections[idx], state.sections[idx - 1]];
  render();
}

function moveSectionDown(id) {
  const idx = state.sections.findIndex(s => s.id === id);
  if (idx < 0 || idx >= state.sections.length - 1) return;
  pushUndo();
  [state.sections[idx], state.sections[idx + 1]] = [state.sections[idx + 1], state.sections[idx]];
  render();
}

/* ─────────────────────────────────────────────────────
   EDITOR DRAWER
───────────────────────────────────────────────────── */
function openEditor(id) {
  const sec = state.sections.find(s => s.id === id);
  if (!sec) return;
  activeSection = id;

  // Highlight in list
  document.querySelectorAll('.section-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });

  const def = SECTION_DEFS[sec.type];
  ELEM.drawerSectionType.textContent = def.label;

  // Build fields
  ELEM.drawerFields.innerHTML = '';
  def.fields.forEach(f => {
    const group = document.createElement('div');
    group.className = 'field-group';

    const lbl = document.createElement('label');
    lbl.className = 'field-label';
    lbl.textContent = f.label;

    let ctrl;
    if (f.type === 'textarea') {
      ctrl = document.createElement('textarea');
      ctrl.className = 'field-textarea';
      ctrl.rows = 3;
    } else {
      ctrl = document.createElement('input');
      ctrl.type = 'text';
      ctrl.className = 'field-input';
    }
    ctrl.value = sec[f.key] || '';

    ctrl.addEventListener('input', () => {
      sec[f.key] = ctrl.value;
      markUnsaved();
      refreshPreview();
      updateStats();
    });

    group.appendChild(lbl);
    group.appendChild(ctrl);
    ELEM.drawerFields.appendChild(group);
  });

  ELEM.editorDrawer.classList.add('open');
}

function closeEditor() {
  activeSection = null;
  ELEM.editorDrawer.classList.remove('open');
  document.querySelectorAll('.section-item').forEach(el => el.classList.remove('active'));
}

/* ─────────────────────────────────────────────────────
   PREVIEW HTML BUILDER
───────────────────────────────────────────────────── */
function buildPreviewHtml(forExport = false) {
  const t = THEMES[state.theme] || THEMES.dark;

  const cssVars = Object.entries(t).map(([k, v]) => `${k}: ${v};`).join('\n    ');

  const sectionHtml = state.sections.map(sec => renderSection(sec, t)).join('\n');

  const navLinks = state.sections.map(sec => {
    const label = SECTION_DEFS[sec.type]?.label || sec.type;
    return `<a href="#${sec.id}">${label}</a>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(state.projectName)}</title>
  <style>
    :root {
      ${cssVars}
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: "Inter", "Segoe UI", system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    /* NAV */
    .pf-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(15,17,23,0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 0 5%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .pf-nav-brand { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.5px; color: var(--text); }
    .pf-nav-brand span { color: var(--accent2); }
    .pf-nav-links { display: flex; gap: 28px; }
    .pf-nav-links a { color: var(--text2); text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.15s; }
    .pf-nav-links a:hover { color: var(--text); }
    .pf-nav-cta {
      background: var(--accent);
      color: #fff;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.15s;
    }
    .pf-nav-cta:hover { opacity: 0.85; }

    /* SHARED SECTION STYLES */
    .pf-section { padding: 96px 8% 80px; }
    .pf-section-alt { background: var(--bg2); }
    .pf-eyebrow {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--accent2);
      margin-bottom: 12px;
    }
    .pf-h2 {
      font-size: clamp(1.75rem, 3.5vw, 2.5rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      color: var(--text);
      margin-bottom: 12px;
      line-height: 1.15;
    }
    .pf-sub {
      font-size: 1rem;
      color: var(--text2);
      max-width: 560px;
      margin: 0 auto 48px;
      text-align: center;
    }
    .pf-center { text-align: center; }

    /* HERO */
    .pf-hero {
      min-height: 88vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 120px 8% 80px;
      background: var(--hero-grad);
      position: relative;
      overflow: hidden;
    }
    .pf-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 60% 50% at 50% 60%, rgba(110,86,207,0.18) 0%, transparent 70%);
      pointer-events: none;
    }
    .pf-hero-inner { position: relative; max-width: 760px; margin: 0 auto; }
    .pf-hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 5px 14px;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--accent2);
      margin-bottom: 24px;
    }
    .pf-hero-title {
      font-size: clamp(2.4rem, 5.5vw, 4rem);
      font-weight: 900;
      letter-spacing: -0.05em;
      line-height: 1.08;
      color: var(--text);
      margin-bottom: 20px;
    }
    .pf-hero-title span { color: var(--accent); }
    .pf-hero-sub {
      font-size: clamp(1rem, 2vw, 1.2rem);
      color: var(--text2);
      max-width: 520px;
      margin: 0 auto 36px;
      line-height: 1.65;
    }
    .pf-hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .pf-btn-primary {
      background: var(--accent);
      color: #fff;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .pf-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(110,86,207,0.35); }
    .pf-btn-secondary {
      background: transparent;
      color: var(--text);
      padding: 13px 24px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      border: 1px solid var(--border);
      transition: background 0.15s;
    }
    .pf-btn-secondary:hover { background: var(--bg2); }

    /* ABOUT */
    .pf-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; max-width: 1100px; margin: 0 auto; }
    .pf-about-stats { display: flex; gap: 32px; margin-top: 32px; }
    .pf-stat { border-left: 3px solid var(--accent); padding-left: 14px; }
    .pf-stat-val { font-size: 2rem; font-weight: 800; color: var(--text); letter-spacing: -0.03em; }
    .pf-stat-key { font-size: 0.8rem; color: var(--text2); }
    .pf-about-visual {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text2);
      font-size: 0.9rem;
      position: relative;
      overflow: hidden;
    }
    .pf-about-visual::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 180px; height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(110,86,207,0.25) 0%, transparent 70%);
    }

    /* FEATURES */
    .pf-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
    .pf-feature-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      transition: transform 0.2s, border-color 0.2s;
    }
    .pf-feature-card:hover { transform: translateY(-3px); border-color: var(--accent); }
    .pf-feature-icon {
      width: 42px; height: 42px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
      margin-bottom: 14px;
    }
    .pf-feature-title { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
    .pf-feature-body { font-size: 0.875rem; color: var(--text2); line-height: 1.6; }

    /* PROJECTS */
    .pf-projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
    .pf-project-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s;
    }
    .pf-project-card:hover { transform: translateY(-4px); }
    .pf-project-thumb {
      height: 180px;
      background: linear-gradient(135deg, var(--bg2) 0%, rgba(110,86,207,0.2) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text2);
      font-size: 32px;
    }
    .pf-project-body { padding: 18px; }
    .pf-project-tag {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--accent2);
      margin-bottom: 6px;
    }
    .pf-project-name { font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
    .pf-project-desc { font-size: 0.85rem; color: var(--text2); }

    /* TESTIMONIALS */
    .pf-testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
    .pf-testi-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }
    .pf-testi-stars { color: #FBBF24; font-size: 14px; margin-bottom: 12px; }
    .pf-testi-text { font-size: 0.9rem; color: var(--text); line-height: 1.65; margin-bottom: 16px; font-style: italic; }
    .pf-testi-author { display: flex; align-items: center; gap: 10px; }
    .pf-testi-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-weight: 700;
      font-size: 13px;
      color: #fff;
      flex-shrink: 0;
    }
    .pf-testi-name { font-size: 0.875rem; font-weight: 700; }
    .pf-testi-role { font-size: 0.78rem; color: var(--text2); }

    /* PRICING */
    .pf-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 900px; margin: 0 auto; }
    .pf-pricing-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px;
      text-align: center;
    }
    .pf-pricing-card.featured {
      border-color: var(--accent);
      background: linear-gradient(135deg, rgba(110,86,207,0.12) 0%, rgba(45,212,191,0.06) 100%);
    }
    .pf-pricing-badge { display: inline-block; background: var(--accent); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 2px 10px; border-radius: 20px; margin-bottom: 12px; }
    .pf-plan-name { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
    .pf-plan-price { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 4px; }
    .pf-plan-price span { font-size: 1rem; font-weight: 400; color: var(--text2); }
    .pf-plan-feats { list-style: none; margin: 16px 0 24px; text-align: left; display: flex; flex-direction: column; gap: 8px; }
    .pf-plan-feats li { font-size: 0.875rem; color: var(--text2); display: flex; gap: 8px; }
    .pf-plan-feats li::before { content: '✓'; color: var(--accent2); font-weight: 700; flex-shrink: 0; }
    .pf-plan-cta {
      display: block;
      padding: 11px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 700;
      text-decoration: none;
      border: 1px solid var(--border);
      color: var(--text);
      transition: all 0.15s;
    }
    .pf-pricing-card.featured .pf-plan-cta { background: var(--accent); color: #fff; border-color: transparent; }

    /* CONTACT */
    .pf-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; max-width: 900px; margin: 0 auto; }
    .pf-contact-info { display: flex; flex-direction: column; gap: 20px; }
    .pf-contact-item { display: flex; gap: 14px; align-items: flex-start; }
    .pf-contact-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--card); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .pf-contact-text strong { display: block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text2); margin-bottom: 2px; }
    .pf-contact-text span { font-size: 0.9rem; color: var(--text); }
    .pf-form { display: flex; flex-direction: column; gap: 12px; }
    .pf-form input, .pf-form textarea {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      padding: 12px 14px;
      font-size: 0.875rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s;
    }
    .pf-form input:focus, .pf-form textarea:focus { border-color: var(--accent); }
    .pf-form textarea { min-height: 100px; resize: vertical; }

    /* CUSTOM */
    .pf-custom {
      max-width: 780px;
      margin: 0 auto;
    }
    .pf-custom-content {
      font-size: 1rem;
      color: var(--text2);
      line-height: 1.75;
      white-space: pre-wrap;
    }

    /* FOOTER */
    .pf-footer {
      background: var(--bg2);
      border-top: 1px solid var(--border);
      padding: 32px 8%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .pf-footer-brand { font-weight: 700; font-size: 0.95rem; }
    .pf-footer-copy { font-size: 0.8rem; color: var(--text2); }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .pf-nav-links, .pf-nav-cta { display: none; }
      .pf-features-grid, .pf-testi-grid, .pf-pricing-grid { grid-template-columns: 1fr; }
      .pf-projects-grid { grid-template-columns: 1fr; }
      .pf-about-grid, .pf-contact-grid { grid-template-columns: 1fr; }
      .pf-section { padding: 60px 5% 48px; }
    }
  </style>
</head>
<body>
  <nav class="pf-nav">
    <div class="pf-nav-brand">${escapeHtml(state.projectName).replace(/ (\S+)$/, ' <span>$1</span>')}</div>
    <div class="pf-nav-links">${navLinks}</div>
    <a href="#contact" class="pf-nav-cta">Contact →</a>
  </nav>

  ${sectionHtml}

  <footer class="pf-footer">
    <div class="pf-footer-brand">${escapeHtml(state.projectName)}</div>
    <div class="pf-footer-copy">Built with PageForge Studio · ${new Date().getFullYear()}</div>
  </footer>
</body>
</html>`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSection(sec, t) {
  const e = escapeHtml;
  switch (sec.type) {
    case 'hero':
      return `
<section id="${sec.id}" class="pf-hero">
  <div class="pf-hero-inner">
    <div class="pf-hero-badge">✦ Welcome</div>
    <h1 class="pf-hero-title">${e(sec.title)}</h1>
    <p class="pf-hero-sub">${e(sec.subtitle)}</p>
    <div class="pf-hero-actions">
      ${sec.cta ? `<a href="#" class="pf-btn-primary">${e(sec.cta)} →</a>` : ''}
      ${sec.ctaSecondary ? `<a href="#" class="pf-btn-secondary">${e(sec.ctaSecondary)}</a>` : ''}
    </div>
  </div>
</section>`;

    case 'about':
      return `
<section id="${sec.id}" class="pf-section pf-section-alt">
  <div class="pf-about-grid">
    <div>
      <span class="pf-eyebrow">${e(sec.subtitle)}</span>
      <h2 class="pf-h2">${e(sec.title)}</h2>
      <p style="color:var(--text2);font-size:0.95rem;line-height:1.75;">${e(sec.content)}</p>
      <div class="pf-about-stats">
        <div class="pf-stat"><div class="pf-stat-val">${e(sec.stat1Val)}</div><div class="pf-stat-key">${e(sec.stat1Label)}</div></div>
        <div class="pf-stat"><div class="pf-stat-val">${e(sec.stat2Val)}</div><div class="pf-stat-key">${e(sec.stat2Label)}</div></div>
        <div class="pf-stat"><div class="pf-stat-val">${e(sec.stat3Val)}</div><div class="pf-stat-key">${e(sec.stat3Label)}</div></div>
      </div>
    </div>
    <div class="pf-about-visual">
      <span style="position:relative;">🧑‍💻</span>
    </div>
  </div>
</section>`;

    case 'features': {
      const icons = ['⚡','🔒','📈','🧑‍💻','📊','🌐'];
      const feats = [];
      for (let i = 1; i <= 6; i++) {
        const t = sec[`f${i}Title`];
        const b = sec[`f${i}Body`];
        if (t || b) feats.push(`
        <div class="pf-feature-card">
          <div class="pf-feature-icon">${icons[i-1] || '✦'}</div>
          <div class="pf-feature-title">${e(t)}</div>
          <div class="pf-feature-body">${e(b)}</div>
        </div>`);
      }
      return `
<section id="${sec.id}" class="pf-section">
  <div class="pf-center"><h2 class="pf-h2">${e(sec.title)}</h2><p class="pf-sub">${e(sec.subtitle)}</p></div>
  <div class="pf-features-grid">${feats.join('')}</div>
</section>`;
    }

    case 'projects': {
      const thumbEmojis = ['🗂️','💡','🎨'];
      const cards = [];
      for (let i = 1; i <= 3; i++) {
        const name = sec[`p${i}Title`];
        const tag  = sec[`p${i}Tag`];
        const desc = sec[`p${i}Desc`];
        if (name) cards.push(`
        <div class="pf-project-card">
          <div class="pf-project-thumb">${thumbEmojis[i-1]}</div>
          <div class="pf-project-body">
            <div class="pf-project-tag">${e(tag)}</div>
            <div class="pf-project-name">${e(name)}</div>
            <div class="pf-project-desc">${e(desc)}</div>
          </div>
        </div>`);
      }
      return `
<section id="${sec.id}" class="pf-section pf-section-alt">
  <div class="pf-center"><h2 class="pf-h2">${e(sec.title)}</h2><p class="pf-sub">${e(sec.subtitle)}</p></div>
  <div class="pf-projects-grid">${cards.join('')}</div>
</section>`;
    }

    case 'testimonials': {
      const cards = [];
      for (let i = 1; i <= 3; i++) {
        const name = sec[`t${i}Name`];
        const role = sec[`t${i}Role`];
        const text = sec[`t${i}Text`];
        if (name) cards.push(`
        <div class="pf-testi-card">
          <div class="pf-testi-stars">★★★★★</div>
          <p class="pf-testi-text">${e(text)}</p>
          <div class="pf-testi-author">
            <div class="pf-testi-avatar">${e(name).charAt(0)}</div>
            <div><div class="pf-testi-name">${e(name)}</div><div class="pf-testi-role">${e(role)}</div></div>
          </div>
        </div>`);
      }
      return `
<section id="${sec.id}" class="pf-section">
  <div class="pf-center"><h2 class="pf-h2">${e(sec.title)}</h2></div>
  <div class="pf-testi-grid">${cards.join('')}</div>
</section>`;
    }

    case 'pricing': {
      const plans = [
        { nameKey: 'planFree', priceKey: 'priceF', featsKey: 'featF', featured: false },
        { nameKey: 'planPro',  priceKey: 'priceP', featsKey: 'featP', featured: true },
        { nameKey: 'planTeam', priceKey: 'priceT', featsKey: 'featT', featured: false },
      ];
      const cards = plans.map(p => {
        const name  = sec[p.nameKey] || '';
        const price = sec[p.priceKey] || '$0';
        const feats = (sec[p.featsKey] || '').split('\n').filter(Boolean);
        const featList = feats.map(f => `<li>${e(f)}</li>`).join('');
        return `
        <div class="pf-pricing-card${p.featured ? ' featured' : ''}">
          ${p.featured ? '<div class="pf-pricing-badge">Most Popular</div>' : ''}
          <div class="pf-plan-name">${e(name)}</div>
          <div class="pf-plan-price">${e(price)}<span>/mo</span></div>
          <ul class="pf-plan-feats">${featList}</ul>
          <a href="#" class="pf-plan-cta">Get ${e(name)} →</a>
        </div>`;
      });
      return `
<section id="${sec.id}" class="pf-section pf-section-alt">
  <div class="pf-center"><h2 class="pf-h2">${e(sec.title)}</h2><p class="pf-sub">${e(sec.subtitle)}</p></div>
  <div class="pf-pricing-grid">${cards.join('')}</div>
</section>`;
    }

    case 'contact':
      return `
<section id="${sec.id}" class="pf-section">
  <div class="pf-center"><h2 class="pf-h2">${e(sec.title)}</h2><p class="pf-sub">${e(sec.subtitle)}</p></div>
  <div class="pf-contact-grid">
    <div class="pf-contact-info">
      ${sec.email ? `<div class="pf-contact-item"><div class="pf-contact-icon">✉️</div><div class="pf-contact-text"><strong>Email</strong><span>${e(sec.email)}</span></div></div>` : ''}
      ${sec.phone ? `<div class="pf-contact-item"><div class="pf-contact-icon">📞</div><div class="pf-contact-text"><strong>Phone</strong><span>${e(sec.phone)}</span></div></div>` : ''}
      ${sec.address ? `<div class="pf-contact-item"><div class="pf-contact-icon">📍</div><div class="pf-contact-text"><strong>Location</strong><span>${e(sec.address)}</span></div></div>` : ''}
    </div>
    <form class="pf-form" onsubmit="return false;">
      <input type="text" placeholder="Your name" />
      <input type="email" placeholder="Email address" />
      <textarea placeholder="Tell us about your project…"></textarea>
      <button type="submit" class="pf-btn-primary" style="border:none;cursor:pointer;justify-content:center;">Send Message →</button>
    </form>
  </div>
</section>`;

    case 'custom':
      return `
<section id="${sec.id}" class="pf-section pf-section-alt">
  <div class="pf-custom">
    <h2 class="pf-h2">${e(sec.title)}</h2>
    <p class="pf-custom-content">${e(sec.content)}</p>
  </div>
</section>`;

    default:
      return `<section id="${sec.id}" class="pf-section"><p>Unknown section type: ${e(sec.type)}</p></section>`;
  }
}

/* ─────────────────────────────────────────────────────
   PREVIEW REFRESH
───────────────────────────────────────────────────── */
let refreshTimer = null;
function refreshPreview() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(_doRefresh, 80);
}

function _doRefresh() {
  const html = buildPreviewHtml();
  const frame = ELEM.previewFrame;

  // Hide empty state if we have sections
  ELEM.emptyCanvas.classList.toggle('hidden', state.sections.length > 0);

  if (state.sections.length === 0) {
    frame.srcdoc = '<html><body style="background:#fff"></body></html>';
    return;
  }
  frame.srcdoc = html;
  updateStats();
}

/* ─────────────────────────────────────────────────────
   SECTION LIST RENDER
───────────────────────────────────────────────────── */
function renderSectionList() {
  const list = ELEM.sectionList;
  list.innerHTML = '';

  if (state.sections.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'text-align:center;padding:20px 0;color:var(--text-muted);font-size:12px;';
    empty.textContent = 'No sections yet';
    list.appendChild(empty);
    return;
  }

  state.sections.forEach((sec, i) => {
    const def = SECTION_DEFS[sec.type];
    const item = document.createElement('div');
    item.className = 'section-item';
    item.dataset.id = sec.id;
    item.draggable = true;

    if (sec.id === activeSection) item.classList.add('active');

    item.innerHTML = `
      <span class="section-drag-handle" title="Drag to reorder">⠿</span>
      <div class="section-item-icon">${def?.icon || '▪'}</div>
      <div class="section-item-info">
        <div class="section-item-type">${def?.label || sec.type}</div>
        <div class="section-item-title">${escapeHtml(sec.title || '').slice(0, 30) || 'Click to edit'}</div>
      </div>
      <div class="section-item-actions">
        <button class="section-action-btn" data-action="up" title="Move up">↑</button>
        <button class="section-action-btn" data-action="down" title="Move down">↓</button>
        <button class="section-action-btn del" data-action="delete" title="Delete">✕</button>
      </div>`;

    // Click to open editor
    item.addEventListener('click', (e) => {
      if (e.target.closest('.section-action-btn') || e.target.closest('.section-drag-handle')) return;
      openEditor(sec.id);
    });

    // Action buttons
    item.querySelectorAll('.section-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === 'up') moveSectionUp(sec.id);
        else if (action === 'down') moveSectionDown(sec.id);
        else if (action === 'delete') deleteSection(sec.id);
      });
    });

    // Drag & drop
    item.addEventListener('dragstart', (e) => {
      dragSrcId = sec.id;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => {
      dragSrcId = null;
      item.classList.remove('dragging');
      document.querySelectorAll('.section-item').forEach(el => el.classList.remove('drag-over'));
    });
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      document.querySelectorAll('.section-item').forEach(el => el.classList.remove('drag-over'));
      if (sec.id !== dragSrcId) item.classList.add('drag-over');
    });
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      if (!dragSrcId || dragSrcId === sec.id) return;
      pushUndo();
      const fromIdx = state.sections.findIndex(s => s.id === dragSrcId);
      const toIdx   = state.sections.findIndex(s => s.id === sec.id);
      const moved = state.sections.splice(fromIdx, 1)[0];
      state.sections.splice(toIdx, 0, moved);
      render();
    });

    list.appendChild(item);
  });
}

/* ─────────────────────────────────────────────────────
   STATS UPDATE
───────────────────────────────────────────────────── */
function updateStats() {
  const n = state.sections.length;
  ELEM.sectionCount.textContent = n;
  ELEM.statSections.textContent = n;
  ELEM.statWords.textContent = countWords();
  ELEM.statKb.textContent = estimateKb();
  ELEM.statTheme.textContent = state.theme.charAt(0).toUpperCase() + state.theme.slice(1);
  document.getElementById('browserUrl').textContent =
    state.projectName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.com';
}

/* ─────────────────────────────────────────────────────
   MAIN RENDER
───────────────────────────────────────────────────── */
function render() {
  renderSectionList();
  refreshPreview();
  updateStats();
}

/* ─────────────────────────────────────────────────────
   EXPORT
───────────────────────────────────────────────────── */
function exportHtml() {
  const html = buildPreviewHtml(true);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (state.projectName || 'website').replace(/\s+/g, '-').toLowerCase() + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('HTML downloaded!', 'success');
}

function copyHtml() {
  const html = buildPreviewHtml(true);
  navigator.clipboard.writeText(html).then(() => {
    toast('HTML copied to clipboard!', 'success');
  }).catch(() => {
    toast('Copy failed — try downloading instead', 'error');
  });
}

/* ─────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────── */
function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon"></span><span>${escapeHtml(msg)}</span>`;
  ELEM.toastContainer.appendChild(el);
  setTimeout(() => {
    el.classList.add('removing');
    setTimeout(() => el.remove(), 250);
  }, 2800);
}

/* ─────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────── */
function openModal() { ELEM.modalOverlay.classList.add('open'); }
function closeModal() { ELEM.modalOverlay.classList.remove('open'); }

/* ─────────────────────────────────────────────────────
   LOAD TEMPLATE
───────────────────────────────────────────────────── */
function loadTemplate(key) {
  const tmpl = TEMPLATES[key];
  if (!tmpl) return;
  pushUndo();
  state.sections = tmpl.sections.map(type => createSection(type));
  state.theme = tmpl.theme;

  // Update theme chips
  document.querySelectorAll('.theme-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === tmpl.theme);
  });

  closeEditor();
  render();
  toast(`Template "${tmpl.name}" loaded`, 'success');
}

/* ─────────────────────────────────────────────────────
   ELEMENT CACHE
───────────────────────────────────────────────────── */
const ELEM = {};
function cacheElements() {
  [
    'btnUndo','btnRedo','btnPreviewToggle','btnExport',
    'projectName','statusDot','statusLabel',
    'sectionList','sectionCount',
    'editorDrawer','drawerSectionType','drawerFields','drawerClose',
    'btnDeleteSection',
    'previewFrame','emptyCanvas',
    'btnDownload','btnCopyCode','btnSave','btnReset',
    'statSections','statWords','statKb','statTheme',
    'autosaveToggle','autosaveTime',
    'modalOverlay','modalCancel','modalConfirm',
    'toastContainer',
  ].forEach(id => {
    ELEM[id] = document.getElementById(id);
  });
}

/* ─────────────────────────────────────────────────────
   EVENT BINDINGS
───────────────────────────────────────────────────── */
function bindEvents() {
  // Undo / Redo
  ELEM.btnUndo.addEventListener('click', undo);
  ELEM.btnRedo.addEventListener('click', redo);

  // Project name
  ELEM.projectName.addEventListener('input', () => {
    state.projectName = ELEM.projectName.value;
    markUnsaved();
    refreshPreview();
    updateStats();
  });

  // Theme chips
  document.querySelectorAll('.theme-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      pushUndo();
      state.theme = btn.dataset.theme;
      document.querySelectorAll('.theme-chip').forEach(b => b.classList.toggle('active', b === btn));
      refreshPreview();
      updateStats();
    });
  });

  // Templates
  document.querySelectorAll('.template-btn').forEach(btn => {
    btn.addEventListener('click', () => loadTemplate(btn.dataset.template));
  });

  // Add section buttons
  document.querySelectorAll('.section-type-btn').forEach(btn => {
    btn.addEventListener('click', () => addSection(btn.dataset.type));
  });

  // Editor drawer close
  ELEM.drawerClose.addEventListener('click', closeEditor);
  ELEM.btnDeleteSection.addEventListener('click', () => {
    if (activeSection) deleteSection(activeSection);
  });

  // Viewport
  document.querySelectorAll('.viewport-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const vp = btn.dataset.vp;
      ELEM.previewFrame.className = 'preview-frame' + (vp !== 'desktop' ? ` vp-${vp}` : '');
    });
  });

  // Preview toggle
  ELEM.btnPreviewToggle.addEventListener('click', () => {
    isPreviewMode = !isPreviewMode;
    document.body.classList.toggle('preview-mode', isPreviewMode);
    ELEM.btnPreviewToggle.textContent = isPreviewMode ? '✕ Exit' : '👁 Preview';
  });

  // Refresh preview
  document.getElementById('btnRefreshPreview').addEventListener('click', refreshPreview);

  // Export
  ELEM.btnExport.addEventListener('click', exportHtml);
  ELEM.btnDownload.addEventListener('click', exportHtml);
  ELEM.btnCopyCode.addEventListener('click', copyHtml);

  // Save
  ELEM.btnSave.addEventListener('click', () => {
    saveProject();
    toast('Project saved!', 'success');
  });

  // Reset
  ELEM.btnReset.addEventListener('click', openModal);
  ELEM.modalCancel.addEventListener('click', closeModal);
  ELEM.modalConfirm.addEventListener('click', () => {
    closeModal();
    pushUndo();
    state = { projectName: 'My Website', theme: 'dark', sections: [] };
    ELEM.projectName.value = state.projectName;
    document.querySelectorAll('.theme-chip').forEach(b => b.classList.toggle('active', b.dataset.theme === 'dark'));
    closeEditor();
    render();
    toast('Project reset', 'info');
  });

  // Autosave toggle
  ELEM.autosaveToggle.addEventListener('change', () => {
    if (ELEM.autosaveToggle.checked) {
      startAutosave();
      toast('Autosave enabled', 'info');
    } else {
      clearInterval(autosaveInterval);
      toast('Autosave disabled', 'info');
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    if (!isCtrl) {
      if (e.key === 'Escape') closeEditor();
      return;
    }
    if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
    if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
    if (e.key === 's') { e.preventDefault(); saveProject(); toast('Saved', 'success'); }
    if (e.key === 'e') { e.preventDefault(); exportHtml(); }
  });

  // Close modal on overlay click
  ELEM.modalOverlay.addEventListener('click', (e) => {
    if (e.target === ELEM.modalOverlay) closeModal();
  });
}

/* ─────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────── */
function init() {
  cacheElements();
  bindEvents();
  updateUndoRedoButtons();

  // Try to restore from localStorage
  const restored = loadProject();
  if (restored) {
    ELEM.projectName.value = state.projectName;
    // Restore theme chip
    document.querySelectorAll('.theme-chip').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === state.theme);
    });
    toast('Project restored', 'success');
  }

  render();
  startAutosave();
}

document.addEventListener('DOMContentLoaded', init);