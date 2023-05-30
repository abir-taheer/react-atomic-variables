import { AtomicVariable, Setter } from "../AtomicVariable";

export const useSetValue = <Type>(
  variable: AtomicVariable<Type>
): Setter<Type> => {
  return variable.set;
};
