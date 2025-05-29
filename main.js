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