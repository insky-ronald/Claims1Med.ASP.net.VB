// ****************************************************************************************************
// Last modified on
// 07-MAR-2017
// ****************************************************************************************************
//==================================================================================================
// File name: edit-sys-permission.js
//==================================================================================================
function PermissionEdit(params){
	// console.log(params)
	return new FormEditor({
		id: params.id,
		requestParams: params.requestParams,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		url: params.url,
		postBack: "engine/sys-permissions",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				// data.Columns
					// .setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					// .setprops("code", {label:"Code", required:true})
					// .setprops("action_name", {label:"Action", required:true})
					// .setprops("description", {label:"Description", required:false})
					// .setprops("position", {label:"Position", numeric:true, readonly:false})
					// .setprops("action_type_id", {label:"Type", numeric:true, readonly:false})
					// .setprops("status_code_id", {label:"Status", numeric:true, readonly:false})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewSubSelectionView("Perrmission Assignment", 300, "permissions", PermissionEditView);
			});
		}
	});
}; 

function PermissionEditView(params){
	var name = "engine/sys-permissions";
	// console.log(params.editor.Control.postBackParams)
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "sys-permissions"
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = name+"?lookup=1";
				if(params.editor.Control.postBackParams)
					grid.optionsData.url += "&" + params.editor.Control.postBackParams;
				// console.log(grid.optionsData.url)
				if(params.selectionColumn)
					grid.InitSelections(params.selectionColumn.dataset.get(params.selectionColumn.fname));
				
				// grid.optionsData.cache = true;
				grid.options.lookup = !params.selectionColumn;
				grid.options.showToolbar = false;
				grid.options.toolbarTheme = "svg";
				grid.options.horzScroll = false;
				grid.options.showPager = false;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showSelection = params.selectionColumn;
				grid.options.showBand = false;
				grid.options.simpleSearch = false;
				grid.options.simpleSearchField = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					// dataParams
						// .addColumn("page", 1, {numeric:true})
						// .addColumn("pagesize", 50, {numeric:true})
						// .addColumn("sort", "position")
						// .addColumn("order", "asc")
						// .addColumn("filter", "")
						// .addColumn("owner_id", 1)
						// .addColumn("type", -1)
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("rights", {label:"Permissions"})
						// .setprops("description", {label:"Description"})
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "rights", width: 100, allowSort: false, fixedWidth:false});
					// grid.NewColumn({fname: "description", width: 0, allowSort: true});
				});

				if(params.selectionColumn)
					grid.Events.OnSelect.add(function(grid, selection) {
						params.selectionColumn.dataset.set(params.selectionColumn.fname, selection.join(","));
					});
			});
		}
	});	
};
