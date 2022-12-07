import React from 'react';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Layout from '../../../components/layout/Layout';

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

	const getProperty = async () => {
		const getPropArray =
			typeof window !== 'undefined'
				? JSON.parse(localStorage.getItem('properties'))
				: null;

		const getProp = await getPropArray.find(
			(items) => items.property_id == localStorage.getItem('prop-ID')
		);
		setMapLatitude(Number(getProp.address.lat));
		setMapLongitude(Number(getProp.address.lon));

		setPropValue({
			property_id: getProp.property_id,
			rdc_web_url: getProp.rdc_web_url,
			address: getProp.address,
			community: getProp.community,
			photos: getProp.photos,
			lead_forms: getProp.lead_forms,
		});
	};

	const getMap = async () => {
		if (mapLatitude !== 0 && typeof window !== 'undefined') {
			const tt = await import('@tomtom-international/web-sdk-maps');
			const map = tt.map({
				key: 'rAZbzAgN8mOZPoGiQrNeEWiu0E6Nhqxl',
				container: mapElement.current,
				center: [mapLongitude, mapLatitude],
				zoom: '15',
			});
			const gett = async () => {
				const ttt = await import(
					'@tomtom-international/web-sdk-services'
				);
				const response = await ttt.services
					.fuzzySearch({
						key: 'rAZbzAgN8mOZPoGiQrNeEWiu0E6Nhqxl',
						query: 'resturant',
						center: [mapLongitude, mapLatitude],
						radius: '8800',
					})
					.then();

				return response.results.forEach((result) => {
					const popup = new tt.Popup({ offset: 30 }).setText(
						result.poi.name
					);
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

	useEffect(() => {
		getProperty();
		getMap();
	}, [mapLatitude, mapLongitude]);

	const url = Object.values(propValue.photos).map((e) => {
		const href = e.href.split('.jpg');
		return href.join('') + 'od.jpg';
	});

	const { rdc_web_url, address, community } = propValue;

	return (
		//body
		<Layout>
			<div className='container mx-auto h-max p-4'>
				{/*top container*/}
				<div className='flex justify-center m-2.5 '>
					<div className='flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-14'>
						{/*Image container*/}

						{/*Image holder*/}
						<Image
							loader={() => url[0]}
							width={200}
							height={150}
							alt='Property View'
							src={url[0] ? url[0] : '/images/placeholder.jpeg'}
							className='bg-gray-50 w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
						/>

						{/*Name, Price, Location and Specs*/}
						<section className='flex flex-col justify-between w-full h-full '>
							<div className=''>
								<h1 className='font-bold text-4xl playfair'>
									{community.price_max
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
										{propValue.community.beds_min} -{' '}
										{propValue.community.beds_max} Beds
									</span>
									<br />
									<span>
										{propValue.community.baths_min} -{' '}
										{propValue.community.baths_max} baths
									</span>
									<br />
									<span>
										{propValue.community.sqft_min} -{' '}
										{propValue.community.sqft_max} Sqft
									</span>
								</div>
							</div>

							{/*Buttons container*/}
							<div className='flex flex-col md:flex-row gap-4 w-full '>
								{/*Buttons*/}
								<a
									href={rdc_web_url}
									className='btn w-full md:w-40 text-xs'
									target='_blank'
									rel='noreferrer'
								>
									{' '}
									More Info{' '}
								</a>
								<a
									href={`tel:+${propValue.community.contact_number}`}
									className='btn w-full md:w-40 text-xs'
								>
									{propValue.community.contact_number
										? propValue.community.contact_number
										: 'Phone Not Available'}
								</a>
							</div>
						</section>
					</div>
				</div>{' '}
				{/*end of top part*/}
				{/*Gallery container*/}
				<div className='m-2.5 mt-10'>
					{/*Gallery Header*/}
					<h1 className='p-1 font-bold text-xl text-center playfair border-b border-black w-56 mx-auto'>
						Gallery
					</h1>

					{/*Gallery Part. set up block's w and h*/}
					<div className='grid lg:grid-cols-2 gap-2 mx-auto my-2.5 w-full lg:w-max'>
						{/*Gallery Image Place Holders*/}
						<Image
							loader={() => url[1]}
							width={200}
							height={150}
							alt='Property View'
							src={url[1] ? url[1] : '/images/placeholder.jpeg'}
							className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
						/>

						<Image
							loader={() => url[2]}
							width={200}
							height={150}
							alt='Property View'
							src={url[2] ? url[2] : '/images/placeholder.jpeg'}
							className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
						/>

						<Image
							loader={() => url[3]}
							width={200}
							height={150}
							alt='Property View'
							src={url[3] ? url[3] : '/images/placeholder.jpeg'}
							className='w-full lg:w-96 h-auto lg:h-64 flex items-center justify-center'
						/>

						<Image
							loader={() => url[4]}
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
				<div className='mt-10'>
					{/*Map Header*/}
					<h1 className='p-1 font-bold text-xl text-center playfair border-b border-black w-56 mx-auto'>
						Near By Resturants
					</h1>
					<div className='mt-3'>
						<div xs='8'>
							<div ref={mapElement} className='mapDiv' />
						</div>
					</div>
				</div>
				{/*end of map part*/}
			</div>
		</Layout>
	);
};

export default Index;
