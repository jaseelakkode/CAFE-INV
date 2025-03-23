let items = [];
let editIndex = -1;

const toAddressInput = document.getElementById("to-address");
const receiptAddress = document.getElementById("recieptAddress");
const invoiceNumber = document.getElementById("invNumber");
const invInput = document.getElementById("invInput");
// Add an event listener to update <p> content as the input changes
invInput.addEventListener("input", function(){

    invoiceNumber.textContent = "CK" + invInput.value;
} )

toAddressInput.addEventListener("input", function () {
    receiptAddress.textContent = toAddressInput.value;
});

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

function addItem(event) {
    console.log(event);
    
    const description = document.getElementById('description').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const unitPrice = parseFloat(document.getElementById('unit-price').value);

    if (!description || !quantity || !unitPrice) {
        alert('Please fill in all fields');
        return;
    }

    const total = quantity * unitPrice;

    if (editIndex > -1) {
        
        items[editIndex] = { description, quantity, unitPrice, total };
        resetForm();
        let addItemButtonText = document.querySelector('.add-item').textContent="Add Item";
        

    } else {
        items.push({ description, quantity, unitPrice, total });
        resetForm();
    }
    document.getElementById("description").focus();
    updateItemsTable();
    updateFormItemsTable();
    calculateSubtotal();
   
}

function updateItemsTable() {
    const tbody = document.getElementById('items-table-body');
    tbody.innerHTML = '';

    items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                      <td class="txtAC">${index + 1}</td>
                      <td>${item.description}</td>
                      <td class="txtAC">${item.quantity}</td>
                    <td class="txtAL">${item.unitPrice.toFixed(2)}</td>
                    <td class="txtAR">${item.total.toFixed(2)}</td>
                  
        `;
        tbody.appendChild(row);
    });
}

function updateFormItemsTable() {
    const tbody = document.getElementById('form-items-table-body');
    tbody.innerHTML = '';

    items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${item.unitPrice.toFixed(2)}</td>
            <td>${item.total.toFixed(2)}</td>
            <td>
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editItem(index) {
    const item = items[index];
    document.getElementById('description').value = item.description;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('unit-price').value = item.unitPrice;
    let addItemButtonText = document.querySelector('.add-item').textContent="Update";
        
    editIndex = index;
  
}

function deleteItem(index) {
    items.splice(index, 1);
    updateItemsTable();
    updateFormItemsTable();
    calculateSubtotal();
}

function calculateSubtotal() {
    let subtotal = items.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('subtotal').textContent ="₹"+ subtotal.toFixed(2);
    document.getElementById('form-subtotal').textContent = "₹"+subtotal.toFixed(2);

    calculateTotal();
}

function calculateTotal(value) {
    const subtotalText = document.getElementById('form-subtotal').textContent;
    const subtotalWithoutExclamation = subtotalText.replace('₹', '');
    const subtotal = parseFloat(subtotalWithoutExclamation);
    
    
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const total = subtotal - discount;
     document.getElementById('qrCode').innerHTML = "";
    document.getElementById('qrBtn').style.display="none";
    var payTotal = document.getElementById('total').textContent="₹"+total;
    document.querySelector('#form-total').textContent= "₹"+total;
    // var numericPayTotal = payTotal.replace(/[^0-9.]/g, '');
   

// Convert the extracted string to a number (if needed)
// var payV = parseFloat(numericPayTotal);
//const qrInput = `upi://pay?pa=mjaseelakd@okicici&pn=Muhammed%20Jasil%20P&am=${total.toFixed(2)}&cu=INR&tn=bill`;
const qrInput = `upi://pay?pa=creativecircle452@okaxis&pn=Creative%20Kafe&am=${total.toFixed(2)}&cu=INR&tn=${receiptAddress.textContent}`;
    
new QRCode(document.getElementById('qrCode'), {
    text: qrInput,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});

    document.getElementById('form-total').textContent = "₹" + total.toFixed(2);
    document.getElementById('total').textContent = "₹"+ total.toFixed(2);
    var payLink = document.getElementById('payLink');
payLink.setAttribute('href', qrInput);
}

function printInvoice() {
    const addItemForm = document.getElementById('add-item-form');
    const addItemButton = document.querySelector('.add-item-button');
    addItemForm.style.display = 'none';
    addItemButton.style.display = 'none';

    setTimeout(printed, 1000);
    setTimeout(function() {
        addItemForm.style.display = 'block';
        addItemButton.style.display = 'block';    }, 2000);

    
}
function printed(){
     window.print();
   
     
}
document.getElementById('discount').addEventListener('input', function() {
    const discountValue = parseFloat(this.value) || 0; // Get the discount value from the input field
    document.getElementById('disc').textContent = discountValue.toFixed(2);
    calculateTotal();
});
