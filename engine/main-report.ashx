<%@ WebHandler Language="VB" Class="DataProvider" %>

REM Last modified on
REM 07-MAR-2017
Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private ReportID As Integer
	Private ReportTypeID As Integer
	' Private MemberID As Integer
	' Private ClaimType As String
	Private DBReport As System.Data.DataTable
	Private DBReportType As System.Data.DataTable
		
	' Protected Overrides Function CheckAuthorization As Boolean
		' Return False
	' End Function
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		
		ReportID = Request.Params("keyid")
		DBReport = DBConnections("DBReporting").OpenData("GetSavedReports", {"id","action","visit_id"}, {ReportID, 10, Session("VisitorID")}, "")
		
		ReportTypeID = DBReport.Eval("@report_type_id")		
		DBReportType = DBConnections("DBReporting").OpenData("GetReportTypes", {"id","action","visit_id"}, {ReportTypeID, 10, Session("VisitorID")}, "")
		
		
		' If ReportID = 0
			' MemberID = Request.Params("keyid2")
			' CustomData.AsInteger("newRecord") = 1
		' Else
			' MemberID = DBClaim.Eval("@member_id")
			' CustomData.AsInteger("newRecord") = 0
		' End if
		
		' DBMember = DBConnections("DBMedics").OpenData("GetClaimMemberInfo", {"claim_id","member_id","visit_id"}, {ReportID, MemberID, Session("VisitorID")}, "")
		' Using DBMedicalNotes = DBConnections("DBMedics").OpenData("GetMemberMedicalNotes", {"id","claim_id","visit_id"}, {MemberID, ReportID, Session("VisitorID")}, "")
			' CustomData.AsJson("medical_notes") = DBMedicalNotes.AsJson()
		' End Using

		' If ReportID = 0
			' AddHandler DBClaim.TableNewRow, AddressOf NewRowRecord
			' DBClaim.Rows.Add(DBClaim.NewRow())
		' End if
		
		If Action = "navigator"
			Output.AsString("page_title") = DBReportType.Eval("Report: @report_type")
			Output.AsString("window_title") = DBReportType.Eval("@report_type")

			' CustomData.AsString("claim_type") = ClaimType
			' CustomData.AsJson("claim_id") = ReportID
			' CustomData.AsJson("member_id") = MemberID
			' CustomData.AsJson("data") = DBClaim.AsJson()
			' CustomData.AsJson("member") = DBMember.AsJson()

			' Using DBCountries = DBConnections("DBMedics").OpenData("GetCountries", {"action","visit_id"}, {1, Session("VisitorID")}, "")
				' DBCountries.Columns.Remove("row_no")
				' CustomData.AsJson("countries") = DBCountries.AsJson()
			' End Using
			
			' Using DBUsers = DBConnections("DBMedics").OpenData("GetUsers", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
				' DBUsers.Columns.Remove("row_no")
				' CustomData.AsJson("users") = DBUsers.AsJson()
			' End Using
		' Else If Action = "refresh"
			' Output.AsJson("data") = DBClaim.AsJson()
			' Output.AsJson("member") = DBMember.AsJson()
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBReport.Dispose
		DBReportType.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsJson("report_id") = ReportID
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("report", "Report")
		
			With Main.SubItems.Add
				.ID = "tabular"
				.Title = "Tabular"
				.Icon = "table"
				.Action = "report"
				.URL = "app/report-" & ReportTypeID.ToString
				' .Css = "*"
				' .Run = "ReportView"
				' If ClaimType = "MED"
					' .Description = "Medical Claim"
				' End if
			End with
	End Sub
End Class
