REM ***************************************************************************************************
REM Last modified on
REM 13-FEB-2015 1.0.0.6
REM ***************************************************************************************************
Public Class Login
    Inherits System.Web.UI.MasterPage

	REM Public Action As String
	REM Public Referer As String = ""
	Public Property Lock As Boolean
	Public Property Timeout As Boolean
	Public Property Logout As Boolean
	Public Property Referer As String = ""
	REM Public FormWidth As String
	
	Private Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		Lock = Request.Params("mode") = "lock"
		Timeout = Request.Params("mode") = "timeout"
		Logout = Request.Params("mode") = "logout"
		Referer = HttpContext.Current.Request.RawUrl
		REM If Lock
			REM Session("Locked") = 1
			REM Action = "/api/system/login?mode=" & Request.Params("mode")
		REM Else If Session("UserID") Is Nothing
			REM Action = "/api/system/login?mode=" & Request.Params("mode")
		REM Else
			REM Action = "/api/system/logout"
		REM End if
		
		REM Action = "/nav/login/callback"
		REM Action = "/api/tools/login"
		REM Dim Referer As String = ""
		
		REM If HttpContext.Current.Request.ServerVariables("HTTP_REFERER") IsNot Nothing
			REM Referer = HttpContext.Current.Request.ServerVariables("HTTP_REFERER")
			REM Dim Parts As String() = Referer.Split("?")
			REM Referer = Parts(1)
		REM End if
		
		REM Return
		REM If Request.UrlReferrer IsNot Nothing
			REM If Request.UrlReferrer.Segments.Count > 1
				REM Referer = Request.UrlReferrer.Segments(0) & Request.UrlReferrer.Segments(1)
				REM Referer = Request.UrlReferrer.Segments(0) & Request.UrlReferrer.Segments(1) & Request.UrlReferrer.Segments(2)
				REM Referer = String.Join("", Request.UrlReferrer.Segments)
				REM If Request.UrlReferrer.Query.Count > 1
					REM Referer = String.Concat(Referer, "?", HttpUtility.ParseQueryString(Request.UrlReferrer.Query))
				REM End if
			REM End if
		REM End if
		
		REM If Referer = ""
			REM Action = "/api/session/login"
		REM Else
			REM Action = "/api/session/login"
		REM End if
		
		REM Lock = Request.Params("lock") IsNot Nothing
		REM If Request.Params("embed") Is Nothing
			REM FormWidth = "400px"
		REM Else
			REM FormWidth = "100%"
		REM End if
	End Sub
	
	Protected Sub Login_Init(ByVal Sender As Object, ByVal e As System.EventArgs) Handles LoginForm.Init
		REM If Request.UrlReferrer IsNot Nothing
			REM If Request.UrlReferrer.Segments.Count > 1
				REM Sender.Referer = String.Join("", Request.UrlReferrer.Segments)
				REM If Request.UrlReferrer.Query.Count > 1
					REM Sender.Referer = String.Concat(Sender.Referer, "?", HttpUtility.ParseQueryString(Request.UrlReferrer.Query))
				REM End if
			REM End if
		REM End if
		
		REM Sender.Action = "/api/session/login"
		REM If Referer = ""
			REM Sender.Action = "/api/session/login"
		REM Else
			REM Sender.Action = "/api/session/login"
		REM End if
	End Sub

End Class

