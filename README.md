Javascript library for OpenCPU
==============================

opencpu.js is a Javascript client library for OpenCPU (www.opencpu.org). It is a foundation for developing OpenCPU apps: R packages containing a web application that calling R functions though the OpenCPU API. 


A note about hotlinking
-----------------------

It is better not to hotlink the javascript library straight from github. The library is under active development and the latest version on Github changes rigorously from time to time. If you build apps, please include a copy of `jQuery` and `opencpu.js` in the package. For cross domain applications, you can use:

	<script src="//code.jquery.com/jquery-1.10.2.min.js"></script> 
    <script src="//www.opencpu.org/js/archive/opencpu-0.4.js"></script>

This file will not have any breaking changes. Also note that by not specifying `http` or `https`, the browser will  automatically use the same protocol as is used to host the webpage, which prevents "mixed content" security problems.


Documentation
-------------

The documentation for this library is now available on the OpenCPU website: https://www.opencpu.org/jslib.html


Apps
----

Example apps that use `opencpu.js` can be found on the OpenCPU website: https://www.opencpu.org/apps.html


