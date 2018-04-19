Imports System.IO                                                        
Imports System.Data

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
		
		Public Overridable Sub IncludeFile(ByVal ScriptName As String)
		End Sub
		
		Public Overridable Function GetContent() As String
			Return ""
		End Function

		Public Function SourceFileName(ByVal Resource As String, ByVal Name As String, Optional Path As String = "") As String
			Dim Ext As String
			
			If Resource = "script" 
				Resource = "scripts"
			End if
			
			If Path = ""
				Path = "\app\" + Resource
			Else
				Path = "\" + Path + "\" + Resource
			End if
			
			If Resource = "css"
				Ext = ".csst"
			Else
				Ext = ".jst"
			End if
			
			 Return System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), Name & Ext)
		End Function
		
		REM Protected Function ExistsFile(ByVal Resource As String, ByVal Name As String, Optional Path As String = "")
			REM Dim Ext As String
			
			REM If Path = ""
				REM Path = "\app\" + Resource
			REM Else
				REM Path = "\" + Path + "\" + Resource
			REM End if
			
			REM If Resource = "css"
				REM Ext = ".csst"
			REM Else
				REM Ext = ".jst"
			REM End if
			
			 REM Return System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), Name & Ext))
		REM End Function
		
		REM Public Function FileExists(ByVal Filename As String, Optional Path As String = "") As Boolean
			REM If Path = ""
				REM Path = "\app\css"
			REM Else
				REM Path = "\" + Path + "\css"
			REM End if

			REM Return System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), Filename))
		REM End Function
		
	End Class
	
	Public Class JavaScript
		REM Public ScriptName As String
		REM Public Position As LinkLocation
		REM Public Minimize As Boolean
		REM Public URL As String
		Private S As StringBuilder
		Public Params As EasyStringDictionary
						
		Public ReadOnly Property GetScript() As String
			Get
				Return PopulateVariables()
