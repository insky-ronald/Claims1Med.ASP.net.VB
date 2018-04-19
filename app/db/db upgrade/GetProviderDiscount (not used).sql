DROP PROCEDURE [dbo].[GetProviderDiscount]
GO

CREATE PROCEDURE [dbo].[GetProviderDiscount] 
@id INT = 0,
@visit_id bigint = 0
AS 
BEGIN 
    IF EXISTS(SELECT * FROM provider_discount WHERE name_id = @id) 
		SELECT 
			p.discount_type_id, 
			p.name_id, 
			p.discount_amount, 
			p.discount_percent, 
			p.notes 
		FROM provider_discount p 
		JOIN names c ON p.name_id = c.id
		WHERE c.id = @id 
    ELSE 
		SELECT 
			Cast(NULL AS CHAR(1)) AS discount_type_id, 
			@id              AS COMP_ID, 
			Cast(0 AS MONEY)      AS discount_amount, 
			Cast(0 AS SMALLMONEY) AS discount_percent, 
			Cast(NULL AS TEXT)    AS notes 
END 
GO
