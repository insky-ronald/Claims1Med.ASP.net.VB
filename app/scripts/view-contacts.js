// ****************************************************************************************************
// File name: view-contacts.js
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// uses edit-contacts.js
//==================================================================================================
function ContactsView(params){
	function MasterKey() {
		if(params.getMasterID) {
			return params.getMasterID()
		} else {
			return params.requestParams.name_id
		}
	};
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "contacts",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			ContactsEdit({
				url: ("?id={0}&name_id={1}").format(id, MasterKey()),
				container: container,
				// containerPadding: 0,
				// showToolbar: false,
				// pageControlTheme: "data-entry",
				// fillContainer: true,
				dialog: dialog
			})
		},
		init: function(grid) {				
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "contacts";
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				grid.options.showPager = false;
				grid.search.visible = false;
							
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						// .addColumn("name_id", name_id, {numeric:true})
						.addColumn("name_id", MasterKey(), {numeric:true})
						.addColumn("sort", "full_name")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("title", {label:"Title"})
						.setprops("full_name", {label:"Contact Name"})
						.setprops("department", {label:"Department"})
						.setprops("position", {label:"Position"})
						.setprops("phone", {label:"Phone No."})
						.setprops("mobile", {label:"Mobile No."})
						.setprops("fax", {label:"Fax No."})
						.setprops("email", {label:"Email Address"})
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "title", width: 50, allowSort: false, fixedWidth:true});
					grid.NewColumn({fname: "full_name", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "department", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "position", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "phone", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "mobile", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "fax", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "email", width: 200, allowSort: true, fixedWidth:true});
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Contact",
						message: ('Please confirm to delete contact "<b>{0}</b>".').format(grid.dataset.lookup(id, "full_name"))
					}
				});
				
				// grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.grid = grid;
					// grid.owner.InitializeToolbar(toolbar);
				// });
			});
		}
	}));	
};
