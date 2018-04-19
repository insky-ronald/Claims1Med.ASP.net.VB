<%@ Page Title="" Language="VB"%>
<script runat=server>
	Private Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
		Response.Clear
		If Request.Headers("Accept-Encoding").Contains("gzip")
			Response.Filter = new System.IO.Compression.GZipStream(Response.Filter, System.IO.Compression.CompressionMode.Compress)
			Response.Headers.Remove("Content-Encoding")
			Response.AppendHeader("Content-Encoding", "gzip")
		End if

		Dim Resource As Saas.Controls.PreProcessor
		Dim PID As String = Request.Params("pid").ToLower
		Dim Path As String = Request.Params("path").ToLower
		REM Dim IsNav As Boolean = (Path = "nav")
		
		If (Path = "nav")
			Path = "app"
			PID = "nav_" & PID
		End if
		
		If Path = "sub"
			Path = "app"
		End if
		
		If Request.Params("res") = "css"
			Resource = New Saas.Controls.Css.CssBuilder
			Response.ContentType = "text/css"
			
			REM if the .csst file is not found, open the .css file instead
			If System.IO.File.Exists(Resource.SourceFileName("css", PID, Path))
				Resource.Include(String.Concat(Path, ".", PID, "="))
			Else
				Resource.Include(String.Concat(Path, ".", PID))
			End if
			
		Else If Request.Params("res") = "script"
			Resource = New Saas.Controls.Scripts.ScriptBuilder
			Response.ContentType = "application/x-javascript"
			
			REM if the .jst file is not found, open the .js file instead
			If System.IO.File.Exists(Resource.SourceFileName("script", PID, Path))
				Dim Params As String = String.Concat(Path, ".", PID)
				Resource.Include(String.Concat(Path, ".", PID))
			Else
				Resource.IncludeFile(Path +"\"+ PID)
			End if
		End if
			
		Dim Modified As Integer = 1
		Dim ModifiedSince As DateTime
		If ConfigurationSettings.AppSettings("CacheCssJS").ToString = "1"
			If Request.Headers("If-Modified-Since") IsNot Nothing
				If DateTime.TryParse(Request.Headers("If-Modified-Since"), ModifiedSince)
					Modified = DateTime.Compare(Resource.ModifiedDate, ModifiedSince)
				End if
			End if
		End if

		If Modified > 0
			If ConfigurationSettings.AppSettings("CacheCssJS").ToString = "1"
				Response.Cache.SetLastModified(Resource.ModifiedDate)
			End if
			REM Response.Write("/*" & Resource.SourceFileName("script", PID, Path) & "*/")
			REM Response.Write("/*" & "XXX" & "*/")
			Response.Write(Resource.GetContent())
		Else
			Response.StatusCode = 304
			Response.SuppressContent = True
		End if
		
		Response.End()
	End Sub
</script>