ALTER PROCEDURE [dbo].[GetContacts] 
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
				c.*
			FROM contacts c
		WHERE ' + @where

	END ELSE
	BEGIN
		IF LEN(@sort) = 0 SET @sort = 'c.full_name'
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
				c.*,
				case when n.contact_id = c.id then 1 else 0 end as is_default
			FROM contacts c
			LEFT OUTER JOIN (SELECT contact_id FROM clients WHERE id = '+STR(@name_id)+') n on c.id = n.contact_id
			WHERE ' + @where + ' ORDER BY ' + @sort +' '+ @order
	END

DONE:
	EXEC sp_executesql @sql, @params, @param_id
END
