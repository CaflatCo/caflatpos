function openModal(modalId) {

  const modal = document.getElementById(modalId);

  if (!modal) return;

  modal.classList.add('active');

}

function closeModal(modalId) {

  const modal = document.getElementById(modalId);

  if (!modal) return;

  modal.classList.remove('active');

}

function closeAllModals() {

  const modals = document.querySelectorAll(
    '.modal-overlay'
  );

  modals.forEach(modal => {
    modal.classList.remove('active');
  });

}

function initializeModalManager() {

  const overlays = document.querySelectorAll(
    '.modal-overlay'
  );

  overlays.forEach(overlay => {

    overlay.addEventListener('click', (event) => {

      if (event.target === overlay) {
        overlay.classList.remove('active');
      }

    });

  });

}

document.addEventListener(
  'DOMContentLoaded',
  initializeModalManager
);
