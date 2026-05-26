function getCart() {

  return APP_STATE.cart || [];

}

function setCart(cart) {

  updateState(
    'cart',
    () => cart
  );

  safeRender(
    'cart',

    () => {

      renderCart();

    }
  );

}

function addToCart(product) {

  const cart = getCart();

  const existingItem = cart.find(
    item => item.id === product.id
  );

  if (existingItem) {

    existingItem.quantity += 1;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }

  setCart(cart);

  showNotification(
    `${product.name} added to cart`,
    'info'
  );

}

function removeFromCart(productId) {

  const cart = getCart();

  const updatedCart = cart.filter(
    item => item.id !== productId
  );

  setCart(updatedCart);

  showNotification(
    'Item removed from cart',
    'info'
  );

}

function clearCart() {

  setCart([]);

  showNotification(
    'Cart cleared',
    'info'
  );

}

function calculateCartTotal() {

  const cart = getCart();

  return cart.reduce((total, item) => {

    return (
      total +
      (
        Number(item.price || 0) *
        Number(item.quantity || 0)
      )
    );

  }, 0);

}

function renderCart() {

  const cartContainer = safeGetById(
    'cartItems'
  );

  if (!cartContainer) return;

  const cart = getCart();

  cartContainer.innerHTML = '';

  if (!cart.length) {

    cartContainer.innerHTML = `
      <div class="empty-state">
        Cart is empty
      </div>
    `;

    updateCartTotal();

    return;

  }

  cart.forEach(item => {

    const cartItem =
      document.createElement('div');

    cartItem.className =
      'cart-item';

    cartItem.innerHTML = `
      <div>
        <strong>${item.name}</strong>

        <div>
          ${item.quantity} × ₱${item.price}
        </div>
      </div>

      <button
        class="btn btn-sm"
        onclick="removeFromCart('${item.id}')">
        Remove
      </button>
    `;

    cartContainer.appendChild(
      cartItem
    );

  });

  updateCartTotal();

}

function updateCartTotal() {

  const totalElement =
    safeGetById('cartTotal');

  if (!totalElement) return;

  totalElement.textContent =
    formatCurrency(
      calculateCartTotal()
    );

}

async function checkout() {

  const cart = getCart();

  if (!cart.length) {

    showNotification(
      'Cart is empty',
      'error'
    );

    return;

  }

  const result =
    await executeCommand(
      'checkout',
      {

        cart,

        total:
          calculateCartTotal()

      }
    );

  if (!result) {

    logError(
      'Checkout failed'
    );

    return;

  }

  safeRender(
    'cart',

    () => {

      renderCart();

    }
  );

}

document.addEventListener(
  'DOMContentLoaded',
  renderCart
);

function initializeSalesEventListeners() {

  const clearBtn =
    safeGetById('clearCartBtn');

  if (clearBtn) {

    clearBtn.addEventListener(
      'click',
      clearCart
    );

  }

  const holdBtn =
    safeGetById('holdOrderBtn');

  if (holdBtn) {

    holdBtn.addEventListener(
      'click',
      holdOrder
    );

  }

  const checkoutBtn =
    safeGetById('checkoutBtn');

  if (checkoutBtn) {

    checkoutBtn.addEventListener(
      'click',
      checkout
    );

  }

  const discountBtn =
    safeGetById(
      'applyDiscountBtn'
    );

  if (discountBtn) {

    discountBtn.addEventListener(
      'click',
      applyDiscount
    );

  }

}

document.addEventListener(
  'DOMContentLoaded',
  initializeSalesEventListeners
);

registerCommand(
  'checkout',

  async payload => {

    return await runTransaction(
      'checkout',

      async () => {

        const {
          cart,
          total
        } = payload;

        createAuditEntry(
          'checkout_completed',
          {

            total,

            itemCount:
              cart.length

          }
        );

        updateState(
          'sales',

          currentSales => {

            return [

              ...currentSales,

              {

                id:
                  Date.now(),

                items:
                  [...cart],

                total,

                createdAt:
                  new Date()
                    .toISOString()

              }

            ];

          }
        );

        updateState(
          'inventory',

          currentInventory => {

            return currentInventory.map(
              inventoryItem => {

                const soldItem =
                  cart.find(
                    cartItem =>
                      cartItem.id ===
                      inventoryItem.id
                  );

                if (!soldItem) {

                  return inventoryItem;

                }

                return {

                  ...inventoryItem,

                  stock:
                    Number(
                      inventoryItem.stock || 0
                    ) -
                    Number(
                      soldItem.quantity || 0
                    )

                };

              }
            );

          }
        );

        updateState(
          'cart',

          () => []
        );

        emitEvent(
          'checkoutCompleted',
          {

            total,

            cart

          }
        );

        showNotification(
          'Checkout successful',
          'success'
        );

        return true;

      }
    );

  }
);
