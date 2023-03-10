import { ReactNode } from "react";

interface ListProps {
  children: ReactNode;
}

export const ListDecimal = (props: ListProps) => {
  return <ul className="mt-1 pl-4 list-decimal space-y-1" {...props} />;
};

export const ListDisc = (props: ListProps) => {
  return <ul className="mt-1 list-disc list-inside space-y-1" {...props} />;
};
