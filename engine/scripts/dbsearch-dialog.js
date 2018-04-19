// ****************************************************************************************************
// Last modified on
// 14-SEP-2014 ihms.0.0.0.1
// 10-OCT-2014 ihms.0.0.1.0
// 19-OCT-2014 ihms.0.0.1.1
// 09-NOV-2014 ihms.0.0.1.6
// 05-JAN-2014 ihms.0.0.1.8
// 06-FEB-2015 ihms.1.0.0.3 changed "Search" to "Start Search"
// ****************************************************************************************************
//**************************************************************************************************
// File name: dbsearch-dialog.js
//**************************************************************************************************
// SearchDialog = function(options) {
	// return new SearchDialogDefault(options);
// };

// SearchDialogFlat = function(options) {
// };

SearchDialog = function(options) {
	this.Page = options.page;
	// this.InitialTabIndex = options.tabIndex;
	this.Width = options.width;
	this.Toolbar = options.toolbar;
	this.dbSearch = options.dataset;
	this.Enabled = options.enabled;
	
	var self = this;
	var isFlat = this.Page.Version == 4;
	// alerts(this.Page.Version);
	
	this.Events = {};
	this.Events.OnInit = new EventHandler(this);
	this.Events.OnQuery = new EventHandler(this);
	this.Events.OnChangeTab = new EventHandler(this);

	this.Query = function() {
		self.Events.OnQuery.trigger(self);
	};

	// editor.data.Events.OnEditDialog.trigger(editor);
	this.Toolbar.NewItem({
		ID: "SEARCH",
		Title: "Search",
		Align: "right",
		Painter: {
			// color: "green",
			// caption: "Edit",
			dropdown: true,				
			modal: defaultValue(options.modal, true),
			// modal: false,
			// iconIndent: 4,
			iconIndent: isFlat ? 0 : 4,
			iconImage: this.Page.IconSearch,
			iconColor: "blue",
			dialogCss: "blue",
			// painterClass: defaultValue(item.params.Painter.painterClass, PopupOverlayPainter),
			// painterClass: ConfirmPulldownPainter,
			// painterClass: this.Page.DbmEnabled ? CustomPulldownPainter : PopupOverlayPainter,
			painterClass: isFlat ? CustomPulldownPainter : PopupOverlayPainter
		},
		OnClose: function() {
			self.dbSearch.unbindControls();
		},
		OnInitDropDown: function(dialog, container) {
			$(window).resize(function() {
				dialog.RePosition();
			});

			// alerts(self.Page.searchWidth);
			if(!isFlat)
				container.addClass("search-dialog");
				
			container
				.css("width", defaultValue(self.Width, 600)
				
			if(typeof desktop == "object") {
				container.css("z-index", ++desktop.zIndex);
			};
		},
		OnDropDown: function(dialog, container) {
			if(!isFlat) {
				container
					.css("border", "1px " + dialog.Color)
					.css("border-style", "none solid none solid")
					.css("background-color", "white")
					.css("height", "auto");
			};
			
			new JTabbedEdit({
					page: self.Page,
					data: self.dbSearch,
					container: container,
					fluid: true,
					tabHeight: 32+6,
					css: isFlat ? "edit-search-dbm" : "editor-search",
					pgcss: isFlat ? "pg-search-dbm" : "pg-search",
					events: {
						init: function(editor) {
							// create a function where we can set the width of the dialog
							editor.setWidth = function(w) {
								dialog.Painter.MainContainer.css("width", w);
							};
							
							editor.data.Events.OnEditDialog.trigger(editor);
						},
						afterInit: function(editor) {
							self.Events.OnInit.trigger(editor);

							if(editor.pg.TabCount() <= 1) {
							// if(editor.pg.TabCount()) { // <= 1 && !isFlat) {
								editor.pg.Painter.TabsContainer.css("position", "");
								container.css("height", "auto");
								container.find("div[pg-section='contents']").css("padding", 10);

								container.find("div[edit-style='simple']")
									.removeClass("editor-search-table-container")
									.addClass("editor-search-container-full-border")
									
								container.find("div[edit-style='nav']")
									.removeClass("editor-search-container-full-border")
									
								container.find("div[class='editor-search-group'][pos='last']")
									.css("border-style", "none")
							};
						},
						changeTab: function(editor, tab) {
							if(!isFlat) {
								tab.GetTab().find("div[edit-style='simple']")
									.removeClass("editor-search-table-container")
									.addClass("editor-search-container-full-border")
									
								tab.GetTab().find("div[edit-style='nav']")
									.removeClass("editor-search-container-full-border")
									
								tab.GetTab().find("div[class='editor-search-group'][pos='last']")
									.css("border-style", "none")
									
									tab.GetTab().find(".editor-search-table")
										.keypress(function(e){
											if(e.which == 13) {
												if($(event.target).is("input") {
													var binding = $(event.target).data("binding");
													if(binding !== undefined) {
														$(event.target).trigger("change");
														self.Query();
														e.preventDefault();
													};
												};
											};
										});	
							};
							
							container.css("height", 10*2+6 + editor.pg.TabHeight + $(tab.Painter.Tab.find("div")[0]).outerHeight());
							self.Events.OnChangeTab.trigger(tab.TabIndex);
						}
					}
			});
		},
		OnRenderFooter: function(dialog, container) {
			container
				.css("padding", "0px 10px 10px 10px")

			if(self.Enabled) {
				CreateElement("div", container, "", "button")
					.attr("btn-state", "enabled")
					.attr("btn-color", "green")
					.html("Start Search")
					.click(function() {
						if($(this).attr("btn-state") == "enabled") {														
							self.Query();
						};
					});
					
				CreateElement("div", container, "", "button")
					.attr("btn-state", "enabled")
					.attr("btn-color", "blue")
					.html("Clear")
					.click(function() {
						if($(this).attr("btn-state") == "enabled") {
							self.dbSearch.Events.OnClearQuery.trigger();
							self.Query();
						};
					});
			} else {
				CreateElement("div", container, "", "button")
					.attr("btn-state", "enabled")
					.attr("btn-color", "green")
					.html("Apply")
					.click(function() {
						if($(this).attr("btn-state") == "enabled") {														
							self.Query();
						};
					});
			}
			
			CreateElement("a", CreateElement("div", container, "", "button-text"))
				.html("Close")
				.click(function() {
					dialog.Hide();
				});
					
		}
	});
	
};
//**************************************************************************************************
// File name: dbsearch-dialog.js
//**************************************************************************************************
EditDropDown = function(options) {
	this.Page = options.page;
	// this.InitialTabIndex = options.tabIndex;
	this.Width = options.width;
	this.Toolbar = options.toolbar;
	this.dbSearch = options.dataset;
	
	this.dbSearch.Events.OnPost.add(function(dataset, callback) {
			// callback("", 0);
		// alert("OK...");
		dataset.dialog.Hide();
		self.Events.OnConfirm.trigger(self);
	};
	
	var self = this;

	this.Events = {};
	this.Events.OnInit = new EventHandler(this);
	this.Events.OnConfirm = new EventHandler(this);
	this.Events.OnChangeTab = new EventHandler(this);
	this.Events.OnDisplayMessage = new EventHandler(this);

	// this.Confirm = function() {
		// self.Events.OnConfirm.trigger(self);
	// };

	// editor.data.Events.OnEditDialog.trigger(editor);
	this.Toolbar.NewItem({
		ID: options.id,
		Title: options.title,
		Align: "left",
		Painter: {
			color: "green",
			caption: "Edit",
			dropdown: true,				
			iconImage: options.icon,
			iconIndent: 4
		},
		OnClose: function() {
			self.dbSearch.unbindControls();
		},
		OnInitDropDown: function(dialog, container) {
			$(window).resize(function() {
				dialog.RePosition();
			});

			// alerts(self.Page.searchWidth);
			container.addClass("search-dialog")
				.css("width", defaultValue(self.Width, 600)
				
			if(typeof desktop == "object") {
				container.css("z-index", ++desktop.zIndex);
			};
		},
		OnDropDown: function(dialog, container) {
			container
				.css("border", "1px " + dialog.Color)
				.css("border-style", "none solid none solid")
				.css("background-color", "white")
				.css("height", "auto");
				
			var headerTitle = CreateElement("div", container, "", "")
				.css("width", "100%")
				.css("height", "auto")
				.css("padding", "10px 10px 0 10px")
				.css("box-sizing", "border-box")
				.css("font-weight", "bold")
				.css("font-size", "11pt")
				.html(options.title);
				
			// if(options.OnDisplayTitle) {
			var SubTitle = CreateElement("div", container, "", "")
				.css("width", "100%")
				.css("height", "auto")
				// .css("padding", "10px 10px 0 10px")
				.css("box-sizing", "border-box")
					
			self.Events.OnDisplayMessage.trigger(SubTitle);
				
			new JTabbedEdit({
					page: self.Page,
					data: self.dbSearch,
					container: container,
					fluid: true,
					tabHeight: 32+6,
					css: "editor-search",
					pgcss: "pg-search",
					events: {
						init: function(editor) {
							editor.setWidth = function(w) {
								dialog.Painter.MainContainer.css("width", w);
							};
							
							editor.data.Events.OnInitEditDialog.trigger(editor);
							editor.data.Events.OnEditDialog.trigger(editor);
						},
						afterInit: function(editor) {
							self.dbSearch.edit();
							self.Events.OnInit.trigger(editor);

							if(editor.pg.TabCount() <= 1) {
								editor.pg.Painter.TabsContainer.css("position", "");
								container.css("height", "auto");
								container.find("div[pg-section='contents']").css("padding", 10);

								container.find(".editor-search-table-container")
									.removeClass("editor-search-table-container")
									.addClass("editor-search-container-full-border")
							};
						},
						changeTab: function(editor, tab) {
							tab.GetTab().find(".editor-search-table-container")
								.removeClass("editor-search-table-container")
								.addClass("editor-search-container-full-border")
								
								tab.GetTab().find(".editor-search-table")
									.keypress(function(e){
										if(e.which == 13) {
											if($(event.target).is("input") {
												var binding = $(event.target).data("binding");
												if(binding !== undefined) {
													$(event.target).trigger("change");
													self.Query();
													e.preventDefault();
												};
											};
										};
									});	

							container.css("height", 10*2+6 + editor.pg.TabHeight + $(tab.Painter.Tab.find("div")[0]).outerHeight());
							self.Events.OnChangeTab.trigger(tab.TabIndex);							
						}
					}
			});
			
		
			var footer = CreateElement("div", container, "", "")
				.css("width", "100%")
				.css("height", "auto")
				.css("padding", "0px 10px 10px 10px")
			
			self.dbSearch.warned = false;
			CreateElement("div", footer, "", "button")
				.attr("btn-state", "enabled")
				.attr("btn-color", "green")
				.html("Apply")
				.click(function() {
					if($(this).attr("btn-state") == "enabled") {	
						self.dbSearch.dialog = dialog;
						// self.dbSearch.post(w);
						self.dbSearch.post(function(dataset, msg) {
							if(!dataset.warned) {
								dataset.warned = true;
								CreateElement("div", container, "", "")
									.css("width", "100%")
									.css("height", "auto")
									// .css("margin", "4px")
									.css("padding", "4px")
									.css("color", "red")
									.css("background-color", "wheat")
									.css("box-sizing", "border-box")
									.html("*Field <b>name</b> is mandatory.")
							}
						});
					};
				});
				
			CreateElement("a", CreateElement("div", footer, "", "button-text"))
				.html("Close")
				.click(function() {
					dialog.Hide();
				});
		}
	});
	
};
