REM http://medics5.insky-inc.com/api/tools/appinit

Settings.SetValue("ApplicationID", 5002)
Settings.SetValue("EngineVersion", "5.0")
Settings.SetValue("EncryptionPassKey", "john@insky-inc.com")
Settings.SetValue("EncryptionSaltValue", "ibsi")

REM Settings.SetValue("ApplicationName", "EngineV4")
REM Settings.SetValue("ApplicationDescription", "Sample Engine V4")  
Settings.SetValue("ApplicationIcon", "/images/claims1med-16.png")

Settings.SetValue("LoginSlogan", "welcome to your medical claims partner...")
Settings.SetValue("LoginIcon", "/images/claims1med-45r.svg")
Settings.SetValue("LoginDomain", "claims1med")

Settings.SetValue("FormatJsonData", "1")

Settings.SetValue("CacheCssJS", "1")
REM Settings.SetValue("LoginUrl", "/login")
Settings.SetValue("WebAccess", "ihms.insky-inc.com")

REM http://medics5.insky-inc.com/api/tools/dbinit
REM Databases.SetValue("DatabaseConnections", "DBSecure,DBClaims,DBSystem,DBMedics,DBVoters,DBMoney")
REM Databases.SetValue("DatabaseConnections", "DBSecure,DBClaims,DBSystem,DBMedics,DBVoters,DBMoney")
Databases.SetValue("DatabaseConnections", "DBSecure,DBReporting,DBMedics")
Databases.SetValue("DefaultConnection", "DBSecure")

REM http://medics5.insky-inc.com/api/tools/dbinit?name=DBMedics
Databases.SetValue("DBMedics", "CNMedics")
Databases.SetValue("DBMedicsCodeFile", "MedicsCodeFile")
' Databases.SetValue("CNMedics", "data source=192.168.10.222\DBSERVERISOS01;initial catalog=MEDICS50;user=sa;password=Trueasgold;Connection Timeout=120;context connection=false;")
Databases.SetValue("CNMedics", "data source=DBSERVER01\ISOSDB01;initial catalog=MEDICS52;user=sa;password=Trueasgold;Connection Timeout=120;context connection=false;")
' Databases.SetValue("CNMedics", "data source=ISOSDB01;initial catalog=MEDICS50;user=sa;password=Trueasgold;Connection Timeout=120;context connection=false;")
Databases.SetValue("MedicsCodeFile", "C:\inetpub\wwwroot\Claim1MED.NET\app\DatabaseInitMedics.vb")
Databases.SetValue("MedicsCodeFile2", "C:\inetpub\wwwroot\Claim1MED.NET\app\datasources")

Databases.SetValue("DBReporting", "CNReporting")
Databases.SetValue("DBReportingCodeFile", "ReportingCodeFile")
Databases.SetValue("CNReporting", "data source=DBSERVER01\ISOSDB01;initial catalog=MEDICS52;user=sa;password=Trueasgold;Connection Timeout=120;context connection=false;")
Databases.SetValue("ReportingCodeFile", "C:\inetpub\wwwroot\Claim1MED.NET\engine\DatabaseInitReporting.vb")

Paths.SetValue("UploadPath", "C:\WebAppDocs\Temp")
Paths.SetValue("DocumentPath", "C:\WebAppDocs\Insky")
Paths.SetValue("ClaimDocuments", "C:\Mayfair\Files\ClaimDocuments")
Paths.SetValue("DocumentTemplates", "C:\Mayfair\Files\DocumentTemplates")
Paths.SetValue("DocumentTemplatesxx", "C:\WebAppDocs\IHMS\DocumentTemplates")
Paths.SetValue("SettlementAdvice", "C:\Mayfair\Files\SettlementAdvice")

REM http://medics5.insky-inc.com/api/tools/appinit
Styles.SetValue("home", "design-5")
Styles.SetValue("admin", "design-5")
Styles.SetValue("providers", "design-5")
Styles.SetValue("system-tables", "design-5")
Styles.SetValue("claim-tables", "design-5")
REM Styles.SetValue("security", "design-5")
REM Styles.SetValue("system", "design-5")

Styles.SetValue("claim", "design-5")
Styles.SetValue("client", "design-5")
Styles.SetValue("masterpolicy", "design-5")
Styles.SetValue("product", "design-5")
Styles.SetValue("plan", "design-5")
Styles.SetValue("batch", "design-5")
Styles.SetValue("member", "design-5")
Styles.SetValue("service", "design-5")
Styles.SetValue("inv", "design-5")
Styles.SetValue("database", "design-5")
Styles.SetValue("doctor", "design-5")
Styles.SetValue("hospital", "design-5")
Styles.SetValue("clinic", "design-5")
Styles.SetValue("sob", "design-5")

REM Styles.SetValue("demo", "design-5")
REM Styles.SetValue("masterpolicy", "design-5")
REM Styles.SetValue("tables", "design-5")
REM Styles.SetValue("webix", "design-5")
REM Styles.SetValue("alz", "design-5")
REM Styles.SetValue("financial", "design-5")

REM http://medics5.insky-inc.com/api/tools/appinit
Dim Main As Navigator.MenuItem = MenuItems.AddMain("links", "Links", True)
	With Main.SubItems.Add
		.ID = "admin"
		.Action = "admin"				
		.Title = "Admin"
		.Icon = "settings"
	End with
	With Main.SubItems.Add
		.ID = "providers"
		.Action = "admin"				
		.Title = "Providers"
		.Icon = "hospital"
	End with
	With Main.SubItems.Add
		.ID = "system-tables"
		.Action = "admin"				
		.Title = "System Tables"
		.Icon = "table"
	End with
	With Main.SubItems.Add
		.ID = "claim-tables"
		.Action = "admin"				
		.Title = "Claim Tables"
		.Icon = "table"
	End with

