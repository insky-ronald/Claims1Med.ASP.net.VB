<%@ WebHandler Language="VB" Class="Api" %>

Public Class Loader
	
	Public Event Output(ByVal OutputText As String)
	Public Event OutputFile(ByVal FileName As String)
		
	Public Function HasToken(ByVAl S As String, ByVal Token As String, ByVal Optional Full As Boolean = True) As Boolean
		If Full
			Return S = Token
		Else If S.Length >= Token.Length 
			Return S.Substring(0, Token.Length) = Token
		Else
			Return False
		End if
	End Function
	
	Public Function ParseFiles(ByVal TargetFileName As String, ByVal ModifiedSince As DateTime) As Boolean
		Dim ModifiedDate As DateTime
		
		Using oRead As System.IO.StreamReader = System.IO.File.OpenText(TargetFileName)		
			Do While oRead.Peek() >= 0
				Dim S As String = oRead.ReadLine().Trim
				If S <> String.Empty
					If S.Substring(0, 2) <> "//"
						If HasToken(S, "##include", False)
							' ##include=jquery-2.1.4.min.js
							' ##include=engine\utils
							' ##include=app\utils
							
							Dim Name As String = "X"
							Dim Parts As String() = S.Split("=")
							Dim NameParts As String() = Parts(1).Split("\")
							
							If NameParts(0) = "engine" or NameParts(0) = "app"
								Name = NameParts(0) &"\scripts\" & NameParts(1)
							Else
								Name = "\scripts\" & Parts(1)
							End if
							
							Dim Ext As String = System.IO.Path.GetExtension(Name)
							If Ext = ""
								Name = Name & ".js"
							End if
							
							Dim FileName As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name))
							
							If System.IO.File.Exists(FileName) Then
								Dim TimeStamp As DateTime = System.IO.File.GetLastWriteTime(Filename)
								TimeStamp = TimeStamp.AddTicks(-(TimeStamp.Ticks mod TimeSpan.TicksPerSecond))
								If DateTime.Compare(TimeStamp, ModifiedDate) > 0
									ModifiedDate = TimeStamp
								End if
							Else
								RaiseEvent Output("File not found: " & FileName)
							End if
							
							' RaiseEvent Output(FileName)							
							RaiseEvent OutputFile(FileName)
						End if
					End if
				End if
			Loop
			
			oRead.Close()
		End Using
		
		Return DateTime.Compare(ModifiedDate, ModifiedSince) > 0
	End Function
		
	Public Function Modified(ByVal Name As String, ByVal ModifiedSince As DateTime) As Boolean
		Dim IsModified As Boolean = False
		Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name), "")
		Dim Ext As String = System.IO.Path.GetExtension(Filename).ToLower

		' HttpContext.Current.Response.Write("HELLO")
		' RaiseEvent Output(Filename)
		
		' Response.Write(FileName)
		If Ext = ".jst"
			IsModified = ParseFiles(FileName, ModifiedSince)
		Else
			' Parser.Include(Filename)
		End if
		
		' RaiseEvent Output(IsModified.ToString)
		Return IsModified
	End Function
	
End Class
	
Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function

	Public Sub Write(ByVal OutputText As String)
		Response.Write(OutputText)
		Response.Write(Environment.NewLine)
	End Sub

	Public Sub WriteFile(ByVal FileName As String)
		Response.WriteFile(FileName)
		Response.Write(Environment.NewLine)
	End Sub
	
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)
		
		
		Response.Clear
		' If Request.Headers("Accept-Encoding").Contains("gzip")
			' Response.Filter = new System.IO.Compression.GZipStream(Response.Filter, System.IO.Compression.CompressionMode.Compress)
			' Response.Headers.Remove("Content-Encoding")
			' Response.AppendHeader("Content-Encoding", "gzip")
		' End if
		
		Dim Filename As String = "/engine/scripts/" & Cmd
		' Dim Filename As String = "/engine/" & Cmd
		Dim Ext As String = System.IO.Path.GetExtension(Filename)
		If Ext = ""
			Filename = Filename & ".jst"
		Else
			Filename = Filename.Replace(Ext, ".jst")
		End if
		
		If Not System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Filename), "")) Then
			Filename = Filename.Replace(".jst", ".js")
		End if
		
		Dim ScriptLoader = New Loader
		AddHandler ScriptLoader.Output, AddressOf Write
		AddHandler ScriptLoader.OutputFile, AddressOf WriteFile
	
		Dim ModifiedSince As DateTime
		DateTime.TryParse(Request.Headers("If-Modified-Since"), ModifiedSince)
		
		' Write(ModifiedSince.ToString())
		If ScriptLoader.Modified(Filename, ModifiedSince)
			Write("Modified")
			' ScriptLoader.Include(Filename, Request.Url.Query.Replace("?", "").Replace("&", ";"))
		Else
			Write("Not Modified")
			' Response.StatusCode = 304
			' Response.SuppressContent = True
		End if
		
		' Write(FileName)
		
		Response.ContentType = "application/x-javascript"
		Response.End
	End Sub
	
End Class
