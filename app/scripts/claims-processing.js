// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: claims-processing.js
//==================================================================================================
function ClaimsProcessingView(params){
	return new MultiTabsView(params, function(pg) {
		pg.add("Claims", function(tab) {
			ClaimsSearchView({
				container: tab.content
			});
		});
		
		pg.add("Members", function(tab) {
			MembersSearchView({
				container: tab.content
			});
		});
	});
};
