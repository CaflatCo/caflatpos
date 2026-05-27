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

  }

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

function renderIngredientsTable() {

  const tableBody =
    safeQuery(
      '#ingredientsTable tbody'
    );

  if (!tableBody) return;

  const ingredients =
    getIngredients();

  tableBody.innerHTML = '';

  if (!ingredients.length) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="6">
          No ingredients found
        </td>
      </tr>
    `;

    return;

  }

  ingredients.forEach(
    ingredient => {

      const row =
        document.createElement(
          'tr'
        );

      row.innerHTML = `

        <td>
          ${ingredient.name}
        </td>

        <td>
          ${ingredient.unit}
        </td>

        <td>
          ${ingredient.packageCost}
        </td>

        <td>
          ${ingredient.stock}
        </td>

        <td>
          ${ingredient.reorderLevel}
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

      tableBody.appendChild(
        row
      );

    }
  );

}

function saveIngredient() {

  const ingredient =

    new Ingredient({

      name:
        safeGetById(
          'ingredientName'
        )?.value,

      unit:
        safeGetById(
          'ingredientPurchaseUnit'
        )?.value,

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

  const ingredients =
    getIngredients();

  ingredients.push(
    ingredient
  );

  setIngredients(
    ingredients
  );

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

  deleteIngredient(id);

  openModal(
    'ingredientModal'
  );

}

function deleteIngredient(id) {

  const ingredients =

    getIngredients().filter(
      ingredient =>

        String(
          ingredient.id
        ) !==

        String(id)
    );

  setIngredients(
    ingredients
  );

  renderIngredientsTable();

}

document.addEventListener(

  'DOMContentLoaded',

  renderIngredientsTable

);