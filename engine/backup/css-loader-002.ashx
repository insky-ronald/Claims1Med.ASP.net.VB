REM ***************************************************************************************************
REM Last modified on
REM 28-FEB-2015
REM ***************************************************************************************************
<%@ WebHandler Language="VB" Class="Loader" %>

Imports System.IO
Imports System.Globalization
Imports System.Text

Namespace PreProcessor
	Public Class BasePreProcessor
		Public ModifiedDate As DateTime
		Public Sub UpdateModifiedDate(Filename As String)
			Dim TimeStamp As DateTime = System.IO.File.GetLastWriteTime(Filename)
			TimeStamp = TimeStamp.AddTicks(-(TimeStamp.Ticks mod TimeSpan.TicksPerSecond))
			If DateTime.Compare(TimeStamp, ModifiedDate) > 0
				ModifiedDate = TimeStamp
			End if
		End Sub
		
		Public Overridable Sub Include(ByVal File As String, Optional Params As String = "")
		End Sub
		
		Public Overridable Function GetContent() As String
			Return ""
		End Function
	End Class

	Public Class Parser
		Private S As String
		Private Filename As String
		Public ExtraParams As String
		Public Variables As EasyStringDictionary
		Public Parent As Parser
		Private oRead As System.IO.StreamReader
		Public Level As Integer = 0
		
		Public Source As StringBuilder

		Public Event Log(ByVal Parser As Parser, ByVal Log As String)
		REM Public Event Compare(ByVal Parser As Parser, ByVal Name As String, ByVal Value As String, ByVal Negate As Boolean, ByRef Allow As Boolean)
		REM Public Event AddVariable(ByVal Parser As Parser, ByVal Variables As EasyStringDictionary, ByVal Name As String, ByVal Value As String)
		Public Event IncludeFile(ByVal Parser As Parser, ByVal SourceName As String, ByVal Params As String)
		
		Public Sub New(ByVal Filename As String, ByVal ExtraParams As String, ByVal Optional Parent As Parser = Nothing)
			MyBase.New
			
			Me.Parent = Parent
			Me.Filename = Filename
			Me.ExtraParams = ExtraParams
			Source = New StringBuilder("")
			
			If Parent Is Nothing
				Level = 1
			Else
				Level = Parent.Level + 1
			End if
			
			Variables = New EasyStringDictionary(ExtraParams)
			Variables.AsString("@version") = BrowserName & BrowserVer
			Variables.AsString("@ver") = BrowserVer
			Variables.AsString("@browser") = BrowserName
			If IsMobile
				Variables.AsString("@mobile") = "yes"
			Else
				Variables.AsString("@mobile") = "no"
			End if
			Variables.Remove("css")
		End Sub
		
		Public Function Eof As Boolean
			Return oRead.Peek() >= 0
		End Function
		
		Private Function IsComment() As Boolean
			Return (S.Substring(0, 2) = "/*" and S.Substring(S.Length-2, 2) = "*/") or (S.Substring(0, 2) = "//")
		End Function
		
		Public Function HasToken(ByVal Token As String, ByVal Optional Full As Boolean = True) As Boolean
			If Full
				Return S = Token
			Else If S.Length >= Token.Length 
				Return S.Substring(0, Token.Length) = Token
			Else
				Return False
			End if
		End Function
		
		Public Function Lerp(start as Double, endx as Double, amount As Double) As Double
			Dim difference As Double = endx - start
			Dim adjusted As Double = difference * amount
			return start + adjusted
		End Function
		
		Public Function Lerpx(colour as System.Drawing.Color, tox as System.Drawing.Color, amount As Double) As System.Drawing.Color
			Dim sr As Double = colour.R
			Dim sg As Double = colour.G
			Dim sb As Double = colour.B

			Dim er As Double = tox.R
			Dim eg As Double = tox.G
			Dim eb As Double = tox.B

			Dim r As Byte = CType(Lerp(sr, er, amount), Byte)
			Dim g As Byte = CType(Lerp(sg, eg, amount), Byte)
			Dim b As Byte = CType(Lerp(sb, eb, amount), Byte)

			return System.Drawing.Color.FromArgb(r, g, b)
		End Function
		
		Public Function LightenDarkenColor(ByVal S As String, Dark As Boolean) As String
			
			REM Dim CssName As String = S.Split(":")(0)
			Dim I As Integer = S.IndexOf("(")+1
			Dim J As Integer = S.IndexOf(")")-I
			Dim CssValue4() As String = S.Substring(I, J).Split(",")

			Dim ColorHex As String = ""
			Dim AmountStr As String = ""

			Dim CheckColorHex = Variables.AsString(CssValue4(0).Replace("[", "").Replace("]", ""))
			If CheckColorHex <> String.Empty
				ColorHex = CheckColorHex
			Else
				ColorHex = CssValue4(0)
			End if
			AmountStr = CssValue4(1)
		
			Dim Color As System.Drawing.Color
			Color = System.Drawing.ColorTranslator.FromHtml(ColorHex)
			
			Dim FinalColor As System.Drawing.Color

			If Dark
				FinalColor = Lerpx(Color, System.Drawing.Color.Black, CType(AmountStr, Double))
			Else
				FinalColor = Lerpx(Color, System.Drawing.Color.White, CType(AmountStr, Double))
			End if
			
			Dim C As String = System.Convert.ToString(FinalColor.ToArgb(), 16).Substring(2, 6)

			Return "#"& C
		End Function
		
		Public Sub Parse_LightenDarkenColor(ByVal S As String, Dark As Boolean)
			
			Dim CssName As String = S.Split(":")(0)
			Dim I As Integer = S.IndexOf("(")+1
			Dim J As Integer = S.IndexOf(")")-I
			Dim CssValue4() As String = S.Substring(I, J).Split(",")

			Dim ColorHex As String = ""
			Dim AmountStr As String = ""

			REM Try 
				Dim CheckColorHex = Variables.AsString(CssValue4(0).Replace("[", "").Replace("]", ""))
				If CheckColorHex <> String.Empty
					ColorHex = CheckColorHex
				Else
					ColorHex = CssValue4(0)
				End if
				AmountStr = CssValue4(1)
			REM Catch Ex As Exception
			REM End Try
		
			Dim Color As System.Drawing.Color
			REM Try
				Color = System.Drawing.ColorTranslator.FromHtml(ColorHex)
			REM Catch Ex As Exception 
				REM Append("error3: "& Ex.Message &";")
			REM End Try
			
			Dim FinalColor As System.Drawing.Color

			If Dark
				FinalColor = Lerpx(Color, System.Drawing.Color.Black, CType(AmountStr, Double))
			Else
				FinalColor = Lerpx(Color, System.Drawing.Color.White, CType(AmountStr, Double))
			End if
			
			Dim C As String = System.Convert.ToString(FinalColor.ToArgb(), 16).Substring(2, 6)

			Append(CssName &": #"& C &";")
		End Sub
		
		Public Sub Parse_AlphaColor
			Parse_LightenDarkenColor(S, True)
		End Sub
		
		Public Sub Parse_DarkenColor
			Parse_LightenDarkenColor(S, True)
		End Sub
		
		Public Sub Parse_LightenColor
			REM RaiseEvent Log(Me, "Parse_LightenColor: " & S)
			Parse_LightenDarkenColor(S, False)
		End Sub
		
		Public Function ExtractContent(S As String, Bounds() As String) As String
			Dim I As Integer = S.IndexOf(Bounds(0))+1
			Dim J As Integer = S.IndexOf(Bounds(1))-I
			Return S.Substring(I, J)
		End Function
		
		Private Sub AddVariable(ByVal UseParams As EasyStringDictionary, ByVal Optional Override As Boolean = False)
			Dim ValuePair As String() = S.Split("=")
			If ValuePair.Length = 2
				Dim Value As String = ""
				
				If UseParams Is Nothing
					If Not Variables.ContainsKey(ValuePair(0).Trim)
						Value = ValuePair(1).Trim
					End if
				Else
					If ValuePair(1).Trim = "@"
						Value = Variables.AsString(ValuePair(0).Trim)
					Else 
						Value = ValuePair(1).Trim						
					End if
				End if
				
				If Value.Contains("LightenColor")
					Value = LightenDarkenColor(S, False)
				Else If Value.Contains("DarkenColor")
					Value = LightenDarkenColor(S, True)
				End if
				
				If UseParams Is Nothing
					If Not Variables.ContainsKey(ValuePair(0).Trim)
						Variables.AsString(ValuePair(0).Trim) = Value
					End if
				Else
					If ValuePair(1).Trim = "@"
						UseParams.AsString(ValuePair(0).Trim) = Value
					Else 
						UseParams.AsString(ValuePair(0).Trim) = Value
					End if
				End if
				
				REM If UseParams Is Nothing
					REM If Not Variables.ContainsKey(ValuePair(0).Trim)
						REM Variables.AsString(ValuePair(0).Trim) = ValuePair(1).Trim
					REM End if
				REM Else
					REM If ValuePair(1).Trim = "@"
						REM UseParams.AsString(ValuePair(0).Trim) = Variables.AsString(ValuePair(0).Trim)
					REM Else 
						REM UseParams.AsString(ValuePair(0).Trim) = ValuePair(1).Trim						
					REM End if
				REM End if
			End if
		End Sub
			
		Private Sub AddVariable(ByVal UseParams As EasyStringDictionary, ByVal Name As String, ByVal Value As String)
			If Value.Contains("LightenColor")
				Value = LightenDarkenColor(S, False)
			Else If Value.Contains("DarkenColor")
				Value = LightenDarkenColor(S, True)
			End if
			
			If UseParams Is Nothing
				Variables.AsString(Name) = Value
			Else
				UseParams.AsString(Name) = Value
			End if
		End Sub
		
		Public Sub Compare(ByVal Name As String, ByVal Value As String, ByVal Negate As Boolean, ByRef Allow As Boolean)
			If Not Negate
				Allow = Variables.AsString(Name) = Value
			Else
				Allow = Variables.AsString(Name) <> Value
			End if
		End Sub
			
		Public Sub Append			
			REM Source.AppendLine("/*1*/" & S)
			Source.AppendLine(S)
		End Sub
			
		Public Sub Append(ByVal SS As String)
			Source.AppendLine(SS)
		End Sub
		
		Public Sub Parse_IF(ByVal Optional UseParams As EasyStringDictionary = Nothing, ByVal Optional InitVar As Boolean = False)
			Dim I As Integer = S.IndexOf("(")+1
			Dim J As Integer = S.IndexOf(")")-I
			Dim Expr As String() = S.Substring(I, J).Split("=")
			Dim Allow As Boolean = False
			
			Read(False, UseParams)
			Do While Not HasToken("##endif") and Not HasToken("##else") and Not HasToken("##elseif", False)
				REM RaiseEvent Compare(Me, Expr(0), Expr(1), False, Allow)
				If Not IsComment()
					Compare(Expr(0), Expr(1), False, Allow)
					If Allow 
						If InitVar
							
						Else
							If UseParams Is Nothing
								Append
							Else
								AddVariable(UseParams)
								REM Dim ValuePair As String() = S.Split("=")
								REM If ValuePair.Length = 2
									REM AddVariable(UseParams, ValuePair(0).Trim, ValuePair(1).Trim)
								REM End if
							End if
						End if
					End if
				End if
				Read(False, UseParams)
			Loop
			
			If HasToken("##elseif", False)
				Parse_IF(Nothing, InitVar)
			End if
			
			If HasToken("##else")
				Read(False, UseParams)
				Do While Not HasToken("##endif", False)
					REM RaiseEvent Compare(Me, Expr(0), Expr(1), True, Allow)
					If Not IsComment()
						Compare(Expr(0), Expr(1), True, Allow)
						If Allow 
							If InitVar
								
							Else
								If UseParams Is Nothing
									Append
								Else
									AddVariable(UseParams)
									REM Dim ValuePair As String() = S.Split("=")
									REM If ValuePair.Length = 2
										REM AddVariable(UseParams, ValuePair(0).Trim, ValuePair(1).Trim)
									REM End if
								End if
							End if
						End if
					End if
					Read(False, UseParams)
				Loop
			End if
			
		End Sub
		
		Public Sub Parse_IF2(ByVal Optional UseParams As EasyStringDictionary = Nothing)
		return
			Dim I As Integer = S.IndexOf("(")+1
			Dim J As Integer = S.IndexOf(")")-I
			Dim Expr As String() = S.Substring(I, J).Split("=")
			Dim Allow As Boolean = False
			
			Read(False, UseParams)
			Do While Not HasToken("##endif") and Not HasToken("##else") and Not HasToken("##elseif", False)
				If Not IsComment()
					Compare(Expr(0), Expr(1), False, Allow) 
					If Allow 
						REM If UseParams Is Nothing
							REM Append
						REM Else
							AddVariable(UseParams)
						REM End if
					End if
				End if
				Read(False, UseParams)
			Loop
			
			If HasToken("##elseif", False)
				Parse_IF2(UseParams)
			End if
			
			If HasToken("##else")
				Read(False, UseParams)
				Do While Not HasToken("##endif", False)
					If Not IsComment()
						Compare(Expr(0), Expr(1), True, Allow)
						If Allow 
							REM If UseParams Is Nothing
								REM Append
							REM Else
								AddVariable(UseParams)
							REM End if
						End if
					End if
					Read(False, UseParams)
				Loop
			End if
			
		End Sub
		
		Public Sub Parse_USEFILE
			Dim UseFilename As String = S.Split("=")(1)
			Dim UseParams As New EasyStringDictionary(Variables.Delimeted(";"))
			UseParams.Append(Variables)
			REM Variables.Append(UseParams)
			
			Do
				If HasToken("##if")
					Parse_IF(UseParams)
				End if																						

				Read(False, UseParams)
			Loop Until HasToken("##enduse")
			
			REM UseParams.Append(Variables)
			REM Variables.Append(UseParams)
			RaiseEvent IncludeFile(Me, UseFilename, UseParams.Delimeted(";"))
		End Sub
		
		Public Sub Parse_TEMPLATE(ByVal EndToken As String, ByVal Ext As String)
			Dim UseParams As New EasyStringDictionary("")
			
			Do
				If HasToken("##if")
					Parse_IF(UseParams)
				Else If Not HasToken("##endtemplate", False) and Not HasToken("##endinclude", False)
					AddVariable(UseParams, True)
				End if																						

				Read(False, UseParams)
				
			Loop Until HasToken(EndToken, False)
			
			Dim UseFilename As String = S.Split("=")(1)
			Dim ValuePair As String() = UseFilename.Split("\")
			
			If ValuePair.Length > 2
				UseFilename = String.Format("{0}.{1}", UseFilename, Ext).Replace("\", "/")
			Else
				UseFilename = String.Format("{0}/css/{1}.{2}", ValuePair(0), ValuePair(1), Ext)
			End if
			
			RaiseEvent IncludeFile(Me, UseFilename, UseParams.Delimeted(";"))
		End Sub
		
		Public Sub Parse_CONST
			Do
				If HasToken("##if")
					Parse_IF(Nothing)
				Else If Not HasToken("##endconst", False)
					AddVariable(Nothing, True)
				End if																						

				Read(False, Nothing)
				
			Loop Until HasToken("##endconst", False)
		End Sub
		
		Public Sub Parse_INIT(ByVal UseParams As EasyStringDictionary)
			REM Dim UseParams As New EasyStringDictionary("")
			REM Variables.AsString("test") = "xxx"
			REM UseParams.AsString("test") = "yyy"
			Read(False, UseParams)
			Do
				If HasToken("##if")
					Parse_IF2(UseParams)
				Else If Not HasToken("##endinit", False)
					AddVariable(UseParams, True)
				Else
					Exit Do
				End if																						

				Read(False, UseParams)
							
			Loop Until HasToken("##endinit", False)
		End Sub
		
		Public Sub Read(ByVal Optional Root As Boolean = True, ByVal Optional UseParams As EasyStringDictionary = Nothing)
			S = oRead.ReadLine().Trim
			
			If S.Length > 2
				If Not IsComment()
					If HasToken("##const")
						Parse_CONST
					Else If HasToken("##init", False)
						REM Parse_INIT(UseParams)
						Parse_INIT(UseParams)
					Else If HasToken("##usefile", False)
						Parse_USEFILE
					Else If HasToken("##template") rem for backward compatibility, replaced by ##usefile
						Parse_TEMPLATE("##endtemplate", "css")
					Else If HasToken("##includetemplate") rem for backward compatibility, replaced by ##usefile
						Parse_TEMPLATE("##endinclude", "csst")
					Else If HasToken("##if", False)
						Parse_IF(UseParams)
					Else If HasToken("##version", False) or HasToken("##browser", False) rem for backward compatibility, replaced by ##usefile
						Dim ValuePair As String() = S.Split("=")
						S = String.Format("##if({0}={1})", ValuePair(0).Replace("##","@"), ValuePair(1))
						Parse_IF(UseParams)
					REM Else If S = "##mobile"
						REM ProcessDirective_mobile(Css, oRead)
					Else If S.Contains("LightenColor")
						Parse_LightenColor
					Else If S.Contains("DarkenColor")
						Parse_DarkenColor
					Else If S.Contains("AlphaColor")
						Parse_AlphaColor
						REM RaiseEvent Log(Me, "OK2")
					Else If Root
						Append
					REM Else
						REM If Not HasToken("##endtemplate", False) and Not HasToken("##endinclude", False)
							REM AddVariable(UseParams)
						REM End if
					End if
				End if
			Else If S.Contains("LightenColor")
				Parse_LightenColor
			Else If S.Contains("DarkenColor")
				Parse_DarkenColor
			Else If S.Length <> 0
				Append
			End if
		End Sub
		
		Public Sub Parse
			REM RaiseEvent Log(Me, Filename)
			REM RaiseEvent Log(Me, "Begin Parse Variables=" & Variables.Delimeted(";"))

			Try
				oRead = System.IO.File.OpenText(Filename)
				Do While oRead.Peek() >= 0
					Read
				Loop
				
			Catch E As Exception
				REM RaiseEvent Log(Me, "After Parse Variables=")
			Finally
				oRead.Close()
				oRead.Dispose()
			End Try
		End Sub
		
		Public Function PopulateVariables As String
			Return Variables.PopulateVariables(Source)
			REM Return Source.ToString
		End Function
	End Class
	
	Public Class CssPreProcesser
		Inherits BasePreProcessor
		
		REM Public Variables As EasyStringDictionary
		Public IncludedCss As StringBuilder

		Public Sub New
			MyBase.New
			REM Variables = New EasyStringDictionary("")
			IncludedCss = New StringBuilder("")
			
			REM Variables.AsString("@version") = BrowserName & BrowserVer
			REM Variables.AsString("@ver") = BrowserVer
			REM Variables.AsString("@browser") = BrowserName
		End Sub
						
		Public Sub Log(ByVal Parser As Parser, ByVal Log As String)
			IncludedCss.AppendLine(Parser.Level &"."& ("").PadRight((Parser.Level-1)*3, " ") & Log)
		End Sub
		
		Public Sub Include3(ByVal CssName As String, Optional ExtraParams As String = "", Optional Parent As Parser = Nothing)
			Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & CssName), "")
			Dim Ext As String = System.IO.Path.GetExtension(CssName).ToLower
			
			UpdateModifiedDate(Filename)
			
			Dim Parser As New Parser(Filename, ExtraParams, Parent)
			
			If Ext = ".css"
				Parser.Append("/* start " & CssName & " */")
			End if

			AddHandler Parser.Log, AddressOf Log
			AddHandler Parser.IncludeFile, AddressOf IncludeFile
			
			Parser.Parse
			
			REM Log(Parser, "Hello")
		End Sub
		
		Public Sub Include(ByVal CssName As String, Optional ExtraParams As String = "", Optional Parent As Parser = Nothing)
			
			Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & CssName), "")
			Dim Ext As String = System.IO.Path.GetExtension(CssName).ToLower
			REM IncludedCss.AppendLine(Filename)
			REM Return
			
			UpdateModifiedDate(Filename)

			Dim Parser As New Parser(Filename, ExtraParams, Parent)
			If Ext = ".css"
				Parser.Append("/* start " & CssName & " */")
				REM Parser.Append("/* start " & Filename & " */")
			End if
			
			AddHandler Parser.Log, AddressOf Log
			REM AddHandler Parser.Compare, AddressOf Compare
			REM AddHandler Parser.AddVariable, AddressOf AddVariable
			AddHandler Parser.IncludeFile, AddressOf IncludeFile
			
			Parser.Parse
			
			If Ext = ".css"
				Parser.Append("/* end " & CssName & " */")
			End if
			
			IncludedCss.AppendLine(Parser.PopulateVariables)
			REM If ExtraParams = ""
				REM IncludedCss.AppendLine(Parser.Source.ToString)
			REM Else
				REM IncludedCss.AppendLine(Parser.PopulateVariables)
			REM End if
		End Sub
		
		REM Public Sub AddVariablex(ByVal Parser As Parser, ByVal UseParams As EasyStringDictionary, ByVal Name As String, ByVal Value As String)
			REM If UseParams Is Nothing
				REM Parser.Variables.AsString(Name) = Value
			REM Else
				REM UseParams.AsString(Name) = Value
			REM End if
		REM End Sub
		
		REM Public Sub Compare(ByVal Parser As Parser, ByVal Name As String, ByVal Value As String, ByVal Negate As Boolean, ByRef Allow As Boolean)
			REM If Not Negate
				REM Allow = Parser.Variables.AsString(Name) = Value
			REM Else
				REM Allow = Parser.Variables.AsString(Name) <> Value
			REM End if
		REM End Sub
		
		Public Sub IncludeFile(ByVal Parser As Parser, ByVal CssName As String, Optional ExtraParams As String = "")
			Include(CssName, ExtraParams, Parser)
		End Sub

		Public Overrides Function GetContent() As String
			Return IncludedCss.ToString
		End Function

	End Class	
	
	Public Class FilesModifiedState
		
		Public Property ModifiedDate As DateTime
		
		Public Function HasToken(ByVAl S As String, ByVal Token As String, ByVal Optional Full As Boolean = True) As Boolean
			If Full
				Return S = Token
			Else If S.Length >= Token.Length 
				Return S.Substring(0, Token.Length) = Token
			Else
				Return False
			End if
		End Function
		
		Public Sub ParseFiles(ByVal TargetFileName As String)
			' ModifiedDate = Date.Today()
			ModifiedDate = Date.Now()
			Dim Ext As String = System.IO.Path.GetExtension(TargetFileName)
			
			If Ext = ".css"
				If System.IO.File.Exists(TargetFileName) Then
					Dim TimeStamp As DateTime = System.IO.File.GetLastWriteTime(TargetFileName)
					TimeStamp = TimeStamp.AddTicks(-(TimeStamp.Ticks mod TimeSpan.TicksPerSecond))
					If DateTime.Compare(TimeStamp, ModifiedDate) > 0
						ModifiedDate = TimeStamp
					End if
				End if
				Return
			End if
			
			' HttpContext.Current.Response.Write("/* TEST: " & System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & TargetFileName) & "*/")
			' HttpContext.Current.Response.Write(Environment.NewLine)
			Using oRead As System.IO.StreamReader = System.IO.File.OpenText(TargetFileName)
				Do While oRead.Peek() >= 0
					Dim S As String = oRead.ReadLine().Trim
					If S <> String.Empty
						If S.Substring(0, 2) <> "//"
							If HasToken(S, "##endinclude", False)
								Dim Name As String = ""
								Dim Parts As String() = S.Split("=")
								Dim NameParts As String() = Parts(1).Split("\")
								
								If NameParts(0) = "engine" or NameParts(0) = "app"
									Name = NameParts(0) &"\css\" & NameParts(1) & ".csst"
								Else
									Name = "\css\" & Parts(1) & ".csst"
								End if
								
								Dim FileName As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name))
								ParseFiles(FileName)
								
							Else If HasToken(S, "##endtemplate", False)
								Dim Name As String = ""
								Dim Parts As String() = S.Split("=")
								Dim NameParts As String() = Parts(1).Split("\")
								
								If NameParts(0) = "engine" or NameParts(0) = "app"
									Name = NameParts(0) &"\css\" & NameParts(1) & ".css"
								Else
									Name = "\css\" & Parts(1) & ".css"
								End if
								
								Dim FileName As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name))
								If System.IO.File.Exists(FileName) Then
									Dim TimeStamp As DateTime = System.IO.File.GetLastWriteTime(Filename)
									TimeStamp = TimeStamp.AddTicks(-(TimeStamp.Ticks mod TimeSpan.TicksPerSecond))
									If DateTime.Compare(TimeStamp, ModifiedDate) > 0
										ModifiedDate = TimeStamp
									End if
								End if
							End if
						End if
					End if
				Loop
				
				oRead.Close()
			End Using
		End Sub
		
		Public Function ParseFiles2(ByVal TargetFileName As String) As Boolean
			ModifiedDate = Date.Today()

			Using oRead As System.IO.StreamReader = System.IO.File.OpenText(TargetFileName)
				Do While oRead.Peek() >= 0
					Dim S As String = oRead.ReadLine().Trim
					If S <> String.Empty
						If S.Substring(0, 2) <> "//"
							If HasToken(S, "##includetemplate", False)
								' ##includetemplate=engine\common-controls
								Dim Name As String = ""
								Dim Parts As String() = S.Split("=")
								Dim NameParts As String() = Parts(1).Split("\")
								
								If NameParts(0) = "engine" or NameParts(0) = "app"
									Name = NameParts(0) &"\scripts\" & NameParts(1) & ".jst"
								Else
									Name = "\scripts\" & Parts(1) & ".jst"
								End if
								
								Dim FileName As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name))
								ParseFiles(FileName)
								
							Else If HasToken(S, "##include", False)
								' ##include=jquery-2.1.4.min.js
								' ##include=engine\utils
								' ##include=app\utils
								
								Dim Name As String = ""
								Dim Parts As String() = S.Split("=")
								Dim NameParts As String() = Parts(1).Split("\")
								
								If NameParts(0) = "engine" or NameParts(0) = "app"
									Name = NameParts(0) &"\scripts\" & NameParts(1) & ".js"
								Else
									Name = "\scripts\" & Parts(1) & ".js"
								End if
								
								Dim FileName As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name))
								
								If System.IO.File.Exists(FileName) Then
									Dim TimeStamp As DateTime = System.IO.File.GetLastWriteTime(Filename)
									TimeStamp = TimeStamp.AddTicks(-(TimeStamp.Ticks mod TimeSpan.TicksPerSecond))
									If DateTime.Compare(TimeStamp, ModifiedDate) > 0
										ModifiedDate = TimeStamp
									End if
								End if
							End if
						End if
					End if
				Loop
				
				oRead.Close()
			End Using
		End Function

	End Class	
	
