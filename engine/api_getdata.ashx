<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class BaseDataHandler
	Inherits DataHandler.BaseHandler
	
	Protected Overrides Sub InitHandler(ByVal Context As HttpContext)
		MyBase.InitHandler(Context)
		Response.Clear
		Response.ContentType = "application/json; charset=utf-8"
		
		Dim Output As New EasyStringDictionary("")
		Output.AsJson("status") = 0
		Output.AsString("message") = ""
		
		ProcessOutput(Request.Params("cmd").ToLower, Output)
			
		Response.Write(Output.JsonString(False))
		Response.End()
	End Sub

	Protected Overridable Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
	End Sub
	
End Class

REM replaces api_getdata.aspx
REM the Server.Transfet should not be used, call directly
Public Class DataProvider
	REM Inherits DataHandler.BaseHandler
	Inherits BaseDataHandler
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		
		Context.Items("mode") = Cmd
		
		REM called by sub pages (POST)
		REM http://applications-dev.insky-inc.com/api/getdata/info
		REM http://applications-dev.insky-inc.com/api/getdata/list
		REM http://applications-dev.insky-inc.com/api/getdata/edit
		
		REM http://applications-dev.insky-inc.com/get/list/clients

		REM in web.config
		REM <rule name="Api Get Data (call by sub pages)" stopProcessing="true"> 
			REM <match url="([_0-9a-z-]+)/([_0-9a-z-]+)/([_0-9a-z-]+)" />
			REM <conditions logicalGrouping="MatchAll">
				REM <add input="{R:1}" pattern="^api$" />
				REM <add input="{R:2}" pattern="^getdata$" />
			REM </conditions>
			REM <action type="Rewrite" url="engine/api_{R:2}.ashx?cmd={R:3}" appendQueryString="true" />
		REM </rule>
		
		If Request.Params("src") = "clients"
			Context.Server.Transfer(String.Format("/app/{0}.ashx", Request.Params("src")), True)
		Else
			Context.Server.Transfer(String.Format("/app/{0}.aspx", Request.Params("src")), True)
		End if
	End Sub
	
End Class
