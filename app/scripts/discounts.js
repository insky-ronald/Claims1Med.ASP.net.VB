// ****************************************************************************************************
// Last modified on
// 7-JUL-2017 - ronald
// ****************************************************************************************************
//==================================================================================================
// File name: doctor.js
//==================================================================================================
function DiscountsView(params) {
	params.container.addClass("discounts");
	params.dataset = new Dataset(desktop.customData.data, "Discounts");
	
	var doctor_id = params.requestParams.doctor_id;

	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnInitContent.add(function(view, container) {
			var a_container = CreateElement("div", container).attr("x-sec", "content");
				DiscountEdit({
					dataset: params.dataset,
					url: ("?name_id={0}").format(doctor_id),
					container: a_container,
					containerPadding: 0,
					showToolbar: false,
					pageControlTheme: "data-entry",
					fillContainer: false
				});
		});
	});
};
