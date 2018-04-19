REM ***************************************************************************************************
REM Last modified on
REM 06-JAN-2015
REM ***************************************************************************************************

REM This is inherited inside content_loader.aspx
Public Class Content
    Inherits System.Web.UI.Page
	
	Private Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		REM If ConfigurationSettings.AppSettings("EncryptionPassKey") IsNot Nothing
			REM Dim passPhrase As String = ConfigurationSettings.AppSettings("EncryptionPassKey")
			REM Dim saltValue As String = ConfigurationSettings.AppSettings("EncryptionSaltValue")
			REM CType(Master, Object).AuthKey = Encryption.Encrypt(Session("VisitorID").ToString, passPhrase, saltValue)
		REM End if
		REM CType(Master, Object).CssName = String.Concat("/nav/", Request.Params("pid"), "/css")
		REM CType(Master, Object).ScriptName = String.Concat("/nav/", Request.Params("pid"), "/script")
	End Sub
End Class

