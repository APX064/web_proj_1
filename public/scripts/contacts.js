$(document).ready(() => {
    let callback_email = $('#callback_email');
    let name = $('#name');
    let callback_comment = $('#callback_comment');
    let callback_button = $('#callback_button');
    
    callback_email.mouseover(function() {
        checkForm();
    });
    name.mouseover(function() {
        checkForm();
    });
    callback_comment.mouseover(function() {
        checkForm();
    });
    callback_button.mouseover(function() {
        checkForm();
    });
    function checkForm() {
        if (callback_email.val() && name.val() && callback_comment.val()) {
            callback_button.prop('disabled', false);
        } else {
            callback_button.prop('disabled', true);
        }
    }
})