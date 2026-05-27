function getCart() {

  return APP_STATE.cart || [];

}

function setCart(cart) {

  updateState(
    'cart',
    () => cart
  );

  renderCart();

}

function addToCart(productId) {

  const product =
    getProducts().find(

      item =>

        String(item.id) ===
        String(productId)
    );

  if (!product) {

    return;

  }

  const cart =
    getCart();

  const existing =
    cart.find(

      item =>

        String(item.id) ===
        String(product.id)
    );

  if (existing) {

    existing.quantity += 1;

  }

  else {

    cart.push({

      ...product,

      quantity: 1

    });

  }

  setCart(cart);

  showNotification(
    `${product.name} added`,
    'success'
  );

}

function removeFromCart(productId) {

  const updated =

    getCart().filter(

      item =>

        String(item.id) !==
        String(productId)
    );

  setCart(updated);

}

function clearCart() {

  setCart([]);

}

function calculateCartSubtotal() {

  return getCart().reduce(

    (total, item) => {

      return (

        total +

        (
          Number(item.price || 0)

          *

          Number(item.quantity || 0)
        )

      );

    },

    0

  );

}

function calculateCartTax(subtotal) {

  const taxRate =

    Number(
      APP_STATE.settings
        ?.taxRate || 0
    );

  return subtotal *

    (taxRate / 100);

}

function calculateCartTotal() {

  const subtotal =
    calculateCartSubtotal();

  const tax =
    calculateCartTax(
      subtotal
    );

  return subtotal + tax;

}

function updateCartSummary() {

  const subtotal =
    calculateCartSubtotal();

  const tax =
    calculateCartTax(
      subtotal
    );

  const total =
    calculateCartTotal();

  safeGetById(
    'cartSubtotal'
  ).textContent =

    formatCurrency(
      subtotal
    );

  safeGetById(
    'cartTax'
  ).textContent =

    formatCurrency(
      tax
    );

  safeGetById(
    'cartTotal'
  ).textContent =

    formatCurrency(
      total
    );

}

function renderCart() {

  const container =
    safeGetById(
      'cartItems'
    );

  if (!container) return;

  container.innerHTML = '';

  const cart =
    getCart();

  if (!cart.length) {

    container.innerHTML = `

      <div class="empty-state">

        Cart is empty

      </div>

    `;

    updateCartSummary();

    return;

  }

  cart.forEach(item => {

    const card =
      document.createElement(
        'div'
      );

    card.className =
      'cart-item';

    card.innerHTML = `

      <div>

        <strong>
          ${item.name}
        </strong>

        <div>

          ${item.quantity}

          ×

          ${formatCurrency(item.price)}

        </div>

      </div>

      <button
        class="btn btn-sm"
        onclick="removeFromCart('${item.id}')">

        Remove

      </button>

    `;

    container.appendChild(
      card
    );

  });

  updateCartSummary();

}

function deductProductInventory(
  cart
) {

  const updated =
    getProducts().map(product => {

      const sold =
        cart.find(

          item =>

            String(item.id) ===
            String(product.id)
        );

      if (!sold) {

        return product;

      }

      return {

        ...product,

        stock:

          Number(product.stock || 0)

          -

          Number(sold.quantity || 0)

      };

    });

  setProducts(updated);

}

function deductIngredients(
  cart
) {

  const updated =
    getIngredients().map(
      ingredient => {

        let deduction = 0;

        cart.forEach(product => {

          if (
            !Array.isArray(
              product.recipe
            )
          ) return;

          product.recipe.forEach(
            recipeItem => {

              if (

                String(
                  recipeItem.ingredientId
                ) ===

                String(
                  ingredient.id
                )

              ) {

                let qty =

                  Number(
                    recipeItem.quantity || 0
                  ) *

                  Number(
                    product.quantity || 0
                  );

                if (
                  product.recipeMode ===
                  'batch'
                ) {

                  qty =

                    qty /

                    Number(
                      product.batchYield || 1
                    );

                }

                deduction += qty;

              }

            }
          );

        });

        return {

          ...ingredient,

          stock:

            Number(
              ingredient.stock || 0
            ) - deduction

        };

      }
    );

  setIngredients(updated);

}

function saveSale(cart) {

  const subtotal =
    calculateCartSubtotal();

  const tax =
    calculateCartTax(
      subtotal
    );

  const total =
    calculateCartTotal();

  const sales =
    getSales();

  sales.push({

    id:
      generateId(),

    items:
      [...cart],

    subtotal,

    tax,

    total,

    createdAt:
      new Date()
        .toISOString()

  });

  updateState(
    'sales',
    () => sales
  );

}

function checkout() {

  const cart =
    getCart();

  if (!cart.length) {

    showNotification(
      'Cart is empty',
      'error'
    );

    return;

  }

  saveSale(cart);

  deductProductInventory(
    cart
  );

  deductIngredients(
    cart
  );

  clearCart();

  renderProductsTable();

  renderPOSProducts();

  renderIngredientsTable();

  refreshDashboard();

  showNotification(
    'Checkout complete',
    'success'
  );

}

function initializeSalesEventListeners() {

  safeGetById(
    'clearCartBtn'
  )?.addEventListener(
    'click',
    clearCart
  );

  safeGetById(
    'checkoutBtn'
  )?.addEventListener(
    'click',
    checkout
  );

}

document.addEventListener(

  'DOMContentLoaded',

  () => {

    renderCart();

    initializeSalesEventListeners();

  }

);