// Global variables
let items = [];
let editIndex = -1;

// DOM manipulation functions
function openAddItemForm() {
    document.getElementById('add-item-form').style.display = 'block';
}

function closeAddItemForm() {
    document.getElementById('add-item-form').style.display = 'none';
    resetForm();
}

function resetForm() {
    document.getElementById('description').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('unit-price').value = '';
    editIndex = -1;
}

// Item management functions
function addItem() {
    const description = document.getElementById('description').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value);
    const unitPrice = parseFloat(document.getElementById('unit-price').value);

    if (!description || isNaN(quantity) || isNaN(unitPrice)) {
        alert('Please fill in all fields with valid values');
        return;
    }

    const total = quantity * unitPrice;

    if (editIndex > -1) {
        items[editIndex] = { description, quantity, unitPrice, total };
    } else {
        items.push({ description, quantity, unitPrice, total });
    }

    updateItemsTable();
    updateFormItemsTable();
    calculateSubtotal();
    resetForm();
    closeAddItemForm();
}

function updateItemsTable() {
    const tbody = document.getElementById('items-table-body');
    tbody.innerHTML = items.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.quantity}</td>
            <td>${item.description}</td>
            <td>₹${item.unitPrice.toFixed(2)}</td>
            <td>₹${item.total.toFixed(2)}</td>
        </tr>
    `).join('');
}

function updateFormItemsTable() {
    const tbody = document.getElementById('form-items-table-body');
    tbody.innerHTML = items.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>₹${item.unitPrice.toFixed(2)}</td>
            <td>₹${item.total.toFixed(2)}</td>
            <td>
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function editItem(index) {
    const item = items[index];
    document.getElementById('description').value = item.description;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('unit-price').value = item.unitPrice;
    editIndex = index;
    openAddItemForm();
}

function deleteItem(index) {
    items.splice(index, 1);
    updateItemsTable();
    updateFormItemsTable();
    calculateSubtotal();
}

// Calculation functions
function calculateSubtotal() {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('form-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    calculateTotal();
}

function calculateTotal() {
    const subtotal = parseFloat(document.getElementById('form-subtotal').textContent.replace('₹', ''));
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const total = Math.max(subtotal - discount, 0);

    document.getElementById('qrCode').innerHTML = '';
    document.getElementById('qrBtn').style.display = 'none';

    const qrInput = `upi://pay?pa=mjaseelakd@okicici&pn=Muhammed%20Jasil%20P&am=${total.toFixed(2)}&cu=INR&tn=bill`;
    
    new QRCode(document.getElementById('qrCode'), {
        text: qrInput,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    document.getElementById('form-total').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    
    const payLink = document.getElementById('payLink');
    payLink.setAttribute('href', qrInput);
}

// Printing function
function printInvoice() {
    const addItemForm = document.getElementById('add-item-form');
    const addItemButton = document.querySelector('.add-item-button');
    addItemForm.style.display = 'none';
    addItemButton.style.display = 'none';

    setTimeout(() => {
        window.print();
        setTimeout(() => {
            addItemForm.style.display = 'block';
            addItemButton.style.display = 'block';
        }, 1000);
    }, 1000);
}

// Event listeners
document.getElementById('discount').addEventListener('input', function() {
    const discountValue = parseFloat(this.value) || 0;
    document.getElementById('disc').textContent = discountValue.toFixed(2);
    calculateTotal();
});

// Initialize the page
updateItemsTable();
updateFormItemsTable();
calculateSubtotal();