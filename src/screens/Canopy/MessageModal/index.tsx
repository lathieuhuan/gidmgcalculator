import { ConfirmModal } from "@Components/organisms";
import { updateCalculator } from "@Store/calculatorSlice";
import { useDispatch, useSelector } from "@Store/hooks";

export const MessageModal = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.calculator.message);

  const onClose = () => {
    dispatch(
      updateCalculator({
        message: {
          ...message,
          type: "",
        },
      })
    );
  };

  return (
    <ConfirmModal
      active={message.type !== ""}
      message={<span className="text-lightred text-xl">{message.content}</span>}
      bgColor="bg-darkblue-2"
      buttons={[undefined]}
      onClose={onClose}
    />
  );
};
