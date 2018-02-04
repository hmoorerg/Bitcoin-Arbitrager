function computeGains() {
		let fromPrice = $('#from-exchange select option:selected').attr('price');
		let toPrice = $('#to-exchange select option:selected').attr('price');
	  let percent = parseFloat((toPrice - fromPrice) / fromPrice * 100);
	  
	  let exchange1Fee = $("#from-exchange-withdrawl-fee input").val();
	  let exchange2Fee = $("#to-exchange-withdrawl-fee input").val();
	  
	  let networkFee = parseFloat($("#network-fee input").val());
	  
	  let transferBackFee = parseFloat($("#transfer-back-fee input").val());

		let wealth = parseFloat($("#amount-to-sell").val());
	  let newWealth = (wealth * (1 - exchange1Fee) - networkFee) * (1 + (percent / 100.0)) * (1 - exchange2Fee) * (1 - transferBackFee);
	  
	  let symbol = $("#crypto").val();
	  $("#gains").text(((newWealth - wealth) / wealth * 100).toFixed(2) + "% gains to " + newWealth + " " + symbol);
}

function updateStrings() {
		let from = $('#from-exchange select option:selected').val();
		let to = $('#to-exchange select option:selected').val();
		let symbol = $("#crypto").val();

		$(".symbol").text(symbol);
		$(".to-exchange-name").text(to);
		$(".from-exchange-name").text(from);
}

function fillExchangeData(data) {
		hideSpinner();
	  $(".exchanges").empty();
	  for (let market of data.ticker.markets) {
		    	let text = market.market + " ($" + parseFloat(market.price).toFixed(2) + ")";
		    	let $option = $("<option></option>").val(market.market).text(text).attr('price', market.price);
		      $(".exchanges").append($option);
		    }
	  [exchange, _price] = selectBestExchangeToSell();
	  $("#to-exchange select").val(exchange);

		computeGains();
	  updateStrings();
}

function selectBestExchangeToSell() {
		let $options = $("#to-exchange select option");
		let maxPrice = -100;
	  let maxExchange = null;
		for (let option of $options) {
			  	let price = parseFloat($(option).attr('price'));
			    let exchange = $(option).val();
			  	if (price > maxPrice) {
					    	maxPrice = price;
					      maxExchange = exchange;
					    }
			  }
	  return [maxExchange, maxPrice];
}

function showSpinner() {
		$(".spinner-region .spinner").removeClass('hidden');
		$(".spinner-region .replacement").addClass('hidden');
}

function hideSpinner() {
		$(".spinner-region .spinner").addClass('hidden');
		$(".spinner-region .replacement").removeClass('hidden');
}

function fetchForSymbol(symbol) {
		showSpinner();
	  
	  $.ajax({
		      dataType: "json",
		      url: "https://api.cryptonator.com/api/full/" + symbol + "-usd",
		      success: fillExchangeData,
		      error: function(err) { console.log("error: ", err); setTimeout(function() { fetchForSymbol(symbol); }, 1500); }
		    });
}

$("#crypto").change(function() {
		let symbol = $(this).val();
		fetchForSymbol(symbol);
});

$("select, input").on("change blur keyup", function() {
		updateStrings();
	  computeGains();
});

fetchForSymbol('btc');

