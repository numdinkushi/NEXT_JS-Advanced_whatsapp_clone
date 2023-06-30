import React, { useEffect, useRef } from "react";

function ContextMenu({ options, cordinates, contextMenu, setContextMenu }) {
	const contextMeuRef = useRef(null);
	const handleClick = (e, callback) => {
		e.stopPropagation();
		callback();
		setContextMenu(false);
	};

	useEffect(() => {
		const handleOutsideClick = (event) => {
      console.log(event.target)
			if (event.target.id !== "context-opener") {
				if (
					contextMeuRef.current &&
					!contextMeuRef.current.contains(event.target)
				) {
					setContextMenu(false);
				}
			}
		};
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	return (
		<div
			className={`bg-dropdown-background fixed py-2 z-[100] shadow-xl`}
			ref={contextMeuRef}
			style={{
				top: cordinates.y,
				left: cordinates.x,
			}}
		>
			<ul>
				{options.map(({ name, callback }) => {
					return (
						<li
							key={name}
							className="px-5 py-3 cursor-pointer hover:bg-background-default-hover"
							onClick={(e) => handleClick(e, callback)}
						>
							<span className="text-white">{name}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default ContextMenu;
