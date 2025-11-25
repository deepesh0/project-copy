import { Request, Response } from "express";
import { asyncHandler } from "../utils/asynchandler.utils";
import Category from "../models/category.model";
import CustomError from "../middlewares/error_handler.middleware";
import { deletefile, upload } from "../utils/cloudinary.utils";

const dir = "/categories";
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find({});

  res.status(200).json({
    message: "Category fetched",
    status: "success",
    data: categories,
  });
});

// get by id

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findOne({ _id: id });

  if (!Category) {
    throw new CustomError("Category not found", 404);
  }

  res
    .status(200)
    .json({ message: "category fetched", status: "success", data: category });
});

// create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const file = req.file;
  if (!file) {
    throw new CustomError("Image is required", 400);
  }
  const category = new Category({ name, description });
  const { path, public_id } = await upload(file.path, dir);

  category.image = {
    path,
    public_id,
  };
  category.save();

  res.status(201).json({
    message: "category created",
    data: category,
    status: "success",
  });
});

// update
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file;

  const category = await Category.findById({ _id: id });
  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  if (name) {
    category.name = name;
  }
  if (description) {
    category.description = description;
  }

  if (file) {
    if (category.image) {
      await deletefile(category.image.public_id as string);
    }

    const {path, public_id} = await upload(file.path, dir);

  category.image = {
    path,
    public_id,
  }
};
  category.save();

  res.status(201).json({
    message: "category created",
    data: category,
    status: "success",
  });
});

// delete
export const delete_category = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
    const category = await Category.findById({ _id: id });
  if (!category) {
    throw new CustomError("Category not found", 404);
  }
    if (category.image) {
      await deletefile(category.image.public_id as string);
    }
    await category.deleteOne()
      res.status(201).json({
    message: "category deleted",
    data: category,
    status: "success",
});
});