const path = require('path');
const express = require('express');
const db = require ('./data/database');

const csrf = require('csurf');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');

const expressSession = require('express-session');
const createSessionConfig = require('./config/session');

const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();

// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public')); // Serve static files (e.g. CSS files)
app.use('/products/assets', express.static('product-data')); // Serve images staticly
app.use(express.urlencoded({extended: false})); // Extract (parses) incoming url request bodies
app.use(express.json()); // All incoming requests are now also checked for JSON data

// Create session
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

// Activate cart that uses sessions to store the items
app.use(cartMiddleware);

// Protection against CSRF attacks
app.use(csrf());
app.use(addCsrfTokenMiddleware);

// Check Authorization status
app.use(checkAuthStatusMiddleware);

// Router handler
app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use('/cart', cartRoutes);
app.use(protectRoutesMiddleware);
app.use('/admin', adminRoutes);

// Error handler
app.use(errorHandlerMiddleware);

// Database connection
db.connectToDatabase()
    .then(function(){
        app.listen(3000);
        console.log('Listening on port 3000');
    })
    .catch(function(error){
        console.log('Failed to connect to the database');
        console.log(error);
});
