//Se le asigna a la url el valor del link de la api
URL = "https://dragonball-api.com/api/characters";

//Solicitud fetch
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
const botonLimpiar = document.querySelector('#boton-limpiar')
const imputNombre = document.querySelector('#input-nombre-pj');

//Para saber cuantos personajes estan mostrados y cuantos faltan
const contenedorPadre = document.querySelector('#contenedor-datos');

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

//Funcion para mostrar los primeros 10 en la pagina
async function initCharacters() {
  try {
    isLoading = true;
    const datos = await cargarDatos(URL);
    allCharacters = datos.items;

    contenedorPadre.innerHTML = "";

    allCharacters.slice(0, 10).forEach((personaje) => {
      contenedorPadre.innerHTML += `
        <div class="col-3 pb-2 d-flex justify-content-center" data-id=${personaje.id}>
          <div class="card">
            <img class="card-img-top" src=${personaje.image} />
            <div class="card-body">
              <h5 class="card-title">${personaje.name}</h5>
              <p class="card-text">${personaje.race} - ${personaje.gender}</p>
              <button class="btn btn-success btn-ver-detalles">Ver más</button>
            </div>
          </div>
        </div>
      `;
    });

  } catch (e) {
    console.error(e);
  } finally {
    isLoading = false;
  }
}




//Funcion para traer los detalles de los personajes
const detalles = async (id) => {
  try {
    const response = await fetch(`https://dragonball-api.com/api/characters/${id}`);
    if (!response.ok) throw new Error("Error en la API");

    const personaje = await response.json();

    // Borrá cualquier modal anterior
    const modalAnterior = document.getElementById('modal-personaje');
    if (modalAnterior) {
      modalAnterior.remove();
    }

    //Se crea el modal con Bootstrap directamente en el JS
    const modalHTML = `
      <div class="modal fade" id="modal-personaje" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">${personaje.name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-4">
                  <img src="${personaje.image}" alt="${personaje.name}" class="img-fluid rounded">
                </div>
                <div class="col-md-8">
                  <p><strong>Raza:</strong> ${personaje.race}</p>
                  <p><strong>Género:</strong> ${personaje.gender}</p>
                  <p><strong>Ki:</strong> ${personaje.ki}</p>
                  <p><strong>Descripción:</strong> ${personaje.description || "Sin descripción"}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insertar modal en el body
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Inicializar y mostrar modal con Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('modal-personaje'));
    modal.show();

  } catch (error) {
    console.error(error);
  }
};


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

  //Se crean las cards con los datos de cada personaje
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
    const cardPadre = e.target.closest(".col-3");
    const id = cardPadre.dataset.id;

    detalles(id);
  }
});


window.addEventListener("DOMContentLoaded", () => {
  initCharacters();
});


//Funcion de limpiar los resultados de la busqueda
botonLimpiar.addEventListener("click", async () => {
  imputNombre.value = "";
  contenedorPadre.innerHTML = "";
  nextIndex = 0;
  await initCharacters();
});






