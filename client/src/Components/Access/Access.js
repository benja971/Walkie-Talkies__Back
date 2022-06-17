import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../reducers/userReducer";
import { getCookie, setCookie } from "../../mess";

export default function Access(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showRegister, setShowRegister] = useState(false);

	const { setSelfVisibility } = props;

	const formRef = useRef();
	const errorRef = useRef(null);
	const askRegisterRef = useRef(null);

	const dispatch = useDispatch();

	const manageLogin = async response => {
		// success
		if (response.status === 202) {
			const user = await response.json();

			if (!user) return;

			setSelfVisibility(false);
			setCookie("user", user._id, 1000 * 60 * 60 * 24 * 7);
			dispatch(setUser(user));
		}

		// error
		else {
			const errors = {
				204: "User not found",
				400: "Wrong password",
			};

			const error = errors[response.status];

			errorRef.current.classList.remove("d-none");
			errorRef.current.innerText = error;

			if (response.status === 204) setShowRegister(true);
		}
	};

	const manageRegister = async response => {
		if (response.status === 204) {
			const res = await fetch("http://localhost:8080/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			const user = await res.json();

			if (!user) return;
			setSelfVisibility(false);
			setCookie("user", user._id, 1000 * 60 * 60 * 24 * 7);
			dispatch(setUser(user));
		}
	};

	async function handleSubmit(event) {
		event.preventDefault();

		const id = event.target.id;

		const data = {
			email,
			password,
		};

		const response = await fetch("http://localhost:8080/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		console.log(response);

		if (id === "login") manageLogin(response);
		else if (id === "register") manageRegister(response);
	}

	useEffect(() => {
		const user = getCookie("user");

		if (!user) return;

		fetch(`http://localhost:8080/api/users/${user}`)
			.then(res => res.json())
			.then(user => {
				setSelfVisibility(false);
				dispatch(setUser(user));
			});
	});

	return (
		<div id='access'>
			<h1 className='text-center mt-3'>Access</h1>

			<form ref={formRef} className='container d-flex justify-content-center flex-column' id='access-form'>
				<div className='form-group d-flex align-items-center flex-column'>
					<label htmlFor='access-email'>Email</label>
					<input
						required
						placeholder='Email'
						type='email'
						name='email'
						value={email}
						onChange={e => {
							setEmail(e.target.value);
						}}
						className=''
						id='access-email'
						autoComplete='username'
					/>
				</div>

				<div className='form-group d-flex align-items-center flex-column'>
					<label htmlFor='access-name'>Password</label>
					<input
						required
						placeholder='Password'
						type='password'
						name='password'
						value={password}
						onChange={e => {
							setPassword(e.target.value);
						}}
						className=''
						id='access-password'
						autoComplete='current-password'
					/>
				</div>

				<p id='error' ref={errorRef} className='w-50 align-self-center text-danger d-none mb-0'></p>

				<p id='error' ref={askRegisterRef} className='w-50 align-self-center text-danger invisible mb-0'>
					Try to register
				</p>

				<div className='container d-flex justify-content-center mt-2 '>
					{showRegister ? (
						<button onClick={handleSubmit} id='register' type='submit' className='btn btn-primary mr-3 w-25'>
							Register
						</button>
					) : (
						<button onClick={handleSubmit} id='login' type='submit' className='btn btn-primary mr-3 w-25'>
							Login
						</button>
					)}

					<button
						type='reset'
						className='btn btn-secondary w-25'
						onClick={e => {
							e.preventDefault();
							setEmail("");
							setPassword("");
							formRef.current.reset();
						}}
					>
						Reset
					</button>
				</div>
			</form>
		</div>
	);
}
