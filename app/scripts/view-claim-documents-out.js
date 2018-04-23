// ****************************************************************************************************
// File name: view-claim-documents-out.js
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// uses edit-address.js
//==================================================================================================
function ClaimDocumentsOutView(params){
	// var service_id = params.service_id;
	var owner = params.owner;
	
	return new JDBGrid({
		params: params,
		// container: params.container, 
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "claim-documents-out"
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
				grid.optionsData.url = "claim-documents";
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
				// grid.options.showHeader = false;
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
						.addColumn("service_id", desktop.ServiceID, {numeric:true})
						.addColumn("document_source", "O")
						.addColumn("sort", "source")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("source", {label:"Source"})
						.setprops("document_name", {label:"Document Name"})
						.setprops("action_code", {label:"Action"})
						.setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						.setprops("update_date", {label:"Last Updated", type:"date", format:"datetime"})
						// .setprops("action", {label:"Action"})
						// .setprops("due_date", {label:"Due Date", type:"date"})
						// .setprops("action_owner", {label:"Owner"})
						// .setprops("completion_date", {label:"Date Completed", type:"date", format:"datetime"})
						// .setprops("completion_user", {label:"Completed By"})
						// .setprops("due_date", {label:"Due Date", type:"date", format:"datetime"})
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "source", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "document_name", width: 150, allowSort: true, fixedWidth:true});
					// grid.NewColumn({fname: "action_type", width: 100, allowSort: true, fixedWidth:true});
					// grid.NewColumn({fname: "due_date", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "", allowSort: false});
					// grid.NewColumn({fname: "action_owner", width: 150, allowSort: true});
					// grid.NewColumn({fname: "completion_date", width: 150, allowSort: true});
					// grid.NewColumn({fname: "completion_user", width: 150, allowSort: true});
				});
				
				grid.Events.OnInitCard.add(function(grid, card) {
					var action = grid.dataset.get("action_code");
					var source = grid.dataset.get("source");
					var status = grid.dataset.get("status_code");
					var eTable = CreateElement("table", card)
						.attr("border", 0)
						.attr("cellspacing", 0)
						.attr("cellpadding", 0)
						.attr("status-sec", "status");
					var eBody = CreateElement("tbody", eTable);
					var eRow = CreateElement("tr", eBody);
					var eSatusCode = CreateElement("td", eRow)
						.attr("status-sec", "code")
						.attr("status", action)
						// .attr("status", "P")
						.html(grid.dataset.get("action_code"));
						
					var eContent = CreateElement("td", eRow)
						.attr("status-sec", "content")
						.attr("status", status);
						
						var eTitle = CreateElement("div", eContent)
							.attr("status-sec", "title")
							.attr("status", action);
							
							CreateElement("span", eTitle)
								.attr("status-sec", "sub-status-name")
								.html(grid.dataset.get("document_name"));
								
							// CreateElement("span", eTitle)
								// .attr("status-sec", "status-name")
								// .html(grid.dataset.get("status"))

						// var aRecipient = CreateElement("div", eContent).attr("status-sec", "recipient")
							// CreateElement("span", aAudit).attr("status-item", "user").html(grid.dataset.get("recipient"))
							
						// if(action == "F")
						var aRecipient = CreateElement("div", eContent).attr("status-sec", "audit");
							CreateElement("div", aRecipient).attr("status-item", "recipient").html(grid.dataset.get("recipient"));
							CreateElement("div", aRecipient).attr("status-item", "phone").html(grid.dataset.get("phone_no"));
							CreateElement("div", aRecipient).attr("status-item", "email").html(grid.dataset.get("email"));
							// CreateElement("span", aRecipient).attr("status-item", "date").html(grid.dataset.text("create_date"))
							
						var aAudit = CreateElement("div", eContent).attr("status-sec", "audit");
							CreateElement("span", aAudit).attr("status-item", "user").html(grid.dataset.get("create_user"));
							CreateElement("span", aAudit).attr("status-item", "date").html(grid.dataset.text("create_date"));
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// owner.initStatusToolbar(toolbar);
				});
			});
		}
	});	
};
