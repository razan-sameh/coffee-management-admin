// productFormReducer.ts

import type { typCategory } from "../content/types";

export type FormState = {
    title: string;
    price: number;
    description: string;
    images: string[];
    selectedCategory: typCategory | null;
};

export type FormAction =
    | { type: 'SET_TITLE'; payload: string }
    | { type: 'SET_PRICE'; payload: number }
    | { type: 'SET_DESCRIPTION'; payload: string }
    | { type: 'SET_IMAGES'; payload: string[] }
    | { type: 'SET_CATEGORY'; payload: typCategory | null };

export const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'SET_TITLE': return { ...state, title: action.payload };
        case 'SET_PRICE': return { ...state, price: action.payload };
        case 'SET_DESCRIPTION': return { ...state, description: action.payload };
        case 'SET_IMAGES': return { ...state, images: action.payload };
        case 'SET_CATEGORY': return { ...state, selectedCategory: action.payload };
        default: return state;
    }
};

export const initialFormState: FormState = {
    title: '',
    price: 0,
    description: '',
    images: [],
    selectedCategory: null,
};
