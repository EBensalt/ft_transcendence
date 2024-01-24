import {
	IconBan,
	IconChessBishopFilled,
	IconChessFilled,
	IconChessKingFilled,
	IconDoorExit,
	IconEye,
	IconEyeOff,
	IconLockOpen,
	IconSend2,
	IconSettings2,
	IconTrash,
	IconTrashOff,
	IconUser,
	IconUserPlus,
	IconVolume,
	IconVolume3,
	IconX
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import { DATA, Group, MESSAGE, NEWCHAT } from "../myTypes";
import { setMessageData, setUserData } from "../utils";
import { useNavigate } from "react-router-dom";

interface Props {
	data: DATA,
	setData: React.Dispatch<React.SetStateAction<DATA>>
}

const ChatGroups: React.FC<Props> = ({ data, setData }) => {
	const	[inputType, setInputType] = useState("password");
	const	[passwordText, setPasswordText] = useState("");
	const	[passwordError, setPasswordError] = useState(false);
	const	Reference = useRef<HTMLInputElement | null>(null);
	const	[conversation, setConversation] = useState<Array<{
		id: number,
		message: string,
		sender: string,
		avatar: string
	}>>([]);
	const	[settings, setSettings] = useState(false);
	const	[users, setUsers] = useState<Array<{
		id: number,
		avatar: string,
		userName: string,
		role: string
	}>>([])
	const	[role, setRole] = useState("member");
	const	userNameRef = useRef(data.userData?.userName);
	const	[invite, setInvite] = useState(false);
	const	[userInvite, setUserInvite] = useState("");
	const	[error, setError] = useState("");
	const	history = useNavigate()

	userNameRef.current = data.userData?.userName;
	useEffect(() => {
		if (Reference.current)
			Reference.current.focus();
	}, [data.groupTo]);
	useEffect(() => {
		data.socket?.on("clientRoom", callBack);
		return (() => {
			data.socket?.off("clientRoom", callBack);
		})
	}, [data.socket]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("http://localhost:3001/chathistoryRoom", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						sender: data.userData?.userName,
						recver: data.groupTo
					})
				});
				const Data = await res.json()
				if (Data)
					setConversation(Data)
				else
					throw new Error("error")
			}
			catch {
				setConversation([]);
				return ;
			}
		}
		fetchData();
	}, [data]);
	useEffect(() => {
		async function fetchData() {
			const	res = await fetch("http://localhost:3001/groupUsers", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					name: data.groupTo
				})
			});
			const	Data = await res.json();
			if (Data.length)
				setUsers(Data);
		}
		fetchData();
	}, [data])
	useEffect(() => {
		const	tmp = users.find(x => x.userName == data.userData?.userName)
		if (tmp)
			setRole(tmp.role)
		// const	test = data.userData?.groups.find(x => {
		// 		return x.name == data.groupTo;
		// 	})?.muted.find(x => {
		// 		return x == data.userData?.userName;
		// 	});
		// 	console
	}, [users]);
	// useEffect(() => {
	// 	// function callBackMouse(event: MouseEvent) {
	// 	// 	if (event.clientX < settingsXyRef.current.x ||
	// 	// 		event.clientX > settingsXyRef.current.x + 100 ||
	// 	// 		event.clientY < settingsXyRef.current.y ||
	// 	// 		event.clientY > settingsXyRef.current.y + 150)
	// 	// 		setSettings(false);
	// 	// }
	// 	function callBackResize() {
	// 		// if (window.innerWidth < 600)
	// 		// 	setSize(false);
	// 		// else
	// 		// 	setSize(true);
	// 		console.log()
	// 	}
	// 	// document.addEventListener("mousedown", callBackMouse);
	// 	window.addEventListener("resize", callBackResize);
	// 	return () => {
	// 		// document.removeEventListener("mousedown", callBackMouse);
	// 		window.removeEventListener("resize", callBackResize);
	// 	}
	// }, [])
	async function clickJoinCallBack(state: boolean) {
		if (!state) {
			const	res = await fetch("http://localhost:3001/leaveJoin", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					userName: data.userData?.userName,
					name: data.groupTo
				})
			});
			const	Data: Group[] = await res.json();
			setData(x => {
				if (x.userData)
					return {
						...x,
						userData: {
							...x.userData,
							groups: Data
						}
					}
				return x;
			});
			if (Data.find(x => x.name == data.groupTo)) {
				if (data.groupTo) {
					const	newChat: NEWCHAT = {
						sender: data.userData ? data.userData.userName : "",
						recver: data.groupTo
					}
					data.socket?.emit("newChatRoom", newChat);
				}
			}
			setData(x => ({
				...x,
				send: !x.send
			}))
			setPasswordText("");
			setInputType("password");
			history("/Chat");
		}
	}
	async function clickJoin() {
		console.log(data);
		if (data.password != undefined)
			await clickJoinCallBack(data.password)
		if (data.password) {
			if (passwordText == "")
				setPasswordError(true);
			else {
				const	res = await fetch("http://localhost:3001/checkPassword", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						name: data.groupTo,
						password: passwordText
					})
				});
				const	Data = await res.json();
				if (Data) {
					setData(x => ({
						...x,
						password: false
					}));
					await clickJoinCallBack(false);
				}
				else {
					setPasswordError(true);
				}
			}
		}
	}
	function clickInputType() {
		setInputType(x => x == "password" ? "text" : "password");
	}
	function changePassword(event: React.ChangeEvent<HTMLInputElement>) {
		setPasswordText(event.target.value);
		setPasswordError(false);
	}
	function changeMessage(event: React.ChangeEvent<HTMLInputElement>) {
		setData(x => ({
			...x,
			message: event.target.value
		}));
	}
	function submitMessage(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (data.message.length) {
			const	Message: MESSAGE = {
				sender: data.userData ? data.userData.userName : "",
				recver: data.groupTo ? data.groupTo : "",
				message: data.message
			}
			data.socket?.emit("room", Message);
			setData(prev => setMessageData(prev, ""))
			if (Reference.current)
				Reference.current.focus();
		}
	}
	function callBack(m: {
		id: number,
		message: string,
		sender: string,
		avatar: string,
	})
	{
		setData(x => ({
			...x,
			send: !x.send
		}))
		setConversation(prev => [m, ...prev]);
	}
	function clickSettings() {
		setSettings(x => !x);
		if (Reference.current)
			Reference.current.focus();
	}
	function clickBlock(event: React.MouseEvent<HTMLButtonElement>) {
		async function fetchData() {
			await fetch(`http://localhost:3001/user/${event.currentTarget.value}`, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: event.currentTarget.name
				}),
				credentials: "include"
			})
			await callBackBlock();
		}
		fetchData();
	}
	async function callBackBlock() {
		const res0 = await fetch("http://localhost:3001/chatUser", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userName: userNameRef.current
			})
		});
		const Data = await res0.json();
		setData(prev => setUserData(prev, Data));
		// async function fetchData() {
		// 	const	res = await fetch("http://localhost:3001/groupUsers", {
		// 		method: "POST",
		// 		headers: {
		// 			"content-type": "application/json"
		// 		},
		// 		body: JSON.stringify({
		// 			name: data.groupTo
		// 		})
		// 	});
		// 	const	Data = await res.json();
		// 	console.log(Data);
		// 	if (Data.length)
		// 		setUsers(Data);
		// }
		// fetchData();
	}
	async function clickAdmin(event: React.MouseEvent<HTMLButtonElement>) {
		const	tmp = event.currentTarget.value;
		if (tmp) {
			await fetch(`http://localhost:3001/${tmp}`, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: data.groupTo,
					userName: event.currentTarget.name
				}),
				credentials: "include"
			})
			await callBackBlock();
		}
	}
	function clickInvite() {
		setInvite(x => !x);
	}
	async function submitInvite() {
		// console.log(userInvite);
		if (userInvite.length) {
			const	res = await fetch("http://localhost:3001/inviteGroup", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						userName: userInvite,
						name: data.groupTo
					}),
				});
				const	Data = await res.json();
			if (Data) {
				setInvite(x => !x);
				setUserInvite("");
				data.socket?.emit(
					"addnotification",
					{reciever: userInvite, type: "groupInvite"}
				);
			}
			else {
				setError("wrongUser");
			}
		}
		else
			setError("emptyUser");
	}
	function changeInvite(event: React.ChangeEvent<HTMLInputElement>) {
		setUserInvite(event.target.value);
		setError("");
	}
	if (data.groupTo) {
		if (data.userData?.groups.find(x => x.name == data.groupTo))
			return (
				<form
					onSubmit={submitMessage}
					className="w-[57%] bg-discord4 flex flex-col
						justify-end text-discord6 p-0"
				>
					{
						settings &&
							<button
								className={
									`flex justify-center items-center font-extrabold
									${
										!invite ?
										"hover:text-green-500" :
										"hover:text-red-500"
									}`
								}
								onClick={clickInvite}
							>
								{ !invite ? <IconUserPlus /> : <IconX /> }
								{
									!invite ?
									<h1 className="mt-2" >invite</h1> :
									<h1>cancel</h1>
								}
							</button>
					}
					{
						invite &&
							<div className="flex" >
								<input
									type="text"
									className={
										`bg-discord1 border-none outline-none w-96
										h-10 p-5 text-white mr-0 rounded-l-full z-10
										${
											error.length == 0 ?
											"" :
											"outline-red-500"
										}`
									}
									placeholder="userName..."
									onKeyDown={(event) => {
										if (event.key == "Enter") {
											event.preventDefault();
											submitInvite();
										}
									}}
									onChange={changeInvite}
									value={userInvite}
								/>
								<button
									className="bg-discord1 w-10 h-10 flex
										justify-center items-center rounded-r-full hover:bg-discord3"
									onClick={submitInvite}
								>
									<IconUserPlus />
								</button>
							</div>
					}
					<ul className="max-h-90 overflow-auto flex flex-col-reverse">
						{settings ?
						users.map(x => {
							if(x.userName == data.userData?.userName)
								return;
							return (
								<li
									key={x.id}
									className="p-1"
								>
									<div
										className="flex items-center justify-between
											hover:bg-discord2 rounded-md"
									>
										<div className="flex items-center">
											<a
												href={`http://localhost:3000/UserProfile?name=${x.userName}`}
											>
												{
													x.avatar ?
														<img
															className="w-10 h-10
																rounded-full ml-5
																mr-2 my-2"
															src={x.avatar}
														/> :
														<IconUser
															className="w-10 h-10
															rounded-full ml-5
															mr-2 my-2 bg-discord1"
														/>

												}
											</a>
											<h1 className="font-extrabold" >
												{ x.userName }
											</h1>
											{
												x.role == "owner" ?
													<IconChessKingFilled /> :
													x.role == "member" ?
													<IconChessFilled /> :
													<IconChessBishopFilled />
											}
										</div>
										<div className="flex mr-5">
											{
												x.role != "owner" &&
												role != "member" &&
												<div className="flex">
													<button
														className="flex justify-center
															items-center
															font-extrabold
															hover:text-red-500
															group mx-2"
														onClick={clickAdmin}
														name={x.userName}
														value="groupKick"
													>
														<IconDoorExit />
														<h1
															className="mt-2 mr-5
																hidden
																group-hover:block"
														>
															kick
														</h1>
													</button>
													{
														data.
															userData?.
															groups.
															find(y => {
																return y.name ==
																	data.groupTo
															})?.banded?.find(y => {
																return y == x.userName
															}) == undefined ?
															<button
																className="flex
																	justify-center
																	items-center
																	font-extrabold
																	hover:text-red-500
																	group mx-2"
																onClick={clickAdmin}
																name={x.userName}
																value="addGroupBan"
															>
																<IconBan />
																<h1
																	className="mt-2
																		mr-5
																		hidden
																		group-hover:block"
																>
																	ban
																</h1>
															</button> :
															<button
																className="flex
																	justify-center
																	items-center
																	font-extrabold
																	hover:text-green-500
																	group mx-2"
																onClick={clickAdmin}
																name={x.userName}
																value="removeGroupBan"
															>
																<IconLockOpen />
																<h1
																	className="mt-2
																		mr-5
																		hidden
																		group-hover:block"
																>
																	unban
																</h1>
															</button>
													}
													{
														data.
														userData?.
														groups.
														find(y => {
															return y.name ==
																data.groupTo
														})?.muted.find(y => {
															return y == x.userName
														}) == undefined ?
															<button
																className="flex
																	justify-center
																	items-center
																	font-extrabold
																	hover:text-red-500
																	group mx-2"
																onClick={clickAdmin}
																name={x.userName}
																value="addGroupMute"
															>
																<IconVolume3 />
																<h1
																	className="mr-5
																		hidden
																		group-hover:block"
																>
																	mute
																</h1>
															</button> :
															<button
																className="flex
																	justify-center
																	items-center
																	font-extrabold
																	hover:text-green-500
																	group mx-2"
																onClick={clickAdmin}
																name={x.userName}
																value="removeGroupMute"
															>
																<IconVolume />
																<h1
																	className="mr-5
																		hidden
																		group-hover:block"
																>
																	unmute
																</h1>
															</button>
													}
													{
														x.role == "member" ?
														<button
															className="flex
																justify-center
																items-center
																font-extrabold
																hover:text-green-500
																group mx-2"
															onClick={clickAdmin}
															name={x.userName}
															value="addGroupAdmin"
														>
															<IconChessBishopFilled />
															<h1
																className="mr-5 hidden
																	group-hover:block"
															>
																admin
															</h1>
														</button> :
														<button
															className="flex
																justify-center
																items-center
																font-extrabold
																hover:text-red-500
																group mx-2"
															onClick={clickAdmin}
															name={x.userName}
															value="removeGroupAdmin"
														>
															<IconChessFilled />
															<h1
																className="mr-5 hidden
																	group-hover:block"
															>
																member
															</h1>
														</button>
													}
												</div>
											}
											{
												data.userData?.blocked.find(y => {
													return y.login == x.userName
												}) == undefined ?
												<button
													className="flex justify-center
														items-center font-extrabold
														hover:text-red-500 group
														mx-2"
													onClick={clickBlock}
													name={x.userName}
													value="block"
												>
													<IconTrash />
													<h1
														className="mt-2 hidden
															group-hover:block"
													>
														block
													</h1>
												</button> :
												<button
													className="flex justify-center
														items-center font-extrabold
														hover:text-green-500 group
														mx-2"
													onClick={clickBlock}
													name={x.userName}
													value="inblock"
												>
													<IconTrashOff/>
													<h1
														className="mt-2 mr-5 hidden
															group-hover:block"
													>
														unblock
													</h1>
												</button>	
											}
										</div>
									</div>
								</li>
							)
						}) :
						conversation.map(x => {
							return (
								<li
									key={x.id}
									className="flex hover:bg-discord3
										rounded-md m-2 p-3"
								>
									<a
										href={`http://localhost:3000/UserProfile?name=${x.sender}`}
									>
										{
											x.avatar ?
												<img
													src={x.avatar}
													className="h-12 w-12 rounded-full mr-3"
												/> :
												<IconUser
													className="h-12 w-12 rounded-full mr-3
														bg-discord1"
												/>
										}
									</a>
									<div className="w-[80%]">
										<div className="font-extrabold">{x.sender}</div>
										<div className="break-words">{x.message}</div>
									</div>
								</li>)
						})}
					</ul>
					<div className="flex m-2">
						<input
							type="text"
							placeholder={
								settings ?
								"Setting" :
								(data.userData?.groups.find(x => {
									return x.name == data.groupTo;
								})?.muted?.find(x => {
									return x == data.userData?.userName;
								}) == undefined ?
								"Message..." :
								"You are muted") }
							className={
								`bg-discord1 border-none outline-none w-full h-10
									rounded-md mr-2 p-5
									${( settings || data.userData?.groups.find(x => {
										return x.name == data.groupTo;
									})?.muted?.find(x => {
										return x == data.userData?.userName;
									}) != undefined ) && "cursor-not-allowed"}`
							}
							onChange={changeMessage}
							value={data.message}
							autoFocus
							ref={Reference}
							readOnly={settings || ( data.userData?.groups.find(x => {
								return x.name == data.groupTo;
							})?.muted?.find(x => {
								return x == data.userData?.userName;
							}) != undefined )}
						/>
						{
							data.message.length ?
								<button
									className="bg-discord1 w-10 h-10 rounded-md
										flex justify-center items-center"
									type="submit"
								>
									<IconSend2 />
								</button> :
								(
									<button
										className="bg-discord1 w-10 h-10 rounded-md
											flex justify-center items-center"
										type="button"
										onClick={clickSettings}
									>
										{!settings ? <IconSettings2 /> : <IconX />}
									</button>
								)
						}
					</div>
				</form>
			);
		else
			return (
				<div className="w-[57%] bg-discord4 flex flex-col justify-center
					items-center text-discord6 p-0 brightness-50">
					join to the group to access the chat room
					{
						data.password &&
							<div>
								{
									passwordError && (
										passwordText == "" ?
										<h6 className="text-red-500">
											you need to enter the password to get
												access to this group
										</h6> :
										<h6 className="text-red-500">
											password wrong! try again
										</h6>)
								}
								<div className="flex justify-center items-center">
									<input
										type={inputType}
										className={`bg-discord1 h-10 rounded-full
											p-5 m-5 outline-none ${passwordError && "outline-red-500"}`}
										placeholder="enter password..."
										value={passwordText}
										onChange={changePassword}
										onKeyDown={x => {
											if (x.key == "Enter")
												clickJoin();
										}}
									/>
									<button onClick={clickInputType}>
										{
											inputType == "password" ?
												<IconEye /> :
												<IconEyeOff />
										}
									</button>
								</div>
							</div>
					}
					<button
						className="bg-discord1 h-10 w-10 rounded-md
							hover:bg-discord5 m-5"
						onClick={clickJoin}
					>
						join
					</button>
				</div>
			)
	}
	return ;
}
export default ChatGroups;

