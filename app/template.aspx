<%@ Page Title="" Language="VB" AutoEventWireup="false" CodeFile="template.aspx.vb" Inherits="Template" %>

<div class="template">
	<div class="header">
		<img src="/app/images/owner_logo.png"></img>
	</div>
	<div class="title">
		CONFIRMATION OF REQUEST / GUARANTEE FOR HOSPITALIZATION
	</div>
	<table class="reference" cellpadding="0" cellspacing="0" border="0">
		<tbody>
			<tr>
				<td>Our Reference:</td><td><% =DBData.Eval("@reference_no") %></td>
			</tr>
			<tr>
				<td>Date:</td><td><% =DateTime.Parse(DBData.Eval("@date")).ToString("MMMM d, yyyy") %></td>
			</tr>
		</tbody>
	</table>
	<div class="provider">
		<div x-sec="name"><% =DBData.Eval("@provider_name") %></div>
		<div x-sec="address">
			<% =DBData.Eval("@provider_address1") %>
			<% =DBData.Eval("@provider_address2") %>
			<% =DBData.Eval("@provider_address3") %>
		</div>
	</div>
	
	<div class="attention">Attention:</div>
	<div class="dear">Dear Sir/Madam,</div>
	<div class="sub-title">GUARANTEE OF MEDICAL EXPENSES FOR <% =DBData.Eval("@service_type") %></div>

	<table class="patient-info" cellpadding="0" cellspacing="0" border="0">
		<tbody>
			<tr>
				<td>
					<table x-sec="sub" cellpadding="0" cellspacing="0" border="0">
						<tbody>
							<tr>
								<td>Patient Name:</td><td><% =DBData.Eval("@patient_name") %></td>
							</tr>
							<tr>
								<td>Client's Name:</td><td><% =DBData.Eval("@client_name") %></td>
							</tr>
							<tr>
								<td>Date of Admission:</td><td><% =DateTime.Parse(DBData.Eval("@start_date")).ToString("MMMM d, yyyy") %></td>
							</tr>
						</tbody>
					</table>
				</td>
				<td>
					<table x-sec="sub" cellpadding="0" cellspacing="0" border="0">
						<tbody>
							<tr>
								<td>Member Reference No.:</td><td><% =DBData.Eval("@certificate_no") %></td>
							</tr>
							<tr>
								<td></td><td></td>
							</tr>
							<tr>
								<td>Estimation Date of Discharge:</td>									
								<td>
									<% If Not DBData.Rows(0).IsNull("end_date") %>
										<% =DateTime.Parse(DBData.Eval("@end_date")).ToString("MMMM d, yyyy") %>
									<% End if %>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</div>
