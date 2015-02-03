# jQuery.TablePrice
jQuery plugIn for store table price (cart) pages. [PlugIn page link](http://jsjq.ru/plagin-podscheta-stoimosti-tovarov-v-korzine-jquery-tableprice/).

## Resources
* [jQuery.TablePrice for developers (full version)](https://raw.githubusercontent.com/mrmasterix/jQuery.TablePrice/master/lib/tablePrice.js)
* [jQuery.TablePrice for use (min version)](https://raw.githubusercontent.com/mrmasterix/jQuery.TablePrice/master/lib/tablePrice.min.js)
* [jQuery.TablePrice API documents](http://jsjq.ru/plagin-podscheta-stoimosti-tovarov-v-korzine-jquery-tableprice/)

## Getting started

First connect jQuery.TablePrice to your document (use jQuery >= 1.8.2 version )  :

```html
<script src="js/jquery-1.8.2.min.js"></script>
<script src="lib/tablePrice.min.js"></script>
```

### HTML

```html
<table id="table1">
  <thead>
    <tr>
      <td>Product</td>
      <td>Price per product</td>
      <td>Num of product</td>
      <td>Summ</td>
      <td>Delete from cart</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Product #1</td>
      <td class="def-holder"><span class="def-price">123</span> $</td>
      <td><input type="text" class="spinner" value="1"/></td>
      <td class="amount-holder"><span class="product-summ"></span> $</td>
      <td><a href="" class="delete-product">Delete product</a></td>
    </tr>
    <tr>
      <td>Product #2</td>
      <td class="def-holder"><span class="def-price">58</span> $</td>
      <td><input type="text" class="spinner" value="2"/></td>
      <td class="amount-holder"><span class="product-summ"></span> $</td>
      <td><a href="" class="delete-product">Delete product</a></td>
    </tr>
  </tbody>
</table>
<div id="total-cost" class="total">Total cost <span></span> $</div>
```

### JS
```js
var table = $('#table1').tablePrice({
	space: true,
	initCost: '.def-price',
	amount: '.product-summ',
	totalSelector: '#total-cost span',
	deleteSelector: 'delete-product'
});
```
You can see this example on [examples page](http://jsjq.ru/plugins/jquery.tableprice/index.html)
