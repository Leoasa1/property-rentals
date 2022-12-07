import '@tomtom-international/web-sdk-maps/dist/maps.css';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
	return (
		<searchContextProvider>
			<Component {...pageProps} />
		</searchContextProvider>
	);
}

export default MyApp;
