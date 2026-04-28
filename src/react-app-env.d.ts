/// <reference types="react-scripts" />

declare module '*.css';

// dla quick refresh na devie - dajemy module.hot jako zależność w useEffect
interface NodeModule {
    hot: any;
}