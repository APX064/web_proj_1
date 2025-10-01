$( document ).ready(function(){
    if ($("#login").length) {
        console.log("Exists")
        $("#log_password").keyup(function(){
            let nm = $("#log_username").val();
            let pw = $("#log_password").val();
            if(nm == "" || pw == ""){
                $("#log_but").prop("disabled", true);
            }
            else{
                $("#log_but").prop("disabled", false);
            }
        })
        $("#log_username").keyup(function(){
            let nm = $("#log_username").val();
            let pw = $("#log_password").val();
            if(nm == "" || pw == ""){
                $("#log_but").prop("disabled", true);
            }
            else{
                $("#log_but").prop("disabled", false);
            }
        })

        $("#reg_password").keyup(function(){
            let nm = $("#reg_username").val();
            let pw = $("#reg_password").val();
            let em = $("#reg_email").val();
            if(nm == "" || pw == "" || em == ""){
                $("#reg_but").prop("disabled", true);
            }
            else{
                $("#reg_but").prop("disabled", false);
            }
        })
        $("#reg_email").keyup(function(){
            let nm = $("#reg_username").val();
            let pw = $("#reg_password").val();
            let em = $("#reg_email").val();
            if(nm == "" || pw == "" || em == ""){
                $("#reg_but").prop("disabled", true);
            }
            else{
                $("#reg_but").prop("disabled", false);
            }
        })
        $("#reg_username").keyup(function(){
            let nm = $("#reg_username").val();
            let pw = $("#reg_password").val();
            let em = $("#reg_email").val();
            if(nm == "" || pw == "" || em == ""){
                $("#reg_but").prop("disabled", true);
            }
            else{
                $("#reg_but").prop("disabled", false);
            }
        })

        $("#ans_reg_btn").click(function(){
            $("#login").hide();
            $("#reg").show();
        })
        $("#ans_log_btn").click(function(){
            $("#login").show();
            $("#reg").hide();
        })

    } 
    else 
        {
        console.log("Not exists")
    }
});