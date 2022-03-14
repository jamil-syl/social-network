import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthToken";
import Dashboard from "./components/dashboard/Dashboard";
import EditProfile from "./components/profile-forms/EditProfile";
import { loadUser } from "./actions/auth";
import PrivateRoute from "./routing/PrivateRoute";
import store from "./store";

import "./App.css";
import { Provider } from "react-redux";
import CreateProfile from "./components/profile-forms/CreateProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Navbar />
				<Alert />
				<Routes>
					<Route exact path='/' element={<Landing />} />
					<Route exact path='/register' element={<Register />} />
					<Route exact path='/login' element={<Login />} />
					<Route
						exact
						path='/dashboard'
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/edit-profile'
						element={
							<PrivateRoute>
								<EditProfile />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/create-profile'
						element={
							<PrivateRoute>
								<CreateProfile />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/add-experience'
						element={
							<PrivateRoute>
								<AddExperience />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/add-education'
						element={
							<PrivateRoute>
								<AddEducation />
							</PrivateRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</Provider>
	);
};
export default App;
