define([
    'Mustache',
    'text!./review.lecture.list.mustache'
], function ($, Mustache, templateReviewVideolist) {
    "use strict";

    var reviewlist = {

        setModel: function (model) {
            this.modelReviewList = model;
            return this;
        },
        getModel: function () {
            return this.modelReviewList;
        },

        getTemplate: function () {
            if (!this.modelReviewList) {
                console.warn('Don\'t exist model. try setModel method');
                return;
            }

            this.modelReviewList.convertScoreImage = this._helperConvertScoreImage;
            this.modelReviewList.nameReduce = this._helperNameReduce;

            return Mustache.render(templateReviewVideolist, this.modelReviewList);
        },

        _helperConvertScoreImage: function () {
            return function (text, render) {

                var templateScore = '';

                for (var a = 1, b = 6; a < b; a++) {
                    if (a > this.score) templateScore += '<img src="/static/images/common/star02_off.png" class="star_image" width="10" />'
                    else templateScore += '<img src="/static/images/common/star02_on.png" class="star_image" width="10" />'
                }
                return render(templateScore);
            }
            //<img src="/images/common/star_on.gif"><img src="/images/common/star_on.gif"><img src="/images/common/star_on.gif"><img src="/images/common/star_on.gif"><img src="/images/common/star_on.gif">
        },

        _helperNameReduce: function () {
            return function (text, render) {
                var username = this.username.toString().split(''),
                    limitCount = 3;

                username[1] = '*';

                return render(username.join(''));

            }
        }


    }

    return reviewlist;


});