End Namespace

Public Class Loader: Implements IHttpHandler REM, IReadOnlySessionState
	Protected Request As System.Web.HttpRequest
	Protected Response As System.Web.HttpResponse
	REM Protected Session As  System.Web.SessionState.HttpSessionState
		
	Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			REM Return True
			Return False
		End Get
	End Property

	Public Sub ProcessRequest(ByVal Context As HttpContext) Implements IHttpHandler.ProcessRequest
		Request = Context.Request
		Response = Context.Response
		
		Response.Clear()
		If Request.Headers("Accept-Encoding").Contains("gzip")
			Response.Filter = new System.IO.Compression.GZipStream(Response.Filter, System.IO.Compression.CompressionMode.Compress)
			Response.Headers.Remove("Content-Encoding")
			Response.AppendHeader("Content-Encoding", "gzip")
		End if

		Dim Css = New PreProcessor.CssPreProcesser
		Dim Filename As String = Request.Params("css")
		
		Response.Clear
		Response.ContentType = "text/css"
		
		If Request.Params("sid") Is Nothing
			Dim Ext As String = System.IO.Path.GetExtension(Filename)
			
			If Ext = ""
				Filename = Filename & ".csst"
			Else
				Filename = Filename.Replace(Ext, ".csst")
			End if

			If Not System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Filename), "")) Then
				Filename = Filename.Replace(".csst", ".css")
			End if
		Else
			REM This is used by master-design-2.master.vb
			Filename = Filename &"/"& Request.Params("p") &"-"& Request.Params("sid") & "/css.csst"
			If Not System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Filename), "")) Then
				Filename = Filename.Replace(".csst", ".css")
			End if
		End if
			
		Dim StatusCheck = New PreProcessor.FilesModifiedState
		Dim CheckFileName As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Filename), "")
		' If Not System.IO.File.Exists(CheckFileName, "")) Then
			' CheckFileName = CheckFileName.Replace(".csst", ".css")
		' End if
		' Response.Write("/*" & CheckFileName & "*/")
		' Response.Write(Environment.NewLine)
		' Return
		
		StatusCheck.ParseFiles(System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Filename), ""))
		
		Dim Modified As Integer = 1
		Dim ModifiedSince As DateTime
		' Dim ModifiedSince As DateTime = Date.Today()
		
		' If Request.Headers("If-Modified-Since") Is Nothing
			' ModifiedSince = Date.Today()
			' Modified  = 1
		' Else
			' Modified  = DateTime.Compare(StatusCheck.ModifiedDate, ModifiedSince)
			' ModifiedSince = StatusCheck.ModifiedDate
		' End if
		' Modified  = DateTime.Compare(StatusCheck.ModifiedDate, ModifiedSince)
		
		If DateTime.TryParse(Request.Headers("If-Modified-Since"), ModifiedSince)
			Modified  = DateTime.Compare(StatusCheck.ModifiedDate, ModifiedSince)
		End if
		
		Response.AppendHeader("Max-Age", 1)
		If Modified > 0
			Response.Cache.SetLastModified(StatusCheck.ModifiedDate)
			' Response.Cache.SetLastModified(ModifiedSince)
			Css.Include(Filename, Request.Url.Query.Replace("?", "").Replace("&", ";"))
			Response.Write(Css.GetContent())
		Else
			Response.StatusCode = 304
			Response.SuppressContent = True
		End if
		
		Response.End()
		Return
		
		If System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Filename), "")) Then
			Css.Include(Filename, Request.Url.Query.Replace("?", "").Replace("&", ";"))
		
			' Dim Modified As Integer = 1
			' Dim ModifiedSince As DateTime
			If AppUtils.Settings.AsInteger("CacheCssJS") = 1
				If Request.Headers("If-Modified-Since") IsNot Nothing
					If DateTime.TryParse(Request.Headers("If-Modified-Since"), ModifiedSince)
						Modified = DateTime.Compare(Css.ModifiedDate, ModifiedSince)
					End if
				End if
			End if
			
			If Modified > 0
				If AppUtils.Settings.AsInteger("CacheCssJS") = 1
					Response.Cache.SetLastModified(Css.ModifiedDate)
				End if
				Response.Write(Css.GetContent())
			Else
				Response.StatusCode = 304
				Response.SuppressContent = True
			End if
		Else
			Response.StatusCode = 404
			Response.SuppressContent = True
		End if
		
		Response.End()
	End Sub
End Class
