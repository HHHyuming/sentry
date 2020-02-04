import React from 'react';

import {IconProps} from 'app/types/iconProps';
import theme from 'app/utils/theme';

export const IconSiren: React.FC<IconProps> = ({
  color: providedColor = 'currentColor',
  size: providedSize = 'sm',
  ...props
}: IconProps) => {
  const color = providedColor;
  const size = theme.iconSizes[providedSize] ?? providedSize;

  return (
    <svg viewBox="0 0 16 16" fill={color} height={size} width={size} {...props}>
      <path d="M14.74,16H1.26a.75.75,0,0,1-.75-.75V13.08a1.75,1.75,0,0,1,1.75-1.75H13.74a1.75,1.75,0,0,1,1.75,1.75v2.17A.75.75,0,0,1,14.74,16ZM2,14.5H14V13.08a.25.25,0,0,0-.25-.25H2.26a.25.25,0,0,0-.25.25Z" />
      <path d="M12.48,12.24,11.21,6.08a1.2,1.2,0,0,0-1.18-1H6a1.2,1.2,0,0,0-1.18,1L3.52,12.24l-1.46-.31L3.32,5.78A2.71,2.71,0,0,1,6,3.61H10a2.71,2.71,0,0,1,2.65,2.17l1.26,6.15Z" />
      <path d="M4,3.45a.75.75,0,0,1-.64-.36L2.56,1.77a.75.75,0,0,1,.24-1,.76.76,0,0,1,1,.24L4.65,2.3a.76.76,0,0,1-.24,1A.79.79,0,0,1,4,3.45Z" />
      <path d="M2.15,5.94H.77a.75.75,0,0,1,0-1.5H2.15a.75.75,0,0,1,0,1.5Z" />
      <path d="M8,2.92a.76.76,0,0,1-.75-.75V.77a.75.75,0,1,1,1.5,0v1.4A.76.76,0,0,1,8,2.92Z" />
      <path d="M12,3.45a.79.79,0,0,1-.39-.11.76.76,0,0,1-.24-1L12.16,1a.76.76,0,0,1,1-.24.75.75,0,0,1,.24,1l-.82,1.32A.75.75,0,0,1,12,3.45Z" />
      <path d="M15.23,5.94H13.85a.75.75,0,0,1,0-1.5h1.38a.75.75,0,0,1,0,1.5Z" />
      <path d="M8,10.63a2,2,0,1,1,2-2A2,2,0,0,1,8,10.63ZM8,8.09a.52.52,0,1,0,.52.52A.52.52,0,0,0,8,8.09Z" />
      <rect x="7.25" y="9.88" width="1.5" height="2.21" />
    </svg>
  );
};