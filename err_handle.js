// sync code using try/catch
function sum(a, b) {
  if ((typeof a === "string", typeof b === "string"))
    throw new Error("invalid entry");

  return a + b;
}

try {
  const add = sum(2, "2");
  console.log(add);
} catch (error) {
  console.log("Erro occurred !");
  //   console.log(error);
}
