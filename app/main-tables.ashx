<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "Tables"
		Output.AsString("window_title") = "Tables"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("system", "System")
			With Main.SubItems.Add
				.ID = "rules"
				.Action = "admin"				
				.Title = "Validation Rules"
				.Icon = "table"
				.URL = "app/under-construction"
				.Params.AsString("module") = .ID
			End with

			With Main.SubItems.Add
				.ID = "benefits"
				.Action = "admin"				
				.Title = "Benefits Types"
				.Icon = "table"
				.URL = "app/under-construction"
				.Params.AsString("module") = .ID
			End with

			With Main.SubItems.Add
				.ID = "uwtypes"
				.Action = "admin"				
				.Title = "Underwriting Types"
				.Icon = "table"
				.URL = "app/under-construction"
				.Params.AsString("module") = .ID
			End with

			With Main.SubItems.Add
				.ID = "audittyps"
				.Action = "admin"				
				.Title = "Audit Log Types"
				.Icon = "table"
				.URL = "app/under-construction"
				.Params.AsString("module") = .ID
			End with

			Main = MenuItems.AddMain("travel", "Travel")
			REM With Main.SubItems.Add
				REM .ID = "doctors"
				REM .Action = "admin"				
				REM .Title = "Doctors"
				REM .Icon = "table"
				REM .URL = "app/under-construction"
				REM .Params.AsString("module") = .ID
			REM End with

	End Sub
End Class
