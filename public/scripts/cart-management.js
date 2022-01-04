const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElement = document.querySelector('.nav-items .badge');

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'POST',
      // Javascript converted into JSON format with stringfy
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken // only GET requests do not need to send CSRF Tokens
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
  } catch (error) {
    alert('Something went wrong!');
    return;
  }
  
  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  // .json() is a method that decoys the response data from the JSON format to regular Javascript
  const responseData = await response.json();

  const newTotalQuantity = responseData.newTotalItems;

  cartBadgeElement.textContent = newTotalQuantity;
}

addToCartButtonElement.addEventListener('click', addToCart);