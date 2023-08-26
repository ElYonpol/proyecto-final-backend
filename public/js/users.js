let url = window.location.href;
let urlObj = new URL(url);
let searchParams = urlObj.searchParams;
let sort = document.getElementById("sort");
let role = document.getElementById("role");
let state = document.getElementById("status");

const findIndex = (valueToFind, options) => {
	for (let i = 0; i < options.length; i++) {
		if (options[i].value === valueToFind) {
			return i;
		}
	}
};

if (searchParams.has("sort")) {
	sort.selectedIndex = findIndex(searchParams.get("sort"), sort.options);
}

if (searchParams.has("query")) {
	queryObj = JSON.parse(searchParams.get("query"));
	let valueStatus = queryObj.status ?? "none";
	state.selectedIndex = findIndex(valueStatus, state.options);
	let valueRole = queryObj.role ?? "none";
	role.selectedIndex = findIndex(valueRole, role.options);
}

const changeOptions = (select) => {
	let value = select.options[select.selectedIndex].value;
	if (searchParams.has(select.name)) {
		if (value === "none") {
			if (select.name === "query") {
				queryObj = JSON.parse(searchParams.get("query"));
				delete queryObj[select.id];
				if (Object.keys(queryObj).length > 0) {
					value = JSON.stringify(queryObj);
					searchParams.set(select.name, value);
				} else {
					searchParams.delete("query");
				}
			} else {
				searchParams.delete(select.name);
			}
		} else {
			if (select.name === "query") {
				queryObj = JSON.parse(searchParams.get("query"));
				queryObj = { ...queryObj, [select.id]: value };
				value = JSON.stringify(queryObj);
			}
			searchParams.set(select.name, value);
		}
	} else {
		if (select.name === "query") {
			queryObj = JSON.parse(searchParams.get("query"));
			queryObj = { ...queryObj, [select.id]: value };
			value = JSON.stringify(queryObj);
		}
		searchParams.set(select.name, value);
	}
	if (searchParams.toString().length > 0) {
		window.location.href =
			urlObj.origin + urlObj.pathname + "?" + searchParams.toString();
	} else {
		window.location.href = urlObj.origin + urlObj.pathname;
	}
};

const changePage = (page) => {
	if (searchParams.has("page")) searchParams.delete("page");
	if (searchParams.toString().length > 0) {
		window.location.href =
			urlObj.origin +
			urlObj.pathname +
			"?page=" +
			page +
			"&" +
			searchParams.toString();
	} else {
		window.location.href = urlObj.origin + urlObj.pathname + "?page=" + page;
	}
};
