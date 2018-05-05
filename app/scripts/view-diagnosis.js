// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-diagnosis.js
//==================================================================================================
function DiagnosisView(params){
	// var name = "app/clinics";
	
	return new jGrid($.extend(params, {
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
				grid.optionsData.url = "app/diagnosis";
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
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
						.addColumn("version", "")
						.addColumn("is_shortlist", 0, {numeric:true})
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", key:true})
						.setprops("diagnosis", {label:"Diagnosis"})
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
					grid.NewBand({id:"00", caption: "General"}, function(band) {
						band.NewColumn({fname: "code", width: 75, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "diagnosis", width: 400, allowSort: true, fixedWidth:false});
						// band.NewColumn({fname: "diagnosis"});
					})
				});
			});
		}
	});	
};