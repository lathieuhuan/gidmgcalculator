import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@Src/store';
import {EScanBarcodeTarget} from '@Src/constant';
import {updateScanBarcode} from '@Src/reducers/sale';
import useScanBarcode from '@Modules/sale/hooks/useScanBarcode';

interface IUseScanBarcodeManagerArgs {
  inputElement: HTMLInputElement | null | undefined
  scanTarget: EScanBarcodeTarget
  onType?: (value: string) => void
  onScan?: (args: {
    barcode: string
    barcodeFlag: string
    scanCode: string
  }) => void
}

export function useScanBarcodeManager({inputElement, scanTarget, onType, onScan}: IUseScanBarcodeManagerArgs) {
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        type: 'SEARCH',
        value: ''
    });

    const scanBarcodeTarget = useSelector((state: RootState) => state.sale.scanBarcodeTarget);

    const {status: isScanBarcode, flag: barcodeFlag, barcode, scanCode} = useScanBarcode();

    useEffect(() => {
        if (input.value && input.type === 'SEARCH' && onType) {
            onType(input.value);
        }
    }, [input]);

    useEffect(() => {
        if (scanCode && document.activeElement === inputElement) {
            setInput({
                type: 'SEARCH',
                value: scanCode
            });
        }

        if (scanBarcodeTarget === scanTarget && isScanBarcode && barcode && document.activeElement !== inputElement) {
            // When scan barcode then clear search value and then set input value with barcode scanned
            setInput({
                type: 'BARCODE',
                value: `${barcodeFlag}${barcode}`
            });

            onScan && onScan({barcode, barcodeFlag, scanCode});
        }
    }, [scanBarcodeTarget, isScanBarcode, barcode, scanCode]);

    return {
        inputProps: {
            value: input.value,
            onChange: (e) => {
                if (!isScanBarcode) {
                    setInput({
                        type: 'SEARCH',
                        value: e.target.value
                    });
                }
            },
            onFocus: () => {
                dispatch(updateScanBarcode({
                    target: scanTarget
                }));
            },
            onBlur: () => {
                dispatch(updateScanBarcode({
                    target: EScanBarcodeTarget.PRODUCT_SEARCH
                }));
            }
        }
    };
}