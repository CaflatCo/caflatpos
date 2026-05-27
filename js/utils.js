function generateId() {

  return (

    Date.now().toString(36)

    +

    Math.random()
      .toString(36)
      .substring(2, 9)

  );

}

function formatCurrency(
  value
) {

  const currency =

    APP_STATE.settings
      ?.currency ||

    '₱';

  return `${currency}${Number(
    value || 0
  ).toFixed(2)}`;

}

function showNotification(
  message,
  type = 'success'
) {

  const container =
    document.getElementById(
      'notificationContainer'
    );

  if (!container) {

    alert(message);

    return;

  }

  const notification =
    document.createElement(
      'div'
    );

  notification.className =

    `notification ${type}`;

  notification.innerHTML = `

    <div class="notification-content">

      ${message}

    </div>

  `;

  container.appendChild(
    notification
  );

  requestAnimationFrame(() => {

    notification.classList.add(
      'show'
    );

  });

  setTimeout(() => {

    notification.classList.remove(
      'show'
    );

    setTimeout(() => {

      notification.remove();

    }, 250);

  }, 3000);

}

function openModal(
  modalId
) {

  const modal =
    document.getElementById(
      modalId
    );

  if (!modal) return;

  modal.classList.add(
    'active'
  );

  document.body.classList.add(
    'modal-open'
  );

}

function closeModal(
  modalId
) {

  const modal =
    document.getElementById(
      modalId
    );

  if (!modal) return;

  modal.classList.remove(
    'active'
  );

  const activeModals =
    document.querySelectorAll(
      '.modal.active'
    );

  if (!activeModals.length) {

    document.body.classList.remove(
      'modal-open'
    );

  }

}

function downloadFile(
  filename,
  content,
  mimeType = 'text/plain'
) {

  const blob =
    new Blob(
      [content],
      { type: mimeType }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      'a'
    );

  link.href = url;

  link.download =
    filename;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  URL.revokeObjectURL(
    url
  );

}

document.addEventListener(
  'click',
  event => {

    const closeTrigger =
      event.target.closest(
        '[data-close-modal]'
      );

    if (!closeTrigger)
      return;

    const modal =
      closeTrigger.closest(
        '.modal'
      );

    if (!modal) return;

    closeModal(
      modal.id
    );

  }
);

window.generateId =
  generateId;

window.formatCurrency =
  formatCurrency;

window.showNotification =
  showNotification;

window.openModal =
  openModal;

window.closeModal =
  closeModal;

window.downloadFile =
  downloadFile;