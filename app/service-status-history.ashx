<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetServiceStatusHistory"
	End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		
		If Cmd = "change-service-status"
			Using Command = DBConnections("DBMedics").PrepareCommand("ChangeServiceStatus")
				Command.SetParameter("id", Request.Params("id"))
				Command.SetParameter("status_code", Request.Params("status_code"))
				Command.SetParameter("sub_status_code", Request.Params("sub_status_code"))
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using			
		End if
		
		If Cmd = "inv-post"
			Using Command = DBConnections("DBMedics").PrepareCommand("ChangeServiceStatus")
				Command.SetParameter("id", Request.Params("id"))
				Command.SetParameter("status_code", "E")
				Command.SetParameter("sub_status_code", "E01")
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value.ToString.Replace("""", "'")
			End Using
		End if
		
		' If Cmd = "send-to-outbox"
		If Cmd = "gop-post"
			Using Command = DBConnections("DBMedics").PrepareCommand("ChangeServiceStatus")
				Command.SetParameter("id", Request.Params("id"))
				Command.SetParameter("status_code", "S")
				Command.SetParameter("sub_status_code", "S01")
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using
		End if
		
		If Cmd = "gop-supercede"
			Using Command = DBConnections("DBMedics").PrepareCommand("SupercedeGop")
				Command.SetParameter("id", Request.Params("id"))
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("id") = Command.GetParameter("new_id").Value
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using
		End if

		If Cmd = "gop-awaiting-invoice"
			Using Command = DBConnections("DBMedics").PrepareCommand("ChangeServiceStatus")
				Command.SetParameter("id", Request.Params("id"))
				Command.SetParameter("status_code", "S")
				Command.SetParameter("sub_status_code", "S08")
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using
		End if
		
		If Cmd = "invoice-received"
			Using Command = DBConnections("DBMedics").PrepareCommand("InvoiceReceived")
				Command.SetParameter("id", Request.Params("id"))
				Command.SetParameter("service_sub_type", Request.Params("type"))
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("id") = Command.GetParameter("new_id").Value
				Output.AsString("service_no") = Command.GetParameter("service_no").Value
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using
		End if
		
	End Sub
End Class