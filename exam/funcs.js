function createNotification(text) {
    const notificationContainer = document.getElementById('notifications');
    notificationContainer.innerHTML = '';

    const notsBox = document.createElement('div');
    notsBox.classList.add('notification-box');
    
    const notsText = document.createElement('span');
    notsText.classList.add('notification-text');
    notsText.textContent = '🔔 ' + text;
    notsBox.appendChild(notsText);
    
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '×';

    closeButton.onclick = function() {
        notsBox.remove();
    };
    
    notsBox.appendChild(closeButton);

    notificationContainer.appendChild(notsBox);
}

function dateReformer (dateToReform) {
    const [date, time] = dateToReform.split('T');
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    
    return `${day}.${month}.${year} ${hour}:${minute}`;
}

function dateReformerDateOnly (dateToReform) {
    const [year, month, day] = dateToReform.split('-');
    
    return `${day}.${month}.${year}`;
}


async function loadItems() {
    const API_URL = "http://api.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("ЗАГРУЗИЛ ЭТО: ", data);

        items = data;
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}