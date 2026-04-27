// dnd.js — Лабораторна №5 + Історія персонажа

const API_URL = "https://69ee85499163f839f892c9f6.mockapi.io/characters";

let characters = [];

// Завантаження даних
async function loadCharacters() {
    try {
        const res = await fetch(API_URL);
        if (res.ok) {
            characters = await res.json();
        }
    } catch (e) {
        console.warn("Не вдалося завантажити з сервера");
    }
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    characters.forEach(char => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${char.name || '—'}</td>
            <td>Гравець ${char.id ? char.id.slice(-4) : ''}</td>
            <td>${char.race || '—'}</td>
            <td>${char.characterClass || char.class || '—'}</td>
            <td>${char.items || '—'}</td>
            <td>
                <div class="history-cell">
                    ${char.background ? 
                        char.background.replace(/\n/g, '<br>') : 
                        '—'}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Модальне вікно
const modal = document.getElementById('characterModal');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementById('closeModal');

openBtn.onclick = () => modal.style.display = 'block';
closeBtn.onclick = () => modal.style.display = 'none';

window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
};

// Відправка форми
document.getElementById('characterForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    const name = document.getElementById('name').value.trim();
    const characterClass = document.getElementById('class').value;
    const raceInput = document.querySelector('input[name="race"]:checked');
    const race = raceInput ? raceInput.value : '';
    const background = document.getElementById('background').value.trim();

    const checkedItems = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                              .map(cb => cb.value);

    if (!name || !characterClass || !race) {
        if (!name) document.getElementById('nameError').textContent = 'Введіть ім\'я!';
        if (!characterClass) document.getElementById('classError').textContent = 'Оберіть клас!';
        if (!race) alert('Оберіть расу!');
        return;
    }

    const newCharacter = {
        name: name,
        race: race,
        characterClass: characterClass,
        items: checkedItems.length ? checkedItems.join(', ') : 'Немає',
        background: background || 'Історія не вказана',
        createdAt: new Date().toISOString()
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCharacter)
        });

        if (!response.ok) throw new Error('Помилка при відправці');

        const saved = await response.json();
        characters.unshift(saved);   // новий персонаж зверху
        renderTable();

        showSuccess(`Персонаж "${name}" успішно створений!`);

        modal.style.display = 'none';
        this.reset();

    } catch (err) {
        console.error(err);
        alert('Помилка відправки на сервер. Перевірте з’єднання.');
    }
});

function showSuccess(text) {
    const msg = document.createElement('div');
    msg.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#27ae60;color:white;padding:15px 30px;border-radius:8px;font-size:18px;z-index:3000;';
    msg.textContent = text;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 4000);
}

// Ініціалізація
loadCharacters();