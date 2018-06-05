' *****************************************************************************************************
' Last modified on
' 9:57 PM Friday, October 6, 2017
' *****************************************************************************************************
<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetDocuments"
	End Function
		
	' Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		' MyBase.InitParams(Cmd, DataParams, DataValues)
		' If Cmd = "list"
			' DataParams.Add("visit_id")
			' DataValues.Add(Session("VisitorID"))
		' End if
	' End Sub
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "list"
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		End if
	End Sub
End Class