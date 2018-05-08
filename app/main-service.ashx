<%@ WebHandler Language="VB" Class="DataProvider" %>
	
Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private ServiceID As Integer
	Private ServiceType As String = ""
	Private ServiceSubType As String = ""
	Private ServiceSubTypeName As String = ""
	Private DBService As System.Data.DataTable
	' Private DBServiceSubType As System.Data.DataTable
	Private DBGopCalculationDates As System.Data.DataTable
	Private DBGopEstimates As System.Data.DataTable
	
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
		
		Using DBInfo = DBConnections("DBMedics").OpenData("GetNewServiceInfo", {"claim_id", "service_type","service_sub_type","visit_id"}, {Request.Params("claim"), Request.Params("keyid"), Request.Params("type"), Session("VisitorID")}, "")
			Row.Item("id") = 0
			' Row.Item("claim_no") = ""
			' Row.Item("claim_type") = Request.Params("type")
			' Row.Item("claim_type_name") = DBInfo.Eval("@claim_type")
			' Row.Item("status_code") = "N"
			' Row.Item("status") = "NEW CLAIM"
			' Row.Item("case_owner") = DBInfo.Eval("@user_name")
			' Row.Item("member_id") = DBMember.Rows(0).Item("member_id")
			' Row.Item("name_id") = DBMember.Rows(0).Item("name_id")
			' Row.Item("main_name_id") = DBMember.Rows(0).Item("main_name_id")
			' Row.Item("policy_id") = DBMember.Rows(0).Item("policy_id")
			' Row.Item("client_id") = DBMember.Rows(0).Item("client_id")
			' Row.Item("product_code") = DBMember.Rows(0).Item("product_code").Trim
			' Row.Item("plan_code") = DBMember.Rows(0).Item("plan_code").Trim
			' Row.Item("notification_date") = DBInfo.Eval("@notification_date")
			' Row.Item("country_of_incident") = DBInfo.Eval("@country_of_incident")
		End Using
	End Sub
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		
		ServiceType = Request.Params("keyid")
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
		If Action = "navigator"
			If ServiceID > 0
				Output.AsString("page_title") = DBService.Eval("@service_no")
				Output.AsString("window_title") = DBService.Eval("@service_no")
				ServiceSubType = Request.Params("type")
			Else
				Output.AsString("page_title") = "New Invoice"
				Output.AsString("window_title") = "New Invoice"
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
			
		Else If Action = "refresh"
			Output.AsJson("data") = DBService.AsJson()
			' Output.AsJson("sub_type_data") = DBServiceSubType.AsJson()
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBService.Dispose
		' DBServiceSubType.Dispose
		DBGopEstimates.Dispose
		DBGopCalculationDates.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		' Dim Main As Navigator.MenuItem		
		Dim Run As String = ""
		Dim Description As String = ""
		
		If ServiceType = "inv"
			Description = "Invoice"
			Run = "ServiceDetailsView"
		Else If ServiceType = "gop"
			Description = "Guarantee of Payment"
			' Description = ServiceSubTypeName
			Run = "ServiceDetailsView"
			' Run = "GopView"
		Else If ServiceType = "noc"
			Description = "Notification of Claim"
		Else If ServiceType = "cas"
			Description = "Case Fee"
		Else If ServiceType = "rec"
			Description = "Recovery"
		Else If ServiceType = "cos"
			Description = "Cost Containment"
		Else If ServiceType = "flg"
			Description = "Flag"
		Else
			Description = ServiceType
		End if
		
		' Description = ServiceSubTypeName
		Dim Main As Navigator.MenuItem = MenuItems.AddMain(ServiceType, Description)
		
		With Main.SubItems.Add
			.ID = "details"
			.Action = "admin"				
			.Title = "Details"
			' .Description = Description
			.Description = ServiceSubTypeName
			.Icon = "details-edit"
			.Css = "*"
			.Run = Run
			REM .URL = "app/service-" & ServiceType
		End with		
		
		If ServiceType = "inv" or ServiceType = "gop"
			With Main.SubItems.Add
				.ID = "breakdown"
				.Action = "admin"				
				.Title = "Breakdown"
				.Icon = "service-breakdown"
				.URL = "app/service-breakdown"
				.Params.AsString("service_id") = ServiceID
			End with
		End if
			
		With Main.SubItems.Add
			.ID = "documents"
			.Title = "Documents"
			.Icon = "documents"
			.Action = "admin"
			.URL = "app/claim-documents"
			.Params.AsString("claim_id") = 0
			.Params.AsString("service_id") = ServiceID
		End with
		
		With Main.SubItems.Add
			.ID = "notes"
			.Title = "Notes"
			.Icon = "notes"
			.Action = "admin"				
			.URL = "app/claim-notes"
			' .Params.AsString("module") = "clm"
			.Params.AsString("type") = "S"
			.Params.AsString("claim_id") = 0
			.Params.AsString("service_id") = ServiceID
		End with
		
		With Main.SubItems.Add
			.ID = "audit"
			.Action = "admin"				
			.Title = "Audit Log"
			.Icon = "timetable"
			.Action = "admin"				
			.URL = "app/claim-audit-logs"
			.Params.AsString("claim_id") = 0
			.Params.AsString("service_id") = ServiceID
		End with
	End Sub
End Class
