<%@ WebHandler Language="VB" Class="DataProvider" %>

REM Last modified on
REM 07-MAR-2017
Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private RoleID As Integer
	Private DBRole As System.Data.DataTable
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		RoleID = Request.Params("keyid")
		DBRole = DBConnections("DBSecure").OpenData("GetRoles", {"id","mode","visit_id"}, {RoleID, 10, Session("VisitorID")}, "")

		Output.AsString("page_title") = "Permission: " & DBRole.Rows(0).Item("role")
		REM Output.AsString("page_title") = "Permission: " & Request.Params("keyid")
		Output.AsString("window_title") = DBRole.Rows(0).Item("role")
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBRole.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("main", "Main")
		
			With Main.SubItems.Add
				.ID = "permissions"
				.Action = "sys-permissions"				
				.Title = "Permissions"
				.Icon = "security"
				.URL = "engine/sys-permissions"
				.Params.AsJson("role_id") = RoleID
			End with
			
	End Sub
End Class
