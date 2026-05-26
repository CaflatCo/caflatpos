const AUTH_USERS = {

  admin: {

    password: 'Ry9@qm408me',

    role: 'admin'

  },

  staff: {

    password: 'staff123',

    role: 'cashier'

  }

};

function applyAuth(role) {

  const loginScreen =
    safeGetById(
      'loginScreen'
    );

  const roleBadge =
    safeGetById(
      'roleBadge'
    );

  if (loginScreen) {

    loginScreen.style.display =
      'none';

  }

  if (roleBadge) {

    roleBadge.textContent =
      role.toUpperCase();

  }

}

async function login() {

  const usernameInput =
    safeGetById(
      'loginUsername'
    );

  const passwordInput =
    safeGetById(
      'loginPassword'
    );

  if (
    !usernameInput ||
    !passwordInput
  ) {

    return;

  }

  const username =
    usernameInput.value.trim();

  const password =
    passwordInput.value;

  const result =
    await executeCommand(
      'login',

      {

        username,

        password

      }
    );

  if (!result) {

    logError(
      'Login failed'
    );

  }

}

async function logout() {

  const result =
    await executeCommand(
      'logout'
    );

  if (!result) {

    logError(
      'Logout failed'
    );

  }

}

function initializeAuth() {

  const loginBtn =
    safeGetById(
      'loginBtn'
    );

  if (loginBtn) {

    loginBtn.addEventListener(
      'click',
      login
    );

  }

  const session =
    loadFromStorage(
      'caflat_auth'
    );

  if (
    session &&
    session.role
  ) {

    updateState(
      'currentUserRole',

      () => session.role
    );

    applyAuth(
      session.role
    );

    emitEvent(
      'userSessionRestored',
      session
    );

  }

}

document.addEventListener(
  'DOMContentLoaded',

  initializeAuth
);

registerCommand(
  'login',

  async payload => {

    return await runTransaction(
      'login',

      async () => {

        const {
          username,
          password
        } = payload;

        const user =
          AUTH_USERS[username];

        if (
          !user ||
          user.password !== password
        ) {

          showNotification(
            'Invalid username or password',
            'error'
          );

          createAuditEntry(
            'login_failed',

            {

              username

            }
          );

          return false;

        }

        saveToStorage(
          'caflat_auth',

          {

            username,

            role:
              user.role

          }
        );

        updateState(
          'currentUserRole',

          () => user.role
        );

        createAuditEntry(
          'login_success',

          {

            username,

            role:
              user.role

          }
        );

        applyAuth(
          user.role
        );

        emitEvent(
          'userLoggedIn',

          {

            username,

            role:
              user.role

          }
        );

        showNotification(
          'Login successful',
          'success'
        );

        return true;

      }
    );

  }
);

registerCommand(
  'logout',

  async () => {

    return await runTransaction(
      'logout',

      async () => {

        removeFromStorage(
          'caflat_auth'
        );

        createAuditEntry(
          'logout'
        );

        emitEvent(
          'userLoggedOut'
        );

        showNotification(
          'Logged out successfully',
          'info'
        );

        location.reload();

        return true;

      }
    );

  }
);
