export class CsvValidationError extends Error {
    constructor(message: string, cause?: Error) {
        super(message, { cause });
        this.name = "CsvValidationError";
    }
}
