import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<title>Whatsapp</title>
				<link rel="icon" href="/favicon.png" />
			</Head>
			<body className="h-screen overflow-y-hidden">
				<Main />
				<NextScript />
				<div id="photo-picker-element"></div>
			</body>
		</Html>
	);
}
