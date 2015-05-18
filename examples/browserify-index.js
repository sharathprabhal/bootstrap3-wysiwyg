var $ = require('jquery');
var wysihtml5 = require('../src/bootstrap3-wysihtml5');

$('.textarea').wysihtml5({
});

$('#btn-settext').on('click', function(e) {
	$('.textarea').html('<b>Some</b>+ text dynamically set.');
	e.preventDefault();
});