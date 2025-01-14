
   // Selectors
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

// Open cart
cartIcon.onclick = () => {
    cart.classList.add("active");
};

// Close cart
closeCart.onclick = () => {
    cart.classList.remove("active");
};

// Wait until the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// Main function
function ready() {
    // Remove items from cart
    let removeCartButtons = document.getElementsByClassName('cart-remove');
    for (let button of removeCartButtons) {
        button.addEventListener('click', removeCartItem);
    }

    // Change quantity
    let quantityInputs = document.getElementsByClassName('cart-quantity');
    for (let input of quantityInputs) {
        input.addEventListener('change', quantityChanged);
    }

    // Add to cart
    let addCartButtons = document.getElementsByClassName('add-cart');
    for (let button of addCartButtons) {
        button.addEventListener('click', addCartClicked);
    }
}

// Remove cart item
function removeCartItem(event) {
    let button = event.target;
    button.parentElement.remove();
    updateTotal();
    saveCartItems();
}

// Change quantity
function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartItems();
}

// Add to cart
function addCartClicked(event) {
    let button = event.target;
    let shopProduct = button.parentElement;
    let title = shopProduct.querySelector('.product-title').innerText;
    let price = shopProduct.querySelector('.price').innerText;
    let productImg = shopProduct.querySelector('.product-img').src;

    addProductToCart(title, price, productImg);
    updateTotal();
}

// Add product to cart
function addProductToCart(title, price, productImg) {
    let cartContent = document.querySelector('.cart-content');
    let cartItems = cartContent.getElementsByClassName('cart-product-title');

    // Check if product is already in the cart
    for (let item of cartItems) {
        if (item.innerText === title) {
            alert('You have already added this item to the cart.');
            return;
        }
    }

    let cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');

    let cartBoxContent = `
        <img src="${productImg}" alt="${title}" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <label for="quantity-${title}">Quantity:</label>
            <input type="number" id="quantity-${title}" value="1" class="cart-quantity">
        </div>
        <i class='bx bx-trash cart-remove'></i>
    `;

    cartBox.innerHTML = cartBoxContent;
    cartContent.appendChild(cartBox);

    // Add event listeners to new elements
    cartBox.querySelector('.cart-remove').addEventListener('click', removeCartItem);
    cartBox.querySelector('.cart-quantity').addEventListener('change', quantityChanged);

    saveCartItems();
}

// Update total
function updateTotal() {
    let cartContent = document.querySelector('.cart-content');
    let cartBoxes = cartContent.getElementsByClassName('cart-box');
    let total = 0;

    for (let cartBox of cartBoxes) {
        let priceElement = cartBox.querySelector('.cart-price');
        let quantityElement = cartBox.querySelector('.cart-quantity');
        let price = parseFloat(priceElement.innerText.replace("$", ""));
        let quantity = parseInt(quantityElement.value);

        total += price * quantity;
    }

    total = Math.round(total * 100) / 100;
    document.querySelector('.total-price').innerText = "$" + total;

    // Save total to localStorage
    localStorage.setItem("cartTotal", total);
}

// Save cart items to localStorage
function saveCartItems() {
    let cartContent = document.querySelector('.cart-content');
    let cartBoxes = cartContent.getElementsByClassName('cart-box');
    let cartItems = [];

    for (let cartBox of cartBoxes) {
        let title = cartBox.querySelector('.cart-product-title').innerText;
        let price = cartBox.querySelector('.cart-price').innerText;
        let quantity = cartBox.querySelector('.cart-quantity').value;
        let productImg = cartBox.querySelector('.cart-img').src;

        let item = { title, price, quantity, productImg };
        cartItems.push(item);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Load cart items from localStorage
function loadCartItems() {
    let savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    for (let item of savedCartItems) {
        addProductToCart(item.title, item.price, item.productImg);
        let cartBoxes = document.getElementsByClassName('cart-box');
        let lastBox = cartBoxes[cartBoxes.length - 1];
        lastBox.querySelector('.cart-quantity').value = item.quantity;
    }
    updateTotal();
}

// Load cart items on page load
window.onload = loadCartItems;

