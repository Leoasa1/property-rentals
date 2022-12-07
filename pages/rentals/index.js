import React, { useEffect, useState } from 'react';
import Layout from './../../components/layout/Layout';
import { useRouter } from 'next/router';
import Card from '../../components/card/Card';
import Autocomplete from 'react-google-autocomplete';
const axios = require('axios');
import ScaleLoader from 'react-spinners/ScaleLoader';

const Index = () => {
	const [propData, setPropData] = useState([]);
	const [cityValue, setCityValue] = useState('');
	const [stateValue, setStateValue] = useState('');

	let [loading, setLoading] = useState(true);

	const ROUTER = useRouter();

	const CITY =
		typeof window !== 'undefined' ? localStorage.getItem('city') : null;
	const STATE =
		typeof window !== 'undefined' ? localStorage.getItem('state') : null;
	const PROPERTIES =
		typeof window !== 'undefined'
			? localStorage.getItem('properties')
			: null;

	const getProp = async () => {
		if (PROPERTIES !== 'null') {
			setPropData(JSON.parse(PROPERTIES));
		} else {
			const options = {
				method: 'GET',
				url: 'https://realty-in-us.p.rapidapi.com/properties/v2/list-for-rent',
				params: {
					city: `${CITY}`,
					state_code: `${STATE}`,
					limit: '40',
					offset: '0',
					sort: 'relevance',
				},
				headers: {
					'X-RapidAPI-Key':
						'0fe077be1emshd40962bc735f0ccp1ca7dcjsnc61b720bed51',
					'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com',
				},
			};
			await axios
				.request(options)
				.then(function (response) {
					localStorage.setItem(
						'properties',
						JSON.stringify(response.data.properties)
					);
					setPropData(response.data.properties);
					setLoading(false);
					console.log(response.data.properties);
				})
				.catch(function (error) {
					console.error(error);
				});
		}
	};

	useEffect(() => {
		// console.log(JSON.parse(localStorage.getItem('city') || '{}'));
		if (CITY === 'null' && STATE === 'null') {
			ROUTER.push('/');
		} else {
			getProp();
			if (!propData && localStorage.getItem('properties') !== 'null')
				ROUTER.push('/');
		}
		if (localStorage.getItem('properties') !== 'null') setLoading(false);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		localStorage.setItem('city', cityValue);
		localStorage.setItem('state', stateValue);
		const options = {
			method: 'GET',
			url: 'https://realty-in-us.p.rapidapi.com/properties/v2/list-for-rent',
			params: {
				city: `${cityValue}`,
				state_code: `${stateValue}`,
				limit: '40',
				offset: '0',
				sort: 'relevance',
			},
			headers: {
				'X-RapidAPI-Key':
					'0fe077be1emshd40962bc735f0ccp1ca7dcjsnc61b720bed51',
				'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com',
			},
		};
		await axios
			.request(options)
			.then(function (response) {
				localStorage.setItem(
					'properties',
					JSON.stringify(response.data.properties)
				);
				setPropData(response.data.properties);
				setLoading(false);
				console.log(response.data.properties);
			})
			.catch(function (error) {
				console.error(error);
			});
	};

	if (propData) {
		return (
			<Layout>
				<div className='container mx-auto flex flex-col justify-center'>
					<div className='w-80 md:w-96 xl:w-4/12 mx-auto mt-10 text-center'>
						<h1 className='mb-5 text-4xl playfair'>
							Rental Properties
						</h1>
						<form
							className='flex flex-col gap-5'
							onSubmit={handleSubmit}
						>
							<Autocomplete
								className='border w-full h-12 text-xl px-4'
								apiKey={
									'AIzaSyBOLRScMEk0x2QOk3LAucD3Bylv5Rjh8RY'
								}
								onPlaceSelected={(place) => {
									if (place) {
										const getCity =
											place.address_components.find(
												(element) => {
													const condition =
														element.types.includes(
															'neighborhood'
														) ||
														element.types.includes(
															'locality'
														);
													return condition;
												}
											);
										const getState =
											place.address_components.find(
												(element) =>
													element.types[0] ==
													'administrative_area_level_1'
											);
										setCityValue(getCity.short_name);
										setStateValue(getState.short_name);
										console.log(place);
									}
								}}
								defaultValue={CITY}
								options={{
									types: ['geocode', 'establishment'],
								}}
							/>
							<button
								className='btn btn-neutral w-full'
								type='submit'
							>
								Search
							</button>
						</form>
					</div>
					{loading ? (
						<ScaleLoader
							className='mx-auto mt-40'
							color='#000000'
							loading={loading}
							size={80}
							aria-label='Loading Spinner'
							data-testid='loader'
						/>
					) : (
						<div className='grid lg:grid-cols-2 justify-items-center gap-y-14 px-20 xl:px-56 py-10 mt-10'>
							{propData.map((prop, i) => (
								<Card key={i} property={prop} />
							))}
						</div>
					)}
				</div>
			</Layout>
		);
	}
};

export default Index;
