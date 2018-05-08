// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-family-members.js
//==================================================================================================
function FamilyMembersView(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "member-family",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/member-family";
				
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.editNewPage = false;
				grid.options.showBand = false;
				grid.options.showSummary = false;
				grid.options.showPager = false;
				// grid.options.showMasterDetail = true;
				
				grid.search.visible = false;
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("certificate_id", viewParams.requestParams.certificate_id, {numeric:true})
						.addColumn("sort", "dependent_code")
						.addColumn("order", "asc")
				});

				grid.methods.add("getLinkUrl", function(grid, params) {
					if(params.column.linkField === "id") {
						return __member(params.id, true)
					} else {
						return ""
					}
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("dependent_code", {label:"#"})
						.setprops("certificate_no", {label:"Certificate No."})
						.setprops("full_name", {label:"Member's Name"})
						.setprops("relationship", {label:"Relationship"})
						.setprops("sex", {label:"Gender"})
						.setprops("dob", {label:"DOB", type:"date"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-type", grid.dataset.get("dependent_code"));
				});	
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({caption: "...", fixed:"left"} , function(band) {
						band.NewColumn({fname: "dependent_code", width: 50, allowSort: true,});
					});
					
					grid.NewBand({caption: "..."} , function(band) {
						band.NewColumn({fname: "certificate_no", width: 125, allowSort: true,});
						// band.NewColumn({fname: "full_name", width: 250});
						grid.NewColumn({fname: "full_name", width: 250, allowSort: true, linkField:"id"});
						band.NewColumn({fname: "relationship", width: 150});
						band.NewColumn({fname: "sex", width: 75});
						band.NewColumn({fname: "dob", width: 100});
					});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					if (!viewParams.requestParams.new_member) {
						toolbar.NewDropDownViewItem({
							id: "new-member",
							icon: "new",
							color: "#1CA8DD",
							title: "New Dependent",
							height: 200,
							// width: 800,
							subTitle: "Choose the relationship of the new dependent",
							view: RelationshipsLookup,
							// viewParams: {module:"INV", mode:1},
							select: function(code) {
								// window.open(__member(("new/{0}?plan={1}&rel={2}").format(viewParams.requestParams.certificate_id, viewParams.requestParams.plan_code, code), true), "");
								window.open(__member(("new/{0}?rel={1}").format(viewParams.requestParams.certificate_id, code), true), "");
							}
						});
					}
				});
			});
		}
	}));
};
