USE [MEDICS40LDA]
GO

ALTER   VIEW [dbo].[V_RPT_MedicalExpenses]
/****************************************************************************************************
 Update History:
 ===============

 19MAY2009:	MediCS 4.0

****************************************************************************************************/
AS
select	
	i.invoice_id as [ID],
	c.InsertDate as case_opened,
	c.claim_ref as claim_no,
	i.trans_ref as reference_no,
	i.invoice_no, 
       
	i.Status,
	r.status_desc, --r.res_desc as status,

	n.comp_name as Claimant,
	p.policy_no,
	d.plan_desc,	
	Age = datediff(year, n.dob, getdate()),
	a.group1 as AgeBand,
	n.Sex,

	c.clm_type,
	i.clm_sub_type,
	s.service_name,
	i.trans_date as incident_date,

	i.prov_id,
	i.provider_name,
	i.doc_id,
	i.doctor_name,

	i.actual,
	i.payable,
	i.paid,
	i.icd_code,
	icd_desc = i9.descrption,
	m.CLIENT_ID as client_id --added May 23, 2018 for Claims1Med
from CLAIMH i
	inner join CLAIMMAIN c on i.CLAIM_NO = c.CLAIM_NO
	inner join POLICY p on c.POLICY_ID = p.POLICY_ID
	inner join MEMBERS m on c.IP_ID = m.IP_ID
	inner join CLIENT n on m.COMP_ID = n.COMP_ID
	inner join ICD9 i9 on i.ICD_CODE = i9.ICD_CODE
	inner join PLANHIST h on m.HIST_ID = h.HIST_ID
	inner join PLANDEF d on h.PLAN_CODE = d.PLAN_CODE

	left outer join AGEBAND a on datediff(year, n.dob, getdate()) = a.AGE
	inner join F_INVOICE_STATUS() r on i.STATUS = r.STATUS_CODE and i.TRANS_TYPE = r.MODULE_ID
	inner join SERVICETYPES s on i.CLM_SUB_TYPE = s.SERVICE_TYPE and i.TRANS_TYPE = s.MODULE_ID
where i.IsDeleted = 0


GO


