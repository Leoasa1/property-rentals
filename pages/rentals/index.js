import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import Card from '../../components/Card';
import Autocomplete from 'react-google-autocomplete';
import Axios from 'axios'
import ScaleLoader from 'react-spinners/ScaleLoader';
import { GOOGLE_URL, RAPIDAPI_URL } from '../../components/Config';

const Index = () => {
	const [propData, setPropData] = useState([]);
	const [cityValue, setCityValue] = useState('');
	const [stateValue, setStateValue] = useState('');

	const [loading, setLoading] = useState(true);

	const ROUTER = useRouter();

	// const variable to get city from local storage
	const CITY =
		typeof window !== 'undefined' ? localStorage.getItem('city') : null;

	// const variable to get state from local storage
	const STATE =
		typeof window !== 'undefined' ? localStorage.getItem('state') : null;

	// const variable to get properties from local storage
	const PROPERTIES =
		typeof window !== 'undefined'
			? localStorage.getItem('properties')
			: null;

	// async function to make RAPID-API call to get list of property
	const GET_PROP = async () => {
		console.log(cityValue)
		console.log(stateValue)
		if (PROPERTIES !== 'null'){
			setPropData(JSON.parse(PROPERTIES))
			setLoading(false);
		} else {
			const options = {
				method: 'POST',
				url: 'https://realty-in-us.p.rapidapi.com/properties/v3/list',
				headers: {
					'content-type': 'application/json',
					'X-RapidAPI-Key': `${RAPIDAPI_URL}`,
					'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com'
				},
				data: {
					limit: 100,
					offset: 0,
					city: `${CITY}`,
					state_code: `${STATE}`,
					status: ['for_rent'],
					type: [
						'condos',
						'condo_townhome_rowhome_coop',
						'condo_townhome',
						'townhomes',
						'duplex_triplex',
						'single_family',
						'multi_family',
						'apartment',
						'condop',
						'coop'
					],
					sort: {
						direction: 'desc',
						field: 'list_date'
					}
				}
			};

			// axios call to rapid-api to store list of properties in local storage 'properties'
			try {
				const response = await Axios.request(options);
				localStorage.setItem('properties', JSON.stringify(response.data.data.home_search.results));
				setPropData(response.data.data.home_search.results);
				setLoading(false);
			} catch (error) {
				console.error(error);
			}
		}
	};

	console.log(propData)

	// useEffect function to push route to home page if city and state are null
	// else call function GET_PROP to get properties
	useEffect(() => {
		if (CITY === 'null' && STATE === 'null') {
			ROUTER.push('/');
		} else {
			GET_PROP();
			if (!propData && localStorage.getItem('properties') !== 'null')
				ROUTER.push('/');
		}
		if (localStorage.getItem('properties') !== 'null') setLoading(false);
	}, []);

	// async function to make a new search for different location
	const HANDLESUBMIT = async (e) => {
		e.preventDefault();
		setLoading(true);
		localStorage.setItem('city', cityValue);
		localStorage.setItem('state', stateValue);
		// const variable to set header properties for axios call
		const options = {
			method: 'POST',
			url: 'https://realty-in-us.p.rapidapi.com/properties/v3/list',
			headers: {
				'content-type': 'application/json',
				'X-RapidAPI-Key': `${RAPIDAPI_URL}`,
				'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com'
			},
			data: {
				limit: 100,
				offset: 0,
				city: `${cityValue}`,
				state_code: `${stateValue}`,
				status: ['for_rent'],
				type: [
					'condos',
					'condo_townhome_rowhome_coop',
					'condo_townhome',
					'townhomes',
					'duplex_triplex',
					'single_family',
					'multi_family',
					'apartment',
					'condop',
					'coop'
				],
				sort: {
					direction: 'desc',
					field: 'list_date'
				}
			}
		};

		// axios call to rapid-api to store list of properties in local storage 'properties'
		await Axios.request(options)
			.then((response) => {
				localStorage.setItem('properties', JSON.stringify(response.data.data.home_search.results));
				setPropData(response.data.data.home_search.results);
				setLoading(false);
			})
			.catch((error) => {
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
							onSubmit={HANDLESUBMIT}
						>
							<Autocomplete
								className='border w-full h-12 text-xl px-4'
								apiKey={`${GOOGLE_URL}`}
								onPlaceSelected={(place) => {
									if (place) {
										const GET_CITY =
											place.address_components.find(
												(element) => {
													const CONDITION =
														element.types.includes(
															'neighborhood'
														) ||
														element.types.includes(
															'locality'
														);
													return CONDITION;
												}
											);
										const GET_STATE =
											place.address_components.find(
												(element) =>
													element.types[0] ==
													'administrative_area_level_1'
											);
										setCityValue(GET_CITY.short_name);
										setStateValue(GET_STATE.short_name);
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
					
						<div className='grid lg:grid-cols-2 justify-items-center gap-y-14 xl:px-56 py-10 mt-10'>
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
