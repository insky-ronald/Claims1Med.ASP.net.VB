DROP PROCEDURE [dbo].[RunDynamicQueryBuilder2] 
GO

CREATE PROCEDURE [dbo].[RunDynamicQueryBuilder2] 
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- *************************************************************************************************** 
(
	@id int,
	@name varchar(100) = '',
	@static_value varchar(100) = '',
	@type char(1) = '',
	@operator varchar(10) = '',
	@column_name varchar(100) = '',
	@if_value_not varchar(1000) = '', -- apply query if value is not same as @if_value_not
	@where nvarchar(2000) = '' OUTPUT,
	@parameters nvarchar(1000) = '' OUTPUT,
	@values varchar(1000) = '' OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @value varchar(2048) = ''

	IF @id = 0 AND LEN(@static_value) > 0
		SET @value = @static_value
	ELSE
		SELECT
			@value = value
		FROM saved_report_items 
		WHERE id = @id AND name = @name

	IF LEN(@if_value_not) > 0 AND @if_value_not = @value
		RETURN -- do nothing

	--print @type+','+@operator+','+@value
	IF @type = 'd' AND LEN(@value) > 0
	BEGIN
		IF LEN(@where) > 0 SET @where = @where + ' AND '
		IF LEN(@parameters) > 0 SET @parameters = @parameters + ', '
		IF LEN(@values) > 0 SET @values = @values + ', '

		SET @where = @where + 'CONVERT(date, '+@column_name+') '+@operator+' @'+@name
		SET @parameters = @parameters + '@'+@name +' datetime'
		--SET @values = @values + '@'+@name+' = '''+CONVERT(char(10), @date, 126)+''''
		SET @values = @values + '@'+@name+' = '''+CONVERT(char(10), CAST(@value as date), 126)+''''
	END 
	ELSE IF @type = 'n' AND @operator = 'in' AND LEN(@value) > 0
	BEGIN
		IF LEN(@where) > 0 SET @where = @where + ' AND '

		SET @where = @where + @column_name+' '+@operator+' ('+@value+')'
	END 
	ELSE IF @type = 'c' AND @operator = 'in' AND LEN(@value) > 0
	BEGIN
		IF LEN(@where) > 0 SET @where = @where + ' AND '

		SET @where = @where + @column_name+' '+@operator+' ('+''''+replace(@value, ',', ''',''')+''''+')'
	END
	ELSE IF @type = 'c' AND @operator = '=' AND LEN(@value) > 0
	BEGIN
		IF LEN(@where) > 0 SET @where = @where + ' AND '

		SET @where = @where + @column_name+' '+@operator+' '''+@value +''''
	END ELSE IF @type = 'c' AND @operator = 'like' AND LEN(@value) > 0
	BEGIN
		IF LEN(@where) > 0 SET @where = @where + ' AND '

		SET @where = @where + @column_name+' '+@operator+' ''%'+@value +'%'''
	END ELSE IF @type = 'n' AND @operator = '=' AND LEN(@value) > 0
	BEGIN
		IF LEN(@where) > 0 SET @where = @where + ' AND '

		SET @where = @where + @column_name+' '+@operator+' '+@value
	END 
END
