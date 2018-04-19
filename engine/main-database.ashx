<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "DB: " & Request.Params("Database")
		Output.AsString("window_title") = Request.Params("Database")
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("database", "Database")
			With Main.SubItems.Add
				.ID = "tables"
				.Action = "admin"				
				.Title = "Tables"
				.Icon = "table"
				.URL = "sys/db-tables"
				.Params.AsString("db") = Request.Params("Database")
			End with
			
			With Main.SubItems.Add
				.ID = "sp"
				.Action = "admin"				
				.Title = "Stored Procedures"
				.Icon = "table"
				.URL = "sys/under-construction"
				.Params.AsString("module") = .ID
			End with
	End Sub
End Class
