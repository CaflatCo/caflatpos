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

  const app =
    safeGetById(
      'app'
    );

  document.body.classList.remove(
    'login-active'
  );

  if (loginScreen) {

    loginScreen.style.display =
      'none';

    loginScreen.style.visibility =
      'hidden';

    loginScreen.style.opacity =
      '0';

    loginScreen.style.pointerEvents =
      'none';

  }

  if (app) {

    app.classList.add(
      'authenticated'
    );

    app.style.display =
      'flex';

    app.style.flexDirection =
      'column';

    app.style.visibility =
      'visible';

    app.style.opacity =
      '1';

    app.style.pointerEvents =
      'auto';

  }

  document.body.style.overflow =
    'auto';

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

  document.body.classList.add(
    'login-active'
  );

  const loginBtn =
    safeGetById(
      'loginBtn'
    );

  const loginScreen =
    safeGetById(
      'loginScreen'
    );

  const app =
    safeGetById(
      'app'
    );

  if (app) {

    app.classList.remove(
      'authenticated'
    );

    app.style.display =
      'none';

  }

  if (loginScreen) {

    loginScreen.style.display =
      'flex';

    loginScreen.style.visibility =
      'visible';

    loginScreen.style.opacity =
      '1';

    loginScreen.style.pointerEvents =
      'auto';

  }

  if (loginBtn) {

    loginBtn.addEventListener(
      'click',
      login
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