$(document).ready(function() {
    $('#confirmSuccess123').hide();
    $('#confirmSuccess122').hide();
    $('#confirmSuccess121').hide();
});

$('#showConfirmation2').click(function() {
    $('#confirmSuccess123').show();
    $('#confirmSuccess122').show();
    $('#confirmSuccess121').show();
    $('#bookHotel').hide();
});
$('#showConfirmation1').click(function() {
    $('#confirmSuccess123').show();
    $('#confirmSuccess122').show();
    $('#confirmSuccess121').show();
    $('#epcoteHotel').hide();
});
$('.closeAlert').click(function() {
    $('#confirmSuccess123').hide();
    $('#confirmSuccess122').hide();
    $('#confirmSuccess121').hide();
});