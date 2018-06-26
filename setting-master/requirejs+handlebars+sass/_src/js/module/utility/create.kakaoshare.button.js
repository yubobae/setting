define([
    'jquery',
    'APIKEY'
], function ($, APIKEY) {
    "use strict";

    function APISetting(callback) {

        // // 사용할 앱의 JavaScript 키를 설정해 주세요.
        Kakao.init(APIKEY.kakao);
        // // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.

        Kakao.Link.createTalkLinkButton(createKakaoShareButton.opts);
        callback();

    }

    var createKakaoShareButton = {
        opts: null,
        callback: null,
        externalSourceAppend: function (callback) {

            var script = document.createElement('script'),
                loaded;

            script.setAttribute('src', '//developers.kakao.com/sdk/js/kakao.min.js');
            if (callback) {
                script.onreadystatechange = script.onload = function () {
                    if (!loaded) {
                        console.log(Kakao);
                        callback();
                    }
                    loaded = true;
                };
            }
            document.getElementsByTagName('head')[0].insertBefore(script, document.getElementsByTagName('script')[0]);

            return this;

        },
        bootstrap: function (callback, opts) {
            this.opts = opts;
            this.callback = callback || function () {}

            APISetting(callback); // TODO : 향후 JS를 Append 방식으로 교체 필요함.
            //this.externalSourceAppend(APISetting);
        }
    }

    return createKakaoShareButton;
});
