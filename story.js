document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('dynamicList');
    const input = document.getElementById('itemInput');
    const addBtn = document.getElementById('addBtn');

    function addItem() {
        const text = input.value.trim();
        if (!text) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${text}</span>
            <button class="deleteBtn">Видалити</button>
        `;

        li.querySelector('.deleteBtn').addEventListener('click', () => {
            li.remove();
        });

        list.appendChild(li);
        input.value = '';
    }

    addBtn.addEventListener('click', addItem);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });

    document.querySelectorAll('.deleteBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.remove();
        });
    });
});