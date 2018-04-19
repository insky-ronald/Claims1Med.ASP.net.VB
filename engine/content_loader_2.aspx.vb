REM ***************************************************************************************************
REM Last modified on
REM 11-JAN-2016
REM ***************************************************************************************************

REM This is inherited inside content_loader.aspx
Public Class Content
    Inherits System.Web.UI.Page
	
	Private Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		If ConfigurationSettings.AppSettings("EncryptionPassKey") IsNot Nothing
			Dim passPhrase As String = ConfigurationSettings.AppSettings("EncryptionPassKey")
			Dim saltValue As String = ConfigurationSettings.AppSettings("EncryptionSaltValue")
			CType(Master, Object).AuthKey = Encryption.Encrypt(Session("VisitorID").ToString, passPhrase, saltValue)
		End if
		
		CType(Master, Object).CssName = String.Format("/loadcss/app/{0}/css?pid={0}", Request.Params("pid"))
		CType(Master, Object).jQuery = "/loadscript/engine/scripts/jquery"
		CType(Master, Object).ScriptName = String.Format("/loadscript/app/{0}/script?pid={0}", Request.Params("pid"))
	End Sub

End Class

