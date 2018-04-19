Public Class SessionInfo
    Inherits System.Web.UI.UserControl
	
	REM Public ShowLocation As Boolean = True
	REM Public MenuID As String = "main-menu"
	
	Protected Overrides Sub OnLoad(ByVal e As EventArgs)
		MyBase.OnLoad(e)
		REM Dim PageUrl As String = Request.ServerVariables("URL").Replace("/", "")
		REM Dim PageID As String = PageUrl.Replace(".aspx", "")
		
		REM ShowLocation = PageID <> "index"
	End Sub
End Class