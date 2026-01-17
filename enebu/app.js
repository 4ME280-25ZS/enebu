import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  runTransaction,
  serverTimestamp,
  getDoc
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Firebase konfigurace: doplňte `apiKey` a `appId` z Firebase konzole.
// Project ID a messagingSenderId jsou předvyplněné podle vašeho projektu.
const firebaseConfig = {
  apiKey: "AIzaSyB0stcmih5M7z3fU88cPBG3eUGvsvP_8ek",
  authDomain: "wishlist-81b99.firebaseapp.com",
  projectId: "wishlist-81b99",
  storageBucket: "wishlist-81b99.appspot.com",
  messagingSenderId: "297493584471",
  appId: "1:297493584471:web:3d82da42aa199dd6d22112",
  measurementId: "G-1CCC6S3WTL"
};

function isConfigFilled(cfg){
  return cfg && cfg.apiKey && !cfg.apiKey.includes('<VLOŽTE') && cfg.appId && !cfg.appId.includes('<VLOŽTE');
}

if (!isConfigFilled(firebaseConfig)) {
  console.warn('Firebase config není plně vyplněn. Doplnťe `apiKey` a `appId` v `app.js`.');
}

let app = null;
let db = null;
if (isConfigFilled(firebaseConfig)) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

const $ = id => document.getElementById(id);
const titleEl = $('title');
const slugInput = $('slugInput');
const openBtn = $('openBtn');
const content = $('content');
const itemsUl = $('items');
const addBtn = $('addBtn');
const itemName = $('itemName');
const itemDesc = $('itemDesc');
const itemUrl = $('itemUrl');

let currentSlug = null;
let unsubscribe = null;

function slugFromQuery() {
  const p = new URLSearchParams(location.search);
  return p.get('id');
}

function showMessage(msg) { alert(msg); }

openBtn.addEventListener('click', () => {
  const s = slugInput.value.trim();
  if (!s) { showMessage('Zadejte prosím slug (např. moje-narozeniny)'); return; }
  openWishlist(s);
});

addBtn.addEventListener('click', async () => {
  if (!db) { showMessage('Firebase config chybí.'); return; }
  const name = itemName.value.trim();
  if (!name) { showMessage('Zadejte název položky'); return; }
  try {
    const itemsCol = collection(db, 'wishlists', currentSlug, 'items');
    await addDoc(itemsCol, { name, description: itemDesc.value.trim()||null, url: itemUrl.value.trim()||null, owner: null, createdAt: serverTimestamp() });
    itemName.value=''; itemDesc.value=''; itemUrl.value='';
  } catch (e) { console.error(e); showMessage('Chyba při přidávání položky.'); }
});

async function openWishlist(slug){
  if (!db) { showMessage('Firebase config chybí.'); return; }
  if (unsubscribe) unsubscribe();
  currentSlug = slug;
  slugInput.value = slug;
  history.replaceState(null,'',`?id=${encodeURIComponent(slug)}`);

  // Ensure wishlist doc exists (set title if missing)
  const wlDocRef = doc(db,'wishlists',slug);
  try {
    const wlSnap = await getDoc(wlDocRef);
    if (!wlSnap.exists()) {
      await addDoc(collection(db,'wishlists'), {}); // noop (we'll create below differently)
      // Firestore doesn't let addDoc to set specific ID; instead set via setDoc if needed.
    }
  } catch(e){/* ignore */}

  titleEl.textContent = `Wishlist: ${slug}`;
  content.hidden = false;
  itemsUl.innerHTML = '';

  const itemsCol = collection(db,'wishlists',slug,'items');
  const q = query(itemsCol, orderBy('createdAt'));
  unsubscribe = onSnapshot(q, snap => {
    itemsUl.innerHTML = '';
    snap.forEach(docSnap => {
      const it = docSnap.data();
      const li = document.createElement('li');
      li.className = 'item';
      const h = document.createElement('h3');
      h.textContent = it.name || '(bez názvu)';
      li.appendChild(h);
      if (it.description) { const p = document.createElement('p'); p.textContent = it.description; li.appendChild(p); }
      if (it.url) { const a = document.createElement('a'); a.href = it.url; a.textContent = 'Odkaz'; a.target='_blank'; a.className='small'; li.appendChild(a); }
      const ownerP = document.createElement('p');
      if (it.owner) {
        ownerP.innerHTML = `Rezervováno: <span class="owner">${escapeHtml(it.owner)}</span>`;
      } else {
        ownerP.innerHTML = `<button data-id="${docSnap.id}" class="reserveBtn">Rezervovat</button>`;
      }
      li.appendChild(ownerP);
      itemsUl.appendChild(li);
    });

    // attach handlers
    document.querySelectorAll('.reserveBtn').forEach(btn => btn.addEventListener('click', onReserveClick));
  }, err => console.error(err));
}

async function onReserveClick(e){
  const id = e.currentTarget.dataset.id;
  const name = prompt('Zadejte svoje jméno, které se má zobrazit u dárku:');
  if (!name) return;
  try {
    const docRef = doc(db,'wishlists',currentSlug,'items',id);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);
      if (!snap.exists()) throw 'Položka neexistuje';
      const data = snap.data();
      if (data.owner) throw 'Položka již rezervována.';
      tx.update(docRef, { owner: name, reservedAt: serverTimestamp() });
    });
    showMessage('Položka rezervována.');
  } catch (err) {
    console.error(err);
    showMessage(typeof err === 'string' ? err : 'Chyba při rezervaci (možná už byla rezervována).');
  }
}

function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }

// auto-open if id in query
const qslug = slugFromQuery();
if (qslug) openWishlist(qslug);

export {};
