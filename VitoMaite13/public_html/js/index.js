document.addEventListener('DOMContentLoaded', function () {
    abrirBaseDeDatos(); // Llamar a la función para inicializar la base de datos
});

// Función para abrir o crear la base de datos
function abrirBaseDeDatos() {
    const solicitud = indexedDB.open("vitomaitebd", 1);

    // Manejar errores
    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos:", evento.target.error);
    };

    // Manejar éxito
    solicitud.onsuccess = function (evento) {
        const db = evento.target.result;
        console.log("La base de datos 'vitomaitebd' se ha abierto con éxito:", db);
    };

    // Configurar los almacenes cuando se crea o actualiza la base de datos
    solicitud.onupgradeneeded = function (evento) {
        const db = evento.target.result;
        console.log("Configurando almacenes de la base de datos...");

        // Crear almacén de Aficiones
        const aficionesStore = db.createObjectStore("Aficiones", { keyPath: "id", autoIncrement: true });
        aficionesStore.createIndex("nombre", "nombre", { unique: true });

        // Crear almacén de AficionesUsuarios
        const aficionesUsuarioStore = db.createObjectStore("AficionesUsuarios", { keyPath: "id", autoIncrement: true });
        aficionesUsuarioStore.createIndex("email", "email", { unique: false });

        // Crear almacén de Visitas
        const visitasStore = db.createObjectStore("Visitas", { keyPath: "id", autoIncrement: true });
        visitasStore.createIndex("quien", "quien", { unique: false });
        visitasStore.createIndex("aquien", "aquien", { unique: false });

        // Crear almacén de Likes
        const likesStore = db.createObjectStore("Likes", { keyPath: "id", autoIncrement: true });
        likesStore.createIndex("usuario1", "usuario1", { unique: false });
        likesStore.createIndex("usuario2", "usuario2", { unique: false });
        likesStore.createIndex("like", "like", { unique: false });

        // Crear almacén de Usuarios
        const usuariosStore = db.createObjectStore("Usuarios", { keyPath: "id", autoIncrement: true });
        usuariosStore.createIndex("email", "email", { unique: true });
        usuariosStore.createIndex("edad", "edad", { unique: false });
        usuariosStore.createIndex("genero", "genero", { unique: false });
        usuariosStore.createIndex("ciudad", "ciudad", { unique: false });

        console.log("Almacenes configurados correctamente.");
    };
}

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}
    
function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  setToggleAccessible(toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const toSlider = document.querySelector('#toSlider');
  if (Number(currentTarget.value) <= 0 ) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');
const fromInput = document.querySelector('#fromInput');
const toInput = document.querySelector('#toInput');
fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);