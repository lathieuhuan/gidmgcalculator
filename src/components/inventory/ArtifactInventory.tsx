import { useMemo, useRef, useState } from "react";

import type { ArtifactType, CalcArtifact, UserArtifact } from "@Src/types";
import { ARTIFACT_TYPES } from "@Src/constants";
import { selectUserArts } from "@Store/userDatabaseSlice/selectors";
import { useStoreSnapshot } from "@Src/features";
import { useElementSize } from "@Src/pure-hooks";

// Conponent
import { ButtonGroup, Modal } from "@Src/pure-components";
import { ArtifactCard } from "../ArtifactCard";
import { OwnerLabel } from "../OwnerLabel";
import { ArtifactFilter, ArtifactFilterProps, ArtifactFilterState } from "../ArtifactFilter";
import { EntitySelectTemplate, EntitySelectTemplateProps } from "../EntitySelectTemplate";
import { InventoryRack } from "./InventoryRack";

export interface ArtifactInventoryProps
  extends Pick<ArtifactFilterProps, "forcedType">,
    Pick<EntitySelectTemplateProps, "hasMultipleMode"> {
  /** Default to 'flower' */
  initialType?: ArtifactType;
  currentArtifacts: (CalcArtifact | null)[];
  owner?: string | null;
  buttonText: string;
  onClickButton: (chosen: UserArtifact) => void;
  onClose: () => void;
}
const ArtifactInventoryCore = ({
  forcedType,
  hasMultipleMode,
  initialType = "flower",
  currentArtifacts,
  owner,
  buttonText,
  onClickButton,
  onClose,
}: ArtifactInventoryProps) => {
  const [ref, { height }] = useElementSize<HTMLDivElement>();

  const [showingCurrent, setShowingCurrent] = useState(false);
  const [chosenArtifact, setChosenArtifact] = useState<UserArtifact>();
  const [filter, setFilter] = useState<ArtifactFilterState>({
    ...ArtifactFilter.DEFAULT_FILTER,
    types: [forcedType || initialType],
  });

  const artifacts = useStoreSnapshot((state) =>
    forcedType ? selectUserArts(state).filter((artifact) => artifact.type === forcedType) : selectUserArts(state)
  );

  const filteredArtifacts = useMemo(() => ArtifactFilter.filterArtifacts(artifacts, filter), [artifacts, filter]);

  const currentArtifact = currentArtifacts[ARTIFACT_TYPES.indexOf(filter.types[0])];

  return (
    <EntitySelectTemplate
      title="Artifact Inventory"
      hasFilter
      hasMultipleMode={hasMultipleMode}
      filterWrapWidth="100%"
      renderFilter={(setFilterOn) => {
        return (
          <div className="h-full p-4 bg-dark-900">
            <ArtifactFilter
              forcedType={forcedType}
              artifacts={artifacts}
              initialFilter={filter}
              onDone={setFilter}
              onClose={() => setFilterOn(false)}
            />
          </div>
        );
      }}
      onClose={onClose}
    >
      {({ isMultiSelect }) => {
        return (
          <div className="h-full flex custom-scrollbar gap-2 scroll-smooth">
            <InventoryRack
              data={filteredArtifacts}
              itemCls="max-w-1/3 basis-1/3 md:w-1/4 md:basis-1/4 lg:max-w-1/6 lg:basis-1/6"
              emptyText="No artifacts found"
              chosenID={chosenArtifact?.ID || 0}
              onClickItem={(item) => setChosenArtifact(item as UserArtifact)}
            />

            <div className="flex flex-col relative">
              <div ref={ref} className="grow rounded-lg bg-dark-900 overflow-auto">
                <div className="h-full p-4 flex flex-col hide-scrollbar">
                  <div className="w-64 grow hide-scrollbar">
                    <ArtifactCard mutable={false} artifact={chosenArtifact} />
                  </div>

                  {chosenArtifact && chosenArtifact.owner !== owner ? (
                    <ButtonGroup
                      className="mt-4"
                      buttons={[
                        {
                          text: "Compare",
                          variant: showingCurrent ? "active" : "default",
                          disabled: !currentArtifact,
                          onClick: () => setShowingCurrent(!showingCurrent),
                        },
                        {
                          text: buttonText,
                          variant: "positive",
                          onClick: () => {
                            onClickButton(chosenArtifact);
                            if (!isMultiSelect) onClose();
                          },
                        },
                      ]}
                    />
                  ) : null}
                </div>
              </div>

              {currentArtifact ? (
                <div
                  className={
                    "absolute top-0 z-10 h-full hide-scrollbar transition-size duration-200 " +
                    (showingCurrent ? "w-64" : "w-0")
                  }
                  style={{
                    height,
                    right: "calc(100% - 1rem)",
                  }}
                >
                  <div className="w-64 p-4 pr-2 pb-2 h-full flex flex-col bg-dark-900 rounded-l-lg">
                    <ArtifactCard mutable={false} artifact={currentArtifact} />

                    <p className="mt-4 text-center text-orange-500">Current equipment</p>
                  </div>
                </div>
              ) : null}

              {chosenArtifact ? <OwnerLabel item={chosenArtifact} /> : null}
            </div>
          </div>
        );
      }}
    </EntitySelectTemplate>
  );
};

export const ArtifactInventory = Modal.coreWrap(ArtifactInventoryCore, { preset: "large" });
