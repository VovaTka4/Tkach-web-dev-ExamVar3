let items = [];
let orders = [];

async function loadOrders() {
    const API_URL = "http://api.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84";

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
}

async function deleteOrder(orderId) {
    try {
        const response = await fetch(`http://api.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        createNotification("Заказ удален!");
    } catch (error) {
        console.error("Ошибка при удалении заказов:", error);
    }

    location.reload();
}

function dateReformer (dateToReform) {
    const [date, time] = dateToReform.split('T');
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    
    return `${day}.${month}.${year} ${hour}:${minute}`;
}

function displayOrders() {
    const tableBody = document.querySelector('#ordersHistory tbody');
    tableBody.innerHTML = '';

    const sortedOrders = orders.sort((a, b) => 
        (a.delivery_date - b.delivery_date));

    sortedOrders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.classList.add('orderHistoryRow');

        const registrationDate = dateReformer(order.created_at);

        let fullPrice = 500;
        let wholeOrder = '';

        console.log(order.good_ids);

        for (let i = 0; i < order.good_ids.length; i++) {
            const currentItem = items.find(item => 
                item.id === order.good_ids[i]);
            wholeOrder += '🎯' + currentItem.name + '; <br>';
            fullPrice += (currentItem.discount_price !== null) ? 
                currentItem.discount_price : currentItem.actual_price;
        }

        const deliveryTime = order.delivery_date + '<br>' 
            + order.delivery_interval;

        const cellIndex = document.createElement('td');
        cellIndex.textContent = index + 1;
        row.setAttribute('data-index', index);
        row.appendChild(cellIndex);

        const cellRegDate = document.createElement('td');
        cellRegDate.textContent = registrationDate;
        row.appendChild(cellRegDate);

        const cellOrder = document.createElement('td');
        cellOrder.classList.add('wholeOrder');
        cellOrder.innerHTML = wholeOrder;
        row.appendChild(cellOrder);

        const cellPrice = document.createElement('td');
        cellPrice.textContent = fullPrice + ' ₽';
        row.appendChild(cellPrice);

        const cellDeliveryTime = document.createElement('td');
        cellDeliveryTime.innerHTML = deliveryTime;
        row.appendChild(cellDeliveryTime);

        const cellActions = document.createElement('td');
        cellActions.classList.add("actionButtonsCell");
        
        const detailsButton = document.createElement('button');
        detailsButton.classList.add("historyButtons");
        detailsButton.classList.add('btn', 'btn-outline-primary', 'me-1');
        detailsButton.innerHTML = `<i class="bi bi-eye"></i>`;
        detailsButton.addEventListener('click', () => detailsWindow(row, 
            order.id));

        const editButton = document.createElement('button');
        editButton.classList.add("historyButtons");
        editButton.classList.add('btn', 'btn-outline-secondary', 'me-1');
        editButton.innerHTML = `<i class="bi bi-pencil"></i>`;
        editButton.addEventListener('click', () => editWindow(order.id));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("historyButtons");
        deleteButton.classList.add('btn', 'btn-outline-danger', 'me-1');
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
    Promise.all([loadOrders(), loadItems()]).then(() => {
        displayOrders();
    }).catch(error => {
        console.error("Ошибка при загрузке данных:", error);
    });
});
