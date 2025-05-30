URL="https://dragonball-api.com/api/characters";

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
   const contenedorPadre = document.querySelector('#contenedor-datos');
   const imputNombre = document.querySelector('#input-nombre-pj');

   const cargarDatos = async (URL) => {
    try {
      const response = await fetch(URL);

      if(!response.ok){
        throw new Error("Error en la API");
      }

      const datos = await response.json();

      return datos;
    }catch (error) {
      console.log(error);
    }
   };

   const detalles = async (id) => {
    try {
      const response = await fetch(`URL${id}`);
    

      if (!response.ok){
        throw new error("Error en la API");
      }

      const data = await response.json();

    }catch(error) {
      console.log(error);
    }
   };


   botonBuscar.addEventListener("click", async (c) => {
    c.preventDefault();
    const nombreBuscado = imputNombre.value.toLowerCase();

    const datos = await cargarDatos (URL);
    const datosPersonajes = datos.items;

    const resultadosFiltrados = datosPersonajes.filter(personaje => 
      personaje.name.toLowerCase().includes(nombreBuscado)
    );
    
    if (resultadosFiltrados.length === 0) {
  contenedorPadre.innerHTML = "<p class='text-center'>No se encontraron personajes.</p>";
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

window.addEventListener("DOMContentLoaded", async () => {
  const datos = await cargarDatos(URL);
  mostrarPersonajes(datos.items);
});