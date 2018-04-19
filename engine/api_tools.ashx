<%@ WebHandler Language="VB" Class="Api" %>

Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
	
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)
		
		If Cmd = "session"
		
			Output.DataType("Status", "NUMERIC")
			Output.DataType("UserNo", "NUMERIC")
			Output.DataType("UserType", "NUMERIC")
			Output.DataType("OrganisationID", "NUMERIC")
			Output.DataType("ApplicationID", "NUMERIC")
			Output.DataType("VisitorID", "NUMERIC")
			Output.DataType("Locked", "NUMERIC")
			Output.DataType("Roles", "JSON")

			Output.AsString("Status") = 0

			If Session("ConnectionID") IsNot Nothing
				REM Dim passPhrase As String = ConfigurationSettings.AppSettings("EncryptionPassKey")
				REM Dim saltValue As String = ConfigurationSettings.AppSettings("EncryptionSaltValue")
				Dim passPhrase As String = AppUtils.Settings.AsString("EncryptionPassKey")
				Dim saltValue As String = AppUtils.Settings.AsString("EncryptionSaltValue")
				
				Output.AsString("SessionID") = Session.SessionID.ToUpper
				Output.AsString("SessionKey") = Encryption.Encrypt(Session("VisitorID").ToString, passPhrase, saltValue)
				Output.AsString("VisitorID") = Session("VisitorID")
				Output.AsString("ApplicationID") = Session("ApplicationID")
				Output.AsString("UserNo") = Session("UserNo").ToString
				Output.AsString("UserID") = Session("UserID").ToString
				Output.AsString("UserName") = Session("UserName").ToString
				Output.AsString("UserType") = Session("UserType").ToString
				Output.AsString("OrganisationID") = Session("OrganisationID").ToString
				Output.AsString("Roles") = Session("Roles").ToString
				REM Output.AsString("Role") = Session("Role").ToString
				Output.AsString("Locked") = Session("Locked")				
				Output.AsString("Home") = Session("Home")				
			Else
				Output.AsString("Status") = -1
				Output.AsString("Message") = "NOT LOGGED IN"
				Output.AsString("VisitorID") = Session("VisitorID")
				Output.AsString("ApplicationID") = Session("ApplicationID")
				If Session("Logout") IsNot Nothing
					Output.AsString("Message") = "LOGGED OUT NORMALY"
				End if
			End if
			
		Else If Cmd = "dbinit"
		
			Output.Clear
			If Request.Params("name") Is Nothing
				Output.Append(DatabaseUtils.InitializeConnection())
			Else
				Output.Append(DatabaseUtils.InitializeConnection(Request.Params("name").ToString))
			End if
			
		Else If Cmd = "appinit"

			Output.Clear
			AppUtils.InitializeAppUtils(Me)
			Response.Write(AppUtils.Databases.JsonString(True))
			Response.Write(AppUtils.Styles.JsonString(True))
			Response.Write(AppUtils.ScriptLibraries.JsonString(True))
			Response.Write(AppUtils.Settings.JsonString(True))
			Response.Write(AppUtils.Paths.JsonString(True))
			Response.End
			
		Else If Cmd = "kill-session"
		
			Session.Abandon
			Session.Clear
			Session("VisitorID") = DatabaseUtils.NewVisitor()
			Session("ApplicationID") = AppUtils.Settings.AsInteger("ApplicationID")

			Output.AsString("Message") = "session killed"
			Output.AsString("SessionID") = Session.SessionID.ToUpper
			Output.AsInteger("VisitorID") = Session("VisitorID")
			Output.AsInteger("ApplicationID") = Session("ApplicationID")
			
		Else If Cmd = "test"
				
			For Each C in DBConnections.Values
				Dim CodeFile As String = AppUtils.Databases.AsString(C.Name + "CodeFile")
				Output.AsString(C.Name) = AppUtils.Databases.AsString(CodeFile)
				REM Output.AsString(C.Name) = CodeFile
			Next
			
		End if
	End Sub
	
End Class
