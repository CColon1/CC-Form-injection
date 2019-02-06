var formGroups = jQuery('#register .form-group,.form-check');
var lastGroup = formGroups[formGroups.length-1];

var hasRegBtn = function(lastEl){
    return jQuery(lastEl).find('#RegBtn').length > 0
}

var insertForm = function(lastEl, form){
    if(hasRegBtn(lastEl)){
        jQuery(form).insertBefore(lastEl)
    }else{
        jQuery(form).insertAfter(lastEl)
    }
}

var overWriteAjax = function(){
    jQuery._ajax = jQuery.ajax;
    jQuery.ajax = function(b,c){
        if(b && b.data && b.data.includes("action=register")){
            sendPaymentDataToAnet(paymentResponseHandler(b,c))
        }else{
            return jQuery._ajax(b,c);
        }
    }
}


// Credit Card nonce functions
//creates responce handler and passes intercepted call data for event registration
var paymentResponseHandler = function(b,c){
    return function(response) {
        console.log(response,b,c)
        if (response.messages.resultCode === "Error") {
            var i = 0;
            while (i < response.messages.message.length) {
                console.log(
                    response.messages.message[i].code + ": " +
                    response.messages.message[i].text
                );
                i = i + 1;
            }
            b.success('Error Registering, Unable to process payment',400);
        }else{
            // send transaction
            return fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    opaqueData: response.opaqueData,
                    amount: ccAmount
                }), 
            })
            .then(response => response.json())
            .then(res=>{
                console.log(res);
                // jQuery._ajax(b,c);
                console.log('sending registeration is currently disabled')
            })
            .catch((err)=>{
                console.log(err)
                b.success('Error Registering, Unable to process payment',400);
            })
            
            
        }
    }
}


var sendPaymentDataToAnet = function(handler) {
	if (typeof Accept !== 'object' ) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.google.com/maps/api/js?callback=initMap";
		document.body.appendChild(script);
	} 
    var authData = {};
        authData.clientKey = "399b3bs7dW9VwjvH9c8h96DXgPNEZ4gc57YYQ73Gbq59qpMR5DeZamjZAd4M5nZm";
        authData.apiLoginID = "7bC8kdS3Ea9";
    var cardData = {};
        cardData.cardNumber = document.getElementById("cardNumber").value;
        cardData.month = document.getElementById("expMonth").value;
        cardData.year = document.getElementById("expYear").value;
		cardData.cardCode = document.getElementById("cardCode").value;
		cardData.fullName = document.getElementById("fullName").value;
    var secureData = {};
        secureData.authData = authData;
        secureData.cardData = cardData;
		Accept.dispatchData(secureData, handler);
}


// Credit Card Form Template
var ccScript = jQuery('#ccFormScript')
var ccAmount = ccScript.data("amount")
console.log(ccAmount , 'current amount' )
const ccForm = `
				<script type="text/javascript"
					src="https://jstest.authorize.net/v1/Accept.js"
					charset="utf-8">
				</script>
				<style>
				.credit-card-form {
					display: grid;
					border: 1px solid rgba(0,0,0,.15);
					border-radius: 5px;
					grid-template-columns: auto auto auto;
					padding: 10px;
					width: 100%;
					grid-column-gap: 50px;
					margin-bottom: 10px;
				}
				.form-group {
					grid-column: 1 / span 3;
				}
				.col-left {
					grid-column: 1 / span 1;
				}
				.col-middle {
					grid-column: 2 / span 1;
				}
				.col-right {
					grid-column: 3 / span 1;
                }
                #payBtn{
                    height: 50px;
                    background-color: #266dd3!important;
                    cursor: pointer;
                    display: block!important;
                    width: 100%;
                    padding: .5rem .75rem;
                    line-height: 1.25;
                    background-clip: padding-box;
                    border: 1px solid rgba(0,0,0,.15);
                    border-radius: .25rem;
                }
				</style>
				<div class="credit-card-form">
				<div class="form-group required">
					<label for="CardHolderName">Name (as it appears on your card): </label>
					<input type="text" name="CardName"  id="fullName" class="form-control" placeholder="Card Holder Name" >
				</div>
				<div class="form-group required">
					<label for="CardNumber">Card Nubmer (no dashes or spaces): </label>
					<input type="text" name="CardNumber"  id="cardNumber" class="form-control" placeholder="Card Nubmer" >
				</div>
				<div class="form-group required col-left">
					<label for="ExpMonth">Expiration Month</label>
					<input type="text" name="ExpMonth"  id="expMonth"class="form-control" placeholder="Month" >
				</div>
				<div class="form-group required col-middle">
					<label for="ExpYear">Expiration Year</label>
					<input type="text" name="ExpYear"  id="expYear" class="form-control" placeholder="Year" >
				</div>
				<div class="form-group required col-right">
					<label for="SecCode">Security Code: </label>
					<input type="text" name="SecCode"  id="cardCode" class="form-control" placeholder="Security Code" >
                </div>
                <div class="form-group">
					<label for="paymentAmount">Payment Amount: </label>
					<input type="text" name="paymentAmount"  id="paymentAmount" class="form-control" value="$${Number.parseFloat(ccAmount).toFixed(2)}" disabled>
                </div>
            </div>`


insertForm(lastGroup,ccForm);
overWriteAjax();
