// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: member.js
//==================================================================================================
function MemberView(params) {
	params.container.addClass("member");
	params.dataset = new Dataset(desktop.customData.data, "Member");
	desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	
	var member_id = params.requestParams.member_id;
	var certificate_id = params.requestParams.certificate_id;
	// console.log(dataset)

	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnInitContent.add(function(view, container) {
			var left = CreateElement("div", container).attr("x-sec", "content-left");
				MemberEdit({
					dataset: params.dataset,
					url: ("?id={0}").format(member_id),
					container: left,
					containerPadding: 0,
					showToolbar: false,
					pageControlTheme: "data-entry",
					fillContainer: false
				})
			
			var right = CreateElement("div", container).attr("x-sec", "content-right");
				new JPageControl({
					owner: this,
					container: right,
					Painter: {
						theme: "data-entry",
						autoHeight: false
					},
					init: function(pg) {
						pg.NewTab("Family Members", {
							OnCreate: function(tab) {
								tab.content.css("border", "1px solid #92846A");
								FamilyMembersView({
									certificate_id: certificate_id,
									container: tab.content
								});
							}
						});

						pg.NewTab("Plan History", {
							OnCreate: function(tab) {
								tab.content.css("border", "1px solid #92846A");
							}
						});
					}
				});
		});
		
		// view.Events.OnInitToolbar.add(function(view, toolbar) {
		// });
	});
};
