import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useToast } from './useToast';
import {
  setSelectedImage,
  setDetectionLoading,
  setDetectionResult,
  setDetectionError,
  resetDetection,
} from 'src/store/detectionSlice';
import { analyzeImage, analyzeImageUrl } from 'src/api/detectionApi';

export const useDetection = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { selectedImage, previewUrl, result, loading, error } = useSelector(
    (state) => state.detection
  );

  const selectImage = useCallback((file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    dispatch(setSelectedImage({ file, previewUrl: preview }));
  }, [dispatch]);

  const analyze = useCallback(async () => {
    if (!selectedImage) {
      toast.error('Please select or drop an image first');
      return;
    }

    try {
      dispatch(setDetectionLoading());
      const data = await analyzeImage(selectedImage);
      dispatch(setDetectionResult(data));
      toast.success('Analysis complete!');
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'An error occurred during analysis';
      dispatch(setDetectionError(errMsg));
      toast.error(errMsg);
    }
  }, [dispatch, selectedImage, toast]);

  const analyzeUrl = useCallback(async (url) => {
    if (!url) {
      toast.error('Please enter an image URL first');
      return;
    }

    try {
      dispatch(setDetectionLoading());
      const data = await analyzeImageUrl(url);
      dispatch(setDetectionResult(data));
      toast.success('Analysis complete!');
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'An error occurred during analysis';
      dispatch(setDetectionError(errMsg));
      toast.error(errMsg);
    }
  }, [dispatch, toast]);

  const reset = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    dispatch(resetDetection());
  }, [dispatch, previewUrl]);

  return {
    selectedImage,
    previewUrl,
    result,
    loading,
    error,
    selectImage,
    analyze,
    analyzeUrl,
    reset,
  };
};

export default useDetection;
