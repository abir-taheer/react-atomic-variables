import { useEffect, useMemo, useState } from "react";

type Listener<Type> = (value: Type) => void;

type AtomicSetterFn<Type> = (current: Type) => Type;
type Setter<Type> = (value: Type | AtomicSetterFn<Type>) => void;
type Unsubscribe = () => void;

class ListenerStore<Type> {
  listeners: Listener<Type>[];

  constructor() {
    this.listeners = [];
  }

  addListener(listener: Listener<Type>) {
    this.listeners.push(listener);
  }

  removeListener(listener: Listener<Type>) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  emit(value: Type) {
    this.listeners.forEach((listener) => listener(value));
  }
}

export class AtomicVariable<Type> {
  private value: Type;
  set: Setter<Type>;
  private listeners = new ListenerStore<Type>();
  subscribe: (callback: (value: Type) => void) => Unsubscribe;

  constructor(value: Type) {
    this.value = value;
    this.set = (newValue) => {
      const isFn = newValue instanceof Function;

      if (isFn) {
        this.value = newValue(this.value);
      } else {
        this.value = newValue;
      }

      this.listeners.emit(this.value);
    };

    this.subscribe = (callback: (value: Type) => void) => {
      const listener = () => {
        const newValue = this.value;
        callback(newValue);
      };

      this.listeners.addListener(listener);

      return () => this.listeners.removeListener(listener);
    };
  }

  getValue(): Type {
    return this.value;
  }
}

export const useVariable = <Type>(
  variable: AtomicVariable<Type>
): [Type, Setter<Type>] => {
  const [value, setValue] = useState(variable.getValue());

  useEffect(() => {
    variable.subscribe(setValue);
  }, [variable]);

  return useMemo(() => [value, variable.set], [value, variable.set]);
};

export const useValue = <Type>(variable: AtomicVariable<Type>): Type => {
  const [value, setValue] = useState(variable.getValue());

  useEffect(() => {
    return variable.subscribe(setValue);
  }, [variable.subscribe]);

  return value;
};

export const useSetValue = <Type>(
  variable: AtomicVariable<Type>
): Setter<Type> => {
  return variable.set;
};
