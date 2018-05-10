<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	' Inherits DataHandler.SubDataHandler
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetBanks"
	End Function
	
	' Protected Overrides Function ReadDataSource As String
		' Return "DBMedics.GetBanks"
	' End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddBanks"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		' If Cmd = "list"
			' DataParams.Add("visit_id")
			' DataValues.Add(Session("VisitorID"))
		' Else 
		If Cmd = "edit"
			DataParams.Add("id")
			DataValues.Add(Request.Params("id"))

			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		' Else If Cmd = "new"
			' DataParams.Add("visit_id")
			' DataValues.Add(Session("VisitorID"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		Row.Item("name_id") = Request.Params("name_id")
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "list"
			Crud.AsBoolean("add") = True
			Crud.AsBoolean("edit") = True
			Crud.AsBoolean("delete") = True
		Else If Cmd = "edit"
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		Else If Cmd = "update"
			REM Output.AsJson("status") = 100
			REM Output.AsString("message") = "Test error"
		Else If Cmd = "delete"
			REM UpdateData = New UpdateDataRecord(UpdateDataSource(), UpdateEncodedFields(), UpdateResultFields(), VisitorID)
			REM Dim UpdateData As New ServerUpdate.UpdateDataRecord(UpdateDataSource(), UpdateEncodedFields(), UpdateResultFields(), Session("VisitorID"))
			REM AddHandler UpdateData.AfterUpdate, AddressOf AfterUpdate
			
			REM UpdateData.Update(Request.Params("data"), Request.Params("mode"), Output)			
		End if
	End Sub
End Class