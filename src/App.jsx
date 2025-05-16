import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./App.css";

const LETTERS = "ASDFHJKL".split("");
const COLORS = ["orange", "violet", "green"];
const SPEED = 1500;
const INTERVAL = 1000;
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

	const CONTAINER_HEIGHT = window.innerHeight;

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
				bottom: 0,
				id: Math.random().toString(36).substring(2, 15),
			};
			setLetters((prev) => [...prev, newLetter]);
		}, INTERVAL);

		return () => clearInterval(interval);
	}, [gameStarted]);

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

			const linePosition = line.getBoundingClientRect();
			const firstLetterPosition = firstLetter.getBoundingClientRect();

			const isTouching =
				firstLetterPosition.bottom >= linePosition.top &&
				firstLetterPosition.top <= linePosition.bottom;

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
		<div className="dark h-screen w-full bg-stone-950 relative">
			<div
				id="line"
				className={`w-full h-[30px] ${LINE_COLOR_CLASSES[lineColor]} absolute top-20`}
			></div>
			<div className="absolute top-2 left-2 text-white text-xl">
				Score: {points}
			</div>
			{!gameStarted && (
				<div className="flex items-center justify-center h-full">
					<button
						onClick={handleStart}
						className="bg-green-600 text-white px-8 py-4 rounded-lg text-2xl font-bold shadow-lg hover:bg-green-700 transition"
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
							className={`${TEXT_COLOR_CLASSES[color]} text-[50px] font-bold absolute cursor-pointer`}
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
		</div>
	);
}

export default App;
