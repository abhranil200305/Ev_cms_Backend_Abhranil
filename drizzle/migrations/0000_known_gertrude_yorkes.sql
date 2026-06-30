CREATE TABLE "Addhub" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"hubname" varchar(255),
	"hubchargers" jsonb,
	"hubtariff" varchar(255),
	"hublocation" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"adminuid" varchar(255),
	"associatedadminid" varchar(255),
	CONSTRAINT "Addhub_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"totalnumberofusers" varchar(255),
	"totalnumberofuserprofiles" varchar(255),
	"perdaynewusercount" varchar(255),
	"countofroles" varchar(255),
	"countofchargerunits" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	CONSTRAINT "Analytics_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "AssignRoles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"userid" varchar(255),
	"rolename" varchar(255),
	"roledesc" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	CONSTRAINT "AssignRoles_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Assigntovechicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"vehiclename" varchar(255),
	"vehiclemodel" varchar(255),
	"vehiclelicense" varchar(255),
	"vehicleowner" varchar(255),
	"vehiclecategory" varchar(255),
	"vehicletype" varchar(255),
	"vehicleowenerId" varchar(255),
	"isvehicleassigned" boolean,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" varchar(255),
	"adminuid" varchar(255),
	"vehiclebatterycapacity" varchar(255) DEFAULT '0',
	"vehiclerange" varchar(255) DEFAULT '0',
	"vehiclevin" varchar(255),
	CONSTRAINT "Assigntovechicles_uid_unique" UNIQUE("uid"),
	CONSTRAINT "Assigntovechicles_vehiclelicense_unique" UNIQUE("vehiclelicense"),
	CONSTRAINT "Assigntovechicles_vehiclevin_unique" UNIQUE("vehiclevin")
);
--> statement-breakpoint
CREATE TABLE "Assigntovehicleowener" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"vehicleowenerfirstname" varchar(255),
	"vehicleowenerlastename" varchar(255),
	"vehicleoweneremail" varchar(255),
	"phonenumber" varchar(255),
	"vehicleowenerlicense" varchar(255),
	"vehicleowenergovdocs" varchar(255),
	"vehicleowenernationality" varchar(255),
	"vehicleoweneraddress" text,
	"vehicleowenerrole" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"adminid" varchar(255),
	CONSTRAINT "Assigntovehicleowener_uid_unique" UNIQUE("uid"),
	CONSTRAINT "Assigntovehicleowener_vehicleoweneremail_unique" UNIQUE("vehicleoweneremail"),
	CONSTRAINT "Assigntovehicleowener_vehicleowenerlicense_unique" UNIQUE("vehicleowenerlicense"),
	CONSTRAINT "Assigntovehicleowener_adminid_unique" UNIQUE("adminid")
);
--> statement-breakpoint
CREATE TABLE "Bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"chargeruid" varchar(255),
	"useruid" varchar(255),
	"isbooked" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"bookingtimefrom" timestamp,
	"bookingtimeto" timestamp,
	"remindersent" boolean,
	"associatedadminid" varchar(255),
	CONSTRAINT "Bookings_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "ChargerTransaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"chargerid" varchar(255),
	"userid" varchar(255),
	"transactionid" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"connectorid" varchar(255),
	"max_kwh" varchar(255),
	"associatedadminid" varchar(255),
	CONSTRAINT "ChargerTransaction_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Charger_Unit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"Chargerserialnum" varchar(255),
	"ChargerName" varchar(255),
	"Chargerhost" varchar(255),
	"Segment" varchar(255),
	"Subsegment" varchar(255),
	"Total_Capacity" varchar(255),
	"Chargertype" varchar(255),
	"parking" varchar(255),
	"number_of_connectors" varchar(255),
	"Connector_type" varchar(255),
	"connector_total_capacity" varchar(255),
	"lattitude" varchar(255),
	"longitute" varchar(255),
	"full_address" text,
	"charger_use_type" varchar(255),
	"twenty_four_seven_open_status" varchar(255),
	"charger_image" varchar(255),
	"userId" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"chargeridentity" text,
	"associatedadminid" varchar(255),
	"googlemapslink" text,
	"protocol" varchar(255) DEFAULT 'OCPP',
	CONSTRAINT "Charger_Unit_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Charingsessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"sessionid" varchar(255),
	"chargerid" varchar(255),
	"startime" varchar(255),
	"stoptime" varchar(255),
	"meterstart" varchar(255),
	"meterstop" varchar(255),
	"consumedkwh" varchar(255),
	"totalcost" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userid" varchar(255),
	"associatedadminid" varchar(255),
	CONSTRAINT "Charingsessions_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Contactform" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"firstname" varchar(255),
	"lastname" varchar(255),
	"email" varchar(255),
	"message" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	CONSTRAINT "Contactform_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Counter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" integer DEFAULT 100 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DailySignup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"date" timestamp DEFAULT now() NOT NULL,
	"newSignupCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "DisputFrom" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"customername" varchar(255),
	"relatedtoev" varchar(255),
	"reason" text,
	"morethanonecharge" varchar(255),
	"wrongcharged" varchar(255),
	"didnotreceiverefund" varchar(255),
	"paidforothermeans" varchar(255),
	"disputtransaction" varchar(255),
	"chargedregularly" varchar(255),
	"notlistedabove" text,
	"transactiondetails" text,
	"disputedetails" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	"userid" varchar(255),
	"resolvedstatus" boolean,
	CONSTRAINT "DisputFrom_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "FAQ" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"faqquestion" text,
	"faqdescription" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "FAQ_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"chargeruid" varchar(255),
	"useruid" varchar(255),
	"isfavorite" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	CONSTRAINT "Favorites_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"username" varchar(255),
	"email" varchar(255),
	"ratingnumber" varchar(255),
	"feedbackmessage" text,
	"feedbacktype" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	"isserveytook" boolean DEFAULT false,
	CONSTRAINT "Feedback_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Financial_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"bank_account_number" varchar(255),
	"isfc_code" varchar(255),
	"bank_name" varchar(255),
	"branch_name" varchar(255),
	"branch_address" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userProfileId" varchar(255),
	"associatedadminid" varchar(255),
	CONSTRAINT "Financial_details_uid_unique" UNIQUE("uid"),
	CONSTRAINT "Financial_details_userProfileId_unique" UNIQUE("userProfileId")
);
--> statement-breakpoint
CREATE TABLE "GstCreate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"gst" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "GstCreate_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "HelpandSupport" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"name" varchar(255),
	"email" varchar(255),
	"message" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"phonenumber" varchar(255),
	"adminuid" varchar(255),
	"messagestatus" boolean DEFAULT true,
	"associatedadminid" varchar(255),
	CONSTRAINT "HelpandSupport_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "LogRetention" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"messagetype" varchar(255),
	"messages" jsonb,
	"filelocation" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	CONSTRAINT "LogRetention_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Minimumbalance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"minbalance" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	CONSTRAINT "Minimumbalance_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "QRCode" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"chargerid" varchar(255),
	"qrcodedata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	CONSTRAINT "QRCode_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "RazorpayData" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"orderId" varchar(255),
	"paymentId" varchar(255),
	"amount" varchar(255),
	"currency" varchar(255),
	"status" varchar(255),
	"attempts" varchar(255),
	"method" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	CONSTRAINT "RazorpayData_uid_unique" UNIQUE("uid"),
	CONSTRAINT "RazorpayData_orderId_unique" UNIQUE("orderId"),
	CONSTRAINT "RazorpayData_paymentId_unique" UNIQUE("paymentId")
);
--> statement-breakpoint
CREATE TABLE "TransactionHistory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"paymentid" varchar(255),
	"walletid" varchar(255),
	"userid" varchar(255),
	"price" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	"gst" varchar(255),
	"gstdeductedamount" varchar(255),
	"taxableamount" varchar(255),
	CONSTRAINT "TransactionHistory_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Transactionsdetails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"paymentid" varchar(255),
	"walletid" varchar(255),
	"userid" varchar(255),
	"price" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"chargeruid" varchar(255),
	"associatedadminid" varchar(255),
	CONSTRAINT "Transactionsdetails_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"username" varchar(255),
	"firstname" varchar(255),
	"lastname" varchar(255),
	"email" varchar(255),
	"password" varchar(255),
	"userType" varchar(255),
	"designation" varchar(255),
	"address" text,
	"phonenumber" varchar(255),
	"profilepicture" varchar(255),
	"otp" varchar(255),
	"otpExpiration" timestamp,
	"emailVerified" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	CONSTRAINT "User_uid_unique" UNIQUE("uid"),
	CONSTRAINT "User_username_unique" UNIQUE("username"),
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_phonenumber_unique" UNIQUE("phonenumber")
);
--> statement-breakpoint
CREATE TABLE "UserBilling" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"userid" varchar(255),
	"chargerid" varchar(255),
	"username" varchar(255),
	"walletid" varchar(255),
	"lasttransaction" varchar(255),
	"balancededuct" varchar(255),
	"energyconsumption" varchar(255),
	"chargingtime" varchar(255),
	"taxableamount" varchar(255),
	"gstamount" varchar(255),
	"totalamount" varchar(255),
	"associatedadminid" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"billingpdf" text,
	CONSTRAINT "UserBilling_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "WalletHardLimit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"hardlimit" varchar(255) DEFAULT '50',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "WalletHardLimit_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "iptracker" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"datetimeofaccess" varchar(255),
	"filepath" text,
	"ipaddress" varchar(255),
	"messages" text,
	"associatedadminid" varchar(255),
	CONSTRAINT "iptracker_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "wallet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"userprofilerelatedwallet" varchar(255),
	"appuserrelatedwallet" varchar(255),
	"balance" varchar(255),
	"iswalletrechargedone" boolean,
	"recharger_made_by_which_user" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminuid" varchar(255),
	CONSTRAINT "wallet_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "walletreachargehistory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(255),
	"userassociatedid" varchar(255),
	"previousbalance" varchar(255),
	"balanceleft" varchar(255),
	"addedbalance" varchar(255),
	"numberofrecharge" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"associatedadminid" varchar(255),
	"gst" varchar(255),
	CONSTRAINT "walletreachargehistory_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE INDEX "Addhub_adminuid_fkey" ON "Addhub" USING btree ("adminuid");--> statement-breakpoint
CREATE INDEX "Assigntovechicles_adminuid_fkey" ON "Assigntovechicles" USING btree ("adminuid");--> statement-breakpoint
CREATE INDEX "Assigntovechicles_userId_fkey" ON "Assigntovechicles" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "Assigntovechicles_vehicleowenerId_fkey" ON "Assigntovechicles" USING btree ("vehicleowenerId");--> statement-breakpoint
CREATE INDEX "Charger_Unit_userId_fkey" ON "Charger_Unit" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "QRCode_chargerid_fkey" ON "QRCode" USING btree ("chargerid");--> statement-breakpoint
CREATE INDEX "wallet_appuserrelatedwallet_fkey" ON "wallet" USING btree ("appuserrelatedwallet");--> statement-breakpoint
CREATE INDEX "wallet_userprofilerelatedwallet_fkey" ON "wallet" USING btree ("userprofilerelatedwallet");