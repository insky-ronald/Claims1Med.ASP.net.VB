// ****************************************************************************************************
// Last modified on
// 26-JAN-2016
// ****************************************************************************************************
//==================================================================================================
// File name: voterslist.js
//==================================================================================================
// (function (item, params) {
	// var requestParams = params.url.split("?");
	// return new VotersListView({
		// container: params.container,
		// requestParams: GetUrlRequestParamsObject(params.url)
	// })
// })(desktop.loadingItem, desktop.loadingPageParams);

// alerts(desktop.loadingPageParams.id)

function CreateSubPage(params){
	var requestParams = params.url.split("?");
	return new VotersListView({
		container: params.container,
		requestParams: GetUrlRequestParamsObject(params.url)
		// requestParams: requestParams.length > 1 ? requestParams[1] : ""
	})
};
