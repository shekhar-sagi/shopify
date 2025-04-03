/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */
import fetchCartDetails from '../../scripts/cart-page.js';

export default async function decorate(block) {
  console.log('Table block');
  const productCard = document.createElement('div');
  productCard.className = 'product-card';
  const productCardCol1 = document.createElement('div');
  productCardCol1.className = 'col1';
  const productCardCol2 = document.createElement('div');
  productCardCol2.className = 'col2';

  const productImg = document.createElement('img');
  productCardCol1.append(productImg);
  const productDetailTemplate = '<div>title</div><div>price</div><div>description</div>';
  productCardCol2.innerHTML = productDetailTemplate;
  productCard.append(productCardCol1, productCardCol2);
  const cartId = 'gid://shopify/Cart/Z2NwLWFzaWEtc291dGhlYXN0MTowMUpROFgxRTJEV0E5VjIxVlFESEVHQlRBMg'; // Replace with actual product I

  // call to fetch cart
  try {
    console.log(cartId);
    const cart = await fetchCartDetails(cartId);
    console.log(cart);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Shopify API Error:', err);
  }

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  table.append(thead);
  table.append(tbody);
  const tabl = {
    head: {
      headIndex: 0,
      cells: [{
        cellIndex: 0,
        cellValue: 'PRODUCT',
      },
      {
        cellIndex: 1,
        cellValue: 'QUANTITY',
      },
      {
        cellIndex: 2,
        cellValue: 'TOTAL',
      }],
    },
    row: [{
      rowIndex: 0,
      cells: [{
        cellIndex: 0,
        cellValue: 'cell 1',
      },
      {
        cellIndex: 0,
        cellValue: 'cell 2',
      },
      {
        cellIndex: 0,
        cellValue: 'cell 3',
      }],
    }],
  };
  console.log(tabl.row);

  tabl.head.cells.forEach((cell) => {
    console.log(cell);
    const tcell = document.createElement('th');
    tcell.textContent = cell.cellValue;
    thead.append(tcell);
  });

  tabl.row.forEach((row1) => {
    const trow = document.createElement('tr');
    tbody.append(trow);
    console.log(row1.cells);
    row1.cells.forEach((cell, cellIndex) => {
      const tcell = document.createElement('td');
      if (cellIndex === 0) {
        tcell.append(productCard);
        trow.append(tcell);
      } else if (cellIndex === 2) {
        tcell.textContent = '$100';
      } else {
        tcell.textContent = 'counter';
      }
      trow.append(tcell);
    });
  });

  block.innerHTML = '';
  block.append(table);
}
