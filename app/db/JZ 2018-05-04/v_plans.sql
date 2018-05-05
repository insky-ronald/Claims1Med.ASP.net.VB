DROP VIEW v_plans
GO

CREATE VIEW v_plans
AS
	SELECT 
		p.code,
		p.product_code,
		r.product_name,
		r.client_id,
		c.full_name as client_name,
		p.plan_name,
		p.currency_code,
		p.status_id
	FROM plans p
	JOIN products r on p.product_code = r.code
	JOIN clients c on r.client_id = c.id
GO
