/**
 * Javascript client library for OpenCPU
 * Version 0.1
 * Depends: jQuery
 * http://github.com/jeroenooms/opencpu.js
 * 
 * Include this file in your apps (packages).
 * Edit r_path variable below if needed.
 */

(function ( $ ) {

  function r_fun_json(fun, args, handler){
    var jqxhr = r_fun_call(fun, args, function(loc){
      $.get(loc + "R/.val/json", function(data){
        handler && handler(data);
      }).fail(function(){
        alert("Failed to get JSON response.");
      });
    });
    return jqxhr
  }
  
  //internal functions
  function r_fun_call(fun, args, handler){
    if(!fun) throw "r_fun_call called without fun";

    var jqxhr = $.ajax({
      type: "POST",
      url: opencpu.r_path + "/" + fun,
      data: JSON.stringify(args || {}),
      contentType : 'application/json',
      dataType: "text",
      success : function(){
        var Location = jqxhr.getResponseHeader('Location');
        if(!Location){
          alert("Response was successful but had no location??")
        } else {
          handler && handler(Location);
        }
      },
      error : function(){
        console.log("OpenCPU error HTTP " + jqxhr.status + "\n" + jqxhr.responseText)
      }
    });

    //add the handler form the argument if specified
    handler && addhandler(handler);
    
    //additional interface to specify handlers
    jqxhr.handler = addhandler;

    //helper functions
    function addhandler(newhandler){
      if(!newhandler){
        throw "addhandler called without a function";
      }
      jqxhr.success(function(){
        var Location = jqxhr.getResponseHeader('Location');
        if(!Location){
          alert("Response was successful but had no location??")
        } else {
          newhandler(Location);
        }
      });
    }
    
    return jqxhr;
  }
  
  //plotting widget
  //to be called on an (empty) div.
  $.fn.r_fun_plot = function(fun, args) {
    var targetdiv = this;
    var myplot = initplot(targetdiv);
 
    //reset state
    myplot.setlocation();
    myplot.spinner.show();

    // call the function
    return r_fun_call(fun, args, function(newloc) {
      myplot.setlocation(newloc);
      Location = newloc;
    }).always(function(){
      myplot.spinner.hide();      
    });
  }
  
  function initplot(targetdiv){
    if(targetdiv.data("ocpuplot")){
      return targetdiv.data("ocpuplot");
    }
    var ocpuplot = function(){
      //local variables
      var Location
      var pngwidth;
      var pngheight;
      
      var plotdiv = $('<div />').attr({
        style: "width: 100%; height:100%; min-width: 100px; min-height: 100px; position:absolute; background-repeat:no-repeat; background-size: 100% 100%;"
      }).appendTo(targetdiv).css("background-image", "none");
      
      var spinner = $('<span />').attr({
        style : "position: absolute; top: 20px; left: 20px; z-index:1000; font-family: monospace;" 
      }).text("loading...").appendTo(plotdiv);
  
      var pdf = $('<a />').attr({
        target: "_blank",        
        style: "position: absolute; top: 10px; right: 10px; z-index:1000; text-decoration:underline; font-family: monospace;"
      }).text("pdf").appendTo(plotdiv);
  
      var svg = $('<a />').attr({
        target: "_blank",
        style: "position: absolute; top: 30px; right: 10px; z-index:1000; text-decoration:underline; font-family: monospace;"
      }).text("svg").appendTo(plotdiv);
  
      var png = $('<a />').attr({
        target: "_blank",
        style: "position: absolute; top: 50px; right: 10px; z-index:1000; text-decoration:underline; font-family: monospace;"
      }).text("png").appendTo(plotdiv);  
      
      function updatepng(){
        if(!Location) return;
        pngwidth = plotdiv.width();
        pngheight = plotdiv.height();
        plotdiv.css("background-image", "url(" + Location + "graphics/last/png?width=" + pngwidth + "&height=" + pngheight + ")");       
      }
      
      function setlocation(newloc){
        Location = newloc;
        if(!Location){
          pdf.hide();
          svg.hide();
          png.hide();
          plotdiv.css("background-image", "");
        } else {
          pdf.attr("href", Location + "graphics/last/pdf?width=11.69&height=8.27&paper=a4r").show();
          svg.attr("href", Location + "graphics/last/svg?width=11.69&height=8.27").show();
          png.attr("href", Location + "graphics/last/png?width=800&height=600").show(); 
          updatepng();
        }
      }

      // function to update the png image
      var onresize = debounce(function(e) {
        if(pngwidth == plotdiv.width() && pngheight == plotdiv.height()){
          return;
        }
        if(plotdiv.is(":visible")){
          updatepng();
        }        
      }, 500);   
      
      // register update handlers
      plotdiv.on("resize", onresize);
      $(window).on("resize", onresize);  
      
      //return objects      
      return {
        setlocation: setlocation,
        spinner : spinner
      }
    }();
    
    targetdiv.data("ocpuplot", ocpuplot);
    return ocpuplot;
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
  
  //export
  window.opencpu = window.opencpu || {};
  var opencpu = window.opencpu;
  
  //global settings
  opencpu.r_path = "../R";

// exported functions
  opencpu.r_fun_call = r_fun_call;
  opencpu.r_fun_json = r_fun_json;
  
  //for innernetz exploder
  if (typeof console == "undefined") {
    this.console = {log: function() {}};
  }  
      
}( jQuery ));
