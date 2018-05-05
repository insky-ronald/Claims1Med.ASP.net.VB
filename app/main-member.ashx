<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private MemberID As Integer = 0
	Private MainMemberID As Integer = 0
	Private PlanCode As String
	Private DBMember As System.Data.DataTable
	
	Private Sub NewRowRecord(ByVal sender As Object, ByVal e As System.Data.DataTableNewRowEventArgs)
		Dim Row As System.Data.DataRow = e.Row
		
		Using DBInfo = DBConnections("DBMedics").OpenData("GetNewMemberInfo", {"member_id", "plan_code","visit_id"}, {MemberID, Request.Params("plan"), Session("VisitorID")}, "")
			Row.Item("id") = 0
			Row.Item("sequence_no") = 0
			Row.Item("dependent_code") = 0
			Row.Item("status_code") = "1"
			Row.Item("name_type") = "M"
			Row.Item("auto_gen_certificate") = false
			Row.Item("create_policy") = false
			Row.Item("member_is_policy_holder") = false
			Row.Item("plan_code") = DBInfo.Eval("@plan_code")
			Row.Item("plan_name") = DBInfo.Eval("@plan_name")
			Row.Item("product_code") = DBInfo.Eval("@product_code")
			Row.Item("product_name") = DBInfo.Eval("@product_name")
			Row.Item("client_id") = DBInfo.Eval("@client_id")
			Row.Item("client_name") = DBInfo.Eval("@client_name")
			Row.Item("start_date") = DBInfo.Eval("@start_date")
			Row.Item("end_date") = DBInfo.Eval("@end_date")
			Row.Item("policy_id") = DBInfo.Eval("@policy_id")
			Row.Item("policy_no") = DBInfo.Eval("@policy_no")
			Row.Item("policy_holder") = DBInfo.Eval("@policy_holder")
			Row.Item("policy_issue_date") = DBInfo.Eval("@policy_issue_date")
			Row.Item("policy_start_date") = DBInfo.Eval("@policy_start_date")
			Row.Item("policy_end_date") = DBInfo.Eval("@policy_end_date")
			Row.Item("relationship_code") = DBInfo.Eval("@relationship_code")
			Row.Item("home_country_code") = DBInfo.Eval("@home_country_code")
			Row.Item("nationality_code") = DBInfo.Eval("@nationality_code")
			' Row.Item("claim_type_name") = DBInfo.Eval("@claim_type")
			' Row.Item("status_code") = "N"
			' Row.Item("status") = "NEW CLAIM"
			' Row.Item("case_owner") = DBInfo.Eval("@user_name")
			' Row.Item("member_id") = DBMember.Rows(0).Item("member_id")
			' Row.Item("name_id") = DBMember.Rows(0).Item("name_id")
			' Row.Item("main_name_id") = DBMember.Rows(0).Item("main_name_id")
			' Row.Item("policy_id") = DBMember.Rows(0).Item("policy_id")
			' Row.Item("plan_code") = DBMember.Rows(0).Item("plan_code").Trim
			' Row.Item("notification_date") = DBInfo.Eval("@notification_date")
			' Row.Item("country_of_incident") = DBInfo.Eval("@country_of_incident")
		End Using
	End Sub
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		
		If Request.Params("keyid") = "new"
			MainMemberID = Request.Params("keyid2")
			PlanCode = Request.Params("plan")
			CustomData.AsInteger("newRecord") = 1
			CustomData.AsJson("medical_notes") = ""
		Else
			MemberID = Request.Params("keyid")
			CustomData.AsInteger("newRecord") = 0
		End if
		
		DBMember = DBConnections("DBMedics").OpenData("GetMember", {"id","visit_id"}, {MemberID, Session("VisitorID")}, "")
		If MemberID = 0
			AddHandler DBMember.TableNewRow, AddressOf NewRowRecord
			DBMember.Rows.Add(DBMember.NewRow())
		Else
			Using DBMedicalNotes = DBConnections("DBMedics").OpenData("GetMemberMedicalNotes", {"id","claim_id","visit_id"}, {MemberID, 0, Session("VisitorID")}, "")
				CustomData.AsJson("medical_notes") = DBMedicalNotes.AsJson()
			End Using
		End if

		If Action = "navigator"
			If MemberID = 0
				Output.AsString("page_title") = "New Member"
				Output.AsString("window_title") = "New Member"
			Else
				Output.AsString("page_title") = DBMember.Eval("Member: @name")
				Output.AsString("window_title") = DBMember.Eval("@name")
			End if

			CustomData.AsJson("member_id") = MemberID
			' CustomData.AsJson("certificate_id") = DBMember.Eval("@certificate_id")
			CustomData.AsJson("data") = DBMember.AsJson()

			Using DBProduct = DBConnections("DBMedics").OpenData("GetProducts", {"code","action","visit_id"}, {DBMember.Eval("@product_code"), 10, Session("VisitorID")}, "")
				CustomData.AsJson("product") = DBProduct.AsJson()
			End Using

			Using DBCountries = DBConnections("DBMedics").OpenData("GetCountries", {"action","visit_id"}, {1, Session("VisitorID")}, "")
				DBCountries.Columns.Remove("row_no")
				CustomData.AsJson("countries") = DBCountries.AsJson()
			End Using
			
			REM CustomData.AsString("claim_type") = DBMember.Eval("@claim_type")
		Else If Action = "refresh"
			Output.AsJson("data") = DBMember.AsJson()
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBMember.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsInteger("member_id") = MemberID
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("member", "Member")
		
			With Main.SubItems.Add
				.ID = "details"
				.Title = "Details"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "app/member"
				.Css = "*"
				.Run = "MemberView"
				' .Params.AsString("certificate_id") = DBMember.Eval("@certificate_id")
			End with
			
			If MemberID = 0 
				Return
			End if
			
			With Main.SubItems.Add
				.ID = "claims"
				.Title = "Claims Entry"
				.Icon = "claims"
				.Action = "admin"
				.Css = "*"
				.Run = "MemberClaimsView"
				' .URL = "app/member-case-history"
				' .Params.AsInteger("member_id") = MemberID
			End with
			
			With Main.SubItems.Add
				.ID = "history"
				.Title = "Case History"
				.Icon = "history"
				.Action = "admin"				
				.URL = "app/member-case-history"
				' .Params.AsInteger("member_id") = MemberID
			End with
			
			With Main.SubItems.Add
				.ID = "call-log"
				.Title = "Call Log"
				.Icon = "call-log"
				.Action = "admin"				
				' .URL = "app/member-case-history"
				' .Params.AsInteger("member_id") = MemberID
			End with
			
			' With Main.SubItems.Add
				' .ID = "banks"
				' .Title = "Bank Accounts"
				' .Icon = "bank"
				' .Action = "admin"				
				' .URL = "app/banks"
				' .Params.AsInteger("name_id") = MemberID
			' End with
			
		' Main = MenuItems.AddMain("notes", "Notes")
			
			' With Main.SubItems.Add
				' .ID = "pmr"
				' .Title = "PMR"
				' .Icon = "note-outline"
				' .Action = "admin"				
				' .URL = "app/under-construction"
			' End with
			
			' With Main.SubItems.Add
				' .ID = "medical"
				' .Title = "Medical Notes"
				' .Icon = "note-outline"
				' .Action = "admin"				
				' .URL = "app/under-construction"
			' End with
			
			' With Main.SubItems.Add
				' .ID = "underwriting"
				' .Title = "Underwriting Notes"
				' .Icon = "note-outline"
				' .Action = "admin"				
				' .URL = "app/under-construction"
			' End with
	End Sub
End Class
