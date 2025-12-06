import type React from "react";
import { message } from "antd";
import { uploadFile } from "../../services/upload.service";

/**
 * Convert file to base64 string
 * @param file - File object to convert
 * @returns Promise<string> - Base64 string
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns boolean - true if valid
 */
export const validateImageFile = (file: File, maxSizeMB = 10): boolean => {
  // Check file type
  console.log("Validating file: ", file); // Log tệp đang kiểm tra
  console.log("File type: ", file.type); // Log loại tệp
  if (!file.type.startsWith("image/")) {
    throw new Error("Chỉ được upload file ảnh!");
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`Kích thước ảnh không được vượt quá ${maxSizeMB}MB!`);
  }

  return true;
};

/**
 * Handle image upload and get public URL from Firebase
 * @param file - File to upload
 * @param maxSizeMB - Maximum file size in MB
 * @returns Promise<string> - Public URL string or throws error
 */
export const handleImageUpload = async (
  file: File,
  maxSizeMB = 10
): Promise<string> => {
  // Validate file
  console.log("File received: ", file);
  validateImageFile(file, maxSizeMB);

  try {
    // Upload to Firebase and get URL
    const imageUrl = await uploadFile(file, "productsImages");
    return imageUrl;
  } catch (error) {
    console.error("Image upload error:", error);
    message.error("Tải ảnh lên thất bại!");
    throw error;
  }
};

/**
 * Create image upload handler for TipTap editor
 * @param editor - TipTap editor instance
 * @param maxSizeMB - Maximum file size in MB
 * @returns Function to handle file input change
 */
import type { Editor } from "@tiptap/core";

export const createImageUploadHandler = (editor: Editor, maxSizeMB = 10) => {
  return async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file, maxSizeMB);

      // Insert image into editor at current cursor position
      if (imageUrl) {
        editor
          .chain()
          .focus()
          .setImage({
            src: imageUrl,
            alt: file.name,
            title: file.name,
          })
          .run();

        message.success("Thêm ảnh thành công!");
      }
    } catch (error) {
      // Error already handled in handleImageUpload
      console.error("Failed to upload image:", error);
    }

    // Reset input value to allow uploading the same file again
    event.target.value = "";
  };
};
