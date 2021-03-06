DROP PROCEDURE [dbo].[GetClaimDiagnosisSummary]
GO
/****** Object:  StoredProcedure [dbo].[GetClaimDiagnosis]    Script Date: 9/27/2017 1:42:53 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetClaimDiagnosisSummary] 
-- ***************************************************************************************************
-- Last modified on
-- 27-SEP-2017
-- *************************************************************************************************** 
(
    @claim_id int = 0, 
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @diagnosis table (
			record_id int,
			claim_id int, 
			service_id int,
			service_no varchar(25),
			service_type char(3),
			service_type_name varchar(30),
			diagnosis_type char(1),
			diagnosis_type_name varchar(10),
			diagnosis_group varchar(10),
			diagnosis_group_name varchar(230),
			diagnosis_code varchar(10),
			condition varchar(100),
			diagnosis varchar(230),
			is_default bit,
			doctor_id int,
			doctor_name varchar(100)
	)

	INSERT INTO @diagnosis
	EXEC ssp_claim_diagnosis @CLAIM_NO=@claim_id, @INVOICE_ID=0


	DECLARE @final table (
		id int identity(1,1),
		diagnosis_code varchar(10),
		parent_code varchar(10),
		diagnosis varchar(230),
		main int,
		sort varchar(100)
	)

	INSERT INTO @final(diagnosis_code, diagnosis, parent_code, main, sort)		
		SELECT DISTINCT diagnosis_group, LTRIM(substring(diagnosis_group_name, CHARINDEX(':', diagnosis_group_name)+1, 230)), '', 1, diagnosis_group+'0' FROM @diagnosis

	INSERT INTO @final(diagnosis_code, diagnosis, parent_code, main, sort)		
		SELECT DISTINCT diagnosis_code, diagnosis, diagnosis_group, 0, diagnosis_group+'1' FROM @diagnosis
		
	SELECT 
		id,
		diagnosis_code, 
		parent_code, 
		diagnosis,
		main
	FROM @final ORDER BY sort, diagnosis_code
	
	/*
	SELECT 
		record_id,
		claim_id,
		diagnosis_group,
		diagnosis_group_name = LTRIM(substring(diagnosis_group_name, CHARINDEX(':', diagnosis_group_name)+1, 230)),
		diagnosis_code,
		diagnosis,
		--service_id,
		--service_no,
		--service_type,
		--service_type_name,
		--diagnosis_type,
		--diagnosis_type_name,
		--condition,
		--is_default,
		doctor_id,
		doctor_name
	FROM @diagnosis
	ORDER BY diagnosis_group, diagnosis_code
	*/
END
GO
