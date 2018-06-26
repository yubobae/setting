define([], function () {
    "use strict";

    /**
     * Location 정보를 Parse.
     * @returns {{protocol: (*|string), host: (*|string), hostname: (*|string), port: (*|Function|string), pathname: (*|string), search, searchObject: Array, hash: (*|string)}}
     */
    function parseURL(url) {

        var parser = document.createElement('a'),
            searchObject = [],
            queries, split, i, length = 0;

        parser.href = url || window.location.href;
        queries = parser.search.replace(/^\?/, '').split('&');

        for (i = 0; i < queries.length; i++) {
            split = queries[i].split('=');

            if (split[0] == '') continue;

            searchObject.push(JSON.parse('{"' + [split[0]] + '":"' + split[1] + '"}'));
            searchObject.length = ++length;
        }

        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash
        };
    }

    return parseURL;
});
