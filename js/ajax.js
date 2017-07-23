document.addEventListener("DOMContentLoaded", function (event) {
  (function (global) {
    //--------------
    // ajax handler
    //--------------

    var AJAX = {};

    // return new ajax object.
    var getAjax = function () {
      return new XMLHttpRequest();
    };

    // Set get request to get data from request Url.
    AJAX.get = function (reqUrl, res, isJson) {
      var req = getAjax();

      req.onreadystatechange = function () {
        handleRes(req, res, isJson);
      };

      req.open("GET", reqUrl, true);
      req.send();
    };

    // Handle reponse from server.
    var handleRes = function (req, res, isJson) {
      // set json if not set / undefined.
      if (isJson === undefined) {
        isJson = true;
      }

      if ((req.readyState == 4) && (req.status >= 200)) {
        if (isJson) {
          res(JSON.parse(req.responseText));
        } else {
          res(req.responseText);
        }
      } //else if (req.readyState == 4 && req.status >= 400) {
      //   if (isJson) {
      //     res(JSON.parse(req.responseText));
      //   } else {
      //     res(req.responseText);
      //   }
      // }
    };

    // Attach AJAX to global object (window).
    global.$_AJAX = AJAX;

  })(window);
});
