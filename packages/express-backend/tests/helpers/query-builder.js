export function createQueryBuilder(
  result,
  terminalMethod = "exec"
) {
  const calls = [];
  const builder = {};
  const methods = [
    "populate",
    "sort",
    "lean",
    "skip",
    "limit",
    "exec",
    "select"
  ];

  methods.forEach(methodName => {
    builder[methodName] = (...args) => {
      calls.push({ method: methodName, args });
      if (methodName === terminalMethod) {
        return Promise.resolve(result);
      }
      return builder;
    };
  });

  return { builder, calls };
}
