const chatEl = document.getElementById('chat');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send');
const clearBtn = document.getElementById('clear');
const signinBtn = document.getElementById('signin');
const signoutBtn = document.getElementById('signout');
const userInfo = document.getElementById('user-info');
const fileInput = document.getElementById('file-input');
const btnLocal = document.getElementById('btn-local');
const btnCloud = document.getElementById('btn-cloud');
const chips = document.getElementById('chips');
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const providerSel = document.getElementById('provider');
const modelSel = document.getElementById('model');
const modelBadge = document.getElementById('model-badge');

let messages = [];
let attachments = [];

/* Catalogue modèles (extraits des tutos Puter) */
const CATALOG = {
  OpenAI: [
    'gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-5-chat-latest',
    'gpt-4.5-preview', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano',
    'gpt-4o', 'gpt-4o-mini', 'o1', 'o1-mini', 'o1-pro', 'o3', 'o3-mini', 'o4-mini'
  ],
  Claude: [
    'claude-sonnet-4-5', 'claude-sonnet-4', 'claude-opus-4', 'claude-opus-4-1', 'claude-3-7-sonnet', 'claude-3-7-opus'
  ],
  Gemini: [
    'google/gemini-2.5-pro', 'google/gemini-2.0-flash-lite-001', 'gemini-2.0-flash', 'google/gemini-flash-1.5'
  ],
  DeepSeek: [
    'deepseek-chat', 'deepseek-reasoner'
  ],
  Mistral: [
    'mistralai/mistral-large', 'mistralai/mistral-medium', 'mistralai/mistral-small', 'mistralai/mistral-nemo',
    'mistralai/codestral-2508'
  ]
};

function bubble(text, who) {
  const div = document.createElement('div');
  div.className = 'bubble ' + (who === 'user' ? 'usermsg' : 'aimsg');
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
}

// Normalise une erreur en texte lisible
function formatError(err) {
  try {
    if (!err) return 'Erreur inconnue';
    if (typeof err === 'string') return err;
    // Puter et autres: chemins fréquents
    if (err.message) return err.message;
    if (err.error?.message) return err.error.message;
    if (err.response?.data?.error?.message) return err.response.data.error.message;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.status) return `HTTP ${err.response.status}: ${err.response.statusText || ''}`.trim();
    // Si c'est un objet simple, on le stringify
    const json = JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
    if (json && json !== '{}') return json;
    return String(err);
  } catch {
    return 'Erreur (formatage impossible)';
  }
}

function renderChips() {
  chips.innerHTML = '';
  for (let i = 0; i < attachments.length; i++) {
    const a = attachments[i];
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = (a.name || a.path.split('/').pop());
    const x = document.createElement('button');
    x.textContent = '×';
    x.onclick = () => { attachments.splice(i,1); renderChips(); };
    pill.appendChild(x);
    chips.appendChild(pill);
  }
}

function setAuthUI(signed, user) {
  if (signed) {
    userInfo.textContent = user?.username ? ('Connecté: ' + user.username) : 'Connecté';
    signinBtn.style.display = 'none';
    signoutBtn.style.display = 'inline-block';
    sendBtn.disabled = false;
  } else {
    userInfo.textContent = 'Non connecté';
    signinBtn.style.display = 'inline-block';
    signoutBtn.style.display = 'none';
    sendBtn.disabled = true;
  }
}

async function refreshAuth() {
  try {
    const signed = await puter.auth.isSignedIn();
    if (signed) {
      const u = await puter.auth.getUser();
      setAuthUI(true, u);
    } else {
      setAuthUI(false);
    }
  } catch {
    userInfo.textContent = 'Erreur statut auth';
  }
}

/* Sélection modèles */
function populateProviders() {
  providerSel.innerHTML = '';
  Object.keys(CATALOG).forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    providerSel.appendChild(opt);
  });
}

function populateModels(provider, presetModel) {
  modelSel.innerHTML = '';
  const list = CATALOG[provider] || [];
  list.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    modelSel.appendChild(opt);
  });
  if (presetModel && list.includes(presetModel)) {
    modelSel.value = presetModel;
  }
  modelBadge.textContent = 'model: ' + modelSel.value;
  localStorage.setItem('puter_model_provider', provider);
  localStorage.setItem('puter_model_name', modelSel.value);
}

providerSel?.addEventListener('change', () => populateModels(providerSel.value));
modelSel?.addEventListener('change', () => {
  modelBadge.textContent = 'model: ' + modelSel.value;
  localStorage.setItem('puter_model_name', modelSel.value);
});

signinBtn.addEventListener('click', async () => {
  signinBtn.disabled = true;
  try { await puter.auth.signIn(); }
  catch(e) { alert('Connexion impossible: ' + (e?.message || e)); }
  finally { signinBtn.disabled = false; refreshAuth(); }
});

signoutBtn.addEventListener('click', async () => {
  try { await puter.auth.signOut(); } finally { refreshAuth(); }
});

