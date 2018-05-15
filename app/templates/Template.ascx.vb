Public Class Template
    Inherits System.Web.UI.UserControl

	Protected ID As Integer
	Protected Action As String
	Protected Template As String = ""
	Protected DBData As System.Data.DataTable
	Protected Row As System.Data.DataRow
	
	Protected Sub Control_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		ID = Request.Params("id")
		Action = Request.Params("action")
		If Request.Params("template") IsNot Nothing
			Template = Request.Params("template")
		End if
		
		Using DBService = DBConnections("DBMedics").OpenData("GetService", {"id","service_type","visit_id"}, {ID, "", Session("VisitorID")}, "")
			If Template <> "" and Template <> DBService.Rows(0).Item("document_type").ToString
				' replace document type
			Else
				Template = DBService.Rows(0).Item("document_type")
			End if
			
			Template = "GOP_GM01"
			
			DBData = DBConnections("DBMedics").OpenData("GetTemplate_" & Template, {"claim_id","service_id","visit_id"}, {DBService.Eval("@claim_id"), DBService.Eval("@id"), Session("VisitorID")})
			' DBData = DBConnections("DBMedics").OpenData("GetTemplate_GOP_GM01" & Template, {"claim_id","service_id","visit_id"}, {DBService.Eval("@claim_id"), DBService.Eval("@id"), Session("VisitorID")})
			Row = DBData.Rows(0)
		End Using
	End Sub
	
	Protected Sub Control_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
	End Sub
	
	Private Sub Control_Unload(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Unload
		DBData.Dispose
	End Sub

End Class