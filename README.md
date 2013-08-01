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

    opencpu.r_fun_call( fun, [,args] [,handler] )

This calls the R function from the current package (R package in which this application lives). Arguments:

 * `function` - Name of the function (string). E.g: `"rnorm"`
 * `args` - Object with arguments. Will be converted to JSON. E.g: `{n:10, mean:5}`
 * `handler` - Callback function. Callback has one argument: `Location` (Location of the resulting temporary session).

Note that the library by default assumes it is exactly one level deep in the package directory tree, e.g. under `/www`. 
If you wish put the application elsewhere, you might need to modify `opencpu.r_path` accordingly. 

Hypothetical example if the application would be part of a package with a function `rnorm` similar to the `stats` package: 

    var jqxhr = opencpu.r_fun_call("rnorm", {n:10, mean:5}, function(location) {
      alert("Success! " + location);
    }).fail(function(){
      alert("Failure: " + jqxhr.responseText);
    });




Examples
--------

See the library in action in one of the apps:

 * [nabel](https://github.com/opencpu/gitstats/blob/master/inst/www/index.html#L32) (`r_fun_plot`) App based on Twitter Bootstrap
 * [gitstats](https://github.com/opencpu/nabel/blob/master/inst/www/index.html#L25) (`r_fun_plot`) App based on Twitter Bootstrap
 * [stocks](https://github.com/opencpu/stocks/blob/master/inst/www/stocks.js#L248) (`r_fun_call`, `r_fun_plot`) App based on ExtJS

