function initializeSidebar() {

  const sidebarToggle =
    document.getElementById(
      'sidebarToggle'
    );

  const sidebar =
    document.getElementById(
      'sidebar'
    );

  if (
    !sidebarToggle ||
    !sidebar
  ) {
    return;
  }

  sidebarToggle.addEventListener(
    'click',
    () => {

      sidebar.classList.toggle(
        'collapsed'
      );

    }
  );

}

function initializeTabs() {

  const tabButtons =
    document.querySelectorAll(
      '.tab-btn'
    );

  tabButtons.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        const target =
          button.dataset.tab;

        const parent =
          button.closest(
            '.tab-container'
          );

        if (!parent) return;

        parent
          .querySelectorAll(
            '.tab-btn'
          )
          .forEach(btn => {

            btn.classList.remove(
              'active'
            );

          });

        parent
          .querySelectorAll(
            '.tab-panel'
          )
          .forEach(panel => {

            panel.classList.remove(
              'active'
            );

          });

        button.classList.add(
          'active'
        );

        const panel =
          parent.querySelector(
            `[data-tab-panel="${target}"]`
          );

        if (panel) {

          panel.classList.add(
            'active'
          );

        }

      }
    );

  });

}

function initializeResponsivePOS() {

  const mediaQuery =
    window.matchMedia(
      '(max-width: 1024px)'
    );

  function applyResponsiveMode(
    event
  ) {

    document.body.classList.toggle(
      'mobile-pos',
      event.matches
    );

  }

  applyResponsiveMode(
    mediaQuery
  );

  mediaQuery.addEventListener(
    'change',
    applyResponsiveMode
  );

}

document.addEventListener(
  'DOMContentLoaded',
  () => {

    initializeSidebar();

    initializeTabs();

    initializeResponsivePOS();

  }
);

window.initializeSidebar =
  initializeSidebar;

window.initializeTabs =
  initializeTabs;

window.initializeResponsivePOS =
  initializeResponsivePOS;