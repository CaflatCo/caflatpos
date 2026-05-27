/* =========================
   Ingredients Module
========================= */

if (!window.UNITS) {

  window.UNITS = {

    CONVERSIONS: {

      g: 1,
      kg: 1000,
      ml: 1,
      l: 1000,
      pc: 1

    }

  };

}

/* =========================
   BACKWARD COMPATIBILITY
========================= */

const UNIT_CONVERSIONS =
  (window.UNITS && window.UNITS.CONVERSIONS)

    ? window.UNITS.CONVERSIONS

    : {

        g: 1,
        kg: 1000,
        ml: 1,
        l: 1000,
        pc: 1

      };

/* =========================
   SAFE NORMALIZER
========================= */

function normalizeUnitValue(
  value,
  unit
) {

  const safeUnit =
    String(unit || '')
      .toLowerCase();

  const multiplier =
    UNIT_CONVERSIONS[safeUnit];

  if (!multiplier) {

    console.warn(
      'Unknown unit:',
      unit
    );

    return Number(value || 0);

  }

  return (
    Number(value || 0) *
    multiplier
  );

}

/* =========================
   INGREDIENT STORAGE
========================= */

function getIngredients() {

  return APP_STATE.ingredients || [];

}

function setIngredients(
  ingredients
) {

  APP_STATE.ingredients =
    ingredients;

  saveState();

}

/* =========================
   NORMALIZE STOCK
========================= */

function normalizeIngredientStock(
  quantity,
  unit
) {

  return normalizeUnitValue(
    quantity,
    unit
  );

}

/* =========================
   TABLE RENDER
========================= */

function renderIngredientsTable() {

  const tableBody =
    document.querySelector(
      '#ingredientsTable tbody'
    );

  if (!tableBody) return;

  const ingredients =
    getIngredients();

  tableBody.innerHTML = '';

  if (!ingredients.length) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
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
          ${ingredient.name || '-'}
        </td>

        <td>
          ${ingredient.unit || '-'}
        </td>

        <td>
          ${ingredient.stock || 0}
        </td>

        <td>
          ${ingredient.cost || 0}
        </td>

        <td>
          ${ingredient.supplier || '-'}
        </td>

        <td>

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

/* =========================
   SAVE INGREDIENT
========================= */

function saveIngredient() {

  try {

    const name =
      document
        .getElementById(
          'ingredientName'
        )
        ?.value?.trim();

    const unit =
      document
        .getElementById(
          'ingredientPurchaseUnit'
        )
        ?.value;

    const packageQty =
      Number(
        document
          .getElementById(
            'ingredientPackageQty'
          )
          ?.value || 0
      );

    const packageCost =
      Number(
        document
          .getElementById(
            'ingredientPurchaseCost'
          )
          ?.value || 0
      );

    const stock =
      Number(
        document
          .getElementById(
            'ingredientStock'
          )
          ?.value || 0
      );

    const reorderLevel =
      Number(
        document
          .getElementById(
            'ingredientReorder'
          )
          ?.value || 0
      );

    if (!name) {

      alert(
        'Ingredient name required'
      );

      return;

    }

    const normalizedStock =

      normalizeIngredientStock(
        stock,
        unit
      );

    const ingredients =
      getIngredients();

    ingredients.push({

      id: Date.now(),

      name,

      unit,

      packageQty,

      packageCost,

      reorderLevel,

      stock:
        normalizedStock

    });

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

  } catch (error) {

    console.error(error);

    alert(
      'Ingredient save failed: ' +
      error.message
    );

  }

}

/* =========================
   DELETE INGREDIENT
========================= */

function deleteIngredient(
  ingredientId
) {

  const confirmed =
    confirm(
      'Delete this ingredient?'
    );

  if (!confirmed) return;

  const ingredients =
    getIngredients();

  const updatedIngredients =

    ingredients.filter(
      ingredient =>

        String(
          ingredient.id
        ) !==

        String(
          ingredientId
        )
    );

  setIngredients(
    updatedIngredients
  );

  renderIngredientsTable();

}

/* =========================
   DEDUCT STOCK
========================= */

function deductIngredientStock(
  ingredientId,
  quantityToDeduct
) {

  const ingredients =
    getIngredients();

  const updatedIngredients =

    ingredients.map(
      ingredient => {

        if (

          String(
            ingredient.id
          ) !==

          String(
            ingredientId
          )

        ) {

          return ingredient;

        }

        return {

          ...ingredient,

          stock:

            Math.max(

              0,

              Number(
                ingredient.stock || 0
              ) -

              Number(
                quantityToDeduct || 0
              )

            )

        };

      }
    );

  setIngredients(
    updatedIngredients
  );

  renderIngredientsTable();

}

/* =========================
   RECIPE DEDUCTION
========================= */

function deductRecipeIngredients(
  product,
  quantitySold = 1
) {

  if (!product.recipe?.length) {

    return;

  }

  product.recipe.forEach(
    recipeItem => {

      const deductionAmount =

        Number(
          recipeItem.quantity || 0
        ) *

        Number(
          quantitySold || 1
        );

      deductIngredientStock(

        recipeItem.ingredientId,

        deductionAmount

      );

    }
  );

}

/* =========================
   RECIPE COST
========================= */

function calculateRecipeCost(
  recipeItems = []
) {

  let totalCost = 0;

  recipeItems.forEach(
    item => {

      totalCost += Number(
        item.cost || 0
      );

    }
  );

  return totalCost;

}

/* =========================
   INIT
========================= */

document.addEventListener(
  'DOMContentLoaded',

  renderIngredientsTable
);