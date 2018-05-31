<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetServiceActions"
	End Function
	
	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddServiceAction"
	End Function
	
	Protected Overrides Function UpdateResultFields As String
		Return "id"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "edit" 'or Cmd = "new"
			DataParams.Add("id")
			DataValues.Add(Request.Params("id"))
		End if
	End Sub
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		
		If Cmd = "complete"
			Using Command = DBConnections("DBMedics").PrepareCommand("AddServiceAction")
				Command.SetParameter("id", Request.Params("id"))
				Command.SetParameter("action", 100)
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using			
		End if
		
		If Cmd = "change-owner"
			Using Command = DBConnections("DBMedics").PrepareCommand("AddServiceAction")
				Command.SetParameter("id", Request.Params("id"))
				Command.SetParameter("action_owner", Request.Params("user_name"))
				Command.SetParameter("notes", Request.Params("notes"))
				Command.SetParameter("action", 101)
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using			
		End if
	End Sub
End Class