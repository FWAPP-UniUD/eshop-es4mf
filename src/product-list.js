import $ from 'jquery';
import store from 'store';

const paginationTemplate = (current, pages, prevPage, nextPage) => `
<div class="ui pagination menu">
    ${Array.from(new Array(pages)).map((_, i) => `
        <a class="item" data-page="${i + 1}">${i + 1}</a>
    `).join("\n")}
</div>
`;

const htmlTemplate = (products) => `
<div class="ui cards">
  <div class="ui disabled text loader">Loading</div>
  ${products.map(
      product => `
        <div class="card">              
            <div class="image">
                <img class="ui small image" src="${"/api/products/" + product.picture_url}">
            </div>
            <div class="content">
                <h2 class="header">
                    ${product.name}
                </h2>
                ${product.price.toFixed(2)} €
                <span class="right floated">
                    <a data-product="${product._id}" class="add-product">
                    <i class="cart icon"></i>
                    Add to Cart
                    </a>
                </span>
            </div>
        </div>
      `
  ).join("\n")}
</div>
`;

class ProductList {
    constructor() {
        this.products = [];
        this.page = 1;
        this.mainElement = document.createElement('div');
        $(this.mainElement).addClass('ui segment');
    }

    attach(containerElement) {
        this.page = 1;
        $(this.mainElement).html(htmlTemplate([])).appendTo(containerElement);        
        this.loadProducts(this.page);
    }

    loadProducts(page) {
        const url = `/api/products?page=${page}`;
        $(this.mainElement).find('.loader').removeClass("disabled").addClass("active");
        fetch(url).then((response) => {
            if (response.ok) {
                return response.json();
            }  else          
                throw Error(response.statusText);
        }).then((result) => {
            if (result) {
                // set the content with the main one, constructed from the results
                $(this.mainElement).hide().html(htmlTemplate(result.products)).fadeIn(200);
                $(this.mainElement).append('<div class="ui divider"></div>');
                // define also a pagination element
                $(this.mainElement).append(paginationTemplate(result.current_page, result.pages, result.prevPage, result.nextPage));
                $(this.mainElement).find('.pagination .item').click((event) => {
                    event.preventDefault();
                    this.loadProducts(event.currentTarget.dataset.page);
                });
                // and register the event handler for the pagination element
                $(this.mainElement).find(`.pagination a.item`).removeClass('active');
                $(this.mainElement).find(`.pagination a.item[data-page="${page}"]`).addClass('active');
                // then register also the Add to Cart behavior
                $(this.mainElement).find(".add-product").click((event) => {
                    event.preventDefault(); // actually there is no href, so no default
                    const bought_item = event.currentTarget.dataset.product;
                    const cart = store.get('cart') || [];
                    // search for the bought_item in the cart
                    const item = cart.find(value => value.item == bought_item);
                    if (item) {
                        item.quantity += 1;
                    } else {
                        cart.push({ item: bought_item, quantity: 1 });
                    }
                    store.set('cart', cart);
                    //$('.cart-items').text((store.get('cart') || []).length);

                });
            }
        }); 
    }

}

export default ProductList; 