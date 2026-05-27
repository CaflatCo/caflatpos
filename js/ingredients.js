function getIngredients() {

  return APP_STATE.ingredients || [];

}

function setIngredients(
  ingredients
) {

  updateState(
    'ingredients',
    () => ingredients
  );

  renderIngredientsTable();

}

function renderIngredientsTable() {

  const table =
    document.querySelector(
      '#ingredientsTable tbody'
    );

  if (!table) return;

  table.innerHTML = '';

  const ingredients =
    getIngredients();

  if (!ingredients.length) {

    table.innerHTML = `

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

      const isLowStock =

        Number(
          ingredient.stock || 0
        )

        <=

        Number(
          ingredient.reorderLevel || 0
        );

      const row =
        document.createElement(
          'tr'
        );

      row.className =
        isLowStock
          ? 'low-stock-row'
          : '';

      row.innerHTML = `

        <td>

          ${ingredient.name}

        </td>

        <td>

          ${ingredient.unit}

        </td>

        <td>

          ${formatCurrency(
            ingredient.packageCost
          )}

        </td>

        <td>

          ${ingredient.stock}

        </td>

        <td>

          ${ingredient.reorderLevel}

        </td>

        <td>

          <div class="table-actions">

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

          </div>

        </td>

      `;

      table.appendChild(
        row
      );

    }
  );

}

function openIngredientModal() {

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

  openModal(
    'ingredientModal'
  );

}

function saveIngredient() {

  const ingredients =
    getIngredients();

  const ingredientId =
    safeGetById(
      'ingredientId'
    )?.value;

  const ingredient = {

    id:
      ingredientId ||
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

  const existingIndex =
    ingredients.findIndex(

      item =>

        String(item.id) ===
        String(ingredient.id)
    );

  if (existingIndex !== -1) {

    ingredients[existingIndex] =
      ingredient;

  }

  else {

    ingredients.push(
      ingredient
    );

  }

  setIngredients(
    ingredients
  );

  closeModal(
    'ingredientModal'
  );

  renderIngredientsTable();

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

  if (!ingredient) return;

  safeGetById(
    'ingredientId'
  ).value =
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

function deleteIngredient(id) {

  const confirmed =
    confirm(
      'Delete ingredient?'
    );

  if (!confirmed) return;

  const updated =
    getIngredients().filter(

      item =>

        String(item.id) !==
        String(id)
    );

  setIngredients(
    updated
  );

  showNotification(
    'Ingredient deleted',
    'success'
  );

}

document.addEventListener(

  'DOMContentLoaded',

  () => {

    renderIngredientsTable();

  }

);