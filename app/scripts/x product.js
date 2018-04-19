// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: member.js
//==================================================================================================
function ProductView(params) {
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 10),
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		fillContainer: defaultValue(params.fillContainer, false),
		// showToolbar: params.showToolbar,
		showToolbar: true,
		url: params.url,
		postBack: "product",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				// data.Columns
					// .setprops("id", {label:"ID", numeric:true, key: true})
					// .setprops("sequence_no", {label:"Sequence #", numeric:true})
					// .setprops("broker_name", {label:"Broker", required:true})
					// .setprops("policy_number", {label:"Policy No.", required:true})
					// .setprops("underwriting_currency", {label:"U/W Currency"})
					// .setprops("underwriting_year", {label:"U/W Year", required:true})
					// .setprops("effective_date", {label:"Effective Date", type:"date", required:true})
					// .setprops("expiry_date", {label:"Expiry Date", type:"date", required:true})
					// .setprops("status", {label:"Status"})
					// .setprops("expired", {label:"Expired"})
					// .setprops("plan_name", {label:"Type", required:true})
					// .setprops("plan_description", {label:"Description", required:true})
					// .setprops("plan_currency", {label:"Currency", required:true})
					// .setprops("copay_rate", {label:"Co-Payment", numeric:true, type:"money", format:"00"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				// editor.NewGroupEdit("General", function(editor, tab) {
					// editor.AddGroup("Text", function(editor) {
						// editor.AddEdit("policy_number");
						// editor.AddEdit("plan_name");
						// editor.AddEdit("plan_description");
					// });
					
					// editor.AddGroup("Lookup", function(editor) {
						// editor.AddLookup("plan_currency", {width: 400,height: 300,init: CurrenciesView});
						// editor.AddLookup("underwriting_currency", {width: 400, height: 300,init: CurrenciesView});
						// editor.AddContainer("underwriting_currency", {width: 400, height: 300,init: function(params) {
							
						// }});
					// });
						
					// editor.AddGroup("Dates", function(editor) {
						// editor.AddEdit({ID: "effective_date"});
						// editor.AddEdit({ID: "expiry_date"});
					// });
					
					// editor.AddGroup("Numeric", function(editor) {
						// editor.AddEdit("id");
						// editor.AddNumeric("underwriting_year");
						// editor.AddEdit("sequence_no");
						// editor.AddEdit("copay_rate");
					// });
					
					// editor.AddGroup("Radio Buttons", function(editor) {
						// editor.AddRadioButton("expired", {
							// key: "id",
							// value: "value",
							// data: [
								// {id:true, value:"Yes"},
								// {id:false, value:"No"}
							// ]
						// });
						
						// editor.AddRadioButton("sequence_no", {
							// key: "id",
							// value: "value",
							// data: [
								// {id:0, value:"Zero"},
								// {id:1, value:"Value 1"},
								// {id:3, value:"Value 3"},
								// {id:4, value:"Value 4"},
								// {id:5, value:"Value 5"},
								// {id:6, value:"Value 6"}
							// ]
						// });
					// });
				// });
				
				// editor.NewGroupEdit("Other", function(editor, tab) {
					// editor.AddGroup("Dates", function(editor) {
						// editor.AddDate({ID: "effective_date"});
						// editor.AddDate({ID: "expiry_date"});
						// editor.AddNumeric({ID: "underwriting_year"});
					// });
				// });
				
				// editor.NewContainer("Test Container", function(editor, tab) {
				// });
			});
		}
	});
};

function ProductView2(params) {
	params.dataset = new Dataset(desktop.customData.data, "Product");
	// var dataset = new Dataset(desktop.customData.data, "Member");
	var product_code = params.requestParams.product_code;
	// var certificate_id = params.requestParams.certificate_id;
	// console.log(dataset)

	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnInitContent.add(function(view, container) {
			// var left = CreateElement("div", container).attr("x-sec", "content-left");
				// ProductEdit({
					// dataset: params.dataset,
					// url: ("?code={0}").format(product_code),
					// container: container,
					// containerPadding: 0,
					// showToolbar: false,
					// pageControlTheme: "data-entry",
					// fillContainer: false
				// })
			
			// var right = CreateElement("div", container).attr("x-sec", "content-right");
				// new JPageControl({
					// owner: this,
					// container: right,
					// Painter: {
						// theme: "data-entry",
						// autoHeight: false
					// },
					// init: function(pg) {
						// pg.NewTab("Family Members", {
							// OnCreate: function(tab) {
								// tab.content.css("border", "1px solid #92846A");
								// FamilyMembersView({
									// certificate_id: certificate_id,
									// container: tab.content
								// });
							// }
						// });

						// pg.NewTab("Plan History", {
							// OnCreate: function(tab) {
								// tab.content.css("border", "1px solid #92846A");
							// }
						// });
					// }
				// });
		});
		
		// view.Events.OnInitToolbar.add(function(view, toolbar) {
		// });
	});
};
