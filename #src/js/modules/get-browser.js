function getNameBrowser() {
	//определяем какой браузер
	var ua = navigator.userAgent;
	if (ua.search(/rv:11.0/) > 0) {
		return 'Internet Explorer 11';
	}
	if (ua.search(/MSIE/) > 0) {
		return 'Internet Explorer';
	}
	return 'Не определен';

}

export default getNameBrowser;