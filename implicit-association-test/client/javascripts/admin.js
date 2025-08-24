import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', async () => {

  /**
   * graph initialization
   * @type {CanvasRenderingContext2D}
   * @see https://www.chartjs.org/docs/latest/getting-started/installation.html
   * @event DOMContentLoaded
   * @description Creates a bar graph to display user responses
   */
  const ctx = document.getElementById('myChart').getContext('2d');

    /**
   * Instance of Chart.js to view results
   * @type {Chart}
   * @property {string} type - Chart type (bars)
   * @property {Object} data - Empty initial data
   * @property {Object} options - Graphic configuration options
   */
  const voteChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: [], datasets: [{ label: 'Réponses utilisateurs', data: [] }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
  });

  /**
   * Data schema metadata retrieved from API
   * @type {Object|null}
   * @property {Array<string>} fields - List of available fields
   * @property {Object} allowedValues - Allowed values for each field
   */
  let schemaMeta = null;

  /**
   * Updates graph with new data
   * @function updateChart
   * @param {Object} breakdown - Breakdown of responses by category
   */
  function updateChart(breakdown) {
    const category = document.getElementById('categorySelect').value;
    const options = schemaMeta.allowedValues?.[category];
    const fullBreakdown = {};
    if (Array.isArray(options) && options.length) {
      options.forEach(opt => { fullBreakdown[opt] = breakdown[opt] || 0; });
    } else {
      Object.assign(fullBreakdown, breakdown);
    }
    voteChart.data.labels = Object.keys(fullBreakdown);
    voteChart.data.datasets[0].data = Object.values(fullBreakdown);
    voteChart.update();
  }

  /**
   * Retrieves data from API and updates display
   * @async
   * @function fetchAndRender
   * @param {string} category - Category selected for filtering
   */
  async function fetchAndRender(category) {
    const selectedConditions = Array.from(
      document.getElementById('conditionSelect').selectedOptions
    ).map(o => o.value);
    const valueMin = document.getElementById('valueMin').value;
    const valueMax = document.getElementById('valueMax').value;

    const queryParams = new URLSearchParams();
    queryParams.append('category', category);
    selectedConditions.forEach(cond => queryParams.append('conditions[]', cond));
    if (valueMin) queryParams.append('min', valueMin);
    if (valueMax) queryParams.append('max', valueMax);

    try {
      const res = await fetch(`/user/breakdown?${queryParams}`);
      const { breakdown } = await res.json();
      updateChart(breakdown);
      document.getElementById('voteStatus').textContent =
        Object.entries(breakdown).map(([k, v]) => `${k}: ${v}`).join(' | ');
    } catch (err) {
      console.error('Erreur lors de la récupération du breakdown :', err);
    }
  }

  // Dashboard initialization
  try {
    const res = await fetch('/user/schema');
    if (!res.ok) throw new Error(`Schema non dispo (${res.status})`);
    const { fields, allowedValues } = await res.json();

    schemaMeta = { fields, allowedValues };
    console.log('Schéma récupéré via API:', schemaMeta);

    // Filling the category selector
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.innerHTML = '';
    schemaMeta.fields.forEach(field => {
      const option = document.createElement('option');
      option.value = field;
      option.textContent = field;
      categorySelect.appendChild(option);
    });

    document.getElementById('conditionSelect').innerHTML = '';

    if (schemaMeta.fields.length) {
      categorySelect.value = schemaMeta.fields[0];
      await fetchAndRender(categorySelect.value);
    }

    // Gestion des événements
    categorySelect.addEventListener('change', e => fetchAndRender(e.target.value));
    document.getElementById('applyFiltersBtn')
      .addEventListener('click', () => fetchAndRender(categorySelect.value));
  } catch (err) {
    console.error('Erreur lors de la récupération du schéma :', err);
  }

  /**
   * Data reset management
   * @event click#resetBtn
   */
  document.getElementById('resetBtn').addEventListener('click', async () => {
    if (!confirm('Cette action va supprimer toutes les réponses utilisateurs. Continuer ?')) return;
    try {
      const res = await fetch('/user/reset', { method: 'DELETE' });
      if (!res.ok) throw new Error('Échec de la suppression');
      alert('Réponses supprimées.');
      document.getElementById('voterCounter').textContent = 'Formulaires reçus : 0';

      const category = document.getElementById('categorySelect').value;
      const options = schemaMeta.allowedValues?.[category] || [];
      voteChart.data.labels = Array.isArray(options) ? options : [];
      voteChart.data.datasets[0].data = (options || []).map(() => 0);
      voteChart.update();
      document.getElementById('voteStatus').textContent = '';
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
      alert('Une erreur est survenue lors de la suppression.');
    }
  });

  /**
   * Manage addition of administrators (for super-admin only)
   * @type {HTMLElement}
   */
  const adminForm = document.getElementById('add-admin-form');
  try {
    const resAdmin = await fetch('/admins/me');
    if (resAdmin.ok) {
      const data = await resAdmin.json();
      /**
       * Affiche le formulaire d'ajout si l'utilisateur est super-admin
       * @type {boolean}
       */
      if (data.superAdmin) {
        adminForm.style.display = 'block';
        /**
         * Submit admin add form
         * @event submit#add-admin-form
         */
        adminForm.addEventListener('submit', async e => {
          e.preventDefault();
          /**
           * New admin login
           * @type {string}
           */
          const login = document.getElementById('newAdminLogin').value;
          const password = document.getElementById('newAdminPassword').value;
          const name = document.getElementById('newAdminName').value;
          try {
            const res = await fetch('/admins/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ login, password, name })
            });
            const result = await res.json();
            const messageEl = document.getElementById('adminMessage');
            messageEl.textContent = result.message;
            messageEl.style.color = res.ok ? 'green' : 'red';
          } catch (err) {
            console.error('Erreur création admin :', err);
          }
        });
      }
    }
  } catch (err) {
    console.error('Erreur lors de la vérification du superAdmin :', err);
  }

  /**
   * Logout management
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
});