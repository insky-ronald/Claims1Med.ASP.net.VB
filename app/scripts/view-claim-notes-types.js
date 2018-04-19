// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-claim-notes-types.js
// uses edit-note-types.js
//==================================================================================================
function ListNoteTypes(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "claim-note-types",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			EditNoteTypes({
				code: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Note Type",
						message: ('Please confirm to delete note type "<b>{0}</b>"').format(grid.dataset.get("note_type"))
					}
				});
				
				grid.optionsData.url = "claim-notes-types";				
				grid.options.fixedColumnWidths = true;
				grid.options.allowSort = true;
				// grid.options.showCustomHeader = true;
				grid.options.autoScroll = true;
				grid.options.horzScroll = true;
				grid.options.showMasterDetail = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", key: true})
						.setprops("note_type", {label:"Type"})
				});

				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(251);
					ListNoteSubTypes({
						noteSubType: grid.dataset.get("code"),
						container: params.container
					})
				})
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "note_type", width: 500, fixedWidth:true});
				});
			})
		}
	}));
};

function ListNoteSubTypes(params){
	var noteSubType = params.noteSubType;
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "note-sub-types",
			theme: "child",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			EditNoteSubTypes({
				code: id,
				noteSubType: params.noteSubType,
				container: container,
				showToolbar: false,
				dialog: dialog
			})
		},
		edit: function(id, e) {
			
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Note Sub-Type",
						message: ('Please confirm to delete sub-type "<b>{0}</b>"').format(grid.dataset.get("note_sub_type"))
					}
				});
		
				grid.methods.add("deleteKeys", function(grid, id) {
					return [{
						code: id,
						note_type: grid.dataset.get("note_type")
					}];
				})
				
				grid.optionsData.url = "note-sub-types";
				grid.options.fixedColumnWidths = true;
				grid.options.allowSort = true;
				grid.options.autoScroll = false;
				grid.options.showPager = false;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("note_type", noteSubType)
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", key: true})
						.setprops("note_sub_type", {label:"Sub-Type"})
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "note_sub_type", width: "100%", fixedWidth:false});
				});
			})
		}
	}));
};

