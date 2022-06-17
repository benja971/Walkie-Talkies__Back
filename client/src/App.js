import React, { useState } from "react";

import "./App.css";
import Access from "./Components/Access/Access";
import Application from "./Components/Application/Application";

function App() {
	const [accessVisibility, setAcessVisibility] = useState(true);

	return <div className='App'>{accessVisibility ? <Access setSelfVisibility={setAcessVisibility} /> : <Application />}</div>;
}

export default App;
