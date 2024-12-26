import express, { Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cors from "cors";
import { validateAndSanitizeQueryParams, validateReview } from "./middlewares";


const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type"], // Specify allowed headers
  })
);

// Create a new review
app.post("/reviews", validateReview as any, async (req, res) => {
  try {
    const { title, content, rating, author } = req.body;

    const review = await prisma.review.create({
      data: { title, content, rating, author },
    });

    res.status(201).json(review);
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma unique constraint violation
      res.status(400).json({ error: "Duplicate entry" });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      // Handle Prisma validation errors
      res.status(400).json({ error: "Invalid data" });
    } else {
      // Handle other errors
      console.error("Error creating review:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Get all reviews with pagination and filtering
app.get("/reviews", validateAndSanitizeQueryParams, async (req, res) => {
  try {
    const { page = 1, author, rating, sorting } = req.query;

    // Ensure page is a valid number
    const pageNumber = Math.max(Number(page), 1);
    const pageSize = 5;

    // Ensure author is a string or undefined
    const authorFilter = typeof author === "string" ? author : undefined;


    // Parse ratings to an array of numbers
    // Parse ratings to an array of numbers
    const ratingsArray =
      typeof rating === "string"
        ? JSON.parse(rating).filter((num) => !isNaN(num)) // Parse JSON string and filter valid numbers
        : Array.isArray(rating)
          ? rating.map((r) => parseInt(r, 10)).filter((num) => !isNaN(num)) // Handle case where it's an array
          : [];


    // Parse sorting (base64-decoded JSON)
    const sortingArray = sorting
      ? JSON.parse(Buffer.from(sorting as string, "base64").toString("utf-8"))
      : [];


    const reviews = await prisma.review.findMany({
      where: {
        ...(authorFilter && {
          author: {
            contains: authorFilter.toLowerCase(), // Convert author to lowercase
          },
        }),
        ...(ratingsArray.length > 0 && {
          rating: { in: ratingsArray }, // Filter by ratings
        }),
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: sortingArray.length > 0
        ? sortingArray.map(({ id, desc }) => ({ [id]: desc ? "desc" : "asc" }))
        : { createdAt: "desc" }, // Default sorting
    });

    const totalReviews = await prisma.review.count({
      where: {
        ...(authorFilter && {
          author: {
            contains: authorFilter.toLowerCase(), // Convert author to lowercase
          },
        }),
        ...(ratingsArray.length > 0 && {
          rating: { in: ratingsArray },
        }),
      },
    });

    const totalPages = Math.ceil(totalReviews / pageSize);

    res.json({
      reviews,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "An error occurred while fetching reviews." });
  }
});



// Get a single review by ID
app.get("/reviews/:id", async (req: Request, res: any) => {
  const review = await prisma.review.findUnique({ where: { id: Number(req.params.id) } });
  if (!review) return res.status(404).json({ error: "Review not found" });
  res.json(review);
});

// Update a review by ID
app.put("/reviews/:id", async (req: Request, res: any) => {
  const { title, content, rating, author } = req.body;

  if (!title || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const review = await prisma.review.update({
    where: { id: Number(req.params.id) },
    data: { title, content, rating, author },
  });
  res.json(review);
});

// Delete a review by ID
app.delete("/reviews/:id", async (req, res) => {
  await prisma.review.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

// Start server
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
