import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../libs/firebase";

/**
 * Tải file lên Firebase Storage và trả về URL.
 * @param file - File để tải lên.
 * @returns Promise<string> - URL public của file.
 */
export const uploadFile = async (
  file: File,
  folderName: string = "uploads"
): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Tạo một tham chiếu đến file trên storage, có thể thêm timestamp để tránh trùng lặp
  const storageRef = ref(storage, `${folderName}/${Date.now()}-${file.name}`);

  try {
    // Tải file lên
    const snapshot = await uploadBytes(storageRef, file);
    // Lấy URL để tải file về
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase:", error);
    // Ném lỗi để hàm gọi có thể xử lý
    throw new Error("Tải file lên thất bại.");
  }
};
