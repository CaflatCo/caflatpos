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

  if (
    Number(product.stock || 0)
    <= 0
  ) {

    showNotification(
      'Out of stock',
      'error'
    );

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

    if (
      existing.quantity >=
      product.stock
    ) {

      showNotification(
        'Insufficient stock',
        'error'
      );

      return;

    }

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

function increaseCartQty(
  productId
) {

  const cart =
    getCart();

  const item =
    cart.find(

      item =>

        String(item.id) ===
        String(productId)
    );

  if (!item) return;

  const product =
    getProducts().find(

      p =>

        String(p.id) ===
        String(productId)
    );

  if (!product) return;

  if (
    item.quantity >=
    product.stock
  ) {

    showNotification(
      'Insufficient stock',
      'error'
    );

    return;

  }

  item.quantity += 1;

  setCart(cart);

}

function decreaseCartQty(
  productId
) {

  const cart =
    getCart();

  const item =
    cart.find(

      item =>

        String(item.id) ===
        String(productId)
    );

  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {

    removeFromCart(
      productId
    );

    return;

  }

  setCart(cart);

}

function clearCart() {

  const confirmed =
    confirm(
      'Clear current order?'
    );

  if (!confirmed) {

    return;

  }

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

      <div class="empty-cart-state">

        <div class="empty-cart-icon">

          🛒

        </div>

        <div class="empty-cart-title">

          No items yet

        </div>

        <div class="empty-cart-subtitle">

          Products added will appear here

        </div>

      </div>

    `;

    updateCartSummary();

    return;

  }

  cart.forEach(item => {

    const total =

      Number(item.price || 0)

      *

      Number(item.quantity || 0);

    const card =
      document.createElement(
        'div'
      );

    card.className =
      'cart-item-card';

    card.innerHTML = `

      <div class="cart-item-top">

        <div>

          <div class="cart-item-name">

            ${item.name}

          </div>

          <div class="cart-item-price">

            ${formatCurrency(item.price)}

          </div>

        </div>

        <button
          class="cart-remove-btn"
          onclick="removeFromCart('${item.id}')">

          ✕

        </button>

      </div>

      <div class="cart-item-bottom">

        <div class="qty-controls">

          <button
            onclick="decreaseCartQty('${item.id}')">

            −

          </button>

          <span>

            ${item.quantity}

          </span>

          <button
            onclick="increaseCartQty('${item.id}')">

            +

          </button>

        </div>

        <div class="cart-item-total">

          ${formatCurrency(total)}

        </div>

      </div>

    `;

    container.appendChild(card);

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

  setCart([]);

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