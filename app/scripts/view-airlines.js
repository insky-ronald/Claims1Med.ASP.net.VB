// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-airlines.js
//==================================================================================================
function AirlinesView(params){	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "airlines",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			AirlineEdit({
				id: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/airlines";
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "name")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
					    .setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("code", {label:"SunCode"})
						.setprops("spin_id", {label:"SPIN ID"})
						.setprops("name", {label:"Name"})
						.setprops("country", {label:"Country"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code"))
				});	
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					grid.dataset.gotoKey(id);
					return {title: "Delete Airline", message: ("Please confirm to delete airline <b>{0}</b>.").format(grid.dataset.get("name"))};
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({id:"00", caption: "General"}, function(band) {
						band.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "code", width: 100, allowSort: false, fixedWidth:true});
						band.NewColumn({fname: "spin_id", width: 100, allowSort: false, fixedWidth:true});
						band.NewColumn({fname: "name", width: 200, aloowSort: true, fixedWidth:true});
						band.NewColumn({fname: "country", width: 200, allowSort: false, fixedWidth:true});
					})
				});
			});
		}
	});	
};