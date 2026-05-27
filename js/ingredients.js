class Ingredient {

  constructor(data = {}) {

    this.id =
      data.id || generateId();

    this.name =
      data.name || '';

    this.unit =
      data.unit || 'g';

    this.stock =
      Number(data.stock || 0);

    this.packageQty =
      Number(data.packageQty || 0);

    this.packageCost =
      Number(data.packageCost || 0);

    this.reorderLevel =
      Number(data.reorderLevel || 0);

    this.costPerUnit =
      this.calculateCostPerUnit();

    this.lowStock =
      this.stock <=
      this.reorderLevel;

    this.createdAt =
      data.createdAt ||

      new Date().toISOString();

    this.updatedAt =
      data.updatedAt ||

      new Date().toISOString();

  }

  calculateCostPerUnit() {

    if (
      this.packageQty <= 0
    ) {

      return 0;

    }

    return Number(

      (
        this.packageCost /
        this.packageQty
      ).toFixed(4)

    );

  }

}

window.Ingredient =
  Ingredient;

window.editingIngredientId =
  null;

function normalizeIngredient(data = {}) {

  return new Ingredient(data);

}

function getIngredients() {

  return APP_STATE.ingredients || [];

}

function setIngredients(ingredients) {

  updateState(
    'ingredients',
    () => ingredients
  );

}

function getIngredientById(id) {

  return getIngredients().find(
    ingredient =>

      String(ingredient.id) ===
      String(id)
  );

}

function calculateIngredientUsage(
  ingredientId
) {

  let usage = 0;

  getProducts().forEach(product => {

    product.recipe.forEach(item => {

      if (

        String(
          item.ingredientId
        ) ===

        String(ingredientId)

      ) {

        usage += Number(
          item.quantity || 0
        );

      }

    });

  });

  return usage;

}

function renderIngredientsTable() {

  const tableBody =
    safeQuery(
      '#ingredientsTable tbody'
    );

  if (!tableBody) return;

  tableBody.innerHTML = '';

  const ingredients =
    getIngredients();

  if (!ingredients.length) {

    tableBody.innerHTML = `

      <tr>

        <td colspan="8">

          No ingredients found

        </td>

      </tr>

    `;

    return;

  }

  ingredients.forEach(ingredient => {

    const row =
      document.createElement(
        'tr'
      );

    const lowStockClass =

      ingredient.lowStock

        ? 'low-stock-row'

        : '';

    row.className =
      lowStockClass;

    row.innerHTML = `

      <td>
        ${ingredient.name}
      </td>

      <td>
        ${ingredient.unit}
      </td>

      <td>
        ${ingredient.stock}
      </td>

      <td>
        ${ingredient.packageQty}
      </td>

      <td>
        ${formatCurrency(
          ingredient.packageCost
        )}
      </td>

      <td>
        ${formatCurrency(
          ingredient.costPerUnit
        )}
      </td>

      <td>
        ${ingredient.reorderLevel}
      </td>

      <td>

        ${
          ingredient.lowStock

            ? `
              <span class="badge-low-stock">
                LOW STOCK
              </span>
            `

            : `
              <span class="badge-ok">
                OK
              </span>
            `
        }

      </td>

      <td>

        <button
          class="btn btn-sm"
          onclick="editIngredient('${ingredient.id}')">

          Edit

        </button>

        <button
          class="btn btn-sm"
          onclick="deleteIngredient('${ingredient.id}')">

          Delete

        </button>

      </td>

    `;

    tableBody.appendChild(row);

  });

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
        )?.value,

      unit:
        safeGetById(
          'ingredientPurchaseUnit'
        )?.value,

      stock:
        Number(
          safeGetById(
            'ingredientStock'
          )?.value || 0
        ),

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

      reorderLevel:
        Number(
          safeGetById(
            'ingredientReorder'
          )?.value || 0
        ),

      updatedAt:
        new Date().toISOString()

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

  renderIngredientsTable();

  renderIngredientDropdowns();

  closeModal(
    'ingredientModal'
  );

  resetIngredientForm();

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
    'ingredientStock'
  ).value =
    ingredient.stock;

  safeGetById(
    'ingredientPackageQty'
  ).value =
    ingredient.packageQty;

  safeGetById(
    'ingredientPurchaseCost'
  ).value =
    ingredient.packageCost;

  safeGetById(
    'ingredientReorder'
  ).value =
    ingredient.reorderLevel;

  openModal(
    'ingredientModal'
  );

}

function deleteIngredient(id) {

  const updated =

    getIngredients().filter(
      ingredient =>

        String(
          ingredient.id
        ) !==

        String(id)
    );

  setIngredients(
    updated
  );

  renderIngredientsTable();

  renderIngredientDropdowns();

  showNotification(
    'Ingredient deleted',
    'success'
  );

}

function renderIngredientDropdowns() {

  const dropdowns =
    document.querySelectorAll(
      '.recipe-ingredient'
    );

  const ingredients =
    getIngredients();

  dropdowns.forEach(dropdown => {

    const currentValue =
      dropdown.value;

    dropdown.innerHTML = '';

    ingredients.forEach(ingredient => {

      const option =
        document.createElement(
          'option'
        );

      option.value =
        ingredient.id;

      option.textContent =

        `${ingredient.name}
         (${ingredient.unit})`;

      dropdown.appendChild(
        option
      );

    });

    dropdown.value =
      currentValue;

  });

}

function checkLowStockIngredients() {

  return getIngredients().filter(
    ingredient =>

      ingredient.stock <=
      ingredient.reorderLevel
  );

}

document.addEventListener(

  'DOMContentLoaded',

  () => {

    renderIngredientsTable();

    renderIngredientDropdowns();

  }

);