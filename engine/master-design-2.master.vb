REM ***************************************************************************************************
REM Last modified on
REM 1-MAR-2015
REM ***************************************************************************************************

REM This is inherited inside master-design-1.master
Public Class BaseMasterPage
    Inherits System.Web.UI.MasterPage

	Public IsLoggedIn As Boolean = False
	Public DataCallback As String = ""
	Public CssName As String = ""
	Public ScriptName As String = ""
	Public AuthKey As String = "..."
	Public Libraries As List(Of String)
	
	Private Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		IsLoggedIn = Session("ConnectionID") IsNot Nothing
		
		REM If Not IsLoggedIn
			REM Response.Clear
			REM Response.Redirect("/login")
			REM Response.End
		REM End if
		
		REM If ConfigurationSettings.AppSettings("EncryptionPassKey") IsNot Nothing
			REM Dim passPhrase As String = ConfigurationSettings.AppSettings("EncryptionPassKey")
			REM Dim saltValue As String = ConfigurationSettings.AppSettings("EncryptionSaltValue")
			Dim passPhrase As String = AppUtils.Settings.AsString("EncryptionPassKey")
			Dim saltValue As String = AppUtils.Settings.AsString("EncryptionSaltValue")
			AuthKey = Encryption.Encrypt(Session("VisitorID").ToString, passPhrase, saltValue)
			
			HttpContext.Current.Response.AppendHeader("X-Authorization", AuthKey)
		REM End if

		REM DataCallback = "callback/" & Request.Params("pid")
		REM If Request.Params("keyid") IsNot Nothing
			REM DataCallback += "/" & Request.Params("keyid")
		REM End if

		REM If Request.Params("keyid") IsNot Nothing
			REM DataCallback2 = String.Format("/nav/{0}/{1}/callback", Request.Params("pid"), Request.Params("keyid"))
		REM Else
			REM DataCallback2 = String.Format("/nav/{0}/callback", Request.Params("pid"))
		REM End if
		
		Dim Path As String = Request.Params("path")
		If Path = "sys"
			Path = "engine"
		End if
		
		Dim PageID As String = Request.Params("pid")
		Dim Params As New EasyStringDictionary("")
		Params.AsString("pid") = PageID
		
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
		
		If IsLoggedIn
			CssName = String.Format("/loadcss/{0}/css/main-{1}?{2}", Path, PageID, Params.Delimeted("&"))
			ScriptName = String.Format("/loadscript/{0}/scripts/main-{1}?{2}", Path, PageID, Params.Delimeted("&"))
			' TinyMCE = "/engine/scripts/tinymce/tinymce.min.js"
		End if
		
		Libraries = AppUtils.ScriptLibraries.AsString(PageID).Split(",").ToList
	End Sub
	
End Class
