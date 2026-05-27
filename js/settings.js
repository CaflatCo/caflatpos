function getCategoryList() {

  const stored =

    Array.isArray(
      APP_STATE.categories
    )

      ? APP_STATE.categories

      : [];

  const fromProducts =

    (APP_STATE.products || [])

      .map(product =>

        String(
          product.category || ''
        ).trim()

      )

      .filter(Boolean);

  return [

    ...new Set([

      ...stored,
      ...fromProducts

    ])

  ];

}

function renderCategories() {

  const list =
    document.getElementById(
      'categoryList'
    );

  if (!list) return;

  const categories =

    Array.isArray(
      APP_STATE.categories
    )

      ? APP_STATE.categories

      : [];

  list.innerHTML = '';

  if (!categories.length) {

    list.innerHTML = `

      <div class="empty-state">
        No categories yet
      </div>

    `;

    return;

  }

  categories.forEach(category => {

    const item =
      document.createElement(
        'div'
      );

    item.className =
      'settings-row';

    item.innerHTML = `

      <span>${category}</span>

      <button
        class="btn btn-sm"
        type="button"
        onclick="deleteCategory('${category}')">

        Delete

      </button>

    `;

    list.appendChild(item);

  });

}

function deleteCategory(name) {

  const updated =

    (
      APP_STATE.categories || []
    ).filter(category =>

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

  const categories =
    getCategoryList();

  const productSelect =
    document.getElementById(
      'productCategory'
    );

  const filterSelect =
    document.getElementById(
      'productCategoryFilter'
    );

  if (productSelect) {

    const current =
      productSelect.value;

    productSelect.innerHTML = `

      <option value="">
        Select category
      </option>

    `;

    categories.forEach(category => {

      const option =
        document.createElement(
          'option'
        );

      option.value =
        category;

      option.textContent =
        category;

      productSelect.appendChild(
        option
      );

    });

    if (
      categories.includes(current)
    ) {

      productSelect.value =
        current;

    }

  }

  if (filterSelect) {

    const current =
      filterSelect.value;

    filterSelect.innerHTML = `

      <option value="">
        All Categories
      </option>

    `;

    categories.forEach(category => {

      const option =
        document.createElement(
          'option'
        );

      option.value =
        category;

      option.textContent =
        category;

      filterSelect.appendChild(
        option
      );

    });

    if (
      categories.includes(current)
    ) {

      filterSelect.value =
        current;

    }

  }

}

function addRecipeRow(data = {}) {

  const builder =
    document.getElementById(
      'recipeBuilder'
    );

  if (!builder) return;

  const row =
    document.createElement(
      'div'
    );

  row.className =
    'recipe-row form-row';

  row.style.marginBottom =
    '12px';

  const ingredients =

    Array.isArray(
      APP_STATE.ingredients
    )

      ? APP_STATE.ingredients

      : [];

  const optionsHtml =

    ingredients.length

      ? ingredients.map(
          ingredient => `

            <option
              value="${ingredient.id}"

              ${
                String(
                  data.ingredientId || ''
                )
                ===
                String(ingredient.id)

                  ? 'selected'

                  : ''
              }>

              ${ingredient.name || '-'}
              (${ingredient.unit || 'g'})

            </option>

          `
        ).join('')

      : `
          <option value="">
            No ingredients available
          </option>
        `;

  row.innerHTML = `

    <div class="form-group">

      <label>
        Ingredient
      </label>

      <select class="recipe-ingredient">

        <option value="">
          Select ingredient
        </option>

        ${optionsHtml}

      </select>

    </div>

    <div class="form-group">

      <label>
        Quantity
      </label>

      <input
        type="number"
        class="recipe-qty"
        placeholder="Quantity"
        min="0"
        step="0.01"
        value="${data.quantity || 0}"
      />

    </div>

    <div class="form-group">

      <label>&nbsp;</label>

      <button
        type="button"
        class="btn btn-secondary remove-recipe-btn">

        Remove

      </button>

    </div>

  `;

  row.querySelector(
    '.remove-recipe-btn'
  ).addEventListener(
    'click',
    () => row.remove()
  );

  builder.appendChild(row);

}

document.addEventListener(
  'DOMContentLoaded',
  () => {

    renderCategories();

    renderCategoryOptions();

  }
);

window.getCategoryList =
  getCategoryList;

window.renderCategories =
  renderCategories;

window.renderCategoryOptions =
  renderCategoryOptions;

window.deleteCategory =
  deleteCategory;

window.addRecipeRow =
  addRecipeRow;