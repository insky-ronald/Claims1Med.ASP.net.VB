// ****************************************************************************************************
// File name: view-service-actions.js
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// uses edit-address.js
//==================================================================================================
function ServiceActionsView(params){
	// var service_id = params.service_id;
	
	return new JDBGrid({
		params: params,
		// container: params.container, 
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "service-actions"
		},
		editForm: function(id, container, dialog) {
			// AddressEdit({
				// url: ("?id={0}&name_id={1}").format(id, name_id),
				// container: container,
				// containerPadding: 0,
				// showToolbar: false,
				// pageControlTheme: "data-entry",
				// fillContainer: true,
				// dialog: dialog
			// })
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "service-actions";
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = false;
				grid.options.showSummary = false;
				grid.options.cardView = true;
				grid.options.showCardToolbar = false;
				// grid.options.cardView = false;
				grid.options.autoScroll = false;
				grid.options.allowSort = true;
				// grid.options.showSelection = true;
				grid.options.showBand = false;
				// grid.options.showBand = true;
				// grid.options.advanceSearch = true;
				// grid.options.simpleSearch = true;
				// grid.options.simpleSearchField = "name";
				// grid.optionsData.editCallback = function(grid, id) {
					// __masterpolicy(id);
				// };

				// var parts = this.url.split("?");
				// if(parts.length > 0
					// grid.optionsData.requestParams = parts[1];
							
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						// .addColumn("id", service_id, {numeric:true})
						.addColumn("id", desktop.ServiceID, {numeric:true})
						.addColumn("sort", "due_date")
						.addColumn("order", "desc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("action_type", {label:"Class"})
						.setprops("action", {label:"Action"})
						.setprops("due_date", {label:"Due Date", type:"date"})
						.setprops("action_owner", {label:"Owner"})
						.setprops("completion_date", {label:"Date Completed", type:"date", format:"datetime"})
						.setprops("completion_user", {label:"Completed By"})
						.setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						.setprops("update_date", {label:"Last Updated", type:"date", format:"datetime"})
						.setprops("due_date", {label:"Due Date", type:"date", format:"datetime"})
				});

				grid.Events.OnInitColumns.add(function(grid) {
					// grid.NewColumn({fname: "action", width: 100, allowSort: true, fixedWidth:true});
					// grid.NewColumn({fname: "action_type", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "due_date", width: 125, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "", allowSort: false});
					// grid.NewColumn({fname: "action_owner", width: 150, allowSort: true});
					// grid.NewColumn({fname: "completion_date", width: 150, allowSort: true});
					// grid.NewColumn({fname: "completion_user", width: 150, allowSort: true});
				});
				
				grid.Events.OnInitCard.add(function(grid, card) {
					// card.parent().html("");
					var status = grid.dataset.get("is_done");
					// var complete = status == "D";
					var header = CreateElement("div", card).attr("action-sec", "header").attr("status", status);
					CreateElement("div", header).attr("header-sec", "action").html(grid.dataset.get("action"))
					CreateElement("div", header).attr("header-sec", "action-type").html(grid.dataset.get("action_type"))

					if(grid.dataset.get("notes")) {
						CreateElement("div", card).attr("audit-container", "notes").html(grid.dataset.get("notes"))
						// CreateElement("div", card).attr("audit-container", "notes").html(grid.dataset.get("is_done"))
					};
					
					var audit, panel, line = CreateElement("div", card).attr("audit-container", "main");
					
					panel = CreateElement("div", line).attr("audit-container", "left")
						audit = CreateElement("div", panel).attr("audit-panel","owner").attr("status", status);
						CreateElement("span", audit).attr("audit-item", "user").html(grid.dataset.get("action_owner"))
						CreateElement("span", audit).attr("audit-item", "date").html(grid.dataset.text("due_date"))

						if(status == "D") {
							audit = CreateElement("div", panel).attr("audit-panel","complete");
							CreateElement("span", audit).attr("audit-item", "user").html(grid.dataset.get("completion_user"))
							CreateElement("span", audit).attr("audit-item", "date").html(grid.dataset.text("completion_date"))
						} else if(status == "X") {
							audit = CreateElement("div", panel).attr("audit-panel","cancel");
							CreateElement("span", audit).attr("audit-item", "user").html(grid.dataset.get("completion_user"))
							CreateElement("span", audit).attr("audit-item", "date").html(grid.dataset.text("completion_date"))
						};
						
					panel = CreateElement("div", line).attr("audit-container", "right");
						audit = CreateElement("div", panel).attr("audit-panel","create").attr("status", status);
						CreateElement("span", audit).attr("audit-item", "user").html(grid.dataset.get("create_user"))
						CreateElement("span", audit).attr("audit-item", "date").html(grid.dataset.text("create_date"))

						audit = CreateElement("div", panel).attr("audit-panel","update").attr("status", status);
						CreateElement("span", audit).attr("audit-item", "user").html(grid.dataset.get("update_user"))
						CreateElement("span", audit).attr("audit-item", "date").html(grid.dataset.text("update_date"))
						
					if(status == "N") {
						var buttons = CreateElement("div", card).attr("audit-container", "buttons");
							CreateButton({
								container: buttons,
								caption: "Action Done...",
								style: "green",
								click: function(button) {
									// grid.Refresh();
								}
							});
							
							CreateButton({
								container: buttons,
								caption: "Change Action Owner...",
								style: "blue",
								click: function(button) {
									// grid.Refresh();
								}
							});
							
							CreateButton({
								container: buttons,
								caption: "Cancel Action...",
								style: "red",
								click: function(button) {
									// grid.Refresh();
								}
							});
					};
					
					/*
					var audit, line = CreateElement("div", card).attr("action-sec", "audit-container");
					audit = CreateElement("div", line).attr("audit-sec", "audit-owner").attr("action-sec", "audit"); 
						CreateElement("span", audit).attr("audit-sec", "user").html(grid.dataset.get("action_owner"))
						CreateElement("span", audit).attr("audit-sec", "date").html(grid.dataset.text("due_date"))

					line = CreateElement("div", card).attr("action-sec", "audit-container");
					audit = CreateElement("div", line).attr("audit-sec", "audit-create").attr("action-sec", "audit"); 
						CreateElement("span", audit).attr("audit-sec", "user").html(grid.dataset.get("create_user"))
						CreateElement("span", audit).attr("audit-sec", "date").html(grid.dataset.text("create_date"))
						
					audit = CreateElement("div", line).attr("audit-sec", "audit-update").attr("action-sec", "audit"); 
						CreateElement("span", audit).attr("audit-sec", "user").html(grid.dataset.get("update_user"))
						CreateElement("span", audit).attr("audit-sec", "date").html(grid.dataset.text("update_date"))
						*/
				});
				
				// grid.Events.OnInitToolbar.add(function(grid, toolbar) {
				// });
			});
		}
	});	
};
