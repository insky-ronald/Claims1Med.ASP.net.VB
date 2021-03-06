/*****************************************************************************************************
	File name: simple-note-editor.js
	Last modified on
	
	
******************************************************************************************************/
function SimpleNotesEditor(viewParams) {
	
	var self = this;
	this.dataset = viewParams.dataset;
	this.update = viewParams.update;
	this.columnName = viewParams.columnName;
	this.readonly = viewParams.requestParams.readonly;
	this.showToolbar = defaultValue(viewParams.requestParams.showToolbar, true);
	
	viewParams.container.addClass("simple-note-editor");
	CreateElementEx("div", viewParams.container, function(container) {
		if (!self.readonly && self.showToolbar) {
			container.addClass("toolbar-container");
			var toolbar = new JToolbar({
					container: container,
					css: "toolbar",
					theme: "svg",
					buttonSize: 24
			});
			
			// toolbar.NewItem({
				// id: "refresh",
				// icon: "refresh",
				// iconColor: "#8DCF6E",
				// hint: "Refresh",
				// dataBind: self.dataset,
				// dataEvent: function(dataset, button) {
					// button.show(!dataset.editing);
				// },
				// click: function(item) {
					// var params = {
						// member_id: self.dataset.getKey(), 
						// claim_id: self.dataset.get("claim_id")
					// };
					
					// desktop.Ajax(self, "/app/get/edit/simple-note-editor", params, function(result) {
						// self.dataset.resetData(result.edit, "", true);
						// self.notes.html(self.dataset.get("medical_history_notes"));
					// })
				// }
			// });
			
			self.saveBtn = toolbar.NewItem({
				id: "save",
				icon: "db-save",
				iconColor: "#1CA8DD",
				hint: "Save",
				dataBind: self.dataset,
				dataEvent: function(dataset, button) {
					button.show(dataset.editing);
				},
				click: function(item) {
					self.update(self);
					// self.dataset.set("medical_history_notes", self.notes.html());
					
					// var params = {
						// id: self.dataset.getKey(), 
						// mode: "edit",
						// data: "["+ JSON.stringify(self.dataset.data[0]) +"]"
					// };

					// desktop.Ajax(self, "/app/get/update/simple-note-editor", params, function(result) {
						// self.dataset.post();
					// })
				}
			});
		
			toolbar.NewItem({
				id: "cancel",
				icon: "db-cancel",
				iconColor: "firebrick",
				hint: "Cancel edit",
				dataBind: self.dataset,
				dataEvent: function(dataset, button) {
					button.show(dataset.editing);
				},
				click: function(item) {
					item.dataBind.cancel();
					self.notes.html(self.dataset.raw(self.columnName));
				}
			});
			
			toolbar.SetVisible("refresh", !self.dataset.editing);
			toolbar.SetVisible("cancel", self.dataset.editing);
			toolbar.SetVisible("save", self.dataset.editing);
		}
	});
	
	this.notes = CreateElementEx("pre", viewParams.container, function(notes) {		
		notes.addClass("medical-notes");
		notes.attr("spellcheck", false);
		notes.attr("contenteditable", !self.readonly);
		notes.html(self.dataset.raw(self.columnName));
		notes.on("input", function() {
			if(!self.dataset.editing) {
				self.dataset.edit();
			} else {
				self.dataset.Events.OnEditState.trigger(self.dataset.editing);
			}
		});
		
		notes.on("keydown", function(e) {
			if(e.keyCode === 9) { // tab key
				e.preventDefault();  // this will prevent us from tabbing out of the editor
				// document.execCommand('insertHTML', false, '&#009');
				document.execCommand('insertHTML', false, '\u0009');
				// document.execCommand('insertText', false, '&#009');
				
				// now insert four non-breaking spaces for the tab key
				// var editor = this;//document.getElementById("editor");
				// var doc = editor.ownerDocument.defaultView;
				// var sel = doc.getSelection();
				// var range = sel.getRangeAt(0);

				// var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
				// range.insertNode(tabNode);

				// range.setStartAfter(tabNode);
				// range.setEndAfter(tabNode); 
				// sel.removeAllRanges();
				// sel.addRange(range);
			};
		});
		
		notes.focus();
	});
};
