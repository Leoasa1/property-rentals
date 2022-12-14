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
	const MAP_ELEMENT = useRef();
	const [mapLongitude, setMapLongitude] = useState(0);
	const [mapLatitude, setMapLatitude] = useState(0);

	// function to get the properties from local storage
	const GET_PROPERTY = async () => {
		// window is loaded get properties from local storage and turn string to json format
		const GET_PROP_ARRAY =
			(await typeof window) !== 'undefined'
				? JSON.parse(localStorage.getItem('properties'))
				: null;

		// use the selected id from local storage to get one property information using find method
		const GET_PROP = GET_PROP_ARRAY.find(
			(items) => items.property_id == localStorage.getItem('prop-ID')
		);

		// get lat and lon of the property andress and assign it to const variables
		setMapLatitude(Number(GET_PROP.address.lat));
		setMapLongitude(Number(GET_PROP.address.lon));

		// assign values from GET_PROP variable to propValue state object
		setPropValue({
			property_id: GET_PROP.property_id,
			rdc_web_url: GET_PROP.rdc_web_url,
			address: GET_PROP.address,
			community: GET_PROP.community,
			photos: GET_PROP.photos,
			lead_forms: GET_PROP.lead_forms,
		});
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
	const { rdc_web_url, address, community } = propValue;

	return (
		//body
		<Layout>
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
							src={URL[0] ? URL[10] : '/images/placeholder.jpeg'}
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
				{/*end of gallery part*/}
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
				{/*end of map part*/}
			</div>
		</Layout>
	);
};

export default Index;
