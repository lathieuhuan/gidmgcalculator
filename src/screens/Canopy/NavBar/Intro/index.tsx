import { CloseButton, Lightgold } from "@Components/atoms";
import { CollapseList, Modal, type ModalControl } from "@Components/molecules";
import { About } from "./About";
import { Notes } from "./Notes";
import { Tutorial } from "./Tutorial";
import { UPDATES } from "./updates";

export const Intro = ({ active, onClose }: ModalControl) => {
  return (
    <Modal className="px-2 py-4 md1:px-4 flex flex-col" withDefaultStyle {...{ active, onClose }}>
      <CloseButton className="absolute top-2 right-2" boneOnly onClick={onClose} />
      <h1 className="px-6 mb-2 text-2xl text-center text-orange font-bold">
        WELCOME to GI DMG Calculator <sup className="text-base text-lesser">(v3.0.0)</sup>
      </h1>
      <div className="grow custom-scrollbar">
        <CollapseList
          list={[
            {
              heading: "Tutorial",
              body: <Tutorial />,
            },
            {
              heading: "Updates",
              body: (
                <div className="space-y-2">
                  {UPDATES.map(({ date, content }, i) => (
                    <div key={i}>
                      <p className="text-orange font-bold">{date}</p>
                      <ul className="space-y-1">
                        {content.map((line, j) => (
                          <li key={j}>- {line}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ),
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
            <a
              href="https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki"
              rel="noreferrer"
              target="_blank"
            >
              Genshin Impact Wiki
            </a>
            , every image and formula is gathered from them.
          </p>
          <p>
            - Another special thank to{" "}
            <a
              href="https://genshin.honeyhunterworld.com/?lang=EN"
              rel="noreferrer"
              target="_blank"
            >
              Honey Impact
            </a>
            , all data is collected from their site.
          </p>
          <p>
            - Huge and special thanks to{" "}
            <Lightgold>
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
              ].join(", ")}
            </Lightgold>{" "}
            for the Bug reports!
          </p>
          <p>
            - Last but not least, thank you for using my App and please give me some feedback if you
            can.
          </p>
        </div>
      </div>
    </Modal>
  );
};
