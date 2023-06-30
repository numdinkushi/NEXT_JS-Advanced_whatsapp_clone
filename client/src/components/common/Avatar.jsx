import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";

function Avatar({ type, image, setImage }) {
	const [hover, setHover] = useState(false);
	const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
	const [grabPhoto, setGrabPhoto] = useState(false);
	const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
	const [contextMenuCordinates, setContextMenuCordinates] = useState({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		if (grabPhoto) {
			const data = document.getElementById("photo-picker");
			data.click();
			document.body.onfocus = (e) => {
				setGrabPhoto(false);
			};
		}
	}, [grabPhoto]);

	const showContextMenu = (e) => {
		e.preventDefault();
		setContextMenuCordinates({ x: e.pageX, y: e.pageY });
		setIsContextMenuVisible(true);
	};

	const contextMenuOptions = [
		{
			name: "Take photo",
			callback: () => {},
		},
		{
			name: "Choose from library",
			callback: () => {
				setShowPhotoLibrary(true);
			},
		},
		{
			name: "Upload photo",
			callback: () => {
				setGrabPhoto(true);
			},
		},
		{
			name: "Remove photo",
			callback: () => {
				setImage("/default_avatar.png");
			},
		},
	];

	const photoPickerChange = async (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		const data = document.createElement("img");

		reader.onload = function (event) {
			data.src = event.target.result;
			data.setAttribute("src", event.target.result);
		};

		reader.readAsDataURL(file);

		setTimeout(() => {
			setImage(data.src);
		}, 100);
	};

	return (
		<>
			<div className="flex items-center justify-center">
				{type === "sm" && (
					<div className="relative h-10 w-10">
						<Image src={image} alt="avatar" className="rounded-full" fill />
					</div>
				)}
				{type === "lg" && (
					<div className="relative h-14 w-14">
						<Image src={image} alt="avatar" className="rounded-full" fill />
					</div>
				)}
				{type === "xl" && (
					<div
						className="relative cursor-pointer z-0"
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
					>
						<div
							className={`bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center z-10 gap-2 
              ${hover ? "visible" : "hidden"}`}
							id="context-opener"
							onClick={(e) => showContextMenu(e)}
						>
							<FaCamera
								className="text-2xl"
								onClick={(e) => showContextMenu(e)}
							/>
							<span onClick={(e) => showContextMenu(e)}>
								Change profile photo
							</span>
						</div>
						<div className="h-60 w-60">
							<Image
								src={image}
								alt="avatar"
								className="rounded-full"
								fill
								onClick={(e) => showContextMenu(e)}
							/>
						</div>
					</div>
				)}
			</div>
			{isContextMenuVisible && (
				<ContextMenu
					options={contextMenuOptions}
					cordinates={contextMenuCordinates}
					contextMenu={isContextMenuVisible}
					setContextMenu={setIsContextMenuVisible}
				/>
			)}
			{showPhotoLibrary && (
				<PhotoLibrary
					setImage={setImage}
					hidePhotoLibrary={setShowPhotoLibrary}
				/>
			)}
			{grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
		</>
	);
}

export default Avatar;
