Imports System

Public Class Template
    Inherits System.Web.UI.Page
	
	Protected Template As String = ""
	Public ViewerControl As System.Web.UI.UserControl
	
	Private Sub Template_Init(ByVal Sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		ID = Request.Params("id")
		' Action = Request.Params("action")
		If Request.Params("template") IsNot Nothing
			Template = Request.Params("template")
		End if
		
		Using DBService = DBConnections("DBMedics").OpenData("GetService", {"id","service_type","visit_id"}, {ID, "", Session("VisitorID")}, "")
			If Template <> "" and Template <> DBService.Rows(0).Item("document_type").ToString
				' replace document type
			Else
				Template = DBService.Rows(0).Item("document_type")
			End if
			
			' Template = "GOP_GM01"
			
			' DBData = DBConnections("DBMedics").OpenData("GetTemplate_" & Template, {"claim_id","service_id","visit_id"}, {DBService.Eval("@claim_id"), DBService.Eval("@id"), Session("VisitorID")})
			' Row = DBData.Rows(0)
		End Using
		
		' ViewerControl = LoadControl("~/app/templates/Template_GOP_GM01.ascx")
		ViewerControl = LoadControl("~/app/templates/Template_" & Template & ".ascx")
	End Sub
	
	Private Sub Template_Load(ByVal Sender As Object, ByVal e As System.EventArgs) Handles Me.Load
		' Response.CodePage = 65001
		' Response.CharSet = "utf-8"
		
		ViewerContainer.Controls.Add(ViewerControl)		
	End Sub
	
	Private Sub Template_UnLoad(ByVal Sender As Object, ByVal e As System.EventArgs) Handles Me.UnLoad
		
	End Sub
End Class
