import clsx from "clsx";
import { useState } from "react";

import { $AppData, Update } from "@Src/services";
import { useGetMetadata } from "@Src/hooks";
import { useDispatch } from "@Store/hooks";
import { updateUI } from "@Store/uiSlice";

import { CollapseList, ModalControl, LoadingIcon, Skeleton, Modal } from "@Src/pure-components";
import { MetadataRefetcher } from "../../MetadataRefetcher";
import { About } from "./About";
import { Notes } from "./Notes";
import { VersionRecap } from "./VersionRecap";

export const Introduction = (props: ModalControl) => {
  const dispatch = useDispatch();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [supporters, setSupporters] = useState<string[]>([]);

  const { status, getMetadata } = useGetMetadata({
    onSuccess: () => {
      setUpdates($AppData.updates);
      setSupporters($AppData.supporters);
      dispatch(updateUI({ ready: true }));
    },
  });

  const isLoadingMetadata = status === "loading";
  const patch = updates.find((update) => !!update.patch)?.patch;
  const latestDate: string | undefined = updates[0]?.date;

  const typeToCls: Record<string, string> = {
    e: "text-yellow-400",
    u: "text-red-100",
    f: "text-green-300",
  };

  const parseContent = (content: string) => {
    return content.replace(/\{[a-zA-Z0-9 _'"-]+\}#\[[euf]\]/g, (match) => {
      const [bodyPart, typePart = ""] = match.split("#");
      const body = bodyPart.slice(1, -1);
      const type = typePart?.slice(1, -1);
      return `<span class="${typeToCls[type] || ""}">${body}</span>`;
    });
  };

  const renderTitle = (content: string, className?: string) => {
    return (
      <h1 className={clsx("text-2xl text-orange-500 text-center font-bold relative", className)}>
        {content}
        <span className="absolute top-0 left-full ml-2 text-base text-light-800">
          {isLoadingMetadata ? <Skeleton className="w-14 h-4 rounded" /> : patch ? <span>v{patch}</span> : null}
        </span>
      </h1>
    );
  };

  return (
    <Modal
      preset="large"
      withHeaderDivider={false}
      bodyCls="pt-0"
      title={
        <>
          <div className="flex flex-col items-center">
            {renderTitle("Welcome to GI DMG Calculator", "hidden md:block")}

            <p className="text-xl font-semibold md:hidden">Welcome to</p>
            {renderTitle("GI DMG Calculator", "md:hidden")}
          </div>

          <MetadataRefetcher
            className="mt-2"
            isLoading={isLoadingMetadata}
            isError={status === "error"}
            onRefetch={getMetadata}
          />
        </>
      }
      {...props}
      closable={status === "done"}
    >
      <div className="h-full custom-scrollbar">
        <CollapseList
          list={[
            {
              heading: (expanded) => (
                <div className="flex items-center space-x-2">
                  <span>Updates</span>

                  {!expanded ? (
                    isLoadingMetadata ? (
                      <Skeleton className="w-28 h-4 rounded" />
                    ) : latestDate ? (
                      <span className="ml-2 px-1 text-sm rounded text-orange-500 bg-dark-900">{latestDate}</span>
                    ) : null
                  ) : null}
                </div>
              ),
              body: (
                <div className="space-y-2 contains-inline-svg">
                  {isLoadingMetadata ? (
                    <div className="h-20 flex-center">
                      <LoadingIcon size="large" />
                    </div>
                  ) : updates.length ? (
                    updates.map(({ date, patch, content }, i) => (
                      <div key={i}>
                        <p className="text-orange-500 font-bold">{date + (patch ? ` (v${patch})` : "")}</p>
                        <ul className="mt-1 space-y-1">
                          {content.map((line, j) => (
                            <li key={j} dangerouslySetInnerHTML={{ __html: `- ${parseContent(line)}` }} />
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="h-20 flex-center text-red-100">
                      <p>Failed to get updates</p>
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
          <p className="text-orange-500 font-semibold">Credit</p>
          <p>
            - Thank you{" "}
            <a href="https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki" rel="noreferrer" target="_blank">
              Genshin Impact Wiki
            </a>
            . Every image and formula is gathered from them.
          </p>
          <p>
            - A thank to{" "}
            <a href="https://genshin.honeyhunterworld.com/?lang=EN" rel="noreferrer" target="_blank">
              Honey Impact
            </a>
            , data of characters, weapons, and artifacts are collected from their site.
          </p>
          <p>- Huge and special thanks to the donators!</p>
          <ul className="ml-4 text-yellow-400 columns-1 md:columns-2 xm:columns-3 lg:columns-4">
            {["Marc (marcdau)", "Akenouille", "Brandon Pride"].map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
          <p>- Special thanks to these supporters for the bug reports:</p>
          {isLoadingMetadata ? (
            <div className="ml-4 grid grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="w-28 h-4 rounded" />
              ))}
            </div>
          ) : supporters.length ? (
            <ul className="ml-4 text-yellow-400 columns-1 md:columns-2 xm:columns-3 lg:columns-4">
              {supporters.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          ) : (
            <div className="h-20 flex-center text-red-100">
              <p>Failed to get supporters</p>
            </div>
          )}
          <p>- Last but not least, thank you for using my App and please give me some feedback if you can.</p>
        </div>
      </div>
    </Modal>
  );
};
