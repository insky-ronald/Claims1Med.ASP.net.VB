﻿<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	' Inherits BaseNavigator

	Private ServiceID As Integer
	Private ServiceType As String = ""
	Private ServiceSubType As String = ""
	Private ServiceSubTypeName As String = ""

	Private DBService As System.Data.DataTable
	Private DBClaim As System.Data.DataTable
	Private DBMember As System.Data.DataTable
	' Private DBServiceSubType As System.Data.DataTable
	Private DBGopCalculationDates As System.Data.DataTable
	Private DBGopEstimates As System.Data.DataTable

	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function

	Protected Overrides Function ActionCode As String
		Dim Action As String = Request.Params("keyid").ToLower
		If Action = "inv"
			Return "invoice"
		Else
			Return Action
		End if
	End Function

	Private Sub NewEstimate(ByVal sender As Object, ByVal e As System.Data.DataTableNewRowEventArgs)
		With e.Row
			.Item("id") = ServiceID
			' .Item("average_cost") = 0
			' .Item("average_los") = 0
			' .Item("estimated_cost") = 0
			' .Item("estimated_los") = 0
			' .Item("estimated_provider_cost") = 0
			' .Item("estimated_provider_los") = 0
		End With
	End Sub

	Private Sub NewCalculation(ByVal sender As Object, ByVal e As System.Data.DataTableNewRowEventArgs)
		With e.Row
			.Item("id") = ServiceID
			' .Item("average_cost") = 0
			' .Item("average_los") = 0
			' .Item("estimated_cost") = 0
			' .Item("estimated_los") = 0
			' .Item("estimated_provider_cost") = 0
			' .Item("estimated_provider_los") = 0
		End With
	End Sub

	Private Sub NewRowRecord(ByVal sender As Object, ByVal e As System.Data.DataTableNewRowEventArgs)
		Dim Row As System.Data.DataRow = e.Row

		Row.Item("id") = 0
		Row.Item("claim_id") = DBClaim.Eval("@id")
		Row.Item("claim_no") = DBClaim.Eval("@claim_no")
		Row.Item("service_type") = Request.Params("keyid").ToUpper
		Row.Item("service_sub_type") = Request.Params("type").ToUpper
		Row.Item("client_id") = DBClaim.Eval("@client_id")
		Row.Item("client_name") = DBMember.Eval("@client_name")
		Row.Item("policy_id") = DBClaim.Eval("@policy_id")
		Row.Item("policy_no") = DBMember.Eval("@policy_no")
		Row.Item("plan_code") = DBClaim.Eval("@plan_code")
		Row.Item("member_id") = DBClaim.Eval("@member_id")
		Row.Item("patient_name") = DBMember.Eval("@member_name")
		Row.Item("claim_currency_code") = "AON"
		Row.Item("base_currency_code") = DBClaim.Eval("@base_currency_code")
		Row.Item("eligibility_currency_code") = DBClaim.Eval("@eligibility_currency_code")
		Row.Item("client_currency_code") = DBClaim.Eval("@client_currency_code")
		Row.Item("discount_type") = 0
		Row.Item("discount_percent") = 0
		Row.Item("discount_amount") = 0

		If ServiceType = "GOP"
			Row.Item("service_date") = Date.Today
			Row.Item("status_code") = "N"
			Row.Item("sub_status_code") = "N01"
			Row.Item("sequence_no") = 0
			Row.Item("version_no") = 1
			Row.Item("claim_type") = DBClaim.Eval("@claim_type")
			Row.Item("misc_expense") = 0
			Row.Item("room_expense") = 0
			Row.Item("length_of_stay") = 0
		Else If ServiceType = "INV"
			Row.Item("status_code") = "P"
			Row.Item("sub_status_code") = "P01"
			Row.Item("room_type") = "O"
			Row.Item("medical_type") = "0"
			Row.Item("treatment_country_code") = "AGO"
		End if

		' "service_no": null,
		' "service_date": null,
		' "document_type": null,
		' "claim_currency_rate_date": null,
		' "claim_currency_to_base": null,
		' "claim_currency_to_client": null,
		' "claim_currency_to_eligibility": null,
		' "settlement_advice_id": null,
		' "link_invoice_id": null,
		' "has_provider_discount": null,
		' "start_date": null,
		' "end_date": null,
		' "provider_id": null,
		' "provider_name": null,
		' "hospital_medical_record": null,
		' "provider_contact_person": null,
		' "provider_fax_no": null,
		' "discount_type_id": null,
		' "doctor_id": null,
		' "doctor_name": null,
		' "diagnosis_notes": null,
		' "notes": null,
	End Sub

	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)

		ServiceType = Request.Params("keyid").ToUpper
		If Request.Params("keyid2") = "new"
			ServiceID = 0
		Else
			ServiceID = Request.Params("keyid2")
		End if

		CustomData.AsString("module_type") = ServiceType
		CustomData.AsInteger("newRecord") = iif(ServiceID = 0, 1,  0)
		CustomData.AsInteger("service_id") = ServiceID

		DBService = DBConnections("DBMedics").OpenData("GetService", {"id","service_type","visit_id"}, {ServiceID, ServiceType, Session("VisitorID")}, "")

		If ServiceID = 0
			ServiceSubType = Request.Params("type")
			DBClaim = DBConnections("DBMedics").OpenData("GetClaim", {"id","visit_id"}, {Request.Params("claim"), Session("VisitorID")}, "")
			DBMember = DBConnections("DBMedics").OpenData("GetClaimMemberInfo", {"claim_id","member_id","visit_id"}, {Request.Params("claim"),DBClaim.Eval("@member_id"), Session("VisitorID")}, "")

			AddHandler DBService.TableNewRow, AddressOf NewRowRecord
			DBService.Rows.Add(DBService.NewRow())
		Else
			ServiceSubType = DBService.Eval("@service_sub_type")
		End if

		' DBServiceSubType = DBConnections("DBMedics").OpenData("GetServiceSubType", {"id","service_type","sub_type","visit_id"}, {ServiceID, ServiceType, ServiceSubType, Session("VisitorID")}, "")
		DBGopCalculationDates = DBConnections("DBMedics").OpenData("GetGopCalculationDates", {"id","visit_id"}, {ServiceID,Session("VisitorID")}, "")
		If DBGopCalculationDates.Rows.Count = 0
			AddHandler DBGopCalculationDates.TableNewRow, AddressOf NewCalculation
			DBGopCalculationDates.Rows.Add(DBGopCalculationDates.NewRow())
		End if

		DBGopEstimates = DBConnections("DBMedics").OpenData("GetGopEstimates", {"id","visit_id"}, {ServiceID,Session("VisitorID")}, "")
		If DBGopEstimates.Rows.Count = 0
			AddHandler DBGopEstimates.TableNewRow, AddressOf NewEstimate
			DBGopEstimates.Rows.Add(DBGopEstimates.NewRow())
		End if

		Using DBServiceType = DBConnections("DBMedics").OpenData("lookup_service_type_name", {"module","code"}, {ServiceType, ServiceSubType}, "")
			ServiceSubTypeName = DBServiceType.Eval("@display_name")
		End Using

		CustomData.AsString("service_type_name") = ServiceSubTypeName
		If ServiceID > 0
			Output.AsString("page_title") = DBService.Eval("@service_no")
			Output.AsString("window_title") = DBService.Eval("@service_no")
			ServiceSubType = Request.Params("type")
		Else
			If ServiceType = "INV"
				Output.AsString("page_title") = "New Invoice"
			Else If ServiceType = "GOP"
				Output.AsString("page_title") = "New Guarantee of Payment"
			' Else If ServiceType = "noc"
				' Description = "Notification of Claim"
			' Else If ServiceType = "cas"
				' Description = "Case Fee"
			' Else If ServiceType = "rec"
				' Description = "Recovery"
			' Else If ServiceType = "cos"
				' Description = "Cost Containment"
			' Else If ServiceType = "flg"
				' Description = "Flag"
			' Else
				' Description = ServiceType
			End if

			Output.AsString("window_title") = Output.AsString("page_title")
			ServiceSubType = DBService.Eval("@service_sub_type")
		End if

		CustomData.AsJson("data") = DBService.AsJson()
		' CustomData.AsJson("sub_type_data") = DBServiceSubType.AsJson()
		CustomData.AsJson("estimates") = DBGopEstimates.AsJson()
		CustomData.AsJson("calculation_dates") = DBGopCalculationDates.AsJson()

		Using DBCountries = DBConnections("DBMedics").OpenData("GetCountries", {"action","visit_id"}, {1, Session("VisitorID")}, "")
			DBCountries.Columns.Remove("row_no")
			CustomData.AsJson("countries") = DBCountries.AsJson()
		End Using

		Using DBCurrencies = DBConnections("DBMedics").OpenData("GetCurrencies", {"action","visit_id"}, {1, Session("VisitorID")}, "")
			DBCurrencies.Columns.Remove("row_no")
			CustomData.AsJson("currencies") = DBCurrencies.AsJson()
		End Using

		Dim Permissions As New EasyStringDictionary("")
		
		If ServiceType = "INV"
			Permissions.AsJson("service") = DatabaseUtils.GetActionPermission("invoice").JsonString()
		Else
			Permissions.AsJson("service") = DatabaseUtils.GetActionPermission(ServiceType.ToLower).JsonString()
		End if
		
		Permissions.AsJson("diagnosis") = DatabaseUtils.GetActionPermission(ServiceType.ToLower+"-diagnosis").JsonString()
		Permissions.AsJson("procedure") = DatabaseUtils.GetActionPermission(ServiceType.ToLower+"-procedure").JsonString()
		Permissions.AsJson("notes") = DatabaseUtils.GetActionPermission(ServiceType.ToLower+"-note").JsonString()
		Permissions.AsJson("status") = DatabaseUtils.GetActionPermission(ServiceType.ToLower+"-status").JsonString()
		Permissions.AsJson("action") = DatabaseUtils.GetActionPermission(ServiceType.ToLower+"-action").JsonString()

		CustomData.AsJson("permissions") = Permissions.JsonString()
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBService.Dispose
		DBGopEstimates.Dispose
		DBGopCalculationDates.Dispose
		If ServiceID = 0
			DBClaim.Dispose
			DBMember.Dispose
		End if
	End Sub

	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)

		' Dim Main As Navigator.MenuItem
		Dim Run As String = ""
		Dim Description As String = ""
		Dim Action As String = ""
		
		If ServiceType = "INV"
			Description = "Invoice"
			Run = "InvoiceView"
			Action = "invoice"
		Else If ServiceType = "GOP"
			Description = "Guarantee of Payment"
			Run = "GopView"
			Action = "gop"
		Else If ServiceType = "noc"
			Description = "Notification of Claim"
			Action = "noc"
		' Else If ServiceType = "cas"
			' Description = "Case Fee"
		' Else If ServiceType = "rec"
			' Description = "Recovery"
		' Else If ServiceType = "cos"
			' Description = "Cost Containment"
		' Else If ServiceType = "flg"
			' Description = "Flag"
		' Else
			Description = ServiceType
		End if

		' Description = ServiceSubTypeName
		Dim Main As Navigator.MenuItem = MenuItems.AddMain(ServiceType, Description)

		With Main.SubItems.Add
			.ID = "details"
			.Action = Action
			.Title = "Details"
			' .Description = Description
			.Description = ServiceSubTypeName
			.Icon = "details-edit"
			.Css = "*"
			.Run = Run
			REM .URL = "app/service-" & ServiceType
		End with

		If ServiceType = "INV" or ServiceType = "GOP"
			With Main.SubItems.Add
				.ID = "breakdown"
				.Action = Action
				.Title = "Breakdown"
				.Icon = "service-breakdown"
				.URL = "app/service-breakdown"
				.Params.AsString("service_id") = ServiceID
			End with
		End if

		If ServiceType = "GOP"
			With Main.SubItems.Add
				.ID = "template"
				.Action = Action
				.Title = "Template"
				.Icon = "document-template"
				.URL = "app/document-template"
				.Params.AsString("service_id") = ServiceID
			End with
		End if

		With Main.SubItems.Add
			.ID = "documents"
			.Title = "Documents"
			.Icon = "documents"
			.Action = "claim-document"
			.URL = "app/claim-documents"
			.Params.AsString("claim_id") = 0
			.Params.AsString("service_id") = ServiceID
		End with

		' With Main.SubItems.Add
			' .ID = "notes"
			' .Title = "Notes"
			' .Icon = "notes"
			' .Action = "claim-note"
			' .URL = "app/claim-notes"
			' .Params.AsString("type") = "S"
			' .Params.AsString("claim_id") = 0
			' .Params.AsString("service_id") = ServiceID
		' End with

		With Main.SubItems.Add
			.ID = "audit"
			.Action = "admin"
			.Title = "Audit Log"
			.Icon = "timetable"
			.Action = "claim-audit-log"
			.URL = "app/claim-audit-logs"
			.Params.AsString("claim_id") = 0
			.Params.AsString("service_id") = ServiceID
		End with
	End Sub
End Class
