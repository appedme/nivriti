import { useCallback, useState } from 'react';

const useToast = () => {
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'info',
    });

    const showToast = useCallback((message, type = 'info') => {
        setToast({
            visible: true,
            message,
            type,
        });

        setTimeout(() => {
            setToast((prev) => ({
                ...prev,
                visible: false,
            }));
        }, 3000);
    }, []);

    const hideToast = useCallback(() => {
        setToast((prev) => ({
            ...prev,
            visible: false,
        }));
    }, []);

    return {
        toast,
        showToast,
        hideToast,
    };
};

export  {useToast};