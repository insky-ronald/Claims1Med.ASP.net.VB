// ****************************************************************************************************
// Last modified on
// 7-JUL-2017 - ronald
// ****************************************************************************************************
//==================================================================================================
// File name: hospital.js
//==================================================================================================
function HospitalView(params) {
	params.container.addClass("hospital");
	params.dataset = new Dataset(desktop.customData.data, "Hospital");
	desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	//desktop.dbDoctorSpecialisation = desktop.LoadCacheData(desktop.customData.specialisation, "specialisation", "specialisation_code");
	
	var hospital_id = params.requestParams.hospital_id;

	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnInitContent.add(function(view, container) {
			var a_container = CreateElement("div", container).attr("x-sec", "content");
				HospitalEdit({
					dataset: params.dataset,
					url: ("?id={0}").format(hospital_id),
					container: a_container,
					containerPadding: 0,
					showToolbar: false,
					pageControlTheme: "data-entry",
					fillContainer: false
				});
		});
	});
};
