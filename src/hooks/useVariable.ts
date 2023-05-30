import { useMemo } from "react";
import { AtomicVariable, Setter } from "../AtomicVariable";
import { useValue } from "./useValue";

export const useVariable = <Type>(
  variable: AtomicVariable<Type>
): [Type, Setter<Type>] => {
  const value = useValue(variable);

  return useMemo(() => [value, variable.set], [value, variable.set]);
};
