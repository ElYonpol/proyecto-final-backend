const correctThumbnails = (array) => {
	return array[0];
};

const concatenateURLCarts = (cid) => {
	const baseCartURL = "/carts/";
	return `${baseCartURL}${cid}`;
};

module.exports = { correctThumbnails, concatenateURLCarts };
