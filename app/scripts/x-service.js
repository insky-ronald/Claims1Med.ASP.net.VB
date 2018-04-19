// ****************************************************************************************************
// File name: service.js
// Last modified on
// 
// ****************************************************************************************************
//**************************************************************************************************
// ClaimService
//**************************************************************************************************
Class.Inherits(ClaimService, JObject);
function ClaimService(params) {
	ClaimService.prototype.parent.call(this, params);
};

ClaimService.prototype.classID = "ClaimService";
ClaimService.prototype.type = "gop";
ClaimService.prototype.name = "Invoice";
ClaimService.prototype.fullName = "Invoice";
// ClaimService.prototype.showDiagnosis = false;
// ClaimService.prototype.showProcedure = false;

ClaimService.prototype.initialize = function(params) {
	ClaimService.prototype.parent.prototype.initialize.call(this, params);
	
	params.owner = this;
	params.container.addClass("service-details service-" + this.type);
	params.dataset = desktop.dbService;
	// desktop.dbCurrencies = desktop.LoadCacheData(desktop.customData.currencies, "currencies", "code");
	// desktop.dbService = params.dataset = new Dataset(desktop.customData.data, this.name);
	// desktop.dbSubService = new Dataset(desktop.customData.sub_type_data, "Sub-Type");
	
	this.service_id = params.requestParams.service_id;
	
	this.Events = {};
	this.Events.OnInitMainData = new EventHandler(this);
	this.Events.OnInitMainEdit = new EventHandler(this);
	this.Events.OnInitMainTabs = new EventHandler(this);
	this.Events.OnInitSubData = new EventHandler(this);
	this.Events.OnInitSubEdit = new EventHandler(this);
	this.Events.OnInitSubTabs = new EventHandler(this);
	this.Events.OnInitToolbar = new EventHandler(this);
};

ClaimService.prototype.afterInitialize = function(params) {
	ClaimService.prototype.parent.prototype.afterInitialize.call(this, params);
	
	this.editView = new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		desktop.dbService.Events.OnCancel.add(function(dataset) {
			desktop.dbSubService.cancel();
		});
		
		desktop.dbSubService.Events.OnEdit.add(function(dataset) {
			desktop.dbService.edit();
		});
		
		desktop.dbSubService.Events.OnEditState.add(function(dataset) {
			view.toolbar.SetVisible("refresh", !dataset.editing);
			view.toolbar.SetVisible("save", dataset.editing);
			view.toolbar.SetVisible("cancel", dataset.editing);
		});
		
		view.Events.OnRefresh.add(function(view, data) {
			desktop.dbSubService.resetData(data.sub_type_data, "", true);
		});
		
		view.Events.OnInitContent.add(function(view, container) {
			var left = CreateElement("div", container).attr("x-sec", "content-left");
				view.owner.subEdit({ // refer to edit-gop-type-details.js
					dataset: desktop.dbSubService,
					container: left
				})
			
			var right = CreateElement("div", container).attr("x-sec", "content-right");
				view.owner.mainEdit({ // refer to edit-gop-details.js
					dataset: desktop.dbService,
					container: right
				})
		});
		
		// view.Events.OnDataEvent.add(function(editView) {
			// console.log(editView)
		// });
		
		view.Events.OnInitToolbar.add(function(view, toolbar) {
			// console.log(view.owner)
			view.owner.Events.OnInitToolbar.trigger(toolbar);
		});
	});
};

ClaimService.prototype.newServiceTab = function(tab, callback) {
	tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
	return callback(tab);
};

