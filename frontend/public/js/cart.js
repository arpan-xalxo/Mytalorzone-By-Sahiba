document.addEventListener("DOMContentLoaded", () => {
    updateCartTotals();  
    displayCartProduct();
      
});



function getCartFromBackend(userId) {
    
    return fetch("http://localhost:5000/cart/get-cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.cart) {
          
            return data.cart.productsInCart; 

        } else {
            console.warn("Cart not found or empty.");
            return [];
        }
    })
    .catch(error => {
        console.error("Error fetching cart:", error);
        return [];
    });
}

function getProductById(id) {
    

    return fetch("/data.json")
        .then(response => response.json())
        .then(products => {
         
            const product = products.find((product) => product.id === parseInt(id, 10)); // Match by 'id'
           
            return product;
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            return null;
        });
}




// Display cart items after fetching from backend

function displayCartProduct() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error("User ID not available.");
        return;
    }

    getCartFromBackend(userId).then(cartItems => {
        const cartProduct = document.getElementById("cart-product");

        const productPromises = cartItems.map(item =>
            getProductById(item.productId).then(product => {
                const quantity = item.quantity || 1; 
                if (product) {
                    return `
                    <tr class="cart-item">
                        <td></td>
                        <td class="cart-image">
                            <img src="${product.img.singleImage}" alt="" data-id="${item.productId}" class="cart-product-image">
                            <i class="bi bi-x delete-cart" data-id="${item.productId}"></i>
                        </td>
                        <td>${product.name}</td>
                        <td>$${product.price.newPrice.toFixed(2)}</td>
                        <td>${quantity}</td>
                        <td>$${product.price.newPrice.toFixed(2)}</td>
                    </tr>
                    `;
                } else {
                    console.warn(`Product with ID ${item.productId} not found.`);
                    return "";
                }
            })
        );

        
        Promise.all(productPromises).then(results => {
            cartProduct.innerHTML = results.join("");
            removeCartItem(); 
        }).catch(error => {
            console.error("Error fetching cart products:", error);
        });
    }).catch(error => {
        console.error("Error fetching cart from backend:", error);
    });
}


displayCartProduct();


function cartProductRoute() {
    const images = document.querySelectorAll(".cart-product-image")
    images.forEach((image) => {
        image.addEventListener("click", (e) => {
            const imageId = e.target.dataset.id
            localStorage.setItem("productId", Number(imageId))
            window.location.href = "single-product.html"
        })
    })
}

cartProductRoute()






function updateCartTotals() {
    const userId = localStorage.getItem('userId');
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("cart-total");
    const fastCargoCheckbox = document.getElementById("fast-cargo");

    // If userId is not available, set totals to 0 and log a warning
    if (!userId) {
        console.warn("User ID not available. Displaying totals as 0.");
        subtotalElement.textContent = `$0.00`;
        totalElement.textContent = `$0.00`;
        return;
    }

    getCartFromBackend(userId).then(cartItems => {
        console.log("Cart Items:", cartItems);

        const productPromises = cartItems.map(item =>
            getProductById(item.productId).then(product => {
                if (!item.quantity) {
                    console.warn(`Missing quantity for productId: ${item.productId}`);
                }
                if (product) {
                    console.log(`Product Found for ID ${item.productId}:`, product);
                    if (!product.price || product.price.newPrice === undefined) {
                        console.error(`Product price missing for ID ${item.productId}:`, product);
                        return 0; 
                    }
                    return product.price.newPrice * (item.quantity || 1); 
                } else {
                    console.warn(`Product not found for ID: ${item.productId}`);
                    return 0;
                }
            })
        );

        Promise.all(productPromises).then(prices => {
            console.log("Individual Product Prices:", prices); 
            const subtotal = prices.reduce((sum, price) => sum + price, 0);

            console.log("Calculated Subtotal:", subtotal); 

            const shippingCost = fastCargoCheckbox && fastCargoCheckbox.checked ? 15.00 : 0.00;

            console.log("Shipping Cost:", shippingCost); 
            const total = subtotal + shippingCost;

            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            totalElement.textContent = `$${total.toFixed(2)}`;

            console.log("Updated Subtotal Element:", subtotalElement.textContent); 
            console.log("Updated Total Element:", totalElement.textContent); 
        }).catch(error => {
            console.error("Error calculating prices:", error); 
        });
    }).catch(error => {
        console.error("Error fetching cart from backend:", error); 
    });
}



function removeCartItem() {
    const btnDeleteCart = document.querySelectorAll(".delete-cart");
    const cartItem = document.querySelector(".header-cart-count");

    btnDeleteCart.forEach((button) => {
        button.addEventListener("click", (e) => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert("User not logged in.");
                return;
            }

            const productId = e.target.dataset.id;

            // Remove item from backend
            fetch("http://localhost:5000/cart/delete-items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, productId }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === 'Item deleted successfully.') {
                        alert("Item removed successfully.");

                        // Fetch updated cart from backend
                        fetch("http://localhost:5000/cart/get-cart", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ userId }),
                        })
                            .then((res) => res.json())
                            .then((cartData) => {
                                if (cartData.success && cartData.cart) {
                                    const updatedCart = cartData.cart.productsInCart;

                                    // Update UI
                                    displayCartProduct(updatedCart);

                                    // Update cart count
                                    cartItem.textContent = updatedCart.length;

                                    // Update localStorage
                                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                                } else {
                                    console.error("Failed to fetch updated cart:", cartData.message);
                                }
                            })
                            .catch((error) => {
                                console.error("Error fetching updated cart:", error);
                            });
                    } else {
                        console.error("Error removing item:", data.message);
                        alert("Failed to remove item.");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("An error occurred while removing the item.");
                });
        });
    });
}



