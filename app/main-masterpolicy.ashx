<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "Master Policy"
		Output.AsString("window_title") = "Master Policy"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsInteger("id") = Request.Params("keyid")
		REM MenuItems.Params.AsInteger("id") = 2000014

		Dim Main As Navigator.MenuItem = MenuItems.AddMain("main", "Master Policy")
			With Main.SubItems.Add
				.ID = "masterpolicy"
				.Action = "admin"				
				.Title = "Details"
				.Icon = "table-edit"
				.URL = "app/masterpolicy"
			End with			
	End Sub
End Class