<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetMemberFamily"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		' If Cmd = "list"
			' DataParams.Add("certificate_id")
			' DataValues.Add(Request.Params("certificate_id"))
		' End if
	End Sub
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		DatabaseUtils.GetActionPermission("member", Crud)
		' Crud.AsBoolean("edit") = False
		' Crud.AsBoolean("delete") = False
	End Sub
End Class