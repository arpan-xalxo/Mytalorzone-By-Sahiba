// addToCart.js

export function addToCart(userId, productId, quantity) {
    if (!userId || !productId || quantity <= 0) {
        console.error("Invalid data: User ID, Product ID, or quantity is missing or invalid.");
        return;
    }

    const payload = {
        userId: userId,
        productId: productId,
        quantity: quantity
    };

    console.log(payload);

    fetch("http://localhost:5000/cart/addtocart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Cart updated successfully:", data);
            alert("Product added to cart!");
        })
        .catch((error) => {
            console.error("Error adding product to cart:", error);
            alert("Failed to add product to cart.");
        });
}
