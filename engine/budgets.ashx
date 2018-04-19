<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SubDataHandler
	
	Protected Overrides Function ListDataSource As String
		If Request.Params("lookup") Is Nothing
			Return "DBMoney.GetBudgets"
		Else
			Return "DBMoney.GetAccountsLookup"
		End if
	End Function
	
	Protected Overrides Function ReadDataSource As String
		Return "DBMoney.GetBudget"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBMoney.AddBudget"
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
		Row.Item("owner_id") = Request.Params("owner_id")
		REM If Request.Params("year") Is Nothing
			Row.Item("year") = 2017
		REM Else
			REM Row.Item("year") = Request.Params("year")
		REM End
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