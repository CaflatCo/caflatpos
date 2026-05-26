function getTransactionHistory() {

  return APP_STATE.sales || [];

}

function renderTransactionHistory() {

  safeRender(
    'transaction-history',

    () => {

      const container =
        safeGetById(
          'transactionHistory'
        );

      if (!container) {

        return;

      }

      const history =
        getTransactionHistory();

      container.innerHTML = '';

      if (!history.length) {

        container.innerHTML = `
          <div class="empty-state">
            No transactions found
          </div>
        `;

        return;

      }

      history
        .slice()
        .reverse()
        .forEach(transaction => {

          const card =
            document.createElement(
              'div'
            );

          card.className =
            'transaction-card';

          card.innerHTML = `
            <div class="transaction-header">

              <strong>
                Receipt #${transaction.id}
              </strong>

              <span>
                ${formatDate(
                  transaction.createdAt
                )}
              </span>

            </div>

            <div class="transaction-body">

              <div>
                Items:
                ${transaction.items.length}
              </div>

              <div>
                Total:
                ${formatCurrency(
                  transaction.total
                )}
              </div>

            </div>

            <div class="transaction-actions">

              <button
                class="btn btn-sm"
                onclick="printReceiptById('${transaction.id}')">

                Print

              </button>

            </div>
          `;

          container.appendChild(
            card
          );

        });

    }
  );

}

function printReceiptById(
  transactionId
) {

  const sales =
    getTransactionHistory();

  const transaction =
    sales.find(
      sale =>
        String(sale.id) ===
        String(transactionId)
    );

  if (!transaction) {

    showNotification(
      'Transaction not found',
      'error'
    );

    return;

  }

  printReceipt(
    transaction
  );

}

function refreshTransactionHistory() {

  renderTransactionHistory();

}

document.addEventListener(
  'DOMContentLoaded',

  () => {

    renderTransactionHistory();

  }
);

registerEvent(
  'checkoutCompleted',

  () => {

    refreshTransactionHistory();

  }
);
