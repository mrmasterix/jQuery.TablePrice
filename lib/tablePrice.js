// cookie
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
		} catch(e) {
			return;
		}

		try {
			// If we can't parse the cookie, ignore it, it's unusable.
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));

;(function($){
	
	// удаляет пробелы в числах
	function num_length_val(num_val){
		var str = '';
		num_val = num_val + ' ';
		str = num_val.replace(/\s+/g,'');
		return str;
	}
	// добавляет пробелы в числах
	function val_space(n) {
		n += "";
		n = new Array(4 - n.length % 3).join("U") + n;
		return n.replace(/([0-9U]{3})/g, "$1 ").replace(/U/g, "");
	}
	
	$.fn.tablePrice = function( settings ) {
	
		// constants classes
		var reserved = $.extend({
			tableWrapper: 'tp-wrapper',
			totalWrapper: 'tp-total',
			tableClass: 'tp-table',
			theadClass: 'tp-thead',
			tbodyClass: 'tp-tbody',
			tfootClass: 'tp-tfoot'
		}, reserved);

		// defaults
		var settings = $.extend({
			// options
			init: true,
			wrapTable: true,
			forEach: 'tbody tr',
			space: false,
			cookie: false,
			type: 'integer',
			floatFixed: 2,
			spinner: '.spinner',
			inputChange: true,
			initCost: '.tp-default-price',
			amount: '.tp-product-amount',
			dataAttr: null,
			totalSelector: '#total-cost',
			pennySelector: null,
			totalPenny: null,
			devider: null,
			deleteSelector: 'tp-delete',
			deleteDuraction: 300,
			emptyTPL: '<div class="tp-empty-table" style="text-align: center">Корзина пуста</div>',
			
			// callbacks
			create: function(){},
			beforeChange: function(){},
			afterChange: function(){},
			beforeDelete: function(){},
			afterDelete: function(){},
			onTableDel: function(){}
		}, settings);
		
		if(this.length == 0) return this;
		
		
		// init this elements
		var plugin = {};
		var table = $(this);
		var el = this;
		var elemBox = table.find(settings.forEach);
		
		// support mutltiple elements
		if(this.length > 1){
			this.each(function(){$(this).tablePrice(settings)});
			return this;
		}

		var init = function(){
			// init plugin options
			plugin.settings = $.extend({}, settings, reserved);
			// init plugin for each elements dose the tablePrice will be work
			plugin.forEach = plugin.settings.forEach;
			// init plugin total selector
			plugin.totalSelector = plugin.settings.totalSelector;
			// init plugin data type
			plugin.type = plugin.settings.type;
			// init plugin toFixed number
			plugin.floatFixed = plugin.settings.floatFixed;
			// init plugin delete duraction
			plugin.deleteDuraction = plugin.settings.deleteDuraction;
			// init plugin penny selector
			plugin.pennySelector = plugin.settings.pennySelector;
			// init plugin total penny selector
			plugin.totalPenny = plugin.settings.totalPenny;
			
			// get started
			checkErrors();
			if ( settings.cookie ) setCookieSpinners();
			if ( settings.init ) setup();
		}
		
		
		// errors
		var checkErrors = function(){
			// wrong data type
			if ( !(settings.type == 'float') ) {
				if ( settings.pennySelector || settings.devider )
				throw new Error("jQuery tablePrice plugIn: Data type does not correct. Set the 'Float' type or disable devider.");
			}
			// not set dataAttr for penny
			if ( settings.pennySelector ) {
				if ( !settings.dataAttr )
				throw new Error('jQuery tablePrice plugIn: Set the dataAttr to get init price of product.');
			}
			
			if ( !elemBox.length ) {
				checkChildrens();
			}
		}
		
		// set cookies to spinners
		var setCookieSpinners = function(){
			if ( settings.cookie ){
				var spinners = table.find(settings.spinner);
				var spinnerCookie = $.cookie('spinnersArray');
				if ( spinnerCookie ) {
					spinnerCookie = spinnerCookie.split(',');
					$.each(spinners, function(i){
						if ( spinnerCookie ) {
							var currentSpinnerVal = spinnerCookie[i];
							$(spinners[i]).val(currentSpinnerVal);
						}
					});
				}
			}
		}
		
		// get cookies from spinners
		var getCookieSpinners = function(){
			if ( settings.cookie ){
				var allSpinners = table.find(settings.spinner);
				var spinnersArray = new Array();
				$.each(allSpinners, function(i){
					var val = $(allSpinners[i]).val();
					spinnersArray.push(val);
				});
				$.cookie('spinnersArray', spinnersArray.join(','));
			}
		}
		
		// delete cookie
		var deleteCookieSpinners = function(){	
			if ( settings.cookie ){
				var defaultSpinners = new Array();
				defaultSpinners = [1,1,1,1];
				$.cookie('spinnersArray', defaultSpinners);
			}
		}
		
		// get values of spinner in cookie
		var getCookeiSpinners = function(){
			if ( settings.cookie ) {
				var array = $.cookie('spinnersArray');
				array = array.split(',');
				return array;
			}
		}
		
		// setup
		var setup = function(){
			table.each(function(i){
				newElemBox = $(table[i]).find(settings.forEach);
			
				// callback create
				plugin.settings.create(table[i], newElemBox);
				
				// wrapItems of table, give them some reserved classes
				wrapItems();
				
				// check all items in table
				newElemBox.each(function(i, el){
					var curElemBox = $(el);
					var spinner = curElemBox.find(settings.spinner);
					// set all values in a row
					setValues(curElemBox, spinner);
					// init delete function
					deleteLine();
					// spinner change/keydown/keyup
					spinner.on('change', spinnerChange);
					spinner.on('keypress', spinnerKeydown);
					spinner.on('keyup', spinnerKeyup);
				});
			});
		}
		
		// spinnerChange
		var spinnerChange = function(e){
			if ( e.which == 32 ) {
				return false;
			} else {
				var spinner = $(this);
				var curElemBox = spinner.parents(plugin.forEach);
				
				var curVal = spinner.val();
				if ( curVal.length > 1 && /^0/.test(curVal) ) {
					var reNull = new RegExp(/^0*/);
					curVal = curVal.replace(reNull, '');
				}
				if ( !curVal.length ) curVal = 1;
				spinner.val(curVal);
				if ( settings.inputChange ) {
					setValues(curElemBox, spinner);
				}
			}
		}
		
		// spinnerKeyup
		var spinnerKeyup = function(e){
			var spinner = $(this);
			var curElemBox = spinner.parents(plugin.forEach);
			checkSpinInput(e, spinner);
			var curVal = spinner.val();
			if ( e.which == 32 || !(/^[0-9]*$/.test(curVal)) ) {
				curVal = (curVal.replace(/\s/, '')).replace(/\D/, '');
				if (!curVal.length) {curVal = 1}
				spinner.val(curVal);
			}
			else if ( e.which == 37 || e.which == 39 ) { return }
			
			
			
			// callback beforeChange
			plugin.settings.beforeChange(curElemBox, spinner);
			
			// get new value of spinner and re-count the table
			if ( settings.inputChange ) {
				setValues(curElemBox, spinner);
			}
			if ( settings.cookie ) getCookieSpinners()
			
			// callback beforeChange
			plugin.settings.afterChange(curElemBox, spinner);
		}
		
		var spinnerKeydown = function(e){
			var spinner = $(this);
			var curElemBox = spinner.parents(plugin.forEach);
			checkSpinInput(e, spinner);
		}
		
		// function to check inputs value and keyCodes
		function checkSpinInput(event, spinner) {
			// if Ctrl+A, home, end, arrows(left\right)
			if (
				event.keyCode == 46 ||
				event.keyCode == 8 ||
				event.keyCode == 9 ||
				event.keyCode == 27 ||
				(event.keyCode == 65 && event.ctrlKey === true) ||
				(event.keyCode >= 35 && event.keyCode <= 39)
			) {
			 
			 // max/min
			 if ( spinner.val() > 9999 ) {
					spinner.val(9999);
					return false;
				} else if ( spinner.val() < 1) {
					spinner.val(1);
					return false;
				}
			}
			else {
				// if its NaN
				if (!/^[0-9]*$/.test(spinner.val())) {
					event.preventDefault();
				} else {	// if number
					if ( spinner.val() > 9999 ) {
						spinner.val(9999 );
						return false;
					} else if ( spinner.val() < 1 ) {
						spinner.val(1);
						return false;
					}
				} 
			}
		}
		
		// checkChildrens
		var checkChildrens = function(){
			var tableParent = table.parents('.'+reserved.tableWrapper);
			table.remove();
			var totalWrapper = $(settings.totalSelector).parents('.'+reserved.totalWrapper);
			$(settings.totalSelector).remove();
			totalWrapper.remove();
			var tpl = settings.emptyTPL;
			tableParent.append(tpl);
			
			// callback onTableDelete
			plugin.settings.onTableDel();
		}
		
		// wrapItems
		function wrapItems(){
			table.addClass(reserved.tableClass);
			if ( settings.wrapTable ) {
				table.find('thead').addClass(reserved.theadClass);
				table.find('tbody').addClass(reserved.tbodyClass);
				table.find('tfoot').addClass(reserved.tfootClass);
				table.wrap('<div class="'+reserved.tableWrapper+'" />');
				$(settings.totalSelector).parent().wrap('<div class="'+reserved.totalWrapper+'" />');
			}
		}
		
		// wrapItems
		function unWrapItems(){
			table.removeClass(reserved.tableClass);
			if ( settings.wrapTable ) {
				table.find('thead').removeClass(reserved.theadClass);
				table.find('tbody').removeClass(reserved.tbodyClass);
				table.find('tfoot').removeClass(reserved.tfootClass);
				table.unwrap();
				$(settings.totalSelector).parent().unwrap();
			}
		}

		// setValues
		var setValues = function(curElemBox, spinner){
			var initCostSelector = curElemBox.find(settings.initCost);
			// if dataAttr true
			if ( settings.dataAttr ){
				var initCostNum = initCostSelector.data(settings.dataAttr);
			}
			else {
				if ( settings.pennySelector ) {
					if ( settings.type == 'float' ) {
						var initCostNum = initCostSelector.html();
						var initPenySelector = curElemBox.find(settings.pennySelector);
						var initPennyNum = initPenySelector.html();
						if ( settings.devider.length ) {
							initCostNum = (parseInt(initCostNum).toString()) + settings.devider + initPennyNum;
						} else {
							initCostNum = parseFloat((parseInt(initCostNum).toString())+'.'+ initPennyNum);
						}
					}
				} else {
					var initCostNum = initCostSelector.html();
				}
				
				if ( settings.space ) {
					initCostNum = num_length_val(initCostNum);
				}
				if ( settings.devider ) {
					var regularDevider = new RegExp(settings.devider, 'g');
					initCostNum = initCostNum.replace(regularDevider, '.');
				}
			}
			
			var amountElement = curElemBox.find(settings.amount);
			var spinnerVal = spinner.val();
			if ( settings.type == 'integer' ) {
				initCostNum = parseInt(initCostNum);
			}
			else if ( settings.type == 'float' ) {
				if ( settings.devider ) {
					var regularDevider = new RegExp(settings.devider, 'g');
					initCostNum = initCostNum.replace(regularDevider, '.');
				}
				var initCostNum = parseFloat(initCostNum);
			}
			var totalAmount = (initCostNum*spinnerVal);
			
			if ( settings.type == 'integer' ) {
				if ( settings.space ) {
					totalAmount = val_space(totalAmount);
				}
			}
			else if ( settings.type == 'float' ) {
				totalAmount = totalAmount.toFixed(settings.floatFixed);
				if ( settings.space ) {
					totalAmount = val_space(totalAmount);
					if ( settings.devider ) {
						totalAmount = totalAmount.replace(' .', settings.devider);
					} else {
						totalAmount = totalAmount.replace(' .', '.');
					}
				} else {
					if ( settings.devider ) {
						totalAmount = totalAmount.replace('.', settings.devider);
					} else {
						totalAmount = totalAmount.replace('.', '.');
					}
				}
			}
			
			if ( settings.pennySelector ) {
				if ( settings.type == 'float' ) {
					var pennyBox = curElemBox.find(settings.pennySelector);
					if ( settings.devider ) {
						priceArray = totalAmount.split(settings.devider);
					} else {
						priceArray = totalAmount.split('.');
					}
					totalAmount = priceArray[0];
					var penny = priceArray[1];
					amountElement.html(totalAmount);
					pennyBox.html(penny);
				}
			} else {
				amountElement.html(totalAmount);
			}
			
			var newElemBox = table.find(settings.forEach);
			
			setTotal(newElemBox);
		}

		// setTotal
		var setTotal = function(elemBox){
			var total = 0;
			var i = 0;
			for ( i; i < elemBox.length; i++ ){
				// если указано, что копейки находятся в другом блоке
				if ( settings.pennySelector ) {
					var penny = $(elemBox[i]).find(settings.pennySelector).html();
					var amountPrice = $(elemBox[i]).find(settings.amount).html();
					if ( settings.devider ) {
						var summ = amountPrice+settings.devider+penny;
					} else {
						var summ = amountPrice+'.'+penny;
					}
				} else {
					var summ = $(elemBox[i]).find(settings.amount).html();
				}
				
				if ( settings.type == 'integer' ) {
					if ( settings.devider ) {
						var regularDevider = new RegExp(settings.devider, 'g');
						summ = summ.replace(regularDevider, '.');
					}
					if ( settings.space ) {
						summ = num_length_val(summ);
					}
					var summ = parseInt(summ);
				}
				else if ( settings.type == 'float' ) {
					if ( settings.devider ) {
						var regularDevider = new RegExp(settings.devider, 'g');
						summ = summ.replace(regularDevider, '.');
					}
					if ( settings.space ) {
						summ = num_length_val(summ);
					}
					var summ = parseFloat(summ);
				}
				total += summ;
			}
			
			plugin.totalprice = total;
			
			if ( settings.type == 'float' ) {
				total = total.toFixed(settings.floatFixed);
			}
			if ( settings.devider && settings.type == 'float' ) {
				total = total.replace('.', settings.devider);
			}
			
			// устанавливаем полную сумму
			if ( settings.space ) {
				total = val_space(total);
				if ( settings.devider && !settings.pennySelector ) {
					total = total.replace(' '+settings.devider, settings.devider);
				} else {
					total = total.replace(' .', '.');
				}
			}
			
			if ( settings.pennySelector ) {
				if ( settings.devider ) {
					var totalArray = total.split(settings.devider);
				} else {
					var totalArray = total.split('.');
				}
				var total = totalArray[0];
				var totalPenny = totalArray[1];
				$(settings.totalSelector).html(total);
				$(settings.totalPenny).html(totalPenny);
			} else {
				$(settings.totalSelector).html(total);
				
			}
		}
			
		// deleteLine
		var deleteLine = function(){
			var deleteButton = table.find('.'+settings.deleteSelector);
			var spinner = table.find(settings.spinner);
			deleteButton.on('click', function(e){
				var curElemBox = $(this).parents(plugin.forEach);
				var index = curElemBox.index();
				var prevElemBox = curElemBox.prev();
				var nextElemBox = curElemBox.next();
				
				curElemBox.fadeOut(settings.deleteDuraction, function(){
				
					// callback beforeDelete
					plugin.settings.beforeDelete(curElemBox, prevElemBox, nextElemBox);
					
					curElemBox.remove();
					var elemBoxNew = table.find(settings.forEach);
					// проверяем, есть ли еще продукты в корзине
					if ( elemBoxNew.length ) {
						// есть
						elemBoxNew.each(function(i, el){
							var curElemBoxNew = $(el);
							var spinner = curElemBoxNew.find(settings.spinner);
							setValues(curElemBoxNew, spinner);
						});
						
						// callback beforeDelete
						plugin.settings.afterDelete();
						
					} else {
						// нету
						table.fadeOut(settings.deleteDuraction, function(){
							checkChildrens();
						});
					}
				});
				e.preventDefault();
			});
		}
		
		// ----------- methods ---------- //
		
		// getTotalPrice
		el.getTotalPrice = function(){
			return plugin.totalprice;
		}
		
		// getSpinners
		el.getSpinners = function(){
			var spinners = new Array();
			spinnersArray = table.find(settings.spinner).toArray();
			$.each(spinnersArray, function(i){
				var spinnerValue = $(spinnersArray[i]).val();
				spinners.push(spinnerValue);
			});
			return spinners
		}
		
		// get cookie of spinners
		el.getCookie = getCookeiSpinners;
		
		el.update = function() {
			// check all items in table
			elemBox.each(function(i, el){
				
				var curElemBox = $(el);
				var spinner = curElemBox.find(settings.spinner);
				// set all values in a row
				setValues(curElemBox, spinner);
			});
		};
		el.init = setup;
		el.destroy = function(){
			$.each(elemBox, function(i){
				var amount = $(elemBox[i]).find(settings.amount);
				var amountPenny = $(elemBox[i]).find(settings.pennySelector);
				var total = $(settings.totalSelector);
				var totalPenny = $(settings.totalPenny);
				var deleteButton = $(elemBox[i]).find('.'+settings.deleteSelector);
				deleteButton.unbind('click');
				amount.html('');
				amountPenny.html('');
				total.html('');
				totalPenny.html('');
			});
			// unwrap items
			unWrapItems();
		};
		el.updateCookie = getCookieSpinners;
		el.deleteCookie = deleteCookieSpinners;
		el.setCookie = setCookieSpinners;
		el.getWidget = function(){ return plugin; };
		
		init();
		
		return this;
		
	};
	
})(jQuery);