$(document).ready(function(){
    $("#deleteButton").click(function() {
        $("#deleting").toggle(100);
        $(".addForm").fadeOut(100);
        $("#changing").fadeOut(100);
    });

    $("#selectionButton").click(function() {
        $("#changing").toggle(100);
        $("#deleting").fadeOut(100);
        $(".addForm").fadeOut(100);
    });

    $("#addButton").click(function() {
        $(".addForm").toggle(100);
        $("#changing").fadeOut(100);
        $("#deleting").fadeOut(100);
    });
    $("#closeAddButton").click(function() {
        $(".addForm").toggle(100); 
    });

    $('#addFormFields').on('submit', function(e){
        e.preventDefault();
        console.log("111")
        if ($("#addName").val() == "") {
          $("#addName").css("border", "1px solid red");
        } else {
          $("#addName").css("border", "1px solid green");
        }
      
        if ($("#addType").val() == "") {
          $("#addType").css("border", "1px solid red");
        } else {
          $("#addType").css("border", "1px solid green");
        }
      
        if ($("#addImg").val() == "") {
            $("#addImg").css("border", "1px solid red");
          } else {
            $("#addImg").css("border", "1px solid green");
          }

        if ($("#addInfo").val() == "") {
          $("#addInfo").css("border", "1px solid red");
        } else {
          $("#addInfo").css("border", "1px solid green");
        }
      
        if ($("#addPrice").val() == "") {
          $("#addPrice").css("border", "1px solid red");
        } else {
          $("#addPrice").css("border", "1px solid green");
        }
      
        if ($("#addImg").val() != "" && $("#addName").val() != "" && $("#addType").val() != "" && $("#addInfo").val() != "" && $("#addPrice").val() != "") {
          this.submit();
        }
    })

    $('#updateFormFields').on('submit', function(e){
        e.preventDefault();
        console.log("111")
        if ($("#updName").val() == "") {
          $("#updName").css("border", "1px solid red");
        } else {
          $("#updName").css("border", "1px solid green");
        }
      
        if ($("#updType").val() == "") {
          $("#updType").css("border", "1px solid red");
        } else {
          $("#updType").css("border", "1px solid green");
        }
      
        if ($("#updImg").val() == "") {
            $("#updImg").css("border", "1px solid red");
          } else {
            $("#updImg").css("border", "1px solid green");
          }

        if ($("#updInfo").val() == "") {
          $("#updInfo").css("border", "1px solid red");
        } else {
          $("#updInfo").css("border", "1px solid green");
        }
      
        if ($("#updPrice").val() == "") {
          $("#updPrice").css("border", "1px solid red");
        } else {
          $("#updPrice").css("border", "1px solid green");
        }
      
        if ($("#updImg").val() != "" && $("#updName").val() != "" && $("#updType").val() != "" && $("#updInfo").val() != "" && $("#updPrice").val() != "") {
          this.submit();
        }
    })
})
$(document).on("click", "#btn_update", function() {
    $(".updateForm").toggle(100);
    $("#updId").val($(this).data("id"))
    $("#updName").val($(this).data("name"));
    $("#updType").val($(this).data("type"));
    $("#updInfo").val($(this).data("info"));
    $("#updPrice").val($(this).data("price"));
    $("#updFormAmm").val($(this).data("amm"));
    $("#updFormPrc").val($(this).data("prc"));
});
$(document).on("click", "#changeUpdButton", function() {
    console.log(`id: ${$("#updFormId").val()}`);
    console.log(`man: ${$("#updFormMan").val()}`);
    console.log(`nm: ${$("#updFormNm").val()}`);
    console.log(`amm: ${$("#updFormAmm").val()}`);
    console.log(`prc: ${$("#updFormPrc").val()}`);
});
$(document).on("click", "#closeUpdButton", function() {
    $(".updateForm").toggle(100);
});

$('#addFormFields').on('submit', function(e){
    e.preventDefault();
    console.log("111")
    if ($("#addName").val() == "") {
      $("#addName").css("border", "1px solid red");
    } else {
      $("#addName").css("border", "1px solid green");
    }
  
    if ($("#addType").val() == "") {
      $("#addType").css("border", "1px solid red");
    } else {
      $("#addType").css("border", "1px solid green");
    }
  
    if ($("#addInfo").val() == "") {
      $("#addInfo").css("border", "1px solid red");
    } else {
      $("#addInfo").css("border", "1px solid green");
    }
  
    if ($("#addPrice").val() == "") {
      $("#addPrice").css("border", "1px solid red");
    } else {
      $("#addPrice").css("border", "1px solid green");
    }
  
    if ($("#addName").val() != "" && $("#addType").val() != "" && $("#addInfo").val() != "" && $("#addPrice").val() != "") {
      $("#addFormFields").submit();
    }
})


$("#addFinButton").click(function(e) {
    e.preventDefault();
  
    if ($("#addName").val() === "") {
      $("#addName").css("border", "1px solid red");
    } else {
      $("#addName").css("border", "1px solid green");
    }
  
    if ($("#addType").val() === "") {
      $("#addType").css("border", "1px solid red");
    } else {
      $("#addType").css("border", "1px solid green");
    }
  
    if ($("#addInfo").val() === "") {
      $("#addInfo").css("border", "1px solid red");
    } else {
      $("#addInfo").css("border", "1px solid green");
    }
  
    if ($("#addPrice").val() === "") {
      $("#addPrice").css("border", "1px solid red");
    } else {
      $("#addPrice").css("border", "1px solid green");
    }
  
    if ($("#addName").val() !== "" && $("#addType").val() !== "" && $("#addInfo").val() !== "" && $("#addPrice").val() !== "") {
      $("form").submit();
    }
  });

$(document).on("click", "#deleteSelected", function() {
    const selectedIds = [];
    const selectedRows = $('input[name="selectedRows[]"]:checked');
    selectedRows.each(function() {
        selectedIds.push($(this).val());
    });
    if (selectedIds.length == 0){
        alert("Выберите хотя бы одну запись для удаления");
        return;
    }

    $.ajax({
        url: '/deletingSelected',
        type: 'DELETE',
        data: JSON.stringify({ selectedIds }),
        contentType: 'application/json',
        success: function(data) {
            alert(data.message);
            location.href = '/admin';
        },
        error: function(xhr, status, error) {
            alert('Возникла ошибка');
            console.log('Error: ', error);
        }
    });
});