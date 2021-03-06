USE [MEDICS52SYS]
GO
/****** Object:  UserDefinedFunction [dbo].[f_permissions]    Script Date: 5/17/2018 11:04:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER FUNCTION [dbo].[f_permissions]
/****************************************************************************************************
 Last modified on

****************************************************************************************************/
(
  @role_id as int = 0,
  @action_id as int = 0
) RETURNS varchar(512)
AS
BEGIN
	declare @rights varchar(512)

	select
		@rights = COALESCE(@rights + ',', '') + LTRIM(STR(u.rights_id))
	from permissions u
	where u.role_id = @role_id and u.action_id = @action_id

	IF @rights = '0' SET @rights = ''

	RETURN ISNULL(@rights, '')
END

