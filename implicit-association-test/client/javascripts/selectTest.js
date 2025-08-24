document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('testsContainer');

  async function loadTests() {
    try {
      const res = await fetch('/tests');
      if (!res.ok) throw new Error(`Erreur API (${res.status})`);

      const tests = await res.json();

      if (!Array.isArray(tests) || tests.length === 0) {
        container.innerHTML = '<p>Aucun test disponible pour le moment.</p>';
        return;
      }

      container.innerHTML = tests.map(test => `
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${test.titre}</h5>
              <p class="card-text mb-4">
                <strong>Catégories :</strong> ${test.categories.join(', ')}<br>
              </p>
              <a href="/form?testId=${test._id}" class="btn btn-outline-primary mt-auto">
                Démarrer ce test
              </a>
            </div>
          </div>
        </div>
      `).join('');

    } catch (err) {
      console.error('Erreur chargement tests :', err);
      container.innerHTML = `
        <div class="alert alert-danger">
          Impossible de charger les tests (${err.message}).
        </div>`;
    }
  }

  await loadTests();
});
