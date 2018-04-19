<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SubDataHandler
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetNationalities"
	End Function
	
	Protected Overrides Function ReadDataSource As String
		Return "DBMedics.GetNationalities"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddNationalities"
	End Function 
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		Else If Cmd = "edit" or Cmd = "new"
			DataParams.Add("code")
			DataValues.Add(Request.Params("code"))
			'DataParams.Add("mode")
			'DataValues.Add(10)
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID")) 
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "list" 'and Request.Params("lookup") IsNot Nothing
			'Crud.AsBoolean("vide") = True
			Crud.AsBoolean("add") = True
			Crud.AsBoolean("edit") = True
			Crud.AsBoolean("delete") = True
		End If
	End Sub
End Class