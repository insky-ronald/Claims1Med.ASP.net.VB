<%@ WebHandler Language="VB" Class="DataProvider" %>

REM Last modified on
REM 07-MAR-2017
Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private ID As Integer
	Private DBData As System.Data.DataTable
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		
		ID = Request.Params("keyid")
		DBData = DBConnections("DBMedics").OpenData("GetScheduleHistory", {"id","visit_id"}, {ID, Session("VisitorID")}, "")
		CustomData.AsJson("data") = DBData.AsJson()
		
		If Action = "navigator"
			Output.AsString("page_title") = DBData.Eval("SOB: @plan_code")
			Output.AsString("window_title") = DBData.Eval("@plan_code")
			' Output.AsString("window_title") = DBData.Eval("@plan_name")
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBData.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsInteger("id") = ID
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("sob", "Schedule of Benefits")
		With Main.SubItems.Add
			.ID = "sob"
			' .Title = "Schedule"
			.Title = DBData.Eval("@plan_code")
			.Icon = "table-edit"
			.Action = "admin"
			.URL = "app/sob"
			.Css = "*"
			.Run = "SobView"
			.Description = String.Format("from {0} to {1}", DateTime.Parse(DBData.Eval("@start_date")).ToString("dd-MMM-yyyy"), DateTime.Parse(DBData.Eval("@end_date")).ToString("dd-MMM-yyyy"))
		End with
		
	End Sub
End Class
