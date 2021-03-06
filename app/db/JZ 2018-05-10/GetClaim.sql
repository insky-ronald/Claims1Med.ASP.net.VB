ALTER PROCEDURE [dbo].[GetClaim]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
@id int = 0,
@visit_id AS bigint = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        c.id,
        c.claim_no,
        c.member_id,
        m.main_name_id,
        c.name_id,
        c.policy_id,
        c.client_id,
        rtrim(c.product_code) as product_code,
        rtrim(c.sub_product) as sub_product, -- 10-SEP-2014: PANIN
        rtrim(c.plan_code) as plan_code,
		rtrim(c.plan_code2) as plan_code2,
        rtrim(c.claim_type) as claim_type,
		ct.claim_type as claim_type_name,
        c.base_currency_code,
        c.client_currency_code,
        c.eligibility_currency_code,
        c.notification_date,
        c.case_owner,
        c.status_code,
        S.status,
        c.hcm_reference,
        c.reference_no1,
        c.reference_no2,
        c.reference_no3,
        --c.IS_LARGE_LOSS,
        csv_service_id = CAST(ISNULL(I.id, 0) AS int),
        c.is_accident,
        c.accident_date,
        rtrim(c.accident_code) as accident_code,
        a.accident,
        c.is_preexisting,
        c.first_symptom_date,
        c.first_consultation_date,
        c.travel_departure_date,
        c.first_consultation_date,
        c.incident_date,
        c.country_of_incident,
        c.diagnosis_code,
		icd.diagnosis,
        --c.diagnosis_notes,
        --icd.diagnosis,
        --c.final_diagnosis_code
        c.create_date,
        c.create_user,
        c.update_date,
        c.update_user,
        u1.name AS create_user_name,
        u2.name AS update_user_name
    FROM claims c
    LEFT OUTER JOIN members m ON c.member_id = m.id
    LEFT OUTER JOIN claim_status S ON c.status_code = S.code
	LEFT OUTER JOIN claim_types ct on c.claim_type = ct.code
    LEFT OUTER JOIN services i ON c.id = I.claim_id AND I.claim_type = 'CSV'
    LEFT OUTER JOIN accident_types a ON c.accident_code = a.code
	LEFT OUTER JOIN icd on c.diagnosis_code = icd.code
    LEFT JOIN users u1 ON c.create_user = u1.user_name 
	LEFT JOIN users u2 ON c.update_user = u2.user_name
    WHERE c.id = @id

/*
	select  
		c.CLAIM_NO,	
		c.IS_PREEXISTING,
		c.IS_ACCIDENT,
		c.SYMP1_DATE,
		c.CONSULT1_DATE,
		c.INC_DATE,
		c.INC_CTRY,
		c.ACCD_DATE,
		c.ACCD_CODE,
		c.ICD_CODE,
		c.CONDITION,
		ICDDescription = cast(ICD.DESCRPTION as text),
		C.FINAL_ICD,
		FINAL_CONDITION = cast(C.FINAL_CONDITION as text),
		FINAL_Description = cast(icd2.descrption as text),
		AccidentType = A.ACCD_DESC
	from CLAIMMAIN c
		left outer join ICD9 ICD on C.ICD_CODE = ICD.ICD_CODE
		left outer join ICD9 icd2 on C.final_icd = icd2.icd_code
		left outer join ACCIDENTTYPES A on C.ACCD_CODE = A.ACCD_CODE
	where CLAIM_NO = @CLAIM_NO
*/
END

