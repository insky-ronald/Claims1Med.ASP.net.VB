DROP VIEW [dbo].[v_doctors_by_hospital]
GO

CREATE VIEW [dbo].[v_doctors_by_hospital]
AS
	SELECT
		hospital_id,
		doctor_id as id,
		COMP_NAME as name,
		specialisation
	FROM vw_hospital_doctors p
