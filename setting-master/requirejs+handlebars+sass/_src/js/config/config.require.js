(function (global, require) {
    'use strict';

    /**
     * baseUrl, paths는 js 파일의 위치가 기준은 아니고, 로드 되는 경로 에서 부터 기준이 된다.
     */
    var requireConfig = {
        map: {
            '*': {'jquery': 'jquery-private'},
            'jquery-private': {'jquery': 'jquery'}
        },

        baseUrl: '/resources/js',
        config: {
            text: {
                onXhr: function (xhr, url) {
                },
                onXhrComplete: function (xhr, url) {
                }
            }
        },

        
        paths: {

            // 절대 주소 설정
            factory: 'factory',
            message: 'message',

            // 라이브러리.
            jquery: 'lib/jquery.min', // jQuery 3.1.1
            jqueryMigrate: 'lib/jquery-migrate-3.0.0.min', // jQuery-migrate
            Mustache: 'lib/mustache.min',
            moment: 'lib/moment.min',
            tinyMCE: 'lib/tinymce/tinymce.min',

            // Require 플러그인.
            text: 'lib/require.plugin/text',
            json: 'lib/require.plugin/json',

            // config
            configDomainAjax: 'config/config.domain.ajax',
            APIKEY: 'config/APIKEY',

            // jQuery 플러그인.
            jqueryUI: 'lib/jquery.plugin/jquery-ui/jquery-ui.min',
            jqueryEasing: 'lib/jquery.plugin/jquery.easing.1.3',
            jqueryTransit: 'lib/jquery.plugin/jquery.transit.min',
            jqueryTouchSwipe: 'lib/jquery.plugin/jquery.touchSwipe',
            jquerySerializeObject: 'lib/jquery.plugin/jquery.serializeObject',
            jqueryCookie: 'lib/jquery.plugin/jquery.cookie.min',

            // 유틸리티.
            ImagePreload: 'module/utility/image.preload', // @Constructor
            imageOriginalSize: 'module/utility/image.originalsize',
            windowPopup: 'module/utility/window.popup',
            detectMobile: 'module/utility/util.detect.mobile',
            parseURL: 'module/utility/util.parseURL',
            createGoogleShortUrl: 'module/utility/create.googleShortUrl',
            createKakaoShareButton: 'module/utility/create.kakaoshare.button',
            copyToClipboard: 'module/utility/copy.clipboard',

            // 하위 브라우저 호환 코드.
            polyfillDatalist: 'polyfill/datalist/datalist',
            polyfillPlaceholder: 'polyfill/jquery.placeholder/jquery.placeholder.min',
            polyfillPromise: 'polyfill/es6.promise/es6-promise.min',

            // Analytics 도구
            loaderGoogleAnalytics: 'module/analytics/loader.googleAnalytics',

            // 라이브러리 지역로딩
            'jquery-private': 'config/private.jquery'

        },
        shim: {
            imageOriginalSize: {
                deps: ['jquery', 'ImagePreload']
            },
            polyfillPlaceholder: {
                deps: ['jquery']
            },
            jqueryEasing: {
                deps: ['jquery']
            },
            jqueryCookie: {
                deps: ['jquery']
            },
            configDomainAjax: {
                deps: ['jquery']
            },
            'jquery-private': {
                deps: ['jquery']
            }
        }
    };

    global.requireModule = require.config(requireConfig);

    /**
     * body의 controller 속성값을 이용 해서, 최초 컨트롤러 함수를 실행함.
     * jquery에 Global 하게 주입 되어야 할 플러그인은 아래 부분에서 주입.
     */
    requireModule([
        'jquery',
        'polyfillPromise',
        'jqueryCookie',
        'jqueryEasing',
        'configDomainAjax',
        'jquerySerializeObject'
    ], function ($, polyfillPromise) {
        polyfillPromise.polyfill();
    });

    var body = document.getElementsByTagName('body')[0];
    if (body && body.getAttribute('controller')) {

        requireModule([
            'Mustache',
            'controller/global.controller',
            body.getAttribute('controller') + '/controller'
        ], function (Mustache, globalController, controller) {
            if (globalController) globalController();
            if (controller) controller();

            window["jQuery"] = window["$"] = $;
        });
    }

    // requireModule(['loaderGoogleAnalytics']);

})(window, require);
