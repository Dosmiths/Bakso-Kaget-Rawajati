let cart = [];

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    if (body.classList.contains('dark-theme')) {
        body.classList.replace('dark-theme', 'light-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.replace('light-theme', 'dark-theme');
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

// Fitur Baru: Modern Chip Toggle
function toggleChip(el) {
    el.classList.toggle('active');
}

function startOrder() {
    const name = document.getElementById('cust-name').value;
    const table = document.getElementById('cust-table').value;
    if(!name || !table) return alert("Woi, isi dulu datanya!");
    
    localStorage.setItem('u_name', name);
    localStorage.setItem('u_table', table);
    
    document.getElementById('step-2').classList.remove('hidden');
    document.getElementById('menu-title').innerText = `ORDER FOR ${name.toUpperCase()}`;
    document.getElementById('step-1').style.opacity = "0.4";
}

function addItem(itemName, price) {
    const existing = cart.find(i => i.name === itemName);
    if(existing) {
        existing.qty++;
    } else {
        cart.push({ name: itemName, price: price, qty: 1 });
    }
    renderCart();
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
    
    if(cart.length === 0) {
        list.innerHTML = '<p class="empty-msg" style="font-size: 11px; color: var(--text-muted);">Belum ada pesanan...</p>';
        totalDisp.innerText = "Total: Rp 0";
        return;
    }

    list.innerHTML = '';
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
            </div>`;
    });
    totalDisp.innerText = `Total: Rp ${total.toLocaleString()}`;
}

function showQRIS() {
    if(cart.length === 0) return alert("Pilih menu dulu!");
    document.getElementById('menu-wrapper').classList.add('hidden');
    document.getElementById('qris-area').classList.remove('hidden');
}

function confirmPayment() {
    // Ambil nilai dari chips yang aktif
    const notes = Array.from(document.querySelectorAll('.chip.active')).map(chip => chip.innerText);
    const menuStr = cart.map(i => `${i.name} (x${i.qty})`).join(', ');

    document.getElementById('step-3').classList.remove('hidden');
    document.getElementById('step-2').style.opacity = "0.4";
    
    document.getElementById('res-name').innerText = localStorage.getItem('u_name');
    document.getElementById('res-table').innerText = localStorage.getItem('u_table');
    document.getElementById('res-summary').innerHTML = `
        <p><b>Items:</b> ${menuStr}</p>
        <p style="margin-top:5px;"><b>Notes:</b> ${notes.join(', ') || 'Normal / Tidak ada catatan'}</p>
    `;
}

function adminAction() {
    const icon = document.getElementById('stat-icon');
    icon.innerText = "👨‍🍳";
    icon.classList.remove('pulse');
    document.getElementById('stat-title').innerText = "LAGI DIMASAK!";
    document.getElementById('stat-title').style.color = "#2ed573";
    setTimeout(() => { 
        document.getElementById('btn-reset').classList.remove('hidden'); 
    }, 1000);
}