import Link from 'next/link';
import Autocomplete from 'react-google-autocomplete';

export default function Home() {
	return (
		<div className='min-h-screen bg-white'>
			<div className='flex flex-col lg:flex-row-reverse'>
				<div className='hidden lg:block'>
					<img
						className='h-screen w-auto'
						src='/images/pink-building.jpg'
					/>
				</div>
				<div className='px-10'>
					<nav className='h-20 pt-5 flex flex-row justify-between w-full'>
						<div className='playfair text-3xl'>Rentals</div>
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
						<div className='flex flex-col lg:flex-row gap-6'>
							<div className='w-full'>
								<Autocomplete
									className='border w-full h-12 lg:h-full text-xl px-4'
									apiKey={''}
									onPlaceSelected={(place) => {
										console.log(place);
									}}
								/>
							</div>
							<button className='btn w-full lg:w-40'>
								Search
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
