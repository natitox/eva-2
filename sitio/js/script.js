document.addEventListener('DOMContentLoaded', function() {
    // Obtención de referencias a los elementos del DOM
    const form = document.getElementById('registroForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const direccion = document.getElementById('direccion');
    const comuna = document.getElementById('comuna');
    const telefono = document.getElementById('telefono');
    const website = document.getElementById('website');
    const nuevaAficionInput = document.getElementById('nuevaAficion');
    const btnAgregarAficion = document.getElementById('agregarAficion');
    const listaAficiones = document.getElementById('listaAficiones');

    let aficiones = [];

    btnAgregarAficion.addEventListener('click', function() {
        agregarAficion();
    });

    nuevaAficionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            agregarAficion();
        }
    });

    function agregarAficion() {
        const aficion = nuevaAficionInput.value.trim();
        if (aficion) {
            if (aficiones.includes(aficion)) {
                mostrarError('aficionesError', 'Esta afición ya está en la lista.');
                return;
            }

            aficiones.push(aficion);

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <span>${aficion}</span>
                <button type="button" class="btn-close" aria-label="Cerrar" data-aficion="${aficion}"></button>
            `;
            listaAficiones.appendChild(li);
            nuevaAficionInput.value = '';
            validarAficiones();

            li.querySelector('.btn-close').addEventListener('click', function() {
                const aficionAEliminar = this.getAttribute('data-aficion');
                aficiones = aficiones.filter(a => a !== aficionAEliminar);
                listaAficiones.removeChild(li);
                validarAficiones();
            });
        } else {
            mostrarError('aficionesError', 'La afición no puede estar vacía.');
        }
    }

    function validarAficiones() {
        if (aficiones.length < 2) {
            mostrarError('aficionesError', 'Debe ingresar al menos 2 aficiones.');
            return false;
        } else {
            limpiarError('aficionesError');
            return true;
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const esValido = validarFormulario();

        if (esValido) {
            mostrarMensajeExito('¡Formulario enviado correctamente!');
            form.reset();
            aficiones = [];
            listaAficiones.innerHTML = '';
            document.querySelectorAll('.form-control, .form-select').forEach(el => {
                el.classList.remove('is-valid', 'is-invalid');
            });
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
                el.style.display = 'none';
            });
        } else {
            console.log('El formulario contiene errores.');
        }
    });

    function validarFormulario() {
        const usernameValido = validarUsername();
        const passwordValido = validarPassword();
        const confirmPasswordValido = validarConfirmPassword();
        const direccionValida = validarDireccion();
        const comunaValida = validarComuna();
        const telefonoValido = validarTelefono();
        const websiteValido = validarWebsite();
        const aficionesValidas = validarAficiones();

        return usernameValido && passwordValido && confirmPasswordValido &&
               direccionValida && comunaValida && telefonoValido &&
               websiteValido && aficionesValidas;
    }

    function validarUsername() {
        const valor = username.value.trim();
        const regex = /^[a-zA-Z][a-zA-Z]*\d*$/;

        if (!valor) {
            mostrarError('usernameError', 'El nombre de usuario es obligatorio.');
            marcarInvalido(username);
            return false;
        } else if (valor.length < 5 || valor.length > 10) {
            mostrarError('usernameError', 'El nombre de usuario debe tener entre 5 y 10 caracteres.');
            marcarInvalido(username);
            return false;
        } else if (!regex.test(valor)) {
            mostrarError('usernameError', 'Debe comenzar con letra y puede tener dígitos solo al final.');
            marcarInvalido(username);
            return false;
        } else {
            limpiarError('usernameError');
            marcarValido(username);
            return true;
        }
    }

    function validarPassword() {
    const valor = password.value;
    const usernameValor = username.value.trim();

    if (!valor) {
        mostrarError('passwordError', 'La contraseña es obligatoria.');
        marcarInvalido(password);
        return false;
    } else if (valor.length < 3 || valor.length > 6) {
        mostrarError('passwordError', 'La contraseña debe tener entre 3 y 6 caracteres.');
        marcarInvalido(password);
        return false;
    } else if (!/\d/.test(valor) || !/[a-zA-Z]/.test(valor)) {
        mostrarError('passwordError', 'Debe contener al menos un dígito y una letra.');
        marcarInvalido(password);
        return false;
    } else if (usernameValor && valor.includes(usernameValor)) {
        mostrarError('passwordError', 'La contraseña no puede contener el nombre de usuario.');
        marcarInvalido(password);
        return false;
    } else if (valor === usernameValor) {
        mostrarError('passwordError', 'La contraseña no puede ser igual al nombre de usuario.');
        marcarInvalido(password);
        return false;
    } else {
        limpiarError('passwordError');
        marcarValido(password);
        return true;
    }
}


    function validarConfirmPassword() {
        const valor = confirmPassword.value;
        const passwordValor = password.value;

        if (!passwordValor) {
            mostrarError('confirmPasswordError', 'Primero ingrese la contraseña.');
            marcarInvalido(confirmPassword);
            return false;
        } else if (valor !== passwordValor) {
            mostrarError('confirmPasswordError', 'Las contraseñas no coinciden.');
            marcarInvalido(confirmPassword);
            return false;
        } else {
            limpiarError('confirmPasswordError');
            marcarValido(confirmPassword);
            return true;
        }
    }

    function validarDireccion() {
        const valor = direccion.value.trim();

        if (!valor) {
            mostrarError('direccionError', 'La dirección es obligatoria.');
            marcarInvalido(direccion);
            return false;
        } else {
            limpiarError('direccionError');
            marcarValido(direccion);
            return true;
        }
    }

    function validarComuna() {
        const valor = comuna.value;

        if (!valor) {
            mostrarError('comunaError', 'Debe seleccionar una comuna.');
            marcarInvalido(comuna);
            return false;
        } else {
            limpiarError('comunaError');
            marcarValido(comuna);
            return true;
        }
    }

    function validarTelefono() {
        const valor = telefono.value.trim();
        const regex = /^\+56\s*9\s*\d{8}$/;

        if (!valor) {
            mostrarError('telefonoError', 'El número de teléfono es obligatorio.');
            marcarInvalido(telefono);
            return false;
        } else if (!regex.test(valor)) {
            mostrarError('telefonoError', 'Formato inválido. Use: +569XXXXXXXX (8 dígitos).');
            marcarInvalido(telefono);
            return false;
        } else {
            limpiarError('telefonoError');
            marcarValido(telefono);
            return true;
        }
    }

    function validarWebsite() {
        const valor = website.value.trim();

        if (!valor) {
            limpiarError('websiteError');
            marcarValido(website);
            return true;
        }

        try {
            new URL(valor);
            limpiarError('websiteError');
            marcarValido(website);
            return true;
        } catch (e) {
            mostrarError('websiteError', 'URL inválida. Incluya http:// o https://.');
            marcarInvalido(website);
            return false;
        }
    }

    username.addEventListener('input', validarUsername);
    password.addEventListener('input', validarPassword);
    password.addEventListener('input', validarConfirmPassword);
    confirmPassword.addEventListener('input', validarConfirmPassword);
    direccion.addEventListener('input', validarDireccion);
    comuna.addEventListener('change', validarComuna);
    telefono.addEventListener('input', validarTelefono);
    website.addEventListener('input', validarWebsite);

    function mostrarError(id, mensaje) {
        const errorElement = document.getElementById(id);
        if (errorElement) {
            errorElement.textContent = mensaje;
            errorElement.style.display = 'block';
        }
    }

    function limpiarError(id) {
        const errorElement = document.getElementById(id);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    function marcarInvalido(elemento) {
        elemento.classList.add('is-invalid');
        elemento.classList.remove('is-valid');
    }

    function marcarValido(elemento) {
        elemento.classList.add('is-valid');
        elemento.classList.remove('is-invalid');
    }

    function mostrarMensajeExito(mensaje) {
        const contenedor = document.getElementById('mensajeExito');
        if (contenedor) {
            contenedor.textContent = mensaje;
            contenedor.style.display = 'block';
            setTimeout(() => {
                contenedor.style.display = 'none';
            }, 4000);
        }
    }
});
