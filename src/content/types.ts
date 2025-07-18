import type { enmOrderStatus, enmOrderType, enmPaymentMethod, enmPlatform, enmRole, enmSize } from "./enums";

export type typCategory = {
    ID: number | string,
    title: string
};
export type typProduct = {
    ID: string,
    title: string,
    price: number,
    category: number,
    description: string,
    image: string[],
    rate: number
};
export type typCart = {
    Uid: string,
    productID: string,
    size: enmSize,
    count: number,
    price: number
};
export type typRange = {
    intMin: number,
    intMax: number
};
export type typLogin = {
    strEmail: string,
    strPassword: string
}
export type typSignUp = {
    strEmail: string,
    strPassword: string,
    strFirstName: string,
    strLastName: string,
    strPhoneNumber: string
}
export type typCheckout = {
    strFullName: string,
    strPhoneNumber: string
    strAddress: string,
}

export type typUser = {
    Uid: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string[]
    address?: string[],
    password: string,
    role: enmRole,
    isActive: boolean
}

export type typDeliveryInfo = {
    name: string;
    address: string;
    phone: string;
};
export type typOrderItem = {
    productID: string,
    size: enmSize,
    count: number,
    price: number
};

export type typOrder = {
    id: string,
    items: typOrderItem[],
    total: number,
    paymentMethod: enmPaymentMethod,
    orderType: enmOrderType,
    deliveryInfo: typDeliveryInfo | null,
    userId: string,
    date: string,
    platform: enmPlatform
}

export type typDateRange = { start: string; end: string };

export type typFilters = {
    dateRange: typDateRange;
    status: enmOrderStatus,
    platform: enmPlatform;
    orderType: enmOrderType;
    category: typCategory | string;
    product: typProduct | string;
    paymentMethod: enmPaymentMethod;
};
