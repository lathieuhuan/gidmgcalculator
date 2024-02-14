import { Button, Input, Modal } from "@Src/pure-components";
import { useState } from "react";
import { FaCoffee, FaPaypal } from "react-icons/fa";

export const DonateCore = () => {
  const [usd, setUsd] = useState(1);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center space-x-2">
        <a href={`https://www.paypal.com/paypalme/lathieuhuan/${usd}usd`} target="_blank">
          <Button variant="positive" shape="square" icon={<FaPaypal />} disabled={!usd}>
            Paypal
          </Button>
        </a>
        <Input
          className="w-12 px-2 py-1.5 font-semibold"
          type="number"
          value={usd}
          min={1}
          max={999}
          onChange={setUsd}
        />
        <span>$</span>
      </div>

      <div className="w-1/2 h-0.5 bg-dark-500 relative">
        <span className="px-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-700">or</span>
      </div>

      <div className="pb-2">
        <a href="https://www.buymeacoffee.com/ronqueroc" target="_blank">
          <Button icon={<FaCoffee />}>Buy me a coffee</Button>
        </a>
      </div>
    </div>
  );
};

export const Donate = Modal.wrap(DonateCore, {
  preset: "small",
  title: <p className="text-center">Donate</p>,
  withHeaderDivider: false,
  className: "bg-dark-700",
});
