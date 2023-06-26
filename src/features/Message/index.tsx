import { ConfirmModal } from "@Src/components";
import { updateMessage } from "@Store/calculatorSlice";
import { useDispatch, useSelector } from "@Store/hooks";

export const Message = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.calculator.message);

  const onClose = () => {
    dispatch(updateMessage(null));
  };

  const COLOR_BY_TYPE = {
    info: "text-default",
    success: "text-green",
    error: "text-lightred",
  };

  return (
    <ConfirmModal
      active={message.active}
      message={
        <span className={"text-xl " + (message.type ? COLOR_BY_TYPE[message.type] : "")}>{message.content}</span>
      }
      bgColor="bg-darkblue-2"
      buttons={[undefined]}
      onClose={onClose}
    />
  );
};
