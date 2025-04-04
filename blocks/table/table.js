/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */
import {
  getCart,
  removeFromCart,
  addToCart,
  updateCartCount,
} from '../../scripts/cart-service.js';

function updateCounter(id, action) {
  const tr = document.querySelectorAll('tr');
  const targetTr = Array.from(tr).find((t) => t.id === id);
  const counter = targetTr.querySelector('.counter-val');
  const currentCount = parseInt(counter.textContent, 10);
  if (currentCount > 0) {
    counter.textContent = action === 'remove' ? currentCount - 1 : currentCount + 1;
  } else {
    counter.textContent = 0;
  }
}

function updateTotal(id) {
  const tr = document.querySelectorAll('tr');
  const targetTr = Array.from(tr).find((t) => t.id === id);
  const total = targetTr.querySelector('.total');
  const currentCount = parseInt(targetTr.querySelector('.counter-val').textContent, 10);
  const price = parseFloat(total.textContent);
  total.textContent = (price * currentCount).toFixed(2);

  // Calculate cart total
  const allTotals = document.querySelectorAll('.total');
  const cartTotal = Array.from(allTotals).reduce((sum, el) => sum + parseFloat(el.textContent), 0);
  document.querySelector('.button-container').parentElement.childNodes[0].textContent = `Estimated Total: $${cartTotal.toFixed(2)}`;
}

function handleCartEvents() {
  const removeBtns = document.querySelectorAll('.remove');
  const addBtns = document.querySelectorAll('.add');
  const deleteBtns = document.querySelectorAll('.delete');

  removeBtns.forEach((removeBtn) => {
    removeBtn.addEventListener('click', (event) => {
      removeFromCart({ id: event.target.closest('tr').id });
      updateCounter(event.target.closest('tr').id, 'remove');
      updateCartCount();
      updateTotal(event.target.closest('tr').id);
    });
  });

  addBtns.forEach((addBtn) => {
    addBtn.addEventListener('click', (event) => {
      addToCart({ id: event.target.closest('tr').id });
      updateCounter(event.target.closest('tr').id, 'add');
      updateCartCount();
      updateTotal(event.target.closest('tr').id);
    });
  });

  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener('click', (event) => {
      removeFromCart({ id: event.target.closest('tr').id });
      updateCartCount();
    });
  });
}
export default async function decorate(block) {
  const productList = getCart();
  // const totalVal = 0;
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  table.append(thead);
  table.append(tbody);
  const tableView = {
    tableHead: ['PRODUCT', 'QUANTITY', 'TOTAL'],
    tableRows: [],
  };
  productList.forEach((row1) => {
    tableView.tableRows.push(row1);
  });

  tableView.tableHead.forEach((thtext) => {
    const hcell = document.createElement('th');
    hcell.textContent = thtext;
    thead.append(hcell);
  });
  tableView.tableRows.forEach((trtext) => {
    const row = document.createElement('tr');
    row.id = trtext.id;
    tableView.tableHead.forEach((htext, index) => {
      const rcell = document.createElement('td');
      if (index === 0) {
        rcell.innerHTML = `<div class="product-card">
            <div class="card-left"><img src="${trtext.image}"></div>
            <div class="card-right"><p>${trtext.title}</p><p>$${trtext.price}</p><p></p></div>
         </div>`;
        row.append(rcell);
      } else if (index === 1) {
        rcell.innerHTML = `<span><span class="remove">-</span><span class="counter-val">${trtext.quantity}</span><span class="add">+</span></span><span class="delete">Delete</span></span>`;
        row.append(rcell);
      } else {
        rcell.innerHTML = `$<span class="total">${trtext.price}</span>`;
        row.append(rcell);
      }
    });
    tbody.append(row);
  });

  block.innerHTML = '';
  block.append(table);

  handleCartEvents();
}
