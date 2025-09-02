/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    Divider,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFilter } from '../../provider/FilterProvider';
import type { typCategory, typDateRange, typFilters, typProduct } from '../../content/types';
import {
  enmDateRangeFilter,
  enmOrderType,
  enmPaymentMethod,
  enmPlatform,
} from "../../content/enums";
import { getAllCategories, getAllProducts } from "../../database/select";
import { FilterModalActions } from "./component/FilterModalActions";
import { FilterModalHeader } from "./component/FilterModalHeader";
import { ProductFilterSection } from "./component/ProductFilterSection";
import { TransactionPeriodSection } from "./component/TransactionPeriodSection";
import { TransactionStatusSection } from "./component/TransactionStatusSection";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
  currentTab: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onReset,
}) => {
  const { filters, dispatch } = useFilter();

  const [tempFilters, setTempFilters] = useState<typFilters>(filters);
  const [categories, setCategories] = useState<Record<string, typCategory>>({});
  const [products, setProducts] = useState<Record<string, typProduct>>({});

  useEffect(() => {
    if (open) {
      setTempFilters(filters);
    }
  }, [open, filters]);

  useEffect(() => {
    const unsubscribeCategories = getAllCategories((data) =>
      setCategories(data)
    );
    const unsubscribeProducts = getAllProducts((data) => setProducts(data));

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, []);

  const handleInputChange = (field: keyof typFilters, value: any) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateRangeChange = (field: keyof typDateRange, value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }));
  };

  const handleApplyFilters = () => {
    Object.keys(tempFilters).forEach((key) => {
      if (key === "dateRange") {
        dispatch({
          type: "SET_DATE_RANGE",
          field: "start",
          value: tempFilters.dateRange.start,
        });
        dispatch({
          type: "SET_DATE_RANGE",
          field: "end",
          value: tempFilters.dateRange.end,
        });
      } else {
        dispatch({
          type: "SET_FILTER",
          field: key as keyof typFilters,
          value: tempFilters[key as keyof typFilters],
        });
      }
    });
    onClose();
  };

  const handleReset = () => {
    onReset();
    setTempFilters({
      status: enmDateRangeFilter.all,
      paymentMethod: enmPaymentMethod.all,
      platform: enmPlatform.all,
      orderType: enmOrderType.all,
      category: "All categories",
      product: "All products",
      dateRange: { start: "", end: "" },
    });
  };

  const handleCancel = () => {
    setTempFilters(filters);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, minHeight: "70vh" } }}
    >
      <FilterModalHeader onClose={handleCancel} />
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DialogContent>
          <TransactionPeriodSection
            dateRange={tempFilters.dateRange}
            onChange={handleDateRangeChange}
          />
          <TransactionStatusSection
            tempFilters={tempFilters}
            onChange={handleInputChange}
          />
          <ProductFilterSection
            tempFilters={tempFilters}
            categories={categories}
            products={products}
            onChange={handleInputChange}
          />
        </DialogContent>
      </LocalizationProvider>
      <Divider />
      <FilterModalActions
        onCancel={handleCancel}
        onReset={handleReset}
        onApply={handleApplyFilters}
      />
    </Dialog>
  );
};
