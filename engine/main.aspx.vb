REM ***************************************************************************************************
REM Last modified on
REM 3-MAR-2017
REM ***************************************************************************************************

REM This is inherited inside content_loader.aspx
Public Class Content
    Inherits System.Web.UI.Page
	
	Private Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
		MasterPageFile = "navigator-page.master"
	End Sub

End Class

