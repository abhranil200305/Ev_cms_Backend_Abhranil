import { 
  pgTable, 
  varchar, 
  timestamp, 
  boolean, 
  index, 
  integer, 
  jsonb,
  text,
  uuid
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ==========================================
// 1. TABLES DEFINITIONS
// ==========================================

export const User = pgTable("User", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  username: varchar("username", { length: 255 }).unique(),
  firstname: varchar("firstname", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  userType: varchar("userType", { length: 255 }), // Merged role/userType intent
  designation: varchar("designation", { length: 255 }),
  address: text("address"),
  phonenumber: varchar("phonenumber", { length: 255 }).unique(),
  profilepicture: varchar("profilepicture", { length: 255 }),
  otp: varchar("otp", { length: 255 }),
  otpExpiration: timestamp("otpExpiration"),
  emailVerified: boolean("emailVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const Financial_details = pgTable("Financial_details", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  bank_account_number: varchar("bank_account_number", { length: 255 }),
  isfc_code: varchar("isfc_code", { length: 255 }),
  bank_name: varchar("bank_name", { length: 255 }),
  branch_name: varchar("branch_name", { length: 255 }),
  branch_address: text("branch_address"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  userProfileId: varchar("userProfileId", { length: 255 }).unique(), // Maps to User.uid
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const Charger_Unit = pgTable("Charger_Unit", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  Chargerserialnum: varchar("Chargerserialnum", { length: 255 }),
  ChargerName: varchar("ChargerName", { length: 255 }),
  Chargerhost: varchar("Chargerhost", { length: 255 }),
  Segment: varchar("Segment", { length: 255 }),
  Subsegment: varchar("Subsegment", { length: 255 }),
  Total_Capacity: varchar("Total_Capacity", { length: 255 }),
  Chargertype: varchar("Chargertype", { length: 255 }),
  parking: varchar("parking", { length: 255 }),
  number_of_connectors: varchar("number_of_connectors", { length: 255 }),
  Connector_type: varchar("Connector_type", { length: 255 }),
  connector_total_capacity: varchar("connector_total_capacity", { length: 255 }),
  lattitude: varchar("lattitude", { length: 255 }),
  longitute: varchar("longitute", { length: 255 }), 
  full_address: text("full_address"),
  charger_use_type: varchar("charger_use_type", { length: 255 }),
  twenty_four_seven_open_status: varchar("twenty_four_seven_open_status", { length: 255 }),
  charger_image: varchar("charger_image", { length: 255 }),
  userId: varchar("userId", { length: 255 }), // Maps to User.uid
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  chargeridentity: text("chargeridentity"),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
  googlemapslink: text("googlemapslink"),
  protocol: varchar("protocol", { length: 255 }).default("OCPP"),
}, (table) => [
  index("Charger_Unit_userId_fkey").on(table.userId),
]);

export const AssignRoles = pgTable("AssignRoles", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  userid: varchar("userid", { length: 255 }),
  rolename: varchar("rolename", { length: 255 }),
  roledesc: text("roledesc"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const Assigntovechicles = pgTable("Assigntovechicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  vehiclename: varchar("vehiclename", { length: 255 }),
  vehiclemodel: varchar("vehiclemodel", { length: 255 }),
  vehiclelicense: varchar("vehiclelicense", { length: 255 }).unique(),
  vehicleowner: varchar("vehicleowner", { length: 255 }),
  vehiclecategory: varchar("vehiclecategory", { length: 255 }),
  vehicletype: varchar("vehicletype", { length: 255 }),
  vehicleowenerId: varchar("vehicleowenerId", { length: 255 }),
  isvehicleassigned: boolean("isvehicleassigned"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  userId: varchar("userId", { length: 255 }),
  adminuid: varchar("adminuid", { length: 255 }),
  vehiclebatterycapacity: varchar("vehiclebatterycapacity", { length: 255 }).default("0"),
  vehiclerange: varchar("vehiclerange", { length: 255 }).default("0"),
  vehiclevin: varchar("vehiclevin", { length: 255 }).unique().$defaultFn(() => crypto.randomUUID()),
}, (table) => [
  index("Assigntovechicles_adminuid_fkey").on(table.adminuid),
  index("Assigntovechicles_userId_fkey").on(table.userId),
  index("Assigntovechicles_vehicleowenerId_fkey").on(table.vehicleowenerId),
]);

export const Assigntovehicleowener = pgTable("Assigntovehicleowener", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  vehicleowenerfirstname: varchar("vehicleowenerfirstname", { length: 255 }),
  vehicleowenerlastename: varchar("vehicleowenerlastename", { length: 255 }), 
  vehicleoweneremail: varchar("vehicleoweneremail", { length: 255 }).unique(),
  phonenumber: varchar("phonenumber", { length: 255 }),
  vehicleowenerlicense: varchar("vehicleowenerlicense", { length: 255 }).unique(),
  vehicleowenergovdocs: varchar("vehicleowenergovdocs", { length: 255 }),
  vehicleowenernationality: varchar("vehicleowenernationality", { length: 255 }),
  vehicleoweneraddress: text("vehicleoweneraddress"),
  vehicleowenerrole: varchar("vehicleowenerrole", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  adminid: varchar("adminid", { length: 255 }).unique(),
});

export const RazorpayData = pgTable("RazorpayData", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  orderId: varchar("orderId", { length: 255 }).unique(),
  paymentId: varchar("paymentId", { length: 255 }).unique(),
  amount: varchar("amount", { length: 255 }),
  currency: varchar("currency", { length: 255 }),
  status: varchar("status", { length: 255 }),
  attempts: varchar("attempts", { length: 255 }),
  method: varchar("method", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const Analytics = pgTable("Analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  totalnumberofusers: varchar("totalnumberofusers", { length: 255 }),
  totalnumberofuserprofiles: varchar("totalnumberofuserprofiles", { length: 255 }),
  perdaynewusercount: varchar("perdaynewusercount", { length: 255 }),
  countofroles: varchar("countofroles", { length: 255 }),
  countofchargerunits: varchar("countofchargerunits", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const DailySignup = pgTable("DailySignup", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }),
  date: timestamp("date").defaultNow().notNull(),
  newSignupCount: integer("newSignupCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const LogRetention = pgTable("LogRetention", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  messagetype: varchar("messagetype", { length: 255 }),
  messages: jsonb("messages"),
  filelocation: text("filelocation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const QRCode = pgTable("QRCode", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  chargerid: varchar("chargerid", { length: 255 }),
  qrcodedata: text("qrcodedata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
}, (table) => [
  index("QRCode_chargerid_fkey").on(table.chargerid),
]);

export const wallet = pgTable("wallet", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  userprofilerelatedwallet: varchar("userprofilerelatedwallet", { length: 255 }),
  appuserrelatedwallet: varchar("appuserrelatedwallet", { length: 255 }),
  balance: varchar("balance", { length: 255 }),
  iswalletrechargedone: boolean("iswalletrechargedone"),
  recharger_made_by_which_user: varchar("recharger_made_by_which_user", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminuid: varchar("associatedadminuid", { length: 255 }),
}, (table) => [
  index("wallet_appuserrelatedwallet_fkey").on(table.appuserrelatedwallet),
  index("wallet_userprofilerelatedwallet_fkey").on(table.userprofilerelatedwallet),
]);

export const walletreachargehistory = pgTable("walletreachargehistory", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  userassociatedid: varchar("userassociatedid", { length: 255 }),
  previousbalance: varchar("previousbalance", { length: 255 }),
  balanceleft: varchar("balanceleft", { length: 255 }),
  addedbalance: varchar("addedbalance", { length: 255 }),
  numberofrecharge: varchar("numberofrecharge", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
  gst: varchar("gst", { length: 255 }),
});

export const Counter = pgTable("Counter", {
  id: uuid("id").primaryKey().defaultRandom(),
  value: integer("value").default(100).notNull(),
});

export const Addhub = pgTable("Addhub", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  hubname: varchar("hubname", { length: 255 }),
  hubchargers: jsonb("hubchargers"),
  hubtariff: varchar("hubtariff", { length: 255 }),
  hublocation: text("hublocation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  adminuid: varchar("adminuid", { length: 255 }),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
}, (table) => [
  index("Addhub_adminuid_fkey").on(table.adminuid),
]);

export const Transactionsdetails = pgTable("Transactionsdetails", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  paymentid: varchar("paymentid", { length: 255 }),
  walletid: varchar("walletid", { length: 255 }),
  userid: varchar("userid", { length: 255 }),
  price: varchar("price", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  chargeruid: varchar("chargeruid", { length: 255 }),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const TransactionHistory = pgTable("TransactionHistory", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  paymentid: varchar("paymentid", { length: 255 }),
  walletid: varchar("walletid", { length: 255 }),
  userid: varchar("userid", { length: 255 }),
  price: varchar("price", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
  gst: varchar("gst", { length: 255 }),
  gstdeductedamount: varchar("gstdeductedamount", { length: 255 }),
  taxableamount: varchar("taxableamount", { length: 255 }),
});

export const iptracker = pgTable("iptracker", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  datetimeofaccess: varchar("datetimeofaccess", { length: 255 }),
  filepath: text("filepath"),
  ipaddress: varchar("ipaddress", { length: 255 }),
  messages: text("messages"),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const Favorites = pgTable("Favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  chargeruid: varchar("chargeruid", { length: 255 }),
  useruid: varchar("useruid", { length: 255 }),
  isfavorite: boolean("isfavorite").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const Bookings = pgTable("Bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  chargeruid: varchar("chargeruid", { length: 255 }),
  useruid: varchar("useruid", { length: 255 }),
  isbooked: boolean("isbooked").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  bookingtimefrom: timestamp("bookingtimefrom"),
  bookingtimeto: timestamp("bookingtimeto"),
  remindersent: boolean("remindersent"),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const Minimumbalance = pgTable("Minimumbalance", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  minbalance: varchar("minbalance", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const HelpandSupport = pgTable("HelpandSupport", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  phonenumber: varchar("phonenumber", { length: 255 }),
  adminuid: varchar("adminuid", { length: 255 }),
  messagestatus: boolean("messagestatus").default(true),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const DisputFrom = pgTable("DisputFrom", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  customername: varchar("customername", { length: 255 }),
  relatedtoev: varchar("relatedtoev", { length: 255 }),
  reason: text("reason"),
  morethanonecharge: varchar("morethanonecharge", { length: 255 }),
  wrongcharged: varchar("wrongcharged", { length: 255 }),
  didnotreceiverefund: varchar("didnotreceiverefund", { length: 255 }),
  paidforothermeans: varchar("paidforothermeans", { length: 255 }),
  disputtransaction: varchar("disputtransaction", { length: 255 }),
  chargedregularly: varchar("chargedregularly", { length: 255 }),
  notlistedabove: text("notlistedabove"),
  transactiondetails: text("transactiondetails"),
  disputedetails: text("disputedetails"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
  userid: varchar("userid", { length: 255 }),
  resolvedstatus: boolean("resolvedstatus"),
});

export const Feedback = pgTable("Feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  username: varchar("username", { length: 255 }),
  email: varchar("email", { length: 255 }),
  ratingnumber: varchar("ratingnumber", { length: 255 }),
  feedbackmessage: text("feedbackmessage"),
  feedbacktype: varchar("feedbacktype", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
  isserveytook: boolean("isserveytook").default(false),
});

export const FAQ = pgTable("FAQ", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  faqquestion: text("faqquestion"),
  faqdescription: text("faqdescription"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const Contactform = pgTable("Contactform", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  firstname: varchar("firstname", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }),
  email: varchar("email", { length: 255 }),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const Charingsessions = pgTable("Charingsessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  sessionid: varchar("sessionid", { length: 255 }),
  chargerid: varchar("chargerid", { length: 255 }),
  startime: varchar("startime", { length: 255 }),
  stoptime: varchar("stoptime", { length: 255 }),
  meterstart: varchar("meterstart", { length: 255 }),
  meterstop: varchar("meterstop", { length: 255 }),
  consumedkwh: varchar("consumedkwh", { length: 255 }),
  totalcost: varchar("totalcost", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  userid: varchar("userid", { length: 255 }),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const ChargerTransaction = pgTable("ChargerTransaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  chargerid: varchar("chargerid", { length: 255 }),
  userid: varchar("userid", { length: 255 }),
  transactionid: varchar("transactionid", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  connectorid: varchar("connectorid", { length: 255 }),
  max_kwh: varchar("max_kwh", { length: 255 }),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
});

export const UserBilling = pgTable("UserBilling", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  userid: varchar("userid", { length: 255 }),
  chargerid: varchar("chargerid", { length: 255 }),
  username: varchar("username", { length: 255 }),
  walletid: varchar("walletid", { length: 255 }),
  lasttransaction: varchar("lasttransaction", { length: 255 }),
  balancededuct: varchar("balancededuct", { length: 255 }),
  energyconsumption: varchar("energyconsumption", { length: 255 }),
  chargingtime: varchar("chargingtime", { length: 255 }),
  taxableamount: varchar("taxableamount", { length: 255 }),
  gstamount: varchar("gstamount", { length: 255 }),
  totalamount: varchar("totalamount", { length: 255 }),
  associatedadminid: varchar("associatedadminid", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  billingpdf: text("billingpdf"),
});

export const GstCreate = pgTable("GstCreate", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  gst: varchar("gst", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const WalletHardLimit = pgTable("WalletHardLimit", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: varchar("uid", { length: 255 }).unique(),
  hardlimit: varchar("hardlimit", { length: 255 }).default("50"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});


// ==========================================
// 2. RELATIONS STRUCTURING
// ==========================================

export const UserRelations = relations(User, ({ one, many }) => ({
  vehicles: many(Assigntovechicles),
  wallets: many(wallet),
  hubs: many(Addhub),
  chargerUnits: many(Charger_Unit),
  financialDetails: one(Financial_details, {
    fields: [User.uid],
    references: [Financial_details.userProfileId],
  }),
  vehicleowener: one(Assigntovehicleowener, {
    fields: [User.uid],
    references: [Assigntovehicleowener.adminid],
  }),
}));

export const FinancialDetailsRelations = relations(Financial_details, ({ one }) => ({
  userProfile: one(User, {
    fields: [Financial_details.userProfileId],
    references: [User.uid],
  }),
}));

export const ChargerUnitRelations = relations(Charger_Unit, ({ one, many }) => ({
  chargerbuyer: one(User, {
    fields: [Charger_Unit.userId],
    references: [User.uid],
  }),
  QRCode: many(QRCode),
}));

export const AssigntovechiclesRelations = relations(Assigntovechicles, ({ one }) => ({
  associateadmin: one(User, {
    fields: [Assigntovechicles.adminuid],
    references: [User.uid],
  }),
  user: one(User, {
    fields: [Assigntovechicles.userId],
    references: [User.uid],
  }),
  vehicleowener: one(Assigntovehicleowener, {
    fields: [Assigntovechicles.vehicleowenerId],
    references: [Assigntovehicleowener.uid],
  }),
}));

export const AssigntovehicleowenerRelations = relations(Assigntovehicleowener, ({ one, many }) => ({
  vehicles: many(Assigntovechicles),
  adminuserprofile: one(User, {
    fields: [Assigntovehicleowener.adminid],
    references: [User.uid],
  }),
}));

export const QRCodeRelations = relations(QRCode, ({ one }) => ({
  charger: one(Charger_Unit, {
    fields: [QRCode.chargerid],
    references: [Charger_Unit.uid],
  }),
}));

export const walletRelations = relations(wallet, ({ one }) => ({
  user: one(User, {
    fields: [wallet.appuserrelatedwallet],
    references: [User.uid],
  }),
  userprofile: one(User, {
    fields: [wallet.userprofilerelatedwallet],
    references: [User.uid],
  }),
}));

export const AddhubRelations = relations(Addhub, ({ one }) => ({
  adminuserprofile: one(User, {
    fields: [Addhub.adminuid],
    references: [User.uid],
  }),
}));