REM ***************************************************************************************************
REM 16-SEP-2014 ihms.0.0.0.3
REM ***************************************************************************************************
Namespace Export
	Public Class Content
		Inherits System.Web.UI.MasterPage

		Public ContentPlaceHolder As Object
		Protected Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
			ContentPlaceHolder = Me.FindControl("ContentPlaceHolder1")
		End Sub
	End Class
End Namespace
