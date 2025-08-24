// API endpoint for word operations
const apiWordBase = '/word';

const contentDiv = document.getElementById('content');
const categoryForm = document.getElementById('categoryForm');
const categorieInput = document.getElementById('categorieInput');
const motInputChamp = document.getElementById('motInput');
const categorySelect = document.getElementById('categorySelect');
const openCategoryBtn = document.getElementById('openCategoryBtn');
const deleteCategoryBtn = document.getElementById('deleteCategoryBtn');

const wordsModal = document.getElementById('wordsModal');
const modalTitle = document.getElementById('modalTitle');
const closeBtn = document.querySelector('.close-btn');
const wordForm = document.getElementById('wordForm');
const motInput = document.getElementById('mot');
const saveWordBtn = document.getElementById('saveWordBtn');
const wordsSelect = document.getElementById('wordsSelect');
const deleteWordBtn = document.getElementById('deleteWordBtn');

let categories = [];  // Stores all available categories
let currentCategory = null; // Currently selected category

/**
 * Displays a temporary message to the user
 * @function showMessage
 * @param {string} text - Message to display
 * @param {boolean} [isError=false] - Whether the message is an error
 */
function showMessage(text, isError = false) {
  contentDiv.innerHTML = `<div class="${isError ? 'error-message' : 'success-message'}">${text}</div>`;
  setTimeout(() => contentDiv.innerHTML = '', 3000);
}

/**
 * Loads all word categories from the API
 * @async
 * @function loadCategories
 */
async function loadCategories() {
  categorySelect.innerHTML = '<option value="">-- Sélectionnez une catégorie --</option>';
  try {
    const res = await fetch(apiWordBase);
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    const words = await res.json();
    const uniqueCats = [...new Set(words.map(w => w.categorie))];
    categories = uniqueCats;

    // Populate category dropdown
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    showMessage(err.message, true);
    console.error(err);
  }
}

/**
 * Handles new category creation with associated words
 * @event submit#categoryForm
 */
categoryForm.addEventListener('submit', async e => {
  e.preventDefault();
  const mots = motInputChamp.value.split(',').map(m => m.trim()).filter(Boolean);
  const cat = categorieInput.value.trim();
  // Validate input
  if (!cat || categories.includes(cat)) return;

  try {
    // Create all words for the new category
    await Promise.all(mots.map(mot =>
      fetch(apiWordBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mot, categorie: cat })
      })
    ));
    // Reset form and update UI
    categorieInput.value = '';
    motInputChamp.value = '';
    showMessage('Catégorie ajoutée avec mot(s)');
    loadCategories();
  } catch (err) {
    showMessage(err.message, true);
    console.error(err);
  }
});

/**
 * Opens modal to manage words in selected category
 * @event click#openCategoryBtn
 */
openCategoryBtn.addEventListener('click', () => {
  const selectedCat = categorySelect.value;
  if (!selectedCat) return;
  // Set current category and open modal
  currentCategory = selectedCat;
  modalTitle.textContent = `Mots de la catégorie « ${selectedCat} »`;
  wordsModal.style.display = 'flex';
  document.body.classList.add('modal-open');

  // Load words for this category
  loadWords(selectedCat);
});

/**
 * Deletes a category and all its words
 * @event click#deleteCategoryBtn
 */
deleteCategoryBtn.addEventListener('click', async () => {
  const selectedCat = categorySelect.value;
  if (!selectedCat || !confirm(`Supprimer la catégorie "${selectedCat}" et tous ses mots ?`)) return;
  try {
    // Get all words in category
    const res = await fetch(apiWordBase);
    const words = await res.json();
    const wordsToDel = words.filter(w => w.categorie === selectedCat);
    // Delete all words
    await Promise.all(wordsToDel.map(w => fetch(`${apiWordBase}/${w._id}`, { method: 'DELETE' })));
    showMessage(`Catégorie "${selectedCat}" supprimée`);
    loadCategories();
    wordsModal.style.display = 'none';
    document.body.classList.remove('modal-open');

  } catch (err) {
    showMessage(err.message, true);
    console.error(err);
  }
});

/**
 * Closes the words management modal
 * @event click#closeBtn
 */
closeBtn.addEventListener('click', () => {
  wordsModal.style.display = 'none';
  document.body.classList.remove('modal-open');
  wordForm.reset(); saveWordBtn.textContent = 'Ajouter';
});

/**
 * Loads words for a specific category
 * @async
 * @function loadWords
 * @param {string} cat - Category name to load words for
 */
async function loadWords(cat) {
  wordsSelect.innerHTML = '';
  try {
    const res = await fetch(apiWordBase);
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    // Filter words by category
    const words = (await res.json()).filter(w => w.categorie === cat);
    // Populate words select
    words.forEach(w => {
      const option = document.createElement('option');
      option.value = w._id;
      option.textContent = w.mot;
      wordsSelect.appendChild(option);
    });
  } catch (err) {
    showMessage(err.message, true);
    console.error(err);
  }
}

/**
 * Handles adding new words to current category
 * @event submit#wordForm
 */
wordForm.addEventListener('submit', async e => {
  e.preventDefault();
  const mots = motInput.value.split(',').map(m => m.trim()).filter(Boolean).map(m => m.charAt(0).toUpperCase() + m.slice(1));
  if (mots.length === 0 || !currentCategory) return;

  try {
    // Add all new words
    await Promise.all(mots.map(mot =>
      fetch(apiWordBase, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ mot, categorie: currentCategory })
      })
    ));
    showMessage('Mot(s) ajouté(s)');
    wordForm.reset();
    loadWords(currentCategory);
    loadCategories();
  } catch (err) {
    showMessage(err.message, true);
    console.error(err);
  }
});

/**
 * Deletes selected word from current category
 * @event click#deleteWordBtn
 */
deleteWordBtn.addEventListener('click', async () => {
  const selectedId = wordsSelect.value;
  if (!selectedId || !confirm('Supprimer ce mot ?')) return;

  try {
    await fetch(`${apiWordBase}/${selectedId}`, { method: 'DELETE' });
    showMessage('Mot supprimé');
    loadWords(currentCategory);
    loadCategories();
  } catch (err) {
    showMessage(err.message, true);
    console.error(err);
  }
});
  /**
   * Handles user logout
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

document.addEventListener('DOMContentLoaded', loadCategories);