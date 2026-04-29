// ==========================================
// VARIABLES Y SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================

// Contenedor principal del ícono del carrito
const btnCart = document.querySelector('.container-icon');

// Contenedor de los productos dentro del menú desplegable del carrito
const containerCartProducts = document.querySelector('.container-cart-products');

// Evento para mostrar/ocultar el menú del carrito al hacer click en el ícono
btnCart.addEventListener('click', (e) => {
    // composedPath() devuelve la ruta del evento, lo que nos permite saber si el click
    // se originó dentro del contenedor del carrito, INCLUSO si el elemento clickeado
    // fue eliminado del DOM rápidamente (como pasa al darle click a borrar un producto).
    // Esto soluciona el error donde el menú se cerraba al interactuar con los productos.
    const path = e.composedPath();
    const isClickInsideCart = path.some(el => el.classList && el.classList.contains('container-cart-products'));

    if (isClickInsideCart) {
        return; // Si el click fue dentro del carrito, no hacemos nada (no ocultamos el menú)
    }

    // Si el click fue en el ícono, alternamos la clase para mostrar/ocultar el carrito
    containerCartProducts.classList.toggle('hidden-cart');
});

// ==========================================
// VARIABLES DE LOS PRODUCTOS Y EL CARRITO
// ==========================================

// Elemento individual del producto en el carrito
const cartInfo = document.querySelector('.cart-product');

// Contenedor de las filas de productos en el carrito
const rowProduct = document.querySelector('.row-product');

// Contenedor principal donde se muestra la lista de todos los productos disponibles en la tienda
const productsList = document.querySelector('.container-items');

// Arreglo que almacena los productos que el usuario ha añadido al carrito
let allProducts = [];

// Elementos de la interfaz para el total y el contador
const valorTotal = document.querySelector('.total-pagar'); // Muestra el precio total
const countProducts = document.querySelector('#contador-productos'); // Muestra la cantidad total de productos

// Elementos del estado del carrito
const cartEmpty = document.querySelector('.cart-empty'); // Mensaje de "Carrito vacío"
const cartTotal = document.querySelector('.cart-total'); // Contenedor del total
const btnVaciar = document.querySelector('.btn-vaciar-carrito'); // Botón para vaciar el carrito

// ==========================================
// LÓGICA PARA AÑADIR PRODUCTOS AL CARRITO
// ==========================================

productsList.addEventListener('click', e => {
    // Verificamos si el elemento clickeado es un botón (Añadir al carrito)
    if (e.target.tagName === 'BUTTON') {
        // Obtenemos el contenedor padre del producto para extraer su información
        const product = e.target.parentElement;

        // Creamos un objeto con la información del producto
        const infoProduct = {
            quantity: 1, // Cantidad inicial
            title: product.querySelector('h2').textContent, // Título del producto
            price: product.querySelector('p').textContent, // Precio del producto
        };

        // Verificamos si el producto ya existe en el arreglo del carrito
        const exits = allProducts.some(
            product => product.title === infoProduct.title
        );

        if (exits) {
            // Si el producto ya existe, mapeamos el arreglo y aumentamos la cantidad del producto coincidente
            const products = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            // Actualizamos el arreglo de productos
            allProducts = [...products];
        } else {
            // Si el producto no existe, lo agregamos al arreglo
            allProducts = [...allProducts, infoProduct];
        }

        // Llamamos a la función para actualizar la vista HTML del carrito
        showHTML();
    }
});

// ==========================================
// LÓGICA PARA INTERACTUAR CON PRODUCTOS DENTRO DEL CARRITO
// ==========================================

rowProduct.addEventListener('click', e => {
    // Funcionalidad para ELIMINAR el producto completo del carrito
    if (e.target.classList.contains('icon-close') || e.target.closest('.icon-close')) {
        const product = e.target.closest('.cart-product');
        const title = product.querySelector('.titulo-producto-carrito').textContent;

        // Filtramos el arreglo para quitar el producto que coincide con el título
        allProducts = allProducts.filter(
            product => product.title !== title
        );

        // Actualizamos el HTML después de borrar
        showHTML();
    }

    // Funcionalidad para DISMINUIR la cantidad de un producto
    if (e.target.classList.contains('btn-minus')) {
        const product = e.target.closest('.cart-product');
        const title = product.querySelector('.titulo-producto-carrito').textContent;

        // Disminuimos la cantidad y filtramos los que queden con cantidad mayor a 0
        allProducts = allProducts.map(item => {
            if (item.title === title) {
                item.quantity--;
            }
            return item;
        }).filter(item => item.quantity > 0);

        // Actualizamos el HTML después de disminuir la cantidad
        showHTML();
    }

    // Funcionalidad para AUMENTAR la cantidad de un producto
    if (e.target.classList.contains('btn-plus')) {
        const product = e.target.closest('.cart-product');
        const title = product.querySelector('.titulo-producto-carrito').textContent;

        // Aumentamos la cantidad del producto correspondiente
        allProducts = allProducts.map(item => {
            if (item.title === title) {
                item.quantity++;
            }
            return item;
        });

        // Actualizamos el HTML después de aumentar la cantidad
        showHTML();
    }
});

// ==========================================
// VACIAR TODO EL CARRITO
// ==========================================

btnVaciar.addEventListener('click', () => {
    // Vaciamos el arreglo de productos
    allProducts = [];
    // Actualizamos el HTML para reflejar que el carrito está vacío
    showHTML();
});

// ==========================================
// FUNCIÓN PRINCIPAL PARA RENDERIZAR EL CARRITO EN EL HTML
// ==========================================

const showHTML = () => {
    // Si el carrito está vacío, mostramos el mensaje y ocultamos elementos innecesarios
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden'); // Mostramos mensaje de vacío
        rowProduct.innerHTML = ''; // Limpiamos la lista de productos
        rowProduct.append(cartEmpty); // Añadimos el mensaje al contenedor
        cartTotal.classList.add('hidden'); // Ocultamos el total a pagar
        btnVaciar.classList.add('hidden'); // Ocultamos el botón de vaciar
        valorTotal.innerText = `$0`; // Reiniciamos el valor total
        countProducts.innerText = 0; // Reiniciamos el contador
    } else {
        // Si hay productos, ocultamos el mensaje de vacío y mostramos totales y botón
        cartEmpty.classList.add('hidden');
        cartTotal.classList.remove('hidden');
        btnVaciar.classList.remove('hidden');
        rowProduct.innerHTML = ''; // Limpiamos para volver a renderizar sin duplicados
    }

    let total = 0; // Acumulador del precio total
    let totalOfProducts = 0; // Acumulador del total de artículos

    // Recorremos cada producto en el carrito para crear su HTML
    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        // Estructura HTML de cada producto dentro del carrito
        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <div class="quantity-controls">
                    <button class="btn-minus">-</button>
                    <span class="cantidad-producto-carrito">${product.quantity}</span>
                    <button class="btn-plus">+</button>
                </div>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

        // Añadimos el producto al contenedor visual
        rowProduct.append(containerProduct);

        // Calculamos el precio total (multiplicamos cantidad por el precio sin el símbolo '$')
        total = total + parseInt(product.quantity * product.price.slice(1));
        // Calculamos la cantidad total de artículos
        totalOfProducts = totalOfProducts + product.quantity;
    });

    // Actualizamos los textos en la interfaz con los totales calculados
    if (allProducts.length) {
        valorTotal.innerText = `$${total}`;
        countProducts.innerText = totalOfProducts;
    }
};