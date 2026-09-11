document.addEventListener("DOMContentLoaded", function () {

    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        const usuarioValido = "admin";
        const contrasenaValida = "1234";
        const mensajeError = document.getElementById("mensajeError");

        formLogin.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const usuario = document.getElementById("inputUsuario").value.trim();
            const contrasena = document.getElementById("inputContrasena").value.trim();

            if (usuario === usuarioValido && contrasena === contrasenaValida) {
                window.location.href = "inicio.html";
            } else {
                mensajeError.classList.remove("d-none");
            }
        });
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
