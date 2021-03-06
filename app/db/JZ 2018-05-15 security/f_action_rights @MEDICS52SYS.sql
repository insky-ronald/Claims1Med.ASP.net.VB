USE [MEDICS52SYS]
GO
/****** Object:  UserDefinedFunction [dbo].[f_action_rights]    Script Date: 5/17/2018 11:06:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER FUNCTION [dbo].[f_action_rights]
/****************************************************************************************************
 Last modified on

****************************************************************************************************/
(
  @action_id as int = 0
) RETURNS varchar(512)
AS
BEGIN
	declare @rights varchar(512)

	select
		@rights = COALESCE(@rights + ',', '') + LTRIM(STR(u.rights_id))
	from action_rights u
	where u.action_id = @action_id

	IF @rights = '0' SET @rights = ''

	RETURN @rights
END

