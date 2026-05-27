window.editingIngredientId = null;

function resetIngredientForm() {

  safeGetById(
    'ingredientId'
  ).value = '';

  safeGetById(
    'ingredientName'
  ).value = '';

  safeGetById(
    'ingredientPurchaseUnit'
  ).value = 'g';

  safeGetById(
    'ingredientPackageQty'
  ).value = '';

  safeGetById(
    'ingredientPurchaseCost'
  ).value = '';

  safeGetById(
    'ingredientStock'
  ).value = '';

  safeGetById(
    'ingredientReorder'
  ).value = '';

}

function saveIngredient() {

  const ingredient =

    normalizeIngredient({

      id:
        editingIngredientId ||

        generateId(),

      name:
        safeGetById(
          'ingredientName'
        )?.value || '',

      unit:
        safeGetById(
          'ingredientPurchaseUnit'
        )?.value || 'g',

      packageQty:
        Number(
          safeGetById(
            'ingredientPackageQty'
          )?.value || 0
        ),

      packageCost:
        Number(
          safeGetById(
            'ingredientPurchaseCost'
          )?.value || 0
        ),

      stock:
        Number(
          safeGetById(
            'ingredientStock'
          )?.value || 0
        ),

      reorderLevel:
        Number(
          safeGetById(
            'ingredientReorder'
          )?.value || 0
        )

    });

  let ingredients =
    getIngredients();

  if (editingIngredientId) {

    ingredients =
      ingredients.map(item =>

        String(item.id) ===
        String(editingIngredientId)

          ? ingredient

          : item

      );

  }

  else {

    ingredients.push(
      ingredient
    );

  }

  setIngredients(
    ingredients
  );

  editingIngredientId =
    null;

  resetIngredientForm();

  renderIngredientsTable();

  renderIngredientDropdowns();

  closeModal(
    'ingredientModal'
  );

  showNotification(
    'Ingredient saved',
    'success'
  );

}

function editIngredient(id) {

  const ingredient =
    getIngredientById(id);

  if (!ingredient) {

    return;

  }

  editingIngredientId =
    ingredient.id;

  safeGetById(
    'ingredientName'
  ).value =
    ingredient.name;

  safeGetById(
    'ingredientPurchaseUnit'
  ).value =
    ingredient.unit;

  safeGetById(
    'ingredientPackageQty'
  ).value =
    ingredient.packageQty;

  safeGetById(
    'ingredientPurchaseCost'
  ).value =
    ingredient.packageCost;

  safeGetById(
    'ingredientStock'
  ).value =
    ingredient.stock;

  safeGetById(
    'ingredientReorder'
  ).value =
    ingredient.reorderLevel;

  openModal(
    'ingredientModal'
  );

}

function addCategory() {

  const input =
    safeGetById(
      'newCategory'
    );

  if (!input) return;

  const name =
    input.value.trim();

  if (!name) {

    return;

  }

  const categories =
    APP_STATE.categories || [];

  categories.push(name);

  updateState(
    'categories',
    () => categories
  );

  renderCategories();

  renderCategoryOptions();

  input.value = '';

  showNotification(
    'Category added',
    'success'
  );

}

function renderCategories() {

  const list =
    safeGetById(
      'categoryList'
    );

  if (!list) return;

  const categories =
    APP_STATE.categories || [];

  list.innerHTML = '';

  categories.forEach(category => {

    const item =
      document.createElement(
        'div'
      );

    item.style.marginBottom =
      '10px';

    item.innerHTML = `

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        border:1px solid #000;
        padding:12px;
        border-radius:10px;
        background:#fff;
      ">

        <span>
          ${category}
        </span>

        <button
          class="btn btn-sm"
          onclick="deleteCategory('${category}')">

          Delete

        </button>

      </div>

    `;

    list.appendChild(
      item
    );

  });

}

function deleteCategory(name) {

  const updated =

    APP_STATE.categories.filter(
      category =>

        category !== name
    );

  updateState(
    'categories',
    () => updated
  );

  renderCategories();

  renderCategoryOptions();

  showNotification(
    'Category deleted',
    'success'
  );

}

function renderCategoryOptions() {

  const select =
    safeGetById(
      'productCategory'
    );

  const filter =
    safeGetById(
      'productCategoryFilter'
    );

  const categories =
    APP_STATE.categories || [];

  if (select) {

    select.innerHTML = '';

    categories.forEach(category => {

      const option =
        document.createElement(
          'option'
        );

      option.value =
        category;

      option.textContent =
        category;

      select.appendChild(
        option
      );

    });

  }

  if (filter) {

    filter.innerHTML =
      '<option value="">All Categories</option>';

    categories.forEach(category => {

      const option =
        document.createElement(
          'option'
        );

      option.value =
        category;

      option.textContent =
        category;

      filter.appendChild(
        option
      );

    });

  }

}

function addRecipeRow() {

  const builder =
    safeGetById(
      'recipeBuilder'
    );

  if (!builder) return;

  const ingredients =
    getIngredients();

  const options =
    ingredients.map(

      ingredient =>

        `

        <option value="${ingredient.id}">

          ${ingredient.name}
          (${ingredient.unit})

        </option>

        `

    ).join('');

  const card =
    document.createElement(
      'div'
    );

  card.className =
    'recipe-row';

  card.style = `
    border:1px solid #000;
    padding:16px;
    border-radius:12px;
    margin-bottom:14px;
    background:#fff;
  `;

  card.innerHTML = `

    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:14px;
    ">

      <strong>
        Recipe Ingredient
      </strong>

      <button
        type="button"
        class="btn btn-sm"
        onclick="this.closest('.recipe-row').remove()">

        Remove

      </button>

    </div>

    <div style="
      display:grid;
      grid-template-columns:2fr 1fr;
      gap:12px;
    ">

      <div>

        <label>
          Ingredient
        </label>

        <select
          class="recipe-ingredient"
        >

          ${options}

        </select>

      </div>

      <div>

        <label>
          Quantity Used
        </label>

        <input
          type="number"
          class="recipe-qty"
          placeholder="0"
          min="0"
          step="0.01"
        />

      </div>

    </div>

  `;

  builder.appendChild(
    card
  );

}

document.addEventListener(

  'DOMContentLoaded',

  () => {

    renderCategories();

    renderCategoryOptions();

  }

);