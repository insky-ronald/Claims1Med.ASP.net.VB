<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "Demo"
		Output.AsString("window_title") = "Demo"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("datatables", "Datatables")
			With Main.SubItems.Add
				.ID = "clients"
				.Action = "admin"				
				.Title = "Simple"
				.Icon = "table"
				.URL = "app/clients"
			End with

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

			With Main.SubItems.Add
				.ID = "sob"
				.Action = "admin"				
				.Title = "Tree View"
				.Icon = "table"
				.URL = "app/sob"
				.Params.AsString("id") = 2000249
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
