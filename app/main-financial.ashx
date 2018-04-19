<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "Financial"
		Output.AsString("window_title") = "Financial"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("main", "Main")
			With Main.SubItems.Add
				.ID = "mymoney"
				.Action = "admin"				
				.Title = "My Money"
				.Icon = "home"
				.URL = "app/mymoney"
			End with
			With Main.SubItems.Add
				.ID = "accounts"
				.Action = "admin"				
				.Title = "Accounts"
				.Icon = "table-edit"
				.URL = "app/accounts"
			End with
	End Sub
End Class
