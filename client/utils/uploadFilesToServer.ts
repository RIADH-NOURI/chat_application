import { baseUrl } from "@/hooks/useFetch";
import { Platform } from "react-native";

interface FileObject {
  uri: string;
  name: string;
  type: string;
}

type UploadImagesToServerParams = {
  messageId: string;
  files: string[];
  typeFile?: "image" | "document";
  typeApi?: "privateChat" | "room";
};

export const uploadImagesToServer = async ({
  messageId,
  files,
  typeFile = "image",
  typeApi = "privateChat",
}: UploadImagesToServerParams): Promise<string[]> => {
  const formData = new FormData();
  formData.append("_id", messageId);

  for (const uri of files) {
    const filename = uri.split("/").pop() || `file_${Date.now()}.jpg`;
    const extension = filename.split(".").pop() || "jpeg";
    const type = `${typeFile}/${extension}`;

    // Create a proper file object for React Native
    const fileObject = {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: filename,
      type,
    };

    if (typeFile === "image") {
      formData.append("images", fileObject as any);
    } else {
      formData.append("files", fileObject as any);
    }
  }

  const endpoint = `/${typeApi === "privateChat" ? "private" : "room"}/messages/${typeFile === "image" ? "images" : "files"}/${messageId}`;

  try {
    const response = await baseUrl.put(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return typeFile === "image" ? response.data.images : response.data.files;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const updateUserPicture = async (file: FileObject, userId: string): Promise<string> => {
  const formData = new FormData();

  formData.append("image", {
    uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
    name: file.name,
    type: file.type,
  } as any);

  const response = await baseUrl.put(`/update/user/picture/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.imageUrl;
};