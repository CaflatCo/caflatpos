let editingIngredientId =
  null;

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

  renderIngredientDropdowns();

}

function calculateUnitCost(
  ingredient
) {

  const qty =
    Number(
      ingredient.packageQty || 0
    );

  const cost =
    Number(
      ingredient.packageCost || 0
    );

  return qty > 0

    ? cost / qty

    : 0;

}

function resetIngredientForm() {

  const fields = [

    'ingredientId',
    'ingredientName',
    'ingredientPackageQty',
    'ingredientPurchaseCost',
    'ingredientStock',
    'ingredientReorder'

  ];

  fields.forEach(id => {

    const el =
      document.getElementById(id);

    if (el) {

      el.value = '';

    }

  });

  const unit =
    document.getElementById(
      'ingredientPurchaseUnit'
    );

  if (unit) {

    unit.value = 'g';

  }

  editingIngredientId =
    null;

}

function openIngredientModal() {

  resetIngredientForm();

  openModal(
    'ingredientModal'
  );

}

function renderIngredientDropdowns() {

  const ingredients =
    getIngredients();

  const selects =
    document.querySelectorAll(
      '.recipe-ingredient'
    );

  selects.forEach(select => {

    const currentValue =
      select.value;

    select.innerHTML = `

      <option value="">
        Select ingredient
      </option>

    `;

    ingredients.forEach(
      ingredient => {

        const option =
          document.createElement(
            'option'
          );

        option.value =
          ingredient.id;

        option.textContent =

          `${ingredient.name}
          (${ingredient.unit || 'g'})`;

        select.appendChild(
          option
        );

      }
    );

    if (

      [...select.options]
        .some(
          option =>

            option.value
            ===
            currentValue
        )

    ) {

      select.value =
        currentValue;

    }

  });

}

function renderIngredientsTable() {

  const tableBody =
    document.querySelector(
      '#ingredientsTable tbody'
    );

  if (!tableBody) return;

  tableBody.innerHTML = '';

  const ingredients =
    getIngredients();

  if (!ingredients.length) {

    tableBody.innerHTML = `

      <tr>

        <td
          colspan="8"
          class="empty-state centered-empty-state">

          No ingredients found

        </td>

      </tr>

    `;

    return;

  }

  ingredients.forEach(
    ingredient => {

      const stock =
        Number(
          ingredient.stock || 0
        );

      const reorderLevel =
        Number(
          ingredient.reorderLevel || 0
        );

      const unitCost =
        calculateUnitCost(
          ingredient
        );

      const row =
        document.createElement(
          'tr'
        );

      if (
        stock <= reorderLevel
      ) {

        row.classList.add(
          'low-stock-row'
        );

      }

      row.innerHTML = `

        <td>
          ${ingredient.name || '-'}
        </td>

        <td>
          ${ingredient.unit || 'g'}
        </td>

        <td>
          ${Number(
            ingredient.packageQty || 0
          )}
        </td>

        <td>
          ${formatCurrency(
            Number(
              ingredient.packageCost || 0
            )
          )}
        </td>

        <td>
          ${formatCurrency(unitCost)}
          /
          ${ingredient.unit || 'g'}
        </td>

        <td>
          ${stock}
        </td>

        <td>
          ${reorderLevel}
        </td>

        <td>

          <div class="table-actions">

            <button
              class="btn btn-sm"
              type="button"
              onclick="editIngredient('${ingredient.id}')">

              Edit

            </button>

            <button
              class="btn btn-sm"
              type="button"
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

function saveIngredient() {

  const name =
    document.getElementById(
      'ingredientName'
    )?.value?.trim() || '';

  if (!name) {

    showNotification(
      'Ingredient name is required',
      'error'
    );

    return;

  }

  const ingredients =
    getIngredients();

  const ingredientId =
    document.getElementById(
      'ingredientId'
    )?.value || '';

  const ingredient = {

    id:
      ingredientId ||
      generateId(),

    name,

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
      ),

    updatedAt:
      new Date().toISOString()

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

  } else {

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

  resetIngredientForm();

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

  editingIngredientId =
    ingredient.id;

  document.getElementById(
    'ingredientId'
  ).value =
    ingredient.id || '';

  document.getElementById(
    'ingredientName'
  ).value =
    ingredient.name || '';

  document.getElementById(
    'ingredientPurchaseUnit'
  ).value =
    ingredient.unit || 'g';

  document.getElementById(
    'ingredientPackageQty'
  ).value =
    ingredient.packageQty || '';

  document.getElementById(
    'ingredientPurchaseCost'
  ).value =
    ingredient.packageCost || '';

  document.getElementById(
    'ingredientStock'
  ).value =
    ingredient.stock || '';

  document.getElementById(
    'ingredientReorder'
  ).value =
    ingredient.reorderLevel || '';

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

    renderIngredientDropdowns();

  }
);

window.getIngredients =
  getIngredients;

window.setIngredients =
  setIngredients;

window.calculateUnitCost =
  calculateUnitCost;

window.renderIngredientsTable =
  renderIngredientsTable;

window.renderIngredientDropdowns =
  renderIngredientDropdowns;

window.saveIngredient =
  saveIngredient;

window.editIngredient =
  editIngredient;

window.deleteIngredient =
  deleteIngredient;

window.openIngredientModal =
  openIngredientModal;

window.resetIngredientForm =
  resetIngredientForm;