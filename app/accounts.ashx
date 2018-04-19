<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SubDataHandler
	
	Protected Overrides Function ListDataSource As String
		If Request.Params("lookup") Is Nothing
			Return "DBMoney.GetAccounts"
		Else
			Return "DBMoney.GetAccountsLookup"
		End if
	End Function
	
	Protected Overrides Function ReadDataSource As String
		Return "DBMoney.GetAccount"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBMoney.AddAccount"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		Else If Cmd = "edit"
			DataParams.Add("id")
			DataParams.Add("visit_id")
			DataValues.Add(Request.Params("id"))
			DataValues.Add(Session("VisitorID"))
		Else If Cmd = "new"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		Row.Item("owner_id") = 1
		Row.Item("type") = 1
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "edit"
			Crud.AsBoolean("add") = True
			Crud.AsBoolean("edit") = True
			Crud.AsBoolean("delete") = True
		Else If Cmd = "list"
			If Request.Params("lookup") Is Nothing
				Crud.AsBoolean("add") = True
				Crud.AsBoolean("edit") = True
				Crud.AsBoolean("delete") = True
			Else
				Crud.AsBoolean("add") = False
				Crud.AsBoolean("edit") = False
				Crud.AsBoolean("delete") = False
			End if
		End if
	End Sub
End Class