const usuarioValido = "admin";
const contrasenaValida = "1234";

function validarCredenciales(usuario, contrasena) {
    return usuario === usuarioValido && contrasena === contrasenaValida;
}

const intentos = [
    { usuario: "admin", contrasena: "1234" },
    { usuario: "admin", contrasena: "0000" },
    { usuario: "cesar", contrasena: "1234" },
];

console.log("Probando validacion de credenciales...\n");

intentos.forEach(function (intento, indice) {
    const resultado = validarCredenciales(intento.usuario, intento.contrasena);
    const estado = resultado ? "acceso concedido" : "acceso denegado";
    console.log(`Intento ${indice + 1}: usuario="${intento.usuario}" contrasena="${intento.contrasena}" -> ${estado}`);
});

const exitosos = intentos.filter(function (intento) {
    return validarCredenciales(intento.usuario, intento.contrasena);
});

console.log(`\nTotal de intentos exitosos: ${exitosos.length} de ${intentos.length}`);
