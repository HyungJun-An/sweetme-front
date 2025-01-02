import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import React from "react";
import "@/assets/css/index.css";
import router from "@/router/index.jsx";

import { ThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ThemeProvider>
			<RouterProvider router={router} />
		</ThemeProvider>
	</React.StrictMode>
);
