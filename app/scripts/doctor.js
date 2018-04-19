// ****************************************************************************************************
// Last modified on
// 7-JUL-2017 - ronald
// ****************************************************************************************************
//==================================================================================================
// File name: doctor.js
//==================================================================================================
function DoctorView(params) {
	params.container.addClass("doctor");
	params.dataset = new Dataset(desktop.customData.data, "Doctor");
	desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	desktop.dbDoctorSpecialisation = desktop.LoadCacheData(desktop.customData.specialisation, "specialisation", "specialisation_code");
	
	var doctor_id = params.requestParams.doctor_id;
	
	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnInitContent.add(function(view, container) {
			var a_container = CreateElement("div", container).attr("x-sec", "content");
				DoctorEdit({
					dataset: params.dataset,
					url: ("?id={0}").format(doctor_id),
					container: a_container,
					containerPadding: 0,
					showToolbar: false,
					pageControlTheme: "data-entry",
					fillContainer: false
				});
		});
	});
};
