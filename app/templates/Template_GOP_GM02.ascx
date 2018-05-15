<%@ Control Language="VB" AutoEventWireup="false" CodeFile="Template.ascx.vb" Inherits="Template" %>
<div class="template">
	<div class="header">
		<img src="/app/images/owner_logo.png"></img>
	</div>
	<div class="title">
		CONFIRMAÇÃO PARA SOLITAÇÃO / GARANTIA PARA INTERNAMENTO
	</div>
	<table class="reference" cellpadding="0" cellspacing="0" border="0">
		<tbody>
			<tr>
				<td>Referência Intl. SOS:</td><td><% =DBData.Eval("@reference_no") %></td>
			</tr>
			<tr>
				<td>Data:</td><td><% =DateTime.Parse(DBData.Eval("@date")).ToString("MMMM d, yyyy") %></td>
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
	
	<div class="attention">Atenção:</div>
	<div class="dear">Caro Provedor,</div>
	<div class="sub-title">Garantia de Despesas  Médicas para Internamento</div>

	<table class="patient-info" cellpadding="0" cellspacing="0" border="0">
		<tbody>
			<tr>
				<td>
					<table x-sec="sub" cellpadding="0" cellspacing="0" border="0">
						<tbody>
							<tr>
								<td>Nome do Paciente:</td><td><% =DBData.Eval("@patient_name") %></td>
							</tr>
							<tr>
								<td>Nome da Empresa:</td><td><% =DBData.Eval("@client_name") %></td>
							</tr>
							<tr>
								<td>Data de Admissão:</td><td><% =DateTime.Parse(DBData.Eval("@start_date")).ToString("MMMM d, yyyy") %></td>
							</tr>
						</tbody>
					</table>
				</td>
				<td>
					<table x-sec="sub" cellpadding="0" cellspacing="0" border="0">
						<tbody>
							<tr>
								<td>Referencia do membro no:</td><td><% =DBData.Eval("@certificate_no") %></td>
							</tr>
							<tr>
								<td></td><td></td>
							</tr>
							<tr>
								<td>Estimativa de data de alta:</td>									
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
	
	<p>Esta notificação serve para informar que garantimos as despesas médicas do paciente acima, que foi admitido no vosso hospital sobre os cuidados do Drª <% =DBData.Eval("@doctor_name") %>, e foi diagnosticado com <% =DBData.Eval("@condition") %>.</p>

	<table class="guarantee" cellpadding="0" cellspacing="0" border="0">
		<tbody>
			<tr>
				<td>1. Todas facturas médica  até</td><td><% =Row.Item("currency_code") %> <% =String.Format("{0:#,##0.00}", Row.Item("misc_amount")) %> incluindo os honorários do médico</td>
			</tr>
			<tr>
				<td>2. Quarto & Board</td><td><% =Row.Item("currency_code") %> <% =String.Format("{0:#,##0.00}", Row.Item("rnb_amount")) %> diário</td>
			</tr>
		</tbody>
	</table>
	
	<div class="sub-title">Atenção:</div>
	<table class="bullet" cellpadding="0" cellspacing="0" border="0">
		<tbody>
			<tr>
				<td>(a)</td><td>Esta garantia de internamento só é válida para o tratamento indicado acima requerido pelo vossa clinica com as datas acima citadas. </td>
			</tr>
			<tr>
				<td>(b)</td><td>Qualquer custo adicional que exceda o limite acima indicado, por favor queiram informar nos de imediato para ser avaliado. Não nos responsabilizamos por qualquer custo extra sem  aviso prévio, ou sem a nossa autorização.</td>
			</tr>
			
			<% If Row.Item("remarks").ToString <> String.Empty %>
				<tr>
					<td>(c)</td><td><% =Row.Item("remarks") %></td>
				</tr>
			<% End if %>
		</tbody>
	</table>
	
	<div class="sub-title">Esta garantia não inclui os gastos abaixo indicados. Por favor queira cobrar ao paciente antes do dia da alta.</div>
	<div class="two-columns indent">
		<div>
			<table class="bullet" cellpadding="0" cellspacing="0" border="0">
				<tbody>
					<tr><td>1.</td><td>Telecomincações</td></tr>
					<tr><td>2.</td><td>Gastos extras de quarto</td></tr>
					<tr><td>3.</td><td>Refeições extras</td></tr>
					<tr><td>4.</td><td>Taxa de Inscrisão</td></tr>
				</tbody>
			</table>
		</div>
		<div>
			<table class="bullet" cellpadding="0" cellspacing="0" border="0">
				<tbody>
					<tr><td>5.</td><td>Taxa de relatório médico (caso necessite)</td></tr>
					<tr><td>6.</td><td>Outros custos como por exemplo: Aluguer de cadeira de rodas or programas de televisão</td></tr>
				</tbody>
			</table>
		</div>
	</div>
	
	<p>Quiera por favor enviar nos a documentação necessária o mais rápido possível em até  30 dias a contar da data deste documento.</p>
	
	<div class="two-columns indent">
		<div>
			<table class="bullet" cellpadding="0" cellspacing="0" border="0">
				<tbody>
					<tr><td>1.</td><td>Factura duplicada</td></tr>
					<tr><td>3.</td><td>Cópia do relatório Médico</td></tr>
				</tbody>
			</table>
		</div>
		<div>
			<table class="bullet" cellpadding="0" cellspacing="0" border="0">
				<tbody>
					<tr><td>2.</td><td>Cópia desta carta</td></tr>
				</tbody>
			</table>
		</div>
	</div>
	<div class="two-columns" style="margin-top:0.25in">
		<div style="width:30%">
			Endereço indicado:
		</div>
		<div>
			<div>INTERNATIONAL SOS ANGOLA</div>
			<div>Rua S, Sector Talatona, Zona CC B-</div>
			<div style="margin-top:0.25in">(ATTENTION: HAS DEPARTMENT), Luanda - Angola</div>
		</div>
	</div>
	
	<p>Agradecemos a sua colaboração:</p>
	<p>Atenciosamente,</p>
	
	<p>
		<div><% =Row.Item("sender_name") %></div>
		<div><% =Row.Item("sender_designation") %></div>
	</p>
</div>
