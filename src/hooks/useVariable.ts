import {useEffect, useMemo, useState} from "react";
import {AtomicVariable, Setter} from "../AtomicVariable";

export const useVariable = <Type>(
  variable: AtomicVariable<Type>
): [Type, Setter<Type>] => {
  const [value, setValue] = useState(variable.getValue());

  useEffect(() => {
    variable.subscribe(setValue);
  }, [variable]);

  return useMemo(() => [value, variable.set], [value, variable.set]);
};