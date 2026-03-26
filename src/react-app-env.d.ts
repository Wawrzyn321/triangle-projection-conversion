/// <reference types="react-scripts" />

// dla quick refresh na devie - dajemy module.hot jako zależność w useEffect
interface NodeModule {
    hot: any;
}