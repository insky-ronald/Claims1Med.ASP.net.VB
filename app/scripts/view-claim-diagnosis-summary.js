// ****************************************************************************************************
// Last modified on
// 27-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-claim-diagnosis-summary.js
//==================================================================================================
function ClaimDiagnosisSummaryView(params) {
	return new jGrid($.extend(params, {
		paintParams: {
			css: "claim-diagnosis",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/claim-diagnosis-summary";
				
				grid.options.viewType = "cardview";
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showMasterDetail = false;
				grid.options.editNewPage = false;
				grid.options.hideHeader = true;
				// grid.options.showSummary = true;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("claim_id", params.claim_id)
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"#", numeric:true, key: true})
						.setprops("diagnosis_code", {label:"ICD Code"})
						.setprops("diagnosis", {label:"Diagnosis"})
						// .setprops("notification_date", {label:"Notification Date", type:"date"})
						.setprops("main", {numeric:true})
						// .setprops("status", {label:"Status"})
						// .setprops("diagnosis", {label:"Diagnosis"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("main"))
				});	
				
				grid.Events.OnInitCard.add(function(grid, card) {
					grid.dataset.gotoKey(parseInt(card.attr("row-id")))
					
					card.attr("x-parent", grid.dataset.get("main"))
					if(grid.dataset.get("main"))
						card.addClass("parent")
					else
						card.addClass("child")
					
					CreateElement("div", card)
						.addClass("code")
						.html(grid.dataset.get("diagnosis_code"))
					
					CreateElement("div", card)
						.addClass("name")
						.html(grid.dataset.get("diagnosis"))
						
					// card.html(grid.dataset.get("diagnosis_code"))
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					// grid.NewColumn({fname: "diagnosis_code", width: 150, fixedWidth:true, allowSort: true});
				});
			});
		}
	}));
};
