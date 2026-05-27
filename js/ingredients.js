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

  const tableBody =
    safeGetById(
      'ingredientsTableBody'
    );

  if (!tableBody) return;

  tableBody.innerHTML = '';

  const ingredients =
    getIngredients();

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

      tableBody.appendChild(
        row
      );

    }
  );

}

function saveIngredient(data) {

  const ingredients =
    getIngredients();

  if (data.id) {

    const index =
      ingredients.findIndex(

        item =>

          String(item.id) ===
          String(data.id)
      );

    if (index !== -1) {

      ingredients[index] = data;

    }

  }

  else {

    ingredients.push({

      ...data,

      id:
        generateId()

    });

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

        String(item.id) ===
        String(id)
    );

  if (!ingredient) return;

  safeGetById(
    'ingredientId'
  ).value = ingredient.id;

  safeGetById(
    'ingredientName'
  ).value = ingredient.name;

  safeGetById(
    'ingredientUnit'
  ).value = ingredient.unit;

  safeGetById(
    'ingredientStock'
  ).value = ingredient.stock;

  safeGetById(
    'ingredientPackageCost'
  ).value =
    ingredient.packageCost;

  safeGetById(
    'ingredientReorderLevel'
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

  setIngredients(updated);

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