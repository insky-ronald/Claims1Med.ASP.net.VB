<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "ALZ"
		Output.AsString("window_title") = "ALZ"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("dashboard", "Dashboard")
			With Main.SubItems.Add
				.ID = "voterslist"
				.Action = "admin"				
				.Title = "Voters List"
				.Icon = "table"
				.URL = "app/voterslist"
			End with
			
			With Main.SubItems.Add
				.ID = "angono"
				.Action = "admin"				
				.Title = "Angono"
				.Icon = "table"
				.URL = "app/voterslist"
				.Params.AsString("municipality") = "angono"
			End with
			
			With Main.SubItems.Add
				.ID = "binangonan"
				.Action = "admin"				
				.Title = "Binangonan"
				.Icon = "table"
				.URL = "app/voterslist"
				.Params.AsString("municipality") = "binangonan"
			End with
			
			With Main.SubItems.Add
				.ID = "cainta"
				.Action = "admin"				
				.Title = "Cainta"
				.Icon = "table"
				.URL = "app/voterslist"
				.Params.AsString("municipality") = "cainta"
			End with
			
			With Main.SubItems.Add
				.ID = "taytay"
				.Action = "admin"				
				.Title = "Taytay"
				.Icon = "table"
				.URL = "app/voterslist"
				.Params.AsString("municipality") = "taytay"
			End with

		Return
		
			With Main.SubItems.Add
				.ID = "masterpolicies"
				.Action = "admin"				
				.Title = "Multi-line Headers"
				.Icon = "table"
				.URL = "app/masterpolicies"
			End with
			
			With Main.SubItems.Add
				.ID = "claims"
				.Action = "admin"				
				.Title = "Multi-tabs Tables"
				.Icon = "table"
				.URL = "app/claims-processing"
				REM .Css = ""
				REM .Params.AsString("module") = .ID
			End with

			With Main.SubItems.Add
				.ID = "banks"
				.Action = "admin"				
				.Title = "Card View"
				.Icon = "table"
				.URL = "app/banks"
			End with
			
		Main = MenuItems.AddMain("forms", "Forms")
			With Main.SubItems.Add
				.ID = "client"
				.Action = "admin"				
				.Title = "Client"
				.Icon = "table-edit"
				.URL = "app/client"
				.Params.AsInteger("id") = 1000001
			End with			

			With Main.SubItems.Add
				.ID = "masterpolicy"
				.Action = "admin"				
				.Title = "Master Policy"
				.Icon = "table-edit"
				.URL = "app/masterpolicy"
				.Params.AsInteger("id") = 2000032
			End with
		
		Main = MenuItems.AddMain("other", "Other")
			With Main.SubItems.Add
				.ID = "control"
				.Action = "admin"				
				.Title = "Control"
				.Icon = "table"
				.URL = "app/demo1"
			End with
	End Sub
End Class
