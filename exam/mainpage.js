let items = [];
let selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
let displayedItems = 0;

function displayItems(howMuch) {
    const productGrid = document.getElementById('items');
    const top = (displayedItems + howMuch) <= items.length ? 
        displayedItems + howMuch : items.length;
    for (let i = displayedItems; i < top; i++) {
        const item = items[i];

        console.log(i);
        const col = document.createElement('div');
        col.classList.add('col', 'col-lg-4', 'col-md-6', 'col-sm-12');

        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');
        itemCard.setAttribute('data-item', item.name);

        const img = document.createElement('img');
        img.src = item.image_url;
        img.alt = item.name;
        itemCard.appendChild(img);

        const name = document.createElement('p');
        name.classList.add('name');
        name.textContent = item.name;
        itemCard.appendChild(name);

        const rating = document.createElement('p');
        rating.classList.add('rating');
        rating.textContent = item.rating.toFixed(1) + ' ';
        for (let j = 0; j < 5; j++) {
            const star = document.createElement('i');
            star.classList.add('bi', 
                j < item.rating ? 'bi-star-fill' : 'bi-star', 'stars');
            rating.appendChild(star);
        }
        itemCard.appendChild(rating);

        const priceContainer = document.createElement('div');
        priceContainer.classList.add('price-container');
    
        const Dprice = document.createElement('span');
        Dprice.classList.add('price', 'discount-price');
        Dprice.textContent = item.discount_price + '₽ ';
        priceContainer.appendChild(Dprice);

        const Aprice = document.createElement('span');
        Aprice.classList.add('price', 'actual-price');
        Aprice.textContent = item.actual_price + '₽';
        priceContainer.appendChild(Aprice);

        const discountPercentage = Math.round(
            ((item.actual_price - item.discount_price) 
                / item.actual_price) * 100
        );
        const discount = document.createElement('span');
        discount.classList.add('discount');
        discount.textContent = ' -' + discountPercentage + '%';
        priceContainer.appendChild(discount);

        itemCard.appendChild(priceContainer);
    
        const addButton = document.createElement('button');
        addButton.classList.add('add-button', 'btn', 'btn-dark');
        addButton.textContent = 'Добавить';

        addButton.onclick = function() {
            selectedItems.push(item.id);
            localStorage.setItem('selectedItems', 
                JSON.stringify(selectedItems));
            createNotification("Добавили " + item.name + " в Вашу корзину!");
        };

        itemCard.appendChild(addButton);

        col.appendChild(itemCard);
        productGrid.appendChild(col);
    }

    displayedItems += howMuch;

    if (displayedItems >= items.length) {
        document.getElementById('loadMore').style.display = 'none';
    }
}

document.getElementById('loadMore').onclick = function() {
    displayItems(8);
    createNotification("Подгрузил!");
};

document.addEventListener("DOMContentLoaded", () => {
    loadItems().then(() => {
        displayItems(8);
    });
}); 