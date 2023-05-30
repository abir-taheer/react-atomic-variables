import {useEffect, useState} from "react";
import {AtomicVariable} from "../AtomicVariable";

export const useValue = <Type>(variable: AtomicVariable<Type>): Type => {
  const [value, setValue] = useState(variable.getValue());

  useEffect(() => {
    return variable.subscribe(setValue);
  }, [variable.subscribe]);

  return value;
};