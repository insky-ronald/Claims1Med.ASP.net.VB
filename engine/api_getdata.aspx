<%@ Page Title="" Language="VB" EnableSessionState="readonly" AutoEventWireup="false" Inherits="Api.BaseApi" %>
<script runat=server>
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		
		Context.Items("mode") = Cmd
		
		REM called by sub pages (POST)
		REM http://applications-dev.insky-inc.com/api/getdata/info
		REM http://applications-dev.insky-inc.com/api/getdata/list
		REM http://applications-dev.insky-inc.com/api/getdata/edit

		REM in web.config
		REM <rule name="Api Calls (System Level)" stopProcessing="true"> 
			REM <match url="([_0-9a-z-]+)/([_0-9a-z-]+)/([_0-9a-z-]+)" />
			REM <conditions logicalGrouping="MatchAll">
				REM <add input="{R:1}" pattern="^api$" />
			REM </conditions>
			REM <action type="Rewrite" url="engine/api_{R:2}.aspx?cmd={R:3}" appendQueryString="true" />
		REM </rule>
		
		Server.Transfer(String.Format("/app/{0}.aspx", Request.Params("src")), True)
	End Sub
</script>
