"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCreateProductMutation } from "@/app/store/api/productsApi";

interface SizePrice {
  size: string;
  price: number;
}

interface ProductFormValues {
  name: string;
  brand: string;
  quantity: number;
  description: string;
  sizePrices: SizePrice[];
  sex: string;
  isActive: boolean;
  image?: File;
}

const schema = yup.object({
  name: yup.string().required("Product name is required"),
  brand: yup.string().required("Brand is required"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .min(0, "Quantity cannot be negative"),
  description: yup.string(),
  sizePrices: yup
    .array()
    .of(
      yup.object({
        size: yup.string().required("Size is required"),
        price: yup
          .number()
          .required("Price is required")
          .positive("Price must be positive"),
      }),
    )
    .min(1, "At least one size and price is required"),
  sex: yup.string().required("Category is required"),
  isActive: yup.boolean(),
}) as yup.ObjectSchema<ProductFormValues>;

export default function AddProductPage() {
  const router = useRouter();
  const [createProduct, { isLoading: isSubmitting }] = useCreateProductMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sizePrices, setSizePrices] = useState<SizePrice[]>([
    { size: "", price: 0 },
  ]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      brand: "",
      quantity: 0,
      description: "",
      sizePrices: [],
      sex: "",
      isActive: true,
    },
  });

  const handleSizeChange = (
    index: number,
    field: keyof SizePrice,
    value: string | number,
  ) => {
    const newSizePrices = [...sizePrices];
    newSizePrices[index] = {
      ...newSizePrices[index],
      [field]: field === "price" ? Number(value) : value,
    };
    setSizePrices(newSizePrices);
    setValue(
      "sizePrices",
      newSizePrices.filter((sp) => sp.size.trim() !== ""),
    );
  };

  const addSizeField = () => {
    setSizePrices([...sizePrices, { size: "", price: 0 }]);
  };

  const removeSizeField = (index: number) => {
    if (sizePrices.length > 1) {
      const newSizePrices = sizePrices.filter((_, i) => i !== index);
      setSizePrices(newSizePrices);
      setValue(
        "sizePrices",
        newSizePrices.filter((sp) => sp.size.trim() !== ""),
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("brand", data.brand);
      formData.append("quantity", data.quantity.toString());
      formData.append("description", data.description || "");
      formData.append("sex", data.sex);
      formData.append("isActive", data.isActive.toString());

      // Append sizePrices as JSON string
      const validSizePrices = sizePrices.filter((sp) => sp.size.trim() !== "");
      formData.append("sizePrices", JSON.stringify(validSizePrices));

      // Append image if provided
      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }

      await createProduct(formData).unwrap();
      
      toast.success("Product created successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    }
  };

  return (
    <div className="text-white space-y-8">
      <Toaster position="top-right" />

      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white mb-4 transition-all group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Inventory
      </Link>

      {/* Form */}
      <div className="bg-white/5 dark:bg-black/20 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white/10 p-8 lg:p-12">
        <div className="mb-12">
          <div className="h-14 w-14 rounded-[1.5rem] bg-[#485e38] flex items-center justify-center mb-6 shadow-xl shadow-[#485e38]/20">
            <Plus className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight ">Add New <span className="text-[#485e38]">Product</span></h1>
          <p className="text-gray-500 mt-2 font-medium">
            Launch a new item into your luxury catalog.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium  mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={`w-full px-5 py-4 bg-white/5 border rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-[#485e38]/30 focus:border-[#485e38] transition-all text-white placeholder:text-gray-600 ${
                errors.name ? "border-red-500/50 bg-red-500/5" : "border-white/10"
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Brand and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium  mb-2"
              >
                Brand *
              </label>
              <input
                type="text"
                id="brand"
                {...register("brand")}
                className={`w-full px-5 py-4 bg-white/5 border rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-[#485e38]/30 focus:border-[#485e38] transition-all text-white placeholder:text-gray-600 ${
                  errors.brand ? "border-red-500/50 bg-red-500/5" : "border-white/10"
                }`}
                placeholder="Enter brand name"
              />
              {errors.brand && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="sex" className="block text-sm font-medium  mb-2">
                Category *
              </label>
              <select
                id="sex"
                {...register("sex")}
                className={`w-full px-5 py-4 bg-white/5 border rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-[#485e38]/30 focus:border-[#485e38] transition-all text-white appearance-none cursor-pointer ${
                  errors.sex ? "border-red-500/50 bg-red-500/5" : "border-white/10"
                }`}
              >
                <option value="" className="bg-[#0f172a]">Select category</option>
                <option value="men" className="bg-[#0f172a]">Men</option>
                <option value="women" className="bg-[#0f172a]">Women</option>
                <option value="unisex" className="bg-[#0f172a]">Unisex</option>
              </select>
              {errors.sex && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.sex.message}
                </p>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium  mb-2"
            >
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              {...register("quantity", { valueAsNumber: true })}
              min="0"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition ${
                errors.quantity ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="0"
            />
            {errors.quantity && (
              <p className="text-xs text-red-500 mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Sizes and Prices */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Sizes & Prices *
            </label>
            <div className="space-y-3">
              {sizePrices.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border border-gray-100 rounded-xl "
                >
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={item.size}
                      onChange={(e) =>
                        handleSizeChange(index, "size", e.target.value)
                      }
                      className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-[#485e38]/30 focus:border-[#485e38] transition-all text-white placeholder:text-gray-600"
                      placeholder="Size (e.g., 50ml)"
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleSizeChange(index, "price", e.target.value)
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition"
                      placeholder="Price"
                    />
                  </div>
                  {sizePrices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeField(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition self-end sm:self-center"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSizeField}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
              >
                + Add Size & Price
              </button>
            </div>
            {errors.sizePrices && (
              <p className="text-xs text-red-500 mt-1">
                {errors.sizePrices.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium  mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter product description (optional)"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              Product Image
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium ">
                    Product is active
                  </span>
                </label>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#485e38] from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Add Product"
              )}
            </button>
            <Link
              href="/dashboard"
              className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300  text-sm sm:text-base font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
