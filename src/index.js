import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic';
import page from 'page';
import Login from './login';
import ProductList from './product-list';
import Cart from './cart'
import store from 'store';

const container = document.querySelector(".my-component");

page('/', check_login, index); //rotte-ho due funzioni registrate (posso averne n) eseguite in sequenza. Mi dicono "arrivato qui fai...""
page('/products', check_login, products);
page('/cart', check_login, cart);
page('/login', login);
page('/logout', logout);
page('*', notfound);

const loginComponent = new Login(), productList = new ProductList(), cartComponent = new Cart();

function check_login(ctx, next) {
    if (store.get('logged_in')) {
        $('#my-navbar a[href="/login"]').hide(); //nasconde login e mostra logout
        $('#my-navbar a[href="/logout"]').show();
    } else {
        $('#my-navbar a[href="/login"]').show();
        $('#my-navbar a[href="/logout"]').hide();
    }
    ctx.logged_in = store.get('logged_in');
    next();
}

function index() {
    $(container).empty();
    $('#my-navbar a').removeClass('active');
    $('#my-navbar a[href="/"]').addClass('active');
}

function login() {
    if (!store.get('logged_in')) {
        $(container).empty();
        loginComponent.attach(container);
        $('#my-navbar a').removeClass('active');
        $('#my-navbar a[href="/login"]').addClass('active');
    } else {
        // goes back to the previous URL (i.e., where Login was pressed)     
        history.go(-1);
    }
}

function logout() {
    $(container).empty();
    loginComponent.logout();   
    // goes back to the previous URL (i.e., where Logout was pressed)     
    history.go(-1);
}

function notfound() {
    $(container).empty();
}

function products() {
    $(container).empty();
    productList.attach(container);
}

function cart() {
    $(container).empty();
    cartComponent.attach(container);
}


//ho attrinuito la classe .cart-items al bottone in modo da accedere con $()
$('.cart-items').text((store.get('cart') || []).length);

page.start();