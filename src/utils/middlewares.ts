import { Request, Response, NextFunction } from "express";
import { ValidateError } from "tsoa";

export const validateFileMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const files = req.files as { [fileName: string]: Express.Multer.File[] };

    if (!(files && Object.hasOwn(files, "file"))) {
        const fieldsErrors = {
            file: {
                message: "File is required",
                value: req.file,
            },
        };
        next(new ValidateError(fieldsErrors, "No file uploaded"));
        return;
    }
    next();
};
