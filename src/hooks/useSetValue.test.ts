import { AtomicVariable } from "../AtomicVariable";
import { expect } from "chai";
import { useSetValue } from "./useSetValue";

describe("useSetValue", () => {
  it("should return the setter function of the variable", () => {
    const variable = new AtomicVariable(0);

    const setter = useSetValue(variable);

    expect(setter).to.equal(variable.set);
  });

  it("should update the value of the variable when the setter is used", () => {
    const variable = new AtomicVariable(0);
    const set = useSetValue(variable);

    set(1);

    expect(variable.getValue()).to.equal(1);
  });
});
