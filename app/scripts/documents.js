// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: documents.js
//==================================================================================================
function CreateSubPage(params){
	return new Documents(params)
};

Class.Inherits(Documents, SubPageTabs);
function Documents(Params) {
	Documents.prototype.parent.call(this, Params);
};

Documents.prototype.classID = "Documents";
Documents.prototype.dataSource = "documents";

Documents.prototype.PrepareTabs = function(pg) {
	Documents.prototype.parent.prototype.PrepareTabs.call(this, pg);

	pg.add("Templates", function(tab) {
		// ClaimsSearchView({
			// container: tab.content
		// });
	});
	
	pg.add("Attachments", function(tab) {
		// MembersSearchView({
			// container: tab.content
		// });
	});
};
