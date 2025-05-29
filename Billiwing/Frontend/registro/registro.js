(() => {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const messageEl = document.getElementById('message');
  const submitButton = document.getElementById('submit-button');
  const loginButton = document.getElementById('login-button');
  const switchLink = document.getElementById('switch-link');
  const switchText = document.getElementById('switch-text');
  const formTitle = document.getElementById('form-title');
  const formDesc = document.getElementById('form-desc');

  // Replace these URLs with your real API endpoints
  const API_BASE_URL = 'https://your-api-domain.com/api'; 
  const REGISTER_API = API_BASE_URL + '/register';
  const LOGIN_API = API_BASE_URL + '/login';

  // Validación de email con regex
  const isValidEmail = (email) => {
    const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return re.test(email.toLowerCase());
  };

  // Validación de password con 8 características mínimas
  const isValidPassword = (password) => {
    // Requisitos:
    // 1. Al menos 8 caracteres
    // 2. Al menos una letra mayúscula
    // 3. Al menos una letra minúscula
    // 4. Al menos un número
    // 5. Al menos un símbolo especial
    // 6. Sin espacios

    const lengthOk = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\\d/.test(password);
    const noSpaces = !(/\\s/.test(password));
    return lengthOk && hasUpper && hasLower && hasNumber && hasSymbol && noSpaces;
  };

  // Mostrar mensaje feedback
  const showMessage = (text, type = 'error') => {
    messageEl.textContent = text;
    messageEl.className = type;
  };

  // Función para llamar al API de registro
  const registerUser = async (userData) => {
    try {
      const response = await fetch(REGISTER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        let errMsg = 'Error en el registro';
        try {
          const errorData = await response.json();
          if (errorData.message) errMsg = errorData.message;
        } catch { }
        return { success: false, message: errMsg };
      }
      const data = await response.json();
      return { success: true, message: data.message || 'Registro exitoso' };
    } catch (error) {
      return { success: false, message: 'No se pudo conectar con el servidor' };
    }
  };

  // Función para llamar al API de login
  const loginUser = async (credentials) => {
    try {
      const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        let errMsg = 'Error en el inicio de sesión';
        try {
          const errorData = await response.json();
          if (errorData.message) errMsg = errorData.message;
        } catch { }
        return { success: false, message: errMsg };
      }
      const data = await response.json();
      // Here you might want to save a token or user data for session management
      return { success: true, message: data.message || 'Inicio de sesión exitoso' };
    } catch (error) {
      return { success: false, message: 'No se pudo conectar con el servidor' };
    }
  };

  // Cambiar entre formulario registro y login
  const showRegisterForm = () => {
    registerForm.style.display = '';
    loginForm.style.display = 'none';
    submitButton.disabled = false;
    submitButton.textContent = 'Registrarse';
    formTitle.textContent = 'Registro';
    formDesc.textContent = 'Crea una cuenta para acceder a nuestros servicios.';
    switchText.innerHTML = '¿Ya tienes una cuenta? <a href="#" id="switch-link">Iniciar sesión</a>';
  };

  const showLoginForm = () => {
    registerForm.style.display = 'none';
    loginForm.style.display = '';
    loginButton.disabled = false;
    loginButton.textContent = 'Iniciar sesión';
    formTitle.textContent = 'Iniciar sesión';
    formDesc.textContent = 'Ingresa con tus credenciales para acceder.';
    switchText.innerHTML = '¿No tienes cuenta? <a href="#" id="switch-link">Regístrate</a>';
  };

  let currentForm = 'register'; // Estado actual

  // Evento para cambiar formulario
  switchText.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      showMessage('', '');
      if (currentForm === 'register') {
        showLoginForm();
        currentForm = 'login';
      } else {
        showRegisterForm();
        currentForm = 'register';
      }
    }
  });

  // Validación y envío registro
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('', '');
    submitButton.disabled = true;
    submitButton.textContent = 'Registrando...';

    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const confirm = registerForm['confirm-password'].value;

    if (name.length < 3) {
      showMessage('El nombre debe tener al menos 3 caracteres.');
      submitButton.disabled = false;
      submitButton.textContent = 'Registrarse';
      return;
    }
    if (!isValidEmail(email)) {
      showMessage('El correo no es válido.');
      submitButton.disabled = false;
      submitButton.textContent = 'Registrarse';
      return;
    }
    if (!isValidPassword(password)) {
      showMessage('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos, y no tener espacios.');
      submitButton.disabled = false;
      submitButton.textContent = 'Registrarse';
      return;
    }
    if (password !== confirm) {
      showMessage('Las contraseñas no coinciden.');
      submitButton.disabled = false;
      submitButton.textContent = 'Registrarse';
      return;
    }

    const result = await registerUser({ name, email, password });

    if (result.success) {
      showMessage(result.message, 'success');
      registerForm.reset();
      // Cambiar a login automático tras 2 segundos
      setTimeout(() => {
        showMessage('', '');
        showLoginForm();
        currentForm = 'login';
      }, 2000);
    } else {
      showMessage(result.message, 'error');
    }
    submitButton.disabled = false;
    submitButton.textContent = 'Registrarse';
  });

  // Validación y envío login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('', '');
    loginButton.disabled = true;
    loginButton.textContent = 'Verificando...';

    const email = loginForm['login-email'].value.trim();
    const password = loginForm['login-password'].value;

    if (!isValidEmail(email)) {
      showMessage('El correo no es válido.');
      loginButton.disabled = false;
      loginButton.textContent = 'Iniciar sesión';
      return;
    }
    if (password.length === 0) {
      showMessage('Ingrese su contraseña.');
      loginButton.disabled = false;
      loginButton.textContent = 'Iniciar sesión';
      return;
    }

    const result = await loginUser({ email, password });

    if (result.success) {
      showMessage(result.message, 'success');
      loginForm.reset();
      // Aquí podrías redirigir a otra página o cambiar la UI para usuario logueado
    } else {
      showMessage(result.message, 'error');
    }
    loginButton.disabled = false;
    loginButton.textContent = 'Iniciar sesión';
  });

  // Mostrar formulario registro al cargar
  showRegisterForm();
})();

