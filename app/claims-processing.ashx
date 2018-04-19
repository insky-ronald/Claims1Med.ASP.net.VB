<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SubDataHandler
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "info"
			REM Output.AsString("module") = Request.Params("module")
			REM Rights.AsBoolean("add") = False
			REM Rights.AsBoolean("edit") = False
			REM Rights.AsBoolean("delete") = False
			
			REM Output.AsJson("rights") = Rights.JsonString()
		End if
	End Sub
End Class