import { Button, Input, withModal } from "@Src/pure-components";
import { useState } from "react";
import { FaCoffee, FaPaypal } from "react-icons/fa";

export const DonateCore = () => {
  const [usd, setUsd] = useState(1);
  return (
    <div className="py-4">
      <h3 className="text-2xl font-bold text-center">DONATE</h3>

      <div className="mt-6 flex flex-col items-center">
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

        <div className="mt-6 w-1/2 h-0.5 bg-darkblue-3 relative">
          <span className="px-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-darkblue-2">Or</span>
        </div>

        <a className="mt-6" href="https://www.buymeacoffee.com/ronqueroc" target="_blank">
          <Button icon={<FaCoffee />}>Buy me a coffee</Button>
        </a>
      </div>
    </div>
  );
};

export const Donate = withModal(
  DonateCore,
  {
    className: "p-4 rounded-lg bg-darkblue-2 shadow-white-glow",
    style: {
      width: "20rem",
    },
  },
  {
    className: "absolute top-1 right-1",
    boneOnly: true,
  }
);
