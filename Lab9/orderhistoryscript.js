let dishes = [];
let orders = [];

async function loadDishes() {
    const API_URL = "http://lab8-api.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log("БЛЮДА ЗАГРУЖЕНЫ: ", data);
        dishes = data;        
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
};

async function loadOrders() {
    const API_URL = "http://lab8-api.std-900.ist.mospolytech.ru/labs/api/orders?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log("ИСТОРИЯ ЗАКАЗОВ ЗАГРУЖЕНА: ", data);
        orders = data;        
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
};

function getWholeOrder (main, soup, drink, salad, dessert) {
    let allDishes = '';

    if (main != null) {
        allDishes += dishes.find(item => item.id === main).name + ', ';
    }
    if (soup != null) {
        allDishes += dishes.find(item => item.id === soup).name + ', ';
    }
    if (salad != null) {
        allDishes += dishes.find(item => item.id === salad).name + ', ';
    }
    if (drink != null) {
        allDishes += dishes.find(item => item.id === drink).name + ', ';
    }
    if (dessert != null) {
        allDishes += dishes.find(item => item.id === dessert).name + ', ';
    }

    if (allDishes.endsWith(', ')) {
        allDishes = allDishes.slice(0, -2);
    }

    return allDishes;
}

function dateReformer (dateToReform) {
    const [date, time] = dateToReform.split('T');
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    
    return `${day}.${month}.${year} ${hour}:${minute}`;
}

function countPrice (main, soup, drink, salad, dessert) {
    let price = 0;

    if (main != null) {
        price += dishes.find(item => item.id === main).price;
    }
    if (soup != null) {
        price += dishes.find(item => item.id === soup).price;
    }
    if (salad != null) {
        price += dishes.find(item => item.id === salad).price;
    }
    if (drink != null) {
        price += dishes.find(item => item.id === drink).price;
    }
    if (dessert != null) {
        price += dishes.find(item => item.id === dessert).price;
    }

    return price;
}

function deliveryTimeConcretizer (type, time) {
    if (type === "now") {
        return "Как можно скорее <br> (с 07:00 до 23:00)";
    } else {
        return time.slice(0, -3);
    }
}

function displayOrders() {
    const tableBody = document.querySelector('#ordersHistory tbody');
    tableBody.innerHTML = '';

    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.classList.add('orderHistoryRow');

        const wholeOrder = getWholeOrder(order.main_course_id, order.soup_id, 
            order.drink_id, order.salad_id, order.dessert_id);

        const registrationDate = dateReformer(order.created_at);

        const fullPrice = countPrice(order.main_course_id, order.soup_id, 
            order.drink_id, order.salad_id, order.dessert_id);

        const deliveryTimeconcretized = 
            deliveryTimeConcretizer(order.delivery_type, order.delivery_time);

        const cellIndex = document.createElement('td');
        cellIndex.textContent = index + 1;
        row.appendChild(cellIndex);

        const cellRegDate = document.createElement('td');
        cellRegDate.textContent = registrationDate;
        row.appendChild(cellRegDate);

        const cellOrder = document.createElement('td');
        cellOrder.classList.add('wholeOrder');
        cellOrder.textContent = wholeOrder;
        row.appendChild(cellOrder);

        const cellPrice = document.createElement('td');
        cellPrice.textContent = fullPrice;
        row.appendChild(cellPrice);

        const cellDeliveryTime = document.createElement('td');
        cellDeliveryTime.innerHTML = deliveryTimeconcretized;
        row.appendChild(cellDeliveryTime);

        const cellActions = document.createElement('td');
        const detailsButton = document.createElement('button');
        detailsButton.classList.add("historyButtons");
        detailsButton.id = "detailsBtn";
        detailsButton.classList.add('btn', 'btn-outline-primary');
        detailsButton.innerHTML = `<i class="bi bi-eye"></i>`;
        detailsButton.setAttribute('data-id', index);

        const editButton = document.createElement('button');
        editButton.classList.add("historyButtons");
        editButton.id = "editBtn";
        editButton.classList.add('btn', 'btn-outline-secondary');
        editButton.innerHTML = `<i class="bi bi-pencil"></i>`;
        editButton.setAttribute('data-id', index);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("historyButtons");
        deleteButton.id = "deleteBtn";
        deleteButton.classList.add('btn', 'btn-outline-danger');
        deleteButton.innerHTML = `<i class="bi bi-trash"></i>`;
        deleteButton.setAttribute('data-id', index);

        cellActions.appendChild(detailsButton);
        cellActions.appendChild(editButton);
        cellActions.appendChild(deleteButton); 
        
        row.appendChild(cellActions);

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    Promise.all([loadDishes(), loadOrders()]).then(() => {
        displayOrders();
    }).catch(error => {
        console.error("Ошибка при загрузке данных:", error);
    });
});

