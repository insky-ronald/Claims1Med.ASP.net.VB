<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private ClaimID As Integer
	Private MemberID As Integer
	Private DBClaim As System.Data.DataTable
	Private DBMember As System.Data.DataTable
	Private DBUsers As System.Data.DataTable

	Private Sub NewRowRecord(ByVal sender As Object, ByVal e As System.Data.DataTableNewRowEventArgs)
		Dim Row As System.Data.DataRow = e.Row
		Row.Item("id") = 0
		Row.Item("claim_no") = ""
		Row.Item("claim_type") = "MED"
		Row.Item("status_code") = "N"
		Row.Item("status") = "NEW CLAIM"
		Row.Item("case_owner") = Session("UserID")
		Row.Item("member_id") = DBMember.Rows(0).Item("member_id")
		Row.Item("name_id") = DBMember.Rows(0).Item("name_id")
		Row.Item("main_name_id") = DBMember.Rows(0).Item("main_name_id")
		Row.Item("policy_id") = DBMember.Rows(0).Item("policy_id")
		Row.Item("client_id") = DBMember.Rows(0).Item("client_id")
		Row.Item("product_code") = DBMember.Rows(0).Item("product_code").Trim
		Row.Item("plan_code") = DBMember.Rows(0).Item("plan_code").Trim
		REM End if
	End Sub
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		ClaimID = Request.Params("keyid")
		DBClaim = DBConnections("DBMedics").OpenData("GetClaim", {"id","visit_id"}, {ClaimID, Session("VisitorID")}, "")
		If ClaimID = 0
			MemberID = Request.Params("keyid2")
		Else
			MemberID = DBClaim.Eval("@member_id")
		End if
		
		DBMember = DBConnections("DBMedics").OpenData("GetClaimMemberInfo", {"claim_id","member_id","visit_id"}, {ClaimID, MemberID, Session("VisitorID")}, "")
		
		If ClaimID = 0
			AddHandler DBClaim.TableNewRow, AddressOf NewRowRecord
			DBClaim.Rows.Add(DBClaim.NewRow())
		End if
		
		If Action = "navigator"
			If ClaimID = 0
				Output.AsString("page_title") = "New Claim"
				Output.AsString("window_title") = "New Claim"
				CustomData.AsString("claim_type") = ""
			Else
				Output.AsString("page_title") = DBClaim.Eval("Claim: @claim_no")
				Output.AsString("window_title") = DBClaim.Eval("@claim_no (@status)")
				CustomData.AsString("claim_type") = DBClaim.Eval("@claim_type")
			End if

			CustomData.AsJson("claim_id") = ClaimID
			CustomData.AsJson("member_id") = MemberID
			CustomData.AsJson("data") = DBClaim.AsJson()
			CustomData.AsJson("member_data") = DBMember.AsJson()
			Using DBCountries = DBConnections("DBMedics").OpenData("GetCountries", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
				DBCountries.Columns.Remove("row_no")
				CustomData.AsJson("countries") = DBCountries.AsJson()
			End Using 
			Using DBUsers = DBConnections("DBMedics").OpenData("GetUsers", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
				DBUsers.Columns.Remove("row_no")
				CustomData.AsJson("users") = DBUsers.AsJson()
			End Using
		Else If Action = "refresh"
			Output.AsJson("data") = DBClaim.AsJson()
			Output.AsJson("member_data") = DBMember.AsJson()
		End if
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
				.Action = "admin"
				.URL = "app/claim-details"
				.Css = "*"
				.Run = "ClaimDetailsView"
				REM .Params.AsString("id") = Request.Params("keyid")
				REM .Params.AsString("id") = 0
			End with
			
			With Main.SubItems.Add
				.ID = "documents"
				.Title = "Documents"
				.Icon = "file-outline"
				.Action = "admin"				
				.URL = "app/documents"
				.Params.AsString("module") = "clm"
			End with
			
			With Main.SubItems.Add
				.ID = "notes"
				.Title = "Notes"
				.Icon = "pencil-box-outline"
				.Action = "admin"				
				.URL = "app/notes"
				.Params.AsString("module") = "clm"
			End with
			
			With Main.SubItems.Add
				.ID = "reserve"
				.Title = "Reserve"
				.Icon = "table"
				.Action = "admin"				
				.URL = "app/under-construction"
				.Params.AsString("module") = .ID
			End with
		
			With Main.SubItems.Add
				.ID = "log"
				.Title = "Log"
				.Icon = "timetable"
				.Action = "admin"				
				.URL = "app/under-construction"
				.Params.AsString("module") = .ID
			End with
		
		Main = MenuItems.AddMain("services", "Services")
		
			With Main.SubItems.Add
				.ID = "invoices"
				.Title = "Invoices"
				.Icon = "table"
				.Action = "admin"				
				.URL = "app/claim-invoices"
				.Css = "*"
				.Run = "ClaimInvoicesView"
				.Params.AsString("module") = "inv"
			End with
			
			With Main.SubItems.Add
				.ID = "gop"
				.Title = "Guarantee of Payments"
				.Icon = "table"
				.Action = "admin"				
				.URL = "app/claim-invoices"
				.Css = "*"
				.Run = "ClaimInvoicesView"
				.Params.AsString("module") = "gop"
			End with
			
			With Main.SubItems.Add
				.ID = "noc"
				.Title = "Notification of Claims"
				.Icon = "table"
				.Action = "admin"				
				.URL = "app/claim-invoices"
				.Css = "*"
				.Run = "ClaimInvoicesView"
				.Params.AsString("module") = "noc"
			End with
			
			With Main.SubItems.Add
				.ID = "casefee"
				.Title = "Case Fees"
				.Icon = "table"
				.Action = "admin"				
				.URL = "app/claim-invoices"
				.Css = "*"
				.Run = "ClaimInvoicesView"
				.Params.AsString("module") = "cas"
			End with
			
			With Main.SubItems.Add
				.ID = "recovery"
				.Title = "Recovery of Claims"
				.Icon = "table"
				.Action = "admin"				
				.URL = "app/claim-invoices"
				.Css = "*"
				.Run = "ClaimInvoicesView"
				.Params.AsString("module") = "rec"
			End with
			
			With Main.SubItems.Add
				.ID = "costcont"
				.Title = "Cost Containment"
				.Icon = "table"
				.Action = "admin"				
				.URL = "app/claim-invoices"
				.Css = "*"
				.Run = "ClaimInvoicesView"
				.Params.AsString("module") = "cos"
			End with
			
			With Main.SubItems.Add
				.ID = "flag"
				.Title = "Flags"
				.Icon = "table"
				.Action = "admin"				
				.URL = "app/claim-invoices"
				.Css = "*"
				.Run = "ClaimInvoicesView"
				.Params.AsString("module") = "flg"
			End with
		
		Return
		Main = MenuItems.AddMain("other", "Other")
		
		Main = MenuItems.AddMain("datatables", "Datatables")

		With Main.SubItems.Add
			.ID = "clients"
			.Action = "admin"				
			.Title = "Clients"
			REM .Icon = "c+users"
			.Icon = "table-edit"
			.URL = "app/clients"
		End with

		With Main.SubItems.Add
			.ID = "policies"
			.Action = "insurance"				
			.Title = "Policies"
			REM .Icon = "c+book.hardcover"
			.Icon = "table-edit"
			.URL = "app/masterpolicies"
		End with

		With Main.SubItems.Add
			.ID = "brokers"
			.Action = "admin"				
			.Title = "Brokers"
			REM .Icon = "c+people"
			.Icon = "table-edit"
			.URL = "app/brokers"
		End with
		
		Main = MenuItems.AddMain("calendar", "Calendar")

		With Main.SubItems.Add
			.ID = "calendar-week"
			.Action = "admin"				
			.Title = "Weekly"
			REM .Icon = "c+calendar"
			.Icon = "calendar-blank"
			.URL = "app/calendar"
		End with
		
		Return
		With MenuItems.AddMain
			.ID = "components"
			REM .Action = "admin"				
			.Title = "Components"
			REM .URL = "app/clients"
		End with			
		With MenuItems.AddMain
			.ID = "samples"
			.Action = "admin"				
			.Title = "UI Examples"
			REM .URL = "app/clients"
		End with			
	End Sub
End Class
