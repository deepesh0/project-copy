import { asyncHandler } from "../utils/asynchandler.utils";
import { Request } from "express";
import { NextFunction } from "express";
import Product from "../models/product.models";
import CustomError from "../middlewares/error_handler.middleware";
import { deletefile, upload } from "../utils/cloudinary.utils";
import { Response } from "express";
import Brand from "../models/brand.model";
import Category from "../models/category.model";
import mongoose from "mongoose";

const dir = "/products";
//getall
export const getAll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.find({}).populate('category').populate('brand');

    res.status(200).json({
      message: "Products Fetched",
      data: product,
      status: "success",
    });
  }
);

//getByID

export const getByID = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findById({ _id: id }).populate('category').populate('brand');

    if (!product) {
      throw new CustomError("Product not found", 404);
    }
    res.status(200).json({
      message: "Product Fetched",
      status: "success",
      data: product,
    });
  }
);

//create

export const create = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      description,
      price,
      stock,
      category,
      brand,
      is_featured,
      new_arrival,
    } = req.body;
    const { cover_image, images } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const product = new Product({
      name,
      description,
      price,
      stock,
      is_featured,
      new_arrival,
    });
    if (cover_image) {
      const { path, public_id } = await upload(cover_image[0].path, dir);
      product.cover_image = { path, public_id };
    }

    if (images && images.length > 0) {
      const promises = images.map(
        async (image) => await upload(image.path, dir)
      );
      const product_images = await Promise.all(promises);
    }

    if (brand) {
      const product_brand = await Brand.findOne({ _id: brand });
      if (!product_brand) {
        throw new CustomError("Brand not found", 400);
      }

      product.brand = product_brand._id;
    }

    if (category) {
      const product_category = await Category.findById({ _id: category });

      if (!product_category) {
        throw new CustomError("category not found", 400);
      }
      product.category = product_category._id;
    }

    await product.validate();

    await product.save();

    res.status(200).json({
      message: "Product Added",
      status: "success",
      data: product,
    });
  }
);

//update
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    is_featured,
    new_arrival,
    category,
    brand,
    deleted_image,
  } = req.body;
  const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const product = await Product.findById({ _id: id });
  if (!product) {
    throw new CustomError("Product not found", 400);
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (is_featured) product.is_featured = is_featured;
  if (new_arrival) product.new_arrival = new_arrival;

  if (category) {
    const new_category = await Category.findById({ _id: category });
    if (!new_category) throw new CustomError("Category not found", 404);
    product.category = new_category._id;
  }
  if (brand) {
    const new_brand = await Brand.findById({ _id: brand });
    if (!new_brand) throw new CustomError("Brand not found", 404);
    product.brand = new_brand._id;
  }

  if (cover_image && cover_image.length > 0) {
    await deletefile(product.cover_image.public_id);

    const { path, public_id } = await upload(cover_image[0].path, dir);
    product.cover_image = { path, public_id };
  }

  if (
    deleted_image &&
    Array.isArray(deleted_image) &&
    deleted_image.length > 0
  ) {
    deleted_image.map(async (public_id) => await deletefile(public_id));
    product.images = product.images?.filter(
      (img) => !deleted_image.includes(img.public_id)
    ) as any;
  }
  if (images && images.length > 0) {
    // if (
    //   deleted_image &&
    //   Array.isArray(deleted_image) &&
    //   deleted_image.length > 0
    // ) {
    //   deleted_image.map(async (public_id) => await deletefile(public_id));
    // }

    const uploaded_images = await Promise.all(
      images.map(async (img) => await upload(img.path, dir))
    );
    product.images = [...uploaded_images, ...product.images] as any;
  }
  await product.save();
  res.status(200).json({
    message: "Product Updated",
    data: product,
    status: "success",
  });
});

//delete

export const delete_product = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findById({ _id: id });

    if (!product) {
      throw new CustomError("Product not found", 401);
    }
    await deletefile(product.cover_image.public_id as string);
    if (product.images && product.images.length > 0) {
      product.images.map(
        async (img) => await deletefile(img?.public_id as any)
      );
    }
    res.status(200).json({
      message: "Product removed",
      status: "success",
    });
  }
);

// get by category
export const getProductByCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category_id } = req.params;
    const products = await Product.find({ category: category_id }).populate('category').populate('brand');

    res.status(200).json({
      message: "Product Fetched",
      status: "success",
      data: products,
    });
  }
);

// get featured products

export const getProductByFeature = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.find({ is_featured: true }).populate('category').populate('brand');
    res.status(200).json({
      message: "Product Fetched",
      status: "success",
      data: product,
    });
  }
);

// get new arrival products
export const getProductByArrival = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.find({ new_arrival: true }).populate('category').populate('brand');
    res.status(200).json({
      message: "Product Fetched",
      status: "success",
      data: product,
    });
  }
);
