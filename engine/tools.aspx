<%@ Language="VB" EnableViewState="False" AutoEventWireup="false" %>
<%@ Register Src="~/engine/controls/session-info.ascx" TagName="SessionInfo" TagPrefix="uc" %>

<h1>Configuration</h1>
<ul>
	<li>
		<a href="/api/tools/appinit"  target="appinit">Initialize application configuration<a/>
	</li>
</ul>

<h1>Database</h1>
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

<h1>Old links</h1>
<ul>
	<li> <a href="/sys/system" target="system">System<a/> </li>
	<li> <a href="/sys/security" target="security">Security<a/> </li>
	<li> <a href="/app/api/test/test" target="test">API test<a/> </li>
</ul>

<h1>Session</h1>
<div id="session-info">
	<uc:SessionInfo runat="server" ID="SessionInfo"/>
</div>
