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
        
        items.push({
            'actual_price': 1488,
            'id': 2,
            'image_url': "https://m.media-amazon.com/images/I/81eM15lVcJL._AC_UL320_.jpg",
            'main_category': "tv, audio & cameras",
            'name': "АЙФОООООООН",
            'rating': 3.6,
            'sub_category': "All Electronics"
        });
        
        items.push({
            'actual_price': 2999,
            'id': 3,
            'image_url': "https://m.media-amazon.com/images/I/81eM15lVcJL._AC_UL320_.jpg",
            'main_category': "smartphones",
            'name': "Самсунг Галакси S21",
            'rating': 5.0,
            'sub_category': "Mobile Phones"
        });
        
        items.push({
            'actual_price': 1200,
            'id': 4,
            'image_url': "https://m.media-amazon.com/images/I/81eM15lVcJL._AC_UL320_.jpg",
            'main_category': "home appliances",
            'name': "Микроволновка Samsung",
            'rating': 4.5,
            'sub_category': "Kitchen Appliances"
        });
        
        items.push({
            'actual_price': 250,
            'id': 5,
            'image_url': "https://m.media-amazon.com/images/I/81eM15lVcJL._AC_UL320_.jpg",
            'main_category': "health & personal care",
            'name': "Электрическая зубная щетка",
            'rating': 1.0,
            'sub_category': "Oral Care"
        });
        
        items.push({
            'actual_price': 399,
            'id': 6,
            'image_url': "https://m.media-amazon.com/images/I/81eM15lVcJL._AC_UL320_.jpg",
            'main_category': "tv, audio & cameras",
            'name': "Наушники Sony WH-1000XM4",
            'rating': 4.7,
            'sub_category': "Headphones"
        });
        
        items.push({
            'actual_price': 789,
            'id': 7,
            'image_url': "https://m.media-amazon.com/images/I/81eM15lVcJL._AC_UL320_.jpg",
            'main_category': "smartphones",
            'name': "Xiaomi Mi 11",
            'rating': 1.3,
            'sub_category': "Mobile Phones"
        });
        
        items.push({
            'actual_price': 4999,
            'id': 8,
            'image_url': "https://m.media-amazon.com/images/I/81eM15lVcJL._AC_UL320_.jpg",
            'main_category': "computers & accessories",
            'name': "Ноутбук Lenovo ThinkPad",
            'rating': 4.6,
            'sub_category': "Laptops"
        });
        
        items.push({
            'actual_price': 899,
            'id': 9,
            'image_url': "https://m.media-amazon.com/images/I/81eM15lVcJL._AC_UL320_.jpg",
            'main_category': "tv, audio & cameras",
            'name': "Смарт телевизор LG OLED",
            'rating': 3.8,
            'sub_category': "Televisions"
        });
        
        items.push({
            'actual_price': 1500,
            'id': 10,
            'image_url': "https://m.media-amazon.com/images/I/81eM15lVcJL._AC_UL320_.jpg",
            'main_category': "sports & outdoors",
            'name': "Велосипед Trek Marlin 7",
            'rating': 4.4,
            'sub_category': "Mountain Bikes"
        });
        
        items.push({
            'actual_price': 699,
            'id': 11,
            'image_url': "https://m.media-amazon.com/images/I/81eM15lVcJL._AC_UL320_.jpg",
            'main_category': "health & personal care",
            'name': "Массажер для тела",
            'rating': 2.2,
            'sub_category': "Massage Equipment"
        });
        
        
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}