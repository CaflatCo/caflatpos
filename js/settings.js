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

  const ingredient = {

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

  };

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
    getIngredients().find(
      item =>

        String(item.id) ===
        String(id)
    );

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
      '8px';

    item.innerHTML = `

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        border:1px solid #000;
        padding:8px;
      ">

        <span>${category}</span>

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

  if (select) {

    select.innerHTML = '';

    APP_STATE.categories.forEach(
      category => {

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

      }
    );

  }

  if (filter) {

    filter.innerHTML =
      '<option value="">All Categories</option>';

    APP_STATE.categories.forEach(
      category => {

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

      }
    );

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

        `<option value="${ingredient.id}">
          ${ingredient.name}
        </option>`

    ).join('');

  const row =
    document.createElement(
      'div'
    );

  row.className =
    'recipe-row form-row';

  row.innerHTML = `

    <select class="recipe-ingredient">

      ${options}

    </select>

    <input
      type="number"
      class="recipe-qty"
      placeholder="Quantity"
      min="0"
      step="0.01"
    />

  `;

  builder.appendChild(
    row
  );

}

document.addEventListener(

  'DOMContentLoaded',

  () => {

    renderCategories();

    renderCategoryOptions();

  }

);