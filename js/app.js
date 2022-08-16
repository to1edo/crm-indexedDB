(function(){
    
    const contenedorClientes = document.querySelector('#listado-clientes');
    contenedorClientes.addEventListener('click',eliminarCliente);

    window.onload = () =>{

        crearDB();
    }


    function crearDB(){

        const crearDB = window.indexedDB.open('crm',1);

        crearDB.onerror = (error)=>{
            console.log('Error al crear DB' ,error);
        }

        crearDB.onsuccess = ()=>{
            DB = crearDB.result;
            mostrarClientes();
        }

        crearDB.onupgradeneeded = (e)=>{
            const db = e.target.result;

            const objectStore = db.createObjectStore('clientes', { keyPath: 'id'});

            objectStore.createIndex('nombre','nombre',{ unique: false });
            objectStore.createIndex('email','email',{ unique: true });
            objectStore.createIndex('telefono','telefono',{ unique: false });
            objectStore.createIndex('empresa','empresa',{ unique: false });
            objectStore.createIndex('id','id',{ unique: true });

            console.log('DB creada!!!');

        }

    }


    function mostrarClientes(){

        contenedorClientes.innerHTML = '';

        const transaction = DB.transaction(['clientes'],'readonly');
        const objectStore = transaction.objectStore('clientes');
        const conexion = objectStore.openCursor();

        const total = objectStore.count();

        //si no hay ningun registro mostrar el mensaje
        total.onsuccess = ()=>{
            if(total.result === 0){
                contenedorClientes.innerHTML = `<p class=" text-center font-bold text-gray-700"> No hay clientes registrados aun</p>`;
                return;
            }
        }

        //Escuchar el evento onsuccess del método openCursor()
        conexion.onsuccess = (e) =>{
            
            //Obtener el cursor de la colección
            const cursor = e.target.result;

            if(cursor){

                const {nombre, email, telefono, empresa, id} = cursor.value;

                contenedorClientes.innerHTML += ` <tr>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                        <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                        <p class="text-gray-700">${telefono}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                        <p class="text-gray-600">${empresa}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                        <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                        <a href="#" data-cliente="${id}" class=" eliminar text-red-600 hover:text-red-900">Eliminar</a>
                    </td>
                </tr>
                `;

                cursor.continue();
            }
        }
    }

    function eliminarCliente(e){


        if(e.target.classList.contains('eliminar')){

            const id = Number(e.target.getAttribute('data-cliente'));
            
            const confirmar = confirm('Deseas eliminar este cliente?');

            if(confirmar){
                //eliminar del indexedDB
                const transaction = DB.transaction(['clientes'],'readwrite');
                const objectStore = transaction.objectStore('clientes');
                objectStore.delete(id);

                transaction.onerror = (error)=>{
                    console.log('No se pudo eliminar',error);
                }

                transaction.oncomplete = ()=>{
                    e.target.parentElement.parentElement.remove();
                };
            }
        }
        
    }

})();