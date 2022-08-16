(function(){
    
    const formulario = document.querySelector('#formulario');

    window.onload = () =>{

        abrirDB.then( ()=>{
            formulario.addEventListener('submit', validarForm);
        });
    }

    function validarForm(e){
        e.preventDefault();

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if( nombre === '' || email === '' || telefono === '' || empresa ==='' ){

            mostrarAlerta('Todos los campos son obligatorios','error');
            return;
        }


        const id = Date.now();

        //crear objeto para guardar en el IndexedDB
        const datos = {
            nombre: nombre,
            email: email,
            telefono: telefono,
            empresa: empresa,
            id: id
        }
        
        //guardar en indexedDB
        crearCliente(datos);
    }

    function crearCliente(datos){
    
        const transaction = DB.transaction(['clientes'],'readwrite');
        const objectStore = transaction.objectStore('clientes');
        objectStore.add(datos);

        transaction.oncomplete = ()=>{
            // Mostrar mensaje de que todo esta bien...
            mostrarAlerta('Cliente registrado correctamente');
            formulario.reset();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }

        transaction.onerror = ()=>{
            
            mostrarAlerta('El email ya se encuetra registrado','error');
            formulario.reset();
        }
    }

})();