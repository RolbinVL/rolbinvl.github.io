// Variables y Selectores
const formulario = document.getElementById('agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');


// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
    gastosListado.addEventListener('click', eliminarGasto);
}

// Classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.saldo = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularSaldo();
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id.toString() !== id );
        this.calcularSaldo();
    }

    calcularSaldo() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.saldo = this.presupuesto - gastado;
    }
}

class UI {

    insertarPresupuesto( cantidad ) {
     document.querySelector('#total').textContent = cantidad.presupuesto;
     document.querySelector('#saldo').textContent = cantidad.presupuesto;
    }
    
    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }
        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
             document.querySelector('.primario .alert').remove();
        }, 3000);
   }

    // Inserta los gastos a la lista 
    agregarGastoListado(gastos) {

        // Limpiar HTML
        this.limpiarHTML();

        // Iterar sobre los gastos 
        gastos.forEach(gasto => {
            const {nombre, cantidad, id } = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Insertar el gasto
            nuevoGasto.innerHTML = `
                ${nombre}
                <span class="badge badge-primary badge-pill">₡ ${cantidad}</span>
            `;

            // boton borrar gasto.
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar';
            nuevoGasto.appendChild(btnBorrar);

            // Insertar al HTML
            gastosListado.appendChild(nuevoGasto);
        });
   }

     // Comprueba el saldo de presupuesto 
    actualizarSaldo(saldo) {
        document.querySelector('span#saldo').textContent = saldo; 
    }

     // Cambia de color del saldo de presupuesto
     comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, saldo} = presupuestoObj;
        const saldoDiv = document.querySelector('.saldo');

        // console.log(saldo);
        // console.log( presupuesto);

        // Comprobar el 25% 
        if( (presupuesto / 4) > saldo) {
            saldoDiv.classList.remove('alert-success', 'alert-warning');
            saldoDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > saldo) {
            saldoDiv.classList.remove('alert-success');
            saldoDiv.classList.add('alert-warning');
        } else {
            saldoDiv.classList.remove('alert-danger', 'alert-warning');
            saldoDiv.classList.add('alert-success');
        }

        // Si presupuesta es igual a 0 
        if(saldo <= 0 ) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } 
    }

    limpiarHTML() {
        while(gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
        }
    }
}

const ui = new UI();
let presupuesto;

function preguntarPresupuesto() {
    let pres = prompt('¿Cuál es tu presupuesto inicial?');
    while (pres === '' || pres === null 
           || isNaN(pres) || (Number(pres)<=0))
    {
        pres=prompt('¿Cuál es tu presupuesto inicial?');
    }   
    presupuesto = new Presupuesto(pres);
    // console.log(presupuesto);
    // Agregarlo en el HTML
    ui.insertarPresupuesto(presupuesto)
}


function agregarGasto(e) {
    e.preventDefault();

     // Leer del formulario de Gastos
     const nombre = document.querySelector('#gasto').value;
     const cantidad = Number( document.querySelector('#cantidad').value);

     // Comprobar que los campos no esten vacios
     if(nombre === '' || cantidad === '') {
          // 2 parametros: mensaje y tipo
          ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
          return;
     } else if(cantidad <= 0) {

          // si hay una cantidad negativa o letras...
          ui.imprimirAlerta('La cantidad debe ser mayor a cero', 'error')
          return;
     } else {
            const gasto = { nombre, cantidad, id: Date.now() };

            // Añadir nuevo gasto 
            presupuesto.nuevoGasto(gasto)

            // Insertar en el HTML
            ui.imprimirAlerta('Gasto agregado correctamente');

            // Pasa los gastos para que se impriman...
            const { gastos} = presupuesto;
            ui.agregarGastoListado(gastos);

            // Cambiar la clase que nos avisa si se va terminando
            ui.comprobarPresupuesto(presupuesto);

            // Actualiza el saldo de presupuesto  
            const { saldo } = presupuesto;

            // Actualizar cuanto nos queda
            ui.actualizarSaldo(saldo)

            // Reiniciar el form
            formulario.reset();
     }
}

function eliminarGasto(e) {
    if(e.target.classList.contains('borrar-gasto')){
        const {id } = e.target.parentElement.dataset;
        presupuesto.eliminarGasto(id);
        // Reembolsar
        ui.comprobarPresupuesto(presupuesto);

        // Pasar la cantidad de saldo para actualizar el DOM
        const { saldo } = presupuesto;
        ui.actualizarSaldo(saldo);

        // Eliminar del DOM
        e.target.parentElement.remove();
    } 
}