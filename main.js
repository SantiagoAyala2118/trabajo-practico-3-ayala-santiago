URL = "https://dragonball-api.com/api/characters";

fetch("https://dragonball-api.com/api/characters")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error en la API");
    }
    return response.json();
  })
  .then((data) => console.log(data.items))
  .catch((error) => console.log(error));

const botonBuscar = document.querySelector('#boton-buscar');
const imputNombre = document.querySelector('#input-nombre-pj');

//Para saber cuantos personajes estan mostrados y cuantos faltan
const contenedorPadre = document.querySelector('#contenedor-datos');

let allCharacters = [];   // Acá vamos a guardar todos los personajes
let nextIndex = 0;        // Desde qué índice mostrar la próxima tanda
const chunkSize = 10;     // Cuántos personajes mostrar cada vez
let isLoading = false;    // Sirve para que no se repita la carga

//Funcion para cargar los datos de la URL de la solicitud de fetch
const cargarDatos = async (URL) => {
  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Error en la API");
    }

    const datos = await response.json();

    return datos;
  } catch (error) {
    console.log(error);
  }
};

//Funcion para traer todos los personajes, pero mostrar solamente los primeros 10 en la pagina
async function initCharacters() {
  try {
    isLoading = true;
    const datos = await cargarDatos(URL);
    allCharacters = datos.items;  // Guardamos todos los personajes en una sola vez
    renderNextChunk();            // Mostramos los primeros 10
  } catch (e) {
    console.error(e);
  } finally {
    isLoading = false;
  }
}

//Funcion para que al momento de ir bajando, muestre de a diez personajes
function renderNextChunk() {
  if (nextIndex >= allCharacters.length) return;

  const slice = allCharacters.slice(nextIndex, nextIndex + chunkSize);

  slice.forEach(personaje => {
    contenedorPadre.innerHTML += `
      <div class="col-3 pb-2 d-flex justify-content-center" data-id="${personaje.id}">
        <div class="card">
          <img class="card-img-top" src="${personaje.image}" />
          <div class="card-body">
            <h5 class="card-title">${personaje.name}</h5>
            <p class="card-text">${personaje.race} - ${personaje.gender}</p>
            <button class="btn btn-success btn-ver-detalles">Ver más</button>
          </div>
        </div>
      </div>
    `;
  });

  nextIndex += chunkSize;
}


//Funcion para traer los detalles de los personajes
const detalles = async (id) => {
  try {
    const response = await fetch(`https://dragonball-api.com/api/characters/${id}`);
    if (!response.ok) throw new Error("Ocurrió un error descargando los datos");

    const datosDetalles = await response.json();

    const contenedorDetalles = document.getElementById("contenedor-detalles");

    contenedorDetalles.innerHTML = `
      <div class="card mb-3 mx-auto" style="max-width: 540px;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${datosDetalles.image}" class="img-fluid rounded-start" alt="${datosDetalles.name}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${datosDetalles.name}</h5>
              <p class="card-text"><strong>Raza:</strong> ${datosDetalles.race}</p>
              <p class="card-text"><strong>Género:</strong> ${datosDetalles.gender}</p>
              <p class="card-text"><strong>Ki:</strong> ${datosDetalles.ki}</p>
              <p class="card-text"><strong>Descripción:</strong> ${datosDetalles.description || "Sin descripción"}</p>
              <button class="btn btn-danger" id="cerrar-detalles">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Agrega funcionalidad al botón "Cerrar"
    document.getElementById("cerrar-detalles").addEventListener("click", () => {
      contenedorDetalles.innerHTML = "";
    });

  } catch (error) {
    console.log(error);
  }
}

//Evita que se reinicie la pagina al tocar 'Buscar'
botonBuscar.addEventListener("click", async (c) => {
  c.preventDefault();
  const nombreBuscado = imputNombre.value.toLowerCase();

  const datos = await cargarDatos(URL);
  const datosPersonajes = datos.items;

  //Filtracion de los datos para buscar personajes por el nombre
  const resultadosFiltrados = datosPersonajes.filter(personaje =>
    personaje.name.toLowerCase().includes(nombreBuscado)
  );

  if (resultadosFiltrados.length === 0) {
    contenedorPadre.innerHTML = `
    <div class='text-center w-100'>
    <img class='img-fluid' style='max-width: 200px' src='https://i.pinimg.com/originals/1b/e3/9b/1be39b1ef6aa857e481d57af735bcc91.png' >
    <p class='text-center''>No se encontraron personajes.</p>;
    </div>
    `
    return;

  }
  console.log(resultadosFiltrados);

  contenedorPadre.innerHTML = "";
  resultadosFiltrados.forEach((personaje) => {

    contenedorPadre.innerHTML += `
      <div class="col-3 pb-2 d-flex justify-content-center" data-id=${personaje.id}>
            <div class="card">
              <img
                class="card-img-top"
                src=${personaje.image}
              />
              <div class="card-body">
                <h5 class="card-title">${personaje.name}</h5>
                <p class="card-text">${personaje.race} - ${personaje.gender}</p>
                <button class="btn btn-success btn-ver-detalles">Ver más</button>
              </div>
            </div>
          </div>
      `
  })
})

contenedorPadre.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-ver-detalles")) {
    // accediendo al padre mas cercano
    const cardPadre = e.target.closest(".col-3");
    const id = cardPadre.dataset.id;

    detalles(id);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  initCharacters();
});


//Funcion para que cuando vaya bajando el usuario, la pagina cargue lentamente los demás personajes
window.addEventListener('scroll', () => {
  const { scrollY, innerHeight } = window;
  const { scrollHeight } = document.documentElement;


  if (scrollY + innerHeight >= scrollHeight - 200 && !isLoading) {
    isLoading = true;
    setTimeout(() => {
      renderNextChunk();
      isLoading = false;
    }, 300);
  }
});
