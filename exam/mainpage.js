let items = [];
let uniqueCategories = [];
let selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
let displayedItems = 0;
let displayedItemsWithFilters = 0;

function displayItems(howMuch) {
    const productGrid = document.getElementById('items');

    const minPrice = (document.getElementById("priceMin").value) ? 
        document.getElementById("priceMin").value : 0;
    const maxPrice = (document.getElementById("priceMax").value) ? 
        document.getElementById("priceMax").value : Infinity;
    const onlyDiscount = document.getElementById("discount").checked;
    const chosenCategories = Array.from(document.querySelectorAll(
        'input[name="category"]:checked')).map(checkbox => checkbox.value);
    console.log("ИНФА ИЗ ФИЛЬТРОВ: ", 
        minPrice, maxPrice, onlyDiscount, chosenCategories);

    const filteredItems = items.filter(item => {
        return (((item.discount_price === null && item.actual_price <= maxPrice &&
            item.actual_price >= minPrice) ||
        (item.discount_price !== null && item.discount_price <= maxPrice &&
            item.discount_price >= minPrice)) && 
        ((chosenCategories.length != 0) ? 
            chosenCategories.includes(item.main_category) : true) &&
        (onlyDiscount && item.discount_price === null ? false : true));
    });

    if (displayedItems >= filteredItems.length) {
        document.getElementById('loadMore').style.display = 'none';
    } else {
        document.getElementById('loadMore').style.display = 'block';
    }

    const top = (displayedItems + howMuch) <= filteredItems.length ? 
        displayedItems + howMuch : filteredItems.length;

    for (let i = displayedItems; i < top; i++) {
        const item = filteredItems[i];
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

        const ratingContainer = document.createElement('div');
        ratingContainer.classList.add('rating-container');
        const rating = document.createElement('p');
        rating.classList.add('rating');
        rating.textContent = item.rating.toFixed(1) + ' ';
        for (let j = 0; j < 5; j++) {
            const star = document.createElement('i');
            star.classList.add('bi', 
                j < item.rating ? 'bi-star-fill' : 'bi-star', 'stars');
            rating.appendChild(star);
        }
        ratingContainer.appendChild(rating);
        itemCard.appendChild(ratingContainer);

        const priceContainer = document.createElement('div');
        priceContainer.classList.add('price-container');
        
        if (item.discount_price === null) {
            const Aprice = document.createElement('span');
            Aprice.classList.add('price', 'discount-price');
            Aprice.textContent = item.actual_price + '₽';
            priceContainer.appendChild(Aprice); 
        } else {
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
        }

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

    if (displayedItems >= filteredItems.length) {
        document.getElementById('loadMore').style.display = 'none';
    }
}

function getUniqueCategories() {
    items.forEach(item => {
        if (!uniqueCategories.includes(item.main_category))
            uniqueCategories.push(item.main_category); 
    });
    console.log(uniqueCategories);
}

function addCategories() {
    const categoryList = document.querySelector('.list-unstyled');

    uniqueCategories.forEach((category) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'category';
        checkbox.value = category;
        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(` ${category}`));
        categoryList.appendChild(li);
    });
}

document.getElementById('loadMore').onclick = function() {
    displayItems(8);
    createNotification("Подгрузил!");
};

document.getElementById('applyFilters').onclick = function() {
    const productGrid = document.getElementById('items');
    productGrid.innerHTML = '';
    displayedItems = 0;
    displayItems(8);

    createNotification("Фильтры успешно применены!");
};

document.getElementById('sortOptions').addEventListener('change', function() {
    const sortValue = this.value;

    if (sortValue === 'price-asc') {
        items.sort((a, b) => ((a.discount_price === null) ? a.actual_price : a.discount_price) - ((b.discount_price === null) ? b.actual_price : b.discount_price));
        createNotification("Отстортировано по возрастанию цены!");
    } else if (sortValue === 'price-desc') {
        items.sort((a, b) => ((b.discount_price === null) ? b.actual_price : b.discount_price) - ((a.discount_price === null) ? a.actual_price : a.discount_price));
        createNotification("Отстортировано по убыванию цены!");
    } else if (sortValue === 'rating-asc') {
        items.sort((a, b) => a.rating - b.rating);
        createNotification("Отстортировано по возрастанию рейтинга!");
    } else if (sortValue === 'rating-desc') {
        items.sort((a, b) => b.rating - a.rating);
        createNotification("Отстортировано по убыванию рейтинга!");
    }

    const productGrid = document.getElementById('items');
    productGrid.innerHTML = '';

    displayedItems = 0;
    displayItems(8);
});

document.addEventListener("DOMContentLoaded", () => {
    loadItems().then(() => {
        getUniqueCategories();
        addCategories();
        displayItems(8);
    });
}); 