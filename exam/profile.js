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

function orderIdsToItems(orderIds) {
    let result = "";
    for (id of orderIds) {
        const item = (items.find(order => order.id === id));
        result += '🎯' + item.name + '<br>';
    }
    return result;
}

function countPrice(orderIds) {
    let result = 0;
    for (id of orderIds) {
        const item = (items.find(order => order.id === id));
        result += (item.discount_price !== null) ? 
            item.discount_price : item.actual_price;
    }
    return result;
}

function deleteConfirmation(row, orderID) {
    let existingDelWindow = document.querySelector(".delete-box");
    if (existingDelWindow) {
        existingDelWindow.remove();
    }

    let existingDWindow = document.querySelector(".details-box");
    if (existingDWindow) {
        existingDWindow.remove();
    }

    let existingEwindow = document.querySelector(".edit-box");
    if (existingEwindow) {
        existingEwindow.remove();
    }

    const deleteConf = document.createElement("div");
    const oId = orderID;
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

    const orderIndex = row.getAttribute('data-index');

    const text = document.createElement("p");
    text.textContent = "Вы уверены, что хотите удалить заказ №" + 
        (parseInt(orderIndex) + 1) + " ?";

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

    yesBtn.addEventListener("click", async () => {
        await deleteOrder(oId);
        deleteConf.style.display = "none";
        location.reload();
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

function detailsWindow(orderID) { 
    let existingDelWindow = document.querySelector(".delete-box");
    if (existingDelWindow) {
        existingDelWindow.remove();
    }

    let existingDWindow = document.querySelector(".details-box");
    if (existingDWindow) {
        existingDWindow.remove();
    }

    let existingEwindow = document.querySelector(".edit-box");
    if (existingEwindow) {
        existingEwindow.remove();
    }

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
    
    const table = document.createElement("table");
    table.className = "details-table";

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    const order = orders.find(order => order.id === orderID);
    console.log("ВОТ ЗАКАЗ>>>>>", order);

    const data = {
        created_at: dateReformer(order.created_at),
        delivery: {
            full_name: order.full_name,
            phone: order.phone,
            email: order.email,
            address: order.delivery_address,
            date: order.delivery_date,
            time: order.delivery_interval,
        },
        items: orderIdsToItems(order.good_ids),
        total_price: countPrice(order.good_ids) + ' ₽',
        comment: order.comment,
    };

    console.log(data.items);

    const rows = [
        ["Дата оформления", data.created_at],
        ["Имя", data.delivery.full_name],
        ["Номер телефона", data.delivery.phone],
        ["Email", data.delivery.email],
        ["Адрес доставки", data.delivery.address],
        ["Дата доставки", data.delivery.date],
        ["Время доставки", data.delivery.time],
        ["Состав заказа", data.items],
        ["Стоимсоть заказа", data.total_price],
        ["Комментарий", data.comment || "Нет комментариев"],
    ];

    rows.forEach(([label, value]) => {
        const row = document.createElement("tr");

        const cellLabel = document.createElement("td");
        cellLabel.textContent = label;

        const cellValue = document.createElement("td");
        cellLabel.style.fontWeight = "bold";

        if (label === "Состав заказа") {
            const scrollContainer = document.createElement("div");
            scrollContainer.style.maxHeight = "100px";
            scrollContainer.style.overflowY = "auto";
            scrollContainer.style.marginBottom = "20px"; 

            scrollContainer.innerHTML = data.items;

            cellValue.appendChild(scrollContainer);
        } else if (label === "Время доставки") {
            cellValue.innerHTML = value;
        } else {
            cellValue.textContent = value;
        }

        row.appendChild(cellLabel);
        row.appendChild(cellValue);

        tbody.appendChild(row);
    });
 
    const okBtn = document.createElement("button");
    okBtn.className = "ok-button";
    okBtn.textContent = "ОК";

    crossBtn.addEventListener("click", () => {
        detailsWind.style.display = "none";
    });

    okBtn.addEventListener("click", () => {
        detailsWind.style.display = "none";
    });

    detailsWind.appendChild(toptext);
    detailsWind.appendChild(crossBtn);
    detailsWind.appendChild(line1);
    detailsWind.appendChild(table);
    detailsWind.appendChild(line2);
    detailsWind.appendChild(okBtn);

    document.body.appendChild(detailsWind);
    detailsWind.style.display = "block";
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

        const scrollContainer = document.createElement("div");
        scrollContainer.style.maxHeight = "100px";
        scrollContainer.style.overflowY = "auto";

        scrollContainer.innerHTML = wholeOrder;

        cellOrder.appendChild(scrollContainer);
        cellOrder.classList.add('wholeOrder');
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
        detailsButton.classList.add('btn', 'btn-outline-dark', 'me-1');
        detailsButton.innerHTML = `<i class="bi bi-eye"></i>`;
        detailsButton.addEventListener('click', () => detailsWindow(order.id));

        const editButton = document.createElement('button');
        editButton.classList.add("historyButtons");
        editButton.classList.add('btn', 'btn-outline-dark', 'me-1');
        editButton.innerHTML = `<i class="bi bi-pencil"></i>`;
        editButton.addEventListener('click', () => editWindow(order.id));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("historyButtons");
        deleteButton.classList.add('btn', 'btn-outline-dark', 'me-1');
        deleteButton.innerHTML = `<i class="bi bi-trash"></i>`;
        deleteButton.addEventListener('click', () => 
            deleteConfirmation(row, order.id));

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
