<%@ WebHandler Language="VB" Class="Api" %>

Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
	
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)
		
		If Cmd = "info"
			Output.AsJson("ApplicationID") = Session("ApplicationID")
			Output.AsString("EngineVersion") = AppUtils.Settings.AsString("EngineVersion")
			Output.AsString("EncryptionPassKey") = AppUtils.Settings.AsString("EncryptionPassKey")
			Output.AsString("EncryptionSaltValue") = AppUtils.Settings.AsString("EncryptionSaltValue")
			Output.AsString("LoginUrl") = AppUtils.Settings.AsString("LoginUrl")
			
			For Each C in DBConnections.Values
				Dim CodeFile As String = AppUtils.Databases.AsString(C.Name + "CodeFile")
				Output.AsString(C.Name) = AppUtils.Databases.AsString(CodeFile)
				REM Output.AsString(C.Name) = CodeFile
			Next
			
		End if
	End Sub
	
End Class
