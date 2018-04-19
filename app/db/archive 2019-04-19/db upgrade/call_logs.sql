DROP TABLE [dbo].[call_logs]
GO

CREATE TABLE [dbo].[call_logs](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[call_type_id] [int] NOT NULL,
	[member_id] [int] NULL DEFAULT 0,
	[claim_id] [int] NULL DEFAULT 0,
	[service_id] [int] NULL DEFAULT 0,
	[full_name] [varchar](100) NOT NULL DEFAULT '',
	[title] [varchar](20) NULL DEFAULT '',
	[relationship] [varchar](20) NULL DEFAULT '',
	[is_first_call] [tinyint] NOT NULL DEFAULT 0,
	[is_follow_up] [tinyint] NOT NULL DEFAULT 0,
	[is_caller_member] [tinyint] NOT NULL DEFAULT 0,
	[country_code] [char](3) NULL DEFAULT '',
	[town] [varchar](100) NULL DEFAULT '',
	[place] [varchar](100) NULL DEFAULT '',
	[phone_no] [varchar](20) NULL DEFAULT '',
	[mobile_no] [varchar](20) NULL DEFAULT '',
	[fax_no] [varchar](20) NULL DEFAULT '',
	[email] [varchar](200) NULL DEFAULT '',
	[notes] [varchar](max) NULL DEFAULT '',
	[create_user] [varchar](10) NOT NULL DEFAULT '',
	[create_date] [datetime] NOT NULL DEFAULT getdate(),
	[update_user] [varchar](10) NOT NULL DEFAULT '',
	[update_date] [datetime] NOT NULL DEFAULT getdate(),
CONSTRAINT [PK_call_logs] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
)
GO

CREATE NONCLUSTERED INDEX [IX_call_logs_member_id] ON [dbo].[call_logs]
(
	[member_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO

CREATE NONCLUSTERED INDEX [IX_call_logs_claim_id] ON [dbo].[call_logs]
(
	[claim_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO

CREATE NONCLUSTERED INDEX [IX_call_logs_service_id] ON [dbo].[call_logs]
(
	[service_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO

