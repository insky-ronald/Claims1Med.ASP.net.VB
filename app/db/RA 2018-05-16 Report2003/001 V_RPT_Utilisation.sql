USE [MEDICS40LDA]
GO

ALTER      VIEW [dbo].[V_RPT_Utilisation]
AS
select	
	i.invoice_id as [ID],
	m.client_id,
	n.comp_name as Claimant,
	ph.comp_name as policy_holder,
	p.policy_id,
	p.policy_no,
	d.plan_desc,

	c.claim_ref as claim_no,--edited by jayson removed as Claim_no 11-11-09
	i.trans_ref,
	i.day_in as treatment_date,
	i.icd_code,
	icd_desc = i9.descrption,

	i.prov_id,
	i.provider_name,
	i.doc_id,
	i.doctor_name,
	case when datediff(day, i.day_in, i.day_out) = 0 then 1 else datediff(day, i.day_in, i.day_out) end as length_of_stay,
	
	c.clm_type,
	i.clm_sub_type,
	s.service_name,
        --c.CLAIM_NO,
	i.actual,
	i.payable,
	i.paid,

	datediff(year, n.dob, getdate()) as Age,
	a.group1 as AgeBand,

	i.Status,
	r.status_desc

from CLAIMH i
	inner join CLAIMMAIN c on i.CLAIM_NO = c.CLAIM_NO
	inner join POLICY p on c.POLICY_ID = p.POLICY_ID
	inner join MEMBERS m on c.IP_ID = m.IP_ID
	inner join CLIENT n on m.COMP_ID = n.COMP_ID
	inner join ICD9 i9 on i.ICD_CODE = i9.ICD_CODE
	left outer join AGEBAND a on datediff(year, n.dob, getdate()) = a.AGE

	inner join F_INVOICE_STATUS() r on i.STATUS = r.STATUS_CODE and i.TRANS_TYPE = r.MODULE_ID
	inner join SERVICETYPES s on i.CLM_SUB_TYPE = s.SERVICE_TYPE and i.TRANS_TYPE = s.MODULE_ID
	inner join CLIENT ph on p.COMP_ID = ph.COMP_ID

	inner join PLANHIST h on m.HIST_ID = h.HIST_ID
	inner join PLANDEF d on h.PLAN_CODE = d.PLAN_CODE

GO


