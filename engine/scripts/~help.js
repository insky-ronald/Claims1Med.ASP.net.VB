//==================================================================================================
// File name: appointment.js
//==================================================================================================
	grid.Events.OnInitToolbar.add(function(grid, toolbar) {
		toolbar.NewItem({
			id: "manage-features",
			icon: "settings",
			iconColor: "firebrick",
			hint: "Manage features",
			// dataBind: this.dataset,
			// dataEvent: function(dataset, button) {
				// button.show(dataset.editing);
			// },
			click: function(item) {
				window.open("/app/manage-features/" + requestParams.location)
			}
		});
	});
