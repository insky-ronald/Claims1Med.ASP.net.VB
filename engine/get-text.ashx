<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SubHandler
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "edit"
			If Request.Params("text_id") IsNot Nothing
				Using DBText = DBConnections("DBSecure").OpenData("GetText", {"id","visit_id"}, {Request.Params("text_id"), Session("VisitorID")}, "")
					Output.AsJson("data") = DatatableToJson(DBText)
				End Using
			Else
				Dim FileName As String = System.IO.Path.Combine(AppUtils.Paths.AsString("EngineTexts"), Request.Params("text_name") & ".html")
				Dim Content As String = ""
				
				If System.IO.File.Exists(FileName) Then
					Content = System.IO.File.ReadAllText(Filename)
					' Using sr As New System.IO.StreamReader(Filename)
						' Content = sr.ReadToEnd()
					' End Using
					' Using sr = System.IO.File.OpenText(Filename)
						' Content = sr.ReadToEnd()
					' End Using
				End if
				
				Using DBText = New System.Data.DataTable("Output")
					DBText.Rows.Add(DBText.NewRow())
					DBText.Columns.Add("notes_html", GetType(String))
					DBText.Rows(0).Item("notes_html") = Content
					
					Output.AsJson("data") = DatatableToJson(DBText)
				End Using 
			End if
			
			REM Rights.AsBoolean("add") = False
			REM Rights.AsBoolean("edit") = False
			REM Rights.AsBoolean("delete") = False
			
			REM Output.AsJson("rights") = Rights.JsonString()
		Else If Cmd = "update"
			If Request.Params("text_id") IsNot Nothing
				Using Text = DBConnections("DBSecure").PrepareCommand("AddText")
						Text.SetParameter("id", Request.Params("text_id"))
						Text.SetParameter("text", Request.Params("html"))
						Text.SetParameter("action", 10)
						Text.SetParameter("visit_id", Session("VisitorID"))
						Text.Execute()
				
						Output.AsJson("status") = Text.GetParameter("action_status_id").Value
						Output.AsString("message") = Text.GetParameter("action_msg").Value
				End Using                
			Else
				' Save to file
				Dim FileName As String = System.IO.Path.Combine(AppUtils.Paths.AsString("EngineTexts"), Request.Params("text_name") & ".html")
				System.IO.File.WriteAllText(Filename, Request.Params("html"))
				' Output.AsString("file") = FileName
			End if
		Else If Cmd = "test"
		End if
	End Sub
End Class