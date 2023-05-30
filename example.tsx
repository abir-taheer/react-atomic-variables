import { AtomicVariable, useVariable } from "./index";

const counterVariable = new AtomicVariable(24);

console.log(counterVariable + 1);
