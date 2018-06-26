define(['jquery'], function($) {

	/**
	 * 이미지 프리로딩.
	 * @constructor
	 * @requires {Class} jQuery
	 * @param {DomElement} obj - DOM Image Element
	 * @param {Function} callback - 콜백함수
	 * @returns {*}
	 */
	function ImagePreload(obj, callback) {
		if (!(this instanceof ImagePreload)) {
			return new ImagePreload(obj, callback);
		}

		var that = this;
		this.image = $(obj);
		this.checkload = function (image) {
			if (callback) callback();
		};

		this.image.one('load', function () {
			that.checkload(this);
		}).each(function () {
			if (this.complete) $(this).trigger('load');
		});
	}

	return ImagePreload;
});
