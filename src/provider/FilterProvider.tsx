/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
// FilterProvider.tsx
import React, { createContext, useReducer, useContext, useState } from 'react';
import { FilterModal } from '../modals/filterModal/FilterModal';
import type { typFilters, typDateRange } from '../content/types';
import { enmOrderStatus, enmOrderType, enmPaymentMethod, enmPlatform } from '../content/enums';

type Action =
    | { type: 'SET_FILTER'; field: keyof typFilters; value: any }
    | { type: 'SET_DATE_RANGE'; field: keyof typDateRange; value: string }
    | { type: 'RESET_FILTERS' }
    | { type: 'SET_ALL_FILTERS'; filters: typFilters };

const defaultFilters: typFilters = {
    dateRange: { start: '', end: '' },
    status: enmOrderStatus.all,
    platform: enmPlatform.all,
    orderType: enmOrderType.all,
    category: 'All categories',
    product: 'All products',
    paymentMethod: enmPaymentMethod.all,
};

type FilterContextType = {
    filters: typFilters;
    dispatch: React.Dispatch<Action>;
    openFilterModal: (tab?: string) => void;
    closeFilterModal: () => void;
};

const FilterContext = createContext<FilterContextType | null>(null);

const reducer = (state: typFilters, action: Action): typFilters => {
    switch (action.type) {
        case 'SET_FILTER':
            return { ...state, [action.field]: action.value };
        case 'SET_DATE_RANGE':
            return {
                ...state,
                dateRange: { ...state.dateRange, [action.field]: action.value },
            };
        case 'RESET_FILTERS':
            return defaultFilters;
        case 'SET_ALL_FILTERS':
            return action.filters;
        default:
            return state;
    }
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [filters, dispatch] = useReducer(reducer, defaultFilters);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState('Transactions');

    const openFilterModal = (tab: string = 'Transactions') => {
        setCurrentTab(tab);
        setFilterModalOpen(true);
    };

    const closeFilterModal = () => {
        setFilterModalOpen(false);
    };

    const handleFilterReset = () => {
        dispatch({ type: 'RESET_FILTERS' });
    };

    return (
        <FilterContext.Provider value={{ filters, dispatch, openFilterModal, closeFilterModal }}>
            {children}
            <FilterModal
                open={filterModalOpen}
                onClose={closeFilterModal}
                onReset={handleFilterReset}
                currentTab={currentTab}
            />
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const ctx = useContext(FilterContext);
    if (!ctx) throw new Error('useFilter must be used within FilterProvider');
    return ctx;
};
