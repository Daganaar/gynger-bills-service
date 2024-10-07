import {
    Controller,
    Get,
    Post,
    Route,
    UploadedFile,
    SuccessResponse,
    ValidateError,
    Middlewares,
} from "tsoa";
import { BillsService } from "../services/bills";
import { CsvValidationError } from "../utils/errors";
import { validateFileMiddleware } from "../utils/middlewares";

@Route("bills")
export class BillsController extends Controller {
    private billsService: BillsService;

    constructor() {
        super();
        this.billsService = new BillsService();
    }

    @Get()
    public async getBills() {
        return this.billsService.getAllBills();
    }

    @Post()
    @SuccessResponse("201", "Created")
    @Middlewares(validateFileMiddleware)
    public async uploadCsv(@UploadedFile() file: Express.Multer.File) {
        try {
            // Process the uploaded CSV file using the service
            const bills = await this.billsService.createBillsFromCsv(
                file.buffer
            );

            // Send the parsed bills as a JSON response
            return bills;
        } catch (error) {
            if (error instanceof CsvValidationError) {
                throw new ValidateError(
                    {
                        file: {
                            message:
                                "File is not properly formatted or processable",
                        },
                    },
                    "File is not properly formatted or processable"
                );
            }

            throw error;
        }
    }
}
