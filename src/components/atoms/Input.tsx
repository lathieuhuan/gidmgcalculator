import { ForwardedRef, forwardRef, useState, useEffect } from "react";
import type { ChangeEventHandler, InputHTMLAttributes, KeyboardEventHandler } from "react";
import { round } from "@Src/utils";

interface InputCommonProps {
  maxDecimalDigits?: number;
  debounceTime?: number;
  noDefaultStyle?: boolean;
}

interface InputTextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange">,
    InputCommonProps {
  type?: "text";
  value?: string;
  onChange?: (value: string) => void;
}
interface InputNumberProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "type" | "value" | "max" | "min" | "onChange"
    >,
    InputCommonProps {
  type: "number";
  value?: number;
  max?: number;
  min?: number;
  onChange?: (value: number) => void;
}

export const Input = forwardRef(
  (
    {
      className,
      maxDecimalDigits = 1,
      debounceTime = 0,
      noDefaultStyle,
      ...props
    }: InputTextProps | InputNumberProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [value, setValue] = useState(props.value?.toString() || "");

    // useEffect(() => {
    //   if (debounceTime) {
    //     const handler = setTimeout(() => {
    //       if (props.type === "number") {
    //         if (value === "-") {
    //           if (props.value !== 0) {
    //             props.onChange?.(0);
    //           }
    //         } else if (+value !== props.value) {
    //           props.onChange?.(+value);
    //         }
    //       } else if (value !== props.value) {
    //         props.onChange?.(value);
    //       }
    //     }, debounceTime);

    //     return () => {
    //       clearTimeout(handler);
    //     };
    //   }
    // }, [value]);

    useEffect(() => {
      if (props.value !== +value) {
        setValue(`${props.value}`);
      }
    }, [props.value]);

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
      props.onKeyDown?.(e);

      if (props.type === "number") {
        if (
          ["ArrowRight", "ArrowLeft", "Backspace", "Delete", "Home", "End"].includes(e.key) ||
          !isNaN(+e.key) ||
          (e.key === "." && maxDecimalDigits) ||
          (e.key === "-" && props.min && props.min < 0)
        ) {
          return;
        }
        e.preventDefault();
      }
    };

    const changeNumValue = (strValue: string, numValue: number) => {
      setValue(strValue);

      if (props.type === "number") {
        if (!debounceTime && numValue !== props.value) {
          props.onChange?.(numValue);
        }
      }
    };

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const input = e.target.value;

      if (props.type === "number") {
        const { min = 0, max = 9999 } = props;
        const numInput = +input;

        if (input === "") {
          changeNumValue("0", 0);
        } else if (["0-", "-0", "-"].includes(input)) {
          changeNumValue("-", 0);
        } //
        else if (!isNaN(numInput) && numInput >= min && numInput <= max) {
          if (input.slice(-1) === ".") {
            changeNumValue(input, numInput);
          } else {
            const roundedValue = round(numInput, maxDecimalDigits);

            changeNumValue(roundedValue.toString(), roundedValue);
          }
        }
      } else {
        setValue(input);

        if (!debounceTime) {
          props.onChange?.(input);
        }
      }
    };

    return (
      <input
        ref={ref}
        {...props}
        type="text"
        className={
          (noDefaultStyle ? "" : "leading-tight text-black rounded bg-default focus:bg-blue-100 ") +
          (className || "")
        }
        value={value}
        onKeyDown={onKeyDown}
        onFocus={(e) => {
          props.onFocus?.(e);

          if (props.type === "number") {
            e.currentTarget.setSelectionRange(0, 20);
          }
        }}
        onBlur={(e) => {
          props.onBlur?.(e);

          if (value === "-") {
            setValue("0");
          }
        }}
        onChange={onChange}
      />
    );
  }
);
