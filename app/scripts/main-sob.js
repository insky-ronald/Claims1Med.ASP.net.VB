MainPage.prototype.AfterPaint = function() {
	MainPage.prototype.parent.prototype.AfterPaint.call(this);
	
	desktop.dbData = new Dataset(desktop.customData.data);
	desktop.dbData.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("plan_code", {label:"Code"})
		.setprops("plan_name", {label:"Name"});
		
	this.Events.OnPaintCustomHeader.add(function(desktop, container) {
		desktop.header = CreateElement("div", container, "", "information");
		desktop.AddClaimInfo({
			caption: "Client",
			description: desktop.dbData.get("client_name")
		});
		desktop.AddClaimInfo({
			caption: "Product",
			description: desktop.dbData.get("product_name")
		});
		desktop.AddClaimInfo({
			caption: "Plan",
			description: desktop.dbData.get("plan_name")
		});
	});
};

MainPage.prototype.AddClaimInfo = function(params) {
	CreateElementEx("span", this.header, function(info) {
		CreateElementEx("span", info, function(caption) {
			caption.html(params.caption)
		}, "claim-info-caption");

		CreateElementEx("span", info, function(description) {
			description.html(params.description)
		}, "claim-info-description");

	}, "claim-info");
};
