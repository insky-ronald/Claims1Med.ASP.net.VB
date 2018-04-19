REM ***************************************************************************************************
REM Last modified on
REM 28-FEB-2015
REM ***************************************************************************************************
Imports ActiveUp.Net.Common
REM Imports ActiveUp.Net.Mail
REM Imports ActiveUp.Net.Imap4

Partial Class Mail
	Inherits Api.BaseApi

	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		
		REM Dim imapClient As New Imap4Client()
		
		Output.AsString("TEST") = "OK"
		REM Context.Items("mode") = Cmd
		REM Server.Transfer(String.Format("/app/{0}_data.aspx", Request.Params("src")), True)
		REM Server.Transfer(String.Format("/app/{0}.aspx", Request.Params("src")), True)
	End Sub
	
End Class

