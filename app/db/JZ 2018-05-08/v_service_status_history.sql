ALTER VIEW [dbo].[v_service_status_history]
AS
	SELECT  
		c.*,
		s.status,
		ss.sub_status,
		u.name as create_user_name
	FROM service_status_history c
	JOIN services i on c.service_id = i.id
	JOIN users u on c.create_user = u.user_name
	LEFT OUTER JOIN invoice_status s on i.service_type = s.service_type and c.status_code = s.code
	LEFT OUTER JOIN sub_status_codes ss on i.service_type = ss.service_type and c.status_code = ss.status_code and c.sub_status_code = ss.sub_status_code


GO


