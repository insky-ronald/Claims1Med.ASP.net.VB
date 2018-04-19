REM ***************************************************************************************************
REM Last modified on
REM 11-MAR-2017
REM ***************************************************************************************************

REM This is inherited inside master-design-1.master
Public Class BaseMasterPage
    Inherits System.Web.UI.MasterPage

	Public DataCallback As String = ""
	Public CssName As String = ""
	Public ScriptName As String = ""
	Public jQuery As String = ""
	Public AuthKey As String = "..."
	REM Public TinyMCE As String = "..."
	Public Libraries As List(Of String)
	
	Private Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
	
		If Session("ConnectionID") Is Nothing
			Response.Clear
			Response.Redirect("/login")
			Response.End
		End if
		
		REM If ConfigurationSettings.AppSettings("EncryptionPassKey") IsNot Nothing
			REM Dim passPhrase As String = ConfigurationSettings.AppSettings("EncryptionPassKey")
			REM Dim saltValue As String = ConfigurationSettings.AppSettings("EncryptionSaltValue")
			Dim passPhrase As String = AppUtils.Settings.AsString("EncryptionPassKey")
			Dim saltValue As String = AppUtils.Settings.AsString("EncryptionSaltValue")
			AuthKey = Encryption.Encrypt(Session("VisitorID").ToString, passPhrase, saltValue)
		REM End if
		
		Dim Path As String = "engine"
		
		REM Dim PageID As String = Request.Params("pid")
		Dim PageID As String = "dbm"
		Dim Params As New EasyStringDictionary("")
		
		REM Params.AsString("pid") = PageID
		Params.AsString("pid") = Request.Params("pid")
		
		If Request.Params("keyid2") IsNot Nothing
			Params.AsString("keyid") = Request.Params("keyid")
			Params.AsString("keyid2") = Request.Params("keyid2")
			DataCallback = String.Format("/{0}/callback/{1}/{2}/{3}", Path, PageID, Request.Params("keyid"), Request.Params("keyid2"))
		Else If Request.Params("keyid") IsNot Nothing
			Params.AsString("keyid") = Request.Params("keyid")
			DataCallback = String.Format("/{0}/callback/{1}/{2}", Path, PageID, Request.Params("keyid"))
		Else
			DataCallback = String.Format("/{0}/callback/{1}", Path, PageID)
		End if
		
		CssName = String.Format("/loadcss/{0}/css/main-{1}?{2}", Path, PageID, Params.Delimeted("&"))
		ScriptName = String.Format("/loadscript/{0}/scripts/main-{1}?{2}", Path, PageID, Params.Delimeted("&"))
		
		REM TinyMCE = "/engine/scripts/tinymce/tinymce.min.js"
		
		Libraries = AppUtils.ScriptLibraries.AsString(PageID).Split(",").ToList
		
	End Sub
	
End Class
