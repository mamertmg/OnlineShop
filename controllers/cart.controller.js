const Product = require('../models/product.model');

function getCart(req, res) {
  res.render('customer/cart/cart');
}

async function addCartItem(req, res, next) {
  let product;

  // Find product to add
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    next(error);
    return;
  }

  // Bring the cart
  const cart = res.locals.cart;

  // Add product in the cart
  cart.addItem(product);

  // Store cart into the session
  req.session.cart = cart;

  // Send back the data about the cart
  res.status(201).json({
    message: 'Cart updated!',
    newTotalItems: cart.totalQuantity
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart
};