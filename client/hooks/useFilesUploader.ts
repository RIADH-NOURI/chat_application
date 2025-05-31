import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { chatUiStore } from "@/stores/chatUiStaore";

export const useFilesUploader = () => {
  const { addFiles, setFiles } = chatUiStore();

  // Pick multiple images from gallery
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newImages = result.assets.map((asset) => asset.uri);
      addFiles(newImages);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      addFiles([result.assets[0].uri]);
    }
  };

  // Pick documents (PDF, Word, etc.)
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // or use specific mime type like "application/pdf"
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const documentUris = result.assets.map((asset) => asset.uri);
        addFiles(documentUris); // FIXED: don't override setFiles; use addFiles
      }
    } catch (error) {
      console.error("Error picking document", error);
    }
  };

  return {
    pickImages,
    takePhoto,
    pickDocument,
    setFiles,
  };
};
