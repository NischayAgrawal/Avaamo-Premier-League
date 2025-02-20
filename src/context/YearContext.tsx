import React, { createContext, useContext, useState, ReactNode } from "react";

interface YearContextType {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = (): YearContextType => {
  const context = useContext(YearContext);
  if (!context) {
    throw new Error("useYear must be used within a YearProvider");
  }
  return context;
};
