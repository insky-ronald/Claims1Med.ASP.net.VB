<%@ Control Language="VB" AutoEventWireup="true" CodeFile="login.ascx.vb" Inherits="Login" %>
<div class="content">
	<div class="logo" style="height: 45px"> 
		<div style="float:left"> 
			<img src='<% =AppUtils.Settings.AsString("LoginIcon") %>?v=1'>
		</div> 
		<div style="float:left; height: 100%; line-height:45px; padding-left: 10px; font-family: 'Average Sans'; font-size:14pt; word-spacing:0px"> 
			<a style="font-style:italic"><% =AppUtils.Settings.AsString("LoginSlogan") %></a>
		</div> 
	</div>
	<div class="login">
		<div xsec="title">
			log in to <% =AppUtils.Settings.AsString("LoginDomain") %><a>.com</a>
		</div>
		<form id="login-form" name="login" method="post" action="<% =Action %>">
			<div xsec="login">
				<div xsec="login-left">
					
						<label>username</label> 
						<input type='text' id='username' name='username'>
						
						<label>password</label>
						<input type='password' id='password' name='password'>
						
						<input type="hidden" name="redirect" value="<% =Referer %>">
						
						<div xsec="footer">
							<input type='submit' id='submit' name='submit' value='Sign In' class='login-btn'>
						</div>
					
				</div>
				<div xsec="login-right">
					<label>Did you forget your password?</label>
					<a>Recover it here</a>
					<label style="margin-top:20px;">Register to evaluate?</label>
					<a>Sign up</a>
				</div>
			</div>
			<% If Session("LoginError") IsNot Nothing %>
				<div class='error-message'><% =Session("LoginError") %></div>
			<% End if %>
		</form>				
	</div>
</div>
