import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import React from "react";
import "@/assets/css/index.css";
import router from "@/router/router.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
