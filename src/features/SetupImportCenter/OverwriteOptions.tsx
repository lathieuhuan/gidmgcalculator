import { FormEvent, useState } from "react";
import { FaChevronRight } from "react-icons/fa";

import type { CharInfo, Target } from "@Src/types";
import { $AppSettings } from "@Src/services";
import { selectCalcSetupsById, selectActiveId, selectTarget } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/pure-hooks";

// Component
import { Table, CollapseSpace } from "@Src/pure-components";

const { Tr, Th, Td } = Table;

export interface OverwriteOptionsProps {
  importedChar: CharInfo;
  importedTarget: Target;
  askForCharacter: boolean;
  askForTarget: boolean;
  onDone: (data: { shouldOverwriteChar: boolean; shouldOverwriteTarget: boolean }) => void;
}
export function OverwriteOptions({
  importedChar,
  importedTarget,
  askForCharacter,
  askForTarget,
  onDone,
}: OverwriteOptionsProps) {
  const { t } = useTranslation();
  const setupsById = useSelector(selectCalcSetupsById);
  const activeId = useSelector(selectActiveId);
  const target = useSelector(selectTarget);

  const [expandedSection, setExpandedSection] = useState<"" | "char" | "target">("");

  const { char } = setupsById[activeId];
  const oldChar = {
    name: char.name,
    level: [char.level],
    NAs: [char.NAs],
    ES: [char.ES],
    EB: [char.EB],
    cons: [char.cons],
  };

  if ($AppSettings.get("charInfoIsSeparated")) {
    oldChar.level = Object.values(setupsById).map(({ char }) => char.level);
    oldChar.NAs = Object.values(setupsById).map(({ char }) => char.NAs);
    oldChar.ES = Object.values(setupsById).map(({ char }) => char.ES);
    oldChar.EB = Object.values(setupsById).map(({ char }) => char.EB);
    oldChar.cons = Object.values(setupsById).map(({ char }) => char.cons);
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onDone({
      shouldOverwriteChar: !!formData.get("shouldOverwriteChar"),
      shouldOverwriteTarget: !!formData.get("shouldOverwriteTarget"),
    });
  };

  const onClickSeeDetails = (section: typeof expandedSection) => {
    setExpandedSection(section === expandedSection ? "" : section);
  };

  const renderCompareRow = (object1: any, object2: any, ns: "resistance" | "common") => {
    return Object.keys(object1).map((type) => {
      const value1 =
        object1?.[type] === undefined
          ? null
          : Array.isArray(object1[type]) && object1[type].length > 1
          ? `${object1[type].join(", ")}`
          : `${object1[type]}`;

      const value2 = object2?.[type] === undefined ? null : `${object2[type]}`;

      return (
        <Tr key={type}>
          <Td className={"capitalize" + (value1 !== value2 ? " text-red-100" : "")}>{t(type, { ns })}</Td>
          {type === "name" ? (
            <Td colSpan={2} style={{ textAlign: "center" }}>
              {oldChar.name}
            </Td>
          ) : (
            <>
              <Td>{value1}</Td>
              <Td>{value2}</Td>
            </>
          )}
        </Tr>
      );
    });
  };

  const oldTarget = { level: target?.level, ...target?.resistances };
  const newTarget = { level: importedTarget?.level, ...importedTarget?.resistances };

  return (
    <form id="overwrite-configuration" onSubmit={onSubmit}>
      <p className="text-base">
        We detect difference(s) between the Calculator and this Setup. Choose what you want to overwrite.
      </p>
      <div className="mt-4 space-y-4">
        <OverwriteOption
          visible={askForCharacter}
          label="Character's Info"
          name="shouldOverwriteChar"
          expanded={expandedSection === "char"}
          onClickSeeDetails={() => onClickSeeDetails("char")}
        >
          {renderCompareRow(oldChar, importedChar, "common")}
        </OverwriteOption>

        <OverwriteOption
          visible={askForTarget}
          label="Target's Info"
          name="shouldOverwriteTarget"
          expanded={expandedSection === "target"}
          onClickSeeDetails={() => onClickSeeDetails("target")}
        >
          {renderCompareRow(oldTarget, newTarget, "resistance")}
        </OverwriteOption>
      </div>
    </form>
  );
}

interface OverwriteOptionProps {
  visible: boolean;
  label: string;
  name: string;
  expanded: boolean;
  /** Compare rows */
  children: React.ReactNode;
  onClickSeeDetails: () => void;
}
const OverwriteOption = ({ visible, label, name, expanded, children, onClickSeeDetails }: OverwriteOptionProps) => {
  if (!visible) return null;

  return (
    <div>
      <div className="px-4 flex items-center justify-between">
        <label className="mr-4 flex">
          <input type="checkbox" name={name} className="scale-150" />
          <span className="ml-2">{label}</span>
        </label>

        <div className="flex items-center">
          <FaChevronRight className={"text-xs" + (expanded ? " rotate-90" : "")} />
          <span
            className={"ml-1 text-sm cursor-pointer " + (expanded ? "text-green-300" : "text-light-400")}
            onClick={onClickSeeDetails}
          >
            See details
          </span>
        </div>
      </div>

      <CollapseSpace active={expanded}>
        <div className="pt-2 flex justify-center">
          <div style={{ maxWidth: "18rem" }}>
            <Table>
              <tbody>
                <Tr>
                  <Th />
                  <Th className="text-yellow-400">Old</Th>
                  <Th className="text-yellow-400">New</Th>
                </Tr>

                {children}
              </tbody>
            </Table>
          </div>
        </div>
      </CollapseSpace>
    </div>
  );
};
