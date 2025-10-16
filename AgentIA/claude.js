// Extracted from claude.html
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

let messages = [];
let attachments = []; // {name, path, size}

function bubble(text, who) {
  const div = document.createElement('div');
  div.className = 'bubble ' + (who === 'user' ? 'usermsg' : 'aimsg');
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
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

  messages.push({ role:'user', content: parts.length === 1 && typeof parts[0] === 'object' && parts[0].type === 'text' ? text : parts });

  const ph = bubble('', 'ai');
  sendBtn.disabled = true;

  try {
    const stream = await puter.ai.chat(messages, { model:'claude-sonnet-4-5', stream:true, temperature:0.7 });
    let acc = '';
    for await (const part of stream) {
      const piece = part?.text || '';
      acc += piece;
      ph.textContent = acc;
      chatEl.scrollTop = chatEl.scrollHeight;
    }
    messages.push({ role:'assistant', content: acc });
  } catch (e) {
    ph.textContent = 'Erreur: ' + (e?.message || e);
  } finally {
    sendBtn.disabled = false;
    attachments = [];
    renderChips();
  }
}

sendBtn.addEventListener('click', send);
inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

(async function boot(){
  // Init thème (storage > prefers-color-scheme > default dark)
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const saved = localStorage.getItem('theme');
  const theme = saved || (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.checked = theme === 'light';
  }
  if (themeLabel) {
    themeLabel.textContent = theme === 'light' ? 'Light' : 'Dark';
  }

  await refreshAuth();
  try { await puter.kv.get('___noop'); await refreshAuth(); } catch {}
})();

// Basculer le thème avec un léger fade et persistance
if (themeToggle) {
  themeToggle.addEventListener('change', () => {
    const next = themeToggle.checked ? 'light' : 'dark';
    document.documentElement.classList.remove('theme-fade');
    // Forcer un reflow pour redémarrer l'animation
    // eslint-disable-next-line no-unused-expressions
    void document.documentElement.offsetWidth;
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.add('theme-fade');
    localStorage.setItem('theme', next);
    if (themeLabel) themeLabel.textContent = next === 'light' ? 'Light' : 'Dark';
  });
}
