REM http://engine-v4.insky-inc.com/api/tools/appinit
Settings.SetValue("EngineVersion", "5.0")
Settings.SetValue("EncryptionPassKey", "john@insky-inc.com")
Settings.SetValue("EncryptionSaltValue", "ibsi")
Settings.SetValue("LoginUrl", "/login")

Settings.SetValue("LoadExternalFonts", "1")

Databases.SetValue("DefaultConnection", "DBSecure")

Databases.SetValue("DBSecure", "CNSecure")
Databases.SetValue("DBSecureCodeFile", "SecureCodeFile")
Databases.SetValue("CNSecure", "data source=DBSERVER01\ISOSDB01;initial catalog=MEDICS52SYS;user=sa;password=Trueasgold;Connection Timeout=120;context connection=false;") 
Databases.SetValue("SecureCodeFile", "C:\inetpub\wwwroot\Claim1MED.NET\engine\DatabaseInit.vb")

Paths.SetValue("EngineTexts", "D:\WebAppSource\EngineV4\engine\texts")

Styles.SetValue("security", "design-5")
Styles.SetValue("permission", "design-5")
Styles.SetValue("settings", "design-5")
Styles.SetValue("system", "design-5")
Styles.SetValue("database", "design-5")
Styles.SetValue("report", "design-5")

ScriptLibraries.SetValue("system", "html-editor")

Dim System As Navigator.MenuItem = MenuItems.AddMain("system", "System", True)

	With System.SubItems.Add
		.ID = "security"
		.Action = "security"				
		.Title = "Security"
		.Icon = "security"	
		.URL = "sys/security"		
	End with
	
	With System.SubItems.Add
		.ID = "system"
		.Action = "system"				
		.Title = "System"
		.Icon = "settings"
		.Url = "sys/system"
	End with
