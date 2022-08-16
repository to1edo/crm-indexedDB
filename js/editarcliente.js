(function(){

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const parametrosUrl = new URLSearchParams(window.location.search);
    let ID = parametrosUrl.get('id');


    
    abrirDB.then( ()=> obtenerCliente());


    function obtenerCliente(){
        const transaction = DB.transaction(['clientes'],'readonly');
        const objectStore = transaction.objectStore('clientes');
        const conexion = objectStore.openCursor();

        //Escuchar el evento onsuccess del método openCursor()
        conexion.onsuccess = (e) =>{
            
            //Obtener el cursor de la colección
            const cursor = e.target.result;

            if(cursor){

                if(cursor.value.id == ID){
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }
    
    

    function llenarFormulario(cliente){

        nombreInput.value = cliente.nombre;
        emailInput.value = cliente.email;
        telefonoInput.value = cliente.telefono;
        empresaInput.value = cliente.empresa;
        
    }
    
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', validarForm);

    function validarForm(e){
        e.preventDefault();

        if( nombre.value === '' || email.value === '' || telefono.value === '' || empresa.value ==='' ){

            mostrarAlerta('Todos los campos son obligatorios','error');
            return;
        }

        //crear objeto para guardar en el IndexedDB
        const datos = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(ID)
        }
        
        //guardar en indexedDB
        editarCliente(datos);
    }

    function editarCliente(datos){

        const transaction = DB.transaction(['clientes'],'readwrite');
        const objectStore = transaction.objectStore('clientes');
        objectStore.put(datos);

        transaction.oncomplete = ()=>{
            // Mostrar mensaje de que todo esta bien...
            mostrarAlerta('Cliente editado correctamente');
        }

        transaction.onerror = ()=>{
            mostrarAlerta('El email ya se encuetra registrado','error');
        }
        
        formulario.reset();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

})();