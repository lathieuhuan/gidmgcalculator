import { appData, Update } from "@Src/data";
import { RefetchMetadata } from "@Src/features/RefetchMetadata";
import { useGetMetadata } from "@Src/hooks";
import {
  Lightgold,
  CollapseList,
  StandardModal,
  type ModalControl,
  LoadingIcon,
  Skeleton,
  Button,
} from "@Src/pure-components";
import { useState } from "react";
import { About } from "./About";
import { Notes } from "./Notes";
import { VersionRecap } from "./VersionRecap";

export const Introduction = (props: ModalControl) => {
  const [updates, setUpdates] = useState<Update[]>([]);

  const { status, getMetadata } = useGetMetadata({
    onSuccess: () => {
      setUpdates(appData.updates);
    },
  });

  const isLoadingMetadata = status === "loading";
  // const isLoadingMetadata = true;
  const patch = updates.find((update) => !!update.patch)?.patch;
  const latestDate: string | undefined = updates[0]?.date;

  const typeToCls: Record<string, string> = {
    g: "text-lightgold",
    r: "text-lightred",
  };

  const parseContent = (content: string) => {
    return content.replace(/\{[a-zA-Z0-9 _']+\}#\[[gr]\]/g, (match) => {
      const [bodyPart, typePart = ""] = match.split("#");
      const body = bodyPart.slice(1, -1);
      const type = typePart?.slice(1, -1);
      return `<span class="${typeToCls[type] || ""}">${body}</span>`;
    });
  };

  return (
    <StandardModal
      title={
        <div className={"px-6 flex flex-col items-center justify-center " + (status === "error" ? "mb-4" : "mb-2")}>
          <h1 className="text-2xl text-orange font-bold relative">
            Welcome to GI DMG Calculator
            <span className="absolute top-0 left-full ml-2 text-base text-lesser">
              {isLoadingMetadata ? <Skeleton className="w-14 h-4 rounded" /> : patch ? <span>v{patch}</span> : null}
            </span>
          </h1>
          <RefetchMetadata isLoading={isLoadingMetadata} isError={status === "error"} onRefetch={getMetadata} />
        </div>
      }
      {...props}
      closable={status === "done"}
    >
      <CollapseList
        list={[
          {
            heading: (expanded) => (
              <div className="flex items-center space-x-2">
                <span>Updates</span>
                {expanded ? null : isLoadingMetadata ? (
                  <Skeleton className="w-28 h-4 rounded" />
                ) : latestDate ? (
                  <span className="ml-2 px-1 py-px text-sm rounded text-orange bg-darkblue-1">{latestDate}</span>
                ) : null}
              </div>
            ),
            body: (
              <div className="space-y-2 contains-inline-svg">
                {isLoadingMetadata ? (
                  <div className="h-20 flex-center">
                    <LoadingIcon />
                  </div>
                ) : updates.length ? (
                  updates.map(({ date, patch, content }, i) => (
                    <div key={i}>
                      <p className="text-orange font-bold">{date + (patch ? ` (v${patch})` : "")}</p>
                      <ul className="mt-1 space-y-1">
                        {content.map((line, j) => (
                          <li key={j} dangerouslySetInnerHTML={{ __html: `- ${parseContent(line)}` }} />
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="h-20 flex-center">
                    <p>No Updates</p>
                  </div>
                )}
              </div>
            ),
          },
          {
            heading: "New in v3.0.0",
            body: <VersionRecap />,
          },
          {
            heading: "Notes",
            body: <Notes />,
          },
          {
            heading: "About",
            body: <About />,
          },
        ]}
      />
      <div className="px-2 space-y-1">
        <p className="text-lightgold font-bold">CREDIT</p>
        <p>
          - A special thank to{" "}
          <a href="https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki" rel="noreferrer" target="_blank">
            Genshin Impact Wiki
          </a>
          , every image and formula is gathered from them.
        </p>
        <p>
          - Another special thank to{" "}
          <a href="https://genshin.honeyhunterworld.com/?lang=EN" rel="noreferrer" target="_blank">
            Honey Impact
          </a>
          , all data is collected from their site.
        </p>
        <p>- Huge and special thanks to these users for the bug reports!</p>
        <ul className="ml-4 columns-1 md1:columns-2 md2:columns-3 lg:columns-4">
          {[
            "K3y87",
            "Pastrynoms",
            "Ithireal (and their friend)",
            "CosSheCute",
            "Chronopolize",
            "333mage11",
            "Gustavo Mota Derzi",
            "Goldy4282",
            "G_0st08",
            "FlyingJetpa",
            "Nono",
            "mozz",
            "niczan0728",
            "Izah DLP",
            "Meiflower",
            "rock1017",
            "Street_Term9205",
            "Sevenempest",
            "_65535_",
            "arthur cavalaro",
            "Spiderninja_1",
            "Gabriel Caminha",
            "Ayan",
            "Only_Pumpkin_801",
            "Jenny-sama",
            "L1itTru",
            "Izzo",
            "Hounth",
            "StockedSix",
            "Antixique",
            "RememberTelannas",
            "Edvard Neto",
          ].map((name, i) => (
            <li key={i}>
              <Lightgold>{name}</Lightgold>
            </li>
          ))}
        </ul>
        <p>- Last but not least, thank you for using my App and please give me some feedback if you can.</p>
      </div>
    </StandardModal>
  );
};
