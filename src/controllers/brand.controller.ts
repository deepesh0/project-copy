import { asyncHandler } from "../utils/asynchandler.utils";
import Brand from '../models/brand.model';
import CustomError from "../middlewares/error_handler.middleware";
import { deletefile, upload } from "../utils/cloudinary.utils";


import { Request } from 'express';
import { Response } from 'express';
const dir = "/brands";
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Brand.find({});

  res.status(200).json({
    message: "Brand fetched",
    status: "success",
    data: categories,
  });
});

// get by id

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const brand = await Brand.findOne({ _id: id });

  if (!brand) {
    throw new CustomError("Brand not found", 404);
  }

  res
    .status(200)
    .json({ message: "Brand fetched", status: "success", data:brand });
});

// create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const file = req.file;
  if (!file) {
    throw new CustomError("Image is required", 400);
  }
  const brand = new Brand({ name, description });
  const { path, public_id } = await upload(file.path, dir);

  brand.image = {
    path,
    public_id,
  };
 brand.save();

  res.status(201).json({
    message: "Brand created",
    data: brand,
    status: "success",
  });
});

// update
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file;

  const brand = await Brand.findOne({ _id: id });
  if (!brand) {
    throw new CustomError("Category not found", 404);
  }

  if (name) {
    brand.name = name;
  }
  if (description) {
    brand.description = description;
  }

  if (file) {
    if (brand.image) {
      await deletefile(brand.image.public_id as string);
    }

    const {path, public_id} = await upload(file.path, dir);

  brand.image = {
    path,
    public_id,
  }
};
  brand.save();

  res.status(201).json({
    message: "brand created",
    data: brand,
    status: "success",
  });
});

// delete
export const delete_brand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
    const brand = await Brand.findOne({ _id: id });
  if (!brand) {
    throw new CustomError("Category not found", 404);
  }
    if (brand.image) {
      await deletefile(brand.image.public_id as string);
    }
    await brand.deleteOne()
      res.status(201).json({
    message: "brand deleted",
    data: brand,
    status: "success",
});
});