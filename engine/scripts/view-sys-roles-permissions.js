// ****************************************************************************************************
// Last modified on
// 07-MAR-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-sys-roles-permissions.js
//==================================================================================================
function RolesPermissionsView(params){
	var container = params.container;
	var topContainer = CreateElement("div", container)
		.css("height", "40%");
		
	var bottomContainer = CreateElement("div", container)
		.css("height", "60%");
		
	params.container = topContainer;
	var roles = RolesView(params);
	
	roles.Events.AfterPaintContent.add(function(grid) {
		grid.dataset.Events.OnMoveRecord.add(function(dataset, params) {
			permissions.Refresh();
		});
		
		params.container = bottomContainer;
		params.masterDataset = grid.dataset;
		// params.masterDetail = function(callback) {
			// callback(grid.dataset, "role_id", "id")
		// };
		var permissions = PermissionsView(params);
		// permissions.Events.OnInitRequestParams.add(function(grid, requestParams) {
			// requestParams.role_id = roles.dataset.text(roles.dataset.primaryKey);
			// requestParams.role_id = grid.optionsData.masterDataset.text(grid.optionsData.masterDataset.primaryKey);
		// });
	});
};
