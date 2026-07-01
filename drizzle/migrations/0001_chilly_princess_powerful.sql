CREATE TYPE "public"."charger_protocol_enum" AS ENUM('OCPP1.6J');--> statement-breakpoint
CREATE TYPE "public"."charger_status_enum" AS ENUM('Available', 'Unavailable', 'Occupied', 'Faulted', 'Charging', 'Inactive');--> statement-breakpoint
CREATE TYPE "public"."charger_type_enum" AS ENUM('AC', 'DC', 'DC_FAST', 'HYBRID');--> statement-breakpoint
CREATE TYPE "public"."charger_use_type_enum" AS ENUM('PUBLIC', 'PRIVATE', 'SEMI_PUBLIC', 'FLEET', 'CAPTIVE');--> statement-breakpoint
CREATE TYPE "public"."connector_type_enum" AS ENUM('TYPE_1', 'TYPE_2', 'CCS', 'CCS2', 'CHADEMO', 'GB_T', 'BHARAT_AC001', 'BHARAT_DC001');--> statement-breakpoint
CREATE TYPE "public"."dispute_related_to_enum" AS ENUM('EV', 'CHARGER', 'PAYMENT', 'WALLET', 'REFUND', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."feedback_type_enum" AS ENUM('APP', 'CHARGER', 'PAYMENT', 'SERVICE', 'GENERAL');--> statement-breakpoint
CREATE TYPE "public"."parking_type_enum" AS ENUM('PUBLIC', 'PRIVATE', 'RESIDENTIAL', 'COMMERCIAL', 'MALL', 'OFFICE', 'HIGHWAY');--> statement-breakpoint
CREATE TYPE "public"."payment_method_enum" AS ENUM('UPI', 'CARD', 'NETBANKING', 'WALLET', 'CASH', 'EMI');--> statement-breakpoint
CREATE TYPE "public"."payment_status_enum" AS ENUM('Success', 'Failed', 'Pending', 'Completed', 'Cancelled', 'Refunded');--> statement-breakpoint
CREATE TYPE "public"."support_ticket_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."user_role_enum" AS ENUM('Admin', 'Driver', 'Vehicle Owner', 'User');--> statement-breakpoint
CREATE TYPE "public"."vehicle_category_enum" AS ENUM('PERSONAL', 'COMMERCIAL', 'FLEET');--> statement-breakpoint
CREATE TYPE "public"."vehicle_type_enum" AS ENUM('TWO_WHEELER', 'THREE_WHEELER', 'FOUR_WHEELER', 'BUS', 'TRUCK');--> statement-breakpoint
CREATE TABLE "access_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"access_log_uid" varchar(255),
	"accessed_at" timestamp,
	"file_path" text,
	"ip_address" varchar(64),
	"message" text,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "access_logs_access_log_uid_unique" UNIQUE("access_log_uid")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"log_uid" varchar(255),
	"event_type" varchar(255),
	"payload" jsonb,
	"file_path" text,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "audit_logs_log_uid_unique" UNIQUE("log_uid")
);
--> statement-breakpoint
CREATE TABLE "charger_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_uid" varchar(255),
	"charger_uid" varchar(255),
	"user_uid" varchar(255),
	"is_active" boolean DEFAULT false,
	"status" charger_status_enum,
	"start_time" timestamp,
	"end_time" timestamp,
	"is_reminder_sent" boolean DEFAULT false,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "charger_bookings_booking_uid_unique" UNIQUE("booking_uid")
);
--> statement-breakpoint
CREATE TABLE "charger_qr_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"qr_code_uid" varchar(255),
	"charger_uid" varchar(255),
	"qr_code_data" text,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "charger_qr_codes_qr_code_uid_unique" UNIQUE("qr_code_uid")
);
--> statement-breakpoint
CREATE TABLE "chargers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"charger_uid" varchar(255),
	"serial_number" varchar(255),
	"name" varchar(255),
	"host_name" varchar(255),
	"segment" varchar(255),
	"sub_segment" varchar(255),
	"total_capacity_kw" varchar(255),
	"charger_type" charger_type_enum,
	"charger_status" charger_status_enum DEFAULT 'Available',
	"parking_type" "parking_type_enum",
	"connector_count" integer,
	"connector_type" "connector_type_enum",
	"connector_total_capacity_kw" varchar(255),
	"connector_power_config" jsonb,
	"latitude" numeric(9, 6),
	"longitude" numeric(9, 6),
	"address" text,
	"usage_type" charger_use_type_enum,
	"is_open_24x7" boolean DEFAULT false,
	"image_url" varchar(255),
	"owner_uid" varchar(255),
	"charger_identity" text,
	"admin_uid" varchar(255),
	"google_maps_url" text,
	"protocol" charger_protocol_enum DEFAULT 'OCPP1.6J',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chargers_charger_uid_unique" UNIQUE("charger_uid")
);
--> statement-breakpoint
CREATE TABLE "charging_hubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hub_uid" varchar(255),
	"name" varchar(255),
	"charger_uids" jsonb,
	"tariff_per_kwh" numeric(10, 2),
	"location" text,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "charging_hubs_hub_uid_unique" UNIQUE("hub_uid")
);
--> statement-breakpoint
CREATE TABLE "charging_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"charging_session_uid" varchar(255),
	"external_session_id" varchar(255),
	"charger_uid" varchar(255),
	"user_uid" varchar(255),
	"start_time" timestamp,
	"stop_time" timestamp,
	"meter_start_kwh" numeric(10, 2),
	"meter_stop_kwh" numeric(10, 2),
	"consumed_kwh" numeric(10, 2),
	"total_amount" numeric(10, 2),
	"status" charger_status_enum,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "charging_sessions_charging_session_uid_unique" UNIQUE("charging_session_uid")
);
--> statement-breakpoint
CREATE TABLE "charging_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"charging_transaction_uid" varchar(255),
	"charger_uid" varchar(255),
	"user_uid" varchar(255),
	"transaction_uid" varchar(255),
	"connector_id" varchar(255),
	"max_kwh" numeric(10, 2),
	"status" charger_status_enum,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "charging_transactions_charging_transaction_uid_unique" UNIQUE("charging_transaction_uid")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_message_uid" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"message" text,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contact_messages_contact_message_uid_unique" UNIQUE("contact_message_uid")
);
--> statement-breakpoint
CREATE TABLE "daily_signup_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"signup_metric_uid" varchar(255),
	"signup_date" timestamp DEFAULT now() NOT NULL,
	"signup_count" integer DEFAULT 0 NOT NULL,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_signup_metrics_signup_metric_uid_unique" UNIQUE("signup_metric_uid")
);
--> statement-breakpoint
CREATE TABLE "dashboard_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric_uid" varchar(255),
	"total_users" integer,
	"total_user_profiles" integer,
	"daily_new_users" integer,
	"total_roles" integer,
	"total_chargers" integer,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dashboard_metrics_metric_uid_unique" UNIQUE("metric_uid")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"faq_uid" varchar(255),
	"question" text,
	"answer" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "faqs_faq_uid_unique" UNIQUE("faq_uid")
);
--> statement-breakpoint
CREATE TABLE "favorite_chargers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"favorite_uid" varchar(255),
	"charger_uid" varchar(255),
	"user_uid" varchar(255),
	"is_favorite" boolean DEFAULT false,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favorite_chargers_favorite_uid_unique" UNIQUE("favorite_uid")
);
--> statement-breakpoint
CREATE TABLE "payment_disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dispute_uid" varchar(255),
	"customer_name" varchar(255),
	"related_to" "dispute_related_to_enum",
	"reason" text,
	"has_duplicate_charge" boolean DEFAULT false,
	"was_charged_incorrectly" boolean DEFAULT false,
	"refund_not_received" boolean DEFAULT false,
	"paid_using_other_method" boolean DEFAULT false,
	"has_recurring_charge" boolean DEFAULT false,
	"disputed_transaction_uid" varchar(255),
	"other_reason" text,
	"transaction_details" text,
	"dispute_details" text,
	"user_uid" varchar(255),
	"is_resolved" boolean DEFAULT false,
	"status" "support_ticket_status_enum" DEFAULT 'OPEN',
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_disputes_dispute_uid_unique" UNIQUE("dispute_uid")
);
--> statement-breakpoint
CREATE TABLE "payment_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_order_uid" varchar(255),
	"razorpay_order_id" varchar(255),
	"razorpay_payment_id" varchar(255),
	"amount" numeric(10, 2),
	"currency" varchar(255),
	"status" "payment_status_enum",
	"attempts" integer,
	"method" "payment_method_enum",
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_orders_payment_order_uid_unique" UNIQUE("payment_order_uid"),
	CONSTRAINT "payment_orders_razorpay_order_id_unique" UNIQUE("razorpay_order_id"),
	CONSTRAINT "payment_orders_razorpay_payment_id_unique" UNIQUE("razorpay_payment_id")
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_uid" varchar(255),
	"payment_uid" varchar(255),
	"wallet_uid" varchar(255),
	"user_uid" varchar(255),
	"charger_uid" varchar(255),
	"amount" numeric(10, 2),
	"status" "payment_status_enum",
	"method" "payment_method_enum",
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_transactions_transaction_uid_unique" UNIQUE("transaction_uid")
);
--> statement-breakpoint
CREATE TABLE "sequence_counters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_uid" varchar(255),
	"customer_name" varchar(255),
	"email" varchar(255),
	"phone" varchar(255),
	"message" text,
	"admin_uid" varchar(255),
	"status" "support_ticket_status_enum" DEFAULT 'OPEN',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "support_tickets_ticket_uid_unique" UNIQUE("ticket_uid")
);
--> statement-breakpoint
CREATE TABLE "tax_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tax_rate_uid" varchar(255),
	"gst_rate" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tax_rates_tax_rate_uid_unique" UNIQUE("tax_rate_uid")
);
--> statement-breakpoint
CREATE TABLE "user_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feedback_uid" varchar(255),
	"username" varchar(255),
	"email" varchar(255),
	"rating" integer,
	"message" text,
	"type" "feedback_type_enum",
	"is_survey_completed" boolean DEFAULT false,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_feedback_feedback_uid_unique" UNIQUE("feedback_uid")
);
--> statement-breakpoint
CREATE TABLE "user_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_uid" varchar(255),
	"user_uid" varchar(255),
	"charger_uid" varchar(255),
	"wallet_uid" varchar(255),
	"username" varchar(255),
	"last_transaction_uid" varchar(255),
	"deducted_balance" numeric(10, 2),
	"energy_consumed_kwh" numeric(10, 2),
	"charging_duration" varchar(255),
	"taxable_amount" numeric(10, 2),
	"gst_amount" numeric(10, 2),
	"total_amount" numeric(10, 2),
	"invoice_pdf_url" text,
	"status" "payment_status_enum",
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_invoices_invoice_uid_unique" UNIQUE("invoice_uid")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_uid" varchar(255),
	"user_uid" varchar(255),
	"name" "user_role_enum",
	"description" text,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_role_uid_unique" UNIQUE("role_uid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_uid" varchar(255),
	"username" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"account_type" "user_role_enum",
	"designation" varchar(255),
	"address" text,
	"phone" varchar(255),
	"profile_image_url" varchar(255),
	"otp" varchar(255),
	"otp_expires_at" timestamp,
	"is_email_verified" boolean DEFAULT false,
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_user_uid_unique" UNIQUE("user_uid"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "vehicle_owners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_uid" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"phone" varchar(255),
	"license_number" varchar(255),
	"government_document_url" varchar(255),
	"nationality" varchar(255),
	"address" text,
	"role" "user_role_enum",
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vehicle_owners_owner_uid_unique" UNIQUE("owner_uid"),
	CONSTRAINT "vehicle_owners_email_unique" UNIQUE("email"),
	CONSTRAINT "vehicle_owners_license_number_unique" UNIQUE("license_number"),
	CONSTRAINT "vehicle_owners_admin_uid_unique" UNIQUE("admin_uid")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_uid" varchar(255),
	"name" varchar(255),
	"model" varchar(255),
	"license_number" varchar(255),
	"owner_name" varchar(255),
	"category" "vehicle_category_enum",
	"type" "vehicle_type_enum",
	"owner_uid" varchar(255),
	"user_uid" varchar(255),
	"admin_uid" varchar(255),
	"is_assigned" boolean DEFAULT false,
	"battery_capacity_kwh" varchar(255) DEFAULT '0',
	"range_km" varchar(255) DEFAULT '0',
	"vin" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_vehicle_uid_unique" UNIQUE("vehicle_uid"),
	CONSTRAINT "vehicles_license_number_unique" UNIQUE("license_number"),
	CONSTRAINT "vehicles_vin_unique" UNIQUE("vin")
);
--> statement-breakpoint
CREATE TABLE "wallet_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_limit_uid" varchar(255),
	"hard_limit" numeric(10, 2) DEFAULT '50.00',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_limits_wallet_limit_uid_unique" UNIQUE("wallet_limit_uid")
);
--> statement-breakpoint
CREATE TABLE "wallet_minimum_balances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"minimum_balance_uid" varchar(255),
	"minimum_balance" numeric(10, 2),
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_minimum_balances_minimum_balance_uid_unique" UNIQUE("minimum_balance_uid")
);
--> statement-breakpoint
CREATE TABLE "wallet_recharges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recharge_uid" varchar(255),
	"user_uid" varchar(255),
	"previous_balance" numeric(10, 2),
	"remaining_balance" numeric(10, 2),
	"recharge_amount" numeric(10, 2),
	"recharge_count" integer,
	"status" "payment_status_enum",
	"admin_uid" varchar(255),
	"gst_rate" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_recharges_recharge_uid_unique" UNIQUE("recharge_uid")
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_uid" varchar(255),
	"payment_uid" varchar(255),
	"wallet_uid" varchar(255),
	"user_uid" varchar(255),
	"amount" numeric(10, 2),
	"status" "payment_status_enum",
	"gst_rate" numeric(5, 2),
	"gst_amount" numeric(10, 2),
	"taxable_amount" numeric(10, 2),
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_transactions_transaction_uid_unique" UNIQUE("transaction_uid")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_uid" varchar(255),
	"user_profile_uid" varchar(255),
	"app_user_uid" varchar(255),
	"balance" numeric(10, 2) DEFAULT '0.00',
	"is_recharged" boolean DEFAULT false,
	"recharged_by_user_uid" varchar(255),
	"admin_uid" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallets_wallet_uid_unique" UNIQUE("wallet_uid")
);
--> statement-breakpoint
DROP TABLE "Addhub" CASCADE;--> statement-breakpoint
DROP TABLE "Analytics" CASCADE;--> statement-breakpoint
DROP TABLE "AssignRoles" CASCADE;--> statement-breakpoint
DROP TABLE "Assigntovechicles" CASCADE;--> statement-breakpoint
DROP TABLE "Assigntovehicleowener" CASCADE;--> statement-breakpoint
DROP TABLE "Bookings" CASCADE;--> statement-breakpoint
DROP TABLE "ChargerTransaction" CASCADE;--> statement-breakpoint
DROP TABLE "Charger_Unit" CASCADE;--> statement-breakpoint
DROP TABLE "Charingsessions" CASCADE;--> statement-breakpoint
DROP TABLE "Contactform" CASCADE;--> statement-breakpoint
DROP TABLE "Counter" CASCADE;--> statement-breakpoint
DROP TABLE "DailySignup" CASCADE;--> statement-breakpoint
DROP TABLE "DisputFrom" CASCADE;--> statement-breakpoint
DROP TABLE "FAQ" CASCADE;--> statement-breakpoint
DROP TABLE "Favorites" CASCADE;--> statement-breakpoint
DROP TABLE "Feedback" CASCADE;--> statement-breakpoint
DROP TABLE "Financial_details" CASCADE;--> statement-breakpoint
DROP TABLE "GstCreate" CASCADE;--> statement-breakpoint
DROP TABLE "HelpandSupport" CASCADE;--> statement-breakpoint
DROP TABLE "LogRetention" CASCADE;--> statement-breakpoint
DROP TABLE "Minimumbalance" CASCADE;--> statement-breakpoint
DROP TABLE "QRCode" CASCADE;--> statement-breakpoint
DROP TABLE "RazorpayData" CASCADE;--> statement-breakpoint
DROP TABLE "TransactionHistory" CASCADE;--> statement-breakpoint
DROP TABLE "Transactionsdetails" CASCADE;--> statement-breakpoint
DROP TABLE "User" CASCADE;--> statement-breakpoint
DROP TABLE "UserBilling" CASCADE;--> statement-breakpoint
DROP TABLE "WalletHardLimit" CASCADE;--> statement-breakpoint
DROP TABLE "iptracker" CASCADE;--> statement-breakpoint
DROP TABLE "wallet" CASCADE;--> statement-breakpoint
DROP TABLE "walletreachargehistory" CASCADE;--> statement-breakpoint
CREATE INDEX "charger_bookings_charger_uid_idx" ON "charger_bookings" USING btree ("charger_uid");--> statement-breakpoint
CREATE INDEX "charger_bookings_user_uid_idx" ON "charger_bookings" USING btree ("user_uid");--> statement-breakpoint
CREATE INDEX "charger_qr_codes_charger_uid_idx" ON "charger_qr_codes" USING btree ("charger_uid");--> statement-breakpoint
CREATE INDEX "chargers_owner_uid_idx" ON "chargers" USING btree ("owner_uid");--> statement-breakpoint
CREATE INDEX "chargers_admin_uid_idx" ON "chargers" USING btree ("admin_uid");--> statement-breakpoint
CREATE INDEX "charging_hubs_admin_uid_idx" ON "charging_hubs" USING btree ("admin_uid");--> statement-breakpoint
CREATE INDEX "favorite_chargers_charger_uid_idx" ON "favorite_chargers" USING btree ("charger_uid");--> statement-breakpoint
CREATE INDEX "favorite_chargers_user_uid_idx" ON "favorite_chargers" USING btree ("user_uid");--> statement-breakpoint
CREATE INDEX "user_roles_user_uid_idx" ON "user_roles" USING btree ("user_uid");--> statement-breakpoint
CREATE INDEX "user_roles_admin_uid_idx" ON "user_roles" USING btree ("admin_uid");--> statement-breakpoint
CREATE INDEX "vehicle_owners_admin_uid_idx" ON "vehicle_owners" USING btree ("admin_uid");--> statement-breakpoint
CREATE INDEX "vehicles_admin_uid_idx" ON "vehicles" USING btree ("admin_uid");--> statement-breakpoint
CREATE INDEX "vehicles_user_uid_idx" ON "vehicles" USING btree ("user_uid");--> statement-breakpoint
CREATE INDEX "vehicles_owner_uid_idx" ON "vehicles" USING btree ("owner_uid");--> statement-breakpoint
CREATE INDEX "wallets_app_user_uid_idx" ON "wallets" USING btree ("app_user_uid");--> statement-breakpoint
CREATE INDEX "wallets_user_profile_uid_idx" ON "wallets" USING btree ("user_profile_uid");--> statement-breakpoint
CREATE INDEX "wallets_admin_uid_idx" ON "wallets" USING btree ("admin_uid");