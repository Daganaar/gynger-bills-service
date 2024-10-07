// Generic Bill type that allows you to parameterize the type of the date field
export interface BaseBill<T> {
    amount: number;
    vendorName: string;
    date: T;
}

// This model is used for csv incoming data
export type BillRecord = BaseBill<string>;

// This model is used for mongodb
export type Bill = BaseBill<Date> & { id: string };
