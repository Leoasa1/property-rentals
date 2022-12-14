import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Card = ({ property }) => {
	const ROUTER = useRouter();
	const [propID, setPropID] = useState('');
	let url;

	// on card click to store property id to local storage prop-ID
	const HANDLE_CLICK = (e) => {
		e.preventDefault();
		localStorage.setItem('prop-ID', propID);

		ROUTER.push('/rentals/rental-item');
	};

	// useEffect function to set propID on page load
	useEffect(() => {
		setPropID(property.property_id);
	}, []);

	// if property.photo[0] split url and join with "od.jpg"
	if (property.photos[0]) {
		url = property.photos[0].href.split('.jpg');
		url = url.join('') + 'od.jpg';
	} else {
		url = '';
	}

	return (
		<div
			className='card w-80 sm:w-96 bg-base-100 shadow-xl'
			onClick={HANDLE_CLICK}
		>
			<figure>
				<Image
					className='h-56 w-full'
					loader={() => url}
					unoptimized={true}
					src={url ? url : '/images/placeholder.jpeg'}
					alt='Picture of a building structure'
					width={200}
					height={150}
				/>
			</figure>
			<section className='card-body bg-card'>
				<h2 className='card-title'>
					{property.community !== undefined &&
					property.community.price_max !== null
						? `$ ${property.community.price_max}`
						: 'Contact for Price'}
					<div className='badge badge-primary'>
						{property.prop_type}
					</div>
				</h2>
				<p className='pb-4'>
					{property.address.line}, {property.address.city},{' '}
					{property.address.state_code}
				</p>
				<div className='card-actions justify-end'>
					<div className='badge badge-outline'>
						Beds{' '}
						{property.community !== undefined
							? property.community.beds_max
							: '?'}
					</div>
					<div className='badge badge-outline'>
						Baths{' '}
						{property.community !== undefined
							? property.community.baths_max
							: '?'}
					</div>
					<div className='badge badge-outline'>
						Sqft{' '}
						{property.community !== undefined
							? property.community.sqft_max
							: '?'}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Card;
