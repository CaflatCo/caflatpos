function switchView(viewName) {

  const views = document.querySelectorAll(
    '.view'
  );

  views.forEach(view => {
    view.classList.remove('active');
  });

  const targetView =
    document.getElementById(
      `view-${viewName}`
    );

  if (targetView) {
    targetView.classList.add('active');
  }

  const navButtons =
    document.querySelectorAll(
      'nav button[data-view]'
    );

  navButtons.forEach(button => {
    button.classList.remove('active');
  });

  const activeButton =
    document.querySelector(
      `nav button[data-view="${viewName}"]`
    );

  if (activeButton) {
    activeButton.classList.add('active');
  }

}

function initializeRouter() {

  const navButtons =
    document.querySelectorAll(
      'nav button[data-view]'
    );

  navButtons.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        const viewName =
          button.dataset.view;

        switchView(viewName);

      }
    );

  });

}

document.addEventListener(
  'DOMContentLoaded',
  initializeRouter
);
