function DiscountEdit(params){
	return new SimpleEditor({
		id: "edit_discounts",
		dataset: params.dataset,
		container: params.container,
		initData: function(editor, data) {
			data.Columns
				.setprops("name_id", {label:"ID", numeric:true, key: true, readonly:true})
				.setprops("discount_type_id", {label:"Discount Type", required:true})
				.setprops("discount_amount", {label:"Discount Amount", numeric:true})
				.setprops("discount_percent", {label:"Discount Rate %", numeric:true})
				.setprops("notes", {label:"Provider Discount Information"})
		},
		initEditor: function(editor) {
			editor.AddGroup("General", function(editor) {
				editor.AddListBox("discount_type_id", {
					key: "id",
					value: "value",
					data: [
						{id:"1", value:"No Discount"},
						{id:"2", value:"Invoice Header by Percentage"},
						{id:"3", value:"Invoice Line by Percentage"},
						{id:"4", value:"Invoice Line by Amount"},
					]
				});
			});
			
			editor.AddGroup("Discount Amount", function(editor) {
				editor.AddEdit("discount_amount");
			});
			
			editor.AddGroup("Percent Discount", function(editor) {
				editor.AddEdit("discount_percent");
			});
			
			editor.AddGroup("Provider Discount Information", function(editor) {
				editor.AddMemo("notes");
			});
		}
	});
}