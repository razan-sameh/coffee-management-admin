import type {
  enmDateRangeFilter,
  enmOrderStatus,
  enmOrderType,
  enmPaymentMethod,
  enmPlatform,
  enmRole,
  enmSize,
} from "./enums";

export type typCategory = {
  ID: number | string;
  title: string;
};
export type typProduct = {
  ID: string;
  title: string;
  price: number;
  category: number;
  description: string;
  image: string[];
  rate: number;
  rateCount: number;
  rateSum: number;
};
export type typCart = {
  Uid: string;
  productID: string;
  size: enmSize;
  count: number;
  price: number;
};
export type typRange = {
  intMin: number;
  intMax: number;
};
export type typLogin = {
  strEmail: string;
  strPassword: string;
};
export type typSignUp = {
  strEmail: string;
  strPassword: string;
  strFirstName: string;
  strLastName: string;
  strPhoneNumber: string;
};

export type typUser = {
  profilePicture?: string;
  Uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: typPhone[];
  address?: typLocation[];
  password: string;
  role: enmRole;
  isActive: boolean;
  fcmToken?: string;
};

export type typDeliveryInfo = {
  name: string;
  address: typLocation;
  phone: typPhone;
};
export type typOrderItem = {
  productID: string;
  size: enmSize;
  count: number;
  price: number;
};

export type typOrder = {
  id: string;
  items: typOrderItem[];
  total: number;
  SubTotal: number;
  delivery: number;
  paymentMethod: enmPaymentMethod;
  orderType: enmOrderType;
  deliveryInfo: typDeliveryInfo | null;
  userId: string;
  date: string;
  platform: enmPlatform;
  status: enmOrderStatus;
  estimatedTime?: string;
  driver?: string;
  driverLocation?: typLocation;
};

export type typDateRange = { start: string; end: string };

export type typFilters = {
  dateRange: typDateRange;
  status: enmDateRangeFilter;
  platform: enmPlatform;
  orderType: enmOrderType;
  category: typCategory | string;
  product: typProduct | string;
  paymentMethod: enmPaymentMethod;
};
export type typAddress = {
  house_number?: string;
  road?: string;
  city?: string;
  country?: string;
} | null;

export type typLocation = {
  latitude: number;
  longitude: number;
  address: typAddress;
} | null;

export type typPhone = {
  countryCode: string;
  countryISO: string;
  number: string;
};
