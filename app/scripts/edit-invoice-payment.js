function PaymentEdit(viewParams) {
	return new JFormEditor({
		id: viewParams.id,
		// dataset: viewParams.dataset,
		mode: "edit",
		container: viewParams.container,
		containerPadding: 10,
		// pageControlTheme: "main",
		pageControlOptions: {
			theme: "service-details"
		},
		fillContainer: false,
		showToolbar: true,
		scrollable:true,
		labelWidth: 150,
		url: "?id=" + viewParams.dataset.get("id"),
		postBack: "app/invoice-payment",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					.setprops("float_id", {label:"Float", numeric:true})
					.setprops("payee_type", {label:"Payee Type", required:true})
					.setprops("payee_id", {label:"Payee ID", numeric:true})
					.setprops("payee_name", {label:"Payee Name", readonly:true, required:true})
					.setprops("payment_mode", {label:"Payment Mode", required:true})
					.setprops("delivery_mode", {label:"Delivery Mode", required:true})
					.setprops("settlement_currency_code", {label:"Payment Currency", required:true})
					.setprops("settlement_currency_rate_date", {label:"Rate Date", type:"date", required:true})
					.setprops("settlement_currency_to_claim", {label:("To Claim Currrency (<b>{0}</b>)").format(desktop.dbService.raw("claim_currency_code")), numeric:true, readonly:true, required:true})
					.setprops("settlement_currency_to_base", {label:("To Base Currrency (<b>{0}</b>)").format(desktop.dbService.raw("base_currency_code")), numeric:true, readonly:true, required:true})
					.setprops("settlement_currency_to_client", {label:("To Client Currrency (<b>{0}</b>)").format(desktop.dbService.raw("client_currency_code")), numeric:true, readonly:true, required:true})
					.setprops("settlement_currency_to_eligibility", {label:("To Eligibility Currrency (<b>{0}</b>)").format(desktop.dbService.raw("eligibility_currency_code")), numeric:true, readonly:true, required:true})
					// .setprops("settlement_currency_to_base", {label:("To Base Currrency (<b>{0}</b>)").format(desktop.dbService.get("base_currency_code")), numeric:true, readonly:true})
					// .setprops("average_los", {label:"Average LOS", numeric:true, type:"money", format:"00"})
					// .setprops("estimated_cost", {label:"Estimated Cost", numeric:true, type:"money", format:"00"})
					// .setprops("estimated_los", {label:"Estimated LOS", numeric:true, type:"money", format:"00"})
					// .setprops("estimated_provider_cost", {label:"Estimated Cost", numeric:true, type:"money", format:"00"})
					// .setprops("estimated_provider_los", {label:"Estimated LOS", numeric:true, type:"money", format:"00"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit({caption:"Payee", icon:{name:"user", color:"dodgerblue"}, noFucus:true}, 
					function(editor, tab) {
						editor.AddGroup("Payee Details", function(editor) {
							editor.AddRadioButton("payee_type", {
								key: "id",
								value: "value",
								data: [
									{id:"V", value:"Provider"},
									{id:"D", value:"Doctor"},
									{id:"P", value:"Policyholder"},
									{id:"M", value:"Main Member"},
									{id:"N", value:"Patient"},
									{id:"X", value:"Other"}
								]
							});
							editor.AddEdit("payee_id");
							editor.AddEdit("payee_name");
						});
						editor.AddGroup("Payment", function(editor) {
							editor.AddRadioButton("payment_mode", {
								key: "id",
								value: "value",
								data: [
									{id:"C", value:"Cheque"},
									{id:"B", value:"Telegraphic Transfer"}
								]
							});
							editor.AddRadioButton("delivery_mode", {
								key: "id",
								value: "value",
								data: [
									{id:"01001", value:"Mail to Beneficiary"},
									{id:"01002", value:"Return to ISOS"}
								]
							});
							editor.AddEdit("float_id");
							editor.AddEdit("settlement_currency_code");
							// editor.AddEdit("estimated_cost");
						});
						editor.AddGroup("Exhange Rates", function(editor) {
							editor.AddEdit("settlement_currency_rate_date");
							editor.AddEdit("settlement_currency_to_claim");
							editor.AddEdit("settlement_currency_to_base");
							editor.AddEdit("settlement_currency_to_client");
							editor.AddEdit("settlement_currency_to_eligibility");
						});
					}
				);
				editor.NewGroupEdit({caption:"Benificiary & Bank", icon:{name:"bank", color:"dodgerblue"}, noFucus:true}, 
					function(editor, tab) {
						// editor.AddGroup("Average Cost and LOS", function(editor) {
							// editor.AddEdit("average_cost");
							// editor.AddEdit("average_los");
						// });
						// editor.AddGroup("Estimated Cost and LOS", function(editor) {
							// editor.AddEdit("estimated_cost");
							// editor.AddEdit("estimated_cost");
						// });
						// editor.AddGroup("Estimated Cost and LOS from Hospital (optional)", function(editor) {
							// editor.AddEdit("estimated_provider_cost");
							// editor.AddEdit("estimated_provider_los");
						// });
					}
				);
				editor.NewGroupEdit({caption:"Others", icon:{name:"view-list", color:"dodgerblue"}, noFucus:true}, 
					function(editor, tab) {
						// editor.AddGroup("Average Cost and LOS", function(editor) {
							// editor.AddEdit("average_cost");
							// editor.AddEdit("average_los");
						// });
						// editor.AddGroup("Estimated Cost and LOS", function(editor) {
							// editor.AddEdit("estimated_cost");
							// editor.AddEdit("estimated_cost");
						// });
						// editor.AddGroup("Estimated Cost and LOS from Hospital (optional)", function(editor) {
							// editor.AddEdit("estimated_provider_cost");
							// editor.AddEdit("estimated_provider_los");
						// });
					}
				);
			});
		}
	});
};