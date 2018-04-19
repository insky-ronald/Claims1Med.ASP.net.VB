<%@ WebHandler Language="VB" Class="Api" %>

Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
	
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)
		
		If Cmd = "temp" 'download temporary files
			Dim Path As String = AppUtils.Paths.AsString("UploadPath")
			Dim FileName As String =  String.Format("{0}\{1}", Path, Request.Params("file"))
			
			Response.AppendHeader("content-disposition", "attachment; filename=" + Request.Params("name"))
			Response.TransmitFile(FileName)
		End if
	End Sub
	
End Class
