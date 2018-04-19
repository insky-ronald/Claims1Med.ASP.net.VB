<%@ WebHandler Language="VB" Class="DataProvider" %>

REM Last modified on
REM 07-MAR-2017
Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "Security"
		Output.AsString("window_title") = "Security"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("usersroles", "Users and Roles")
		
			With Main.SubItems.Add
				.ID = "users"
				.Action = "sys-users"				
				.Title = "Users"
				.Icon = "user"
				.URL = "engine/sys-users"
			End with
			
			With Main.SubItems.Add
				.ID = "roles"
				.Action = "sys-roles"				
				.Title = "Roles"
				.Icon = "users"
				.URL = "engine/sys-roles"
			End with
			
		Main = MenuItems.AddMain("actionrights", "Actions and Rights")
			
			With Main.SubItems.Add
				.ID = "actions"
				.Action = "sys-actions"				
				.Title = "Actions"
				.Icon = "star"
				.URL = "engine/sys-actions"
			End with
			
			With Main.SubItems.Add
				.ID = "rights"
				.Action = "sys-rights"				
				.Title = "Rights"
				.Icon = "settings"
				.URL = "engine/sys-rights"
			End with
			
		Main = MenuItems.AddMain("permission", "Roles and Permissions")
			
			With Main.SubItems.Add
				.ID = "permissions"
				.Action = "sys-permissions"
				.Title = "Set Permissions"
				.Icon = "security"
				.URL = "engine/sys-roles"
			End with
			
	End Sub
End Class
