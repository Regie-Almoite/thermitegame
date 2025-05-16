import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "motion/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitch, faKickstarterK } from "@fortawesome/free-brands-svg-icons";

import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import "./App.css";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
	width: 62,
	height: 34,
	padding: 7,
	"& .MuiSwitch-switchBase": {
		margin: 1,
		padding: 0,
		transform: "translateX(6px)",
		"&.Mui-checked": {
			color: "#fff",
			transform: "translateX(22px)",
			"& .MuiSwitch-thumb:before": {
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
					"#fff"
				)}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
			},
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#aab4be",
				...theme.applyStyles("dark", {
					backgroundColor: "#8796A5",
				}),
			},
		},
	},
	"& .MuiSwitch-thumb": {
		backgroundColor: "#001e3c",
		width: 32,
		height: 32,
		"&::before": {
			content: "''",
			position: "absolute",
			width: "100%",
			height: "100%",
			left: 0,
			top: 0,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
				"#fff"
			)}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
		},
		...theme.applyStyles("dark", {
			backgroundColor: "#003892",
		}),
	},
	"& .MuiSwitch-track": {
		opacity: 1,
		backgroundColor: "#aab4be",
		borderRadius: 20 / 2,
		...theme.applyStyles("dark", {
			backgroundColor: "#8796A5",
		}),
	},
}));

const LETTERS = "ASDFHJKL".split("");
const COLORS = ["orange", "violet", "green"];
const SPEED = 1000;
const INTERVAL = 800;

const LINE_COLOR_CLASSES = {
	orange: "bg-orange-500",
	violet: "bg-violet-500",
	green: "bg-green-500",
};
const TEXT_COLOR_CLASSES = {
	orange: "text-orange-500",
	violet: "text-violet-500",
	green: "text-green-500",
};

const THEME = {
	dark: "bg-stone-950",
	light: "bg-white",
};

function getRandomLetter() {
	return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}
function getRandomColor() {
	return COLORS[Math.floor(Math.random() * COLORS.length)];
}
function getRandomPosition() {
	return Math.floor(Math.random() * 95);
}

