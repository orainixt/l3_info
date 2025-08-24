// API endpoint for category operations
const apiBase = '/user/schema/category';

const contentDiv          = document.getElementById('content');
const categoryForm        = document.getElementById('categoryForm');
const categoryNameInput   = document.getElementById('categoryNameInput');
const categoryTypeInput   = document.getElementById('categoryTypeInput');
const formNumberInput     = document.getElementById('formNumberInput');     
const categorySelect      = document.getElementById('categorySelect');      
const deleteCategoryBtn   = document.getElementById('deleteCategoryBtn');
const categoriesList      = document.getElementById('categoriesList');

// Stores loaded categories
let categories = [];

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
 * Loads all categories from the API and populates the UI
 * @async
 * @function loadCategories
 */
async function loadCategories() {
  categorySelect.innerHTML = '';
  categoriesList.innerHTML = '';
  try {
    const res = await fetch(apiBase);
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    const cats = await res.json();
    categories = cats;
    // Populate category dropdown
    cats.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat._id;
      option.textContent = `${cat.name} (Formulaire ${cat.formNumber})`;
      categorySelect.appendChild(option);
    });
    // Display first category if available
    if (categories.length) {
      renderCategory(categories[0]);
    }
  } catch (err) {
    showMessage(err.message, true);
    console.error(err);
  }
}

/**
 * Handles category selection change
 * @event change#categorySelect
 */
categorySelect.addEventListener('change', () => {
  const selectedId = categorySelect.value;
  const cat = categories.find(c => c._id === selectedId);
  if (cat) renderCategory(cat);
});

/**
 * Handles category deletion
 * @event click#deleteCategoryBtn
 */
deleteCategoryBtn.addEventListener('click', async () => {
  const selectedId = categorySelect.value;
  const cat = categories.find(c => c._id === selectedId);
  if (!cat || !confirm(`Supprimer la catégorie "${cat.name}" ?`)) return;
  try {
    await fetch(`${apiBase}/${cat._id}`, { method: 'DELETE' });
    showMessage(`Catégorie "${cat.name}" supprimée`);
    loadCategories();
  } catch (err) {
    showMessage(err.message, true);
    console.error(err);
  }
});

/**
 * Renders a category's details and allowed values
 * @function renderCategory
 * @param {Object} cat - The category object to render
 */
function renderCategory(cat) {
  categoriesList.innerHTML = '';

  const section = document.createElement('section');
  section.className = 'category-section';
  section.innerHTML = `<div class="category-header"><h3>${cat.name} (Formulaire ${cat.formNumber})</h3></div>`;

  if (cat.type === 'String') {
    // Create list of allowed values for String type categories
    const valueList = document.createElement('ul');
    valueList.className = 'value-list';
    (cat.allowedValues || []).forEach(val => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = val;

      // Edit button for each value
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Modifier';
      editBtn.addEventListener('click', async () => {
        const newVal = prompt('Modifier la valeur :', val);
        if (!newVal || !newVal.trim()) return;
        const updated = cat.allowedValues.map(v => v === val ? newVal.trim() : v);
        await updateValues(cat._id, [...new Set(updated)]);
      });

      // Delete button for each value
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Supprimer';
      delBtn.addEventListener('click', async () => {
        const updated = cat.allowedValues.filter(v => v !== val);
        await updateValues(cat._id, updated);
      });

      li.append(span, editBtn, delBtn);
      valueList.appendChild(li);
    });
    section.appendChild(valueList);

    // Form to add new values
    const addForm = document.createElement('form');
    addForm.className = 'add-value-form';
    addForm.innerHTML = `
      <input type="text" placeholder="Nouvelle(s) valeur(s), séparées par des virgules" requie />
      <button type="submit">Ajouter</button>
    `;
    addForm.addEventListener('submit', async e => {
      e.preventDefault();
      const input = addForm.querySelector('input');
      const newVals = input.value.split(',').map(v => v.trim()).filter(Boolean);
      if (!newVals.length) return;
      const current = new Set(cat.allowedValues || []);
      newVals.forEach(v => current.add(v));
      await updateValues(cat._id, [...current]);
      input.value = '';
    });
    section.appendChild(addForm);

  } else {
    // Display for non-String type categories
    const info = document.createElement('p');
    info.textContent = 'Catégorie de type libre';
    section.appendChild(info);
  }

  categoriesList.appendChild(section);
}

/**
 * Updates allowed values for a category
 * @async
 * @function updateValues
 * @param {string} id - Category ID
 * @param {Array<string>} allowedValues - New allowed values
 */
async function updateValues(id, allowedValues) {
  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowedValues })
    });
    if (!res.ok) throw new Error('Erreur mise à jour');
    showMessage('Valeurs mises à jour');
    loadCategories();
  } catch (err) {
    showMessage(err.message, true);
    console.error(err);
  }
}

/**
 * Handles new category creation
 * @event submit#categoryForm
 */
categoryForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name       = categoryNameInput.value.trim();
  const type       = categoryTypeInput.value;
  const formNumber = parseInt(formNumberInput.value, 10);
  if (!name || !type || !formNumber) return;

  try {
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, formNumber, allowedValues: [] })
    });
    if (!res.ok) throw new Error('Erreur lors de la création de la catégorie');
    categoryNameInput.value = '';
    showMessage('Catégorie ajoutée');
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