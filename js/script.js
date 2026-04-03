let cart = [];

// THEME TOGGLE
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    icon.classList.replace(body.classList.contains('dark-theme') ? 'fa-moon' : 'fa-sun', body.classList.contains('dark-theme') ? 'fa-sun' : 'fa-moon');
}

// START ORDER
function startOrder() {
    const name = document.getElementById('cust-name').value;
    const table = document.getElementById('cust-table').value;
    if(!name || !table) return alert("Isi nama ama meja dulu dong!");

    localStorage.setItem('u_name', name);
    localStorage.setItem('u_table', table);

    document.getElementById('step-2').classList.remove('hidden');
    document.getElementById('menu-title').innerText = `Punya ${name}`;
    document.getElementById('step-1').style.opacity = "0.4";
    document.getElementById('step-1').style.pointerEvents = "none";
}

// CART LOGIC
function addItem(itemName, price) {
    const existing = cart.find(i => i.name === itemName);
    if(existing) {
        existing.qty++;
    } else {
        cart.push({ name: itemName, price: price, qty: 1 });
    }
    renderCart();
    showFeedback();
}

function removeItem(itemName) {
    const index = cart.findIndex(i => i.name === itemName);
    if(index > -1) {
        cart[index].qty--;
        if(cart[index].qty === 0) cart.splice(index, 1);
    }
    renderCart();
}

function renderCart() {
    const list = document.getElementById('cart-items-list');
    const totalDisp = document.getElementById('total-display');
    list.innerHTML = cart.length === 0 ? '<p class="empty-msg">Belum ada pesanan nih...</p>' : '';
    
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        list.innerHTML += `
            <div class="cart-item-row">
                <span>${item.name} (x${item.qty})</span>
                <div class="cart-controls">
                    <button class="btn-qty" onclick="removeItem('${item.name}')">-</button>
                    <button class="btn-qty" onclick="addItem('${item.name}', ${item.price})">+</button>
                </div>
            </div>
        `;
    });
    totalDisp.innerText = `Total: Rp ${total.toLocaleString()}`;
}

function showFeedback() {
    const pop = document.createElement('div');
    pop.className = 'feedback-pop';
    pop.innerHTML = '<i class="fas fa-check-circle"></i> Added to Cart!';
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 1000);
}

function showQRIS() {
    if(cart.length === 0) return alert("Keranjang lo masih kosong!");
    document.getElementById('menu-wrapper').classList.add('hidden');
    document.getElementById('qris-area').classList.remove('hidden');
}

function confirmPayment() {
    const notes = Array.from(document.querySelectorAll('.note-cb:checked')).map(cb => cb.value);
    const menuStr = cart.map(i => `${i.name} (x${i.qty})`).join(', ');

    document.getElementById('step-3').classList.remove('hidden');
    document.getElementById('step-2').style.opacity = "0.4";
    document.getElementById('step-2').style.pointerEvents = "none";
    
    document.getElementById('res-name').innerText = localStorage.getItem('u_name');
    document.getElementById('res-table').innerText = localStorage.getItem('u_table');
    document.getElementById('res-summary').innerHTML = `
        <p><b>Menu:</b> ${menuStr}</p>
        <p><b>Notes:</b> ${notes.join(', ') || 'Polos'}</p>
        <p style="margin-top:10px; color:var(--primary)"><i>Pembayaran lagi diverifikasi admin...</i></p>
    `;
}

function adminAction() {
    const icon = document.getElementById('stat-icon');
    icon.innerText = "👨‍🍳";
    icon.classList.remove('pulse');
    document.getElementById('stat-title').innerText = "Lagi Dimasak!";
    document.getElementById('stat-title').style.color = "#27ae60";
    setTimeout(() => { document.getElementById('btn-reset').classList.remove('hidden'); }, 1500);
}