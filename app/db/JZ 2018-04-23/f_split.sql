DROP FUNCTION [dbo].[f_split]
GO

CREATE FUNCTION [dbo].[f_split]
(
  @delimited varchar(max),
  @delimiter char(1)
) RETURNS @t TABLE
(
  ID int identity(1,1),
  Value varchar(max)
)
AS
BEGIN
  declare @xml xml
  set @delimited = replace(@delimited, '&','&amp;')
  set @xml = N'<root><r>' + replace(@delimited, @delimiter,'</r><r>') + '</r></root>'
  
  insert into @t(Value)
  select 
    r.value('.','varchar(max)') as item
  from @xml.nodes('//root/r') as records(r)

  RETURN
END
GO
