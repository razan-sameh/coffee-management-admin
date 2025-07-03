// ConfirmDialogContext.tsx
import { createContext, useContext, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

type ConfirmOptions = {
    title?: string;
    content: string;
};

type ConfirmDialogContextType = {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

export const useConfirmDialog = () => {
    const ctx = useContext(ConfirmDialogContext);
    if (!ctx) throw new Error("useConfirmDialog must be used within ConfirmDialogProvider");
    return ctx;
};

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({ content: "" });
    const [resolver, setResolver] = useState<(value: boolean) => void>();

    const confirm = (opts: ConfirmOptions) => {
        setOptions(opts);
        setOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolver(() => resolve);
        });
    };

    const handleClose = () => {
        setOpen(false);
        resolver?.(false);
    };

    const handleConfirm = () => {
        setOpen(false);
        resolver?.(true);
    };

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}
            <ConfirmDialog
                open={open}
                title={options.title}
                content={options.content}
                onClose={handleClose}
                onConfirm={handleConfirm}
            />
        </ConfirmDialogContext.Provider>
    );
}
