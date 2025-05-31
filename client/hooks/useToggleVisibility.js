import { chatUiStore } from '@/stores/chatUiStaore';
import { useRef } from 'react';
import { Animated } from 'react-native';

const useToggleVisibility = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { showUploadForm, setShowUploadForm } = chatUiStore();

  const toggleVisibility = () => {
    if (showUploadForm) {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowUploadForm(false));
    } else {
      setShowUploadForm(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return { scaleAnim, toggleVisibility };
};

export default useToggleVisibility;