import React, { useState } from 'react';

export const useTogglePasswordVisibility = (iconShow : string, iconHidden : string) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState(iconShow);
  const handlePasswordVisibility = () => {
    if (rightIcon === iconShow) {
      setRightIcon(iconHidden);
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === iconHidden) {
      setRightIcon(iconShow);
      setPasswordVisibility(!passwordVisibility);
    }
  };

  return {
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility
  };
};