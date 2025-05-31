import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import {Image as CachedImage} from "react-native-expo-image-cache";


type Props = {
  images: string[];
  isLoadingPictures?: boolean;
  isCachedImage?: boolean;
};

const ImagePreview = ({ images,isLoadingPictures,isCachedImage=false }: Props) => {
  if (!images.length) return null;

  const displayImages = images.slice(0, 5);
  const remainingCount = images?.length - 5;

  return (
    <View style={[styles.imageContainer, images.length === 1 ? styles.single : styles.multiple]}>
      {displayImages.map((uri, index) => (
        <View key={index} style={styles.imageWrapper}>
          {isCachedImage && (
            <Image
              source={{ uri }}
              style={images.length === 1 ? styles.singleImage : styles.multipleImage}
            />
          )}
          <CachedImage
            key={index}
            uri={uri}
            style={images.length === 1 ? styles.singleImage : styles.multipleImage}
          />
          {index === 4 && remainingCount > 0 && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>+{remainingCount}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  single: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiple: {
    gap: 4,
  },
  imageWrapper: {
    position: 'relative',
  },
  singleImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  multipleImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  overlayText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ImagePreview;
