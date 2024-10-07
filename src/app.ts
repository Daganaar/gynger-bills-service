import express, { Request, Response, NextFunction } from "express";
import { RegisterRoutes } from "./routes";
import { PrismaClient } from "@prisma/client";
import { ValidateError } from "tsoa";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use((req, res, next) => {
    const { method, url } = req;
    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
    next();
});

app.use(cors());

// @ts-ignore
app.use("/docs", swaggerUi.serve, async (_, res: Response) => {
    return res.send(
        // @ts-ignore
        swaggerUi.generateHTML(await import("../dist/swagger.json"))
    );
});

// Register TSOA routes
RegisterRoutes(app);

// Combined error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    if (err instanceof Error) {
        if (err instanceof ValidateError) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(500).send({ message: "Internal Server Error" });
        }
    } else {
        next(err); // Pass to next middleware if not an error
    }
});

app.use((req: Request, res: Response) => {
    res.status(404).send({
        message: "Not Found",
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await prisma.$disconnect();
    process.exit(0);
});
