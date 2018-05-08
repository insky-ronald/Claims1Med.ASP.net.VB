// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-diagnosis-group.js
//==================================================================================================
function DiagnosisGroupView(viewParams){
	// var name = "app/clinics";
	
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "clinics",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			// ClinicEdit({
				// id: id,
				// container: container,
				// dialog: dialog
			// })
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/service-diagnosis-group";
				// grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", 0, {numeric:true});
			
					if (viewParams.initParams) {
						viewParams.initParams(dataParams);
					}
					// dataParams.Columns
						// .setprops("filter", {label:"Diagnosis"})
						// .setprops("is_shortlist", {label:"Condensed list"})
						// .setprops("version", {label:"Version"})
						
					// dataParams.Events.OnResetSearch.add(function(dataset) {
						// dataset.set("is_shortlist", 1);
						// dataset.set("version", "10");
					// });
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("diagnosis_group", {label:"Code", key:true})
						.setprops("diagnosis", {label:"Diagnosis"})
				});
	
				grid.methods.add("getCommandIcon", function(grid, column, previous) {
					return "transfer"
				});
	
				grid.methods.add("getCommandHint", function(grid, column, previous) {
					return "Select this plan"
				});
				
				grid.Events.OnCommand.add(function(grid, column) {
					viewParams.select(grid.dataset.get("diagnosis_group"));
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					// row.attr("x-status", grid.dataset.get("status_code"));
					// row.attr("x-blacklisted", grid.dataset.get("blacklisted"));
				});	
				
				// grid.Methods.add("deleteConfirm", function(grid, id) {
					// grid.dataset.gotoKey(id);
					// return {title: "Delete Clinic", message: ("Please confirm to delete clinic <b>{0}</b>.").format(grid.dataset.get("name"))};
				// });
				
				grid.Events.OnInitColumns.add(function(grid) {
					// grid.NewBand({id:"00", caption: "General"}, function(band) {
						grid.NewCommand({command:"select"});
						grid.NewColumn({fname: "diagnosis_group", width: 75, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "diagnosis", width: 400, allowSort: true, fixedWidth:false});
						// band.NewColumn({fname: "diagnosis"});
					// })
				});
			});
		}
	});	
};