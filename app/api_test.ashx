<%@ WebHandler Language="VB" Class="Api" %>

Imports System.IO
Imports System.Web.Mvc
' Imports System.AspNet.Mvc
Imports System.Web
Imports System.Web.Optimization
' Imports Microsoft.AspNet.Web.Optimization

Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
		
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)

		Response.Clear()
		' Response.ContentType = "application/x-javascript"
		
		' Try
			' Response.Write(Environment.Version.ToString())
			' Dim Bundler = New ScriptBundle("~/app/scripts")
			' Bundler.Include("~/app/scripts/__init.js")
			
			' Dim Collection As BundleCollection  = New BundleCollection()
			' Collection.Add(Bundler)
			
			' Dim Resolver As BundleResolver = New BundleResolver(Collection)
			
			' Dim Files = Bundler.GenerateBundleResponse(Response)
			' Response.Write(Resolver.GetBundleContents("~/app/scripts").ToString)
			' Response.Write(Bundler.ToString)
			' Response.Write(Bundler.Builder.BuildBundleContent())
		' Catch Err As Exception
			' Response.Write(Err.Message)
		' End Try
		
		Dim Name As String = "Datejs-master/build/date.js"
		Response.Write(HttpContext.Current.Server.MapPath("~/scripts/" & Name))
		Response.End
	End Sub
	
End Class
