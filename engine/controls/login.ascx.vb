Public Class Login
    Inherits System.Web.UI.UserControl
	
	Public Property Action As String = ""
	Public Property Referer As String = ""
	
	Protected Sub Control_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		REM If Request.UrlReferrer IsNot Nothing
			REM If Request.UrlReferrer.Segments.Count > 1
				REM Referer = String.Join("", Request.UrlReferrer.Segments)
				REM If Request.UrlReferrer.Query.Count > 1
					REM Referer = String.Concat(Referer, "?", HttpUtility.ParseQueryString(Request.UrlReferrer.Query))
				REM End if
			REM End if
		REM End if
		
		Referer = HttpContext.Current.Request.RawUrl
		Action = "/api/session/login"
	End Sub

End Class