import React from "react";

interface LayoutProps extends React.ComponentPropsWithoutRef<"main"> {
  children?: React.ReactNode;
}

export function Layout({ children, ...props }: LayoutProps) {
  return (
    <main
      className="mx-8 my-8 pb-24 md:mx-16 lg:mx-32 xl:mx-48 2xl:mx-64"
      {...props}
    >
      {children}
    </main>
  );
}
