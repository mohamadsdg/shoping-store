const deleteProduct = (btn) => {
  const productID = btn.parentNode.querySelector("[name=productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;
  const productElm = btn.closest("article");

  fetch(`/admin/product/${productID}`, {
    method: "DELETE",
    headers: {
      "CSRF-Token": csrfToken,
    },
  })
    .then((rsp) => rsp.json())
    .then((data) => {
      console.log(data);
      productElm.parentNode.removeChild(productElm);
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(productID, csrfToken);
};
