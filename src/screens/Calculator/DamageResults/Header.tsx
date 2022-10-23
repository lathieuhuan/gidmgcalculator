import cn from "classnames";
import { useState } from "react";
import { FaExpandArrowsAlt, FaSearch } from "react-icons/fa";

import { IconButton } from "@Src/styled-components";

export function Header() {
  const [enlargedOn, setEnlargedOn] = useState(false);
  const [trackerState, setTrackerState] = useState(0);

  return (
    <div>
      <IconButton
        className={cn(
          "w-7 h-7 absolute top-3 left-3",
          trackerState ? "bg-green" : "bg-default hover:bg-lightgold"
        )}
        onClick={() => setTrackerState([0, 2].includes(trackerState) ? 1 : 0)}
      >
        <FaSearch />
      </IconButton>

      <div className="absolute top-3 right-3 hidden md1:flex">
        <IconButton className="ml-3 w-7 h-7" variant="positive" onClick={() => setEnlargedOn(true)}>
          <FaExpandArrowsAlt />
        </IconButton>
      </div>
    </div>
  );
}
