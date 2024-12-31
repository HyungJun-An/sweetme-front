const BASE_URL = "http://localhost:8080";

export const api = async (path, options = {}) => {
	try {
		const requestOptions = {
			...{
				headers: {
					"Content-Type": "application/json",
				},
			},
			...options,
		};

		// const delays = [1000, 2000, 3000];
		// const randomIndex = Math.floor(Math.random() * delays.length);
		// await new Promise((resolve) => setTimeout(resolve, delays[randomIndex]));

		const response = await fetch(`${BASE_URL}/${path}`, requestOptions);
		if (!response.ok) {
			throw Error("Failed to Fetch Posts");
		}
		return await response.json();
	} catch (e) {
		throw Error(e instanceof Error ? e.message : "unknown error");
	}
};
