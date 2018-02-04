function computeGains() {
		let fromPrice = $('#from-exchange select option:selected').attr('price');
		let toPrice = $('#to-exchange select option:selected').attr('price');
	  let percent = parseFloat((toPrice - fromPrice) / fromPrice * 100);
	  
	  let exchange1Fee = parseFloat($("#from-exchange-withdrawl-fee input").val())/100;
	  let exchange2Fee = parseFloat($("#to-exchange-withdrawl-fee input").val())/100;
	  
	  let networkFee = parseFloat($("#network-fee input").val());
	  
	  let transferBackFee = parseFloat($("#transfer-back-fee input").val())/100;

		let wealth = parseFloat($("#amount-to-sell").val());
	  let newWealth = (wealth * (1 - exchange1Fee) - networkFee) * (1 + (percent / 100.0)) * (1 - exchange2Fee) * (1 - transferBackFee);
	  
	  let symbol = $("#crypto").val();

    console.log(fromPrice)
    console.log(toPrice)
    console.log(percent)
    console.log(exchange1Fee)
    console.log(exchange2Fee)
    console.log( networkFee )
    console.log(transferBackFee )
    console.log(wealth)
    console.log(newWealth )

    

	  $("#gains").text(((newWealth - wealth) / wealth * 100).toFixed(2) + "% profit to " + newWealth.toFixed(4) + " " + symbol);
}

function updateStrings() {
		let from = $('#from-exchange select option:selected').val();
		let to = $('#to-exchange select option:selected').val();
		let symbol = $("#crypto").val();

    let fromPrice = parseFloat($('#from-exchange select option:selected').attr("price"));
    let toPrice = parseFloat($('#to-exchange select option:selected').attr("price"));
    $("#yourExchange").text("$"+fromPrice.toFixed(2));
    $("#otherExchange").text("$"+toPrice.toFixed(2));

    console.log("From :"+fromPrice+" To :"+toPrice);
    if (fromPrice<=toPrice) 
    {
      
      console.log("From<to");

      $("#yourExchange").css("color","red");
      $("#otherExchange").css("color","green");
    }
    else 
    {
      
      console.log("From>to");

      $("#otherExchange").css("color","red");
      $("#yourExchange").css("color","green");
    }


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

$(function() {

  $("#crypto").change(function() {
    let symbol = $(this).val();
    fetchForSymbol(symbol);
});

$("select, input").on("change blur keyup", function() {
    updateStrings();
    computeGains();
});

fetchForSymbol('btc');


});

