<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private PlanCode As String = ""
	Private DBPlan As System.Data.DataTable
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		PlanCode = Request.Params("keyid")
		DBPlan = DBConnections("DBMedics").OpenData("GetPlan", {"code","visit_id"}, {PlanCode, Session("VisitorID")}, "")

		If Action = "navigator"
			Output.AsString("page_title") = DBPlan.Eval("Plan: @code")
			Output.AsString("window_title") = DBPlan.Eval("@plan_name")

			CustomData.AsString("product_code") = PlanCode
			REM CustomData.AsJson("certificate_id") = DBMember.Eval("@certificate_id")
			CustomData.AsJson("data") = DBPlan.AsJson()
		Else If Action = "refresh"
			Output.AsJson("data") = DBPlan.AsJson()
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBPlan.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsString("product_code") = PlanCode
		MenuItems.Params.AsString("plan_code") = PlanCode
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("plan", "Plan")
		
			With Main.SubItems.Add
				.ID = "details"
				.Title = "Details"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "app/plan"
				REM .URL = "app/under-construction"
				REM .Params.AsString("certificate_id") = DBMember.Eval("@certificate_id")
			End with
		
			With Main.SubItems.Add
				.ID = "sob"
				.Title = "Schedule of Benefits"
				.Description= "Schedule of Benefits History"
				.Icon = "history"
				.Action = "admin"
				.URL = "app/schedule-history"
				REM .Params.AsInteger("name_id") = ClientID
			End with
	End Sub
End Class
