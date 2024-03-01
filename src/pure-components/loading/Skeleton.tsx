import clsx, { ClassValue } from "clsx";
// import { IconBaseProps } from "react-icons";
// import { FaQuestionCircle, FaUser } from "react-icons/fa";
// import { randomNumber } from "@Src/utils";


interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

// interface EntitySkeletonProps extends IconBaseProps {
//   type?: "unknown" | "character";
// }

// interface TableSkeletonProps extends SkeletonProps {
//   lineCount?: number;
//   lineCls?: string;
// }

interface ParagraphSkeletonProps extends SkeletonProps {
  lineCls?: ClassValue;
  lineCount?: number;
}

type CompoundedComponent = ((props: SkeletonProps) => JSX.Element) & {
  Paragraph: (props: ParagraphSkeletonProps) => JSX.Element;
  // Entity: (props: EntitySkeletonProps) => JSX.Element;
  // Select: (props: SkeletonProps) => JSX.Element;
  // Title: (props: SkeletonProps) => JSX.Element;
  // Table: (props: TableSkeletonProps) => JSX.Element;
};

const Skeleton = (({ className = "", ...rest }) => (
  <div className={"bg-light-400 animate-pulse " + className} {...rest} />
)) as CompoundedComponent;

// Skeleton.Entity = ({ type = "unknown", className = "", ...rest }: EntitySkeletonProps) => {
//   const Icon = {
//     unknown: FaQuestionCircle,
//     character: FaUser,
//   }[type];

//   return <Icon {...rest} className={"animate-pulse " + className} />;
// };

// Skeleton.Title = ({ className = "", ...rest }) => {
//   return <div className={"h-7 bg-light-400 animate-pulse rounded " + className} {...rest} />;
// };

// Skeleton.Select = ({ className = "", ...rest }) => {
//   return <div className={"h-8 bg-light-400 animate-pulse rounded-t-2.5xl rounded-b-2.5xl " + className} {...rest} />;
// };

Skeleton.Paragraph = ({ className = "", lineCls, lineCount = 3 }) => {
  return (
    <div className={"space-y-2 " + className}>
      {Array.from({ length: lineCount }).map((_, i) => (
        <div
          key={i}
          className={clsx("h-6 bg-light-400 rounded-sm animate-pulse", i === lineCount - 1 && "w-4/5", lineCls)}
        />
      ))}
    </div>
  );
};

// Skeleton.Table = ({ className = "", lineCls = "", lineCount = 5, ...rest }) => {
//   return (
//     <div className={"space-y-2 " + className} {...rest}>
//       {Array.from({ length: lineCount }).map((_, i) => (
//         <div key={i} className={"flex justify-between " + lineCls}>
//           <div
//             className={"h-5 bg-light-400 rounded-sm animate-pulse " + lineCls}
//             style={{ width: `${randomNumber(50, 20, 5)}%` }}
//           />
//           <div
//             className={"h-5 bg-light-400 rounded-sm animate-pulse " + lineCls}
//             style={{ width: `${randomNumber(25, 10, 5)}%` }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

export { Skeleton };
