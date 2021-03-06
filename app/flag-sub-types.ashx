<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetFlagSubTypes"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddFlagSubTypes"
	End Function 
	
	' Protected Overrides Sub FetchUpdatedData(ByVal Row As System.Data.DataRow, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		' MyBase.FetchUpdatedData(Row, DataParams, DataValues)
		' DataParams.Add("flag_code")
		' DataValues.Add(Row.Item("flag_code"))
		' DataParams.Add("code")
		' DataValues.Add(Row.Item("code"))
	' End Sub
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"
			
		Else If Cmd = "edit"
			DataParams.Add("flag_code")
			DataValues.Add(Request.Params("flag_code"))
			DataParams.Add("code")
			DataValues.Add(Request.Params("code"))

		Else If Cmd = "new"
			DataParams.Add("flag_code")
			DataValues.Add(Request.Params("flag_code"))
			DataParams.Add("code")
			DataValues.Add(Request.Params("code"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		Row.Item("flag_code") = Request.Params("flag_code")
		Row.Item("is_active") = true
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "edit"
			Crud.AsBoolean("add") = True
			Crud.AsBoolean("edit") = True
			Crud.AsBoolean("delete") = True
		Else If Cmd = "list"
			Crud.AsBoolean("add") = True
			Crud.AsBoolean("edit") = True
			Crud.AsBoolean("delete") = True
		End if
	End Sub
End Class