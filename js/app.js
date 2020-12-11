// API https://min-api.cryptocompare.com/documentation

const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

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

    // consultar la API con los resultados
    consultarAPI();
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

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( cotizacion => {
           mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion) {

    limpiezaHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement("p");
    precio.classList.add("precio")
    precio.innerHTML = `el precio es: <span>${PRICE}</span> `

    const precioAlto = document.createElement("p");
    precioAlto.innerHTML = `precio más alto del día <span>${HIGHDAY}</span>`
    
    const precioBajo = document.createElement("p");
    precioBajo.innerHTML = `precio más bajo del día <span>${LOWDAY}</span>`
    
    const ultimasHoras = document.createElement("p");
    ultimasHoras.innerHTML = `variación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`
    
    const ultimaActualizacion = document.createElement("p");
    ultimaActualizacion.innerHTML = `última actualización <span>${LASTUPDATE}</span>`
   
   
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiezaHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner() {
    limpiezaHTML();

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
`;

resultado.appendChild(spinner);
}