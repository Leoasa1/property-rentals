import React from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';

const about = () => {
	return (
		//body
		<Layout>
			<div className='flex flex-col justify-center h-max inter'>
				{/*Image Header*/}
				<div className=''>
					{/*Image container*/}
					<div className='relative'>
						{/*Image holder. Note: I dont have the image so I'll leave this blank for you :)*/}
						<Image
							className='h-96 w-screen object-cover'
							src={'/images/about.jpg'}
							width={900}
							height={500}
							alt='Background image of building'
						/>

						{/*Header*/}
						<div className='absolute inset-0 flex justify-center items-center z-10'>
							<h1 className='flex content-center font-bold text-white text-8xl playfair'>
								About
							</h1>
						</div>
					</div>
				</div>

				{/*Description*/}
				<div className='flex justify-center items-center w-11/12 sm:w-3/4 lg:w-3/5 xl:w-3/6 my-16 mx-auto'>
					<p className='text-justify text-lg'>
						This website is intended toward assisting students who
						are searching for a place to live during their time in
						school by locating rental homes and apartments that meet
						their needs. Students can obtain lists of available
						rental houses in a certain region by conducting a search
						of the city or university in interest. For students who
						are unable to commute a significant distance from the
						apartment location, it also displays a list of nearby
						restaurants that are close to the rental premises.
					</p>
				</div>

				{/*Framework and Libraries*/}
				<div className='w-auto flex flex-col justify-center items-center'>
					<h1 className='text-5xl font-bold mx-auto w-11/12 sm:w-3/4 lg:w-3/5 xl:w-3/6 playfair'>
						Framework and Libraries
					</h1>

					<p className='text-md py-10 w-11/12 sm:w-3/4 lg:w-3/5 xl:w-3/6'>
						<b>Next.js Framework </b>
						<br></br>
						We utilized useState and useEffect hooks to store values
						and retrieve those values based on user activity.
						<br></br>
						<b>
							Tailwind.css Framework <br></br>
							and DaisyUI library
						</b>
						<br></br>
						We used css libraries to design the layout of the
						website.
						<br></br>
						<b>RapidAPI</b>
						<br></br>
						We utilized axios to make the calls for rental
						properties around their area.
						<br></br>
						<b>GoogleAPI</b>
						<br></br>
						We utilitzed Google API to auto-complete address search,
						in order to get city and state information.
						<br></br>
						<b>TomTom API (SDK)</b>
						<br></br>
						We utilized the TomTom API To get nearby restaurants for
						students without cars, and display markers on the map.
					</p>
				</div>
			</div>
		</Layout>
	);
};
export default about;
