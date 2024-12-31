import { useCallback, useState } from "react";

//hook 예시
function useInput(initialValue) {
	const [value, setValue] = useState(initialValue);

	// Handles input changes
	const handleChange = useCallback((event) => {
		setValue(event.target.value);
	}, []);

	// Resets the input value to the initial value
	const reset = useCallback(() => {
		setValue(initialValue);
	}, [initialValue]);

	return [value, handleChange, reset];
}

export default useInput;
