// ****************************************************************************************************
// Last modified on
// 12:20 PM Friday, October 6, 2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-document-template.js
//==================================================================================================
function DocumentTemplateContainer(viewParams){
	viewParams.container.addClass("document-template");
	var toolbarContainer = CreateElement("div", viewParams.container)	
			.attr("x-sec", "toolbar");
			
	var toolbar = new JToolbar({
			// id: "tb",
			// container: container,
			container: toolbarContainer,
			css: "toolbar",
			// theme: this.Control.options.toolbarTheme,
			theme: "svg",
			// buttonSize: this.Control.options.toolbarSize
			buttonSize: 24
	});
	
	toolbar.NewItem({
		id: "refresh",
		// icon: grid.options.toolbarSize == 16 ? "/engine/images/refresh.png": "/engine/images/refresh-24.png",
		icon: "refresh",
		iconColor: "#8DCF6E",
		hint: "Refresh",
		// dataBind: this.dataset,
		// dataEvent: function(dataset, button) {
			// button.show(!dataset.editing);
		// },
		click: function(item) {
			// grid.Refresh();
		}
	});
	
	var item = toolbar.NewDropDownViewItem({
		id: "template",
		icon: "select-template",
		color: "dodgerblue",
		title: "Select Template",
		// subTitle: "Choose the type of pending status.",
		// height: 200,
		// width: 500,
		// view: ProceduresView,
		select: function(code) {
			// desktop.Ajax(
				// self, 
				// "/app/api/command/add-claim-procedure",
				// {
					// service_id: desktop.dbService.get("id"),
					// claim_id: desktop.dbService.get("claim_id"),
					// code: code,
					// diagnosis_code: ""
				// }, 
				// function(result) {
					// if (result.status == 0) {
						// grid.refresh();
					// } else {
						// ErrorDialog({
							// target: item.elementContainer,
							// title: "Error adding procedure",
							// message: result.message
						// });
					// }
				// }
			// )
		}
	});

	// var documentContainer = CreateElement("div", viewParams.container)	
			// .attr("x-sec", "document");

	CreateElementEx("div", viewParams.container, function(container) {
		container.attr("x-sec", "document");
		
		CreateElementEx("div", container, function(template) {
			template.attr("x-sec", "template");
			
			template.load("/template/507846/view?template=GOP_GM01")
			return;
			desktop.Ajax(
				this, 
				"/template/507846/view",
				{
					template: "GOP_GM01"
					// service_id: desktop.dbService.get("id"),
					// claim_id: desktop.dbService.get("claim_id"),
					// code: code,
					// diagnosis_code: ""
				}, 
				function(result) {
					// console.log(result);
					template.html(result);
				}
			)
		});
		
	});
			
};
