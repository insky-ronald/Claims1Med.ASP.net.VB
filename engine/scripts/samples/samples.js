// List box
initEditor: function(editor) {
	editor.AddGroup("Discount", function(editor) {
		editor.AddListBox("discount_type", {
			key: "id",
			value: "value",
			data: [
				{id:"0", value:"No Discount"},
				{id:"1", value:"Invoice Header by Percentage"},
				{id:"3", value:"Invoice Line by Percentage"},
				{id:"4", value:"Invoice Line by Amount"}
			]
		});

		editor.AddListBox("payee_type", {
			key: "id",
			value: "value",
			data: [
				{id:"R", value:"Reimbursement"},
				{id:"C", value:"Cashless"},
				{id:"N", value:"Not paid by ISOS"}
			]
		});
	});
}