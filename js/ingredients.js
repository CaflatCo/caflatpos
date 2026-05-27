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

        <td colspan="8">

          No ingredients found

        </td>

      </tr>

    `;

    return;

  }

  ingredients.forEach(
    ingredient => {

      const unitCost =

        ingredient.packageQty > 0

          ? (
              ingredient.packageCost
              /
              ingredient.packageQty
            )

          : 0;

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

          ${ingredient.packageQty}

        </td>

        <td>

          ${formatCurrency(
            ingredient.packageCost
          )}

        </td>

        <td>

          ${formatCurrency(
            unitCost
          )}/${ingredient.unit}

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

  document.getElementById(
    'ingredientId'
  ).value = '';

  document.getElementById(
    'ingredientName'
  ).value = '';

  document.getElementById(
    'ingredientPurchaseUnit'
  ).value = 'g';

  document.getElementById(
    'ingredientPackageQty'
  ).value = '';

  document.getElementById(
    'ingredientPurchaseCost'
  ).value = '';

  document.getElementById(
    'ingredientStock'
  ).value = '';

  document.getElementById(
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
    document.getElementById(
      'ingredientId'
    )?.value;

  const ingredient = {

    id:
      ingredientId ||
      generateId(),

    name:
      document.getElementById(
        'ingredientName'
      )?.value || '',

    unit:
      document.getElementById(
        'ingredientPurchaseUnit'
      )?.value || 'g',

    packageQty:
      Number(
        document.getElementById(
          'ingredientPackageQty'
        )?.value || 0
      ),

    packageCost:
      Number(
        document.getElementById(
          'ingredientPurchaseCost'
        )?.value || 0
      ),

    stock:
      Number(
        document.getElementById(
          'ingredientStock'
        )?.value || 0
      ),

    reorderLevel:
      Number(
        document.getElementById(
          'ingredientReorder'
        )?.value || 0
      )

  };

  const existingIndex =
    ingredients.findIndex(

      item =>

        String(item.id)
        ===
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

  showNotification(
    'Ingredient saved',
    'success'
  );

}

function editIngredient(id) {

  const ingredient =
    getIngredients().find(

      item =>

        String(item.id)
        ===
        String(id)
    );

  if (!ingredient) return;

  document.getElementById(
    'ingredientId'
  ).value =
    ingredient.id;

  document.getElementById(
    'ingredientName'
  ).value =
    ingredient.name;

  document.getElementById(
    'ingredientPurchaseUnit'
  ).value =
    ingredient.unit;

  document.getElementById(
    'ingredientPackageQty'
  ).value =
    ingredient.packageQty;

  document.getElementById(
    'ingredientPurchaseCost'
  ).value =
    ingredient.packageCost;

  document.getElementById(
    'ingredientStock'
  ).value =
    ingredient.stock;

  document.getElementById(
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

        String(item.id)
        !==
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