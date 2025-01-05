function createNotification(text) {
    const notificationContainer = document.getElementById('notifications');

    const notsBox = document.createElement('div');
    notsBox.classList.add('notification-box');
    
    const notsText = document.createElement('span');
    notsText.classList.add('notification-text');
    notsText.textContent = text;
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
