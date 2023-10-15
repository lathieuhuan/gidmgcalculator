import { Lightgold, CollapseList, StandardModal, type ModalControl } from "@Src/pure-components";
import { About } from "./About";
import { Notes } from "./Notes";
import { UPDATES } from "./updates";
import { VersionRecap } from "./VersionRecap";

export const Introduction = (props: ModalControl) => {
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
        <h1 className="px-6 mb-2 text-2xl text-center text-orange font-bold">
          Welcome to GI DMG Calculator{" "}
          <sup className="text-base text-lesser">v{UPDATES.find((update) => !!update.patch)?.patch}</sup>
        </h1>
      }
      {...props}
    >
      <CollapseList
        list={[
          {
            heading: (expanded) => (
              <>
                Updates
                {expanded ? null : (
                  <span className="ml-2 px-1 py-px text-sm rounded text-orange bg-darkblue-1">{UPDATES[0].date}</span>
                )}
              </>
            ),
            body: (
              <div className="space-y-2 contains-inline-svg">
                {UPDATES.map(({ date, patch, content }, i) => (
                  <div key={i}>
                    <p className="text-orange font-bold">{date + (patch ? ` (v${patch})` : "")}</p>
                    <ul className="mt-1 space-y-1">
                      {content.map((line, j) => (
                        <li key={j} dangerouslySetInnerHTML={{ __html: `- ${parseContent(line)}` }} />
                      ))}
                    </ul>
                  </div>
                ))}
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
