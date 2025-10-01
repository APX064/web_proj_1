$(document).ready(function(){
    $("#selectionButton").click(function() {
        $("#changing").toggle(100);
        $(".addForm").fadeOut(100);
    });

    $("#addButton").click(function() {
        $(".addForm").toggle(100);
        $("#changing").fadeOut(100);
    });
    $("#closeAddButton").click(function() {
        $(".addForm").toggle(100); 
    });

})
$(document).on("click", "#btn_update", function() {
    $(".updateForm").toggle(100);
    $("#updId").val($(this).data("id"));
    $("#updUsername").val($(this).data("login"))
    $("#updEmail").val($(this).data("email"));
    $("#updRole").val($(this).data("role"));
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



