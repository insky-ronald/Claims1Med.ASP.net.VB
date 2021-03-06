<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetClaimProcedures"
	End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)		
		
		If Cmd = "add-claim-procedure" or Cmd = "edit-claim-procedure" or Cmd = "delete-claim-procedure"
			Using Command = DBConnections("DBMedics").PrepareCommand("AddClaimDiagnosis")
				If Cmd = "add-claim-procedure"
					Command.SetParameter("id", 0)
					Command.SetParameter("claim_id", Request.Params("claim_id"))
					Command.SetParameter("service_id", Request.Params("service_id"))
					Command.SetParameter("diagnosis_group", Request.Params("diagnosis_code"))
					Command.SetParameter("diagnosis_code", Request.Params("code"))
					Command.SetParameter("type", "P")
					Command.SetParameter("action", 20)
				End if
				
				If Cmd = "edit-claim-procedure"
					Command.SetParameter("id", Request.Params("id"))
					Command.SetParameter("diagnosis_group", Request.Params("diagnosis_code"))
					Command.SetParameter("diagnosis_code", Request.Params("code"))
					Command.SetParameter("type", "P")
					Command.SetParameter("action", 10)
				End if
				
				If Cmd = "delete-claim-procedure"
					Command.SetParameter("id", Request.Params("id"))
					Command.SetParameter("type", "P")
					Command.SetParameter("action", 0)
				End if
				
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using
		End if
	End Sub
	
End Class