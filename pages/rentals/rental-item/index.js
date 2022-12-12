import React from 'react';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Layout from '../../../components/layout/Layout';
import { TOMTOM_URL } from '../../../components/config';

const Index = () => {
	// global object inside the function for storing property object values such as address and photos etc..
	const [propValue, setPropValue] = useState({
		property_id: '',
		address: {},
		community: {},
		photos: {},
		lead_forms: {},
		rdc_web_url: '',
	});

	// reference variable for storing map
	// returns an object with a single property
	const mapElement = useRef();
	const [mapLongitude, setMapLongitude] = useState(0);
	const [mapLatitude, setMapLatitude] = useState(0);

	// function to get the properties from local storage
	const getProperty = async () => {
		// window is loaded get properties from local storage and turn string to json format
		const getPropArray =
			(await typeof window) !== 'undefined'
				? JSON.parse(localStorage.getItem('properties'))
				: null;

		// use the selected id from local storage to get one property information using find method
		const getProp = getPropArray.find(
			(items) => items.property_id == localStorage.getItem('prop-ID')
		);

		// get lat and lon of the property andress and assign it to const variables
		setMapLatitude(Number(getProp.address.lat));
		setMapLongitude(Number(getProp.address.lon));

		// assign values from getProp variable to propValue state object
		setPropValue({
			property_id: getProp.property_id,
			rdc_web_url: getProp.rdc_web_url,
			address: getProp.address,
			community: getProp.community,
			photos: getProp.photos,
			lead_forms: getProp.lead_forms,
		});
	};

	// function for creating the map with markers for resturant locations
	const getMap = async () => {
		// if lat not zero and window loaded, create map
		if (mapLatitude !== 0 && typeof window !== 'undefined') {
			// using dynamic import for tomtom map library
			const tt = await import('@tomtom-international/web-sdk-maps');
			// creating map with lat and lon coordinates from the useState variables and zoom value
			const map = tt.map({
				key: `${TOMTOM_URL}`,
				container: mapElement.current,
				center: [mapLongitude, mapLatitude],
				zoom: '15',
			});

			// async function for creating markers for resturant locations
			const gett = async () => {
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

			gett();
		}
		return () => map.remove();
	};

	// useEffect function for calling the getPropery and getMap functions when the page loads
	// call the function each time the lat and long variables get updated to update the map
	useEffect(() => {
		getProperty();
		getMap();
	}, [mapLatitude, mapLongitude]);

	// get url from propValue photos and update the link from small to large image size url
	const url = Object.values(propValue.photos).map((e) => {
		const href = e.href.split('.jpg');
		return href.join('') + 'od.jpg';
	});

	// destructure propValue object
	const { rdc_web_url, address, community } = propValue;

	return (
		//body
		<Layout>
			<div className='container mx-auto h-max p-4 border-black'>
				{/*top container*/}
				<div className='flex justify-center mt-2'>
					<div className='grid lg:grid-cols-2 justify-items-center gap-2 w-full lg:w-auto'>
						{/*Image container*/}

						{/*Image holder*/}
						<Image
							loader={() => url[0]}
							unoptimized={true}
							width={200}
							height={150}
							alt='Property View'
							src={url[0] ? url[10] : '/images/placeholder.jpeg'}
							className='bg-gray-50 w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
						/>

						{/*Name, Price, Location and Specs*/}
						<section className='flex flex-col justify-between w-full h-full'>
							<div>
								<h1 className='font-bold text-4xl playfair'>
									{community
										? `$ ${community.price_max}`
										: 'Contact for Price'}
								</h1>
								<div className='text-xl'>
									<p>
										{address.line}, {address.city},{' '}
										{address.state_code}
									</p>
								</div>
								<div className='text-sm mt-4'>
									<span>
										{community ? community.beds_min : '?'} -{' '}
										{community ? community.beds_max : '?'}{' '}
										Beds
									</span>
									<br />
									<span>
										{community ? community.baths_min : '?'}{' '}
										-{' '}
										{community ? community.baths_max : '?'}{' '}
										baths
									</span>
									<br />
									<span>
										{community ? community.sqft_min : '?'} -{' '}
										{community ? community.sqft_max : '?'}{' '}
										Sqft
									</span>
								</div>
							</div>

							{/*Buttons container*/}
							<div className='flex flex-col mt-5 lg:mt-0 md:flex-row gap-4 w-full md:justify-start'>
								{/*Buttons*/}
								<a
									href={rdc_web_url}
									className='btn w-full md:w-56 lg:w-40 text-xs'
									target='_blank'
									rel='noreferrer'
								>
									{' '}
									More Info{' '}
								</a>
								<a
									href={
										community
											? `tel:+${community.contact_number}`
											: 'rentals/rental-item'
									}
									className='btn w-full md:w-56 lg:w-40 text-xs'
								>
									{community.contact_number
										? community.contact_number
										: 'Phone Not Available'}
								</a>
							</div>
						</section>
					</div>
				</div>{' '}
				{/*end of top part*/}
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
							loader={() => url}
							unoptimized={true}
							width={200}
							height={150}
							alt='Property View'
							src={url[1] ? url[1] : '/images/placeholder.jpeg'}
							className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
						/>

						<Image
							loader={() => url}
							unoptimized={true}
							width={200}
							height={150}
							alt='Property View'
							src={url[2] ? url[2] : '/images/placeholder.jpeg'}
							className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
						/>

						<Image
							loader={() => url}
							unoptimized={true}
							width={200}
							height={150}
							alt='Property View'
							src={url[3] ? url[3] : '/images/placeholder.jpeg'}
							className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
						/>

						<Image
							loader={() => url}
							unoptimized={true}
							width={200}
							height={150}
							alt='Property View'
							src={url[4] ? url[4] : '/images/placeholder.jpeg'}
							className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
						/>
					</div>
				</div>
				{/*end of gallery part*/}
				{/*Map container*/}
				<div className='mt-10 p-4'>
					{/*Map Header*/}
					<h1 className='p-1 font-bold text-xl text-center playfair border-b border-black w-56 mx-auto'>
						Near By Resturants
					</h1>
					<div className='mt-3 h-80 border-2 mx-auto'>
						<div ref={mapElement} className='map' />
					</div>
				</div>
				{/*end of map part*/}
			</div>
		</Layout>
	);
};

export default Index;
