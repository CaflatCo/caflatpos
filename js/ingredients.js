/* =========================
   Ingredients Module
========================= */

if (!window.UNITS) {

  throw new Error(
    'units.js failed to load'
  );

}

/* =========================
   BACKWARD COMPATIBILITY
========================= */

const UNIT_CONVERSIONS =
  UNITS.CONVERSIONS;

function getIngredients() {

  return APP_STATE.ingredients || [];

}

function setIngredients(ingredients) {

  APP_STATE.ingredients = ingredients;

  saveState();

}

function normalizeIngredientStock(
  quantity,
  unit
) {

  return normalizeUnitValue(
    quantity,
    unit
  );

}

function renderIngredientsTable() {

  const tableBody = document.querySelector(
    '#ingredientsTable tbody'
  );

  if (!tableBody) return;

  const ingredients = getIngredients();

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

  ingredients.forEach(ingredient => {

    const row = document.createElement('tr');

    row.innerHTML = `

      <td>${ingredient.name || '-'}</td>

      <td>${ingredient.unit || '-'}</td>

      <td>${ingredient.stock || 0}</td>

      <td>${ingredient.cost || 0}</td>

      <td>${ingredient.supplier || '-'}</td>

      <td>

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

function addIngredient(ingredient) {

  const ingredients =
    getIngredients();

  const normalizedStock =
    normalizeIngredientStock(
      ingredient.stock,
      ingredient.unit
    );

  ingredients.push({

    ...ingredient,

    stock:
      normalizedStock

  });

  setIngredients(
    ingredients
  );

  renderIngredientsTable();

}

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
          String(ingredient.id) !==
          String(ingredientId)
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

function deleteIngredient(
  ingredientId
) {

  const confirmed = confirm(
    'Delete this ingredient?'
  );

  if (!confirmed) return;

  const ingredients =
    getIngredients();

  const updatedIngredients =
    ingredients.filter(
      ingredient =>
        ingredient.id !== ingredientId
    );

  setIngredients(
    updatedIngredients
  );

  renderIngredientsTable();

}

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

document.addEventListener(
  'DOMContentLoaded',
  renderIngredientsTable
);