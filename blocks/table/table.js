/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */
import { getCart } from '../../scripts/cart-service.js';

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
    tableView.tableHead.forEach((index) => {
      const rcell = document.createElement('td');
      if (index === 0) {
        rcell.innerHTML = `<div class="product-card">
            <div class="card-left"><img src="${trtext.image}"></div>
            <div class="card-right"><p>${trtext.title}</p><p>$${trtext.price}</p><p></p></div>
         </div>`;
        row.append(rcell);
      } else if (index === 1) {
        rcell.innerHTML = `<span>${trtext.quantity}</span>`;
        row.append(rcell);
      } else {
        rcell.innerHTML = `<span>$${trtext.price}</span>`;
        row.append(rcell);
      }
    });
    tbody.append(row);
  });

  block.innerHTML = '';
  block.append(table);
}
