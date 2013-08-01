Javascript library for OpenCPU
------------------------------

This is an early version of a Javascript client library for the OpenCPU API (www.opencpu.org).
It is intended to be included in OpenCPU Apps: R packages with a web interface. 

The library depends on jQuery and basically provides some wrappers around `$.ajax()`. 
Most functions in opencpu.js return a *jqxhr* object. This gives you full control over the ajax request!

The library exports one variable to the global namespace called `opencpu` that gives direct access to the functions. 
In addition, it provides jQuery plugins which you can call on a DOM element.

Examples
--------

See the library in action in one of the apps:

 * [nabel](https://github.com/opencpu/gitstats/blob/master/inst/www/index.html#L32) (`r_fun_plot`) App based on Twitter Bootstrap
 * [gitstats](https://github.com/opencpu/nabel/blob/master/inst/www/index.html#L25) (`r_fun_plot`) App based on Twitter Bootstrap
 * [stocks](https://github.com/opencpu/stocks/blob/master/inst/www/stocks.js#L248) (`r_fun_call', `r_fun_plot`) App based on ExtJS

