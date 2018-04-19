<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetServiceTypes"
	End Function
	
	' Protected Overrides Function ReadDataSource As String
		' Return "DBMedics.GetServiceStatusCodes"
	' End Function

	' Protected Overrides Function UpdateDataSource As String
		' Return "DBMedics.AddClaimTypes"
	' End Function 
	
	' Protected Overrides Sub FetchUpdatedData(ByVal Row As System.Data.DataRow, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		' MyBase.FetchUpdatedData(Row, DataParams, DataValues)
		' DataParams.Add("code")
		' DataValues.Add(Row.Item("code"))
	' End Sub
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"

		Else If Cmd = "edit"
			DataParams.Add("code")
			DataValues.Add(Request.Params("code"))

		Else If Cmd = "new"
			DataParams.Add("code")
			DataValues.Add(Request.Params("code"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "edit"
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		Else If Cmd = "list"
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		End if
	End Sub
End Class