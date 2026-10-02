const API = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", function () {

    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        const mensajeError = document.getElementById("mensajeError");

        formLogin.addEventListener("submit", async function (evento) {
            evento.preventDefault();

            const usuario = document.getElementById("inputUsuario").value.trim();
            const contrasena = document.getElementById("inputContrasena").value.trim();

            try {
                const respuesta = await fetch(API + "/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: usuario, password: contrasena })
                });
                const datos = await respuesta.json();

                if (datos.login) {
                    sessionStorage.setItem("usuario", JSON.stringify(datos.user));
                    window.location.href = "inicio.html";
                } else {
                    mensajeError.textContent = "Usuario o contrasena incorrectos.";
                    mensajeError.classList.remove("d-none");
                }
            } catch (error) {
                mensajeError.textContent = "No se pudo conectar con el servidor.";
                mensajeError.classList.remove("d-none");
            }
        });
    }

    const tablaUsuarios = document.getElementById("tablaUsuarios");
    if (tablaUsuarios) {
        const usuarioActual = JSON.parse(sessionStorage.getItem("usuario"));
        if (!usuarioActual) {
            window.location.href = "index.html";
            return;
        }

        document.getElementById("textoBienvenida").textContent = "Hola " + usuarioActual.name + ", aqui puedes ver y administrar los usuarios.";

        document.getElementById("btnCerrarSesion").addEventListener("click", function () {
            sessionStorage.removeItem("usuario");
        });

        const formUsuario = document.getElementById("formUsuario");
        const tituloForm = document.getElementById("tituloFormUsuario");
        const btnCancelar = document.getElementById("btnCancelar");
        const mensaje = document.getElementById("mensajeUsuarios");
        let idEditando = null;

        function mostrarMensaje(texto, esError) {
            mensaje.textContent = texto;
            mensaje.className = esError ? "mt-3 mb-0 text-danger" : "mt-3 mb-0 text-success";
        }

        function limpiarForm() {
            formUsuario.reset();
            idEditando = null;
            tituloForm.textContent = "Agregar usuario";
            btnCancelar.classList.add("d-none");
        }

        async function cargarUsuarios() {
            try {
                const respuesta = await fetch(API + "/users");
                const usuarios = await respuesta.json();
                tablaUsuarios.innerHTML = "";

                usuarios.forEach(function (u) {
                    const fila = document.createElement("tr");
                    fila.innerHTML =
                        "<td>" + u.id + "</td>" +
                        "<td>" + u.name + "</td>" +
                        "<td>" + u.age + "</td>" +
                        "<td>" + u.points + "</td>" +
                        "<td>" + u.username + "</td>" +
                        "<td class='text-end'>" +
                        "<button class='btn btn-sm btn-outline-primary me-1'>Editar</button>" +
                        "<button class='btn btn-sm btn-outline-danger'>Borrar</button>" +
                        "</td>";

                    const botones = fila.querySelectorAll("button");
                    botones[0].addEventListener("click", function () { editarUsuario(u); });
                    botones[1].addEventListener("click", function () { borrarUsuario(u.id); });

                    tablaUsuarios.appendChild(fila);
                });
            } catch (error) {
                mostrarMensaje("No se pudieron cargar los usuarios.", true);
            }
        }

        function editarUsuario(u) {
            idEditando = u.id;
            document.getElementById("userName").value = u.name;
            document.getElementById("userAge").value = u.age;
            document.getElementById("userPoints").value = u.points;
            document.getElementById("userUsername").value = u.username;
            document.getElementById("userPassword").value = "";
            tituloForm.textContent = "Editar usuario " + u.id;
            btnCancelar.classList.remove("d-none");
        }

        async function borrarUsuario(id) {
            if (!confirm("Seguro que quieres borrar el usuario " + id + "?")) return;

            const respuesta = await fetch(API + "/users/" + id, { method: "DELETE" });
            const datos = await respuesta.json();
            mostrarMensaje(datos.mensaje, !respuesta.ok);
            if (idEditando === id) limpiarForm();
            cargarUsuarios();
        }

        formUsuario.addEventListener("submit", async function (evento) {
            evento.preventDefault();

            const usuario = {
                name: document.getElementById("userName").value.trim(),
                age: Number(document.getElementById("userAge").value),
                points: Number(document.getElementById("userPoints").value),
                username: document.getElementById("userUsername").value.trim(),
                password: document.getElementById("userPassword").value
            };

            const url = idEditando ? API + "/users/" + idEditando : API + "/users";
            const metodo = idEditando ? "PUT" : "POST";

            try {
                const respuesta = await fetch(url, {
                    method: metodo,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(usuario)
                });
                const datos = await respuesta.json();
                mostrarMensaje(datos.mensaje, !respuesta.ok);
                if (respuesta.ok) limpiarForm();
                cargarUsuarios();
            } catch (error) {
                mostrarMensaje("No se pudo conectar con el servidor.", true);
            }
        });

        btnCancelar.addEventListener("click", limpiarForm);

        cargarUsuarios();
    }

    const btnMasInfo = document.getElementById("btnMasInfo");
    if (btnMasInfo) {
        const infoExtra = document.getElementById("infoExtra");

        btnMasInfo.addEventListener("click", function () {
            infoExtra.classList.toggle("d-none");
            btnMasInfo.textContent = infoExtra.classList.contains("d-none")
                ? "Mostrar mas informacion"
                : "Ocultar informacion";
        });
    }

    const btnTema = document.getElementById("btnTema");
    if (btnTema) {
        btnTema.addEventListener("click", function () {
            document.body.classList.toggle("bg-dark");
            document.body.classList.toggle("text-light");
        });
    }

    const radiosContacto = document.querySelectorAll('input[name="metodoContacto"]');
    const campoEmail = document.getElementById("campoEmail");
    const campoTelefono = document.getElementById("campoTelefono");
    const btnContinuar = document.getElementById("btnContinuar");

    if (radiosContacto.length > 0) {
        radiosContacto.forEach(function (radio) {
            radio.addEventListener("change", function () {
                campoEmail.classList.add("d-none");
                campoTelefono.classList.add("d-none");

                if (radio.value === "email") {
                    campoEmail.classList.remove("d-none");
                } else if (radio.value === "telefono") {
                    campoTelefono.classList.remove("d-none");
                }

                btnContinuar.disabled = false;
            });
        });
    }

    const selectPais = document.getElementById("selectPais");
    const selectRegion = document.getElementById("selectRegion");

    if (selectPais) {
        fetch("https://cdn.jsdelivr.net/npm/country-region-data/data.json")
            .then(function (respuesta) {
                return respuesta.json();
            })
            .then(function (paises) {
                paises.forEach(function (pais) {
                    const opcion = document.createElement("option");
                    opcion.value = pais.countryShortCode;
                    opcion.textContent = pais.countryName;
                    selectPais.appendChild(opcion);
                });

                selectPais.addEventListener("change", function () {
                    const paisSeleccionado = paises.find(function (pais) {
                        return pais.countryShortCode === selectPais.value;
                    });

                    selectRegion.innerHTML = '<option value="">Selecciona una region</option>';

                    if (paisSeleccionado && paisSeleccionado.regions.length > 0) {
                        paisSeleccionado.regions.forEach(function (region) {
                            const opcionRegion = document.createElement("option");
                            opcionRegion.value = region.shortCode;
                            opcionRegion.textContent = region.name;
                            selectRegion.appendChild(opcionRegion);
                        });
                        selectRegion.disabled = false;
                    } else {
                        selectRegion.disabled = true;
                    }
                });
            })
            .catch(function (error) {
                console.error("No se pudo cargar el listado de paises:", error);
            });
    }

    const chkTerminos = document.getElementById("chkTerminos");
    const chkDatos = document.getElementById("chkDatos");
    const btnEnviar = document.getElementById("btnEnviar");

    if (chkTerminos && chkDatos) {
        function revisarCheckboxes() {
            btnEnviar.disabled = !(chkTerminos.checked && chkDatos.checked);
        }

        chkTerminos.addEventListener("change", revisarCheckboxes);
        chkDatos.addEventListener("change", revisarCheckboxes);
    }
});
