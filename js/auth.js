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
    document.getElementById(
      'loginScreen'
    );

  const roleBadge =
    document.getElementById(
      'roleBadge'
    );

  const app =
    document.getElementById(
      'app'
    );

  document.body.classList.remove(
    'login-active'
  );

  if (loginScreen) {

    loginScreen.style.display =
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

  }

  if (roleBadge) {

    roleBadge.textContent =
      role.toUpperCase();

  }

  switchView('pos');

}

async function login() {

  const username =
    document
      .getElementById(
        'loginUsername'
      )
      .value
      .trim();

  const password =
    document
      .getElementById(
        'loginPassword'
      )
      .value;

  const user =
    AUTH_USERS[username];

  if (
    !user ||
    user.password !== password
  ) {

    alert(
      'Invalid username or password'
    );

    return;

  }

  localStorage.setItem(

    'caflat_auth',

    JSON.stringify({

      username,

      role:
        user.role

    })

  );

  applyAuth(
    user.role
  );

}

function logout() {

  localStorage.removeItem(
    'caflat_auth'
  );

  location.reload();

}

function initializeAuth() {

  document.body.classList.add(
    'login-active'
  );

  const app =
    document.getElementById(
      'app'
    );

  const loginScreen =
    document.getElementById(
      'loginScreen'
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

  }

  const loginBtn =
    document.getElementById(
      'loginBtn'
    );

  if (loginBtn) {

    loginBtn.onclick =
      login;

  }

}

document.addEventListener(

  'DOMContentLoaded',

  initializeAuth

);