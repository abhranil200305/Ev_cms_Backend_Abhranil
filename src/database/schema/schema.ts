import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  index,
  integer,
  jsonb,
  text,
  uuid,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

// ============================================================
// 0. ENUM DEFINITIONS
// ============================================================

export const userRoleEnum = pgEnum("user_role_enum", [
  "Admin",
  "Driver",
  "Vehicle Owner",
  "User",
]);

export const chargerProtocolEnum = pgEnum("charger_protocol_enum", [
  "OCPP1.6J",
]);

export const chargerStatusEnum = pgEnum("charger_status_enum", [
  "Available",
  "Unavailable",
  "Occupied",
  "Faulted",
  "Charging",
  "Inactive",
]);

export const chargerTypeEnum = pgEnum("charger_type_enum", [
  "AC",
  "DC",
  "DC_FAST",
  "HYBRID",
]);

export const parkingTypeEnum = pgEnum("parking_type_enum", [
  "PUBLIC",
  "PRIVATE",
  "RESIDENTIAL",
  "COMMERCIAL",
  "MALL",
  "OFFICE",
  "HIGHWAY",
]);

export const connectorTypeEnum = pgEnum("connector_type_enum", [
  "TYPE_1",
  "TYPE_2",
  "CCS",
  "CCS2",
  "CHADEMO",
  "GB_T",
  "BHARAT_AC001",
  "BHARAT_DC001",
]);

export const chargerUseTypeEnum = pgEnum("charger_use_type_enum", [
  "PUBLIC",
  "PRIVATE",
  "SEMI_PUBLIC",
  "FLEET",
  "CAPTIVE",
]);

export const paymentStatusEnum = pgEnum("payment_status_enum", [
  "Success",
  "Failed",
  "Pending",
  "Completed",
  "Cancelled",
  "Refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method_enum", [
  "UPI",
  "CARD",
  "NETBANKING",
  "WALLET",
  "CASH",
  "EMI",
]);

export const vehicleCategoryEnum = pgEnum("vehicle_category_enum", [
  "PERSONAL",
  "COMMERCIAL",
  "FLEET",
]);

export const vehicleTypeEnum = pgEnum("vehicle_type_enum", [
  "TWO_WHEELER",
  "THREE_WHEELER",
  "FOUR_WHEELER",
  "BUS",
  "TRUCK",
]);

export const supportTicketStatusEnum = pgEnum("support_ticket_status_enum", [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
]);

export const feedbackTypeEnum = pgEnum("feedback_type_enum", [
  "APP",
  "CHARGER",
  "PAYMENT",
  "SERVICE",
  "GENERAL",
]);

export const disputeRelatedToEnum = pgEnum("dispute_related_to_enum", [
  "EV",
  "CHARGER",
  "PAYMENT",
  "WALLET",
  "REFUND",
  "OTHER",
]);

// ============================================================
// 1. TABLE DEFINITIONS
// ============================================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  userUid: varchar("user_uid", { length: 255 }).unique(),

  username: varchar("username", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),

  accountType: userRoleEnum("account_type"),

  designation: varchar("designation", { length: 255 }),
  address: text("address"),

  phone: varchar("phone", { length: 255 }).unique(),
  profileImageUrl: varchar("profile_image_url", { length: 255 }),

  otp: varchar("otp", { length: 255 }),
  otpExpiresAt: timestamp("otp_expires_at"),

  isEmailVerified: boolean("is_email_verified").default(false),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chargers = pgTable(
  "chargers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    chargerUid: varchar("charger_uid", { length: 255 }).unique(),

    serialNumber: varchar("serial_number", { length: 255 }),
    name: varchar("name", { length: 255 }),
    hostName: varchar("host_name", { length: 255 }),

    segment: varchar("segment", { length: 255 }),
    subSegment: varchar("sub_segment", { length: 255 }),

    totalCapacityKw: varchar("total_capacity_kw", { length: 255 }),

    chargerType: chargerTypeEnum("charger_type"),
    chargerStatus: chargerStatusEnum("charger_status").default("Available"),

    parkingType: parkingTypeEnum("parking_type"),

    connectorCount: integer("connector_count"),

    connectorType: connectorTypeEnum("connector_type"),

    connectorTotalCapacityKw: varchar("connector_total_capacity_kw", {
      length: 255,
    }),

    /*
      Example JSON format:

      [
        {
          "type": "DC_FAST",
          "powerKw": 30,
          "count": 1
        },
        {
          "type": "DC_FAST",
          "powerKw": 60,
          "count": 1
        }
      ]

      Unit is always kW, so only powerKw is stored.
    */
    connectorPowerConfig: jsonb("connector_power_config"),

    latitude: numeric("latitude", { precision: 9, scale: 6 }),
    longitude: numeric("longitude", { precision: 9, scale: 6 }),

    address: text("address"),

    usageType: chargerUseTypeEnum("usage_type"),

    isOpen24x7: boolean("is_open_24x7").default(false),

    imageUrl: varchar("image_url", { length: 255 }),

    ownerUid: varchar("owner_uid", { length: 255 }),
    chargerIdentity: text("charger_identity"),

    adminUid: varchar("admin_uid", { length: 255 }),

    googleMapsUrl: text("google_maps_url"),

    protocol: chargerProtocolEnum("protocol").default("OCPP1.6J"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("chargers_owner_uid_idx").on(table.ownerUid),
    index("chargers_admin_uid_idx").on(table.adminUid),
  ],
);

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    roleUid: varchar("role_uid", { length: 255 }).unique(),

    userUid: varchar("user_uid", { length: 255 }),

    name: userRoleEnum("name"),

    description: text("description"),

    adminUid: varchar("admin_uid", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("user_roles_user_uid_idx").on(table.userUid),
    index("user_roles_admin_uid_idx").on(table.adminUid),
  ],
);

