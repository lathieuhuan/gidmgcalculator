import {useEffect, useState} from 'react';

interface IUseScanBarcodeArgs {
  disabled?: boolean;
  splitFormat?: number[];
  keepPreviousResult?: boolean;
  onScanSuccess?: (barcode: string[]) => void;
}

export function useScanBarcode(args?: IUseScanBarcodeArgs) {
    const {
        disabled,
        splitFormat = [2, 5, 5, 1],
        keepPreviousResult,
        onScanSuccess
    } =  args || {};

    const [barcode, setBarcode] = useState<string[]>([]);

    useEffect(() => {
        let concatedKey = '';
        let previousKeydownTime = Date.now();

        const onKeydown = (e: KeyboardEvent) => {
            if (disabled) {
                return;
            }

            const currentKeydownTime = Date.now();
            const timeDifference =  currentKeydownTime - previousKeydownTime;

            if (!concatedKey || timeDifference < 100) {
                if (e.key !== 'Enter') {
                    concatedKey += e.key;
                } else {
                    const requiredLength = splitFormat.reduce((accumulator, numOfDigits) => accumulator + (numOfDigits ?? 0), 0);

                    if (concatedKey.length === requiredLength) {
                        const newBarcode: string[] = [];
                        let startIndex = 0;

                        for (let i = 0; i < splitFormat.length; i++) {
                            const numOfDigits = splitFormat[i];

                            if (typeof numOfDigits === 'number') {
                                newBarcode.push(concatedKey.slice(startIndex, startIndex + numOfDigits));
                                startIndex += numOfDigits;
                            }
                        }

                        onScanSuccess && onScanSuccess(newBarcode);

                        setBarcode(newBarcode);
                    }
                    concatedKey = '';
                }
            }

            previousKeydownTime = currentKeydownTime;
        };

        window.addEventListener('keydown', onKeydown);

        return () => window.removeEventListener('keydown', onKeydown);
    }, [disabled, onScanSuccess]);

    useEffect(() => {
        if (!keepPreviousResult && barcode.length) {
            setBarcode([]);
        }
    }, [barcode.length]);

    return {
        barcode
    };
}