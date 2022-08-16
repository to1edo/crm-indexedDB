let DB;

const abrirDB = new Promise((resolve, reject) => {
        
    const abrirDB = window.indexedDB.open('crm',1);

    abrirDB.onerror = (error)=>{
        reject(console.log('Error al abrir DB' ,error));
    }

    abrirDB.onsuccess = ()=>{
        DB = abrirDB.result;
        resolve();
    }
})


function mostrarAlerta(mensaje, tipo){

    //alerta previa
    const alertaPrevia = document.querySelector('.mensaje');
    if(alertaPrevia){
        alertaPrevia.remove();
    }

    const alerta = document.createElement('div');
    alerta.classList.add('px-3','py-4','rounded','mx-auto','text-center');

    if(tipo === 'error'){
        alerta.classList.add('bg-red-200','border-2','border-red-400','text-red-700');
    }else{ 
        alerta.classList.add('bg-green-200','border-2','border-green-400','text-green-700');
    }

    alerta.classList.add('mensaje');
    alerta.textContent = mensaje;

    formulario.insertBefore(alerta, document.querySelector('.mb-4'));

    setTimeout(() => {
        alerta.remove();
    }, 2000);
}