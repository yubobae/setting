define([
    'jquery',
    './validation'
], function ($, validation) {
    "use strict";

    var message = "controller";
    
    function controller() {

        var $body = $("body");
        console.log(message);

        validation();
    }

    return controller;
});