declare module 'react-simple-maps' {
  import type {CSSProperties, FC, ReactNode} from 'react';

  export type GeographyStyleState = {
    default: CSSProperties;
    hover: CSSProperties;
    pressed: CSSProperties;
  };

  export type RsmGeography = {
    rsmKey: string;
    svgPath: string;
  };

  export const ComposableMap: FC<{
    width?: number;
    height?: number;
    projection?: string;
    projectionConfig?: Record<string, unknown>;
    className?: string;
    children?: ReactNode;
  }>;

  export const Geographies: FC<{
    geography: string | object;
    children: (arg: {geographies: RsmGeography[]}) => ReactNode;
  }>;

  export const Geography: FC<{
    geography: RsmGeography;
    style?: GeographyStyleState;
    className?: string;
    tabIndex?: number;
  }>;

  export const Marker: FC<{
    coordinates: [number, number];
    children?: ReactNode;
  }>;
}
