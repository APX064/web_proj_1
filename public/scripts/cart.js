$(document).ready(() => {
  updateCartPreview();
  $('#catalog-table tbody').on('click', '.add-to-cart', (e) => {
      const cakeId = $(e.target).data('cake-id');
      const quantityInput = $(e.target).siblings('.quantity');
      const quantity = $(e.target).siblings('.quantity').val();
      if (isNaN(quantity) || quantity <= 0){
        console.log("error");
        alert("Введите число больше 0!");
        quantityInput.val("1");
        return;
      }
      $.ajax({
        type: 'POST',
        url: '/add-to-cart',
        data: { cakeId: cakeId, quantity: quantity },
        success: () => {
          updateCartPreview();
        }
      });
    });

  $('#confirm-cart').on('click', () => {
    $.ajax({
      type: 'POST',
      url: '/confirm-cart',
      success: () => {
        alert('Cart confirmed!');
        updateCartPreview();
      }
    });
  });

  $('#cart-preview-body').on('click', '.remove-from-cart', (e) => {
      console.log("error")
      const cakeId = $(e.target).data('id');
      const index = parseInt(cakeId) - 1;
      const quantityValue = $(`button[data-id="${cakeId}"]`).closest('tr').find('#quantity').text();
      const quantityInput = $(e.target).siblings('input.quantity');
      const quantityToRemove = parseInt(quantityInput.val());
      if (isNaN(quantityToRemove) || quantityToRemove <= 0){
        console.log("error");
        alert("Введите число больше 0!");
        quantityInput.val("1");
        return;
      }
      if (quantityToRemove > quantityValue){
        console.log("error");
        alert("Введено недопустимое число!");
        quantityInput.val("1");
        return;
      }
      console.log(`Removing ${quantityToRemove} units of cake ${cakeId}`);
      $.ajax({
        type: 'POST',
        url: '/remove-from-cart',
        data: { cakeId: cakeId, quantity: quantityToRemove },
        success: () => {
          updateCartPreview();
        }
      });
    });

  function updateCartPreview() {
      let totalItemsCost = 0;
      $.get('/cart-preview', function(data) {
          let totalCost = 0;
          
          $('#cart-preview-body').empty();
          data.forEach(item => {
              const row = `
              <tr>
                  <td><button data-id="${item.cake_id}" class="remove-from-cart">Удалить</button>
                  <input type="number" class="quantity" value="1" min="1" max="${item.quantity}"></td>
                  <td>${item.cake_name}</td>
                  <td>${item.cake_price}</td>
                  <td id="quantity">${item.quantity}</td>
                  <td>${item.cake_price * item.quantity}</td>
              </tr>
              `;
              console.log(item.cake_id)
              totalCost += item.cake_price * item.quantity;
              totalItemsCost += totalCost;
              $('#cart-preview-body').append(row);
          });
          $('#total-cost').text(totalCost);
          $('#total-items-cost').text(totalCost);
      });
  }
});