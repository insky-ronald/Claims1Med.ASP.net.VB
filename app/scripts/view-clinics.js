// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-clinics.js
//==================================================================================================
function ClinicsView(params){
	// var name = "app/clinics";
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "clinics",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			ClinicEdit({
				id: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/clinics";
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
						.setprops("discount_type_id", {label:"Discount",
							getText: function(column, value) {
								if(value === "1") {
									return ("{0}% on invoice total").format(column.dataset.get("discount_percent"))
								} else if(value === "3") {
									return ("{0}% per invoice item").format(column.dataset.get("discount_percent")) 
								} else if(value === "4") {
									return ("IDR {0} per invoice item").format(column.dataset.get("discount_amount"))
								} else {
									return "..."
								}
							}
						})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code"));
					row.attr("x-blacklisted", grid.dataset.get("blacklisted"));
				});	
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					grid.dataset.gotoKey(id);
					return {title: "Delete Clinic", message: ("Please confirm to delete clinic <b>{0}</b>.").format(grid.dataset.get("name"))};
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({id:"00", caption: "General"}, function(band) {
						band.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "code", width: 100, allowSort: false, fixedWidth:true});
						band.NewColumn({fname: "spin_id", width: 100, allowSort: false, fixedWidth:true});
						band.NewColumn({fname: "name", width: 200, aloowSort: true, fixedWidth:true});
						band.NewColumn({fname: "country", width: 200, allowSort: false, fixedWidth:true});
						band.NewColumn({fname: "discount_type_id", width: 200, allowSort: false, fixedWidth:true});
					})
				});
			});
		}
	});	
};