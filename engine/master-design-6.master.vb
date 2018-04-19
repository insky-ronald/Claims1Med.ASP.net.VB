REM ***************************************************************************************************
REM Last modified on
REM 13-OCT-2017
REM ***************************************************************************************************

REM This is inherited inside master-design-1.master
Public Class BaseMasterPage
    Inherits System.Web.UI.MasterPage

	Public IsLoggedIn As Boolean = False
	Public AuthKey As String = ""
	Public CssName As String = ""
	Public KeyID As String
	
	Private Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		IsLoggedIn = Session("ConnectionID") IsNot Nothing
		
		KeyID = Request.Params("keyid2")
		
		Dim passPhrase As String = AppUtils.Settings.AsString("EncryptionPassKey")
		Dim saltValue As String = AppUtils.Settings.AsString("EncryptionSaltValue")
		AuthKey = Encryption.Encrypt(Session("VisitorID").ToString, passPhrase, saltValue)
		
		HttpContext.Current.Response.AppendHeader("X-Authorization", AuthKey)
		
		Dim Path As String = Request.Params("path")
		If Path = "sys"
			Path = "engine"
		End if
		
		' Dim PageID As String = Request.Params("pid")
		' Dim SubID As String = Request.Params("keyid")
		' Dim Params As New EasyStringDictionary("")
		
		' Params.AsString("pid") = PageID
		' If Request.Params("keyid2") IsNot Nothing
			' SubID = Request.Params("keyid")
			' Params.AsString("keyid2") = Request.Params("keyid2")
		' Else If Request.Params("keyid") IsNot Nothing
			' Params.AsString("keyid") = Request.Params("keyid")
		' End if
		
		If IsLoggedIn
			' CssName = String.Format("/loadcss/{0}/css/main-{1}?{2}", Path, PageID, Params.Delimeted("&"))
			CssName = String.Format("/loadcss/{0}/css/{1}-{2}", Path, Request.Params("pid"), Request.Params("keyid"))
		End if
	End Sub
	
End Class
