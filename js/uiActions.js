function initializeUIActions() {

  bindPrimaryButtons();

  bindModalButtons();

  bindImportExport();

  bindVariantBuilder();

  bindRecipeBuilder();

}

function bindPrimaryButtons() {

  const addProductBtn =
    document.getElementById(
      'addProductBtn'
    );

  const addIngredientBtn =
    document.getElementById(
      'addIngredientBtn'
    );

  const addCategoryBtn =
    document.getElementById(
      'addCategoryBtn'
    );

  const saveProductBtn =
    document.getElementById(
      'saveProductBtn'
    );

  const saveIngredientBtn =
    document.getElementById(
      'saveIngredientBtn'
    );

  const saveSettingsBtn =
    document.getElementById(
      'saveSettingsBtn'
    );

  const loadDemoBtn =
    document.getElementById(
      'loadDemoBtn'
    );

  const exportSalesBtn =
    document.getElementById(
      'exportSalesBtn'
    );

  if (addProductBtn) {

    addProductBtn.addEventListener(
      'click',
      () => {

        openProductModal();

      }
    );

  }

  if (addIngredientBtn) {

    addIngredientBtn.addEventListener(
      'click',
      () => {

        openIngredientModal();

      }
    );

  }

  if (addCategoryBtn) {

    addCategoryBtn.addEventListener(
      'click',
      addCategory
    );

  }

  if (saveProductBtn) {

    saveProductBtn.addEventListener(
      'click',
      saveProduct
    );

  }

  if (saveIngredientBtn) {

    saveIngredientBtn.addEventListener(
      'click',
      saveIngredient
    );

  }

  if (saveSettingsBtn) {

    saveSettingsBtn.addEventListener(
      'click',
      saveSettings
    );

  }

  if (loadDemoBtn) {

    loadDemoBtn.addEventListener(
      'click',
      loadDemoData
    );

  }

  if (exportSalesBtn) {

    exportSalesBtn.addEventListener(
      'click',
      exportSalesReport
    );

  }

}

function bindModalButtons() {

  document
    .querySelectorAll(
      '[data-close-modal]'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          () => {

            const target =
              button.dataset
                .closeModal;

            if (!target)
              return;

            closeModal(
              target
            );

          }
        );

      }
    );

}

function bindImportExport() {

  const exportBtn =
    document.getElementById(
      'exportDataBtn'
    );

  const importInput =
    document.getElementById(
      'importDataInput'
    );

  if (exportBtn) {

    exportBtn.addEventListener(
      'click',
      exportAllData
    );

  }

  if (importInput) {

    importInput.addEventListener(
      'change',
      event => {

        const file =
          event.target
            .files?.[0];

        if (!file)
          return;

        importAllData(
          file
        );

        event.target.value =
          '';

      }
    );

  }

}

function bindVariantBuilder() {

  const addVariantBtn =
    document.getElementById(
      'addVariantBtn'
    );

  if (!addVariantBtn)
    return;

  addVariantBtn.addEventListener(
    'click',
    () => {

      addVariantRow();

    }
  );

}

function addVariantRow(
  variant = null
) {

  const container =
    document.getElementById(
      'variantBuilder'
    );

  if (!container)
    return;

  const row =
    document.createElement(
      'div'
    );

  row.className =
    'variant-row';

  row.innerHTML = `

    <input
      type="text"
      class="variant-name"
      placeholder="Variant Name"
      value="${variant?.name || ''}">

    <input
      type="number"
      class="variant-price"
      placeholder="Price"
      value="${variant?.price || ''}">

    <button
      type="button"
      class="btn btn-secondary remove-variant-btn">

      Remove

    </button>

  `;

  const removeBtn =
    row.querySelector(
      '.remove-variant-btn'
    );

  removeBtn.addEventListener(
    'click',
    () => {

      row.remove();

    }
  );

  container.appendChild(
    row
  );

}

function bindRecipeBuilder() {

  const addRecipeBtn =
    document.getElementById(
      'addRecipeBtn'
    );

  if (!addRecipeBtn)
    return;

  addRecipeBtn.addEventListener(
    'click',
    () => {

      addRecipeRow();

    }
  );

}

function addRecipeRow(
  recipe = null
) {

  const container =
    document.getElementById(
      'recipeBuilder'
    );

  if (!container)
    return;

  const row =
    document.createElement(
      'div'
    );

  row.className =
    'recipe-row';

  row.innerHTML = `

    <select
      class="recipe-ingredient">

    </select>

    <input
      type="number"
      class="recipe-qty"
      placeholder="Quantity"
      value="${recipe?.quantity || ''}">

    <button
      type="button"
      class="btn btn-secondary remove-recipe-btn">

      Remove

    </button>

  `;

  const removeBtn =
    row.querySelector(
      '.remove-recipe-btn'
    );

  removeBtn.addEventListener(
    'click',
    () => {

      row.remove();

    }
  );

  container.appendChild(
    row
  );

  renderIngredientDropdowns();

  if (
    recipe?.ingredientId
  ) {

    row.querySelector(
      '.recipe-ingredient'
    ).value =
      recipe.ingredientId;

  }

}

function openVariantSelector(
  productId
) {

  const product =
    getProducts().find(
      item =>

        String(item.id)
        ===
        String(productId)
    );

  if (
    !product ||
    !Array.isArray(
      product.variants
    )
  ) {
    return;
  }

  const container =
    document.getElementById(
      'variantSelectorOptions'
    );

  if (!container)
    return;

  container.innerHTML =
    '';

  product.variants.forEach(
    variant => {

      const option =
        document.createElement(
          'button'
        );

      option.type =
        'button';

      option.className =
        'variant-option-btn';

      option.innerHTML = `

        <div>

          ${variant.name}

        </div>

        <div>

          ${formatCurrency(
            variant.price
          )}

        </div>

      `;

      option.addEventListener(
        'click',
        () => {

          addToCart(
            product.id,
            variant
          );

          closeModal(
            'variantSelectorModal'
          );

        }
      );

      container.appendChild(
        option
      );

    }
  );

  openModal(
    'variantSelectorModal'
  );

}

document.addEventListener(
  'DOMContentLoaded',
  initializeUIActions
);

window.initializeUIActions =
  initializeUIActions;

window.addVariantRow =
  addVariantRow;

window.addRecipeRow =
  addRecipeRow;

window.openVariantSelector =
  openVariantSelector;