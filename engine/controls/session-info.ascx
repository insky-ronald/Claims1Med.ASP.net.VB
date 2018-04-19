<%@ Control Language="VB" AutoEventWireup="true" %>
<table class="session" border="0" cellspacing="0" style="width: 100%;">
	<thead grid-sec="inner-header">
		<tr>
			<th style="width: 200px; min-width: 200px; max-width: 200px;"></th>
			<th style="width: 100%;"></th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Status</td>
			<% If Session("ConnectionID") IsNot Nothing %>
				<td>Logged in</td>
			<% Else %>
				<td>Not logged in</td>
			<% End if%>
		</tr>
		<tr>
			<td>Application ID</td><td><% = Session("ApplicationID") %></td>
		</tr>
		<tr>
			<td>Visitor ID</td><td><% = Session("VisitorID") %></td>
		</tr>
		<% If Session("ConnectionID") IsNot Nothing %>
		<tr>
			<td>User ID</td><td><% = Session("UserNo") %></td>
		</tr>
		<tr>
			<td>Login Name</td><td><% = Session("UserID") %></td>
		</tr>
		<tr>
			<td>User Name</td><td><% = Session("UserName") %></td>
		</tr>
		<% End if%>
		<tr>
			<td>Session ID</td><td><% = Session.SessionID.ToUpper %></td>
		</tr>
		<tr>
			<td>Request.UserAgent</td><td><% = HttpContext.Current.Request.UserAgent %></td>
		</tr>
		<tr>
			<td>BrowserName (@browser)</td><td><% = BrowserName %></td>
		</tr>
		<tr>
			<td>BrowserVer (@ver)</td><td><% = BrowserVer %></td>
		</tr>
	</tbody>
</table>

