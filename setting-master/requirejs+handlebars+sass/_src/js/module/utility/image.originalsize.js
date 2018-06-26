define(['ImagePreload'], function(ImagePreload) {

	/**
	 * 이미지의 본래 사이즈를 구하는 함수.
	 * @requires {Class} ImagePreload
	 * @param {DOMElement} obj - DOM Image Element
	 * @param {Function} cbf - 콜백함수
	 * @returns {*}
	 */
	function imageOriginalSize(obj, cbf) {

		var target = obj,
			tempImage = new Image();

		tempImage.src = target.src;
		tempImage.style.position = 'absolute';
		tempImage.style.left = '-9999px';
		tempImage.style.visibility = 'hidden';
		tempImage.style.width = 'auto';
		tempImage.style.height = 'auto';

		document.body.appendChild(tempImage);

		new ImagePreload(tempImage, function () {

			target.setAttribute('orgwidth', tempImage.offsetWidth);
			target.setAttribute('orgheight', tempImage.offsetHeight);

			document.body.removeChild(tempImage);
			if (cbf) cbf();
		});
	}

	return imageOriginalSize;
});