export const vehicles = pgTable(
  "vehicles",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    vehicleUid: varchar("vehicle_uid", { length: 255 }).unique(),

    name: varchar("name", { length: 255 }),
    model: varchar("model", { length: 255 }),

    licenseNumber: varchar("license_number", { length: 255 }).unique(),

    ownerName: varchar("owner_name", { length: 255 }),

    category: vehicleCategoryEnum("category"),
    type: vehicleTypeEnum("type"),

    ownerUid: varchar("owner_uid", { length: 255 }),
    userUid: varchar("user_uid", { length: 255 }),
    adminUid: varchar("admin_uid", { length: 255 }),

    isAssigned: boolean("is_assigned").default(false),

    batteryCapacityKwh: varchar("battery_capacity_kwh", {
      length: 255,
    }).default("0"),

    rangeKm: varchar("range_km", { length: 255 }).default("0"),

    vin: varchar("vin", { length: 255 }).unique(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("vehicles_admin_uid_idx").on(table.adminUid),
    index("vehicles_user_uid_idx").on(table.userUid),
    index("vehicles_owner_uid_idx").on(table.ownerUid),
  ],
);

export const vehicleOwners = pgTable(
  "vehicle_owners",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    ownerUid: varchar("owner_uid", { length: 255 }).unique(),

    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),

    email: varchar("email", { length: 255 }).unique(),
    phone: varchar("phone", { length: 255 }),

    licenseNumber: varchar("license_number", { length: 255 }).unique(),

    governmentDocumentUrl: varchar("government_document_url", {
      length: 255,
    }),

    nationality: varchar("nationality", { length: 255 }),
    address: text("address"),

    role: userRoleEnum("role"),

    adminUid: varchar("admin_uid", { length: 255 }).unique(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("vehicle_owners_admin_uid_idx").on(table.adminUid)],
);

