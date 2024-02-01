import { ConfirmModal } from "@Src/pure-components";
import { updateMessage } from "@Store/calculatorSlice";
import { useDispatch, useSelector } from "@Store/hooks";

export const Message = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.calculator.message);

  const onClose = () => {
    dispatch(updateMessage(null));
  };

  const COLOR_BY_TYPE = {
    info: "text-light-400",
    success: "text-green-300",
    error: "text-red-100",
  };

  return (
    <ConfirmModal
      active={message.active}
      message={
        <span className={"text-xl " + (message.type ? COLOR_BY_TYPE[message.type] : "")}>{message.content}</span>
      }
      bgColorCls="bg-dark-700"
      // buttons={message.closable ? undefined : []}
      // closeOnMaskClick={message.closable}
      onClose={onClose}
    />
  );
};