ClaimService.prototype.mainEdit = function(params) {
	new JPageControl({
		owner: this,
		container: params.container,
		Painter: {
			theme: "data-entry",
			autoHeight: false
		},
		init: function(pg) {			

			// pg.NewTab("Status", {
				// OnCreate: function(tab) {
					// ServiceStatusView({
						// service_id: tab.pg.owner.service_id,
						// container: tab.content
					// })
				// }
			// });

			pg.NewTab(pg.owner.fullName, {
				OnCreate: function(tab) {
					new SimpleEditor({
						id: "edit_claim",
						dataset: params.dataset,
						container: tab.content,
						initData: function(editor, data) {
							pg.owner.Events.OnInitMainData.trigger(editor);
						},
						initEditor: function(editor) {
							editor.Dataset.editor = editor;
							pg.owner.Events.OnInitMainEdit.trigger(editor);
						}
					});
				}
			});

			pg.owner.Events.OnInitMainTabs.trigger(pg);

			pg.NewTab("Status", {
				OnCreate: function(tab) {
					ServiceStatusView({
						owner: pg.owner,
						service_id: desktop.ServiceID,
						container: tab.content
					})
				}
			});

			pg.NewTab("Actions", {
				OnCreate: function(tab) {
					ServiceActionsView({
						owner: pg.owner,
						service_id: desktop.ServiceID,
						container: tab.content
					})
				}
			});
		},
		initTab: function(tab) {
			tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
		}
	});
};

ClaimService.prototype.subEdit = function(params) {
	new JPageControl({
		owner: this,
		container: params.container,
		Painter: {
			theme: "data-entry",
			autoHeight: false
		},
		init: function(pg) {			
				// pg.NewTab("Diagnosis", {
					// OnCreate: function(tab) {
						// ServiceDiagnosisView({
							// owner: pg.owner,
							// service_id: desktop.ServiceID,
							// container: tab.content
						// })
					// }
				// });
			pg.NewTab("General", {
				OnCreate: function(tab) {
					new SimpleEditor({
						id: "edit_claim",
						dataset: params.dataset,
						container: tab.content,
						initData: function(editor, data) {
							pg.owner.Events.OnInitSubData.trigger(editor);
						},
						initEditor: function(editor) {
							editor.Dataset.editor = editor;
							pg.owner.Events.OnInitSubEdit.trigger(editor);
						}
					});
				}
			});
			
			if(("inv,gop").indexOf(pg.owner.type) > -1) {
				pg.NewTab("Diagnosis", {
					OnCreate: function(tab) {
						ServiceDiagnosisView({
							owner: pg.owner,
							service_id: desktop.ServiceID,
							container: tab.content
						})
					}
				});
				
				pg.NewTab("Add Plan", {
					OnCreate: function(tab) {
					}
				});
				
				pg.NewTab("Medical Procedures", {
					OnCreate: function(tab) {
					}
				});
			};

			pg.owner.Events.OnInitSubTabs.trigger(pg);
		},
		initTab: function(tab) {
			tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
		}
	});
};

ClaimService.prototype.initStatusToolbar = function(toolbar) {
};

ClaimService.prototype.updateStatusLookup = function(params) {
	params.toolbar.NewDropdownItem({
		id: params.id,
		icon: params.icon,
		iconColor: params.color,
		color: params.color,
		hint: params.hint,
		align: "left",
		onClose: function(dialog) {
			// grid.dataParams.unbindControls();
		},
		painter: {
			footer: function(dialog, container) {
				// var btnSave = CreateButton({
					// container: container,
					// caption: "Start Search",
					// style: "green",
					// click: function(button) {
						// if(button.enabled)
							// grid.Refresh();
					// }
				// });
				
				// var btnClear = CreateButton({
					// container: container,
					// caption: "Clear",
					// style: "blue",
					// click: function(button) {
						// if(button.enabled)
							// grid.dataParams.Events.OnClearSearch.trigger(grid);
					// }
				// });
				
				// CreateButton({
					// container: container,
					// caption: "Close",
					// enabled: true,
					// style: "text",
					// click: function(button) {
						// dialog.Hide();
					// }
				// });
				
			},
			content: function(dialog, container) {
				// container.css("width", grid.options.AdvanceSearchWidth);
				
				// new FormEditor({
					// id: "xxx",
					// dataset: grid.dataParams,
					// dialog: dialog,
					// container: container,
					// containerPadding: 0,
					// fillContainer: true,
					// pageControlTheme: "main",
					// showToolbar: false,
					// url: "",
					// init: function(editor) {
						// grid.Events.OnInitSearch.trigger(editor);
					// }
				// });
			}
		}
	});
});