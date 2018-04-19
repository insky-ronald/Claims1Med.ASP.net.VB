REM ***************************************************************************************************
REM Last modified on
REM 1-MAR-2015
REM ***************************************************************************************************

REM This is inherited inside master-design-1.master
Public Class BaseMasterPage
    Inherits System.Web.UI.MasterPage

	Public CssName As String = ""
	Private Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		' If Session("ConnectionID") Is Nothing
			' Response.Clear
			' Response.Redirect("/login")
			' Response.End
		' End if
		
		CssName = String.Format("/loadcss/engine/css/no-access?pid={0}", Request.Params("pid"))
	End Sub
	
End Class
