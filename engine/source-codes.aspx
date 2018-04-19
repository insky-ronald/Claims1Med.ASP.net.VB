<%@ Language="VB" EnableViewState="False" AutoEventWireup="false" CodeFile="source-codes.aspx.vb" Inherits="SourceCodes" %>

<h1><% =MainPage %></h1>
<ul>
	<li>
		<a href="/api/tools/appinit"  target="appinit">Initialize application configuration<a/>
	</li>
</ul>

<h1>Sub Page...</h1>
<ul>
	<li>
		<a href="/api/tools/dbinit"  target="dbinit">Initialize all database<a/>
	</li>
	
	<% Dim ConnectionNames = AppUtils.Databases.AsString("DatabaseConnections").Split(",") %>
	<% For Each ConnectionName In ConnectionNames %>
		<li>
			<a href="/api/tools/dbinit?name=<% =ConnectionName %>"  target="dbinit">Initialize database <% =ConnectionName %><a/>
		</li>
	<% Next %>
</ul>
