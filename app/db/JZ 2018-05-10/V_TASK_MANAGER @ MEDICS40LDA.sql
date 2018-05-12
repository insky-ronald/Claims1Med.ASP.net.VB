USE [MEDICS40LDA]
GO

/****** Object:  View [dbo].[V_TASK_MANAGER]    Script Date: 5/12/2018 7:43:49 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER   VIEW [dbo].[V_TASK_MANAGER]
/****************************************************************************************************
 Update History:
 ===============

 19MAY2009:	MediCS 4.0
 17JUN2009:	
 22-APR-2015: Add color code to task manager #1056363
 05-MAY-2015: #1056363, change parameter to DATEDIF from days (d) - seconds (s) to be more accurate
****************************************************************************************************/
AS
SELECT 
    IS_SELECTED = cast(0 as bit),
    ia.ACTION_ID,
    C.CLAIM_REF,
    C.CASE_OWNER,
    I.TRANS_REF,
    I.TRANS_TYPE,
    i.TRANS_DATE,
    i.DAY_OUT,
	c.IP_ID,
    mo.MODULE_NAME,
    ia.ACTION_OWNER,
    ia.DUE_DATE,
    ia.ACTION_CLASS,
    ActionClass = ac.CLASS_NAME,
    ia.ACTION_CODE,
    ActionName = a.ACTION_NAME,
    NAME = m.MEMBER_NAME, 
    m.FIRST_NAME,
    m.MIDDLE_NAME,
    m.LAST_NAME,
    I.PROVIDER_NAME,
    C.CLAIM_NO,
    ia.INVOICE_ID,
    c.CLM_TYPE,
    CLAIM_TYPE = st.CLM_TYPE_NAME,
    i.CLM_SUB_TYPE,
    SUB_TYPE = st.SERVICE_NAME,
    cc.CLIENT_ID,
    cc.CLIENT_NAME,
    p.PROD_CODE,
    p.PRODUCT_NAME,
    p.POLICY_NO,
    p.POLICY_HOLDER,
    DAYS = datediff(dd, getdate(), ia.DUE_DATE),
    IS_DUE = CASE WHEN datediff(mi, getdate(), ia.DUE_DATE) <= 0 THEN 1 ELSE 0 END,
    ACTION_SET_BY = ia.InsertUser,
    ACTION_SET_DATE = ia.InsertDate,
	ia.ACTION_NOTES,
	ss.STATUS, 
	ss.STATUS_DESC,  
	ss.INV_STATUS,
	ss.INV_STATUS_DESC,
	ss.INV_STATUS_CODE,
	ss.INV_STATUS_CODE_DESC,
    ICD_CODE = isnull(i.ICD_CODE, c.ICD_CODE),
    SHORT_NAME = isnull(icd.SHORT_NAME, icd2.SHORT_NAME)
FROM CLMINVACTION ia 
    inner join CLAIMH I on ia.INVOICE_ID = i.INVOICE_ID and I.IsDeleted = 0
    inner JOIN CLAIMMAIN C ON I.CLAIM_NO = C.CLAIM_NO and C.IsDeleted = 0
    LEFT OUTER JOIN dbo.F_Generic_Policy() p on c.POLICY_ID = p.POLICY_ID
    LEFT OUTER JOIN dbo.F_Generic_Member() m on c.IP_ID = m.IP_ID
    LEFT OUTER JOIN V_Generic_ClaimServiceType st on I.INVOICE_ID = st.INVOICE_ID
    LEFT OUTER JOIN V_Generic_ClaimClient cc on C.CLAIM_NO = cc.CLAIM_NO
    LEFT OUTER JOIN V_Generic_ClaimStatus ss on i.INVOICE_ID = ss.INVOICE_ID
    LEFT OUTER JOIN dbo.F_MODULES() mo on i.TRANS_TYPE = mo.MODULE_ID
    LEFT OUTER JOIN ACTIONCLASS ac on ia.ACTION_CLASS = ac.ACTION_CLASS
    LEFT OUTER JOIN ACTIONS a on ia.ACTION_CLASS = a.ACTION_CLASS and ia.ACTION_CODE = a.ACTION_CODE
    left outer join ICD9 icd on i.ICD_CODE = icd.ICD_CODE
    left outer join ICD9 icd2 on c.ICD_CODE = icd2.ICD_CODE
where ia.IS_DONE = 'N' and ia.ACTION_OWNER is not NULL--and C.IsDeleted = 0 and I.IsDeleted = 0


GO


