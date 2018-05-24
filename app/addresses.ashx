<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetAddress"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddAddress"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "edit"
			DataParams.Add("id")
			DataValues.Add(Request.Params("id"))
			' DataParams.Add("name_id")
			' DataValues.Add(Request.Params("name_id"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		Row.Item("name_id") = Request.Params("name_id")
		REM Row.Item("country") = ""
		REM Row.Item("currency") = ""
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Request.Params("action") IsNot Nothing
			Crud.AsString("action") = Request.Params("action")
			DatabaseUtils.GetActionPermission(Request.Params("action"), Crud)
		Else
			Crud.AsBoolean("add") = True
			Crud.AsBoolean("edit") = True
			Crud.AsBoolean("delete") = True
		End if
	End Sub
End Class