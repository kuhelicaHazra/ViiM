$('#epcoteHotelClose').on('click', function(e){
    document.getElementById('defaultSubscriptionFormPassword').value = '';
    document.getElementById('defaultSubscriptionFormEmail').value = '';
    document.getElementById('textInput').value = '';
    $('#checkbox1').removeAttr('checked');
    $('#checkbox2').removeAttr('checked');
    $('#checkbox3').removeAttr('checked');
    document.getElementById('select').selectedIndex = 0;
});

$('#showConfirmation1').on('click', function(e){
    document.getElementById('defaultSubscriptionFormPassword').value = '';
    document.getElementById('defaultSubscriptionFormEmail').value = '';
    document.getElementById('textInput').value = '';
    $('#checkbox1').removeAttr('checked');
    $('#checkbox2').removeAttr('checked');
    $('#checkbox3').removeAttr('checked');
    document.getElementById('select').selectedIndex = 0;
});

$('#bookHotelClose').on('click', function(e){
    document.getElementById('defaultSubscriptionFormPassword1').value = '';
    document.getElementById('defaultSubscriptionFormEmail1').value = '';
    document.getElementById('textInput1').value = '';
    document.getElementById('select1').selectedIndex = 0;
});
 
$('#showConfirmation2').on('click', function(e){
    document.getElementById('defaultSubscriptionFormPassword1').value = '';
    document.getElementById('defaultSubscriptionFormEmail1').value = '';
    document.getElementById('textInput1').value = '';
    document.getElementById('select1').selectedIndex = 0;
});