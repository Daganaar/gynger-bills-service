import { Bill, BillRecord } from "../models/bills";
import { PrismaClient } from "@prisma/client";
import {
    parseCsvToBillObjects,
    areVendorNamesSimilar,
    removeCsvDuplicates,
    simplifyBillsDate,
} from "../utils/csv.util";

const prisma = new PrismaClient();

export class BillsService {
    // Get all bills
    public async getAllBills() {
        const bills: Bill[] = await prisma.bill.findMany();
        return simplifyBillsDate(bills);
    }

    // Create a new bill
    public async createBillsFromCsv(
        csvFileBuffer: Buffer
    ): Promise<BillRecord[]> {
        try {
            // Parse the CSV using the utility function
            const parsedBills: BillRecord[] = await parseCsvToBillObjects(
                csvFileBuffer
            );

            // Deduplicate bills
            const deduplicatedBills = removeCsvDuplicates(parsedBills);

            const relevantBills: Bill[] = [];

            for (const billRecord of deduplicatedBills) {
                // Check if the bill already exists in the database (all fields except id must match)
                const existingBill = await this.findMatchingBill(billRecord);

                if (existingBill) {
                    // If a duplicate exists in the DB, return the original bill with its ID
                    relevantBills.push(existingBill);
                } else {
                    // Otherwise, insert the new bill into the database and return it
                    const newBill = await this.addBillToDb(billRecord);
                    relevantBills.push(newBill);
                }
            }

            return simplifyBillsDate(relevantBills);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // Check if a bill already exists in the database using Prisma
    // Vendor name matching allows for some flexibility (Levenshtein distance <= 1)
    private async findMatchingBill(
        billRecord: BillRecord
    ): Promise<Bill | null> {
        const existingBills = await prisma.bill.findMany({
            where: {
                amount: billRecord.amount,
                date: new Date(billRecord.date),
            },
        });

        // Now we need to match by vendor name using case-insensitive comparison and Levenshtein distance
        for (const existingBill of existingBills) {
            if (
                areVendorNamesSimilar(
                    billRecord.vendorName,
                    existingBill.vendorName
                )
            ) {
                return existingBill; // Return the first matching bill
            }
        }

        return null;
    }

    // Add a new bill to the database and return it
    private async addBillToDb(billRecord: BillRecord): Promise<Bill> {
        const newBill = await prisma.bill.create({
            data: {
                amount: billRecord.amount,
                vendorName: billRecord.vendorName,
                date: new Date(billRecord.date),
            },
        });
        return newBill;
    }
}
