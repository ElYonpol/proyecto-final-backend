const socket = io();

socket.on("newProductAdded", (resp) => {
	const tableRow = document.querySelector(".productList");
	return (tableRow.innerHTML += `<tr>
    <th scope="row">${resp.title}</th>
    <td><img
            src="${resp.thumbnails[0]}"
            alt="product image"
        /></td>
    <td>${resp.price}</td>
    <td>${resp.category}</td>
    <td>${resp.stock}</td>
</tr>`);
});

const getSubmit = document.querySelector("#productForm");

getSubmit.addEventListener("submit", async (event) => {
	event.preventDefault();
	const formData = new FormData(event.target);
	const data = Object.fromEntries(formData.entries());
	const res = await fetch("/api/products", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "content-type": "application/json" },
	});
});
