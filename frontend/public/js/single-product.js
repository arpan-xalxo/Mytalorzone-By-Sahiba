import { product3 } from "./glide.js"
import { thumbsActiveFunc } from "./single-product/thumbsActive.js"
import zoomFunc from "./single-product/zoom.js"
import colorsFunc from "./single-product/colors.js"
import valuesFunc from "./single-product/values.js"
import tabsFunc from "./single-product/tabs.js"
import commentsfunc from "./single-product/comments.js"
import { addToCart } from "./addToCart.js";
import { updateCartCount } from "./updateCartCount.js";

// Get product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId"); // Get the ID as a string

if (!productId) {
    console.error("Product ID not found in URL");
} else {
    console.log("Product ID:", productId); // Debugging output
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded. Updating cart count...");
    updateCartCount();
});



fetch("/data.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((products) => {
        // Compare productId (string) with product.productId (string)
        const findProduct = products.find((product) => product.productId === productId);

        if (!findProduct) {
            console.error("Product not found for the given ID");
            return;
        }

        console.log("Product found:", findProduct);

        // Update UI with product details (example)
        const singleImage = document.getElementById("single-image");
        singleImage.src = findProduct.img.singleImage;

        const productTitle = document.querySelector(".product-title");
        productTitle.textContent = findProduct.name;

        const productOldPrice = document.querySelector(".old-price");
        productOldPrice.textContent = `$${findProduct.price.oldPrice.toFixed(2)}`;

        const productNewPrice = document.querySelector(".new-price");
        productNewPrice.textContent = `$${findProduct.price.newPrice.toFixed(2)}`;



/* gallery thumbs */
const galleryThumbs = document.querySelector(".gallery-thumbs")
let result = ""

findProduct.img.thumbs.forEach((item) => {
    result += `
        <li class="glide__slide">
            <img src="${item}" class="img-fluid" alt="">
        </li>
    `
})

galleryThumbs.innerHTML = result

thumbsActiveFunc()
product3()

/* thumbs active */
const productThumbs = document.querySelectorAll(".product-thumb .glide__slide img")
productThumbs[0].classList.add("active")

document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded. Updating cart count...");
    updateCartCount();
});

    // Attach event listener to the "Add to Cart" button
    document.getElementById("add-to-cart").addEventListener("click", () => {
    const quantity = parseInt(document.getElementById("quantity").value, 10);

    const userId = localStorage.getItem('userId'); 

    if (!userId) {
        console.error("User ID not available.");
        alert("User not logged in.");
        return;
    }

    const addToCartButton = document.getElementById("add-to-cart");

  // Disable button immediately
  addToCartButton.disabled = true;
  addToCartButton.style.opacity = 0.5; // Make it visibly appear disabled
  addToCartButton.style.cursor = "not-allowed"; // Change the cursor to indicate it's disabled

  addToCart(userId, findProduct.id, quantity)
  .then(() => {
      alert("Product added to cart!");
       updateCartCount(); // Update cart count after a successful addition
     
  })
  .catch((error) => {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
      // Re-enable the button in case of failure
      addToCartButton.disabled = false;
      addToCartButton.style.opacity = 1; // Reset opacity
      addToCartButton.style.cursor = "pointer"; // Reset cursor
  });

});


// // Call `updateCartCount` after adding a product to the cart
// document.getElementById("add-to-cart").addEventListener("click", () => {
//     // After successfully adding to the cart
//     updateCartCount();
// });

    })
    .catch((error) => {
        console.error("Error fetching product data:", error);
    });

