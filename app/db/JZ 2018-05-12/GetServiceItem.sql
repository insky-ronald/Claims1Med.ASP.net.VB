DROP PROCEDURE [dbo].[GetServiceItem] 
GO

CREATE PROCEDURE [dbo].[GetServiceItem] 
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
    @id int = 0, 
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;
	
	SELECT
		d.id,
		d.schedule_id,
		d.benefit_code,
		d.diagnosis_code,
		d.procedure_code,
		d.room_type,
		d.estimate_units,
		d.units,
		d.units_declined,
		d.units_approved,
		d.estimate,
		d.actual_amount,
		d.discount_percent,
		d.discount_amount,
		d.declined_amount,
		d.approved_amount,
		d.ex_gratia,
		d.deductible,
		d.payable,
		d.is_novalidate,
		d.is_recover,
		d.is_exclusion,
		d.message,
		d.remarks,
		d.status_code,
		d.sub_status_code,
		b.benefit,
		b.units_required
	FROM service_details d
	LEFT OUTER JOIN benefits b on d.benefit_code = b.code
	WHERE id = @id
END
GO
