import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Autocomplete from 'react-google-autocomplete';
// import { useGlobalContext } from '../contexts/searchContext';
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
	const [cityValue, setCityValue] = useState('');
	const [stateValue, setStateValue] = useState('');
	const router = useRouter();

	// const { setCity, setState } = useGlobalContext();

	useEffect(() => {
		localStorage.setItem('city', null);
		localStorage.setItem('state', null);
		localStorage.setItem('properties', null);
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (cityValue) {
			localStorage.setItem('city', cityValue);
			localStorage.setItem('state', stateValue);
			router.push('/rentals');
		} else {
			toast.error('Valid Location Missing');
		}
	};

	return (
		<div className='flex justify-center item-center min-h-screen bg-white'>
			<ToastContainer theme='colored' position='top-center' />
			<div className='flex flex-col lg:flex-row-reverse'>
				<div className='hidden lg:block'>
					<img
						className='h-screen w-auto'
						src='/images/pink-building.jpg'
					/>
				</div>
				<div className='px-10'>
					<nav className='h-20 pt-5 flex flex-row justify-between w-full'>
						<Link href='/' className='playfair text-3xl'>
							Rentals
						</Link>
						<div className='flex flex-row lg:flex-col gap-4 lg:gap-2 text-end font-medium'>
							<Link href='/about'>About</Link>
							<a
								href='https://github.com/Leoasa1/property-rentals'
								target='_blank'
								rel='noreferrer'
							>
								Github
							</a>
						</div>
					</nav>
					<div className='h-[calc(100vh-(var(--navbar-header-height)))] flex flex-col justify-center'>
						<h1 className='text-5xl font-bold playfair'>
							Helping Students Get Their Perfect Rentals.{' '}
						</h1>
						<p className='py-6'>
							Search your university or city to find the perfect
							rental property to stay during the school year.
						</p>

						<form
							className='flex flex-col lg:flex-row gap-6'
							onSubmit={handleSubmit}
						>
							<div className='w-full'>
								<Autocomplete
									className='border w-full h-12 lg:h-full text-xl px-4'
									apiKey={`${process.env.NEXT_PUBLIC_GOOGLE}`}
									options={{
										types: ['geocode', 'establishment'],
										fields: [
											'address_components',
											'formatted_address',
										],
									}}
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
											console.log(typeof place);
											setCityValue(getCity.short_name);
											setStateValue(getState.short_name);
											console.log(place);
										}
									}}
								/>
							</div>
							<button
								className='btn w-full lg:w-40'
								type='submit'
							>
								Search
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
