const apiBase   = '/user';  // Base API endpoint for form submission
const apiSchema = '/user/schema/category';  // API endpoint for form schema
const contentDiv = document.getElementById('content');  // Main content container
const form       = document.getElementById('userForm'); // Form element
let schemaMeta   = null;  // Stores form field metadata

// Get testId from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('testId');

/**
 * Displays a temporary message to the user
 * @function showMessage
 * @param {string} msg - Message to display
 * @param {boolean} [isError=false] - Whether the message is an error
 */
function showMessage(msg, isError = false) {
  contentDiv.innerHTML = `<div class="${isError?'error-message':'success-message'}">${msg}</div>`;
  setTimeout(() => contentDiv.innerHTML = '', 3000);
}

/**
 * Initializes the form with dynamic fields based on test requirements
 * @async
 * @function initForm
 */
async function initForm() {
  try {
    // Validate testId presence
    if (!testId) {
      throw new Error('Aucun testId fourni dans l’URL');
    }
    // Fetch test details
    const testRes = await fetch(`/tests/${testId}`);
    if (!testRes.ok) {
      const err = await testRes.json();
      throw new Error(err.message || `Impossible de récupérer le test (${testRes.status})`);
    }
    const testData = await testRes.json();
    const testQuestions = testData.questions; 

    // Validate test questions
    if (!Array.isArray(testQuestions) || testQuestions.length === 0) {
      throw new Error('Ce test ne contient pas de questions.');
    }

    // Fetch form schema
    const res = await fetch(apiSchema);
    if (!res.ok) throw new Error(`Schema non disponible (${res.status})`);
    const allSchema = await res.json();

    // Filter schema to only include questions relevant to this test
    const schema = allSchema.filter(c => testQuestions.includes(c.name));

    if (schema.length === 0) {
      throw new Error('Aucune question valide trouvée pour ce test.');
    }

    // Prepare schema metadata
    schemaMeta = {
      fields: schema.map(c => c.name),
      allowedValues: Object.fromEntries(
        schema.map(c => [c.name, c.type === 'String' ? c.allowedValues : null])
      )
    };

    // Dynamically create form fields
    schema.forEach(field => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('form-group');

      // Create label
      const label = document.createElement('label');
      label.htmlFor = field.name;
      label.textContent = field.name[0].toUpperCase() + field.name.slice(1);

      // Create appropriate input based on field type
      let input;
      if (field.type === 'String'
          && Array.isArray(field.allowedValues)
          && field.allowedValues.length) {
        // Create select dropdown for fields with allowed values
        input = document.createElement('select');
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Choisir…';
        placeholder.disabled = true;
        placeholder.selected = true;
        input.appendChild(placeholder);
        // Add allowed values as options
        field.allowedValues.forEach(v => {
          const opt = document.createElement('option');
          opt.value = v;
          opt.textContent = v;
          input.appendChild(opt);
        });
      } else {
        // Create standard input for other field types
        input = document.createElement('input');
        input.type = field.type === 'Number' ? 'number' : 'text';
      }

      // Configure input attributes
      input.id       = field.name;
      input.name     = field.name;
      input.required = true;
      wrapper.append(label, input);
      form.appendChild(wrapper);
    });

    // Add form buttons
    const btnGroup = document.createElement('div');
    btnGroup.classList.add('form-group', 'button-group');
    btnGroup.innerHTML = `
      <button type="submit">Envoyer</button>
      <button type="reset">Réinitialiser</button>
    `;
    form.appendChild(btnGroup);

  } catch (e) {
    console.error('initForm error', e);
    showMessage(e.message, true);
  }
}

/**
 * Collects form data into an object
 * @function collectData
 * @returns {Object} Form data with field values
 */
function collectData() {
  const data = {};
  schemaMeta.fields.forEach(f => {
    const el = document.getElementById(f);
    if (el) data[f] = el.value;
  });
  if (testId) data.testId = testId;
  return data;
}

/**
 * Handles form submission
 * @event submit#userForm
 */
form.addEventListener('submit', async e => {
  e.preventDefault();

  for (const f of schemaMeta.fields) {
    const el = document.getElementById(f);
    if (!el || !el.value) {
      showMessage(`Le champ "${f}" est requis.`, true);
      return;
    }
  }

  const payload = collectData();

  try {
    // Submit form data
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur serveur');
    }
    const data = await res.json();
    // Store form ID for reference
    localStorage.setItem('formId', data._id);
    // Show success message and redirect to test
    showMessage('Réponse enregistrée !');
    setTimeout(() => {
      const query = new URLSearchParams({
        testId: testId,
        formId: data._id
      });
      window.location.href = `/game?${query.toString()}`;
    }, 800);

  } catch (err) {
    console.error('submit error', err);
    showMessage(err.message, true);
  }
});

document.addEventListener('DOMContentLoaded', initForm);
