/**
 * Javascript client library for OpenCPU
 * Version 0.1
 * Depends: jQuery
 * http://github.com/jeroenooms/opencpu-js
 * 
 * Include this file in your apps (packages).
 * Edit r_path variable below if needed.
 */

(function ( $ ) {
  //static vars
  var r_path = "../R";
	
	//internal functions
	function r_fun_call(fun, args, handler){
		if(!fun) throw "r_fun_call called without fun";
		var args = args || {};
		
		var jqxhr = $.ajax({
			type: "POST",
			url: r_path + "/" + fun,
			data: JSON.stringify(args),
			contentType : 'application/json',
			dataType: "text",
			success : function(){
				var Location = jqxhr.getResponseHeader('Location');
				if(!Location){
					alert("Response was successful but had no location??")
				} else {
					handler(Location);
				}
			},
			error : function(){
				var status = jqxhr.status;
				switch(status) {
				case 400:
					alert("Call to R resulted in an error:\n\n" + jqxhr.responseText);
				  break;
				case 503:
					alert("Problem with OpenCPU server:\n\n" + jqxhr.responseText);
				  break;
				default:
					alert("HTTP error: " + status + "\n\n" + jqxhr.responseText);
				}
			}
		});
		return jqxhr;
	}
	
	function r_session_list(location, handler){
		if(!location) throw "r_session_list called without location";
		return $.ajax({
			type: "GET",
			url: location,
			dataType: "text",
			success : function(data, textStatus, jqXHR){
				handler(data);
			}
		});
	}
	
	//plotting widget
	//to be called on an (empty) div.
	$.fn.r_fun_plot = function(fun, args) {
		var targetdiv = this;
		if(!targetdiv.data("div")){
			targetdiv.data("div", $('<div />').attr({
				class: "r_fun_plot",
				style: "width: 100%; height:100%; min-width: 100px; min-height: 100px; position:absolute; background-repeat:no-repeat; background-size: 100% 100%;"
			}).appendTo(targetdiv));
		}
		
		var div = targetdiv.data("div");		

		if(!div.data("spinner")){
			div.data("spinner", $('<span />').attr({
				style : "position: absolute; top: 20px; left: 20px; z-index:1000; font-family: monospace;" 
    		}).text("loading...").appendTo(div));
		}    

		if(!div.data("pdflink")){
			div.data("pdflink", $('<a />').attr({
				target: "_blank",				
				style: "position: absolute; top: 10px; right: 10px; z-index:1000; text-decoration:underline; font-family: monospace;"
			}).text("pdf").appendTo(div));
		}
		
		if(!div.data("svglink")){
			div.data("svglink", $('<a />').attr({
				target: "_blank",
				style: "position: absolute; top: 30px; right: 10px; z-index:1000; text-decoration:underline; font-family: monospace;"
			}).text("svg").appendTo(div));
		}	
    
		if(!div.data("pnglink")){
			div.data("pnglink", $('<a />').attr({
				target: "_blank",
				style: "position: absolute; top: 50px; right: 10px; z-index:1000; text-decoration:underline; font-family: monospace;"
			}).text("png").appendTo(div));
		}	    
		
		div.css("background-image", "none");
		var pdf = div.data("pdflink").hide();
		var svg = div.data("svglink").hide();
		var png = div.data("pnglink").hide();
		var spinner = div.data("spinner").show();
		

		// call the function
		return r_fun_call(fun, args, function(Location) {
			div.data("plotlocation", Location);
			pdf.attr("href", Location + "graphics/last/pdf?width=11.69&height=8.27&paper=a4r");
			svg.attr("href", Location + "graphics/last/svg?width=11.69&height=8.27");
			png.attr("href", Location + "graphics/last/png?width=800&height=600");

			// function to update the png image
			var updatepng = debounce(function(e) {
				var loc = div.data("plotlocation");
				var oldurl = div.css("background-image");
				var newurl = "url(" + loc + "graphics/last/png?width=" + div.width() + "&height=" + div.height() + ")";

				// use the tail of the url only to prevent absolute url problems
				if (div.is(":visible") && oldurl.slice(-50) != newurl.slice(-50)) {
					div.css("background-image", newurl);
				}
				spinner.hide();
				pdf.show();
				svg.show();
				png.show();
			}, 500);

			// register update handlers
			div.on("resize", updatepng);
			$(window).on("resize", updatepng);

			// show
			updatepng();
		});
	}
    

	  // from understore.js
	function debounce(func, wait, immediate) {
		var result;
		var timeout = null;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate)
					result = func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow)
				result = func.apply(context, args);
			return result;
		}
	}

	// exported functions
	window.opencpu = {
		r_fun_call : r_fun_call
	}
      
}( jQuery ));
