Imports System

Public Class Template
    Inherits System.Web.UI.Page
	
	Protected ID As Integer
	Protected Action As String
	Protected Template As String = ""
	Protected DBData As System.Data.DataTable
	
	Private Sub Template_Init(ByVal Sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		ID = Request.Params("id")
		Action = Request.Params("action")
		If Request.Params("template") IsNot Nothing
			Template = Request.Params("template")
		End if
		
		Using DBService = DBConnections("DBMedics").OpenData("GetService", {"id","service_type","visit_id"}, {ID, "", Session("VisitorID")}, "")
			If Template <> "" and Template <> DBService.Rows(0).Item("document_type")
				' replace document type
			Else
				Template = DBService.Rows(0).Item("document_type")
			End if
			
			DBData = DBConnections("DBMedics").OpenData("GetTemplate_" & Template, {"claim_id","service_id","visit_id"}, {DBService.Eval("@claim_id"), DBService.Eval("@id"), Session("VisitorID")})
		End Using
	End Sub
	
	Private Sub Template_Load(ByVal Sender As Object, ByVal e As System.EventArgs) Handles Me.Load
		' Using DBService = DBConnections("DBMedics").OpenData("GetService", {"id","service_type","visit_id"}, {ID, "", Session("VisitorID")}, "")
			' If Template <> "" and Template <> DBService.Rows(0).Item("document_type")
				' replace document type
			' Else
				' Template = DBService.Rows(0).Item("document_type")
			' End if
		' End Using
		' Using DBGallery = DBConnections("DBAnp").OpenData("GetProjectGalleries", {"id", "mode", "visit_id"}, {Request.Params("parent_id"), 10, Session("VisitorID")}, "")
			' If DBGallery.Rows.Count > 0
				' GalleryName = DBGallery.Rows(0).Item("gallery")
			' Else
				' GalleryName = "No gallery to display"
			' End if
		' End Using			
	End Sub
	
	Private Sub Template_UnLoad(ByVal Sender As Object, ByVal e As System.EventArgs) Handles Me.UnLoad
		DBData.Dispose
	End Sub
End Class
