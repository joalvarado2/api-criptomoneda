const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");

const objBusqueda = {
    moneda: "",
    criptomoneda: ""
}

// crear un promise
const obtenerCriptomonedas = (criptomonedas) => new Promise((resolve) => {
    resolve(criptomonedas)
});

document.addEventListener("DOMContentLoaded", () => {
    consultarCriptomonedas();

    formulario.addEventListener("submit", submitFormulario)

    criptomonedasSelect.addEventListener("change", leerValor)
    monedaSelect.addEventListener("change", leerValor)
})

function consultarCriptomonedas() {
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(element => {
        const { FullName, Name } = element.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function submitFormulario(e) {
    e.preventDefault();

    //Validar
    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === "" || criptomoneda === "") {
        mostrarAlerta("ambos campos son obligatorios");
        return;
    }
}

function mostrarAlerta(mensaje) {
    const existeError = document.querySelector(".error")

    if (!existeError) {
        const divMensaje = document.createElement("div")
        divMensaje.classList.add("error");

        // mensaje de error
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

}