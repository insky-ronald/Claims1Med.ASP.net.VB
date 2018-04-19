<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "Security"
		Output.AsString("window_title") = "Security"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("security", "Security")
			With Main.SubItems.Add
				.ID = "users"
				.Action = "admin"				
				.Title = "Users"
				.Icon = "user"
				.URL = "app/users"
			End with
			With Main.SubItems.Add
				.ID = "group"
				.Action = "admin"				
				.Title = "Group Permissions"
				.Icon = "users"
				.URL = "app/groups"
				.Params.AsString("module") = .ID
			End with
			With Main.SubItems.Add
				.ID = "forms"
				.Action = "admin"				
				.Title = "Forms & Commands"
				.Icon = "settings"
				.URL = "engine/under-construction"
				.Params.AsString("module") = .ID
			End with
	End Sub
End Class
