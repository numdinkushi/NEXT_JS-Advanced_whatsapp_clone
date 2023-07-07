import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import {
	FaMicrophone,
	FaPauseCircle,
	FaPlay,
	FaStop,
	FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import {wavesurfer} from "wavesurfer.js";

function CaptureAudio({ hide }) {
	const [{ userInfo, currentChatUser, socket }] = useStateProvider();

	const [isRecording, setIsRecording] = useState(false);
	const [recordedAudio, setRecordedAudio] = useState(null);
	const [waveform, setWaveform] = useState(null);
	const [renderedAudio, setRenderedAudio] = useState(null);
	const [recordingDuration, setRecordingDuration] = useState(0);
	const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(0);

	const audioRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const waveformRef = useRef(null);

	useEffect(() => {
		const waveSurfer = wavesurfer.create({
		  container: waveformRef.current,
		  waveColor: "#ccc",
		  progressColor: "#4ae9ff",
		  cursorColor: "#7ae3c3",
		  barWidth: 2,
		  height: 30,
		  responsive: true
		})
		  setWaveform(waveSurfer);
		  waveSurfer.on("finish", ()=>{
		    setIsPlaying(false);
		  });
		  return () => {
		    waveSurfer.destroy();
		  }
	}, []);

	useEffect(() => {
		let interval = [];
		if (isRecording) {
			interval = setInterval(() => {
				setRecordingDuration((prevDuration) => {
					setTotalDuration(prevDuration + 1);
					return prevDuration + 1;
				});
			}, 1000);
		}
	}, []);

	useEffect(() => {
		if (waveform) {
			handleStartRecording();
		}
	}, []);

	const handleStartRecording = () => {
		setRecordingDuration(0);
		setCurrentPlayBackTime(0);
		setTotalDuration(0);
		setIsRecording(true);
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				const mediaRecorder = new MediaRecorder(stream);
				mediaRecorderRef.current = mediaRecorder;
				audioRef.current = stream;

				const chunks = [];
				mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

				mediaRecorder.onstop = () => {
					const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
					const audioURL = URL.createObjectURL(blob);
					const audio = new Audio(audioURL);
					setRecordedAudio(audio);

					waveform.load(audioURL);
				};
				mediaRecorder.start();
			})
			.catch((error) => {
				console.log("Error accessing microphone:", error);
			});
	};

	const handleStopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			waveform.stop();

			const audioChunks = [];
			mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
				audioChunks.push(event.data);
			});

      mediaRecorderRef.current.addEventListener("stop", ()=>{
        const audioBlob = new Blob(audioChunks, {type: "audio/mp3"})
        const audioFile = new File([audioBlob], "recording.mp3")
        setRenderedAudio(audioFile);
      })
		}
	};

  useEffect(() => {
   if(recordedAudio){
    const updatePlaybackTime = () => {
      setCurrentPlayBackTime(recordedAudio.currentTime);
      
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      }
    }
   }
  }, [])
  
	const handlePlayRecording = () => {
    if(recordedAudio){
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

	const handlePauseRecording = () => {
    waveform.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };

	const sendRecording = async () => {

  };

	const formatTime = (time) => {
		if (isNaN(time)) return "0:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes.toString().padStart(2, "0")} : ${seconds
			.toString()
			.padStart(2, "0")} `;
	};
	return (
		<div className="text-2xl flex w-full justify-end items-center">
			<div className="pt1">
				<FaTrash
					className="text-panel-header-icon cursor-pointer"
					onClick={() => hide()}
				/>
			</div>
			<div className="mx-4 py2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
				{isRecording ? (
					<div className="text-red-500 animate-pulse 2-60 text-center">
						Recording <span>{recordingDuration}s</span>
					</div>
				) : (
					<div className="">
						{recordedAudio && (
							<>
								{!isPlaying ? (
									<FaPlay onClick={handlePlayRecording} />
								) : (
									<FaStop onClick={handlePauseRecording} />
								)}
							</>
						)}
					</div>
				)}
				<div className="w-60 h-9" ref={waveformRef} hidden={isRecording} />
				{recordedAudio && isPlaying && (
					<span>{formatTime(currentPlayBackTime)}</span>
				)}
				{recordedAudio && !isPlaying && (
					<span>{formatTime(totalDuration)}</span>
				)}
				<audio src="" ref={audioRef} hidden />
				<div className="mr-4">
					{!isRecording ? (
						<FaMicrophone
							className="text-red-500"
							onClick={handleStartRecording}
						/>
					) : (
						<FaPauseCircle
							className="text-red-500"
							onClick={handleStopRecording}
						/>
					)}
				</div>
				<div>
					<MdSend
						className="text-panel-header-icon cursor-pointer mr-4"
						title="send"
						onClick={sendRecording}
					/>
				</div>
			</div>
		</div>
	);
}

export default CaptureAudio;
