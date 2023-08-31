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
	if (property.primary_photo) {
		url = property.primary_photo.href.split('.jpg');
		url = url.join('') + 'od.jpg';
	} else {
		url = '';
	}

	return (
		<div
			className='card w-80 sm:w-96 bg-base-100 shadow-xl cursor-pointer'
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
					{property.list_price !== undefined &&
					property.list_price !== null
						? `$ ${property.list_price}`
						: 'Contact for Price'}
					<div className='badge badge-primary'>
						{property.description.type}
					</div>
				</h2>
				<p className='pb-4'>
					{property.location.address.line}, {property.location.address.city},{' '}
					{property.location.address.state_code}
				</p>
				<div className='card-actions justify-end'>
					<div className='badge badge-outline'>
						Beds{' '}
						{property.description.beds !== null
							? property.description.beds
							: property.description.beds_max}
					</div>
					<div className='badge badge-outline'>
						Baths{' '}
						{property.description !== null
							? property.description.baths
							:  property.description.baths_max}
					</div>
					<div className='badge badge-outline'>
						Sqft{' '}
						{property.description !== null
							? property.description.sqft
							: property.description.sqft_max}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Card;