function App() {
	const [letters, setLetters] = useState([]);
	const [lineColor, setLineColor] = useState(
		COLORS[Math.floor(Math.random() * COLORS.length)]
	);
	const [points, setPoints] = useState(0);
	const [gameStarted, setGameStarted] = useState(false);
	const [theme, setTheme] = useState("dark");

	const CONTAINER_HEIGHT = window.innerHeight;
	const TEXT_COLOR = theme === "dark" ? "text-white" : "text-black";

	useEffect(() => {
		if (!gameStarted) return;
		const interval = setInterval(() => {
			setLetters((prev) =>
				prev
					.map((l) => ({
						...l,
						bottom:
							(l.bottom ?? 0) +
							(CONTAINER_HEIGHT - 50 - 30) / (SPEED / 50),
					}))
					.filter((l) => l.bottom < CONTAINER_HEIGHT - 50)
			);
		}, 50);
		return () => clearInterval(interval);
	}, [gameStarted]);

	useEffect(() => {
		if (!gameStarted) return;
		const interval = setInterval(() => {
			const newLetter = {
				letter: getRandomLetter(),
				color: getRandomColor(),
				positionX: getRandomPosition(),
				bottom: 20,
				id: Math.random().toString(36).substring(2, 15),
			};
			setLetters((prev) => [...prev, newLetter]);
		}, INTERVAL);

		return () => clearInterval(interval);
	}, [gameStarted]);

	function touches(a, b) {
		var aRect = a.getBoundingClientRect();
		var bRect = b.getBoundingClientRect();

		return !(
			aRect.top + aRect.height < bRect.top ||
			aRect.top > bRect.top + bRect.height ||
			aRect.left + aRect.width < bRect.left ||
			aRect.left > bRect.left + bRect.width
		);
	}

	useEffect(() => {
		if (!gameStarted) return;
		const handleKeyDown = (e) => {
			if (letters.length === 0) return;
			const key = e.key.toUpperCase();

			const firstLetter = document.querySelector(
				`#letters-${letters[0].id}`
			);
			const line = document.querySelector("#line");
			if (!firstLetter || !line) return;

			const isTouching = touches(firstLetter, line);

			console.log(isTouching);

			// const linePosition = line.getBoundingClientRect();
			// const firstLetterPosition = firstLetter.getBoundingClientRect();

			// const isTouching =
			// 	Math.abs(firstLetterPosition.bottom - linePosition.top) <= 1 ||
			// 	Math.abs(firstLetterPosition.top - linePosition.bottom) <= 1;

			// console.log(firstLetterPosition, linePosition);
			// (firstLetterPosition.bottom >= linePosition.bottom &&
			// 	firstLetterPosition.bottom <= linePosition.top) ||
			// (firstLetterPosition.top > linePosition.top &&
			// 	firstLetterPosition.bottom < linePosition.bottom);

			const isCorrectKey = firstLetter.textContent === key;
			const isCorrectColor =
				isTouching && firstLetter.className.includes(lineColor);

			if (isCorrectKey && isTouching && isCorrectColor) {
				setPoints((prev) => prev + 1);
				setLineColor(getRandomColor());
				setLetters((prev) =>
					prev.filter((l) => l.id !== letters[0].id)
				);
			} else {
				setPoints((prev) => prev - 1);
				setGameStarted(false);
				setPoints(0);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [letters, lineColor, gameStarted]);

	const handleStart = () => {
		setPoints(0);
		setLetters([]);
		setLineColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
		setGameStarted(true);
	};

	return (
		<div
			className={`dark h-screen w-full ${THEME[theme]} relative ${TEXT_COLOR}`}
		>
			<div className="absolute top-2 right-2">
				<FormControlLabel
					control={<MaterialUISwitch sx={{ m: 1 }} />}
					label="MUI switch"
					checked={theme === "dark"}
					onChange={(e) => {
						if (e.target.checked) {
							setTheme("dark");
						} else {
							setTheme("light");
						}
					}}
				/>
			</div>
			<div
				id="line"
				className={`w-full h-[50px] ${LINE_COLOR_CLASSES[lineColor]} absolute top-30`}
			></div>
			<div className="absolute top-2 left-2 text-xl">Score: {points}</div>
			{!gameStarted && (
				<div className="flex items-center justify-center h-full">
					<button
						onClick={handleStart}
						className="bg-green-600 px-8 py-4 rounded-lg text-2xl font-bold shadow-lg hover:bg-green-700 transition"
					>
						Start Game
					</button>
				</div>
			)}
			<AnimatePresence>
				{gameStarted &&
					letters.map(({ letter, color, positionX, id, bottom }) => (
						<motion.div
							key={id}
							id={`letters-${id}`}
							className={`${TEXT_COLOR_CLASSES[color]} text-[80px] font-bold absolute cursor-pointer`}
							style={{
								left: `${positionX}%`,
								bottom: bottom ?? 0,
							}}
							initial={false}
							animate={{ bottom: bottom ?? 0 }}
							exit={{
								opacity: 0,
								scale: 0.5,
								transition: { duration: 0.3 },
							}}
							transition={{ duration: 0.05, ease: "linear" }}
						>
							{letter}
						</motion.div>
					))}
			</AnimatePresence>
			<div
				className={`w-full absolute bottom-0 text-center flex flex-col gap-2 border-t border-gray-700 `}
			>
				<div className="flex justify-center items-center gap-2">
					<div>
						<a
							className="hover:underline"
							href="https://www.twitch.tv/devbydaylight"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FontAwesomeIcon
								icon={faTwitch}
								className="text-violet-500 "
							/>
							&nbsp;https://www.twitch.tv/devbydaylight
						</a>
					</div>
					<div>
						<a
							className="hover:underline"
							href="https://kick.com/devbydaylight"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FontAwesomeIcon
								icon={faKickstarterK}
								className="text-green-400"
							/>
							&nbsp;https://kick.com/devbydaylight
						</a>
					</div>
				</div>
				<div>Copyright©2025</div>
			</div>
		</div>
	);
}

export default App;
