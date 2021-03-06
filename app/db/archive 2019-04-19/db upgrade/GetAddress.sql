DROP PROCEDURE [dbo].[GetAddress] 
GO

CREATE PROCEDURE [dbo].[GetAddress] 
-- ***************************************************************************************************
-- Last modified on
-- 14-OCT-2014 ihms.0.0.1.0
-- *************************************************************************************************** 
(
    @id int = 0, 
	@name_id int = 0, 
	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
	@sort varchar(200) = '',
	@order varchar(10) = '',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @sql nvarchar(MAX)
	DECLARE @where AS varchar(100)
	DECLARE @params nvarchar(max)
	DECLARE @param_id int

	IF @action in (10,20,50)
	BEGIN
		SET @param_id = @id
		SET @params = '@id int'
		SET @where = 'id = @id'

		SET @sql = '
			SELECT
				a.id, 
				a.name_id, 
				a.address_type, 
				a.street, 
				a.city, 
				a.province, 
				a.zip_code, 
				a.country_code, 
				a.phone_no1, 
				a.phone_no2, 
				a.fax_no1, 
				a.fax_no2, 
				a.email,
				c.country,
				t.address_type as address_type_name
			FROM addresses a
			LEFT OUTER JOIN address_types t on a.address_type = t.code
			LEFT OUTER JOIN countries c on a.country_code = c.code
		WHERE ' + @where

	END ELSE
	BEGIN
		IF LEN(@sort) = 0 SET @sort = 'street'
		IF LEN(@order) = 0 SET @order = 'asc'

		IF @id > 0
		BEGIN
			SET @param_id = @id
			SET @params = '@id int'
			SET @where = 'id = @id'
		END ELSE BEGIN
			SET @param_id = @name_id
			SET @params = '@name_id int'
			SET @where = 'name_id = @name_id'
		END

		SET @sql = '
			SELECT
				a.*,
				c.country,
				t.address_type as address_type_name,
				case when n.address_id = a.id then 1 else 0 end as is_default
			FROM addresses a
			LEFT OUTER JOIN (SELECT address_id FROM clients WHERE id = '+STR(@name_id)+') n on a.id = n.address_id
			LEFT OUTER JOIN address_types t on a.address_type = t.code
			LEFT OUTER JOIN countries c on a.country_code = c.code
			WHERE ' + @where + ' ORDER BY ' + @sort +' '+ @order
	END

DONE:
	EXEC sp_executesql @sql, @params, @param_id
END
GO
