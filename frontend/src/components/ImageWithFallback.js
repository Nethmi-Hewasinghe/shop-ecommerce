import React from 'react';
import { Image } from 'react-bootstrap';

const getFallbackSvg = (text = 'No Image') => {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="10" text-anchor="middle" dy=".3em" fill="#666">${text}</text>
    </svg>
  `)}`;
};

const ImageWithFallback = ({ 
  src, 
  fallbackText = 'No Image',
  alt = 'Image not available',
  className = '',
  ...props 
}) => {
  const fallbackSvg = getFallbackSvg(fallbackText);

  const handleError = (e) => {
    if (e.target.src !== fallbackSvg) {
      e.target.src = fallbackSvg;
    }
  };

  // Filter out the fallbackText prop before spreading to avoid React warnings
  const { fallbackText: _, ...restProps } = props;

  return (
    <Image 
      src={src || fallbackSvg} 
      alt={alt} 
      onError={handleError}
      className={className}
      {...restProps}
    />
  );
};

export default ImageWithFallback;
