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
	
	var documentContainer;
	
	if (desktop.canEdit) {
		var item = toolbar.NewDropDownViewItem({
			id: "template",
			icon: "select-template",
			color: "dodgerblue",
			title: "Select Template",
			view: ServiceTemplatesLookup,			
			select: function(code) {
				documentContainer.load(("/template/{0}/view?template={1}").format(desktop.dbService.get("id"), code));
			}
		});

		CreateElementEx("div", viewParams.container, function(container) {
			container.attr("x-sec", "document");
			
			documentContainer = CreateElementEx("div", container, function(template) {
				template.attr("x-sec", "template");
			});
			
		});
		
		return;
		// CreateElementEx("div", viewParams.container, function(container) {
			// container.attr("x-sec", "document");
			
			// CreateElementEx("div", container, function(template) {
				// template.attr("x-sec", "template");
				
				// template.load(("/template/{0}/view?template={1}").format(desktop.dbService.get("id"), "GOP_GM01"))
			// });
			
		// });
	}
			
};
