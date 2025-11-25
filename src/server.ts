import "dotenv/config";
import express, {  NextFunction, Request, Response } from "express";
import { connect_DB } from "./config/db.config";
import CustomError, { errorHandler } from './middlewares/error_handler.middleware'
import cookieParser  from 'cookie-parser'

//? importing routes
import authRoutes from './routes/auth.routes'
import categoryRoutes from './routes/category.routes'
import brandRoutes from "./routes/brand.routes";
import productRoutes from "./routes/product.routes";
import wishlist from "./routes/wishlist.routes";

const PORT = process.env.PORT || 5000;

// express app instance
const app = express();

//* connect database
connect_DB();




//* using miidleware
app.use(cookieParser())
app.use(express.json({limit:'5mb'}))
app.use('/api/uploads',express.static('uploads/'))

//* ping route
app.get("/", (req:Request, res:Response) => {
  res.status(200).json({
    message: "Server is up & running",
    status: "success",
    success: true,
  });
});


//* using routes
app.use('/api/auth',authRoutes)
app.use('/api/categories',categoryRoutes)
app.use('/api/brands',brandRoutes)
app.use('/api/products',productRoutes)
app.use('/api/wishlist',wishlist)


//! handling path not found error
app.use((req: Request, res: Response, next: NextFunction) => {
  
  const message = `Can not ${req.method} on ${req.originalUrl}`
  // const error:any = new CustomError(message,400)
  // const error:any = new Error(message)
  // error.status = 'fail'
  // error.statusCode = 400
  // console.log(error)
  next(new CustomError(message,400))
})



app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});

app.use(errorHandler)
