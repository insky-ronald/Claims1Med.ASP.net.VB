USE [MEDICS52]
GO

/****** Object:  View [dbo].[v_service]    Script Date: 5/15/2018 4:06:49 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER VIEW [dbo].[v_service]
AS
	SELECT
		s.id,
		s.claim_id,
		s.service_no,
		s.service_type,
		s.service_sub_type,
		st.sub_type as service_name,
		st.display_name as service_display_name,
		s.service_date,
		s.status_code,
		s.sub_status_code,
		s.sequence_no,
		s.version_no,
		s.claim_type,
		s.document_type,
		c.client_currency_code,
		c.base_currency_code,
		c.eligibility_currency_code,
		s.claim_currency_code,
		s.claim_currency_rate_date,
		s.claim_currency_to_base,
		s.claim_currency_to_client,
		s.claim_currency_to_eligibility,
		s.settlement_advice_id,
		s.discount_type,
		s.discount_percent,
		s.discount_amount,
		p.policy_no,
		pt.name AS patient_name,
		o.name AS client_name,
		CAST(CASE
			WHEN s.discount_type IN ('1', '3', '2', '4') THEN 1
			ELSE 0
		END AS bit) AS has_provider_discount,
		s.create_date,
		s.create_user,
		s.update_date,
		s.update_user
	FROM services s
	LEFT OUTER JOIN claims c ON s.claim_id = c.id
	LEFT OUTER JOIN service_sub_types st on s.service_type = st.service_type and s.service_sub_type = st.code
	LEFT OUTER JOIN policies p ON c.policy_id = p.id
	LEFT OUTER JOIN names o ON c.client_id = o.id
	LEFT OUTER JOIN names pt ON c.name_id = pt.id

GO


