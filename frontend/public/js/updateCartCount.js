export function updateCartCount() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error("User ID not available.");
         document.querySelector(".header-cart-count").textContent = "0"; // Reset count to 0
        return;
    }

     // Set a temporary loader or retain the previous count
     const cartCountElement = document.querySelector(".header-cart-count");
     cartCountElement.textContent = "...";

    fetch("http://localhost:5000/cart/get-cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success && data.cart) {
                const cartCount = data.cart.productsInCart.length; // Count the number of objects in the cart

                // Update the cart count in the UI
                const cartCountElement = document.querySelector(".header-cart-count");
                cartCountElement.textContent = cartCount;
            } else {
                console.warn("Cart not found or empty.");
                document.querySelector(".header-cart-count").textContent = "0";
            }
        })
        .catch((error) => {
            console.error("Error fetching cart:", error);
            document.querySelector(".header-cart-count").textContent = "0";
        });
}
