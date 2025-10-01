$(document).ready(function() {
    var table = $('#cataloge table');
    var sortingDiv = $('#sorting');
    var filteringDiv = $('#filtering');
    console.log(filteringDiv)
    filteringDiv.on('keyup', '#name-filter', function() {
        var nameFilter = $(this).val().toLowerCase();
        var rows = table.find('tbody tr');

        rows.each(function() {
            var rowText = $(this).find('td:nth-child(3)').text().toLowerCase();
            if (rowText.indexOf(nameFilter) === -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });

    filteringDiv.on('change', 'input[type="checkbox"]', function() {
        var typeFilter = [];
        filteringDiv.find('input[type="checkbox"]:checked').each(function() {
            typeFilter.push($(this).val().toLowerCase());
            console.log(typeFilter)
        });

        var t_rows = table.find('tbody tr');

        if (typeFilter.length === 0) {
            t_rows.show();
        } else {
            t_rows.hide();
            t_rows.each(function() {
                var rowType = $(this).find('td:nth-child(4)').text().toLowerCase();
                console.log(rowType)
                for (var i = 0; i < typeFilter.length; i++) {
                    console.log(typeFilter[i])
                    console.log(rowType.indexOf(typeFilter[i]))
                    if (rowType.indexOf(typeFilter[i])!== -1) {
                        $(this).show();
                        return;
                    }
                }
            });
        }
    });

    sortingDiv.on('click', 'button', function() {
        var columnIndex = $(this).data('column-index');
        var order = $(this).data('order');
        var s_rows = table.find('tbody tr').get();
    
        s_rows.sort(function(a, b) {
            var aValue = $(a).find('td').eq(columnIndex).text();
            var bValue = $(b).find('td').eq(columnIndex).text();
    
            if (columnIndex === 2) {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            } else if (columnIndex === 4) {
                aValue = parseInt(aValue);
                bValue = parseInt(bValue);
            }
    
            if (order === 'asc') {
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
            } else {
                if (aValue < bValue) return 1;
                if (aValue > bValue) return -1;
            }
            return 0;
        });
    
        table.find('tbody').html('');
        for (var i = 0; i < s_rows.length; i++) {
            table.find('tbody').append(s_rows[i]);
        }
    
        sortingDiv.find('button').each(function() {
            if ($(this).data('column-index') === columnIndex) {
                $(this).data('order', order === 'asc' ? 'desc' : 'asc');
                $(this).text(order === 'asc' ? 'По убыванию' : 'По возрастанию');
            } else {
                $(this).data('order', 'asc');
                $(this).text('По возрастанию');
            }
        });
    });

    $('#resetBtn').click(function() {
        filteringDiv.find('#name-filter').val('');
        filteringDiv.find('input[type="checkbox"]').prop('checked', false);

        sortingDiv.find('button').each(function() {
            $(this).data('order', 'asc');
            $(this).text('По возрастанию');
        });

        table.find('tbody tr').show();
    });

    $('#closeInfoBox').click(function() {
        $("#inofBox").hide();
    });
});