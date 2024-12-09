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

async function deleteOrder (row, orderID) {
    const rowIndex = row.rowIndex;
    row.remove();
    console.log(`Строка ${rowIndex} удалена.`);
    const API_URL = `http://lab8-api.std-900.ist.mospolytech.ru/labs/api/orders/${orderID}?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84`;

    try {
        const response = await fetch(API_URL, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }       
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}

function deleteConfirmation(row, orderID) {
    const deleteConf = document.createElement("div");
    deleteConf.className = "delete-box";

    const toptext = document.createElement("p");
    toptext.style.fontWeight = "bold";
    toptext.textContent = "Удаление заказа";

    const line1 = document.createElement("hr");
    const line2 = document.createElement("hr");
    line1.classList.add("lines");
    line2.classList.add("lines");

    const crossBtn = document.createElement("button");
    crossBtn.className = "cross-button";
    crossBtn.textContent = "X";

    const text = document.createElement("p");
    text.textContent = "Вы уверены, что хотите удалить заказ?";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-button";
    cancelBtn.textContent = "Отмена";

    const yesBtn = document.createElement("button");
    yesBtn.className = "yes-button";
    yesBtn.textContent = "Да";

    crossBtn.addEventListener("click", () => {
        deleteConf.style.display = "none";
    });

    cancelBtn.addEventListener("click", () => {
        deleteConf.style.display = "none";
    });

    yesBtn.addEventListener("click", () => {
        deleteOrder(row, orderId);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "deleteConfBtn-container";
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(yesBtn);

    deleteConf.appendChild(toptext);
    deleteConf.appendChild(line1);
    deleteConf.appendChild(crossBtn);
    deleteConf.appendChild(text);
    deleteConf.appendChild(line2);
    deleteConf.appendChild(buttonContainer);

    document.body.appendChild(deleteConf);
    deleteConf.style.display = "block";
}

async function editOrder (row, orderID) {
    const API_URL = `http://lab8-api.std-900.ist.mospolytech.ru/labs/api/orders/${orderID}?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84`;

    try {
        const response = await fetch(API_URL, {
            method: 'GET'
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }       
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}

function detailsWindow(row, orderID) {
    const detailsWind = document.createElement("div");
    detailsWind.className = "details-box";

    const toptext = document.createElement("p");
    toptext.style.fontWeight = "bold";
    toptext.textContent = "Просмотр заказа";

    const line1 = document.createElement("hr");
    const line2 = document.createElement("hr");
    line1.classList.add("lines");
    line2.classList.add("lines");

    const crossBtn = document.createElement("button");
    crossBtn.className = "cross-button";
    crossBtn.textContent = "X";

    const okBtn = document.createElement("button");
    okBtn.className = "ok-button";
    okBtn.textContent = "ОК";

    crossBtn.addEventListener("click", () => {
        detailsWind.style.display = "none";
    });

    okBtn.addEventListener("click", () => {
        detailsWind.style.display = "none";
    });

    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("details-container");

    const leftDiv = document.createElement("div");
    leftDiv.className = "details-left";
    //ДОПИСАТЬ ТУТ ЛЕВЫЙ СТОЛБЕЦ

    const rightDiv = document.createElement("div");
    rightDiv.className = "details-right";
    //ДОПИСАТЬ ТУТ ПРАВЫЙ СТОЛБЕЦ

    detailsContainer.appendChild(leftDiv);
    detailsContainer.appendChild(rightDiv);

    detailsWind.appendChild(toptext);
    detailsWind.appendChild(crossBtn);
    detailsWind.appendChild(line1);
    detailsWind.appendChild(detailsContainer);
    detailsWind.appendChild(line2);
    detailsWind.appendChild(okBtn);

    document.body.appendChild(detailsWind);
    detailsWind.style.display = "block";
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
        detailsButton.classList.add('btn', 'btn-outline-primary');
        detailsButton.innerHTML = `<i class="bi bi-eye"></i>`;
        detailsButton.addEventListener('click', () => detailsWindow(row, 
            order.id));

        const editButton = document.createElement('button');
        editButton.classList.add("historyButtons");
        editButton.classList.add('btn', 'btn-outline-secondary');
        editButton.innerHTML = `<i class="bi bi-pencil"></i>`;
        editButton.addEventListener('click', () => editOrder(row, order.id));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("historyButtons");
        deleteButton.classList.add('btn', 'btn-outline-danger');
        deleteButton.innerHTML = `<i class="bi bi-trash"></i>`;
        deleteButton.addEventListener('click', () => deleteConfirmation(row, 
            order.id));

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