export const paymentOrders = pgTable("payment_orders", {
  id: uuid("id").primaryKey().defaultRandom(),

  paymentOrderUid: varchar("payment_order_uid", { length: 255 }).unique(),

  razorpayOrderId: varchar("razorpay_order_id", { length: 255 }).unique(),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }).unique(),

  amount: numeric("amount", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 255 }),

  status: paymentStatusEnum("status"),

  attempts: integer("attempts"),

  method: paymentMethodEnum("method"),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dashboardMetrics = pgTable("dashboard_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),

  metricUid: varchar("metric_uid", { length: 255 }).unique(),

  totalUsers: integer("total_users"),
  totalUserProfiles: integer("total_user_profiles"),
  dailyNewUsers: integer("daily_new_users"),
  totalRoles: integer("total_roles"),
  totalChargers: integer("total_chargers"),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dailySignupMetrics = pgTable("daily_signup_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),

  signupMetricUid: varchar("signup_metric_uid", { length: 255 }).unique(),

  signupDate: timestamp("signup_date").defaultNow().notNull(),
  signupCount: integer("signup_count").default(0).notNull(),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),

  logUid: varchar("log_uid", { length: 255 }).unique(),

  eventType: varchar("event_type", { length: 255 }),
  payload: jsonb("payload"),
  filePath: text("file_path"),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chargerQrCodes = pgTable(
  "charger_qr_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    qrCodeUid: varchar("qr_code_uid", { length: 255 }).unique(),

    chargerUid: varchar("charger_uid", { length: 255 }),
    qrCodeData: text("qr_code_data"),

    adminUid: varchar("admin_uid", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("charger_qr_codes_charger_uid_idx").on(table.chargerUid)],
);

export const wallets = pgTable(
  "wallets",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    walletUid: varchar("wallet_uid", { length: 255 }).unique(),

    userProfileUid: varchar("user_profile_uid", { length: 255 }),
    appUserUid: varchar("app_user_uid", { length: 255 }),

    balance: numeric("balance", { precision: 10, scale: 2 }).default("0.00"),

    isRecharged: boolean("is_recharged").default(false),
    rechargedByUserUid: varchar("recharged_by_user_uid", { length: 255 }),

    adminUid: varchar("admin_uid", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("wallets_app_user_uid_idx").on(table.appUserUid),
    index("wallets_user_profile_uid_idx").on(table.userProfileUid),
    index("wallets_admin_uid_idx").on(table.adminUid),
  ],
);

export const walletRecharges = pgTable("wallet_recharges", {
  id: uuid("id").primaryKey().defaultRandom(),

  rechargeUid: varchar("recharge_uid", { length: 255 }).unique(),

  userUid: varchar("user_uid", { length: 255 }),

  previousBalance: numeric("previous_balance", { precision: 10, scale: 2 }),
  remainingBalance: numeric("remaining_balance", { precision: 10, scale: 2 }),
  rechargeAmount: numeric("recharge_amount", { precision: 10, scale: 2 }),

  rechargeCount: integer("recharge_count"),

  status: paymentStatusEnum("status"),

  adminUid: varchar("admin_uid", { length: 255 }),

  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sequenceCounters = pgTable("sequence_counters", {
  id: uuid("id").primaryKey().defaultRandom(),

  value: integer("value").default(100).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chargingHubs = pgTable(
  "charging_hubs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    hubUid: varchar("hub_uid", { length: 255 }).unique(),

    name: varchar("name", { length: 255 }),
    chargerUids: jsonb("charger_uids"),

    tariffPerKwh: numeric("tariff_per_kwh", { precision: 10, scale: 2 }),

    location: text("location"),

    adminUid: varchar("admin_uid", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("charging_hubs_admin_uid_idx").on(table.adminUid)],
);

export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),

  transactionUid: varchar("transaction_uid", { length: 255 }).unique(),

  paymentUid: varchar("payment_uid", { length: 255 }),
  walletUid: varchar("wallet_uid", { length: 255 }),
  userUid: varchar("user_uid", { length: 255 }),
  chargerUid: varchar("charger_uid", { length: 255 }),

  amount: numeric("amount", { precision: 10, scale: 2 }),

  status: paymentStatusEnum("status"),

  method: paymentMethodEnum("method"),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),

  transactionUid: varchar("transaction_uid", { length: 255 }).unique(),

  paymentUid: varchar("payment_uid", { length: 255 }),
  walletUid: varchar("wallet_uid", { length: 255 }),
  userUid: varchar("user_uid", { length: 255 }),

  amount: numeric("amount", { precision: 10, scale: 2 }),

  status: paymentStatusEnum("status"),

  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }),
  gstAmount: numeric("gst_amount", { precision: 10, scale: 2 }),
  taxableAmount: numeric("taxable_amount", { precision: 10, scale: 2 }),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accessLogs = pgTable("access_logs", {
  id: uuid("id").primaryKey().defaultRandom(),

  accessLogUid: varchar("access_log_uid", { length: 255 }).unique(),

  accessedAt: timestamp("accessed_at"),
  filePath: text("file_path"),
  ipAddress: varchar("ip_address", { length: 64 }),
  message: text("message"),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const favoriteChargers = pgTable(
  "favorite_chargers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    favoriteUid: varchar("favorite_uid", { length: 255 }).unique(),

    chargerUid: varchar("charger_uid", { length: 255 }),
    userUid: varchar("user_uid", { length: 255 }),

    isFavorite: boolean("is_favorite").default(false),

    adminUid: varchar("admin_uid", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("favorite_chargers_charger_uid_idx").on(table.chargerUid),
    index("favorite_chargers_user_uid_idx").on(table.userUid),
  ],
);

export const chargerBookings = pgTable(
  "charger_bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    bookingUid: varchar("booking_uid", { length: 255 }).unique(),

    chargerUid: varchar("charger_uid", { length: 255 }),
    userUid: varchar("user_uid", { length: 255 }),

    isActive: boolean("is_active").default(false),

    status: chargerStatusEnum("status"),

    startTime: timestamp("start_time"),
    endTime: timestamp("end_time"),

    isReminderSent: boolean("is_reminder_sent").default(false),

    adminUid: varchar("admin_uid", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("charger_bookings_charger_uid_idx").on(table.chargerUid),
    index("charger_bookings_user_uid_idx").on(table.userUid),
  ],
);

export const walletMinimumBalances = pgTable("wallet_minimum_balances", {
  id: uuid("id").primaryKey().defaultRandom(),

  minimumBalanceUid: varchar("minimum_balance_uid", { length: 255 }).unique(),

  minimumBalance: numeric("minimum_balance", { precision: 10, scale: 2 }),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),

  ticketUid: varchar("ticket_uid", { length: 255 }).unique(),

  customerName: varchar("customer_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 255 }),

  message: text("message"),

  adminUid: varchar("admin_uid", { length: 255 }),

  status: supportTicketStatusEnum("status").default("OPEN"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentDisputes = pgTable("payment_disputes", {
  id: uuid("id").primaryKey().defaultRandom(),

  disputeUid: varchar("dispute_uid", { length: 255 }).unique(),

  customerName: varchar("customer_name", { length: 255 }),

  relatedTo: disputeRelatedToEnum("related_to"),

  reason: text("reason"),

  hasDuplicateCharge: boolean("has_duplicate_charge").default(false),
  wasChargedIncorrectly: boolean("was_charged_incorrectly").default(false),
  refundNotReceived: boolean("refund_not_received").default(false),
  paidUsingOtherMethod: boolean("paid_using_other_method").default(false),
  hasRecurringCharge: boolean("has_recurring_charge").default(false),

  disputedTransactionUid: varchar("disputed_transaction_uid", { length: 255 }),

  otherReason: text("other_reason"),
  transactionDetails: text("transaction_details"),
  disputeDetails: text("dispute_details"),

  userUid: varchar("user_uid", { length: 255 }),

  isResolved: boolean("is_resolved").default(false),

  status: supportTicketStatusEnum("status").default("OPEN"),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userFeedback = pgTable("user_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),

  feedbackUid: varchar("feedback_uid", { length: 255 }).unique(),

  username: varchar("username", { length: 255 }),
  email: varchar("email", { length: 255 }),

  rating: integer("rating"),
  message: text("message"),

  type: feedbackTypeEnum("type"),

  isSurveyCompleted: boolean("is_survey_completed").default(false),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),

  faqUid: varchar("faq_uid", { length: 255 }).unique(),

  question: text("question"),
  answer: text("answer"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),

  contactMessageUid: varchar("contact_message_uid", { length: 255 }).unique(),

  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  message: text("message"),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chargingSessions = pgTable("charging_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),

  chargingSessionUid: varchar("charging_session_uid", {
    length: 255,
  }).unique(),

  externalSessionId: varchar("external_session_id", { length: 255 }),

  chargerUid: varchar("charger_uid", { length: 255 }),
  userUid: varchar("user_uid", { length: 255 }),

  startTime: timestamp("start_time"),
  stopTime: timestamp("stop_time"),

  meterStartKwh: numeric("meter_start_kwh", { precision: 10, scale: 2 }),
  meterStopKwh: numeric("meter_stop_kwh", { precision: 10, scale: 2 }),
  consumedKwh: numeric("consumed_kwh", { precision: 10, scale: 2 }),

  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }),

  status: chargerStatusEnum("status"),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chargingTransactions = pgTable("charging_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),

  chargingTransactionUid: varchar("charging_transaction_uid", {
    length: 255,
  }).unique(),

  chargerUid: varchar("charger_uid", { length: 255 }),
  userUid: varchar("user_uid", { length: 255 }),

  transactionUid: varchar("transaction_uid", { length: 255 }),

  connectorId: varchar("connector_id", { length: 255 }),

  maxKwh: numeric("max_kwh", { precision: 10, scale: 2 }),

  status: chargerStatusEnum("status"),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userInvoices = pgTable("user_invoices", {
  id: uuid("id").primaryKey().defaultRandom(),

  invoiceUid: varchar("invoice_uid", { length: 255 }).unique(),

  userUid: varchar("user_uid", { length: 255 }),
  chargerUid: varchar("charger_uid", { length: 255 }),
  walletUid: varchar("wallet_uid", { length: 255 }),

  username: varchar("username", { length: 255 }),

  lastTransactionUid: varchar("last_transaction_uid", { length: 255 }),

  deductedBalance: numeric("deducted_balance", { precision: 10, scale: 2 }),
  energyConsumedKwh: numeric("energy_consumed_kwh", {
    precision: 10,
    scale: 2,
  }),

  chargingDuration: varchar("charging_duration", { length: 255 }),

  taxableAmount: numeric("taxable_amount", { precision: 10, scale: 2 }),
  gstAmount: numeric("gst_amount", { precision: 10, scale: 2 }),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }),

  invoicePdfUrl: text("invoice_pdf_url"),

  status: paymentStatusEnum("status"),

  adminUid: varchar("admin_uid", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const taxRates = pgTable("tax_rates", {
  id: uuid("id").primaryKey().defaultRandom(),

  taxRateUid: varchar("tax_rate_uid", { length: 255 }).unique(),

  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const walletLimits = pgTable("wallet_limits", {
  id: uuid("id").primaryKey().defaultRandom(),

  walletLimitUid: varchar("wallet_limit_uid", { length: 255 }).unique(),

  hardLimit: numeric("hard_limit", { precision: 10, scale: 2 }).default(
    "50.00",
  ),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================
// 2. RELATIONS
// ============================================================

export const usersRelations = relations(users, ({ many }) => ({
  vehicles: many(vehicles),
  wallets: many(wallets),
  chargingHubs: many(chargingHubs),
  chargers: many(chargers),
  roles: many(userRoles),
}));

export const chargersRelations = relations(chargers, ({ one, many }) => ({
  owner: one(users, {
    fields: [chargers.ownerUid],
    references: [users.userUid],
  }),

  qrCodes: many(chargerQrCodes),
  chargingSessions: many(chargingSessions),
  bookings: many(chargerBookings),
  favorites: many(favoriteChargers),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userUid],
    references: [users.userUid],
  }),
}));

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  admin: one(users, {
    fields: [vehicles.adminUid],
    references: [users.userUid],
  }),

  user: one(users, {
    fields: [vehicles.userUid],
    references: [users.userUid],
  }),

  owner: one(vehicleOwners, {
    fields: [vehicles.ownerUid],
    references: [vehicleOwners.ownerUid],
  }),
}));

export const vehicleOwnersRelations = relations(
  vehicleOwners,
  ({ one, many }) => ({
    vehicles: many(vehicles),

    adminUser: one(users, {
      fields: [vehicleOwners.adminUid],
      references: [users.userUid],
    }),
  }),
);

export const chargerQrCodesRelations = relations(chargerQrCodes, ({ one }) => ({
  charger: one(chargers, {
    fields: [chargerQrCodes.chargerUid],
    references: [chargers.chargerUid],
  }),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  appUser: one(users, {
    fields: [wallets.appUserUid],
    references: [users.userUid],
  }),

  userProfile: one(users, {
    fields: [wallets.userProfileUid],
    references: [users.userUid],
  }),

  paymentTransactions: many(paymentTransactions),
  walletTransactions: many(walletTransactions),
}));

export const chargingHubsRelations = relations(chargingHubs, ({ one }) => ({
  adminUser: one(users, {
    fields: [chargingHubs.adminUid],
    references: [users.userUid],
  }),
}));

export const paymentTransactionsRelations = relations(
  paymentTransactions,
  ({ one }) => ({
    user: one(users, {
      fields: [paymentTransactions.userUid],
      references: [users.userUid],
    }),

    wallet: one(wallets, {
      fields: [paymentTransactions.walletUid],
      references: [wallets.walletUid],
    }),

    charger: one(chargers, {
      fields: [paymentTransactions.chargerUid],
      references: [chargers.chargerUid],
    }),
  }),
);

export const walletTransactionsRelations = relations(
  walletTransactions,
  ({ one }) => ({
    user: one(users, {
      fields: [walletTransactions.userUid],
      references: [users.userUid],
    }),

    wallet: one(wallets, {
      fields: [walletTransactions.walletUid],
      references: [wallets.walletUid],
    }),
  }),
);

export const favoriteChargersRelations = relations(
  favoriteChargers,
  ({ one }) => ({
    user: one(users, {
      fields: [favoriteChargers.userUid],
      references: [users.userUid],
    }),

    charger: one(chargers, {
      fields: [favoriteChargers.chargerUid],
      references: [chargers.chargerUid],
    }),
  }),
);

export const chargerBookingsRelations = relations(
  chargerBookings,
  ({ one }) => ({
    user: one(users, {
      fields: [chargerBookings.userUid],
      references: [users.userUid],
    }),

    charger: one(chargers, {
      fields: [chargerBookings.chargerUid],
      references: [chargers.chargerUid],
    }),
  }),
);

export const chargingSessionsRelations = relations(
  chargingSessions,
  ({ one }) => ({
    user: one(users, {
      fields: [chargingSessions.userUid],
      references: [users.userUid],
    }),

    charger: one(chargers, {
      fields: [chargingSessions.chargerUid],
      references: [chargers.chargerUid],
    }),
  }),
);

export const chargingTransactionsRelations = relations(
  chargingTransactions,
  ({ one }) => ({
    user: one(users, {
      fields: [chargingTransactions.userUid],
      references: [users.userUid],
    }),

    charger: one(chargers, {
      fields: [chargingTransactions.chargerUid],
      references: [chargers.chargerUid],
    }),
  }),
);

export const userInvoicesRelations = relations(userInvoices, ({ one }) => ({
  user: one(users, {
    fields: [userInvoices.userUid],
    references: [users.userUid],
  }),

  charger: one(chargers, {
    fields: [userInvoices.chargerUid],
    references: [chargers.chargerUid],
  }),

  wallet: one(wallets, {
    fields: [userInvoices.walletUid],
    references: [wallets.walletUid],
  }),
}));