'use client'
import { useEffect, useRef, useState } from 'react'

const speeds = [0.8, 1.0, 1.1, 1.25, 1.5, 2]
function secondsToMMSS(duration: number) {
	if (Number.isNaN(duration)) {
		return '00:00'
	}
	const minutes = Math.floor(duration / 60)
	const seconds = Math.round(duration - minutes * 60)
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function getDuration(audio: HTMLAudioElement) {
	if (audio.duration && isFinite(audio.duration)) {
		return audio.duration
	}
	return null
}

export function AudioPlayer({ slug, defaultTime }: { slug: string; defaultTime?: number }) {
	const [isPlaying, setPlaying] = useState(false)
	const [isStreaming, setIsStreaming] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [duration, setDuration] = useState(defaultTime ?? 0)
	const [currentTime, setCurrentTime] = useState(0)
	const [playbackSpeed, setPlaybackSpeed] = useState(speeds.indexOf(1))
	const audioRef = useRef<HTMLAudioElement>(null)
	const progressRef = useRef<HTMLProgressElement>(null)

	useEffect(() => {
		if (!audioRef.current) return
		const duration = getDuration(audioRef.current)
		if (duration) {
			setDuration(duration)
		}
		audioRef.current.addEventListener('loadstart', () => setIsLoading(true))
		audioRef.current.addEventListener('canplay', () => setIsLoading(false))
		audioRef.current.addEventListener('progress', () => setIsLoading(false))
		audioRef.current.addEventListener('pause', () => setPlaying(false))
		audioRef.current.addEventListener('play', () => setPlaying(true))
	}, [])

	function play() {
		audioRef.current?.play()
		setPlaying(true)
		if (audioRef.current?.duration == Infinity) {
			setIsStreaming(true)
		}
	}

	function pause() {
		audioRef.current?.pause()
		setPlaying(false)
	}

	function rewind() {
		if (audioRef.current) {
			audioRef.current.currentTime -= 15
		}
	}

	function setSpeed(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.currentTarget.focus()
		if (audioRef.current) {
			let index = playbackSpeed + 1 < speeds.length ? playbackSpeed + 1 : 0
			audioRef.current.playbackRate = speeds[index] ?? 1
			setPlaybackSpeed(index)
		}
	}

	function setProgress(e: React.MouseEvent<HTMLProgressElement, MouseEvent>) {
		if (audioRef.current) {
			audioRef.current.currentTime =
				Math.floor(audioRef.current.duration) *
				(e.nativeEvent.offsetX / e.currentTarget.offsetWidth)
		}
	}

	const PlayIcon = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="18"
			width="18"
			viewBox="1 0 24 24"
			fill="currentColor"
		>
			<path d="M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z"></path>
		</svg>
	)
	const PauseIcon = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="18"
			width="18"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<path d="M6 5H8V19H6V5ZM16 5H18V19H16V5Z"></path>
		</svg>
	)
	const Spinner = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="18"
			width="18"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<path d="M12 2C12.5523 2 13 2.44772 13 3V6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6V3C11 2.44772 11.4477 2 12 2ZM12 17C12.5523 17 13 17.4477 13 18V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V18C11 17.4477 11.4477 17 12 17ZM22 12C22 12.5523 21.5523 13 21 13H18C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11H21C21.5523 11 22 11.4477 22 12ZM7 12C7 12.5523 6.55228 13 6 13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11H6C6.55228 11 7 11.4477 7 12ZM19.0711 19.0711C18.6805 19.4616 18.0474 19.4616 17.6569 19.0711L15.5355 16.9497C15.145 16.5592 15.145 15.9261 15.5355 15.5355C15.9261 15.145 16.5592 15.145 16.9497 15.5355L19.0711 17.6569C19.4616 18.0474 19.4616 18.6805 19.0711 19.0711ZM8.46447 8.46447C8.07394 8.85499 7.44078 8.85499 7.05025 8.46447L4.92893 6.34315C4.53841 5.95262 4.53841 5.31946 4.92893 4.92893C5.31946 4.53841 5.95262 4.53841 6.34315 4.92893L8.46447 7.05025C8.85499 7.44078 8.85499 8.07394 8.46447 8.46447ZM4.92893 19.0711C4.53841 18.6805 4.53841 18.0474 4.92893 17.6569L7.05025 15.5355C7.44078 15.145 8.07394 15.145 8.46447 15.5355C8.85499 15.9261 8.85499 16.5592 8.46447 16.9497L6.34315 19.0711C5.95262 19.4616 5.31946 19.4616 4.92893 19.0711ZM15.5355 8.46447C15.145 8.07394 15.145 7.44078 15.5355 7.05025L17.6569 4.92893C18.0474 4.53841 18.6805 4.53841 19.0711 4.92893C19.4616 5.31946 19.4616 5.95262 19.0711 6.34315L16.9497 8.46447C16.5592 8.85499 15.9261 8.85499 15.5355 8.46447Z"></path>
		</svg>
	)

	return (
		<div className="accent-yellow-100 dark:accent-yellow-600 select-none">
			<div className="rounded-px bg-black text-gray-100 dark:bg-black dark dark:text-white text-sm overflow-hidden p-2 box-border flex flex-col">
				<div className="w-full flex gap-1.5 items-center mb-2">
					<progress
						onClick={setProgress}
						ref={progressRef}
						className="cursor-col-resize grow appearance-none h-6 md:h-3"
						value={currentTime + 1}
						max={duration}
					/>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<button
						aria-label={isLoading ? 'Loading' : isPlaying ? 'Pause' : 'Play'}
						disabled={isLoading}
						onClick={isPlaying ? pause : play}
						className="bg-gray-600/70 hover:brightness-110 transition-all duration-200 active:opacity-90 rounded-px p-2 leading-6 appearance-none focus:outline-hidden md:focus:ring-1 focus:ring-yellow-300/40 focus:ring-inset"
					>
						{isLoading ? Spinner : isPlaying ? PauseIcon : PlayIcon}
					</button>
					<button
						aria-label="15 Sekunden zurückspulen"
						id="rewind"
						onClick={rewind}
						className="bg-gray-600/70 hover:brightness-110 transition-all duration-200 active:opacity-90 rounded-px p-2 leading-6 appearance-none focus:outline-hidden md:focus:ring-1 focus:ring-yellow-300/40 focus:ring-inset"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="18"
							width="18"
							viewBox="-1 -1 26 26"
							fill="currentColor"
						>
							<path d="M12 2C17.5228 2 22 6.47715 22 12 22 17.5228 17.5228 22 12 22 6.47715 22 2 17.5228 2 12H4C4 16.4183 7.58172 20 12 20 16.4183 20 20 16.4183 20 12 20 7.58172 16.4183 4 12 4 9.25022 4 6.82447 5.38734 5.38451 7.50024L8 7.5V9.5H2V3.5H4L3.99989 5.99918C5.82434 3.57075 8.72873 2 12 2ZM8.5 15.5V8.5H10V15.5H8.5ZM12 8.5H16.75V10H13.5V11.25H14.875C16.0486 11.25 17 12.2014 17 13.375 17 14.5486 16.0486 15.5 14.875 15.5H12V14H14.875C15.2202 14 15.5 13.7202 15.5 13.375 15.5 13.0298 15.2202 12.75 14.875 12.75H12V8.5Z"></path>
						</svg>
					</button>

					<div className="font-mono flex gap-1 px-1 tracking-wide grow text-left">
						{secondsToMMSS(currentTime)} {!isStreaming && <> / {secondsToMMSS(duration ?? 0)} </>}
					</div>

					<button
						aria-hidden
						className="md:hidden opacity-80 p-2 items-center"
						onClick={() => alert('Transparenzhinweis: Audioinhalt wurde künstlich generiert.')}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="14"
							width="14"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
						</svg>
					</button>
					<div className="hidden md:flex opacity-50 hover:opacity-65 text-yellow-50 transition-opacity duration-500 tracking-wide p-2 appearance-none items-center gap-2 hover:cursor-default">
						<svg
							aria-hidden
							xmlns="http://www.w3.org/2000/svg"
							height="14"
							width="14"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
						</svg>
						<span className="font-light text-xs group-hover:block leading-none">
							Audioinhalt wurde künstlich generiert
						</span>
					</div>
					<button
						id="speed"
						onClick={setSpeed}
						className="bg-gray-600/70 hover:brightness-110 transition-all duration-200 active:opacity-90 h-[34px] w-14 text-center rounded-px px-2 appearance-none focus:outline-hidden md:focus:ring-1 focus:ring-yellow-300/40 focus:ring-inset"
					>
						{speeds[playbackSpeed]}x
					</button>
				</div>
			</div>
			<audio
				ref={audioRef}
				preload="metadata"
				onLoadedMetadata={() => {
					const duration = getDuration(audioRef.current!)
					if (duration) {
						setDuration(duration)
					}
				}}
				//src={`https://assets.apologetik-projekt.de/audio/${slug}.mp3`}
				onTimeUpdate={() => {
					setCurrentTime(audioRef.current?.currentTime ?? 0)
				}}
			/>
		</div>
	)
}
