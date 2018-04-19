<%@ WebHandler Language="VB" Class="Api" %>

Imports System.IO
Imports System.Net
Imports System.Xml

REM http://codedisplay.com/how-to-read-or-consume-rss-feed-in-asp-net-c-vb-net/
REM http://www.who.int/about/licensing/rss/en/
REM http://codedisplay.com/feed/

REM usage
REM http://medics5.insky-inc.com/api/rss/get

Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
		
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)
		REM Dim MyRssRequest As WebRequest = WebRequest.Create("http://codedisplay.com/?feed=rss")
		Dim MyRssRequest As WebRequest = WebRequest.Create("http://www.who.int/feeds/entity/mediacentre/news/en/rss.xml")
		REM Dim MyRssRequest As WebRequest = WebRequest.Create("http://www.who.int/feeds/entity/emergencies/zika-virus/en/rss.xml")

		REM Response.End
		REM Return
		Dim MyRssResponse As WebResponse = MyRssRequest.GetResponse()

		Dim MyRssStream As Stream = MyRssResponse.GetResponseStream()
	 
		Dim MyRssDocument As XmlDocument = New XmlDocument()
		MyRssDocument.Load(MyRssStream)
	 
		Dim MyRssList As XmlNodeList = MyRssDocument.SelectNodes("rss/channel/item")

		Response.Write(MyRssList.Count & Environment.NewLine)
		
		Dim sTitle As String = ""
		Dim sLink As String = ""
		Dim sDescription As String = ""
		Dim sDate As String = ""
	 
		'Iterate/Loop through RSS Feed items
		For i As Integer = 0 To MyRssList.Count - 1
			Dim MyRssDetail As XmlNode
	 
			MyRssDetail = MyRssList.Item(i).SelectSingleNode("pubDate")
			If Not MyRssDetail Is Nothing Then
				sDate = MyRssDetail.InnerText
			Else
				sDate = ""
			End If
	 
			MyRssDetail = MyRssList.Item(i).SelectSingleNode("title")
			If Not MyRssDetail Is Nothing Then
				sTitle = MyRssDetail.InnerText
			Else
				sTitle = ""
			End If
	 
			MyRssDetail = MyRssList.Item(i).SelectSingleNode("link")
			If Not MyRssDetail Is Nothing Then
				sLink = MyRssDetail.InnerText
			Else
				sLink = ""
			End If
	 
			MyRssDetail = MyRssList.Item(i).SelectSingleNode("description")
			If Not MyRssDetail Is Nothing Then
				sDescription = MyRssDetail.InnerText
			Else
				sDescription = ""
			End If
			
			Response.Write(sDate & Environment.NewLine)
			Response.Write(sTitle & Environment.NewLine)
			Response.Write(sDescription & Environment.NewLine)
			Response.Write(sLink & Environment.NewLine)
			Response.Write("---------------------------------" & Environment.NewLine)
		Next

		Response.End
		Output.AsInteger("status") = 0
		REM Dim Connection As String = Cmd
		REM Dim Datasource As String = Request.Params("src").ToString
		REM Dim Params As New List(Of String)
		REM Dim Values As New List(Of Object)
			
		REM For Each S In Request.QueryString
			REM Params.Add(S)
			REM Values.Add(Request.Params(S))
		REM Next

		REM Dim Data As System.Data.DataTable = Nothing
		
		REM Try
			REM If Not Session("ConnectionID") is Nothing
				REM Data = DatabaseUtils.DBConnections(Connection).OpenData(Datasource, Params.ToArray, Values.ToArray, "")
			REM Else
				REM Output.AsString("Error") = "A valid session was not found."
			REM End if
		REM Catch Err As Exception
			REM Output.AsString("Error") = Datasource 'Err.Message
		REM End Try

		REM If Not Data is Nothing
			REM Output.AsJson("data") = DataTableToJson(Data)
		REM End if                                                                        
		
	End Sub
	
End Class
