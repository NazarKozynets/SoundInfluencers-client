import React, { useState } from "react";

const ImageWithFallback = ({
  src,
  fallbackSrc,
  alt,
  className = "",
  style = {},
}) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  return (
    <img
      className={className}
      src={src ? src : fallbackSrc}
      onError={handleError}
      alt={alt}
      style={style}
    />
  );
};

export default ImageWithFallback;
