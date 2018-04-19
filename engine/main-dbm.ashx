<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "System"
		Output.AsString("window_title") = "System"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsString("test1") = "1"
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("main", "System")
			With Main.SubItems.Add
				.ID = "tools"
				.Action = "tools"				
				.Title = "Tools"
				.Icon = "settings"
				.Content = "engine/tools.aspx"
				.Css = "sys-tools"
				.URL = "engine/sys-tools"
				.Params.AsString("test2") = "1"
			End with
			
			With Main.SubItems.Add
				.ID = "icons"
				.Action = "icons"				
				.Title = "Icons"
				.Icon = "home"
				.URL = "engine/sys-icons"
			End with
			
			With Main.SubItems.Add
				.ID = "users"
				.Action = "sys-users"				
				.Title = "Users"
				.Icon = "user"
				.URL = "engine/sys-users"
			End with
	End Sub
End Class
