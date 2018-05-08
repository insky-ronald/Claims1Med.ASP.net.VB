function CustomEditView(params, init) {
	this.owner = params.owner;
	this.dataset = params.dataset;
	this.postBack = params.postBack;
	// console.log(params.postBack);
	// this.dataset.Events.OnChanged.add(function(dataset) {
		// console.log(dataset.editing)
	// });
	// console.log(this.dataset)
	this.Events = {};
	this.Events.OnInitToolbar = new EventHandler(this);
	this.Events.OnInitContent = new EventHandler(this);
	this.Events.OnRefresh = new EventHandler(this);
	// this.Events.OnDataEvent = new EventHandler(this);

	this.container = params.container;

	// this.container.addClass("member");

	var toolbar = CreateElement("div", this.container).attr("x-sec", "toolbar");
	var content = CreateElement("div", this.container).attr("x-sec", "content");

	this.toolbar = new JToolbar({
		container: toolbar,
		css: "toolbar",
		theme: "svg",
		buttonSize: 24
	});

	var self = this;
	this.Events.OnInitToolbar.add(function(view, toolbar) {
		toolbar.NewItem({
			id: "refresh",
			icon: "refresh",
			iconColor: "#8DCF6E",
			hint: "Refresh",
			dataBind: view.dataset,
			dataEvent: function(dataset, button) {
				// console.log("here");
				button.show(!dataset.editing);
			},
			click: function(item) {
				// desktop.Ajax(self, $("#__callback").attr("value"), {action:"refresh"}, function(result) {
					// self.dataset.resetData(result.data, "", true);
					// self.Events.OnRefresh.trigger(result);
				// })

				var refreshUrl, parts = self.postBack.split("/");
				if(parts.length > 1) {
					refreshUrl = ("/{0}/get/edit/{1}").format(parts[0], parts[1])
				} else {
					refreshUrl = ("/sys/get/edit/{0}").format(parts[0]);
				}

				desktop.Ajax(self, refreshUrl, {id:self.dataset.getKey()}, function(result) {
					self.dataset.resetData(result.edit, "", true);
					self.Events.OnRefresh.trigger(result);
				})

				// this.GetData("edit", function(result) {
				// self.dataset.resetData(result.edit, "", true);
				// self.dataset.resetData(self.dataset.data, "", true);
				// });

				// self.Events.OnPost.trigger();
			}
		});

		toolbar.NewItem({
			id: "save",
			icon: "db-save",
			iconColor: "#2F84B7",
			hint: "Save",
			dataBind: view.dataset,
			dataEvent: function(dataset, button) {
				button.show(dataset.editing);
			},
			// click: function(item) {
				// console.log(item);
				// ErrorDialog({
					// target: item.elementContainer,
					// title: "Attempt to delete failed",
					// message: "OK test...",
					// snap: "bottom",
					// inset: false
				// });
			// },
			click: function(item) {
				// console.log(desktop); return;
				self.dataset.post2({
					error: function(message) {
						ErrorDialog({
							target: item.elementContainer,
							title: message.title,
							message: message.error,
							snap: "bottom",
							inset: false
						});
					},
					success: function(message) {
						if (message.id > 0) {
							InfoDialog({
								target: item.elementContainer.closest("ul"),
								title: "Information",
								message: message.info,
								snap: "bottom",
								inset: false
							});
						}
					}
				});
			},
			clickxx: function(item) {  // not used!
				self.dataset.post(function(dataset, msg, status) {
					// console.log({status:status, msg:msg});
					if (status) {
						ErrorDialog({
							target: item.elementContainer,
							title: "Data integritiy check error...",
							message: msg,
							snap: "bottom",
							inset: false
						});
					}
				});
			},
			clickx: function(item) {  // not used!
				self.dataset.post(function(dataset, msg, status) {
					// console.log(item);
					// return;
					ErrorDialog({
						// target: dialog.showToolbar ? dialog.toolbar.Element(): dialog.container,
						target: item.elementContainer,
						title: "Data integritiy check error",
						message: msg,
						snap: "bottom",
						inset: false
					});
				});

				return;
				var updateUrl, parts = self.postBack.split("/");
				if(parts.length > 1) {
					updateUrl = ("/{0}/get/update/{1}").format(parts[0], parts[1])
				} else {
					updateUrl = ("/sys/get/update/{0}").format(parts[0]);
				}

				var requestParams = {
					// id: self.dataset.getKey(),
					mode: self.dataset.getKey() ? "edit": "new",
					data: "["+ JSON.stringify(self.dataset.data[0]) +"]"
				};

				desktop.Ajax(self, updateUrl, requestParams, function(result) {
					// self.dataset.resetData(result.edit, "", true);
					// self.Events.OnRefresh.trigger(result);
				})
			}
		});

		toolbar.NewItem({
			id: "cancel",
			icon: "db-cancel",
			iconColor: "#8DCF6E",
			hint: "Cancel edit",
			dataBind: view.dataset,
			dataEvent: function(dataset, button) {
				button.show(dataset.editing);
			},
			click: function(item) {
				item.dataBind.cancel();
			}
		});

		// toolbar.NewItem({
			// id: "test",
			// icon: "test",
			// iconColor: "#8DCF6E",
			// hint: "Test",
			// click: function(item) {
				// console.log(window.opener.desktop);
			// }
		// });

		toolbar.SetVisible("refresh", !view.dataset.editing);
		toolbar.SetVisible("cancel", view.dataset.editing);
		toolbar.SetVisible("save", view.dataset.editing);
	});

	init(this);

	this.Events.OnInitToolbar.trigger(this.toolbar);
	this.Events.OnInitContent.trigger(content);

	// if(this.Control.showToolbar) {
	// toolbar.SetVisible("cancel", false);
	// toolbar.SetVisible("save", false);
	// };

};
