MainPage.prototype.AfterPaint = function() {
	MainPage.prototype.parent.prototype.AfterPaint.call(this);

	desktop.dbClient = new Dataset(desktop.customData.data);
	desktop.dbClient.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("full_name", {label:"Name", required:true})
		.setprops("currency_code", {label:"Currency", required:true, maxLength:3, upperCase:true})
		.setprops("status_code", {label:"Active", required:false})
		.setprops("sun_code", {label:"Sun Code", required:false})
		.setprops("soa_prefix", {label:"SOA Prefix", required:false})
		.setprops("prefix_code", {label:"Prefix Code", required:false})
		.setprops("large_loss_amount", {label:"Amount", required:false, type:"money", format:"00"})
		.setprops("hotline", {label:"Numbers", required:false})
		.setprops("create_user", {label:"User", readonly:true})
		.setprops("create_date", {label:"Created on", type:"date", format:"datetime", readonly:true, 
			getText: function(column, value) {
				return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("create_user"));
			}})
		.setprops("update_user", {label:"User", readonly:true})
		.setprops("update_date", {label:"Last update on", type:"date", format:"datetime", readonly:true,
			getText: function(column, value) {
				return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("update_user"));
			}});

	if(desktop.customData.newRecord) {
		desktop.dbClient.edit()
	};

	desktop.dbClient.Events.OnCancel.add(function(dataset) {
		if(desktop.customData.newRecord) {
			window.close()
		}
	});			
};
