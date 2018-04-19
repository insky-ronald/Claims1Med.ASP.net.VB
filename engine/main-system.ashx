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
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("main", "System")
			With Main.SubItems.Add
				.ID = "tools"
				.Action = "sys-tools"				
				.Title = "Tools"
				.Icon = "settings"
				.Content = "engine/tools.aspx"
				.URL = "engine/sys-tools"
			End with
			
			With Main.SubItems.Add
				.ID = "icons"
				.Action = "icons"				
				.Title = "Icons"
				.Icon = "home"
				.URL = "engine/sys-icons"
			End with
			
			With Main.SubItems.Add
				.ID = "test"
				.Action = "test"				
				.Title = "Test"
				.Icon = "under-construction"
				.Content = "engine/under-construction.aspx"
				.URL = "engine/sys-under-construction"
				.Scripts = "*"
			End with
			
			With Main.SubItems.Add
				.ID = "notes"
				.Action = "test"				
				.Title = "Notes"
				.Icon = "note-outline"
				.URL = "engine/sys-notes"
				.Params.AsString("text_name") = "test"
				' .Content = "engine/under-construction.aspx"
				' .URL = "engine/sys-under-construction"
				' .Scripts = "*"
			End with
			
			With Main.SubItems.Add
				.ID = "notes-2"
				.Action = "test"				
				.Title = "Notes 2"
				.Icon = "note-outline"
				.URL = "engine/sys-notes"
				.Params.AsString("text_name") = "test-2"
				' .Content = "engine/under-construction.aspx"
				' .URL = "engine/sys-under-construction"
				' .Scripts = "*"
			End with
	End Sub
End Class
