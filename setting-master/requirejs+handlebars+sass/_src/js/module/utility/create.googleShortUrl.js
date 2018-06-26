define([
    'jquery',
    'APIKEY'
], function ($, APIKEY) {
    "use strict";

    function createShortenUrl(longUrl, callback) {

        gapi.client.load('urlshortener', 'v1', function () {
            gapi.client.urlshortener.url
                .insert({"resource": {'longUrl': longUrl}})
                .execute(function (resp) {
                    if (typeof(callback) == 'function') {
                        callback(resp.id);
                    }
                });
        });

    }

    function APISetting() {

        gapi.client.setApiKey(APIKEY.google);
        createShortenUrl(createGoogleShortUrl.longURL, function (id) {
            createGoogleShortUrl.shortURL = id;
            createGoogleShortUrl.callback();
        });

    }

    var createGoogleShortUrl = {
        longURL: null,
        shortURL: null,
        callbackFunctionName: null,
        callback: null,
        bootstrap: function (url, callback) {

            var callbackFunctionName;
            while (true) {
                callbackFunctionName = 'd' + Math.floor(Math.random() * 1000001);
                if (window.hasOwnProperty(callbackFunctionName)) {
                    continue;
                } else {
                    this.callbackFunctionName = callbackFunctionName;
                    break;
                }
            }

            this.longURL = url;
            this.callback = callback || function () {return createGoogleShortUrl.shortURL;}

            window[this.callbackFunctionName] = APISetting;
            $('<script src="https://apis.google.com/js/client.js?onload=' + this.callbackFunctionName + '"></script>').appendTo('body');

            return this;
        }
    }

    return createGoogleShortUrl;
});
