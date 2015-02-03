/* tabs */
function tabs(){
	var tabWrap = $('.tabs-wrap');
	tabWrap.each(function(){
		var thisTabWrap = $(this);
		var tabControl = thisTabWrap.find('.tab-controls');
		var controlItem = tabControl.find('a');
		var itemControl = tabControl.find('li.active').index();
		var tabsWrap = thisTabWrap.find('.tabs');
		var tab = tabsWrap.find('.tab');
		tab.eq(itemControl).fadeIn(0).siblings().fadeOut(0);
		controlItem.on('click', function(e){
			var $this = $(this);
			var index = $this.parents('li').index();
			if ( !$this.parents('li').hasClass('active') ) {
				$this.parents('li').addClass('active').siblings().removeClass('active');
				tab.fadeOut(0).eq(index).fadeIn(300);
			}
			e.preventDefault();
		});
	});
}
/* tabs end */

/* initPrice */
function initPrice(){
	
	var table = $('#table1').tablePrice({
		space: true,
		initCost: '.def-price',
		amount: '.product-summ',
		totalSelector: '#total-cost span',
		deleteSelector: 'delete-product'
	});
	var table2 = $('#table2').tablePrice({
		space: true,
		type: 'float',
		initCost: '.def-price',
		amount: '.product-summ',
		totalSelector: '#total-cost2 span',
		deleteSelector: 'delete-product'
	});
	var table3 = $('#table3').tablePrice({
		space: true,
		type: 'float',
		initCost: '.def-price',
		dataAttr: 'defprice',
		amount: '.product-summ',
		pennySelector: 'i',
		totalPenny: 'i',
		totalSelector: '#total-cost3 span',
		deleteSelector: 'delete-product'
	});
	var table4 = $('#table4').tablePrice({
		space: true,
		type: 'float',
		initCost: '.def-price',
		dataAttr: 'defprice',
		devider: ',',
		amount: '.product-summ',
		totalSelector: '#total-cost4 span',
		deleteSelector: 'delete-product'
	});
	
	
	// with ui spinner
	var table5 = $('#table5').tablePrice({
		space: true,
		initCost: '.def-price',
		amount: '.product-summ',
		totalSelector: '#total-cost5 span',
		deleteSelector: 'delete-product'
	});
	
	$('#table5 .spinner').spinner({
		spin: function(event, ui){
			setTimeout(function(){
				table5.update();
			}, 2);
		},
		min: 1
	});
	
	// total in another block
	var table6 = $('#table6').tablePrice({
		space: true,
		initCost: '.def-price',
		amount: '.product-summ',
		totalSelector: '#total-cost6 span',
		deleteSelector: 'delete-product',
		afterChange: countAllTotals
	});
	
	function countAllTotals(){
		var totalPrice = table6.getTotalPrice();
		var withDelivery = totalPrice + 15;
		var discount = parseInt(withDelivery*0.03);
		var withDiscount = withDelivery-discount;
		$('#total-cost6-ather span').html(totalPrice);
		$('#total-cost6-deliver span').html(withDelivery);
		$('#total-cost6-deliver-bonus span').html(withDiscount);
	}
	countAllTotals();
	
	
	// for product
	
	var checkedWeight = $('[name="product_weight"]:checked').data('weight-cost');
	$('.product [data-cost]').data('cost', checkedWeight);
	
	var productTable = $('.product-holder').tablePrice({
		space: true,
		forEach: '.product',
		initCost: '.amount-cost',
		dataAttr: 'cost',
		amount: '.amount-cost em',
		totalSelector: '.amount-cost span',
		wrapTable: false,
		afterChange: function(){
			$('#custom').attr('checked', 'checked');
		}
	});
	
	$('.product .spinner').spinner({
		spin: function(event, ui){
			setTimeout(function(){
				productTable.update();
				$('#custom').attr('checked', 'checked');
			}, 2);
		},
		min: 1
	});
	
	// Вес товара и его стоимость
	var radio = $('[name="product_weight"]');
	if("onpropertychange" in radio) { 
		radio.on('onpropertychange', function(e){
			if (e.propertyName == "checked") {
				var newCost = $(this).data('weight-cost');
				$('.product [data-cost]').data('cost', newCost);
				productTable.update();
			}
		});
	} else {
		radio.on('change', function(e){
			if ( $(this).is(':checked') ) {
				var newCost = $(this).data('weight-cost');
				$('.product [data-cost]').data('cost', newCost);
				productTable.update();
			}
		});
	}
	
	// Быстро выбрать кол-во товара
	var radioNum = $('[name="product_num"]');
	if("onpropertychange" in radioNum) { 
		radioNum.on('onpropertychange', function(e){
			if (e.propertyName == "checked") {
				if ( !$(this).attr('id') ){
					var newNum = $(this).data('weight-cost');
					$('.product .spinner').val(newNum);
					productTable.update();
				}
			}
		});
	} else {
		radioNum.on('change', function(e){
			if ( $(this).is(':checked') ) {
				if ( !$(this).attr('id') ){
					var newNum = $(this).data('weight-cost');
					$('.product .spinner').val(newNum);
					productTable.update();
				}
			}
		});
	}
}
/* initPrice end */

/* totop */
function totop(){
  $('.totop').on('click', function(){
    $('html, body').animate({scrollTop: 0}, 200);
  });
}
/* totop end */

/* scrollLinks */
function scrollLinks(parent, indent, delay){
	var links = $(parent).find('a');
	$(links).each(function(index, item){
		var id = $(item).attr('href');
		if ( id.length ){
			$(item).on('click', function(e){
				var idOffset = $(id).offset().top - indent;
				$('html, body').animate({ scrollTop: idOffset }, delay);
				e.preventDefault();
			});
		}
	});
}
/* scrollLinks end */

/** ready/load/resize document **/

$(document).ready(function(){
	initPrice();
  totop();
  scrollLinks($('.examples-menu li'), 20, 300);
});