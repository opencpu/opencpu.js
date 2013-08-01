Javascript library for OpenCPU
------------------------------

This is an early version of a Javascript client library for the OpenCPU API (www.opencpu.org).
It is intended to be included in OpenCPU Apps: R packages with a web interface. 

The library depends on jQuery and basically provides some wrappers around `$.ajax()`. 
Most functions in opencpu.js return a *jqXHR* object. This gives you full control over the ajax request!

The library exports one variable to the global namespace called `opencpu`. 
In addition, it provides jQuery plugins which you can call on a DOM element.

Calling an R function
---------------------

The core of the library:

    opencpu.r_fun_call( fun, [,args] [,handler] )          *returns `jqXHR`*

This calls the R function from the current package (R package in which this application lives). Arguments:

 * `function` - Name of the function (string). E.g: `"rnorm"`
 * `args` - Object with arguments. Will be converted to JSON. E.g: `{n:10, mean:5}`
 * `handler` - Callback function. Callback has one argument: `Location` (Path of resulting output).

Note that the library by default assumes it is exactly one level deep in the package directory tree, e.g. under `/www`. 
If you wish put the application elsewhere, you might need to modify `opencpu.r_path` accordingly. 

Hypothetical example if the app would be in a package with a function `rnorm` similar to the `stats` one: 

    var jqxhr = opencpu.r_fun_call("rnorm", {n:10, mean:5}, function(location) {
      alert("Success! " + location);
    }).fail(function(){
      alert("Failure: " + jqxhr.responseText);
    });


Making a plot
-------------

A nice conveniency wrapper to call a plot function in the form of a jQuery plugin.
Will automatically display appropriately sized PNG and links to PDF and SVG.

    $("#mydiv").r_fun_plot( fun, [,args] )          *returns `jqXHR`*

Calls and R function (which should produce a plot) and automatically displays appropriately sized png image plus PDF and SVG links.

Arguments:

 * `fun` - Name of the function (string). E.g: `"plot"`
 * `args` - Object with arguments. Will be converted to JSON. E.g: `{ x: [ 1, 5, 3, 2, 5, 7, 4] }`

The function calls out to `opencpu.r_fun_plot` and hence works the same as above. It also returns the `jqXHR` object (not "#mydiv").

Hypothetical example if the app would be in a package with a function `plot`:

    var jqxhr = $("#mydiv").r_fun_plot("plot", { x : [3, 5, 3, 2, 4 ] })
       .fail(function(){alert("Failed to make plot :( " + jqxhr+responseText)});



Examples
--------

See the library in action in one of the apps:

 * [nabel](https://github.com/opencpu/gitstats/blob/master/inst/www/index.html#L32) (`r_fun_plot`) App based on Twitter Bootstrap
 * [gitstats](https://github.com/opencpu/nabel/blob/master/inst/www/index.html#L25) (`r_fun_plot`) App based on Twitter Bootstrap
 * [stocks](https://github.com/opencpu/stocks/blob/master/inst/www/stocks.js#L248) (`r_fun_call`, `r_fun_plot`) App based on ExtJS

To install any of these apps in your local R, you would do e.g:

    library(devtools)
    install_github("nabel", "opencpu")
    
    library(opencpu)
    opencpu$browse("library/nabel/www")

Replace `nabel` with any of the other apps. For a full list see www.github.com/opencpu. And like all OpenCPU apps, it's just a function:

    library(nabel)
    nabel()
    ?nabel


