$(document).ready(function() {
  $('#catalog-table tbody').on('click', 'td:not(:has(button), :has(input[type="text"]))', function() {
    $(".card_holder").fadeIn(100);
    $(".box_main").fadeOut(100);
    $(".cataloge").fadeOut(100);
    $(".sortContainer").fadeOut(100);
    console.log("enter")
    var cakeId = $(this).data('cake-id');
    console.log(cakeId);
    $.ajax({
        type: 'POST',
        url: '/cake-info',
        data: { cakeId: cakeId },
        success: function(data) {
            console.log('Cake info retrieved successfully!');
            const cakeInfo = data;
            const html = `
              <div class="cake-info-card">
                <h2>${cakeInfo.cake_name}</h2>
                <p><img class="img" src="/images/${cakeInfo.cake_id}.jpg"></p>
                <p>Тип: ${cakeInfo.cake_type}</p>
                <p>Состав: ${cakeInfo.cake_info}</p>
                <p>Цена: ${cakeInfo.cake_price}</p>
              </div>
            `;
            $('#card_placeholder').html(html);
        }
    });
  });
  $('#close_card').on('click', function(){
    $(".card_holder").fadeOut(100);
    $(".box_main").fadeIn(100);
    $(".cataloge").fadeIn(100);
    $(".sortContainer").fadeIn(100);
  });
});