
fetch('/data.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })


  .then((products) => {

    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear existing content if any


    products.forEach((product) => {
      const productItem = document.createElement('li');
      productItem.classList.add('product-item', 'glide__slide');


      productItem.innerHTML = `
  <div class="product-card">
    <div class="product-image">
      <a href="#" class="product-link" data-product-id="${product.productId}">
        <img src="${product.img.singleImage}" alt="${product.name}" class="product-img img1" />
        <img src="${product.img.thumbs[1]}" alt="${product.name}" class="product-img img2" />
      </a>
    </div>
    <div class="product-info">
      <a href="#" class="product-title product-link" data-product-id="${product.productId}">${product.name}</a>
      <div class="product-prices">
        <strong class="new-price">$${product.price.newPrice.toFixed(2)}</strong>
        <span class="old-price">$${product.price.oldPrice.toFixed(2)}</span>
      </div>
      <ul class="product-stars">
        ${generateStars(product.rating || 0)} <!-- Use the rating data if available -->
      </ul>
      <div class="product-actions">
        <button class="add-to-cart-btn"><i class="bi bi-basket-fill"></i> Add to Cart</button>
        <button class="wishlist-btn"><i class="bi bi-heart-fill"></i></button>
      </div>
    </div>
  </div>
`;

      // Add click event to redirect to single-product.html with productId
     
     
      productItem.querySelectorAll('.product-link').forEach((link) => {
        link.addEventListener('click', (event) => {

          event.preventDefault(); // Prevent default link behavior


          const productId = event.currentTarget.getAttribute('data-product-id');
          if (productId) {
            // Redirect to single-product.html with the productId in the query string
            window.location.href = `single-product.html?productId=${productId}`;
          } else {
            console.error('Product ID not found for the clicked product.');
          }
        });
      });
    
      productList.appendChild(productItem);
    });

   

  })
  .catch((error) => {
    console.error('Error fetching product data:', error);
  });

// Generate star ratings dynamically
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  const starsHTML = [];
  for (let i = 0; i < fullStars; i++) {
    starsHTML.push('<li><i class="bi bi-star-fill"></i></li>');
  }
  for (let i = 0; i < halfStar; i++) {
    starsHTML.push('<li><i class="bi bi-star-half"></i></li>');
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHTML.push('<li><i class="bi bi-star"></i></li>');
  }
  return starsHTML.join('');
}