clearBtn.addEventListener('click', () => { chatEl.innerHTML=''; messages=[]; attachments=[]; renderChips(); });

btnLocal.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  if (!fileInput.files?.length) return;
  try {
    const res = await puter.fs.upload(fileInput.files);
    const list = Array.isArray(res) ? res : [res];
    for (const f of list) attachments.push({ name: f.name, path: f.path, size: f.size });
    renderChips();
  } catch(e) {
    alert('Upload échoué: ' + (e?.message || e));
  } finally {
    fileInput.value = '';
  }
});

btnCloud.addEventListener('click', async () => {
  try {
    const picked = await puter.ui.showOpenFilePicker({ multiple:true, accept:'*/*' });
    for (const p of picked) attachments.push({ name: p.name, path: p.path, size: p.size });
    renderChips();
  } catch(e) {
    if (String(e).includes('AbortError')) return;
    alert('Sélection cloud échouée: ' + (e?.message || e));
  }
});

async function send() {
  const text = inputEl.value.trim();
  if (!text && attachments.length === 0) return;

  inputEl.value = '';
  const parts = [];
  for (const a of attachments) parts.push({ type:'file', puter_path: a.path });
  if (text) parts.push({ type:'text', text });

  const userDisplay = [text, ...attachments.map(a => `[fichier] ${a.name || a.path.split('/').pop()}`)].filter(Boolean).join('\n');
  bubble(userDisplay, 'user');

  const userMsg = (parts.length === 1 && parts[0].type === 'text') ? text : parts;
  messages.push({ role:'user', content: userMsg });

  const ph = bubble('', 'ai');
  sendBtn.disabled = true;

  try {
    const model = modelSel?.value || 'claude-sonnet-4-5';
    const stream = await puter.ai.chat(messages, { model, stream:true, temperature:0.7 });
    let acc = '';
    for await (const part of stream) {
      // Gère différents formats de stream et erreurs en-ligne
      if (part?.error) {
        throw part.error;
      }
      let piece = '';
      if (typeof part === 'string') {
        piece = part;
      } else if (typeof part?.text === 'string') {
        piece = part.text;
      } else if (part?.delta?.content) {
        piece = String(part.delta.content);
      } else if (Array.isArray(part?.choices) && part.choices[0]?.delta?.content) {
        piece = String(part.choices[0].delta.content);
      }
      acc += piece;
      ph.textContent = acc;
      chatEl.scrollTop = chatEl.scrollHeight;
    }
    messages.push({ role:'assistant', content: acc });
  } catch (e) {
    const msg = formatError(e);
    console.error('Chat error:', e);
    // Fallback automatique si usage-limited / permission denied
    if (/usage-limited-chat|Permission denied|403|quota|limit/i.test(msg)) {
      try {
        const fallbackModel = 'gpt-5-nano';
        let acc2 = '[Fallback testMode → ' + fallbackModel + ']\n';
        ph.textContent = acc2;
        const alt = await puter.ai.chat(messages, true, { model: fallbackModel, stream: true, temperature: 0.7 });
        for await (const part of alt) {
          const piece = typeof part?.text === 'string' ? part.text : '';
          acc2 += piece;
          ph.textContent = acc2;
          chatEl.scrollTop = chatEl.scrollHeight;
        }
        messages.push({ role:'assistant', content: acc2 });
      } catch (e2) {
        ph.textContent = 'Erreur (fallback): ' + formatError(e2) + '\nCause initiale: ' + msg;
      }
    } else {
      ph.textContent = 'Erreur: ' + msg;
    }
  } finally {
    sendBtn.disabled = false;
    attachments = [];
    renderChips();
  }
}

sendBtn.addEventListener('click', send);
inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

(async function boot(){
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem('theme');
  const theme = savedTheme || (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) themeToggle.checked = theme === 'light';
  if (themeLabel) themeLabel.textContent = theme === 'light' ? 'Light' : 'Dark';

  // Initialisation des sélecteurs modèle/fournisseur uniquement s'ils existent dans la page
  if (providerSel && modelSel && modelBadge) {
    populateProviders();
    const savedProv = localStorage.getItem('puter_model_provider') || 'Claude';
    const savedModel = localStorage.getItem('puter_model_name') || 'claude-sonnet-4-5';
    providerSel.value = savedProv;
    populateModels(savedProv, savedModel);
  }

  await refreshAuth();
  try { await puter.kv.get('___noop'); await refreshAuth(); } catch {}
})();

if (themeToggle) {
  themeToggle.addEventListener('change', () => {
    const next = themeToggle.checked ? 'light' : 'dark';
    document.documentElement.classList.remove('theme-fade');
    void document.documentElement.offsetWidth;
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.add('theme-fade');
    localStorage.setItem('theme', next);
    if (themeLabel) themeLabel.textContent = next === 'light' ? 'Light' : 'Dark';
  });
}