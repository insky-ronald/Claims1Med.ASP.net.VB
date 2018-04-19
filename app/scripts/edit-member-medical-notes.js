// ****************************************************************************************************
// File name: edit-member-medical-notes.js
// Last modified on
// 02-OCT-2017
// ****************************************************************************************************
function MemberMedicalNotesEdit(viewParams) {
	var self = this;
	this.dataset = viewParams.dataset;
	
	viewParams.container.addClass("member-medical-notes");
	CreateElementEx("div", viewParams.container, function(container) {
		container.addClass("toolbar-container");
		var toolbar = new JToolbar({
				container: container,
				css: "toolbar",
				theme: "svg",
				buttonSize: 24
		});
		
		toolbar.NewItem({
			id: "refresh",
			icon: "refresh",
			iconColor: "#8DCF6E",
			hint: "Refresh",
			dataBind: self.dataset,
			dataEvent: function(dataset, button) {
				button.show(!dataset.editing);
			},
			click: function(item) {
				// grid.Refresh();
			}
		});
		
		toolbar.NewItem({
			id: "save",
			icon: "db-save",
			iconColor: "#1CA8DD",
			hint: "Save",
			dataBind: self.dataset,
			dataEvent: function(dataset, button) {
				button.show(dataset.editing);
			},
			click: function(item) {
				// console.log("save")
				// self.Events.OnPost.trigger();
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
				self.notes.html(self.dataset.get("medical_history_notes"));
			}
		});
		
		toolbar.SetVisible("refresh", !self.dataset.editing);
		toolbar.SetVisible("cancel", self.dataset.editing);
		toolbar.SetVisible("save", self.dataset.editing);
	});
	
	this.notes = CreateElementEx("pre", viewParams.container, function(notes) {		
		notes.addClass("medical-notes");
		notes.attr("spellcheck", false);
		notes.attr("contenteditable", true);
		notes.html(desktop.dbMedicalNotes.get("medical_history_notes"));
		notes.on("input", function() {
			if(!self.dataset.editing)
				self.dataset.edit();
		});
		notes.on("keydown", function(e) {
			if(e.keyCode === 9) { // tab key
				console.log("here")
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
	});
};
