document.addEventListener('DOMContentLoaded', () => {
  const form          = document.getElementById('createTestForm');
  const questionCon   = document.getElementById('questionContainer');
  const pairLeft      = document.getElementById('pairLeft');
  const pairRight     = document.getElementById('pairRight');
  const addPairBtn    = document.getElementById('addPairBtn');
  const pairsList     = document.getElementById('pairsList');
  const testsTable    = document.querySelector('#testsTable tbody');
  const congruenceOptions = document.getElementById('congruenceOptions');
  const dropZone    = document.getElementById('congruenceZone');

  /**
   * Application data
   * @namespace AppData
   */
  let allCategories = [];  
  const pairs       = [];
  const congruence = [];

  /**
   * Loads categories available from the API
   * @async
   * @function loadCategories
   */
  async function loadCategories() {
    const res = await fetch('/word');
    const words = await res.json();
    allCategories = [...new Set(words.map(w => w.categorie))];
    // Fills selectors with pairs
    allCategories.forEach(cat => {
      [pairLeft, pairRight].forEach(sel => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        sel.appendChild(opt);
      });
      // Create draggable elements for congruences
      const item = document.createElement('div');
      item.textContent = cat;
      item.className = 'draggable-item';
      item.draggable = true;
      item.dataset.category = cat;
      congruenceOptions.appendChild(item);
    });
  }

  /**
   * Load available question types
   * @async
   * @function loadQuestions
   */
  async function loadQuestions() {
    const res = await fetch('/user/schema/category');
    const cats = await res.json(); 
    cats.forEach(c => {
      const label = document.createElement('label');
      const chk   = document.createElement('input');
      chk.type    = 'checkbox';
      chk.name    = 'questions';
      chk.value   = c.name;
      label.appendChild(chk);
      label.append(' ' + c.name);
      questionCon.appendChild(label);
      questionCon.appendChild(document.createElement('br'));
    });
  }

  // Drag and drop management for congruences
  congruenceOptions.addEventListener('dragstart', e => {
    if (e.target.classList.contains('draggable-item')) {
      e.dataTransfer.setData('text/plain', e.target.dataset.category);
    }
  });
  dropZone.addEventListener('dragover', e => e.preventDefault());
  /**
   * Manages the drop of a category in the congruent zone
   * @event drop
   */
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    const cat = e.dataTransfer.getData('text/plain');
    if (cat && congruence.length < 2 && !congruence.includes(cat)) {
      congruence.push(cat);
      const pill = document.createElement('span');
      pill.textContent = cat;
      pill.className = 'congruent-pill';
      dropZone.appendChild(pill);
    }
  });

  /**
   * Ajoute une nouvelle paire de catégories
   * @event click#addPairBtn
   */
  addPairBtn.addEventListener('click', () => {
    const left  = pairLeft.value;
    const right = pairRight.value;
    if (!left || !right || left === right) {
      return alert('Choisissez deux catégories distinctes.');
    }
    if (pairs.some(p => p.left === left && p.right === right)) {
      return alert('Cette paire existe déjà.');
    }
    pairs.push({ left, right });
    renderPairs();
  });

  /**
   * Displays the list of category pairs
   * @function renderPairs
   */
  function renderPairs() {
    pairsList.innerHTML = pairs.map((p, i) => `
      <li>
        ${p.left} vs ${p.right}
        <button data-index="${i}" class="remove-pair">×</button>
      </li>
    `).join('');
  }

  /**
   * Deletes a pair of categories
   * @event click#pairsList
   */
  pairsList.addEventListener('click', e => {
    if (!e.target.matches('.remove-pair')) return;
    const i = +e.target.dataset.index;
    pairs.splice(i, 1);
    renderPairs();
  });

  /**
   * Submits the test creation form
   * @event submit#createTestForm
   */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const titre     = form.titre.value.trim();
    const questions = Array.from(
      questionCon.querySelectorAll('input[name="questions"]:checked')
    ).map(chk => chk.value);

    // Validation
    if (!titre || pairs.length === 0 || questions.length === 0) {
      return alert('Le titre, au moins une paire et au moins une question et 2 congruences sont requis.');
    }

    const categories = Array.from(
      new Set(pairs.flatMap(p => [p.left, p.right]))
    );

    /**
     * Payload for test creation
     * @typedef {Object} TestPayload
     * @property {string} title - Test title
     * @property {string[]} categories - Categories used
     * @property {string[]} questions - Types of questions selected
     * @property {Object[]} pairs - Category pairs
     * @property {string[]} congruence - Congruent categories
     */
    const payload = { titre, categories, questions, pairs, congruence};

    const res = await fetch('/admin/create-test', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Test créé !');
      form.reset();
      pairs.length = 0;
      renderPairs();
      await loadTests();
    } else {
      const err = await res.json();
      alert('Erreur : ' + err.message);
    }
  });

  /**
   * Load list of existing tests
   * @async
   * @function loadTests
   */
  async function loadTests() {
    const res = await fetch('/admin/tests');
    if (!res.ok) {
      console.error('Impossible de récupérer les tests', res.status);
      return;
    }
    const tests = await res.json();
    testsTable.innerHTML = tests.map(t => `
      <tr>
        <td>${t.titre}</td>
        <td>${t.pair.map(p => `${p.left} vs ${p.right}`).join('<br>')}</td>
        <td>${t.questions.join(', ')}</td>
        <td>
          <button data-id="${t._id}" class="delete-btn">Supprimer</button>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Supprime un test existant
   * @event click#testsTable
   */
  testsTable.addEventListener('click', async e => {
    if (!e.target.matches('.delete-btn')) return;
    const id = e.target.dataset.id;
    if (!confirm('Supprimer ce test ?')) return;
    await fetch(`/admin/create-test/${id}`, { method: 'DELETE' ,   credentials: 'include'});
    loadTests();
  });

    /**
     * Manages administrator logout
     * @event click#logoutBtn
     */
   document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
      const res = await fetch('/access/logout', { method: 'POST' });
      if (res.ok) window.location.href = '/html/login.html';
      else alert('Erreur lors de la déconnexion');
    } catch (err) {
      console.error('Erreur de déconnexion :', err);
    }
  });

  // Initialisation
  loadCategories();
  loadQuestions();
  loadTests();
});
