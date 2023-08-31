import React from 'react';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Layout from '../../../components/Layout';
import { TOMTOM_URL } from '../../../components/Config';
import Axios from 'axios';
import ScaleLoader from 'react-spinners/ScaleLoader';

const Index = () => {
	const [loading, setLoading] = useState(true);
	// global object inside the function for storing property object values such as address and photos etc..
	const [propValue, setPropValue] = useState({
		property_id: '',
		address: {},
		description: {},
		photos: {},
		lead_forms: {},
		web_url: '',
		agent: '',
		price: ''
	});

	// window is loaded get properties from local storage and turn string to json format
	const GET_PROP_ID =
			(typeof window) !== 'undefined'
				? JSON.parse(localStorage.getItem('prop-ID'))
				: null;

	// reference variable for storing map
	// returns an object with a single property
	const MAP_ELEMENT = useRef();
	const [mapLongitude, setMapLongitude] = useState(0);
	const [mapLatitude, setMapLatitude] = useState(0);

	// function to get the properties from local storage
	const GET_PROPERTY = async () => {

		const options = {
			method: 'GET',
			url: 'https://realty-in-us.p.rapidapi.com/properties/v3/detail',
			params: {
			  property_id: `${GET_PROP_ID}`
			},
			headers: {
			  'X-RapidAPI-Key': 'f18ead9437msh45f6b71c727a09cp1cf3d8jsn879b63b363cc',
			  'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com'
			}
		};
		  
		try {
			const response = await Axios.request(options);
			const propDetails = response.data.data.home;
					
			// get lat and lon of the property andress and assign it to const variables
			setMapLatitude(Number(propDetails.location.address.coordinate.lat));
			setMapLongitude(Number(propDetails.location.address.coordinate.lon));

			// assign values from propDetails variable to propValue state object
			setPropValue({
				property_id: propDetails.property_id,
				web_url: propDetails.href,
				address: propDetails.location.address,
				description: propDetails.description,
				lead_forms: propDetails.lead_forms,
				agent: propDetails.advertisers[0],
				photos: propDetails.photos,
				price: propDetails.list_price
			});
			setLoading(false);
		} catch (error) {
			console.log(error.response);
		}
	};

	// function for creating the map with markers for resturant locations
	const GET_MAP = async () => {
		// if lat not zero and window loaded, create map
		if (mapLatitude !== 0 && typeof window !== 'undefined') {
			// using dynamic import for tomtom map library
			const tt = await import('@tomtom-international/web-sdk-maps');
			// creating map with lat and lon coordinates from the useState variables and zoom value
			const map = tt.map({
				key: `${TOMTOM_URL}`,
				container: MAP_ELEMENT.current,
				center: [mapLongitude, mapLatitude],
				zoom: '15',
			});

			// async function for creating markers for resturant locations
			const GET_POPUP = async () => {
				// using dynamic import for tomtom services library
				const ttt = await import(
					'@tomtom-international/web-sdk-services'
				);
				// using fuzzySearch API to find resturants near the property location
				const response = await ttt.services
					.fuzzySearch({
						key: `${TOMTOM_URL}`,
						query: 'resturant',
						center: [mapLongitude, mapLatitude],
						radius: '8800',
					})
					.then();

				// for each result create a pop up and assign resturant name
				return response.results.forEach((result) => {
					const popup = new tt.Popup({ offset: 30 }).setText(
						result.poi.name
					);
					// for each resturant location create marker pointing to the resturant
					new tt.Marker({ color: '#ff3300' })
						.setLngLat(result.position)
						.setPopup(popup)
						.addTo(map);
				});
			};

			GET_POPUP();
		}
		return () => map.remove();
	};

	// useEffect function for calling the GET_PROPery and GET_MAP functions when the page loads
	// call the function each time the lat and long variables get updated to update the map
	useEffect(() => {
		GET_PROPERTY();
		GET_MAP();
	}, [mapLatitude, mapLongitude]);

	// get url from propValue photos and update the link from small to large image size url
	const URL = Object.values(propValue.photos).map((e) => {
		const HREF = e.href.split('.jpg');
		return HREF.join('') + 'od.jpg';
	});

	// destructure propValue object
	const { web_url, address, description, agent, price } = propValue;

	return (
		//body
		<Layout>
			<div className='container mx-auto flex flex-col justify-center'>
				{loading ? (
					<div className='text-center mt-80'>
						<div className='text-lg font-bold mb-5'>Loading</div>
						<ScaleLoader
							className='mx-auto'
							color='#000000'
							loading={loading}
							size={80}
							aria-label='Loading Spinner'
							data-testid='loader'
						/>
					</div>
				) : (
					<div className='container mx-auto h-max p-4 border-black'>
						{/*top container*/}
						<div className='flex justify-center mt-2'>
							<div className='grid lg:grid-cols-2 justify-items-center gap-2 w-full lg:w-auto p-4'>
								{/*Image container*/}

								{/*Image holder*/}
								<Image
									loader={() => URL[0]}
									unoptimized={true}
									width={200}
									height={150}
									alt='Property View'
									src={URL[0] ? URL[0] : '/images/placeholder.jpeg'}
									className='bg-gray-50 w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
								/>

								{/*Name, Price, Location and Specs*/}
								<section className='flex flex-col justify-between w-full h-full'>
									<div>
										<h1 className='font-bold text-4xl playfair'>
											{price
												? `$ ${price}`
												: 'Contact for Price'}
										</h1>
										<div className='text-xl'>
											<p>
												{address.line}, {address.city},{' '}
												{address.state_code}
											</p>
										</div>
										<div className='text-md mt-4'>
											<span>
												{description ? description.beds : '?'}{' '}
												Beds
											</span>
											<br />
											<span>
												{description ? description.baths : '?'}{' '}
												baths
											</span>
											<br />
											<span>
												{description ? description.sqft : '?'}{' '}
												Sqft
											</span>
										</div>
									</div>

									{/*Buttons container*/}
									<div className='flex flex-col mt-5 lg:mt-0 md:flex-row gap-4 w-full md:justify-start'>
										{/*Buttons*/}
										<a
											href={web_url}
											className='btn w-full md:w-56 lg:w-40 text-xs'
											target='_blank'
											rel='noreferrer'
										>
											{' '}
											More Info{' '}
										</a>
										{agent.phones ? 
											<a
												href={
													agent
														? `tel:+${agent.phones[0].number}`
														: 'rentals/rental-item'
												}
												className='btn w-full md:w-56 lg:w-40 text-xs'
											>
												{agent.phones[0].number}
											</a>
											: <></>
										}
									</div>
								</section>
							</div>
						</div>{' '}
						{/*Gallery container*/}
						<div className='mt-10 p-4'>
							{/*Gallery Header*/}
							<h1 className='p-1 font-bold text-xl text-center playfair border-b border-black w-56 mx-auto'>
								Gallery
							</h1>

							{/*Gallery Part. set up block's w and h*/}
							<div className='grid lg:grid-cols-2 gap-2 mx-auto my-2.5 w-full lg:w-max '>
								{/*Gallery Image Place Holders*/}
								<Image
									loader={() => URL}
									unoptimized={true}
									width={200}
									height={150}
									alt='Property View'
									src={URL[1] ? URL[1] : '/images/placeholder.jpeg'}
									className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
								/>

								<Image
									loader={() => URL}
									unoptimized={true}
									width={200}
									height={150}
									alt='Property View'
									src={URL[2] ? URL[2] : '/images/placeholder.jpeg'}
									className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
								/>

								<Image
									loader={() => URL}
									unoptimized={true}
									width={200}
									height={150}
									alt='Property View'
									src={URL[3] ? URL[3] : '/images/placeholder.jpeg'}
									className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
								/>

								<Image
									loader={() => URL}
									unoptimized={true}
									width={200}
									height={150}
									alt='Property View'
									src={URL[4] ? URL[4] : '/images/placeholder.jpeg'}
									className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
								/>
							</div>
						</div>
						{/*Map container*/}
						<div className='mt-10 p-4'>
							{/*Map Header*/}
							<h1 className='p-1 font-bold text-xl text-center playfair border-b border-black w-56 mx-auto'>
								Near By Resturants
							</h1>
							<div className='mt-3 h-80 border-2 mx-auto'>
								<div ref={MAP_ELEMENT} className='map' />
							</div>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
};

export default Index;
