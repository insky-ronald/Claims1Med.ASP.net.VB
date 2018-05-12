<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SavedQueryProvider

	Protected Overrides Function ReportTypeID As Integer
		Return 1004
	End Function
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetTaskManager"
	End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "list"
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		End If
	End Sub
End Class

' Public Class DataProvider
	' Inherits DataHandler.SubDataHandler
	
	' Protected Overrides Function ListDataSource As String
		' Return "DBMedics.GetTaskManager"
	' End Function
		
	' Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		' MyBase.InitParams(Cmd, DataParams, DataValues)
		' If Cmd = "list"
			' DataParams.Add("visit_id")
			' DataValues.Add(Session("VisitorID"))
		' End if
	' End Sub
	
	' Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		' MyBase.ProcessOutput(Cmd, Output)
		' If Cmd = "list"
			' Crud.AsBoolean("add") = False
			' Crud.AsBoolean("edit") = False
			' Crud.AsBoolean("delete") = False
		' End if
	' End Sub
' End Class