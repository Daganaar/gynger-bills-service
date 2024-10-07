import { Readable } from "stream";
import csvParser from "csv-parser";
import { BillRecord } from "../models/bills";
import Levenshtein from "fast-levenshtein";
import { CsvValidationError } from "./errors";
import { Bill } from "../models/bills";

const REQUIRED_COLUMNS = ["Amount", "Vendor Name", "Date"];

export const parseCsvToBillObjects = async (
    buffer: Buffer
): Promise<BillRecord[]> => {
    const bills: Array<BillRecord> = [];

    // Create a readable stream from the buffer and pipe it to csvParser
    const stream = Readable.from(buffer).pipe(csvParser());

    return new Promise((resolve, reject) => {
        stream.on("headers", (headers: string[]) => {
            // Validate that required columns are present
            const normalizedHeaders = headers.map((header) =>
                header.trim().toLowerCase()
            );
            const requiredColumnsPresent = REQUIRED_COLUMNS.every((column) =>
                normalizedHeaders.includes(column.toLowerCase())
            );

            if (!requiredColumnsPresent) {
                // Stop further processing if the headers are invalid
                stream.destroy();
                reject(
                    new CsvValidationError(
                        `CSV file is missing required columns. Expected columns: ${REQUIRED_COLUMNS.join(
                            ", "
                        )}`
                    )
                );
            }
        });

        stream.on("data", (row) => {
            try {
                bills.push({
                    amount: parseFloat(row.Amount),
                    date: row.Date,
                    vendorName: row["Vendor Name"],
                });
            } catch (error) {
                stream.destroy();
                reject(
                    new CsvValidationError(
                        `Error parsing row: ${row}`,
                        error as Error
                    )
                );
            }
        });

        stream.on("end", () => {
            resolve(bills);
        });

        stream.on("error", (error) => {
            reject(error);
        });
    });
};

// Remove duplicates within the uploaded CSV (keep the first occurrence)
export const removeCsvDuplicates = (bills: BillRecord[]): BillRecord[] => {
    const uniqueBills: BillRecord[] = [];

    for (const bill of bills) {
        const isDuplicate = uniqueBills.some((uniqueBill) => {
            return (
                bill.amount === uniqueBill.amount &&
                bill.date === uniqueBill.date &&
                areVendorNamesSimilar(bill.vendorName, uniqueBill.vendorName)
            );
        });

        if (!isDuplicate) {
            uniqueBills.push(bill); // Only add the first occurrence
        }
    }

    return uniqueBills;
};

// Check if two vendor names are similar based on Levenshtein distance
export const areVendorNamesSimilar = (
    vendorName1: string,
    vendorName2: string
): boolean => {
    const distance = Levenshtein.get(
        vendorName1.toLowerCase(),
        vendorName2.toLowerCase()
    );
    return distance <= 1; // Allow one edit distance for matching
};

// Covert date from default date and time to YYY-MM-DD
export const simplifyBillsDate = (bills: Bill[]) =>
    bills.map((bill) => ({
        id: bill.id,
        amount: bill.amount,
        date: bill.date.toLocaleDateString("en-CA"),
        vendorName: bill.vendorName,
    }));
