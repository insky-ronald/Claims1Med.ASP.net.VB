// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-change-action-owner.js
//==================================================================================================
function ChangeActionOwner(viewParams){
	// console.log(viewParams)
	return new jWizard({
		container: viewParams.container,
		// title: params.title,
		// color: params.color,
		css: "change-owner",
		prepare: function(wizard) {
			wizard.dataset = new Dataset([{
				id: 0,
				action_owner: "",
				notes: ""
			}]);
			
			if (viewParams.initView) {
				viewParams.initView(wizard);
			}
			
			wizard.events.OnClose.add(function(wizard) {
				if (viewParams.dialog) {
					viewParams.dialog.Hide();
				}
			});
			
			wizard.events.OnFinish.add(function(wizard) {
				wizard.dataset.set("notes", wizard.notes.notes.html());
				if (viewParams.select) {
					viewParams.select(wizard);
				}
			});
			
			wizard.add({
				OnSubTitle: function(wizard, container) {
					container.html("");
					wizard.dataset.set("action_owner", "");
				},
				OnCreate: function(wizard, container) {
					container.attr("x-sec", "users");
					
					wizard.usersLookup = UsersLookup({
						container: container,
						hideSelection: true,
						initData: function(grid) {
							grid.dataset.Events.OnMoveRecord.add(function(dataset) {
								wizard.update();
							});
						}
					});
				}
			});
			
			wizard.add({
				OnSubTitle: function(wizard, container) {
					wizard.dataset.set("action_owner", wizard.usersLookup.dataset.get("user_name"));
					container.html(("<span x-sec='main'>{0}</span><span x-sec='sub'>{1}</span>").format("New Owner", wizard.usersLookup.dataset.get("full_name")));
				},
				OnCreate: function(wizard, container) {
					container.attr("x-sec", "notes");
					
					wizard.dataset.Events.OnEditState.add(function(dataset, editing) {
						wizard.update();
					});
					
					wizard.notes = new SimpleNotesEditor({
						container: container, 
						dataset: wizard.dataset,
						columnName: "notes",
						requestParams: {
							showToolbar: false,
							readonly: false
						}
					})
					
				}
			});
		}
	})
};
