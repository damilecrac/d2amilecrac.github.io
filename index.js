const btnCart = document.querySelector('.container-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', (e) => {
    // Si se hace clic dentro del carrito (por ejemplo en el botón de borrar), no ocultarlo
    if (e.target.closest('.container-cart-products')) {
        return;
    }
    containerCartProducts.classList.toggle('hidden-cart');
});

const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-items');

// Variables de arreglos de Productos
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');
const btnVaciar = document.querySelector('.btn-vaciar-carrito');

productsList.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
        };

        const exits = allProducts.some(
            product => product.title === infoProduct.title
        );

        if (exits) {
            const products = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            allProducts = [...products];
        } else {
            allProducts = [...allProducts, infoProduct];
        }

        showHTML();
    }
});

rowProduct.addEventListener('click', e => {
    // Para borrar producto completo
    if (e.target.classList.contains('icon-close') || e.target.closest('.icon-close')) {
        const product = e.target.closest('.cart-product');
        const title = product.querySelector('.titulo-producto-carrito').textContent;

        allProducts = allProducts.filter(
            product => product.title !== title
        );

        showHTML();
    }

    // Para disminuir cantidad
    if (e.target.classList.contains('btn-minus')) {
        const product = e.target.closest('.cart-product');
        const title = product.querySelector('.titulo-producto-carrito').textContent;

        allProducts = allProducts.map(item => {
            if (item.title === title) {
                item.quantity--;
            }
            return item;
        }).filter(item => item.quantity > 0);

        showHTML();
    }

    // Para aumentar cantidad
    if (e.target.classList.contains('btn-plus')) {
        const product = e.target.closest('.cart-product');
        const title = product.querySelector('.titulo-producto-carrito').textContent;

        allProducts = allProducts.map(item => {
            if (item.title === title) {
                item.quantity++;
            }
            return item;
        });

        showHTML();
    }
});

btnVaciar.addEventListener('click', () => {
    allProducts = [];
    showHTML();
});

// Funcion para mostrar  HTML
const showHTML = () => {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.innerHTML = '';
        rowProduct.append(cartEmpty);
        cartTotal.classList.add('hidden');
        btnVaciar.classList.add('hidden');
        valorTotal.innerText = `$0`;
        countProducts.innerText = 0;
    } else {
        cartEmpty.classList.add('hidden');
        cartTotal.classList.remove('hidden');
        btnVaciar.classList.remove('hidden');
        rowProduct.innerHTML = '';
    }

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

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

        rowProduct.append(containerProduct);

        total = total + parseInt(product.quantity * product.price.slice(1));
        totalOfProducts = totalOfProducts + product.quantity;
    });

    if (allProducts.length) {
        valorTotal.innerText = `$${total}`;
        countProducts.innerText = totalOfProducts;
    }
};