'                       Return S.ToString
			End Get
		End Property

		Sub New
			MyBase.New
			REM Me.ScriptName = ScriptName
			REM Me.Position = Position
			REM Me.Minimize = Minimize
			REM Me.URL = URL
			S = New StringBuilder("")
			Params = New EasyStringDictionary("")
		End Sub

		Public Sub Append(Code As String)
			S.AppendLine(Code)
		End Sub

		Public Sub FromScript(Code As JavaScript)
			S.AppendLine(Code.ToString)
		End Sub

		Public ModifiedDate As DateTime							
		Public Sub UpdateModifiedDate(Filename As String)
			Dim TimeStamp As DateTime = System.IO.File.GetLastWriteTime(Filename)
			TimeStamp = TimeStamp.AddTicks(-(TimeStamp.Ticks mod TimeSpan.TicksPerSecond))
			If DateTime.Compare(TimeStamp, ModifiedDate) > 0
				ModifiedDate = TimeStamp
			End if
		End Sub

		Public Sub IncludeFileMin(ScriptName As String, Optional Path As String = "")
			If Path = ""
				Path = "\app\scripts"
			Else
				Path = "\" + Path + "\scripts"
			End if
								
			Dim SB As New StringBuilder("")
			Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), ScriptName & ".js")
			If System.IO.File.Exists(FileName) Then
				UpdateModifiedDate(Filename)
				Using sr As New System.IO.StreamReader(Filename)
					SB.Append(sr.ReadToEnd())
					sr.Close()
				End Using

				Dim Minify As New Microsoft.Ajax.Utilities.Minifier()
				REM S.Append("//"+Filename)
				REM S.Append(Environment.NewLine)
				
				S.Append(Minify.MinifyJavaScript(SB.ToString))
				S.Append(Environment.NewLine)
			Else
				S.Append("//NOT FOUND: "+Filename)
				S.Append(Environment.NewLine)
			End if
		End Sub
		
		Public Sub IncludeFile(ScriptName As String, Optional Path As String = "", Optional Minimize As Boolean = False)
			IncludeFileMin(ScriptName, Path)
		End Sub

		Public Function PopulateVariables(Params As EasyStringDictionary) As String
			Dim Result As String = S.ToString

			For Each Var in Params.Dict
				Result = Result.Replace("@" & Var.Key, Var.Value.ToString)
			Next

			Return Result
		End Function

		Public Function PopulateVariables() As String
			Dim Result As String = S.ToString

			For Each Var in Params.Dict
				Result = Result.Replace("@" & Var.Key, Var.Value.ToString)
			Next

			Return Result
		End Function
	End Class

	Public Class ScriptPreProcessor
		Inherits BasePreProcessor

		Public Scripts As JavaScript

		Public Sub New()
			MyBase.New()'Of String, JavaScript)
			Scripts = New JavaScript
		End Sub
		
		Public Overrides Sub Include(ByVal File As String, Optional Params As String = "")
			Dim aParts As String() = File.Split(".")
			
			IF aParts.Length > 1
				OpenScriptLoader(aParts(1), aParts(0))
			Else
				OpenScriptLoader(aParts(0), "app")
			End if
		End Sub

		Public Overrides Function GetContent() As String
			Return Scripts.PopulateVariables()
		End Function
		
		Protected Sub OpenScriptLoader(ByVal ScriptName As String, Optional Path As String = "")
			If Path = ""
				Path = "\app\scripts"
			Else
				Path = "\" + Path + "\scripts"
			End if

			Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), ScriptName & ".jst")

			If Not System.IO.File.Exists(Filename)
				Return
			End if

			Dim S As String
			Using oRead As System.IO.StreamReader = System.IO.File.OpenText(Filename)
				Do While oRead.Peek() >= 0
					S = oRead.ReadLine().Trim
					If S.Contains("##includetemplate")
						If S.Length > 2 and S.Substring(0,2) <> "--"
							Dim TemplateName As String = S.Split("=")(1)
							Dim Parts As String() = TemplateName.Split("\")
							If Parts.Length > 1
								OpenScriptLoader(Parts(1), Parts(0))
							Else
								OpenScriptLoader(Parts(0))
							End if
						End if
					Else If S.Contains("##include")
						If S.Length > 2 and S.Substring(0,2) <> "--"
							Dim Parts As String() = S.Split("=")
							IncludeFile(Parts(1))
						End if
					End if
				Loop
				
				oRead.Close
			End Using					
		End Sub

		Public Overrides Sub IncludeFile(ByVal ScriptName As String)
			Dim Parts As String() = ScriptName.Split("\")
			Dim Path As String
			
			If Parts.Length > 1
				Path = Parts(0)
				ScriptName = Parts(1)
			Else
				Path = "app"
			End if

			Scripts.IncludeFile(ScriptName, Path)
			REM Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), ScriptName & ".js")
		End Sub
		
	End Class

	Public Class CssPreProcesser
		Inherits BasePreProcessor
		
		Public Params As EasyStringDictionary
		Public IncludedCss As StringBuilder

		Public Sub New
			MyBase.New
			Params = New EasyStringDictionary("")
			IncludedCss = New StringBuilder("")
		End Sub
						
		Public Overrides Sub Include(ByVal File As String, Optional Params As String = "")
			Dim aParts As String() = File.Split("=") 'Just in case the format is "engine.toolbar-dbm=toolbar-crm"
			
			Dim aFile As String()
			
			If aParts.Length > 1
				aFile = aParts(0).Split(".")
				
				IF aFile.Length > 1
					IncludeTemplate(aFile(1), aParts(1), aFile(0), Params)
				Else
					IncludeTemplate(aFile(0), aParts(1), "app", Params)
				End if
			Else
				aFile = File.Split(".")
				IF aFile.Length > 1
					IncludeFile(aFile(1), aFile(0))
				Else
					IncludeFile(aFile(0), "app")
				End if
			End if
		End Sub
		
		Public Sub IncludeFile(ByVal CssName As String, Optional Path As String = "")
			IncludedCss.AppendLine("/* Start of module [" & CssName & "], [" & BrowserName & BrowserVer & "] */")

			If Path = ""
				Path = "\app\css"
			Else
				Path = "\" + Path + "\css"
			End if

			Dim S As String
			Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), CssName & ".css")
			UpdateModifiedDate(Filename)
			
			If Not System.IO.File.Exists(Filename)
				IncludedCss.AppendLine(String.Format("/*not found: {0}*/", FileName))
				Return
			End if
			
			Dim oRead As System.IO.StreamReader = System.IO.File.OpenText(Filename)
			Do While oRead.Peek() >= 0
				S = oRead.ReadLine().Trim
				If S.Length <> 0
					If S.Length > 2
						If S.Substring(0, 2) <> "/*" and S.Substring(S.Length-2, 2) <> "*/"
							If S = "##const"
								S = oRead.ReadLine().Trim
								Do While S <> "##endconst"
									Dim Values() = S.Split("=")
									Params.AsString(Values(0).Trim) = Values(1).Trim
									S = oRead.ReadLine().Trim
								Loop
								
								If S <> "##endconst" 
									IncludedCss.AppendLine(S)
								End if                                        
							Else If S = "##mobile"
								REM If S.Substring(0, 8) = "##mobile"
									S = oRead.ReadLine().Trim
									Do While S <> "##endif" and S <> "##else"      
										If IsMobile()
											IncludedCss.AppendLine(S & Environment.NewLine)
										End if
										S = oRead.ReadLine().Trim
									Loop
									
									If S = "##else" 
										S = oRead.ReadLine().Trim
										Do While S <> "##endif"
											If Not IsMobile()
												IncludedCss.AppendLine(S & Environment.NewLine)
											End if
											S = oRead.ReadLine().Trim
										Loop
									End if
									
									If S <> "##endif"
										IncludedCss.AppendLine(S)
									End if                                        
								REM End if
							Else If S.Length >= 9
								If S.Substring(0, 9) = "##version"
									Dim Values = S.Split("=")(1).Trim
									S = oRead.ReadLine().Trim
									Do While S <> "##endif" and S <> "##else"      
										If Values.Contains(BrowserName()&BrowserVer)                                 
											IncludedCss.AppendLine(S & Environment.NewLine)
										End if
										S = oRead.ReadLine().Trim
									Loop
									
									If S = "##else" 
										S = oRead.ReadLine().Trim
										Do While S <> "##endif"
											If Not Values.Contains(BrowserName()&BrowserVer)                                 
												IncludedCss.AppendLine(S & Environment.NewLine)
											End if
											S = oRead.ReadLine().Trim
										Loop
									End if
								Else If S.Substring(0, 9) = "##browser"
									Dim Values = S.Split("=")(1).Trim
									S = oRead.ReadLine().Trim
									Do While S <> "##endif" and S <> "##else"       
										If Values.Contains(BrowserName())                                 
											IncludedCss.AppendLine(S & Environment.NewLine)
										End if
										S = oRead.ReadLine().Trim
									Loop
									
									If S = "##else" 
										S = oRead.ReadLine().Trim
										Do While S <> "##endif"
											If Not Values.Contains(BrowserName())                                 
												IncludedCss.AppendLine(S & Environment.NewLine)
											End if
											S = oRead.ReadLine().Trim
										Loop
									End if
								End if
								
								If S <> "##endif"
									IncludedCss.AppendLine(S)
								End if                                        
							Else
								IncludedCss.AppendLine(S)    
							End if 'If S.Length >= 12
						End if                        
					Else
						IncludedCss.AppendLine(S)
					End if
				End if
			Loop

			IncludedCss.AppendLine("/* End of module " & "*/")

			oRead.Close()
			oRead.Dispose()
		End Sub

		Public Sub IncludeFileParams(ByVal CssName As String, Optional Path As String = "", Optional ParamStr As String = "")
			Dim Css As New StringBuilder("")
			Dim Params As New EasyStringDictionary(ParamStr)

			Css.AppendLine("/* Start of module [" & CssName & "], [" & BrowserName & BrowserVer & "] */")

			If Path = ""
				Path = "\app\css"
			Else
				Path = "\" + Path + "\css"
			End if

			Dim S As String
			Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), CssName & ".css")
			UpdateModifiedDate(Filename)

			If Not System.IO.File.Exists(Filename)
				Css.AppendLine(String.Format("/*not found: {0}*/", FileName))
				Return
			End if

			Dim oRead As System.IO.StreamReader = System.IO.File.OpenText(Filename)
			Do While oRead.Peek() >= 0
				S = oRead.ReadLine().Trim
				If S.Length <> 0
					If S.Length > 2
						If S.Substring(0, 2) <> "/*" and S.Substring(S.Length-2, 2) <> "*/"
							If S = "##const"
								S = oRead.ReadLine().Trim
								Do While S <> "##endconst"
									Dim Values() = S.Split("=")
									If Values.Length = 2
										If Not Params.Exists(Values(0).Trim)
											Params.AsString(Values(0).Trim) = Values(1).Trim
										End if
									End if
									S = oRead.ReadLine().Trim
								Loop
								
								If S <> "##endconst" 
									Css.AppendLine(S)
								End if                                        
							Else If S = "##mobile"
								REM If S.Substring(0, 8) = "##mobile"
									S = oRead.ReadLine().Trim
									Do While S <> "##endif" and S <> "##else"      
										If IsMobile()
											Css.AppendLine(S & Environment.NewLine)
										End if
										S = oRead.ReadLine().Trim
									Loop
									
									If S = "##else" 
										S = oRead.ReadLine().Trim
										Do While S <> "##endif"
											If Not IsMobile()
												Css.AppendLine(S & Environment.NewLine)
											End if
											S = oRead.ReadLine().Trim
										Loop
									End if
									
									If S <> "##endif"
										Css.AppendLine(S)
									End if                                        
								REM End if
								
							Else If S.Length >= 9
								If S.Substring(0, 9) = "##version"
									Dim Values = S.Split("=")(1).Trim
									S = oRead.ReadLine().Trim
									Do While S <> "##endif" and S <> "##else"      
										If Values.Contains(BrowserName()&BrowserVer)                                 
											Css.AppendLine(S & Environment.NewLine)
										End if
										S = oRead.ReadLine().Trim
									Loop
									
									If S = "##else" 
										S = oRead.ReadLine().Trim
										Do While S <> "##endif"
											If Not Values.Contains(BrowserName()&BrowserVer)                                 
												Css.AppendLine(S & Environment.NewLine)
											End if
											S = oRead.ReadLine().Trim
										Loop
									End if
								Else If S.Substring(0, 9) = "##browser"
									Dim Values = S.Split("=")(1).Trim
									S = oRead.ReadLine().Trim
									Do While S <> "##endif" and S <> "##else"       
										If Values.Contains(BrowserName())                                 
											Css.AppendLine(S & Environment.NewLine)
										End if
										S = oRead.ReadLine().Trim
									Loop
									
									If S = "##else" 
										S = oRead.ReadLine().Trim
										Do While S <> "##endif"
											If Not Values.Contains(BrowserName())                                 
												Css.AppendLine(S & Environment.NewLine)
											End if
											S = oRead.ReadLine().Trim
										Loop
									End if
								End if
								
								If S <> "##endif"
									Css.AppendLine(S)
								End if                                        
							Else
								Css.AppendLine(S)    
							End if 'If S.Length >= 12
						End if                        
					Else
						Css.AppendLine(S)
					End if
				End if
			Loop

			Css.AppendLine("/* End of module " & "*/")                    
			IncludedCss.AppendLine(Params.PopulateVariables(Css).ToString)

			oRead.Close()
			oRead.Dispose()
		End Sub

		Public Function FileExists(ByVal Filename As String, Optional Path As String = "") As Boolean
			If Path = ""
				Path = "\app\css"
			Else
				Path = "\" + Path + "\css"
			End if

			Return System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), Filename))
		End Function
						
		Private oReadTemplate As System.IO.StreamReader
		Public Sub GatherVariables(ByVal oRead As System.IO.StreamReader, ByVal Params As EasyStringDictionary, ByVal EndString As String)
			Dim S As String = "##template"
			Dim Allow As Boolean = True
			Dim Variable As String()
			
			REM Return
			REM S = oReadTemplate.ReadLine().Trim
			Do
				Allow = S.Length > 2
				If Allow
					Allow = S.Substring(0, 2) <> "/*" and S.Substring(S.Length-2, 2) <> "*/"
				End if
				
				If Allow
					If S.Length >= 9
						If S.Substring(0, 9) = "##version"
							Dim Values = S.Split("=")(1).Trim
							S = oReadTemplate.ReadLine().Trim
							Do While S <> "##endif" and S <> "##else"      
								If Values.Contains(BrowserName()&BrowserVer)                                 
									Variable = S.Split("=")
									If Variable.Length = 2
										Params.AsString(Variable(0)) = Variable(1)
									End if
								End if
								S = oReadTemplate.ReadLine().Trim
							Loop
							
							If S = "##else" 
								S = oReadTemplate.ReadLine().Trim
								Do While S <> "##endif"
									If Not Values.Contains(BrowserName()&BrowserVer)                                 
										Variable = S.Split("=")
										If Variable.Length = 2
											Params.AsString(Variable(0)) = Variable(1)
										End if
									End if
									S = oReadTemplate.ReadLine().Trim
								Loop
							End if
						Else If S.Substring(0, 9) = "##browser"
							Dim Values = S.Split("=")(1).Trim
							S = oReadTemplate.ReadLine().Trim
							Do While S <> "##endif" and S <> "##else"      
								If Values.Contains(BrowserName())                                 
									Variable = S.Split("=")
									If Variable.Length = 2
										Params.AsString(Variable(0)) = Variable(1)
									End if
								End if
								S = oReadTemplate.ReadLine().Trim
							Loop
							
							If S = "##else" 
								S = oReadTemplate.ReadLine().Trim
								Do While S <> "##endif"
									If Not Values.Contains(BrowserName())                                 
										Variable = S.Split("=")
										If Variable.Length = 2
											Params.AsString(Variable(0)) = Variable(1)
										End if
									End if
									S = oReadTemplate.ReadLine().Trim
							Loop
							End if
						End if																						
					End if																						
					
					If S <> "##endif"
						Variable = S.Split("=")
						If Variable.Length = 2
							Params.AsString(Variable(0)) = Variable(1)
						End if
					End if
				End if
				
				IncludedCss.AppendLine(String.Format("/* XXX: {0}*/", S))
				S = oReadTemplate.ReadLine().Trim
			Loop Until S.Contains(EndString)
		End Sub
		
		Public Sub IncludeTemplate(ByVal CssName As String, ByVal PropertyName As String, Optional Path As String = "", Optional Options As String = "")
			Dim Css As New StringBuilder("")
			Dim Params As New EasyStringDictionary("")
			Dim S As String
			Dim Valid As Boolean = False
			Dim Variable As String()
			Params.AsString("@name") = PropertyName

			If Path = ""
				Path = "\app\css"
			Else
				Path = "\" + Path + "\css"
			End if

			Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), CssName & ".csst")
			UpdateModifiedDate(Filename)

			If Not System.IO.File.Exists(Filename)
				Css.AppendLine(String.Format("/* File not found: {0} */", FileName))
				Return
			End if

			Dim oRead As System.IO.StreamReader = System.IO.File.OpenText(Filename)
			REM oReadTemplate = System.IO.File.OpenText(Filename)
			
			Try
				Do While oRead.Peek() >= 0
					S = oRead.ReadLine().Trim
					
					If S = "##const"
						S = oRead.ReadLine().Trim
						Do While S <> "##endconst"
							Dim Values() = S.Split("=")
							Params.AsString(Values(0).Trim) = Values(1).Trim
							S = oRead.ReadLine().Trim
						Loop
						
						If S <> "##endconst" 
							IncludedCss.AppendLine(S)
						End if                                        
					Else If S = "##template"
						REM GatherVariables(oRead, Params, "##endtemplate")
						Do
							Valid = S.Length > 2
							If Valid
								Valid = S.Substring(0, 2) <> "/*" and S.Substring(S.Length-2, 2) <> "*/"
							End if

							If Valid
								If S.Contains("##version")
									Dim Values = S.Split("=")(1).Trim
									S = oRead.ReadLine().Trim
									Do While S <> "##endif" and S <> "##else"      
										If Values.Contains(BrowserName()&BrowserVer)                                 
											Variable = S.Split("=")
											If Variable.Length = 2
												Params.AsString(Variable(0)) = Variable(1)
											End if
										End if
										S = oRead.ReadLine().Trim
									Loop
									
									If S = "##else" 
										S = oRead.ReadLine().Trim
										Do While S <> "##endif"
											If Not Values.Contains(BrowserName()&BrowserVer)                                 
												Variable = S.Split("=")
												If Variable.Length = 2
													Params.AsString(Variable(0)) = Variable(1)
												End if
											End if
											S = oRead.ReadLine().Trim
										Loop
									End if
								Else If S.Contains("##browser")
									Dim Values = S.Split("=")(1).Trim
									S = oRead.ReadLine().Trim
									Do While S <> "##endif" and S <> "##else"      
										If Values.Contains(BrowserName())                                 
											Variable = S.Split("=")
											If Variable.Length = 2
												Params.AsString(Variable(0)) = Variable(1)
											End if
										End if
										S = oRead.ReadLine().Trim
									Loop
									
									If S = "##else" 
										S = oRead.ReadLine().Trim
										Do While S <> "##endif"
											If Not Values.Contains(BrowserName())                                 
												Variable = S.Split("=")
												If Variable.Length = 2
													Params.AsString(Variable(0)) = Variable(1)
												End if
											End if
											S = oRead.ReadLine().Trim
										Loop
									End if
								Else If S.Contains("##include")
								End if																						
								
								If S <> "##endif"
									Variable = S.Split("=")
									If Variable.Length = 2
										Params.AsString(Variable(0)) = Variable(1)
									End if
								End if
							End if
							
							S = oRead.ReadLine().Trim
						Loop Until S.Contains("##endtemplate")

						Dim Template As String = S.Split("=")(1)

						Params.Append(Options)
						Dim Templates As String() = Template.Split(",")
						For Each CssTemplate In Templates
							Dim CssParts As String() = CssTemplate.Split("\")
							If CssParts.Count > 1
								IncludeFileParams(CssParts(1), CssParts(0), Params.Delimeted(";"))
							Else
								IncludeFileParams(CssTemplate, "", Params.Delimeted(";"))
							End if
						Next
					Else If S.Contains("##includetemplate")
						Dim IncludeParams As New EasyStringDictionary("")
						S = oRead.ReadLine().Trim
						Do While Not S.Contains("##endinclude")
							If S.Length > 2 and S.Substring(0,2) <> "--"
								Dim Values() = S.Split("=")
								If Values.Length = 2
									IncludeParams.AsString(Values(0).Trim) = Values(1).Trim
								End if
							End if
							S = oRead.ReadLine().Trim
						Loop
						
						Dim IncludeParts As String() = S.Split("=")(1).Split("\")
						Include(String.Concat(IncludeParts(0), ".", IncludeParts(1), "="), IncludeParams.Delimeted(";"))
					Else If S.Contains("##include")
						Dim IncludeParts As String() = S.Split("=")(1).Split("\")
						If IncludeParts.Length > 1
							Include(String.Concat(IncludeParts(0), ".", IncludeParts(1)))
						Else
							REM Include(String.Concat("app", ".", IncludeParts(0)))
							Include(String.Concat("app", ".", "clients"))
						End if
					Else If S.Contains("##merge")
						Do
							S = oRead.ReadLine().Trim
							If Not S.Contains("##endmerge")
								IncludedCss.AppendLine(S)
							End if
						Loop Until S.Contains("##endmerge")
					End if
				Loop
			Catch Err As Exception
				IncludedCss.AppendLine(String.Format("/* HERE: {0}*/", S))
				IncludedCss.AppendLine(String.Format("/* ERRORX: {0}*/", Err.Message))
			End Try
			
			oRead.Close()
			oRead.Dispose()
		End Sub

		Public Function GetCss(Params As EasyStringDictionary, Optional AutoDot As Boolean = True)
			Dim S As New StringBuilder("")

			S.AppendLine(IncludedCss.ToString)

			REM For Each Section in Values
				REM Section.AppendTo(S, "", AutoDot)
			REM Next

			If Not Params Is Nothing
				Return Params.PopulateVariables(S)
			Else
				Return S.ToString
			End if
		End Function

		Public Function GetCss(Optional AutoDot As Boolean = True)
			Dim S As New StringBuilder("")

			S.AppendLine(IncludedCss.ToString)

			REM For Each Section in Values
				REM Section.AppendTo(S, "", AutoDot)
			REM Next

			If Not Params Is Nothing
				Return Params.PopulateVariables(S)
			Else
				Return S.ToString
			End if
		End Function

		Public Overrides Function GetContent() As String
			Dim S As New StringBuilder("")

			S.AppendLine(IncludedCss.ToString)

			If Not Params Is Nothing
				Return Params.PopulateVariables(S)
			Else
				Return S.ToString
			End if
		End Function

	End Class	
End Namespace
