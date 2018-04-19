<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SubDataHandler
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetAddressTypes"
	End Function
	
	Protected Overrides Function ReadDataSource As String
		Return "DBMedics.GetAddressTypes"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddAddressTypes"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		Else If Cmd = "edit" or Cmd = "new"
			DataParams.Add("code")
			DataValues.Add(Request.Params("code"))
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID")) 
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "list" and Request.Params("lookup") Is Nothing
			'Crud.AsBoolean("vide") = True
			Crud.AsBoolean("add") = true
			Crud.AsBoolean("edit") = true
			Crud.AsBoolean("delete") = true
		End If
	End Sub
End Class