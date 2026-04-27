const productsContainer = document.getElementById('productsContainer');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const noResults = document.getElementById('noResults');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const resetBtn = document.getElementById('resetBtn');

let allProducts = [];

// Твій API
const API_URL = "https://69ee85499163f839f892c9f6.mockapi.io/products";

async function loadProducts() {
    try {
        showLoading(true);
        errorDiv.style.display = 'none';
        noResults.style.display = 'none';

        const res = await fetch(API_URL);
        
        if (!res.ok) throw new Error('Помилка сервера');

        allProducts = await res.json();

        populateCategories();
        renderProducts(allProducts);
    } catch (err) {
        showError("Не вдалося завантажити мерч. Перевір підключення до інтернету.");
        console.error(err);
    } finally {
        showLoading(false);
    }
}

function populateCategories() {
    // Отримуємо унікальні категорії з твоїх 25 товарів
    const categories = [...new Set(allProducts.map(p => p.category))].filter(Boolean).sort();

    categoryFilter.innerHTML = '<option value="">Всі товари</option>';
    
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categoryFilter.appendChild(opt);
    });
}

function renderProducts(products) {
    productsContainer.innerHTML = '';

    if (products.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image || 'https://picsum.photos/id/237/300/300'}" 
                 alt="${product.title}" 
                 onerror="this.src='https://picsum.photos/id/237/300/300'">
            <div class="product-info">
                <h3>${product.title || 'Без назви'}</h3>
                <p class="price">$${parseFloat(product.price || 0).toFixed(2)}</p>
                <span class="category-tag">${product.category || 'Інше'}</span>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

function filterProducts() {
    const selectedCategory = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase().trim();

    let filtered = allProducts;

    // Фільтрація за категорією
    if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Пошук по назві
    if (searchTerm) {
        filtered = filtered.filter(p => 
            (p.title || '').toLowerCase().includes(searchTerm)
        );
    }

    renderProducts(filtered);
}

function showLoading(isShow) {
    loading.style.display = isShow ? 'block' : 'none';
}

function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
}

// Події
categoryFilter.addEventListener('change', filterProducts);
searchInput.addEventListener('input', filterProducts);

resetBtn.addEventListener('click', () => {
    categoryFilter.value = '';
    searchInput.value = '';
    renderProducts(allProducts);
});

// Запуск при завантаженні сторінки
loadProducts();