<%@ WebHandler Language="VB" Class="DataProvider" %>

REM Last modified on
REM 07-MAR-2017
Public Class DataProvider
	Inherits DataHandler.BaseNavigator

	Private ClaimID As Integer
	Private MemberID As Integer
	Private ClaimType As String
	Private DBClaim As System.Data.DataTable
	Private DBMember As System.Data.DataTable

	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function

	Private Sub NewRowRecord(ByVal sender As Object, ByVal e As System.Data.DataTableNewRowEventArgs)
		Dim Row As System.Data.DataRow = e.Row

		Using DBInfo = DBConnections("DBMedics").OpenData("GetNewClaimInfo", {"member_id", "claim_type","visit_id"}, {DBMember.Rows(0).Item("member_id"), Request.Params("type"), Session("VisitorID")}, "")
			Row.Item("id") = 0
			Row.Item("claim_no") = ""
			Row.Item("is_accident") = false
			Row.Item("is_preexisting") = false
			Row.Item("claim_type") = Request.Params("type")
			Row.Item("claim_type_name") = DBInfo.Eval("@claim_type")
			Row.Item("status_code") = "N"
			Row.Item("status") = "NEW CLAIM"
			' Row.Item("case_owner") = Session("UserID")
			Row.Item("case_owner") = DBInfo.Eval("@user_name")
			Row.Item("member_id") = DBMember.Rows(0).Item("member_id")
			Row.Item("name_id") = DBMember.Rows(0).Item("name_id")
			Row.Item("main_name_id") = DBMember.Rows(0).Item("main_name_id")
			Row.Item("policy_id") = DBMember.Rows(0).Item("policy_id")
			Row.Item("client_id") = DBMember.Rows(0).Item("client_id")
			Row.Item("product_code") = DBMember.Rows(0).Item("product_code").Trim
			Row.Item("plan_code") = DBMember.Rows(0).Item("plan_code").Trim
			Row.Item("notification_date") = DBInfo.Eval("@notification_date")
			Row.Item("country_of_incident") = DBInfo.Eval("@country_of_incident")
			Row.Item("base_currency_code") = DBInfo.Eval("@base_currency_code")
			Row.Item("client_currency_code") = DBInfo.Eval("@client_currency_code")
			Row.Item("eligibility_currency_code") = DBInfo.Eval("@eligibility_currency_code")
		End Using
	End Sub

	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)

		If Request.Params("keyid") = "new"
			ClaimID = 0
			MemberID = Request.Params("keyid2")
			ClaimType = Request.Params("type")
		Else
			ClaimID = Request.Params("keyid")
		End if

		DBClaim = DBConnections("DBMedics").OpenData("GetClaim", {"id","visit_id"}, {ClaimID, Session("VisitorID")}, "")

		If ClaimID = 0
			CustomData.AsInteger("newRecord") = 1
		Else
			MemberID = DBClaim.Eval("@member_id")
			CustomData.AsInteger("newRecord") = 0
		End if

		DBMember = DBConnections("DBMedics").OpenData("GetClaimMemberInfo", {"claim_id","member_id","visit_id"}, {ClaimID, MemberID, Session("VisitorID")}, "")
		Using DBMedicalNotes = DBConnections("DBMedics").OpenData("GetMemberMedicalNotes", {"id","claim_id","visit_id"}, {MemberID, ClaimID, Session("VisitorID")}, "")
			CustomData.AsJson("medical_notes") = DBMedicalNotes.AsJson()
		End Using

		If ClaimID = 0
			AddHandler DBClaim.TableNewRow, AddressOf NewRowRecord
			DBClaim.Rows.Add(DBClaim.NewRow())
		End if

		If ClaimID = 0
			Output.AsString("page_title") = "New Claim"
			Output.AsString("window_title") = "New Claim"
			ClaimType = Request.Params("type")
		Else
			Output.AsString("page_title") = DBClaim.Eval("Claim: @claim_no")
			' Output.AsString("window_title") = DBClaim.Eval("@claim_no (@status)")
			Output.AsString("window_title") = DBClaim.Eval("@claim_no")
			ClaimType = DBClaim.Eval("@claim_type")
		End if

		CustomData.AsString("claim_type") = ClaimType
		CustomData.AsJson("claim_id") = ClaimID
		CustomData.AsJson("member_id") = MemberID
		CustomData.AsJson("data") = DBClaim.AsJson()
		CustomData.AsJson("member") = DBMember.AsJson()

		Using DBCountries = DBConnections("DBMedics").OpenData("GetCountries", {"action","visit_id"}, {1, Session("VisitorID")}, "")
			DBCountries.Columns.Remove("row_no")
			CustomData.AsJson("countries") = DBCountries.AsJson()
		End Using

		Using DBUsers = DBConnections("DBMedics").OpenData("GetUsers", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
			DBUsers.Columns.Remove("row_no")
			CustomData.AsJson("users") = DBUsers.AsJson()
		End Using

		CustomData.AsJson("crud") = DatabaseUtils.GetActionPermission("member").JsonString()

		Dim Permissions As New EasyStringDictionary("")
		' Permissions.AsBoolean("address") = DatabaseUtils.AllowAction("member-address")
		' Permissions.AsBoolean("contact") = DatabaseUtils.AllowAction("member-contact")
		' Permissions.AsBoolean("diagnosis") = DatabaseUtils.AllowAction("claim-diagnosis")
		' Permissions.AsBoolean("status") = DatabaseUtils.AllowAction("claim-status")
		' Permissions.AsBoolean("plan_history") = DatabaseUtils.AllowAction("member-planhist")

		Permissions.AsJson("address") = DatabaseUtils.GetActionPermission("member-address").JsonString()
		Permissions.AsJson("contact") = DatabaseUtils.GetActionPermission("member-contact").JsonString()
		Permissions.AsJson("diagnosis") = DatabaseUtils.GetActionPermission("claim-diagnosis").JsonString()
		Permissions.AsJson("status") = DatabaseUtils.GetActionPermission("claim-status").JsonString()
		Permissions.AsJson("plan_history") = DatabaseUtils.GetActionPermission("member-planhist").JsonString()
		Permissions.AsJson("medical_notes") = DatabaseUtils.GetActionPermission("member-medical-notes").JsonString()

		CustomData.AsJson("permissions") = Permissions.JsonString()
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBClaim.Dispose
		DBMember.Dispose
	End Sub

	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)

		MenuItems.Params.AsInteger("claim_id") = ClaimID

		Dim Main As Navigator.MenuItem = MenuItems.AddMain("claim", "Claim")

			With Main.SubItems.Add
				.ID = "details"
				.Title = "Details"
				.Icon = "table-edit"
				.Action = "claim"
				.URL = "app/claim-details"
				.Css = "*"
				.Run = "ClaimDetailsView"
				If ClaimType = "MED"
					.Description = "Medical Claim"
				End if
			End with

			With Main.SubItems.Add
				.ID = "history"
				.Title = "Case History"
				.Icon = "history"
				.Action = "claim-history"
				.URL = "app/member-case-history"
				.Params.AsInteger("member_id") = MemberID
			End with

			If ClaimID = 0
				Return
			End if

			With Main.SubItems.Add
				.ID = "documents"
				.Title = "Documents"
				.Icon = "documents"
				.Action = "claim-document"
				.URL = "app/claim-documents"
				.Params.AsInteger("claim_id") = ClaimID
				.Params.AsInteger("service_id") = 0
			End with

			With Main.SubItems.Add
				.ID = "notes"
				.Title = "Notes"
				.Icon = "notes"
				.Action = "claim-note"
				.URL = "app/claim-notes"
				' .Params.AsString("module") = "clm"
				.Params.AsString("type") = "C"
				.Params.AsInteger("claim_id") = ClaimID
				.Params.AsInteger("service_id") = 0
			End with

			With Main.SubItems.Add
				.ID = "benefit-utilisation"
				.Title = "Benefit Utilisation"
				.Icon = "benefit"
				.Action = "benefit-uilisation"
				.URL = "app/benefit-utilisation"
				.Params.AsInteger("member_id") = MemberID
			End with

			With Main.SubItems.Add
				.ID = "call-log"
				.Title = "Call Log"
				.Icon = "call-log"
				.Action = "claim-call-log"
				' .URL = "app/member-case-history"
				' .Params.AsInteger("member_id") = MemberID
			End with

			With Main.SubItems.Add
				.ID = "log"
				.Title = "Audit Log"
				.Icon = "timetable"
				.Action = "claim-audit-log"
				.URL = "app/claim-audit-logs"
				.Params.AsInteger("claim_id") = ClaimID
				.Params.AsInteger("service_id") = 0
			End with

		Main = MenuItems.AddMain("services", "Services")

			With Main.SubItems.Add
				.ID = "gop"
				.Title = "Guarantee of Payments"
				.Icon = "table"
				.Action = "gop"
				.URL = "app/claim-invoices"
				.Css = "*"
				.Run = "ListClaimServices"
				.Params.AsString("module") = "gop"
			End with

			With Main.SubItems.Add
				.ID = "invoices"
				.Title = "Invoices"
				.Icon = "table"
				.Action = "invoice"
				.URL = "app/claim-invoices"
				.Css = "*"
				.Run = "ListClaimServices"
				.Params.AsString("module") = "inv"
			End with

			With Main.SubItems.Add
				.ID = "noc"
				.Title = "Notification of Claims"
				.Icon = "table"
				.Action = "noc"
				.URL = "app/claim-invoices"
				.Css = "*"
				.Run = "ListClaimServices"
				.Params.AsString("module") = "noc"
			End with

			' With Main.SubItems.Add
				' .ID = "casefee"
				' .Title = "Case Fees"
				' .Icon = "table"
				' .Action = "admin"
				' .URL = "app/claim-invoices"
				' .Css = "*"
				' .Run = "ListClaimServices"
				' .Params.AsString("module") = "cas"
			' End with

			' With Main.SubItems.Add
				' .ID = "recovery"
				' .Title = "Recovery of Claims"
				' .Icon = "table"
				' .Action = "admin"
				' .URL = "app/claim-invoices"
				' .Css = "*"
				' .Run = "ListClaimServices"
				' .Params.AsString("module") = "rec"
			' End with

			' With Main.SubItems.Add
				' .ID = "costcont"
				' .Title = "Cost Containment"
				' .Icon = "table"
				' .Action = "admin"
				' .URL = "app/claim-invoices"
				' .Css = "*"
				' .Run = "ListClaimServices"
				' .Params.AsString("module") = "cos"
			' End with

			' With Main.SubItems.Add
				' .ID = "flag"
				' .Title = "Flags"
				' .Icon = "table"
				' .Action = "admin"
				' .URL = "app/claim-invoices"
				' .Css = "*"
				' .Run = "ListClaimServices"
				' .Params.AsString("module") = "flg"
			' End with

			' With Main.SubItems.Add
				' .ID = "test"
				' .Title = "Test"
				' .Icon = "test"
				' .Action = "admin"
				' .URL = "app/claim-invoices"
				' .Css = "*"
				' .Run = "TestScrollerView"
			' End with

			' With Main.SubItems.Add
				' .ID = "test"
				' .Action = "test"
				' .Title = "Test"
				' .Icon = "under-construction"
				' .Content = "engine/under-construction.aspx"
				' .URL = "engine/sys-under-construction"
				' .Scripts = "*"
			' End with

			' With Main.SubItems.Add
				' .ID = "notes"
				' .Action = "test"
				' .Title = "Notes"
				' .Icon = "note-outline"
				' .URL = "engine/sys-notes"
				' .Params.AsString("text_name") = "test"
			' End with
	End Sub
End Class
