<%@ Control Language="VB" AutoEventWireup="false" CodeFile="Template.ascx.vb" Inherits="Template" %>
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
	
	<p>This is to confirm our guarantee of medical expenses for the above patient who was admitted to your hospital under the care of Dr. <% =DBData.Eval("@doctor_name") %>, patient's diagnosis <% =DBData.Eval("@condition") %>.</p>

	<table class="guarantee" cellpadding="0" cellspacing="0" border="0">
		<tbody>
			<tr>
				<td>1. All medically related bill/(s) up to</td><td><% =Row.Item("currency_code") %> <% =String.Format("{0:#,##0.00}", Row.Item("misc_amount")) %> inclusive of doctor's bill</td>
			</tr>
			<tr>
				<td>2. Room & Board</td><td><% =Row.Item("currency_code") %> <% =String.Format("{0:#,##0.00}", Row.Item("rnb_amount")) %> daily</td>
			</tr>
		</tbody>
	</table>
	
	<div class="sub-title">Please note:</div>
	<table class="bullet" cellpadding="0" cellspacing="0" border="0">
		<tbody>
			<tr>
				<td>(a)</td><td>This Guarantee of Hospitalisation is valid only for the above stated treatment provided by your Hospital during the specified dates.</td>
			</tr>
			<tr>
				<td>(b)</td><td>For all additional services, extended length of stay and total bill/(s) exceeding this limit, we are to be informed immediately for further review. We cannot accept responsibility for excess charges without further reference to this office.</td>
			</tr>
			
			<% If Row.Item("remarks").ToString <> String.Empty %>
				<tr>
					<td>(c)</td><td><% =Row.Item("remarks") %></td>
				</tr>
			<% End if %>
		</tbody>
	</table>
	
	<div class="sub-title">This guarantee does not include the following charges. Please collect payment from the patient or his/her representative directly prior to discharge.</div>
	<div class="two-columns indent">
		<div>
			<table class="bullet" cellpadding="0" cellspacing="0" border="0">
				<tbody>
					<tr><td>1.</td><td>Telecommunication</td></tr>
					<tr><td>2.</td><td>Excess charges on Room & Board</td></tr>
					<tr><td>3.</td><td>Extra Meals</td></tr>
					<tr><td>4.</td><td>Service Tax</td></tr>
				</tbody>
			</table>
		</div>
		<div>
			<table class="bullet" cellpadding="0" cellspacing="0" border="0">
				<tbody>
					<tr><td>5.</td><td>Registration fee</td></tr>
					<tr><td>6.</td><td>Other miscellaneous charges: eg. Rental of deck chair or television etc.</td></tr>
					<tr><td>7.</td><td>General Screening Profile</td></tr>
				</tbody>
			</table>
		</div>
	</div>
	
	<p>Please send us the following documentaion as soon as possible and in case within 30 days from the date of this letter:</p>
	
	<div class="two-columns indent">
		<div>
			<table class="bullet" cellpadding="0" cellspacing="0" border="0">
				<tbody>
					<tr><td>1.</td><td>Invoice in duplicate</td></tr>
					<tr><td>3.</td><td>Copy of medical report</td></tr>
				</tbody>
			</table>
		</div>
		<div>
			<table class="bullet" cellpadding="0" cellspacing="0" border="0">
				<tbody>
					<tr><td>2.</td><td>Copy of this letter</td></tr>
				</tbody>
			</table>
		</div>
	</div>
	<div class="two-columns" style="margin-top:0.25in">
		<div style="width:30%">
			Please address to:-
		</div>
		<div>
			<div>INTERNATIONAL SOS ANGOLA</div>
			<div>Rua Luis Mota Feo, n?22, Luanda-Angola</div>
			<div style="margin-top:0.25in">(ATTENTION: HAS DEPARTMENT)</div>
		</div>
	</div>
	
	<p>Thank you for your co-operation</p>
	<p>Yours sincerely,</p>
	
	<p>
		<div><% =Row.Item("sender_name") %></div>
		<div><% =Row.Item("sender_designation") %></div>
	</p>
</div>
