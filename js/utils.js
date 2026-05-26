function formatCurrency(value) {

  return (
    APP_CONFIG.CURRENCY_SYMBOL +
    Number(value || 0).toFixed(
      APP_CONFIG.DEFAULT_DECIMAL_PLACES
    )
  );

}

function formatDate(date) {

  return new Date(date)
    .toLocaleDateString(
      APP_CONFIG.DATE_LOCALE
    );

}

function generateReceiptNumber() {

  return (
    'RCPT-' +
    Date.now()
  );

}

function calculateTax(amount) {

  return (
    Number(amount || 0) *
    (APP_CONFIG.TAX_RATE / 100)
  );

}
