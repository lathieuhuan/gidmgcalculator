import { FaDiscord, FaRedditAlien } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Yellow } from "@Src/pure-components";

export const About = () => {
  const CONTACTS = [
    {
      Icon: FaDiscord,
      href: "https://www.reddit.com/user/Ronqueroc",
      text: "Ronqueroc#2674",
    },
    {
      Icon: FaRedditAlien,
      href: "https://www.reddit.com/user/Ronqueroc",
      text: "u/Ronqueroc",
    },
    {
      Icon: MdEmail,
      href: "https://mail.google.com",
      text: "nothingthen11@gmail.com",
    },
  ];

  return (
    <div className="space-y-1">
      <p>
        - Hello, I'm <Yellow>Ronqueroc</Yellow> the owner of this App. I lost my job at a hotel due to the
        pandemic and started to learn programming on July 2020.
      </p>
      <p>
        - This App is for calculating DMG a character in game Genshin Impact can do with their attacks in a specific
        scenario (Setup). It is not affiliated with or endorsed by Hoyoverse.
      </p>
      <p>- Feel free to contact me if you encounter bugs or have any questions regarding the Calculator.</p>
      <ul className="pl-3 space-y-2">
        {CONTACTS.map(({ Icon, href, text }, i) => (
          <li key={text} className="flex items-center">
            <Icon className="mr-2 shrink-0" size="1.25rem" />
            <a href={href} rel="noreferrer" target="_blank">
              {text}
            </a>
          </li>
        ))}
      </ul>
      <p className="ml-3 text-light-800">(yes the email address is real)</p>
    </div>
  );
};
